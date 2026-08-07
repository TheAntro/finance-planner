package com.example.finance_planner.networth;

import org.springframework.web.server.ResponseStatusException;
import java.util.UUID;
import org.springframework.http.HttpStatus;

class StatementNotFoundException extends ResponseStatusException {
  StatementNotFoundException(UUID id) {
    super(HttpStatus.NOT_FOUND, "Statement not found with id: " + id);
  }
}
