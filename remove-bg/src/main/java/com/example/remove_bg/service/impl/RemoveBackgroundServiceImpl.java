package com.example.remove_bg.service.impl;

import com.example.remove_bg.client.ClipdropClient;
import com.example.remove_bg.service.RemoveBackgroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class RemoveBackgroundServiceImpl implements RemoveBackgroundService {

    private final ClipdropClient clipdropClient;

    @Value("${clipdrop.api.key}")
    private String apiKey;

    @Override
    public byte[] removeBackground(MultipartFile file) {
        try {
            return clipdropClient.removeBackground(file, apiKey);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi gọi API Clipdrop", e);
        }
    }
}
