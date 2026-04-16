package com.moeAlfarra.course_registration_platform.repository;

import com.moeAlfarra.course_registration_platform.entity.Professor;
import com.moeAlfarra.course_registration_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Integer> {
    Optional<Professor> findByUser(User user);
    Optional<Professor> findByUserUserId(Integer userId);
}
