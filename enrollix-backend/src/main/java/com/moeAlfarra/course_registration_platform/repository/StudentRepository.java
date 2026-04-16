package com.moeAlfarra.course_registration_platform.repository;

import com.moeAlfarra.course_registration_platform.entity.Student;
import com.moeAlfarra.course_registration_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByUserUserId(Integer id);
}
