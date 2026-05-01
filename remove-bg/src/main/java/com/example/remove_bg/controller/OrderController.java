package com.example.remove_bg.controller;

import com.example.remove_bg.dto.CheckoutSessionDTO;
import com.example.remove_bg.response.RemoveBgResponse;
import com.example.remove_bg.service.OrderService;
import com.example.remove_bg.service.StripeService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final StripeService stripeService;

    @PostMapping
    public ResponseEntity<RemoveBgResponse> createOrder(
            @RequestParam String planId,
            @RequestHeader("clerkId") String clerkId
    ) throws StripeException {
        CheckoutSessionDTO session = orderService.createOrder(planId, clerkId);

        RemoveBgResponse response = RemoveBgResponse.builder()
                .success(true)
                .data(session)
                .statusCode(HttpStatus.CREATED)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<RemoveBgResponse> verifyPayment(
            @RequestBody Map<String, String> body
    ) throws StripeException {
        String sessionId = body.get("sessionId");

        if (sessionId == null || sessionId.isEmpty()) {
            RemoveBgResponse response = RemoveBgResponse.builder()
                    .success(false)
                    .data("Session ID là bắt buộc")
                    .statusCode(HttpStatus.BAD_REQUEST)
                    .build();
            return ResponseEntity.badRequest().body(response);
        }

        Map<String, Object> result = stripeService.verifyPayment(sessionId);

        boolean success = (boolean) result.get("success");

        RemoveBgResponse response = RemoveBgResponse.builder()
                .success(success)
                .data(result)
                .statusCode(success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .build();

        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
