
function ProfessorCoursesTable({ courses, onAddOffering, busyCourseId }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
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
              <td colSpan="5">
                <div className="admin-empty">No courses found.</div>
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.courseId}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>{course.credits}</td>
                <td>
                  <div className="admin-table-actions">
                    <button
                      className="admin-action-btn soft"
                      onClick={() => onAddOffering(course)}
                      disabled={busyCourseId === course.courseId}
                    >
                      {busyCourseId === course.courseId ? "Opening..." : "Add Offering"}
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

export default ProfessorCoursesTable;