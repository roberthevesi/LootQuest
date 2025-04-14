package com.project.lootquest.repository;

import org.springframework.data.repository.CrudRepository;
import com.project.lootquest.entity.User;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer> {
        Optional<User> findByEmail(String email);
}
