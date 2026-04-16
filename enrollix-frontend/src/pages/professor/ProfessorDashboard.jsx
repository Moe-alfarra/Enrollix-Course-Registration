import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  getProfessorCourses,
  getProfessorOfferings,
  getProfessorProfile,
  createProfessorOffering,
  updateProfessorOffering,
  deleteProfessorOffering,
  getOfferingStudents,
} from "../../api/professorApi";
import ProfessorCoursesTable from "../../components/professor/ProfessorCourseTable";
import ProfessorOfferingsTable from "../../components/professor/ProfessorOfferingsTable";
import CreateOfferingForm from "../../components/professor/CreateOfferingForm";
import EditOfferingForm from "../../components/professor/EditOfferingForm";
import OfferingStudentsModal from "../../components/professor/OfferingStudentsModal";
import DeleteOfferingModal from "../../components/professor/DeleteOfferingModal";
import "../admin/admin.css";
import "./professor.css";
import Toast from "../../components/Toast";

export default function ProfessorDashboard() {
  const [activeTab, setActiveTab] = useState("courses");
  const [toast, setToast] = useState(null);

  const [courses, setCourses] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [profile, setProfile] = useState(null);

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingOfferings, setLoadingOfferings] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [coursesError, setCoursesError] = useState("");
  const [offeringsError, setOfferingsError] = useState("");
  const [profileError, setProfileError] = useState("");

  const [courseSearch, setCourseSearch] = useState("");
  const [offeringSearch, setOfferingSearch] = useState("");

  const [courseSortBy, setCourseSortBy] = useState("id");
  const [offeringSortBy, setOfferingSortBy] = useState("id");

  const [busyCourseId, setBusyCourseId] = useState(null);
  const [busyOfferingId, setBusyOfferingId] = useState(null);

  const [isCreateOfferingOpen, setIsCreateOfferingOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [creatingOffering, setCreatingOffering] = useState(false);

  const [isEditOfferingOpen, setIsEditOfferingOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [updatingOffering, setUpdatingOffering] = useState(false);

  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingOffering, setDeletingOffering] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      setCoursesError("");
      const data = await getProfessorCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
      setCoursesError("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchOfferings = async () => {
    try {
      setLoadingOfferings(true);
      setOfferingsError("");
      const data = await getProfessorOfferings();
      setOfferings(data);
    } catch (err) {
      console.error(err);
      setOfferingsError("Failed to load offerings");
    } finally {
      setLoadingOfferings(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      setProfileError("");
      const data = await getProfessorProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setProfileError("Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchOfferings();
    fetchProfile();
  }, []);

  const filteredCourses = useMemo(() => {
    let data = [...courses];

    if (courseSearch.trim()) {
      const term = courseSearch.toLowerCase();
      data = data.filter(
        (course) =>
          course.code?.toLowerCase().includes(term) ||
          course.name?.toLowerCase().includes(term) ||
          course.description?.toLowerCase().includes(term)
      );
    }

    data.sort((a, b) => {
      if (courseSortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.courseId - b.courseId;
    });

    return data;
  }, [courses, courseSearch, courseSortBy]);

  const filteredOfferings = useMemo(() => {
    let data = [...offerings];

    if (offeringSearch.trim()) {
      const term = offeringSearch.toLowerCase();
      data = data.filter(
        (offering) =>
          offering.courseCode?.toLowerCase().includes(term) ||
          offering.courseName?.toLowerCase().includes(term) ||
          offering.semester?.toLowerCase().includes(term) ||
          offering.year?.toString().includes(term) ||
          offering.section?.toLowerCase().includes(term)
      );
    }

    data.sort((a, b) => {
      if (offeringSortBy === "name") {
        return a.courseName.localeCompare(b.courseName);
      }
      return a.offeringId - b.offeringId;
    });

    return data;
  }, [offerings, offeringSearch, offeringSortBy]);

  const handleOpenAddOffering = (course) => {
    setSelectedCourse(course);
    setIsCreateOfferingOpen(true);
  };

  const handleCloseCreateOffering = () => {
    if (creatingOffering) return;
    setIsCreateOfferingOpen(false);
    setSelectedCourse(null);
  };

  const handleCreateOffering = async (payload) => {
    try {
      setCreatingOffering(true);
      await createProfessorOffering(payload);
      await fetchOfferings();

      setToast({ message: "Offering created successfully", type: "success" });

      setIsCreateOfferingOpen(false);
      setSelectedCourse(null);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to create offering",
        type: "error",
      });
    } finally {
      setCreatingOffering(false);
    }
  };

  const handleOpenEditOffering = (offering) => {
    setSelectedOffering(offering);
    setIsEditOfferingOpen(true);
  };

  const handleCloseEditOffering = () => {
    if (updatingOffering) return;
    setIsEditOfferingOpen(false);
    setSelectedOffering(null);
  };

  const handleUpdateOffering = async (payload) => {
    if (!selectedOffering) return;

    try {
      setUpdatingOffering(true);
      await updateProfessorOffering(selectedOffering.offeringId, payload);
      await fetchOfferings();

      setToast({ message: "Offering updated successfully", type: "success" });

      setIsEditOfferingOpen(false);
      setSelectedOffering(null);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to update offering",
        type: "error",
      });
    } finally {
      setUpdatingOffering(false);
    }
  };

  const handleViewStudents = async (offering) => {
    try {
      setSelectedOffering(offering);
      setIsStudentsModalOpen(true);
      setLoadingStudents(true);
      setStudentsError("");
      setStudents([]);

      const data = await getOfferingStudents(offering.offeringId);
      setStudents(data);
    } catch (err) {
      console.error(err);
      setStudentsError("Failed to load students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleCloseStudentsModal = () => {
    if (loadingStudents) return;
    setIsStudentsModalOpen(false);
    setStudents([]);
    setStudentsError("");
    setSelectedOffering(null);
  };

  const handleEditOffering = (offering) => {
    console.log("Edit offering:", offering);
  };

  const handleOpenDeleteOffering = (offering) => {
    setSelectedOffering(offering);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deletingOffering) return;
    setIsDeleteModalOpen(false);
    setSelectedOffering(null);
  };

  const handleConfirmDeleteOffering = async () => {
    if (!selectedOffering) return;

    try {
      setDeletingOffering(true);
      await deleteProfessorOffering(selectedOffering.offeringId);
      await fetchOfferings();

      setToast({ message: "Offering deleted successfully", type: "success" });

      setIsDeleteModalOpen(false);
      setSelectedOffering(null);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to delete offering",
        type: "error",
      });
    } finally {
      setDeletingOffering(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="admin-page professor-page">
     <div className="toast-container">
       {toast && (
         <Toast
           type={toast.type}
           message={toast.message}
           onClose={() => setToast(null)}
         />
       )}
     </div>
      <div className="admin-shell">
        <div className="admin-header">
          <div className="admin-title">
            <h1>Enrollix Professor</h1>
            <p>Manage course offerings and review your teaching profile</p>
          </div>

          <div className="admin-actions">
            {profile && (
              <div className="admin-profile-chip">
                <span>Signed in as</span>
                <strong>{profile.name}</strong>
              </div>
            )}

            <button className="admin-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === "courses" ? "admin-tab-btn active" : "admin-tab-btn"}
            onClick={() => setActiveTab("courses")}
          >
            Courses
          </button>

          <button
            className={activeTab === "offerings" ? "admin-tab-btn active" : "admin-tab-btn"}
            onClick={() => setActiveTab("offerings")}
          >
            My Offerings
          </button>

          <button
            className={activeTab === "profile" ? "admin-tab-btn active" : "admin-tab-btn"}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>

        {activeTab === "courses" && (
          <div className="admin-card professor-section">
            <div className="admin-section-header">
              <div>
                <h2>Courses</h2>
                <p>Browse available courses and create offerings</p>
              </div>
            </div>

            <div className="admin-filter-row">
              <input
                type="text"
                placeholder="Search courses..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="admin-search"
              />

              <button
                className="admin-sort-btn"
                onClick={() => setCourseSortBy((prev) => (prev === "id" ? "name" : "id"))}
              >
                Sort: {courseSortBy}
              </button>
            </div>

            {coursesError ? (
              <p className="admin-error">{coursesError}</p>
            ) : loadingCourses ? (
              <div className="admin-loading">Loading courses...</div>
            ) : (
              <ProfessorCoursesTable
                courses={filteredCourses}
                onAddOffering={handleOpenAddOffering}
                busyCourseId={busyCourseId}
              />
            )}
          </div>
        )}

        {activeTab === "offerings" && (
          <div className="admin-card professor-section">
            <div className="admin-section-header">
              <div>
                <h2>My Offerings</h2>
                <p>View and manage the offerings you created</p>
              </div>
            </div>

            <div className="admin-filter-row">
              <input
                type="text"
                placeholder="Search offerings..."
                value={offeringSearch}
                onChange={(e) => setOfferingSearch(e.target.value)}
                className="admin-search"
              />

              <button
                className="admin-sort-btn"
                onClick={() => setOfferingSortBy((prev) => (prev === "id" ? "name" : "id"))}
              >
                Sort: {offeringSortBy}
              </button>
            </div>

            {offeringsError ? (
              <p className="admin-error">{offeringsError}</p>
            ) : loadingOfferings ? (
              <div className="admin-loading">Loading offerings...</div>
            ) : (
              <ProfessorOfferingsTable
                offerings={filteredOfferings}
                onViewStudents={handleViewStudents}
                onEditOffering={handleOpenEditOffering}
                onDeleteOffering={handleOpenDeleteOffering}
                busyOfferingId={busyOfferingId}
              />
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="admin-card professor-section">
            <div className="admin-section-header">
              <div>
                <h2>Profile</h2>
                <p>Your account information</p>
              </div>
            </div>

            {profileError ? (
              <p className="admin-error">{profileError}</p>
            ) : loadingProfile ? (
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

      <AnimatePresence>
        {isCreateOfferingOpen && (
          <CreateOfferingForm
            isOpen={isCreateOfferingOpen}
            selectedCourse={selectedCourse}
            onClose={handleCloseCreateOffering}
            onSubmit={handleCreateOffering}
            loading={creatingOffering}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditOfferingOpen && (
          <EditOfferingForm
            isOpen={isEditOfferingOpen}
            selectedOffering={selectedOffering}
            onClose={handleCloseEditOffering}
            onSubmit={handleUpdateOffering}
            loading={updatingOffering}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStudentsModalOpen && (
          <OfferingStudentsModal
            isOpen={isStudentsModalOpen}
            selectedOffering={selectedOffering}
            students={students}
            loading={loadingStudents}
            error={studentsError}
            onClose={handleCloseStudentsModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <DeleteOfferingModal
            isOpen={isDeleteModalOpen}
            selectedOffering={selectedOffering}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDeleteOffering}
            loading={deletingOffering}
          />
        )}
      </AnimatePresence>

    </div>
  );
}