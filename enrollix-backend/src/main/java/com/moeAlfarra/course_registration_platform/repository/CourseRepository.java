package com.moeAlfarra.course_registration_platform.repository;

import com.moeAlfarra.course_registration_platform.entity.Course;
import com.moeAlfarra.course_registration_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    boolean existsByCode(String code);
    Optional<Course> findByCode(String code);

    List<Course> findByDeletedFalse();

    List<Course> findByDeletedTrue();
    boolean existsByName(String name);
}
