package com.moeAlfarra.course_registration_platform.repository;

import com.moeAlfarra.course_registration_platform.entity.Course;
import com.moeAlfarra.course_registration_platform.entity.CourseOffering;
import com.moeAlfarra.course_registration_platform.entity.Professor;
import com.moeAlfarra.course_registration_platform.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseOfferingRepository extends JpaRepository<CourseOffering, Integer> {

    List<CourseOffering> findByProfessor(Professor professor);

    List<CourseOffering> findByProfessorProfessorId(Integer professorId);
    boolean existsByCourseAndSemesterAndYearAndSectionAndProfessor(
            Course course, Semester semester, Integer year, String section,Professor professor);

    boolean existsByProfessor(Professor professor);
}
