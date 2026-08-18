package com.example.finance_planner.identity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/me")
class MeController {
  private final CurrentUser currentUser;

  MeController(CurrentUser currentUser) {
    this.currentUser = currentUser;
  }

  @GetMapping()
  Map<String, String> me() {
    return Map.of("id", currentUser.id().toString());
  }

}
