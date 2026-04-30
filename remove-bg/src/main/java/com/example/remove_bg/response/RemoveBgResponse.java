package com.example.remove_bg.response;

import lombok.*;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RemoveBgResponse {

    private boolean success;
    private Object data;
    private HttpStatus statusCode;
}
