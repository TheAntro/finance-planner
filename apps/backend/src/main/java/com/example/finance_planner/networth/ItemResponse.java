package com.example.finance_planner.networth;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

record ItemResponse(
        @NotNull UUID id,
        @NotNull String name,
        @NotNull ItemType type,
        @NotNull boolean active) {
}
