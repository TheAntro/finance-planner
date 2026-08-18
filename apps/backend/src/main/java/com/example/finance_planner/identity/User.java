package com.example.finance_planner.identity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
class User {
  static final int ISSUER_MAX_LENGTH = 255;
  static final int SUBJECT_MAX_LENGTH = 128;

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, length = ISSUER_MAX_LENGTH)
  private String issuer;

  @Column(nullable = false, length = SUBJECT_MAX_LENGTH)
  private String subject;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  protected User() {
  }

  User(String issuer, String subject) {
    this.issuer = issuer;
    this.subject = subject;
    this.createdAt = Instant.now();
  }

  UUID getId() {
    return this.id;
  }
}