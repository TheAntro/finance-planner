package com.example.finance_planner.networth;

import java.util.UUID;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

class ItemNotFoundException extends ResponseStatusException {
  ItemNotFoundException(UUID id) {
    super(HttpStatus.NOT_FOUND, "Item not found with id: " + id);
  }
}
