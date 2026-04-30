package com.example.remove_bg.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {

    private String clerkId;
    private String email;
    private String firstName;
    private String lastName;
    private String photoUrl;
    private Integer credits;
}
