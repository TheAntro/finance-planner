package com.example.finance_planner.identity;

import java.util.UUID;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.dao.DataIntegrityViolationException;

@Component
class JwtCurrentUser implements CurrentUser {

  private final UserRepository users;
  private final UserProvisioning provisioning;

  JwtCurrentUser(UserRepository users, UserProvisioning provisioning) {
    this.users = users;
    this.provisioning = provisioning;
  }

  @Override
  public UUID id() {
    Jwt jwt = currentJwt();
    String issuer = jwt.getIssuer().toString();
    String subject = jwt.getSubject();

    return users.findByIssuerAndSubject(issuer, subject)
        .map(User::getId)
        .orElseGet(() -> create(issuer, subject));
  }

  private UUID create(String issuer, String subject) {
    try {
      return provisioning.provision(issuer, subject);
    } catch (DataIntegrityViolationException lostRace) {
      return users.findByIssuerAndSubject(issuer, subject)
          .map(User::getId).orElseThrow(() -> lostRace);
    }
  }

  private Jwt currentJwt() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth instanceof JwtAuthenticationToken token) {
      return token.getToken();
    }
    throw new IllegalStateException("No Authenticated JWT in the security context");
  }
}
