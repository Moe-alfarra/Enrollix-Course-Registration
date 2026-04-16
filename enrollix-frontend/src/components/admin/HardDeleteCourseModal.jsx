import { motion } from "framer-motion";

function HardDeleteCourseModal({
  isOpen,
  selectedCourse,
  onClose,
  onConfirm,
  loading,
}) {
  if (!isOpen || !selectedCourse) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <motion.div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <div className="admin-modal-header">
          <h3>Hard Delete Course</h3>
          <button className="admin-close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        <div className="admin-profile-row" style={{ marginBottom: "1rem" }}>
          <span>Course</span>
          <strong>
            {selectedCourse.code} - {selectedCourse.name}
          </strong>
          <div style={{ marginTop: "0.35rem", color: "#64748b" }}>
            Credits: {selectedCourse.credits}
          </div>
        </div>

        <p style={{ marginBottom: "1.2rem", color: "#475569" }}>
          Are you sure you want to permanently delete this course? This action cannot be undone.
        </p>

        <div className="admin-table-actions">
          <button
            className="admin-action-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="admin-action-btn danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Hard Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default HardDeleteCourseModal;