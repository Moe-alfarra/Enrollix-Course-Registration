import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  deleteUser,
  getAdminCourses,
  getAdminDeletedCourses,
  getAdminProfile,
  getAdminUsers,
  hardDeleteCourse,
  restoreCourse,
  softDeleteCourse,
} from "../../api/adminApi";
import CreateCourseForm from "../../components/admin/CreateCourseForm";
import CreateUserForm from "../../components/admin/CreateUserForm";
import CoursesTable from "../../components/admin/CourseTable";
import DeletedCoursesTable from "../../components/admin/DeletedCourseTable";
import UsersTable from "../../components/admin/UsersTable";
import DeleteUserModal from "../../components/admin/DeleteUserModal";
import HardDeleteCourseModal from "../../components/admin/HardDeleteCourseModal";
import Toast from "../../components/Toast";
import "./admin.css";

function AdminDashboard() {
  const { logout, user } = useAuth();

  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [deletedCourses, setDeletedCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingDeletedCourses, setLoadingDeletedCourses] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const [busyCourseId, setBusyCourseId] = useState(null);
  const [busyUserId, setBusyUserId] = useState(null);

  const [courseSearch, setCourseSearch] = useState("");
  const [deletedCourseSearch, setDeletedCourseSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const [toast, setToast] = useState({ type: "", message: "" });

  const showSuccess = (message) => setToast({ type: "success", message });
  const showError = (message) => setToast({ type: "error", message });
  const clearToast = () => setToast({ type: "", message: "" });

  const [courseSort, setCourseSort] = useState("id");
  const [deletedCourseSort, setDeletedCourseSort] = useState("id");
  const [userSort, setUserSort] = useState("id");

  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showHardDeleteCourseModal, setShowHardDeleteCourseModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const data = await getAdminCourses();
      setCourses(data);
    } catch {
      showError("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadDeletedCourses = async () => {
    setLoadingDeletedCourses(true);
    try {
      const data = await getAdminDeletedCourses();
      setDeletedCourses(data);
    } catch {
      showError("Failed to load deleted courses");
    } finally {
      setLoadingDeletedCourses(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch {
      showError("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const data = await getAdminProfile();
      setProfile(data);
    } catch {
      showError("Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadCourses();
    loadDeletedCourses();
    loadUsers();
    loadProfile();
  }, []);

//   useEffect(() => {
//     if (activeTab === "users") {
//       loadUsers();
//     }
//   }, [activeTab]);

  useEffect(() => {
    if (!toast.message) return;

    const timer = setTimeout(() => {
      clearToast();
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast.message]);

  const filteredCourses = useMemo(() => {
    const q = courseSearch.toLowerCase().trim();

    const filtered = courses.filter(
      (course) =>
        course.code.toLowerCase().includes(q) ||
        course.name.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q)
    );

    return [...filtered].sort((a, b) => {
      if (courseSort === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.courseId - b.courseId;
    });
  }, [courses, courseSearch, courseSort]);

  const filteredDeletedCourses = useMemo(() => {
    const q = deletedCourseSearch.toLowerCase().trim();

    const filtered = deletedCourses.filter(
      (course) =>
        course.code.toLowerCase().includes(q) ||
        course.name.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q)
    );

    return [...filtered].sort((a, b) => {
      if (deletedCourseSort === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.courseId - b.courseId;
    });
  }, [deletedCourses, deletedCourseSearch, deletedCourseSort]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();

    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );

    return [...filtered].sort((a, b) => {
      if (userSort === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.userId - b.userId;
    });
  }, [users, userSearch, userSort]);

  const handleSoftDelete = async (courseId) => {
    setBusyCourseId(courseId);
    try {
      await softDeleteCourse(courseId);
      showSuccess("Course deleted successfully");
      await loadCourses();
      await loadDeletedCourses();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete course");
    } finally {
      setBusyCourseId(null);
    }
  };

  const handleRestoreCourse = async (courseId) => {
    setBusyCourseId(courseId);
    try {
      await restoreCourse(courseId);
      showSuccess("Course restored successfully");
      await loadDeletedCourses();
      await loadCourses();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to restore course");
    } finally {
      setBusyCourseId(null);
    }
  };

  const handleOpenHardDeleteCourseModal = (course) => {
    setSelectedCourse(course);
    setShowHardDeleteCourseModal(true);
  };

  const handleCloseHardDeleteCourseModal = () => {
    if (busyCourseId) return;
    setShowHardDeleteCourseModal(false);
    setSelectedCourse(null);
  };

  const handleConfirmHardDeleteCourse = async () => {
    if (!selectedCourse) return;

    setBusyCourseId(selectedCourse.courseId);
    try {
      await hardDeleteCourse(selectedCourse.courseId);
      showSuccess("Course permanently deleted");
      await loadDeletedCourses();
      await loadCourses();
      setShowHardDeleteCourseModal(false);
      setSelectedCourse(null);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to permanently delete course");
    } finally {
      setBusyCourseId(null);
    }
  };

  const handleOpenDeleteUserModal = (user) => {
    setSelectedUser(user);
    setShowDeleteUserModal(true);
  };

  const handleCloseDeleteUserModal = () => {
    if (busyUserId) return;
    setShowDeleteUserModal(false);
    setSelectedUser(null);
  };

  const handleConfirmDeleteUser = async () => {
    if (!selectedUser) return;

    setBusyUserId(selectedUser.userId);
    try {
      await deleteUser(selectedUser.userId);
      showSuccess("User deleted successfully");
      await loadUsers();
      setShowDeleteUserModal(false);
      setSelectedUser(null);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setBusyUserId(null);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "courses") {
      return (
        <div className="admin-card">
          <div className="admin-section-header">
            <div>
              <h2>Courses</h2>
              <p>Manage active courses in the catalog</p>
            </div>
            <button
              className="admin-primary-btn"
              onClick={() => setShowCreateCourseModal(true)}
            >
              Add Course
            </button>
          </div>

          <div className="admin-filter-row">
            <input
              className="admin-search"
              placeholder="Search courses..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
            />

            <button
              className="admin-sort-btn"
              onClick={() =>
                setCourseSort((prev) => (prev === "id" ? "name" : "id"))
              }
            >
              {courseSort === "id" ? "Sort: ID" : "Sort: Name"}
            </button>
          </div>

          {loadingCourses ? (
            <div className="admin-loading">Loading courses...</div>
          ) : (
            <CoursesTable
              courses={filteredCourses}
              onSoftDelete={handleSoftDelete}
              busyCourseId={busyCourseId}
            />
          )}
        </div>
      );
    }

    if (activeTab === "deletedCourses") {
      return (
        <div className="admin-card">
          <div className="admin-section-header">
            <div>
              <h2>Deleted Courses</h2>
              <p>Restore or permanently remove deleted courses</p>
            </div>
          </div>

          <div className="admin-filter-row">
            <input
              className="admin-search"
              placeholder="Search deleted courses..."
              value={deletedCourseSearch}
              onChange={(e) => setDeletedCourseSearch(e.target.value)}
            />

            <button
              className="admin-sort-btn"
              onClick={() =>
                setDeletedCourseSort((prev) => (prev === "id" ? "name" : "id"))
              }
            >
              {deletedCourseSort === "id" ? "Sort: ID" : "Sort: Name"}
            </button>
          </div>

          {loadingDeletedCourses ? (
            <div className="admin-loading">Loading deleted courses...</div>
          ) : (
            <DeletedCoursesTable
              courses={filteredDeletedCourses}
              onRestore={handleRestoreCourse}
              onHardDelete={handleOpenHardDeleteCourseModal}
              busyCourseId={busyCourseId}
            />
          )}
        </div>
      );
    }

    if (activeTab === "users") {
      return (
        <div className="admin-card">
          <div className="admin-section-header">
            <div>
              <h2>Users</h2>
              <p>View and manage students, professors, and admins</p>
            </div>
            <button
              className="admin-primary-btn"
              onClick={() => setShowCreateUserModal(true)}
            >
              Add User
            </button>
          </div>

          <div className="admin-filter-row">
            <input
              className="admin-search"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />

            <button
              className="admin-sort-btn"
              onClick={() =>
                setUserSort((prev) => (prev === "id" ? "name" : "id"))
              }
            >
              {userSort === "id" ? "Sort: ID" : "Sort: Name"}
            </button>
          </div>

          {loadingUsers ? (
            <div className="admin-loading">Loading users...</div>
          ) : (
            <UsersTable
              users={filteredUsers}
              onDelete={handleOpenDeleteUserModal}
              busyUserId={busyUserId}
            />
          )}
        </div>
      );
    }

    return (
      <div className="admin-card">
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
              <strong>••••••••</strong>
            </div>
          </div>
        ) : (
          <div className="admin-empty">No profile data found.</div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-page">
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
            <h1>Enrollix Admin</h1>
            <p>Manage courses, users, and platform operations</p>
          </div>

          <div className="admin-actions">
            <div className="admin-profile-chip">
              <span>Signed in as</span>
              <strong>{user?.name || "Administrator"}</strong>
            </div>

            <button className="admin-logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            Courses
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "deletedCourses" ? "active" : ""}`}
            onClick={() => setActiveTab("deletedCourses")}
          >
            Deleted Courses
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>

        {renderTabContent()}

        <AnimatePresence>
          {showCreateCourseModal && (
            <CreateCourseForm
              onClose={() => setShowCreateCourseModal(false)}
              onCreated={loadCourses}
              onSuccess={showSuccess}
              onError={showError}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCreateUserModal && (
            <CreateUserForm
              onClose={() => setShowCreateUserModal(false)}
              onCreated={loadUsers}
              onSuccess={showSuccess}
              onError={showError}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDeleteUserModal && (
            <DeleteUserModal
              isOpen={showDeleteUserModal}
              selectedUser={selectedUser}
              onClose={handleCloseDeleteUserModal}
              onConfirm={handleConfirmDeleteUser}
              loading={!!busyUserId}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHardDeleteCourseModal && (
            <HardDeleteCourseModal
              isOpen={showHardDeleteCourseModal}
              selectedCourse={selectedCourse}
              onClose={handleCloseHardDeleteCourseModal}
              onConfirm={handleConfirmHardDeleteCourse}
              loading={!!busyCourseId}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminDashboard;