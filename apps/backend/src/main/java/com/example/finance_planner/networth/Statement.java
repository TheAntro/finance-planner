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

  @Column(name = "statement_date", nullable = false, unique = true)
  private LocalDate statementDate;

  protected Statement() {
  }

  Statement(LocalDate statementDate) {
    this.statementDate = statementDate;
  }

  UUID getId() {
    return this.id;
  }

  LocalDate getStatementDate() {
    return this.statementDate;
  }
}
