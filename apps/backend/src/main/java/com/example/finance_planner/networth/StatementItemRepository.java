package com.example.finance_planner.networth;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

interface StatementItemRepository extends JpaRepository<StatementItem, UUID> {
}
