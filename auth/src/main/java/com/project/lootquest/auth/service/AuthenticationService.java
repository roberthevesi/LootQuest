package com.project.lootquest.auth.service;

import com.project.lootquest.auth.dto.LoginDto;
import com.project.lootquest.auth.dto.RegisterDto;
import com.project.lootquest.auth.entity.User;
import com.project.lootquest.auth.exception.LoginException;
import com.project.lootquest.auth.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterDto input) throws LoginException {
        if (input.getEmail() == null || input.getEmail().trim().isBlank()) {
            throw new LoginException("Email address cannot be empty.");
        }

        if (input.getPhoneNumber() == null || input.getPhoneNumber().trim().isBlank()) {
            throw new LoginException("Phone number cannot be empty.");
        }

        if (input.getPassword() == null || input.getPassword().trim().isBlank()) {
            throw new LoginException("Password cannot be empty.");
        }

        if (!userRepository.findByEmail(input.getEmail()).isEmpty()) {
            throw new LoginException("A user with the same email already exists.");
        }

        User user = User.builder()
                .email(input.getEmail())
                .phoneNumber(input.getPhoneNumber())
                .password(passwordEncoder.encode(input.getPassword()))
                .createdAtDateTime(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    public User login(LoginDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow();

        user.setFcmToken(input.getFcmToken());

        return user;
    }
}
