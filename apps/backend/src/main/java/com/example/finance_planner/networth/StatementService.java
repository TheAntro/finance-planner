package com.example.finance_planner.networth;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.summingLong;
import java.util.function.Function;
import com.example.finance_planner.networth.CreateStatementRequest.Line;

@Service
class StatementService {
  private final StatementRepository statements;
  private final StatementItemRepository statementItems;
  private final ItemRepository items;

  StatementService(StatementRepository statements, StatementItemRepository statementItems, ItemRepository items) {
    this.statements = statements;
    this.statementItems = statementItems;
    this.items = items;
  }

  @Transactional(readOnly = true)
  StatementResponse get(UUID id) {
    return this.statements.findWithTotalsById(id).orElseThrow(() -> new StatementNotFoundException(id));
  }

  @Transactional(readOnly = true)
  List<StatementResponse> getAll() {
    return this.statements.findAllWithTotals();
  }

  @Transactional
  StatementResponse create(CreateStatementRequest statementRequest) {
    // Fast path check for a duplicate date.
    // Real guarantee for the unique statement date is in a database constraint.
    if (this.statements.existsByStatementDate(statementRequest.statementDate())) {
      throw new DuplicateStatementDateException(statementRequest.statementDate());
    }

    var lines = statementRequest.statementItems();
    var lineItemIds = lines.stream().map(Line::itemId).toList();

    Map<UUID, Item> itemMap = items.findAllById(lineItemIds).stream()
        .collect(toMap(Item::getId, Function.identity()));

    if (itemMap.size() != lineItemIds.size()) {
      throw new ItemsNotFoundForStatementException(
          lineItemIds.stream().filter(id -> !itemMap.containsKey(id)).toList());
    }

    Map<ItemType, Long> totals = lines.stream()
        .collect(groupingBy(
            line -> itemMap.get(line.itemId()).getType(),
            summingLong(Line::amountCents)));

    Statement statement = statements.save(new Statement(statementRequest.statementDate()));
    statementItems.saveAll(lines.stream()
        .map(line -> new StatementItem(statement, itemMap.get(line.itemId()), line.amountCents()))
        .toList());

    return new StatementResponse(statement.getId(), statement.getStatementDate(),
        totals.getOrDefault(ItemType.ASSET, 0L),
        totals.getOrDefault(ItemType.LIABILITY, 0L));
  }
}
