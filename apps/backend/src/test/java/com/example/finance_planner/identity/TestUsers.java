package com.example.finance_planner.identity;

import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import java.util.UUID;

public final class TestUsers {
  private TestUsers() {
  }

  public static final UUID create(TestEntityManager entityManager, String subject) {
    return entityManager.persistAndGetId(new User("https://test.issuer", subject), UUID.class);
  }
}
