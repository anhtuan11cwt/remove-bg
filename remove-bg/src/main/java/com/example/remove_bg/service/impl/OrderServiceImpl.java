package com.example.remove_bg.service.impl;

import com.example.remove_bg.dto.CheckoutSessionDTO;
import com.example.remove_bg.entity.OrderEntity;
import com.example.remove_bg.repository.OrderRepository;
import com.example.remove_bg.service.OrderService;
import com.example.remove_bg.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    public record PlanDetails(String name, int credits, int amount) {}

    private static final Map<String, PlanDetails> PLANS = Map.of(
            "basic", new PlanDetails("Cơ bản", 100, 150000),
            "premium", new PlanDetails("Nâng cao", 250, 270000),
            "ultimate", new PlanDetails("Cao cấp", 1000, 450000)
    );

    private final StripeService stripeService;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public CheckoutSessionDTO createOrder(String planId, String clerkId) throws StripeException {
        PlanDetails plan = PLANS.get(planId.toLowerCase());

        if (plan == null) {
            throw new RuntimeException("Gói không hợp lệ: " + planId);
        }

        String tempOrderId = "order_" + System.currentTimeMillis();

        // Create Stripe Checkout Session
        Session session = stripeService.createCheckoutSession(
                plan.amount(),
                "vnd",
                tempOrderId,
                plan.name(),
                plan.credits()
        );

        OrderEntity orderEntity = OrderEntity.builder()
                .orderId(session.getId())
                .clerkId(clerkId)
                .plan(plan.name())
                .amount(plan.amount())
                .credits(plan.credits())
                .payment(false)
                .build();

        orderRepository.save(orderEntity);

        return CheckoutSessionDTO.builder()
                .id(session.getId())
                .url(session.getUrl())
                .build();
    }
}
