package com.example.finance_planner.networth;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;

import java.time.LocalDate;
import java.util.List;

@Component
@Profile("dev")
class NetWorthDataSeeder implements ApplicationRunner {

  private final ItemRepository items;
  private final StatementRepository statements;
  private final StatementItemRepository statementItems;

  NetWorthDataSeeder(ItemRepository items, StatementRepository statements,
      StatementItemRepository statementItems) {
    this.items = items;
    this.statements = statements;
    this.statementItems = statementItems;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) throws Exception {
    if (items.count() > 0 || statements.count() > 0)
      return;

    Item savings = items.save(new Item("Savings Account", ItemType.ASSET));
    Item checking = items.save(new Item("Checking Account", ItemType.ASSET));
    Item brokerage = items.save(new Item("Brokerage Account", ItemType.ASSET));
    Item home = items.save(new Item("Home", ItemType.ASSET));
    Item car = items.save(new Item("Volkswagen Golf", ItemType.ASSET));

    Item mortgage = items.save(new Item("Mortgage", ItemType.LIABILITY));
    Item creditCards = items.save(new Item("Credit Cards", ItemType.LIABILITY));

    Statement statement = statements.save(new Statement(LocalDate.now()));
    statementItems.saveAll(List.of(
        new StatementItem(statement, savings, 2000L * 100),
        new StatementItem(statement, checking, 1000L * 100),
        new StatementItem(statement, brokerage, 4000L * 100),
        new StatementItem(statement, home, 200000L * 100),
        new StatementItem(statement, car, 10000L * 100),
        new StatementItem(statement, mortgage, 150000L * 100),
        new StatementItem(statement, creditCards, 1000L * 100)));
  }
}
