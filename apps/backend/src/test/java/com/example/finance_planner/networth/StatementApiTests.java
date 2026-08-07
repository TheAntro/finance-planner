package com.example.finance_planner.networth;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import java.time.LocalDate;
import java.util.List;
import com.example.finance_planner.TestcontainersConfiguration;

import java.util.UUID;
import tools.jackson.databind.ObjectMapper;

import org.springframework.transaction.annotation.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@Transactional
class StatementApiTests {

  @Autowired
  private MockMvcTester mvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void createThenGetReturnsSameTotals() {
    UUID assetId = createItem("Savings", ItemType.ASSET);
    UUID liabilityId = createItem("Credit Cards", ItemType.LIABILITY);

    var create = mvc.post().uri("/api/v1/statements")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(new CreateStatementRequest(
            LocalDate.now(),
            List.of(
                new CreateStatementRequest.Line(assetId, 100L),
                new CreateStatementRequest.Line(liabilityId, 500L)))))
        .exchange();

    assertThat(create)
        .hasStatus(HttpStatus.CREATED)
        .bodyJson()
        .extractingPath("$.totalAssetsCents")
        .asNumber()
        .satisfies(n -> assertThat(n.longValue()).isEqualTo(100L));
    assertThat(create)
        .bodyJson()
        .extractingPath("$.totalLiabilitiesCents")
        .asNumber()
        .satisfies(n -> assertThat(n.longValue()).isEqualTo(500L));

    String location = create.getResponse().getHeader("Location");
    assertThat(location).isNotBlank();

    var get = mvc.get().uri(location).exchange();

    assertThat(get)
        .hasStatus(HttpStatus.OK)
        .bodyJson()
        .extractingPath("$.totalAssetsCents")
        .asNumber()
        .satisfies(n -> assertThat(n.longValue()).isEqualTo(100L));
    assertThat(get)
        .bodyJson()
        .extractingPath("$.totalLiabilitiesCents")
        .asNumber()
        .satisfies(n -> assertThat(n.longValue()).isEqualTo(500L));
  }

  @Test
  void createRejectsDuplicateStatementDate() {
    UUID assetId = createItem("Savings", ItemType.ASSET);
    var body = objectMapper.writeValueAsString(new CreateStatementRequest(LocalDate.of(2026, 1, 1), List.of(
        new CreateStatementRequest.Line(assetId, 100L))));

    assertThat(mvc.post().uri("/api/v1/statements")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .hasStatus(HttpStatus.CREATED);

    assertThat(mvc.post().uri("/api/v1/statements")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .hasStatus(HttpStatus.CONFLICT);
  }

  @Test
  void createRejectsUnknownItemIds() {
    UUID unknownId = UUID.randomUUID();

    assertThat(mvc.post().uri("/api/v1/statements")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(new CreateStatementRequest(LocalDate.of(2026, 1, 1), List.of(
            new CreateStatementRequest.Line(unknownId, 100L))))))
        .hasStatus(HttpStatus.UNPROCESSABLE_CONTENT)
        .hasContentType(MediaType.APPLICATION_PROBLEM_JSON)
        .bodyJson()
        .extractingPath("$.itemIds").asArray().containsExactly(unknownId.toString());
  }

  private UUID createItem(String name, ItemType type) {
    var result = mvc.post().uri("/api/v1/items")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(new CreateItemRequest(name, type)))
        .exchange();

    assertThat(result).hasStatus(HttpStatus.CREATED);
    return UUID.fromString(
        result.getResponse().getHeader("Location").replaceAll(".*/", ""));
  }

}
