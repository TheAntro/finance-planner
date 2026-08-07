package com.example.finance_planner.networth;

import java.time.LocalDate;
import java.util.UUID;

record StatementResponse(
    UUID id,
    LocalDate statementDate,
    long totalAssetsCents,
    long totalLiabilitiesCents) {
}
