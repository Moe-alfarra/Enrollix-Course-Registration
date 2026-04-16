function ProfessorOfferingsTable({
  offerings,
  onViewStudents,
  onEditOffering,
  onDeleteOffering,
  busyOfferingId,
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Credits</th>
            <th>Semester</th>
            <th>Year</th>
            <th>Section</th>
            <th>Capacity</th>
            <th>Enrolled</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {offerings.length === 0 ? (
            <tr>
              <td colSpan="10">
                <div className="admin-empty">No offerings found.</div>
              </td>
            </tr>
          ) : (
            offerings.map((offering) => (
              <tr key={offering.offeringId}>
                <td>{offering.offeringId}</td>
                <td>{offering.courseCode}</td>
                <td>{offering.courseName}</td>
                <td>{offering.credits}</td>
                <td>{offering.semester}</td>
                <td>{offering.year}</td>
                <td>{offering.section}</td>
                <td>{offering.capacity}</td>
                <td>{offering.enrolledCount}</td>
                <td>
                  <div className="admin-table-actions">
                    <button
                      className="admin-action-btn restore"
                      onClick={() => onViewStudents(offering)}
                      disabled={busyOfferingId === offering.offeringId}
                    >
                      Students
                    </button>

                    <button
                      className="admin-action-btn"
                      onClick={() => onEditOffering(offering)}
                      disabled={busyOfferingId === offering.offeringId}
                    >
                      Edit
                    </button>

                    <button
                      className="admin-action-btn danger"
                      onClick={() => onDeleteOffering(offering)}
                      disabled={busyOfferingId === offering.offeringId}
                    >
                      {busyOfferingId === offering.offeringId ? "Deleting..." : "Delete"}
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

export default ProfessorOfferingsTable;