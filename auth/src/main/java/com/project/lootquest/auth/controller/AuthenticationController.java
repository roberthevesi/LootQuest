package com.project.lootquest.auth.controller;

import com.project.lootquest.auth.dto.LoginDto;
import com.project.lootquest.auth.dto.RegisterDto;
import com.project.lootquest.auth.entity.User;
import com.project.lootquest.auth.exception.LoginException;
import com.project.lootquest.auth.response.LoginResponse;
import com.project.lootquest.auth.service.AuthenticationService;
import com.project.lootquest.auth.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterDto registerUserDto) {
        User registeredUser = null;
        try {
            registeredUser = authenticationService.register(registerUserDto);
        } catch (LoginException e) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginDto loginUserDto) {
        User authenticatedUser = authenticationService.login(loginUserDto);

        Map<String, Object> extraClaims = Map.of(
                "userId", authenticatedUser.getId()
        );

        String jwtToken = jwtService.generateToken(extraClaims, authenticatedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());



        return ResponseEntity.ok(loginResponse);
    }
}
