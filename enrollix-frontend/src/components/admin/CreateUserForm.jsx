import { motion } from "framer-motion";
import { useState } from "react";
import { createUser } from "../../api/adminApi";

function CreateUserForm({ onClose, onCreated, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      onError("Please select a role");
      return;
    }

    setLoading(true);

    try {
      await createUser(formData);
      onSuccess("User created successfully");

      try {
        await onCreated();
      } catch {
        // ignore refresh issues here so success stays success
      }

      onClose();
    } catch (err) {
      onError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

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
          <h3>Add User</h3>
          <button className="admin-close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="STUDENT">Student</option>
            <option value="PROFESSOR">Professor</option>
            <option value="ADMIN">Admin</option>
          </select>

          <div className="admin-table-actions" style={{ marginTop: "1rem" }}>
            <button className="admin-primary-btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </button>

            <button
              type="button"
              className="admin-action-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateUserForm;