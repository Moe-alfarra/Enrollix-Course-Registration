import { motion } from "framer-motion";

function DropEnrollmentModal({
  isOpen,
  selectedEnrollment,
  onClose,
  onConfirm,
  loading,
}) {
  if (!isOpen || !selectedEnrollment) return null;

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
          <h3>Drop Enrollment</h3>
          <button className="admin-close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        <div className="admin-profile-row" style={{ marginBottom: "1rem" }}>
          <span>Enrollment</span>
          <strong>
            {selectedEnrollment.courseCode} - {selectedEnrollment.courseName}
          </strong>
          <div style={{ marginTop: "0.35rem", color: "#64748b" }}>
            {selectedEnrollment.semester} {selectedEnrollment.year} • Section {selectedEnrollment.section}
          </div>
        </div>

        <p style={{ marginBottom: "1.2rem", color: "#475569" }}>
          Are you sure you want to drop this enrollment?
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
            {loading ? "Dropping..." : "Drop"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DropEnrollmentModal;