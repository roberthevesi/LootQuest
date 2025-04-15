package com.project.lootquest.service;

import com.project.lootquest.entity.User;
import com.project.lootquest.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);


    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            Optional<User> userDetails = userRepository.findByEmail(username);
            if (userDetails.isPresent()) {
                return userDetails.get();
            } else {
                throw new UsernameNotFoundException("User not found with email: " + username);
            }
        } catch (UsernameNotFoundException ex) {
            logger.error("User not found: " + ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            logger.error("Error loading user by email: " + username, ex);
            throw new RuntimeException(ex);
        }
    }
}
