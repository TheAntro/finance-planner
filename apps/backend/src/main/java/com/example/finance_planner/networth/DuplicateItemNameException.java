package com.example.finance_planner.networth;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

class DuplicateItemNameException extends ResponseStatusException {
  DuplicateItemNameException(String name) {
    super(HttpStatus.CONFLICT, "Item with name " + name + " already exists");
  }
}
