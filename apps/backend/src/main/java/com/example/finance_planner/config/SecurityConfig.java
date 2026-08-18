package com.example.finance_planner.config;

import org.springframework.boot.security.oauth2.server.resource.autoconfigure.OAuth2ResourceServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/v3/api-docs/**").permitAll()
            .anyRequest().authenticated())
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
        .build();
  }

  /**
   * Logto issues RFC 9068 access tokens, whose JOSE header carries
   * "typ": "at+jwt" rather than "JWT". Nimbus rejects that during
   * decoding, before any OAuth2TokenValidator runs, so the
   * decode-time check is disabled here and the type check moves into
   * {@link JwtValidators#createAtJwtValidator()} — which requires "at+jwt"
   * and also validates issuer, audience and timestamps.
   *
   * @see <a href="https://datatracker.ietf.org/doc/html/rfc9068#section-2.1">RFC
   *      9068 §2.1 — Header</a>
   */
  @Bean
  public JwtDecoder jwtDecoder(OAuth2ResourceServerProperties properties) {
    String issuer = properties.getJwt().getIssuerUri();
    String audience = properties.getJwt().getAudiences().getFirst();

    NimbusJwtDecoder decoder = NimbusJwtDecoder
        .withIssuerLocation(issuer)
        .validateType(false)
        .build();

    decoder.setJwtValidator(
        JwtValidators.createAtJwtValidator()
            .issuer(issuer)
            .audience(audience)
            .build());

    return decoder;
  }
}
