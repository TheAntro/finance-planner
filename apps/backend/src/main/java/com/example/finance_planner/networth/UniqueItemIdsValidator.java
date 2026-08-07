package com.example.finance_planner.networth;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.Set;

class UniqueItemIdsValidator implements ConstraintValidator<UniqueItemIds, CreateStatementRequest> {

  @Override
  public boolean isValid(CreateStatementRequest request, ConstraintValidatorContext context) {
    if (request == null || request.statementItems() == null) {
      return true;
    }

    List<UUID> itemIds = request.statementItems().stream()
        .map(CreateStatementRequest.Line::itemId)
        .filter(Objects::nonNull)
        .toList();

    if (itemIds.size() == Set.copyOf(itemIds).size()) {
      return true;
    }

    context.disableDefaultConstraintViolation();
    context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
        .addPropertyNode("statementItems")
        .addConstraintViolation();

    return false;
  }
}
