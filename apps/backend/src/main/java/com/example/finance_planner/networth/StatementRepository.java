package com.example.finance_planner.networth;

import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

interface StatementRepository extends Repository<Statement, UUID> {
  boolean existsByStatementDateAndUserId(LocalDate statementDate, UUID userId);

  List<Statement> findAllByUserIdOrderByStatementDateDesc(UUID userId);

  Statement save(Statement statement);

  @Query("""
      select new com.example.finance_planner.networth.StatementResponse(
        s.id,
        s.statementDate,
        sum(case when i.type = ASSET then si.amountCents else 0L end),
        sum(case when i.type = LIABILITY then si.amountCents else 0L end))
      from Statement s
        left join StatementItem si on si.statement = s
        left join si.item i
      where s.id = :id and s.userId = :userId
      group by s.id, s.statementDate
      """)
  Optional<StatementResponse> findWithTotalsByIdAndUserId(UUID id, UUID userId);

  @Query("""
      select new com.example.finance_planner.networth.StatementResponse(
        s.id,
        s.statementDate,
        sum(case when i.type = ASSET then si.amountCents else 0L end),
        sum(case when i.type = LIABILITY then si.amountCents else 0L end))
      from Statement s
        left join StatementItem si on si.statement = s
        left join si.item i
      where s.userId = :userId
      group by s.id, s.statementDate
      order by s.statementDate desc
      """)
  List<StatementResponse> findAllWithTotalsByUserId(UUID userId);
}
