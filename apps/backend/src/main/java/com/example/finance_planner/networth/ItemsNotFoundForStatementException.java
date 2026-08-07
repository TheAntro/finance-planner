package com.example.finance_planner.networth;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class ItemsNotFoundForStatementException extends ResponseStatusException {
  ItemsNotFoundForStatementException(List<UUID> itemIds) {
    super(HttpStatus.UNPROCESSABLE_CONTENT, "Some referenced items do not exist");
    getBody().setProperty("itemIds", itemIds);
  }
}
