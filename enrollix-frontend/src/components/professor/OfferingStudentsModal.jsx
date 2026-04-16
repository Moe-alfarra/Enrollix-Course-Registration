import { motion } from "framer-motion";
function OfferingStudentsModal({
  isOpen,
  selectedOffering,
  students,
  loading,
  error,
  onClose,
}) {
  if (!isOpen || !selectedOffering) return null;

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
          <h3>Enrolled Students</h3>
          <button className="admin-close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        <div className="admin-profile-row" style={{ marginBottom: "1rem" }}>
          <span>Offering</span>
          <strong>
            {selectedOffering.courseCode} - {selectedOffering.courseName}
          </strong>
          <div style={{ marginTop: "0.35rem", color: "#64748b" }}>
            {selectedOffering.semester} {selectedOffering.year} • Section {selectedOffering.section}
          </div>
        </div>

        {error ? (
          <div className="admin-error">{error}</div>
        ) : loading ? (
          <div className="admin-loading">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="admin-empty">No students enrolled in this offering.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Enrolled At</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.status}</td>
                    <td>{new Date(student.enrolledAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="admin-table-actions" style={{ marginTop: "1rem" }}>
          <button className="admin-action-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default OfferingStudentsModal;