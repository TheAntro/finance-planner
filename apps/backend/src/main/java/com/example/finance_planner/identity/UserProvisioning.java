package com.example.finance_planner.identity;

import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

@Component
class UserProvisioning {
  private final UserRepository users;

  UserProvisioning(UserRepository users) {
    this.users = users;
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public UUID provision(String issuer, String subject) {
    return users.saveAndFlush(new User(issuer, subject)).getId();
  }
}
