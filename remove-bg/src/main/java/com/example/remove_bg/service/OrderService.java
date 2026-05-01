package com.example.remove_bg.service;

import com.example.remove_bg.dto.CheckoutSessionDTO;
import com.stripe.exception.StripeException;

public interface OrderService {

    CheckoutSessionDTO createOrder(String planId, String clerkId) throws StripeException;
}
