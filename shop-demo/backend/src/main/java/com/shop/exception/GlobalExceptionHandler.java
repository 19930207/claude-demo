package com.shop.exception;

import com.shop.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.validation.ConstraintViolationException;
import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public Result<Object> handleBusinessException(BusinessException e) {
        log.error("业务异常：{}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Object> handleValidationException(MethodArgumentNotValidException e) {
        log.error("参数验证异常：", e);
        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();
        StringBuilder sb = new StringBuilder();
        for (FieldError fieldError : fieldErrors) {
            sb.append(fieldError.getField()).append(":").append(fieldError.getDefaultMessage()).append("; ");
        }
        return Result.error(400, sb.toString());
    }
    
    @ExceptionHandler(BindException.class)
    public Result<Object> handleBindException(BindException e) {
        log.error("参数绑定异常：", e);
        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();
        StringBuilder sb = new StringBuilder();
        for (FieldError fieldError : fieldErrors) {
            sb.append(fieldError.getField()).append(":").append(fieldError.getDefaultMessage()).append("; ");
        }
        return Result.error(400, sb.toString());
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public Result<Object> handleConstraintViolationException(ConstraintViolationException e) {
        log.error("约束违反异常：", e);
        return Result.error(400, e.getMessage());
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public Result<Object> handleIllegalArgumentException(IllegalArgumentException e) {
        log.error("非法参数异常：", e);
        return Result.error(400, e.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public Result<Object> handleException(Exception e) {
        log.error("系统异常：", e);
        return Result.error("系统异常，请稍后重试");
    }
}