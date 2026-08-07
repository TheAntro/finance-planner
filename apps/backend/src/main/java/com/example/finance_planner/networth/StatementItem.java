package com.example.finance_planner.networth;

import java.util.UUID;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.FetchType;

@Entity
@Table(name = "statement_items", uniqueConstraints = @UniqueConstraint(name = "uk_statement_items_statement_item", columnNames = {
    "statement_id", "item_id"
}))
class StatementItem {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "statement_id", nullable = false)
  private Statement statement;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "item_id", nullable = false)
  private Item item;

  @Column(name = "amount_cents", nullable = false)
  private long amountCents;

  protected StatementItem() {
  }

  StatementItem(Statement statement, Item item, long amountCents) {
    this.statement = statement;
    this.item = item;
    this.amountCents = amountCents;
  }
}
