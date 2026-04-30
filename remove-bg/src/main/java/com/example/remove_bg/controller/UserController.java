package com.example.remove_bg.controller;

import com.example.remove_bg.dto.UserDTO;
import com.example.remove_bg.response.RemoveBgResponse;
import com.example.remove_bg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<RemoveBgResponse> createOrUpdateUser(
            @RequestBody UserDTO dto,
            Authentication auth
    ) {
        if (!auth.getName().equals(dto.getClerkId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(RemoveBgResponse.builder()
                            .success(false)
                            .data("Không có quyền truy cập")
                            .statusCode(HttpStatus.FORBIDDEN)
                            .build());
        }

        UserDTO savedUser = userService.saveUser(dto);

        return ResponseEntity.ok(
                RemoveBgResponse.builder()
                        .success(true)
                        .data(savedUser)
                        .statusCode(HttpStatus.OK)
                        .build()
        );
    }
}
