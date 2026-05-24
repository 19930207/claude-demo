# Java电商项目开发代码规范

## 项目信息
- **项目名称**: 电商网站系统 (shop-demo)
- **技术栈**: Spring Boot + MyBatis + MySQL + Redis
- **JDK版本**: JDK 1.8
- **构建工具**: Maven

## 代码生成规范

### 1. 包结构规范
```
com.shop
├── config/              # 配置类
├── controller/          # 控制层
├── service/            # 服务层接口
│   └── impl/           # 服务层实现
├── mapper/             # 数据访问层
├── entity/             # 实体类
├── dto/                # 数据传输对象
├── vo/                 # 视图对象
├── utils/              # 工具类
├── exception/          # 异常处理
├── enums/              # 枚举类
└── constants/          # 常量类
```

### 2. 命名规范

#### 类命名
- **Controller类**: 以Controller结尾，如 `UserController`
- **Service接口**: 以Service结尾，如 `UserService`
- **Service实现类**: 以ServiceImpl结尾，如 `UserServiceImpl`
- **Mapper接口**: 以Mapper结尾，如 `UserMapper`
- **Entity实体类**: 实体名称，如 `User`
- **DTO类**: 以DTO结尾，如 `UserDTO`
- **VO类**: 以VO结尾，如 `UserVO`
- **Exception类**: 以Exception结尾，如 `BusinessException`

#### 方法命名
- **Controller方法**: 动词+名词，如 `getUserById`、`createUser`
- **Service方法**: 动词+名词，如 `saveUser`、`deleteUser`
- **Mapper方法**: 动词+名词，如 `selectByPrimaryKey`、`insertSelective`

#### 变量命名
- 使用驼峰命名法
- 布尔类型变量以is/has/can开头
- 常量使用大写字母和下划线

### 3. 代码模板

#### Entity实体类模板
```java
package com.shop.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("table_name")
public class EntityName implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("field_name")
    private String fieldName;
    
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    @TableField("is_deleted")
    private Boolean isDeleted;
}
```

#### Controller层模板
```java
package com.shop.controller;

import com.shop.service.SomeService;
import com.shop.dto.SomeDTO;
import com.shop.vo.SomeVO;
import com.shop.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "模块名称", description = "模块描述")
@RestController
@RequestMapping("/api/module")
@Validated
public class SomeController {
    
    @Autowired
    private SomeService someService;
    
    @Operation(summary = "操作描述")
    @PostMapping("/create")
    public Result<SomeVO> create(@RequestBody @Validated SomeDTO dto) {
        SomeVO result = someService.create(dto);
        return Result.success(result);
    }
    
    @Operation(summary = "根据ID查询")
    @GetMapping("/{id}")
    public Result<SomeVO> getById(@PathVariable Long id) {
        SomeVO result = someService.getById(id);
        return Result.success(result);
    }
}
```

#### Service接口模板
```java
package com.shop.service;

import com.shop.dto.SomeDTO;
import com.shop.vo.SomeVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface SomeService {
    
    SomeVO create(SomeDTO dto);
    
    SomeVO getById(Long id);
    
    SomeVO update(Long id, SomeDTO dto);
    
    void delete(Long id);
    
    Page<SomeVO> list(int pageNum, int pageSize, SomeDTO dto);
}
```

#### Service实现类模板
```java
package com.shop.service.impl;

import com.shop.service.SomeService;
import com.shop.mapper.SomeMapper;
import com.shop.entity.SomeEntity;
import com.shop.dto.SomeDTO;
import com.shop.vo.SomeVO;
import com.shop.exception.BusinessException;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SomeServiceImpl implements SomeService {
    
    @Autowired
    private SomeMapper someMapper;
    
    @Override
    @Transactional
    public SomeVO create(SomeDTO dto) {
        SomeEntity entity = new SomeEntity();
        BeanUtils.copyProperties(dto, entity);
        
        int result = someMapper.insert(entity);
        if (result <= 0) {
            throw new BusinessException("创建失败");
        }
        
        SomeVO vo = new SomeVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
    
    @Override
    public SomeVO getById(Long id) {
        SomeEntity entity = someMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("数据不存在");
        }
        
        SomeVO vo = new SomeVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}
```

### 4. 统一响应格式
```java
package com.shop.utils;

import lombok.Data;

@Data
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("操作成功");
        result.setData(data);
        return result;
    }
    
    public static <T> Result<T> error(String message) {
        Result<T> result = new Result<>();
        result.setCode(500);
        result.setMessage(message);
        return result;
    }
}
```

### 5. 异常处理规范
```java
package com.shop.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.shop.utils.Result;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public Result<Object> handleBusinessException(BusinessException e) {
        log.error("业务异常：{}", e.getMessage());
        return Result.error(e.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public Result<Object> handleException(Exception e) {
        log.error("系统异常：", e);
        return Result.error("系统异常，请稍后重试");
    }
}
```

### 6. 数据验证规范
- 使用@Validated注解进行参数验证
- DTO类中使用Bean Validation注解
- 自定义验证注解处理复杂验证逻辑

### 7. 日志规范
- 使用SLF4J + Logback
- 重要操作记录INFO级别日志
- 异常记录ERROR级别日志
- 调试信息使用DEBUG级别

### 8. 数据库操作规范
- 使用MyBatis Plus简化CRUD操作
- 复杂查询使用XML映射文件
- 使用分页插件处理分页查询
- 启用逻辑删除功能

### 9. 缓存使用规范
- 使用@Cacheable注解实现方法级缓存
- 缓存key使用统一前缀
- 设置合理的缓存过期时间

### 10. 安全规范
- 敏感数据加密存储
- 使用JWT进行身份认证
- 接口权限控制
- SQL注入防护

## 开发指导原则

1. **代码简洁**: 保持代码简洁易读，避免过度设计
2. **单一职责**: 每个类和方法只负责一个功能
3. **异常处理**: 合理处理异常，提供友好的错误提示
4. **性能优化**: 注意SQL查询性能，合理使用缓存
5. **安全考虑**: 数据验证、权限控制、防止SQL注入
6. **测试驱动**: 编写单元测试，保证代码质量
7. **文档完善**: 重要方法和类添加详细注释

## 系统提示词

在生成Java代码时，请严格遵循以上规范，确保：
- 使用正确的包结构和命名规范
- 实现统一的异常处理和响应格式
- 添加必要的注解和验证
- 保持代码风格一致性
- 考虑性能和安全性
- 生成完整可用的代码片段