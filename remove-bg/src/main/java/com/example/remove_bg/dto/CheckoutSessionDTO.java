package com.example.remove_bg.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckoutSessionDTO {
    private String id;
    private String url;
}
