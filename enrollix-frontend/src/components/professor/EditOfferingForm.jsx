import { useEffect, useState } from "react";
import { motion } from "framer-motion";
function EditOfferingForm({
  isOpen,
  selectedOffering,
  onClose,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    semester: "FALL",
    year: new Date().getFullYear(),
    section: "",
    capacity: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && selectedOffering) {
      setFormData({
        semester: selectedOffering.semester || "FALL",
        year: selectedOffering.year || new Date().getFullYear(),
        section: selectedOffering.section || "",
        capacity: selectedOffering.capacity || "",
      });
      setError("");
    }
  }, [isOpen, selectedOffering]);

  if (!isOpen || !selectedOffering) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const currentYear = new Date().getFullYear();

    if (!formData.section.trim()) {
      setError("Section is required");
      return;
    }

    if (Number(formData.year) < currentYear) {
      setError("Year cannot be in the past");
      return;
    }

    if (!formData.capacity || Number(formData.capacity) < 1) {
      setError("Capacity must be at least 1");
      return;
    }

    try {
      await onSubmit({
        semester: formData.semester,
        year: Number(formData.year),
        section: formData.section.trim(),
        capacity: Number(formData.capacity),
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update offering");
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
          <h3>Edit Offering</h3>
          <button className="admin-close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        <div className="admin-profile-row" style={{ marginBottom: "1rem" }}>
          <span>Course</span>
          <strong>
            {selectedOffering.courseCode} - {selectedOffering.courseName}
          </strong>
          <div style={{ marginTop: "0.35rem", color: "#64748b" }}>
            Enrolled Students: {selectedOffering.enrolledCount}
          </div>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
          >
            <option value="FALL">FALL</option>
            <option value="SPRING">SPRING</option>
            <option value="SUMMER">SUMMER</option>
          </select>

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            min={new Date().getFullYear()}
            required
          />

          <input
            type="text"
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            required
          />

          {error && <div className="admin-error">{error}</div>}

          <div className="admin-table-actions" style={{ marginTop: "1rem" }}>
            <button
              type="submit"
              className="admin-primary-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Offering"}
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

export default EditOfferingForm;