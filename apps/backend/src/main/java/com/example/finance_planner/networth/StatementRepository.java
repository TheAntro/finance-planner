package com.example.finance_planner.networth;

import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

interface StatementRepository extends JpaRepository<Statement, UUID> {
  boolean existsByStatementDate(LocalDate statementDate);

  @Query("""
      select new com.example.finance_planner.networth.StatementResponse(
        s.id,
        s.statementDate,
        sum(case when i.type = ASSET then si.amountCents else 0L end),
        sum(case when i.type = LIABILITY then si.amountCents else 0L end))
      from Statement s
        left join StatementItem si on si.statement = s
        left join si.item i
      where s.id = :id
      group by s.id, s.statementDate
      """)
  Optional<StatementResponse> findWithTotalsById(UUID id);

  @Query("""
      select new com.example.finance_planner.networth.StatementResponse(
        s.id,
        s.statementDate,
        sum(case when i.type = ASSET then si.amountCents else 0L end),
        sum(case when i.type = LIABILITY then si.amountCents else 0L end))
      from Statement s
        left join StatementItem si on si.statement = s
        left join si.item i
      group by s.id, s.statementDate
      order by s.statementDate desc
      """)
  List<StatementResponse> findAllWithTotals();
}
