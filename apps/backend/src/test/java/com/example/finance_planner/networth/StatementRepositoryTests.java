package com.example.finance_planner.networth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import com.example.finance_planner.TestcontainersConfiguration;
import com.example.finance_planner.identity.TestUsers;

import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import java.time.LocalDate;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.UUID;

@DataJpaTest
@Import(TestcontainersConfiguration.class)
class StatementRepositoryTests {

  @Autowired
  private StatementRepository statements;

  @Autowired
  private TestEntityManager entityManager;

  private UUID userId;

  @BeforeEach
  void setUp() {
    userId = TestUsers.create(entityManager, "user-a");
  }

  private Item item(String name, ItemType type) {
    return entityManager.persist(new Item(name, type, userId));
  }

  private Statement statement(LocalDate date) {
    return entityManager.persist(new Statement(date, userId));
  }

  @Nested
  class FindAllWithTotals {
    @Test
    void sumsAmountsByItemType() {
      Item savings = item("Savings", ItemType.ASSET);
      Item brokerage = item("Checking", ItemType.ASSET);
      Item creditCards = item("Credit Cards", ItemType.LIABILITY);
      Item studentLoans = item("Student Loans", ItemType.LIABILITY);
      Statement statement = statement(LocalDate.of(2026, 1, 1));
      entityManager.persist(new StatementItem(statement, savings, 200L));
      entityManager.persist(new StatementItem(statement, brokerage, 300L));
      entityManager.persist(new StatementItem(statement, creditCards, 400L));
      entityManager.persist(new StatementItem(statement, studentLoans, 500L));
      entityManager.flush();

      assertThat(statements.findAllWithTotalsByUserId(userId)).singleElement().satisfies(response -> {
        assertThat(response.totalAssetsCents()).isEqualTo((500L));
        assertThat(response.totalLiabilitiesCents()).isEqualTo((900L));
      });
    }

    @Test
    void includesStatementsWithoutItems() {
      statement(LocalDate.of(2026, 1, 1));
      entityManager.flush();
      assertThat(statements.findAllWithTotalsByUserId(userId)).singleElement().satisfies(response -> {
        assertThat(response.totalAssetsCents()).isEqualTo(0L);
        assertThat(response.totalLiabilitiesCents()).isEqualTo(0L);
      });
    }

    @Test
    void ordersByStatementDateDescending() {
      LocalDate date1 = LocalDate.of(2026, 1, 1);
      LocalDate date2 = LocalDate.of(2026, 2, 1);
      LocalDate date3 = LocalDate.of(2026, 3, 1);
      statement(date1);
      statement(date2);
      statement(date3);
      entityManager.flush();

      assertThat(statements.findAllWithTotalsByUserId(userId)).extracting(StatementResponse::statementDate)
          .containsExactly(
              date3,
              date2,
              date1);
    }

    @Test
    void excludesOtherUsersStatements() {
      UUID otherUser = TestUsers.create(entityManager, "user-b");
      entityManager.persist(new Statement(LocalDate.of(2026, 1, 1), otherUser));
      Statement mine = statement(LocalDate.of(2026, 2, 1));
      entityManager.flush();

      assertThat(statements.findAllWithTotalsByUserId(userId))
          .singleElement()
          .satisfies(r -> assertThat(r.id()).isEqualTo(mine.getId()));
    }
  }

  @Nested
  class FindWithTotalsById {
    @Test
    void sumsAmountsByItemType() {
      Item savings = item("Savings", ItemType.ASSET);
      Item brokerage = item("Checking", ItemType.ASSET);
      Item creditCards = item("Credit Cards", ItemType.LIABILITY);
      Item studentLoans = item("Student Loans", ItemType.LIABILITY);
      Statement statement = statement(LocalDate.of(2026, 1, 1));
      entityManager.persist(new StatementItem(statement, savings, 200L));
      entityManager.persist(new StatementItem(statement, brokerage, 300L));
      entityManager.persist(new StatementItem(statement, creditCards, 400L));
      entityManager.persist(new StatementItem(statement, studentLoans, 500L));
      entityManager.flush();

      assertThat(statements.findWithTotalsByIdAndUserId(statement.getId(), userId)).satisfies(response -> {
        assertThat(response.get().totalAssetsCents()).isEqualTo((500L));
        assertThat(response.get().totalLiabilitiesCents()).isEqualTo((900L));
      });
    }

    @Test
    void returnsEmtpyWhenStatementDoesNotExist() {
      assertThat(statements.findWithTotalsByIdAndUserId(new UUID(0, 0), userId)).isEmpty();
    }

    @Test
    void returnsEmtpyForAnotherUsersStatement() {
      UUID otherUser = TestUsers.create(entityManager, "user-b");
      Statement theirs = entityManager.persist(new Statement(LocalDate.of(2026, 1, 1), otherUser));
      entityManager.flush();

      assertThat(statements.findWithTotalsByIdAndUserId(theirs.getId(), userId)).isEmpty();
    }
  }
}
