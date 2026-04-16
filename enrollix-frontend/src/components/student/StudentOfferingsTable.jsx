function StudentOfferingsTable({
  offerings,
  activeEnrollmentOfferingIds,
  onEnroll,
  busyOfferingId,
}) {
  const getAvailableSeats = (offering) => {
    return Math.max(0, offering.capacity - offering.enrolledCount);
  };

  const isEnrolled = (offeringId) => {
    return activeEnrollmentOfferingIds.includes(offeringId);
  };

  const getButtonLabel = (offering) => {
    if (isEnrolled(offering.offeringId)) return "Enrolled";
    if (getAvailableSeats(offering) <= 0) return "Full";
    return "Enroll";
  };

  const getButtonClass = (offering) => {
    if (isEnrolled(offering.offeringId)) return "admin-action-btn gray";
    if (getAvailableSeats(offering) <= 0) return "admin-action-btn soft";
    return "admin-action-btn restore";
  };

  const isDisabled = (offering) => {
    return isEnrolled(offering.offeringId) || getAvailableSeats(offering) <= 0;
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
            <th>Capacity</th>
            <th>Enrolled</th>
            <th>Seats Left</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {offerings.length === 0 ? (
            <tr>
              <td colSpan="11">
                <div className="admin-empty">No offerings found.</div>
              </td>
            </tr>
          ) : (
            offerings.map((offering) => {
              const availableSeats = getAvailableSeats(offering);

              return (
                <tr key={offering.offeringId}>
                  <td>{offering.courseCode}</td>
                  <td>{offering.courseName}</td>
                  <td>{offering.professorName}</td>
                  <td>{offering.credits}</td>
                  <td>{offering.semester}</td>
                  <td>{offering.year}</td>
                  <td>{offering.section}</td>
                  <td>{offering.capacity}</td>
                  <td>{offering.enrolledCount}</td>
                  <td>{availableSeats <= 0 ? "Full" : availableSeats}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className={getButtonClass(offering)}
                        onClick={() => onEnroll(offering.offeringId)}
                        disabled={busyOfferingId === offering.offeringId || isDisabled(offering)}
                      >
                        {busyOfferingId === offering.offeringId
                          ? "Enrolling..."
                          : getButtonLabel(offering)}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentOfferingsTable;