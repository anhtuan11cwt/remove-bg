package com.example.remove_bg.repository;

import com.example.remove_bg.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByClerkId(String clerkId);

    boolean existsByClerkId(String clerkId);
}
