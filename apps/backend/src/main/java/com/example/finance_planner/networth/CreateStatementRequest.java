package com.example.finance_planner.networth;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;

@UniqueItemIds
record CreateStatementRequest(
    @NotNull LocalDate statementDate,
    @NotEmpty List<@Valid Line> statementItems) {
  record Line(@NotNull UUID itemId, @NotNull Long amountCents) {
  }
}
