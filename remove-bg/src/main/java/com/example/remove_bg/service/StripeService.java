package com.example.remove_bg.service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

import java.util.Map;

public interface StripeService {

    Session createCheckoutSession(int amount, String currency, String orderId, String planName, int credits) throws StripeException;

    Map<String, Object> verifyPayment(String sessionId) throws StripeException;
}
