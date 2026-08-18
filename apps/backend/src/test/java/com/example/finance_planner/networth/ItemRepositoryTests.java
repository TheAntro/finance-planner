package com.example.finance_planner.networth;

import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import com.example.finance_planner.TestcontainersConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.UUID;
import com.example.finance_planner.identity.TestUsers;
import java.util.List;

@DataJpaTest
@Import(TestcontainersConfiguration.class)
class ItemRepositoryTests {
  @Autowired
  private ItemRepository items;

  @Autowired
  private TestEntityManager entityManager;

  @Test
  void existsByNameIgnoreCaseAndUserId() {
    UUID userId = TestUsers.create(entityManager, "user-a");
    entityManager.persist(new Item("Savings", ItemType.ASSET, userId));
    entityManager.flush();

    assertThat(items.existsByNameIgnoreCaseAndUserId("savings", userId)).isTrue();
  }

  @Test
  void doesNotSeeAnotherUsersItem() {
    UUID userA = TestUsers.create(entityManager, "user-a");
    UUID userB = TestUsers.create(entityManager, "user-b");
    entityManager.persist(new Item("Savings", ItemType.ASSET, userA));
    entityManager.flush();

    assertThat(items.existsByNameIgnoreCaseAndUserId("savings", userA)).isTrue();
    assertThat(items.existsByNameIgnoreCaseAndUserId("savings", userB)).isFalse();
    assertThat(items.findAllByUserIdOrderByName(userB)).isEmpty();
  }

  @Test
  void findAllByIdAndUserIdExcludesOtherUsersItems() {
    UUID userA = TestUsers.create(entityManager, "user-a");
    UUID userB = TestUsers.create(entityManager, "user-b");
    Item itemA = entityManager.persist(new Item("Savings", ItemType.ASSET, userA));
    Item itemB = entityManager.persist(new Item("Savings", ItemType.ASSET, userB));
    entityManager.flush();

    assertThat(items.findAllByIdInAndUserId(List.of(itemA.getId(), itemB.getId()), userA))
        .extracting(Item::getId)
        .containsExactly(itemA.getId());
  }
}
