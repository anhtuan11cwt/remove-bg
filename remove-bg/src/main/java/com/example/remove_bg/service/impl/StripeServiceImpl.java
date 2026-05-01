package com.example.remove_bg.service.impl;

import com.example.remove_bg.entity.OrderEntity;
import com.example.remove_bg.repository.OrderRepository;
import com.example.remove_bg.service.StripeService;
import com.example.remove_bg.service.UserService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class StripeServiceImpl implements StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final Map<String, Object> orderLocks = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public Session createCheckoutSession(int amount, String currency, String orderId, String planName, int credits) throws StripeException {
        String priceString = String.format("%,d", amount / 100).replace(",", ".");

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:5173/payment-cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(currency.toLowerCase())
                                                .setUnitAmount((long) amount)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(planName + " - " + credits + " Credits")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("order_id", orderId)
                .putMetadata("credits", String.valueOf(credits))
                .build();

        return Session.create(params);
    }

    @Override
    @Transactional
    public Map<String, Object> verifyPayment(String sessionId) throws StripeException {
        Session session = Session.retrieve(sessionId);

        Map<String, Object> response = new HashMap<>();

        if (!"complete".equals(session.getStatus())) {
            response.put("success", false);
            response.put("message", "Thanh toán chưa hoàn tất");
            return response;
        }

        Object lock = orderLocks.computeIfAbsent(sessionId, k -> new Object());

        synchronized (lock) {
            try {
                OrderEntity orderEntity = orderRepository
                        .findByOrderId(sessionId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

                if (Boolean.TRUE.equals(orderEntity.getPayment())) {
                    response.put("success", true);
                    response.put("message", "Thanh toán đã được xử lý trước đó");
                    return response;
                }

                userService.addCredits(orderEntity.getClerkId(), orderEntity.getCredits());

                orderEntity.setPayment(true);
                orderRepository.save(orderEntity);

                response.put("success", true);
                response.put("message", "Đã thêm credits");

            } catch (OptimisticLockingFailureException e) {
                OrderEntity refreshed = orderRepository
                        .findByOrderId(sessionId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

                if (Boolean.TRUE.equals(refreshed.getPayment())) {
                    response.put("success", true);
                    response.put("message", "Thanh toán đã được xử lý");
                } else {
                    response.put("success", false);
                    response.put("message", "Lỗi xử lý đơn hàng, vui lòng thử lại");
                }
            } finally {
                orderLocks.remove(sessionId);
            }
        }

        return response;
    }
}
