package com.example.remove_bg.controller;

import com.example.remove_bg.dto.UserDTO;
import com.example.remove_bg.response.RemoveBgResponse;
import com.example.remove_bg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
        if (auth == null || !auth.getName().equals(dto.getClerkId())) {
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

    @GetMapping("/credits")
    public ResponseEntity<RemoveBgResponse> getUserCredits(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RemoveBgResponse.builder()
                            .success(false)
                            .data("Unauthorized")
                            .statusCode(HttpStatus.UNAUTHORIZED)
                            .build());
        }

        String clerkId = auth.getName();
        UserDTO user = userService.getUserByClerkId(clerkId);

        Map<String, Object> data = new HashMap<>();
        data.put("credits", user.getCredits());

        return ResponseEntity.ok(
                RemoveBgResponse.builder()
                        .success(true)
                        .data(data)
                        .statusCode(HttpStatus.OK)
                        .build()
        );
    }
}
