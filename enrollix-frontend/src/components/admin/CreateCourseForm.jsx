import { useState } from "react";
import { motion } from "framer-motion";
import { createCourse } from "../../api/adminApi";

function CreateCourseForm({ onClose, onCreated, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    credits: "",
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
    setLoading(true);

    try {
      await createCourse({
        ...formData,
        credits: Number(formData.credits),
      });

      onSuccess("Course created successfully");

      try {
        await onCreated();
      } catch {
        // ignore refresh issues
      }

      onClose();
    } catch (err) {
      onError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create course"
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
          <h3>Add Course</h3>
          <button className="admin-close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            name="code"
            placeholder="Course Code"
            value={formData.code}
            onChange={handleChange}
            required
          />

          <input
            name="name"
            placeholder="Course Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            name="credits"
            type="number"
            min="1"
            placeholder="Credits"
            value={formData.credits}
            onChange={handleChange}
            required
          />

          {/* ✅ Buttons aligned like professor */}
          <div className="admin-table-actions" style={{ marginTop: "1rem" }}>
            <button
              className="admin-primary-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Course"}
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

export default CreateCourseForm;