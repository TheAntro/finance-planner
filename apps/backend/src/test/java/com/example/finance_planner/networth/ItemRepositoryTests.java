package com.example.finance_planner.networth;

import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import com.example.finance_planner.TestcontainersConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(TestcontainersConfiguration.class)
class ItemRepositoryTests {
  @Autowired
  private ItemRepository items;

  @Autowired
  private TestEntityManager entityManager;

  @Test
  void existsByNameIgnoreCase() {
    entityManager.persist(new Item("Savings", ItemType.ASSET));
    entityManager.flush();

    assertThat(items.existsByNameIgnoreCase("savings")).isTrue();
  }
}
