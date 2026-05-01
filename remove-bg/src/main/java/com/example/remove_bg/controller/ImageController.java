package com.example.remove_bg.controller;

import com.example.remove_bg.dto.UserDTO;
import com.example.remove_bg.response.RemoveBgResponse;
import com.example.remove_bg.service.RemoveBackgroundService;
import com.example.remove_bg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final RemoveBackgroundService removeBackgroundService;
    private final UserService userService;

    @PostMapping("/remove-background")
    public ResponseEntity<RemoveBgResponse> removeBackground(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(RemoveBgResponse.builder()
                                .success(false)
                                .data("Chưa đăng nhập")
                                .statusCode(HttpStatus.UNAUTHORIZED)
                                .build());
            }

            String clerkId = authentication.getName();
            UserDTO user = userService.getUserByClerkId(clerkId);

            if (user.getCredits() <= 0) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(RemoveBgResponse.builder()
                                .success(false)
                                .data("Không đủ tín dụng. Vui lòng mua thêm tín dụng.")
                                .statusCode(HttpStatus.FORBIDDEN)
                                .build());
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(RemoveBgResponse.builder()
                                .success(false)
                                .data("File rỗng")
                                .statusCode(HttpStatus.BAD_REQUEST)
                                .build());
            }

            byte[] resultImage = removeBackgroundService.removeBackground(file);
            String base64Image = Base64.getEncoder().encodeToString(resultImage);

            user.setCredits(user.getCredits() - 1);
            userService.saveUser(user);

            Map<String, Object> data = new HashMap<>();
            data.put("image", base64Image);
            data.put("remainingCredits", user.getCredits());

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(RemoveBgResponse.builder()
                            .success(true)
                            .data(data)
                            .statusCode(HttpStatus.OK)
                            .build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(RemoveBgResponse.builder()
                            .success(false)
                            .data("Lỗi xử lý ảnh: " + e.getMessage())
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                            .build());
        }
    }
}
