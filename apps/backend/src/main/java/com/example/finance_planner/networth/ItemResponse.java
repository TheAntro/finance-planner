package com.example.finance_planner.networth;

import java.util.UUID;

record ItemResponse(
    UUID id,
    String name,
    ItemType type,
    boolean active) {
}
