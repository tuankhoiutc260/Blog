package com.tuankhoi.backend.controller;

import com.tuankhoi.backend.dto.request.UserRequest;
import com.tuankhoi.backend.dto.response.APIResponse;
import com.tuankhoi.backend.dto.response.UserResponse;
import com.tuankhoi.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    UserService userService;

    @GetMapping("/{id}")
    public APIResponse<UserResponse> findByID(@PathVariable String id){
        return APIResponse.<UserResponse>builder()
                .result(userService.findByID(id))
                .build();
    }

//    @GetMapping("/{user_name}")
//    public APIResponse<UserResponse> findByUserName(@PathVariable String user_name){
//        return APIResponse.<UserResponse>builder()
//                .result(userService.findByUserName(user_name))
//                .build();
//    }

    @GetMapping("/my-info")
    public APIResponse<UserResponse> getMyInfo() {
        return APIResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @GetMapping("")
    public APIResponse<List<UserResponse>> findAll() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: {}", authentication.getName());
        log.info("Username: {}", authentication.getPrincipal());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));

        return APIResponse.<List<UserResponse>>builder()
                .result(userService.findAll())
                .build();
    }

    @PostMapping
    public APIResponse<UserResponse> create(@RequestBody @Valid UserRequest userRequest){
        return APIResponse.<UserResponse>builder()
                .result(userService.create(userRequest))
                .build();
    }

    @PutMapping("/{id}")
    public APIResponse<UserResponse> update(@PathVariable String id, @RequestBody UserRequest userRequest){
        return APIResponse.<UserResponse>builder()
                .result(userService.update(id, userRequest))
                .build();
    }

    @DeleteMapping("/{id}")
    public APIResponse<Void> delete(@PathVariable String id){
        userService.deleteByID(id);
        return APIResponse.<Void>builder().build();
    }
}
