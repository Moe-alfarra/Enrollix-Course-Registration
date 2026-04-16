package com.moeAlfarra.course_registration_platform.repository;

import com.moeAlfarra.course_registration_platform.dto.EnrollmentResponse;
import com.moeAlfarra.course_registration_platform.entity.CourseOffering;
import com.moeAlfarra.course_registration_platform.entity.Enrollment;
import com.moeAlfarra.course_registration_platform.entity.EnrollmentStatus;
import com.moeAlfarra.course_registration_platform.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByOffering(CourseOffering offering);

    List<Enrollment> findByOfferingOfferingId(Integer offeringId);
    boolean existsByOffering(CourseOffering offering);

    List<Enrollment> findByStudent(Student student);

    List<Enrollment> findByStudentStudentId(Integer studentId);

    List<Enrollment> findByStudentAndStatus(Student student, EnrollmentStatus status);

    Optional<Enrollment> findByStudentAndOffering(Student student, CourseOffering offering);
    boolean existsByStudent(Student student);
}
