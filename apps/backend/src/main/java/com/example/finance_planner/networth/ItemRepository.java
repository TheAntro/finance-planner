package com.example.finance_planner.networth;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface ItemRepository extends JpaRepository<Item, UUID> {
  boolean existsByNameIgnoreCase(String name);
}
