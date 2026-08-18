package com.example.finance_planner.networth;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class ItemService {

  private final ItemRepository itemRepository;

  ItemService(ItemRepository itemRepository) {
    this.itemRepository = itemRepository;
  }

  @Transactional(readOnly = true)
  ItemResponse get(UUID id, UUID userId) {
    return itemRepository.findByIdAndUserId(id, userId)
        .map(this::toResponse)
        .orElseThrow(() -> new ItemNotFoundException(id));
  }

  @Transactional(readOnly = true)
  List<ItemResponse> getAll(UUID userId) {
    return itemRepository
        .findAllByUserIdOrderByName(userId)
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  ItemResponse create(CreateItemRequest request, UUID userId) {
    if (itemRepository.existsByNameIgnoreCaseAndUserId(request.name(), userId)) {
      throw new DuplicateItemNameException(request.name());
    }

    Item item = itemRepository.save(
        new Item(request.name(),
            request.type(),
            userId));
    return toResponse(item);
  }

  private ItemResponse toResponse(Item item) {
    return new ItemResponse(
        item.getId(),
        item.getName(),
        item.getType(),
        item.isActive());
  }

}
