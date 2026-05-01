package com.example.remove_bg.service;

import com.example.remove_bg.dto.UserDTO;

public interface UserService {

    UserDTO saveUser(UserDTO dto);

    void deleteUserByClerkId(String clerkId);

    UserDTO getUserByClerkId(String clerkId);

    void addCredits(String clerkId, Integer credits);
}
