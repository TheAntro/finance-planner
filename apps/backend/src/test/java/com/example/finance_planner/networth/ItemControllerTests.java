package com.example.finance_planner.networth;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import com.example.finance_planner.config.SecurityConfig;
import java.util.UUID;
import tools.jackson.databind.ObjectMapper;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import com.example.finance_planner.identity.CurrentUser;

@WebMvcTest(ItemController.class)
@Import(SecurityConfig.class)
class ItemControllerTests {

  @Autowired
  private MockMvcTester mvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockitoBean
  private ItemService itemService;

  @MockitoBean
  private JwtDecoder jwtDecoder;

  @MockitoBean
  private CurrentUser currentUser;

  @Test
  void blocksRequestsWithoutJwt() {
    assertThat(mvc.get().uri("/api/v1/items")).hasStatus(HttpStatus.UNAUTHORIZED);
  }

  @Test
  void createItemReturnsCreatedWithLocationHeader() {
    UUID id = UUID.randomUUID();
    given(itemService.create(any(), any())).willReturn(new ItemResponse(id, "Savings", ItemType.ASSET, true));

    assertThat(mvc.post().uri("/api/v1/items")
        .with(jwt())
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(new CreateItemRequest("Savings", ItemType.ASSET))))
        .hasStatus(HttpStatus.CREATED)
        .headers()
        .hasHeaderSatisfying("Location", values -> assertThat(values.getFirst()).endsWith("/api/v1/items/" + id));
  }

  @Test
  void createItemRejectsBlankName() {
    assertThat(mvc.post().uri("/api/v1/items")
        .with(jwt())
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(new CreateItemRequest("", ItemType.ASSET))))
        .hasStatus(HttpStatus.BAD_REQUEST)
        .bodyJson()
        .extractingPath("$.errors.name").asArray().isNotEmpty();
  }

  @Test
  void getItemReturnsNotFoundWhenItemDoesNotExist() {
    UUID id = UUID.randomUUID();
    given(itemService.get(eq(id), any())).willThrow(new ItemNotFoundException(id));

    assertThat(mvc.get().uri("/api/v1/items/" + id)
        .with(jwt()))
        .hasStatus(HttpStatus.NOT_FOUND)
        .hasContentType(MediaType.APPLICATION_PROBLEM_JSON)
        .bodyJson()
        .extractingPath("$.detail").isEqualTo("Item not found with id: " + id);
  }
}
