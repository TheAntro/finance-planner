package com.example.finance_planner.networth;

import java.util.UUID;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.junit.jupiter.api.Test;
import com.example.finance_planner.config.SecurityConfig;

import tools.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import com.example.finance_planner.identity.CurrentUser;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

import java.time.LocalDate;

@WebMvcTest(StatementController.class)
@Import(SecurityConfig.class)
class StatementControllerTests {

  @Autowired
  private MockMvcTester mvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockitoBean
  private StatementService statementService;

  @MockitoBean
  private JwtDecoder jwtDecoder;

  @MockitoBean
  private CurrentUser currentUser;

  @Test
  void blocksRequestsWithoutJwt() {
    assertThat(mvc.post()
        .uri("/api/v1/statements"))
        .hasStatus(HttpStatus.UNAUTHORIZED);
  }

  @Test
  void createWithDuplicateItemsRejects() {
    UUID itemId = UUID.randomUUID();

    assertThat(mvc.post().uri("/api/v1/statements")
        .with(jwt())
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(new CreateStatementRequest(
            LocalDate.now(),
            List.of(
                new CreateStatementRequest.Line(itemId, 100L),
                new CreateStatementRequest.Line(itemId, 200L))))))
        .hasStatus(HttpStatus.BAD_REQUEST)
        .bodyJson()
        .extractingPath("$.errors.statementItems").asArray().isNotEmpty();
    verifyNoInteractions(statementService);
  }
}
