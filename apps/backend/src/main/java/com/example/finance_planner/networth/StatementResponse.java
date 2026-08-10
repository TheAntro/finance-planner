package com.example.finance_planner.networth;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

record StatementResponse(
        @NotNull UUID id,
        @NotNull LocalDate statementDate,
        @NotNull long totalAssetsCents,
        @NotNull long totalLiabilitiesCents) {
}
