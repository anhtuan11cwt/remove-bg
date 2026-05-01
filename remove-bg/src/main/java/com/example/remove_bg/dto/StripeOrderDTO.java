package com.example.remove_bg.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StripeOrderDTO {

    private String id;
    private String object;
    private Long amount;
    private String currency;
    private String status;
    private Long created;
    private String receiptNumber;
    private String clientSecret;
}
