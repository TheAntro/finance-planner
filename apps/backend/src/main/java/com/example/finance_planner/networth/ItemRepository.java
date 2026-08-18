package com.example.finance_planner.networth;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.Repository;

interface ItemRepository extends Repository<Item, UUID> {
  boolean existsByNameIgnoreCaseAndUserId(String name, UUID userId);

  List<Item> findAllByUserIdOrderByName(UUID userId);

  Optional<Item> findByIdAndUserId(UUID id, UUID userId);

  List<Item> findAllByIdInAndUserId(List<UUID> ids, UUID userId);

  Item save(Item item);
}
