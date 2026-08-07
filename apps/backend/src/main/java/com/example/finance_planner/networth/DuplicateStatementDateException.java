package com.example.finance_planner.networth;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class DuplicateStatementDateException extends ResponseStatusException {
  DuplicateStatementDateException(LocalDate statementDate) {
    super(HttpStatus.CONFLICT, "Statement for the given date already exists: " + statementDate);
  }
}
