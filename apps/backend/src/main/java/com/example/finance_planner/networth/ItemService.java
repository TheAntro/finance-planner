package com.example.finance_planner.networth;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;

@Service
class ItemService {

  private final ItemRepository itemRepository;

  ItemService(ItemRepository itemRepository) {
    this.itemRepository = itemRepository;
  }

  @Transactional(readOnly = true)
  ItemResponse get(UUID id) {
    return itemRepository.findById(id)
        .map(this::toResponse)
        .orElseThrow(() -> new ItemNotFoundException(id));
  }

  @Transactional(readOnly = true)
  List<ItemResponse> getAll() {
    return itemRepository
        .findAll(Sort.by("name"))
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  ItemResponse create(CreateItemRequest request) {
    if (itemRepository.existsByNameIgnoreCase(request.name())) {
      throw new DuplicateItemNameException(request.name());
    }

    Item item = itemRepository.save(new Item(request.name(), request.type()));
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
