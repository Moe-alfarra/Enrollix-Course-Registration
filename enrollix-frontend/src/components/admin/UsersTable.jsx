function UsersTable({ users, onDelete, busyUserId }) {
  const getRoleClass = (role) => {
    if (role === "ADMIN") return "admin";
    if (role === "PROFESSOR") return "professor";
    return "student";
  };

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5">
                <div className="admin-empty">No users found</div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${getRoleClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button
                      className="admin-action-btn danger"
                      onClick={() => onDelete(user)}
                      disabled={user.role === "ADMIN" || busyUserId === user.userId}
                    >
                      {busyUserId === user.userId ? "Deleting..." : "Delete"}
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

export default UsersTable;