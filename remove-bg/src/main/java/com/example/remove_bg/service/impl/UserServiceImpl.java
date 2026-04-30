package com.example.remove_bg.service.impl;

import com.example.remove_bg.dto.UserDTO;
import com.example.remove_bg.entity.UserEntity;
import com.example.remove_bg.repository.UserRepository;
import com.example.remove_bg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDTO saveUser(UserDTO dto) {
        UserEntity user = userRepository.findByClerkId(dto.getClerkId())
                .map(existing -> updateUser(existing, dto))
                .orElseGet(() -> mapToEntity(dto));

        UserEntity saved = userRepository.save(user);
        return mapToDto(saved);
    }

    private UserEntity updateUser(UserEntity existing, UserDTO dto) {
        existing.setEmail(dto.getEmail());
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setPhotoUrl(dto.getPhotoUrl());
        return existing;
    }

    private UserEntity mapToEntity(UserDTO dto) {
        return UserEntity.builder()
                .clerkId(dto.getClerkId())
                .email(dto.getEmail())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .photoUrl(dto.getPhotoUrl())
                .credits(dto.getCredits())
                .build();
    }

    private UserDTO mapToDto(UserEntity entity) {
        return UserDTO.builder()
                .clerkId(entity.getClerkId())
                .email(entity.getEmail())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .photoUrl(entity.getPhotoUrl())
                .credits(entity.getCredits())
                .build();
    }

    @Override
    @Transactional
    public void deleteUserByClerkId(String clerkId) {
        UserEntity user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với clerkId: " + clerkId));
        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserByClerkId(String clerkId) {
        UserEntity user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với clerkId: " + clerkId));
        return mapToDto(user);
    }
}
