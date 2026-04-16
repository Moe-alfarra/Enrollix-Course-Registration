package com.moeAlfarra.course_registration_platform.repository;

import com.moeAlfarra.course_registration_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer>{

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

}
