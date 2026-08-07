package com.example.finance_planner.networth;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import java.util.UUID;
import java.net.URI;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/statements")
class StatementController {

  private final StatementService statementService;

  StatementController(StatementService statementService) {
    this.statementService = statementService;
  }

  @GetMapping
  List<StatementResponse> getStatements() {
    return this.statementService.getAll();
  }

  @PostMapping
  ResponseEntity<StatementResponse> createStatement(
      @RequestBody @Valid CreateStatementRequest statementRequest,
      UriComponentsBuilder uriBuilder) {
    StatementResponse statementResponse = this.statementService.create(statementRequest);
    URI location = uriBuilder.path("/api/v1/statements/{id}").buildAndExpand(statementResponse.id()).toUri();
    return ResponseEntity.created(location).body(statementResponse);
  }

  @GetMapping("/{id}")
  StatementResponse getStatement(@PathVariable UUID id) {
    return this.statementService.get(id);
  }
}