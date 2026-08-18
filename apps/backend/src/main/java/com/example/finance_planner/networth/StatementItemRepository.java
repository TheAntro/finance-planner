package com.example.finance_planner.networth;

import org.springframework.data.repository.Repository;
import java.util.UUID;
import java.util.List;

interface StatementItemRepository extends Repository<StatementItem, UUID> {
  List<StatementItem> saveAll(Iterable<StatementItem> statementItems);
}
