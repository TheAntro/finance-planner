package com.example.finance_planner;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
class FinancePlannerApplicationTests {

	@Test
	void contextLoads() {
	}

}
