package com.example.finance_planner.networth;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import java.util.UUID;
import java.time.LocalDate;

@Entity
@Table(name = "statements")
class Statement {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  // There is a unique constraint for statement date per user in the database.
  @Column(nullable = false)
  private LocalDate statementDate;

  @Column(nullable = false, updatable = false)
  private UUID userId;

  protected Statement() {
  }

  Statement(LocalDate statementDate, UUID userId) {
    this.statementDate = statementDate;
    this.userId = userId;
  }

  UUID getId() {
    return this.id;
  }

  LocalDate getStatementDate() {
    return this.statementDate;
  }
}
