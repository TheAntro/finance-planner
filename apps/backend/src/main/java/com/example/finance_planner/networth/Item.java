package com.example.finance_planner.networth;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Table;

@Entity
@Table(name = "items")
class Item {

  static final int NAME_MAX_LENGTH = 100;
  static final int TYPE_MAX_LENGTH = 20;

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  // Has a case-insensitive unique constraint per user on the database level
  @Column(nullable = false, length = NAME_MAX_LENGTH)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = TYPE_MAX_LENGTH)
  private ItemType type;

  @Column(name = "is_active", nullable = false)
  private boolean active;

  @Column(nullable = false, updatable = false)
  private UUID userId;

  protected Item() {
  }

  Item(String name, ItemType type, UUID userId) {
    this.name = name;
    this.type = type;
    this.userId = userId;
    this.active = true;
  }

  ItemType getType() {
    return this.type;
  }

  UUID getId() {
    return this.id;
  }

  String getName() {
    return this.name;
  }

  boolean isActive() {
    return this.active;
  }
}
