function StudentEnrollmentsTable({
  enrollments,
  onDrop,
  busyEnrollmentId,
}) {
  const getStatusClass = (status) => {
    if (status === "ACTIVE") return "student-status active";
    if (status === "DROPPED") return "student-status dropped";
    if (status === "COMPLETED") return "student-status completed";
    return "student-status";
  };

  const getStatusDate = (enrollment) => {
    if (enrollment.status === "DROPPED") return enrollment.droppedAt;
    if (enrollment.status === "COMPLETED") return enrollment.completedAt;
    return enrollment.enrolledAt;
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Professor</th>
            <th>Credits</th>
            <th>Semester</th>
            <th>Year</th>
            <th>Section</th>
            <th>Status</th>
            <th>Date</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.length === 0 ? (
            <tr>
              <td colSpan="11">
                <div className="admin-empty">No enrollments found.</div>
              </td>
            </tr>
          ) : (
            enrollments.map((enrollment) => (
              <tr key={enrollment.enrollment_id}>
                <td>{enrollment.courseCode}</td>
                <td>{enrollment.courseName}</td>
                <td>{enrollment.professorName}</td>
                <td>{enrollment.credits}</td>
                <td>{enrollment.semester}</td>
                <td>{enrollment.year}</td>
                <td>{enrollment.section}</td>
                <td>
                  <span className={getStatusClass(enrollment.status)}>
                    {enrollment.status}
                  </span>
                </td>
                <td>{formatDate(getStatusDate(enrollment))}</td>
                <td>{enrollment.grade || "—"}</td>
                <td>
                  <div className="admin-table-actions">
                    <button
                      className="admin-action-btn soft"
                      onClick={() => onDrop(enrollment)}
                      disabled={
                        enrollment.status !== "ACTIVE" ||
                        busyEnrollmentId === enrollment.enrollment_id
                      }
                    >
                      {busyEnrollmentId === enrollment.enrollment_id
                        ? "Dropping..."
                        : enrollment.status === "ACTIVE"
                        ? "Drop"
                        : "Locked"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentEnrollmentsTable;