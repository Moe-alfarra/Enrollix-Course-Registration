package com.moeAlfarra.course_registration_platform.service;

import com.moeAlfarra.course_registration_platform.dto.CourseOfferingResponse;
import com.moeAlfarra.course_registration_platform.dto.CourseResponse;
import com.moeAlfarra.course_registration_platform.dto.EnrollmentResponse;
import com.moeAlfarra.course_registration_platform.dto.UserResponse;
import com.moeAlfarra.course_registration_platform.entity.*;
import com.moeAlfarra.course_registration_platform.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final CourseOfferingRepository courseOfferingRepository;
    private final EnrollmentRepository enrollmentRepository;



    // Get user for profile
    public UserResponse getUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
        );

        return new UserResponse(user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }
    @Transactional
    public EnrollmentResponse enroll(Integer offeringId, String email) {
        // Get User
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Get Student
        Student student = studentRepository.findByUserUserId(user.getUserId()).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        // Get offering
        CourseOffering offering = courseOfferingRepository.findById(offeringId).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offering not found"));

        // Check course not soft-deleted
        if (offering.getCourse().isDeleted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course is deleted");
        }
        // Check capacity
        if (offering.getEnrolledCount() >= offering.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course offering is full");
        }

        Optional<Enrollment> existingEnrollmentOpt = enrollmentRepository.findByStudentAndOffering(student, offering);

        Enrollment enrollment;
        if (existingEnrollmentOpt.isPresent()) {
            enrollment = existingEnrollmentOpt.get();

            if (enrollment.getStatus() == EnrollmentStatus.ACTIVE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student is already enrolled in this offering'");
            }

            if (enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student already completed this offering");
            }
            if (enrollment.getStatus() == EnrollmentStatus.DROPPED
                    || enrollment.getStatus() == EnrollmentStatus.WITHDRAWN) {
                enrollment.setStatus(EnrollmentStatus.ACTIVE);
                enrollment.setEnrolledAt(LocalDateTime.now());
                enrollment.setDroppedAt(null);
                enrollment.setCompletedAt(null);
                enrollment.setGrade(null);
            }
        } else {
            enrollment = new Enrollment();
            enrollment.setStudent(student);
            enrollment.setOffering(offering);
            enrollment.setStatus(EnrollmentStatus.ACTIVE);
            enrollment.setGrade(null);
        }

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // Increment enrolled count
        offering.setEnrolledCount(offering.getEnrolledCount() + 1);
        courseOfferingRepository.save(offering);

        Course course = offering.getCourse();

        // Return Enrollment response
        return new EnrollmentResponse(
                savedEnrollment.getEnrollmentId(), student.getStudentId(), offering.getOfferingId(),
                course.getCode(), course.getName(), course.getCredits(), offering.getSemester(),
                offering.getYear(), enrollment.getStatus(), enrollment.getGrade(),
                offering.getSection(),
                offering.getProfessor().getUser().getName(),
                enrollment.getEnrolledAt(),
                enrollment.getDroppedAt(),
                enrollment.getCompletedAt());
    }

    @Transactional
    public void dropEnrollment(Integer enrollmentId, String email) {
        // Get User
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Get Student
        Student student = studentRepository.findByUserUserId(user.getUserId()).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        // 3. Get enrollment
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enrollment not found"));

        // Verify ownership
        if (!enrollment.getStudent().getStudentId().equals(student.getStudentId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only drop your own enrollments");
        }

        // Only ACTIVE enrollment can be dropped
        if (enrollment.getStatus() != EnrollmentStatus.ACTIVE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only active enrollments can be dropped"
            );
        }

        // Drop enrollment
        enrollment.setStatus(EnrollmentStatus.DROPPED);
        enrollment.setDroppedAt(LocalDateTime.now());

        CourseOffering offering = enrollment.getOffering();
        offering.setEnrolledCount(Math.max(0, offering.getEnrolledCount() - 1));

        enrollmentRepository.save(enrollment);
        courseOfferingRepository.save(offering);
    }

    // List All courses in system
    public List<CourseResponse> getCourses() {
        // Get courses
        List<Course> courses = courseRepository.findByDeletedFalse();

        // Filter for CoursesResponse
        List<CourseResponse> coursesList = new ArrayList<>();
        for (Course course: courses) {
            coursesList.add(new CourseResponse(course.getCourseId(), course.getCode(),
                    course.getName(), course.getDescription(), course.getCredits()));
        }

        return coursesList;
    }

    // List course offerings in system
    public List<CourseOfferingResponse> getOfferings() {
        // Get offerings
        List<CourseOffering> offerings = courseOfferingRepository.findAll();

        // Filter for OfferingsResponse
        List<CourseOfferingResponse> offeringsList = new ArrayList<>();
        for(CourseOffering offering: offerings) {
            Course course = offering.getCourse();
            String professorName = offering.getProfessor().getUser().getName();
            // Skip deleted courses
            if (course.isDeleted()) {
                continue;
            }

            offeringsList.add(new CourseOfferingResponse(
                    offering.getOfferingId(), course.getCode(), course.getName(),
                    course.getCredits(), offering.getSemester(), offering.getYear(),
                    offering.getSection(), offering.getCapacity(), offering.getEnrolledCount(), professorName));
        }

        return offeringsList;
    }

    // List student enrollments

    public List<EnrollmentResponse> getMyEnrollments(String email) {
        // Get user
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Get Student
        Student student = studentRepository.findByUserUserId(user.getUserId()).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        // Get Active Enrollments
        List<Enrollment> enrollments = enrollmentRepository.findByStudent(student);

        // Filter for EnrollmentsResponse
        List<EnrollmentResponse> enrollmentsResponse = new ArrayList<>();
        for(Enrollment enrollment: enrollments) {
            CourseOffering offering = enrollment.getOffering();
            Course course = offering.getCourse();
            enrollmentsResponse.add(new EnrollmentResponse(enrollment.getEnrollmentId(), student.getStudentId(),
                    offering.getOfferingId(), course.getCode(), course.getName(), course.getCredits(),
                    offering.getSemester(), offering.getYear(), enrollment.getStatus(), enrollment.getGrade(),
                    offering.getSection(), offering.getProfessor().getUser().getName(), enrollment.getEnrolledAt(),
                    enrollment.getDroppedAt(), enrollment.getCompletedAt()));
        }

        return enrollmentsResponse;
    }



}
