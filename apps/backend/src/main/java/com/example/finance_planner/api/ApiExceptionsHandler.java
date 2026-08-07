package com.example.finance_planner.api;

import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.ExceptionHandler;

@RestControllerAdvice
class ApiExceptionsHandler extends ResponseEntityExceptionHandler {

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {

    ProblemDetail body = ex.getBody();
    body.setProperty("errors", ex.getFieldErrors().stream()
        .collect(groupingBy(FieldError::getField,
            mapping(DefaultMessageSourceResolvable::getDefaultMessage, toList()))));
    return handleExceptionInternal(ex, body, headers, status, request);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  ResponseEntity<Object> handleDataIntegrityViolation(
      DataIntegrityViolationException ex, WebRequest request) {

    logger.warn("Database constraint violated", ex);

    ProblemDetail body = ProblemDetail.forStatusAndDetail(
        HttpStatus.CONFLICT,
        "The request conflicts with existing data");
    return handleExceptionInternal(ex, body, new HttpHeaders(), HttpStatus.CONFLICT, request);
  }
}
