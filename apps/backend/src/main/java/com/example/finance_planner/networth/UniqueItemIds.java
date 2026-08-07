package com.example.finance_planner.networth;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = UniqueItemIdsValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface UniqueItemIds {
  String message() default "Must not contain the same item ID more than once";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

}
