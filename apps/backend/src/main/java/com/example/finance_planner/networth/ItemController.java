package com.example.finance_planner.networth;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.List;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.finance_planner.identity.CurrentUser;

@RestController
@RequestMapping("/api/v1/items")
class ItemController {

  private final ItemService itemService;
  private final CurrentUser currentUser;

  ItemController(ItemService itemService, CurrentUser currentUser) {
    this.itemService = itemService;
    this.currentUser = currentUser;
  }

  @GetMapping
  List<ItemResponse> getItems() {
    return itemService.getAll(currentUser.id());
  }

  @PostMapping
  ResponseEntity<ItemResponse> createItem(
      @Valid @RequestBody CreateItemRequest request,
      UriComponentsBuilder uriBuilder) {
    ItemResponse itemResponse = itemService.create(request, currentUser.id());
    URI location = uriBuilder.path("/api/v1/items/{id}").buildAndExpand(itemResponse.id()).toUri();
    return ResponseEntity.created(location).body(itemResponse);
  }

  @GetMapping("/{id}")
  ItemResponse getItem(@PathVariable UUID id) {
    return itemService.get(id, currentUser.id());
  }
}
