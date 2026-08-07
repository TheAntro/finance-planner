package com.example.finance_planner.networth;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import com.example.finance_planner.TestcontainersConfiguration;
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

  @Nested
  class FindAllWithTotals {
    @Test
    void sumsAmountsByItemType() {
      Item savings = entityManager.persist(new Item("Savings", ItemType.ASSET));
      Item brokerage = entityManager.persist(new Item("Checking", ItemType.ASSET));
      Item creditCards = entityManager.persist(new Item("Credit Cards", ItemType.LIABILITY));
      Item studentLoans = entityManager.persist(new Item("Student Loans", ItemType.LIABILITY));
      Statement statement = entityManager.persist(new Statement(LocalDate.of(2026, 1, 1)));
      entityManager.persist(new StatementItem(statement, savings, 200L));
      entityManager.persist(new StatementItem(statement, brokerage, 300L));
      entityManager.persist(new StatementItem(statement, creditCards, 400L));
      entityManager.persist(new StatementItem(statement, studentLoans, 500L));
      entityManager.flush();

      assertThat(statements.findAllWithTotals()).singleElement().satisfies(response -> {
        assertThat(response.totalAssetsCents()).isEqualTo((500L));
        assertThat(response.totalLiabilitiesCents()).isEqualTo((900L));
      });
    }

    @Test
    void includesStatementsWithoutItems() {
      entityManager.persist(new Statement(LocalDate.of(2026, 1, 1)));
      entityManager.flush();
      assertThat(statements.findAllWithTotals()).singleElement().satisfies(response -> {
        assertThat(response.totalAssetsCents()).isEqualTo(0L);
        assertThat(response.totalLiabilitiesCents()).isEqualTo(0L);
      });
    }

    @Test
    void ordersByStatementDateDescending() {
      LocalDate date1 = LocalDate.of(2026, 1, 1);
      LocalDate date2 = LocalDate.of(2026, 2, 1);
      LocalDate date3 = LocalDate.of(2026, 3, 1);
      entityManager.persist(new Statement(date1));
      entityManager.persist(new Statement(date2));
      entityManager.persist(new Statement(date3));
      entityManager.flush();

      assertThat(statements.findAllWithTotals()).extracting(StatementResponse::statementDate).containsExactly(
          date3,
          date2,
          date1);
    }
  }

  @Nested
  class FindWithTotalsById {
    @Test
    void sumsAmountsByItemType() {
      Item savings = entityManager.persist(new Item("Savings", ItemType.ASSET));
      Item brokerage = entityManager.persist(new Item("Checking", ItemType.ASSET));
      Item creditCards = entityManager.persist(new Item("Credit Cards", ItemType.LIABILITY));
      Item studentLoans = entityManager.persist(new Item("Student Loans", ItemType.LIABILITY));
      Statement statement = entityManager.persist(new Statement(LocalDate.of(2026, 1, 1)));
      entityManager.persist(new StatementItem(statement, savings, 200L));
      entityManager.persist(new StatementItem(statement, brokerage, 300L));
      entityManager.persist(new StatementItem(statement, creditCards, 400L));
      entityManager.persist(new StatementItem(statement, studentLoans, 500L));
      entityManager.flush();

      assertThat(statements.findWithTotalsById(statement.getId())).satisfies(response -> {
        assertThat(response.get().totalAssetsCents()).isEqualTo((500L));
        assertThat(response.get().totalLiabilitiesCents()).isEqualTo((900L));
      });
    }

    @Test
    void returnsEmtpyWhenStatementDoesNotExist() {
      assertThat(statements.findWithTotalsById(new UUID(0, 0))).isEmpty();
    }
  }
}
