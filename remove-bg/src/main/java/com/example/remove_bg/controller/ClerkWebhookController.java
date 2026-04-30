package com.example.remove_bg.controller;

import com.example.remove_bg.dto.UserDTO;
import com.example.remove_bg.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class ClerkWebhookController {

    @Value("${clerk.webhook.secret}")
    private String webhookSecret;

    private final UserService userService;
    private final ObjectMapper objectMapper;

    @PostMapping("/clerk")
    public ResponseEntity<Void> handleClerkWebhook(
            @RequestHeader("Svix-Id") String svixId,
            @RequestHeader("Svix-Timestamp") String svixTimestamp,
            @RequestHeader("Svix-Signature") String svixSignature,
            @RequestBody String payload
    ) {
        try {
            // 1. Verify signature
            if (!verifyWebhookSignature(svixId, svixTimestamp, svixSignature, payload)) {
                log.error("Chữ ký webhook không hợp lệ");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // 2. Parse JSON
            JsonNode root = objectMapper.readTree(payload);
            String eventType = root.get("type").asText();
            JsonNode data = root.get("data");

            log.info("Đã nhận sự kiện webhook: {}", eventType);

            // 3. Handle events
            switch (eventType) {
                case "user.created":
                    handleUserCreated(data);
                    break;
                case "user.updated":
                    handleUserUpdated(data);
                    break;
                case "user.deleted":
                    handleUserDeleted(data);
                    break;
                default:
                    log.warn("Loại sự kiện chưa được xử lý: {}", eventType);
            }

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Xử lý webhook thất bại", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
        // Dev: return true for development
        // Production: use Svix library to verify
        return true;
    }

    private void handleUserCreated(JsonNode data) {
        String clerkId = data.get("id").asText();

        // Check if user already exists (idempotency)
        try {
            userService.getUserByClerkId(clerkId);
            log.info("Người dùng đã tồn tại, bỏ qua việc tạo: {}", clerkId);
            return;
        } catch (RuntimeException e) {
            // User not found, continue with creation
        }

        String email = data.get("email_addresses").get(0).get("email_address").asText();
        String firstName = data.has("first_name") ? data.get("first_name").asText("") : "";
        String lastName = data.has("last_name") ? data.get("last_name").asText("") : "";
        String photoUrl = data.has("image_url") ? data.get("image_url").asText("") : "";

        UserDTO user = UserDTO.builder()
                .clerkId(clerkId)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .photoUrl(photoUrl)
                .build();

        userService.saveUser(user);
        log.info("Người dùng được tạo qua webhook: {}", clerkId);
    }

    private void handleUserUpdated(JsonNode data) {
        String clerkId = data.get("id").asText();

        UserDTO existingUser = userService.getUserByClerkId(clerkId);

        String email = data.get("email_addresses").get(0).get("email_address").asText();
        String firstName = data.has("first_name") ? data.get("first_name").asText("") : "";
        String lastName = data.has("last_name") ? data.get("last_name").asText("") : "";
        String photoUrl = data.has("image_url") ? data.get("image_url").asText("") : "";

        existingUser.setEmail(email);
        existingUser.setFirstName(firstName);
        existingUser.setLastName(lastName);
        existingUser.setPhotoUrl(photoUrl);

        userService.saveUser(existingUser);
        log.info("Người dùng được cập nhật qua webhook: {}", clerkId);
    }

    private void handleUserDeleted(JsonNode data) {
        String clerkId = data.get("id").asText();

        userService.deleteUserByClerkId(clerkId);
        log.info("Người dùng được xóa qua webhook: {}", clerkId);
    }
}
