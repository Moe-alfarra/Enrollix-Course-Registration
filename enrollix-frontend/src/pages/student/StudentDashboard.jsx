import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  dropEnrollment,
  enrollInOffering,
  getStudentEnrollments,
  getStudentOfferings,
  getStudentProfile,
} from "../../api/studentApi";
import StudentOfferingsTable from "../../components/student/StudentOfferingsTable";
import StudentEnrollmentsTable from "../../components/student/StudentEnrollmentsTable";
import DropEnrollmentModal from "../../components/student/DropEnrollmentModal";
import Toast from "../../components/Toast";
import "../admin/admin.css";
import "./student.css";

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("offerings");

  const [offerings, setOfferings] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [profile, setProfile] = useState(null);

  const [loadingOfferings, setLoadingOfferings] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [offeringSearch, setOfferingSearch] = useState("");
  const [enrollmentSearch, setEnrollmentSearch] = useState("");

  const [offeringSortBy, setOfferingSortBy] = useState("name");
  const [enrollmentSortBy, setEnrollmentSortBy] = useState("name");

  const [busyOfferingId, setBusyOfferingId] = useState(null);
  const [busyEnrollmentId, setBusyEnrollmentId] = useState(null);

  const [toast, setToast] = useState({ type: "", message: "" });

  const showSuccess = (message) => setToast({ type: "success", message });
  const showError = (message) => setToast({ type: "error", message });
  const clearToast = () => setToast({ type: "", message: "" });

  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const loadOfferings = async () => {
    setLoadingOfferings(true);
    try {
      const data = await getStudentOfferings();
      setOfferings(data);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to load offerings");
    } finally {
      setLoadingOfferings(false);
    }
  };

  const loadEnrollments = async () => {
    setLoadingEnrollments(true);
    try {
      const data = await getStudentEnrollments();
      setEnrollments(data);
    } catch (err) {
      console.error("Enrollments load failed:", err);
      showError(err.response?.data?.message || "Failed to load enrollments");
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const data = await getStudentProfile();
      setProfile(data);
    } catch (err) {
      console.error("Profile load failed:", err);
      showError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Load everything needed for the dashboard immediately
  useEffect(() => {
    loadOfferings();
    loadEnrollments();
    loadProfile();
  }, []);

  useEffect(() => {
    if (!toast.message) return;

    const timer = setTimeout(() => {
      clearToast();
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast.message]);

  const activeEnrollmentOfferingIds = useMemo(() => {
    return enrollments
      .filter((enrollment) => enrollment.status === "ACTIVE")
      .map((enrollment) => enrollment.offering_id);
  }, [enrollments]);

  const filteredOfferings = useMemo(() => {
    const q = offeringSearch.toLowerCase().trim();

    const filtered = offerings.filter(
      (offering) =>
        offering.courseCode?.toLowerCase().includes(q) ||
        offering.courseName?.toLowerCase().includes(q) ||
        offering.professorName?.toLowerCase().includes(q) ||
        offering.semester?.toLowerCase().includes(q) ||
        offering.section?.toLowerCase().includes(q)
    );

    return [...filtered].sort((a, b) => {
      if (offeringSortBy === "professor") {
        return a.professorName.localeCompare(b.professorName);
      }
      return a.courseName.localeCompare(b.courseName);
    });
  }, [offerings, offeringSearch, offeringSortBy]);

  const filteredEnrollments = useMemo(() => {
    const q = enrollmentSearch.toLowerCase().trim();

    const filtered = enrollments.filter(
      (enrollment) =>
        enrollment.courseCode?.toLowerCase().includes(q) ||
        enrollment.courseName?.toLowerCase().includes(q) ||
        enrollment.professorName?.toLowerCase().includes(q) ||
        enrollment.status?.toLowerCase().includes(q) ||
        enrollment.section?.toLowerCase().includes(q)
    );

    return [...filtered].sort((a, b) => {
      if (enrollmentSortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      if (enrollmentSortBy === "professor") {
        return a.professorName.localeCompare(b.professorName);
      }
      return a.courseName.localeCompare(b.courseName);
    });
  }, [enrollments, enrollmentSearch, enrollmentSortBy]);

  const handleEnroll = async (offeringId) => {
    setBusyOfferingId(offeringId);
    try {
      await enrollInOffering(offeringId);
      showSuccess("Enrolled successfully");
      await loadOfferings();
      await loadEnrollments();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to enroll");
    } finally {
      setBusyOfferingId(null);
    }
  };

  const handleOpenDropModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsDropModalOpen(true);
  };

  const handleCloseDropModal = () => {
    if (busyEnrollmentId) return;
    setIsDropModalOpen(false);
    setSelectedEnrollment(null);
  };

  const handleConfirmDrop = async () => {
    if (!selectedEnrollment) return;

    setBusyEnrollmentId(selectedEnrollment.enrollment_id);
    try {
      await dropEnrollment(selectedEnrollment.enrollment_id);
      showSuccess("Enrollment dropped successfully");
      await loadEnrollments();
      await loadOfferings();
      setIsDropModalOpen(false);
      setSelectedEnrollment(null);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to drop enrollment");
    } finally {
      setBusyEnrollmentId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="admin-page student-page">
      <div className="toast-container">
        {toast.message && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={clearToast}
          />
        )}
      </div>

      <div className="admin-shell">
        <div className="admin-header">
          <div className="admin-title">
            <h1>Enrollix Student</h1>
            <p>Browse offerings, manage enrollments, and view your profile</p>
          </div>

          <div className="admin-actions">
            <div className="admin-profile-chip">
              <span>Signed in as</span>
              <strong>{profile?.name || "Student"}</strong>
            </div>

            <button className="admin-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === "offerings" ? "admin-tab-btn active" : "admin-tab-btn"}
            onClick={() => setActiveTab("offerings")}
          >
            Available Offerings
          </button>

          <button
            className={activeTab === "enrollments" ? "admin-tab-btn active" : "admin-tab-btn"}
            onClick={() => setActiveTab("enrollments")}
          >
            My Enrollments
          </button>

          <button
            className={activeTab === "profile" ? "admin-tab-btn active" : "admin-tab-btn"}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>

        {activeTab === "offerings" && (
          <div className="admin-card student-section">
            <div className="admin-section-header">
              <div>
                <h2>Available Offerings</h2>
                <p>Browse open offerings and enroll in available courses</p>
              </div>
            </div>

            <div className="admin-filter-row">
              <input
                className="admin-search"
                placeholder="Search offerings..."
                value={offeringSearch}
                onChange={(e) => setOfferingSearch(e.target.value)}
              />

              <button
                className="admin-sort-btn"
                onClick={() =>
                  setOfferingSortBy((prev) =>
                    prev === "name" ? "professor" : "name"
                  )
                }
              >
                {offeringSortBy === "name" ? "Sort: Name" : "Sort: Professor"}
              </button>
            </div>

            {loadingOfferings ? (
              <div className="admin-loading">Loading offerings...</div>
            ) : (
              <StudentOfferingsTable
                offerings={filteredOfferings}
                activeEnrollmentOfferingIds={activeEnrollmentOfferingIds}
                onEnroll={handleEnroll}
                busyOfferingId={busyOfferingId}
              />
            )}
          </div>
        )}

        {activeTab === "enrollments" && (
          <div className="admin-card student-section">
            <div className="admin-section-header">
              <div>
                <h2>My Enrollments</h2>
                <p>Track active, dropped, and completed enrollments</p>
              </div>
            </div>

            <div className="admin-filter-row">
              <input
                className="admin-search"
                placeholder="Search enrollments..."
                value={enrollmentSearch}
                onChange={(e) => setEnrollmentSearch(e.target.value)}
              />

              <button
                className="admin-sort-btn"
                onClick={() =>
                  setEnrollmentSortBy((prev) =>
                    prev === "name" ? "professor" : prev === "professor" ? "status" : "name"
                  )
                }
              >
                {enrollmentSortBy === "name"
                  ? "Sort: Name"
                  : enrollmentSortBy === "professor"
                  ? "Sort: Professor"
                  : "Sort: Status"}
              </button>
            </div>

            {loadingEnrollments ? (
              <div className="admin-loading">Loading enrollments...</div>
            ) : (
              <StudentEnrollmentsTable
                enrollments={filteredEnrollments}
                onDrop={handleOpenDropModal}
                busyEnrollmentId={busyEnrollmentId}
              />
            )}

            <AnimatePresence>
                    {isDropModalOpen && (
                      <DropEnrollmentModal
                        isOpen={isDropModalOpen}
                        selectedEnrollment={selectedEnrollment}
                        onClose={handleCloseDropModal}
                        onConfirm={handleConfirmDrop}
                        loading={!!busyEnrollmentId}
                      />
                    )}
                  </AnimatePresence>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="admin-card student-section">
            <div className="admin-section-header">
              <div>
                <h2>Profile</h2>
                <p>Your account information</p>
              </div>
            </div>

            {loadingProfile ? (
              <div className="admin-loading">Loading profile...</div>
            ) : profile ? (
              <div className="admin-profile-card">
                <div className="admin-profile-row">
                  <span>Name</span>
                  <strong>{profile.name}</strong>
                </div>
                <div className="admin-profile-row">
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </div>
                <div className="admin-profile-row">
                  <span>Role</span>
                  <strong>{profile.role}</strong>
                </div>
                <div className="admin-profile-row">
                  <span>Password</span>
                  <strong>********</strong>
                </div>
              </div>
            ) : (
              <div className="admin-empty">Profile not found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;