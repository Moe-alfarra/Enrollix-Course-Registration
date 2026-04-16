function DeletedCoursesTable({ courses, onRestore, onHardDelete, busyCourseId }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Description</th>
            <th>Credits</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="6">
                <div className="admin-empty">No deleted courses found</div>
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.courseId}>
                <td>{course.courseId}</td>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>{course.credits}</td>
                <td>
                  <div className="admin-table-actions">
                    <button
                      className="admin-action-btn restore"
                      onClick={() => onRestore(course.courseId)}
                      disabled={busyCourseId === course.courseId}
                    >
                      {busyCourseId === course.courseId ? "Restoring..." : "Restore"}
                    </button>

                    <button
                      className="admin-action-btn danger"
                      onClick={() => onHardDelete(course)}
                      disabled={busyCourseId === course.courseId}
                    >
                      {busyCourseId === course.courseId ? "Deleting..." : "Hard Delete"}
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

export default DeletedCoursesTable;