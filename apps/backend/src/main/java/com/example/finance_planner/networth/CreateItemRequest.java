package com.example.finance_planner.networth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

record CreateItemRequest(
    @NotBlank @Size(max = Item.NAME_MAX_LENGTH) String name,
    @NotNull ItemType type) {

  CreateItemRequest {
    name = name == null ? null : name.strip().replaceAll("\\s+", " ");
  }
}
