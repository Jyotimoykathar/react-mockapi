import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// REPLACE THIS WITH YOUR MOCKAPI URL
const API_URL = "https://68fb520094ec960660259feb.mockapi.io/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all users (GET)
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      showMessage("Error fetching users!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create user (POST)
  const createUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showMessage("Please fill all fields!", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API_URL, formData);
      setUsers([...users, response.data]);
      setFormData({ name: "", email: "" });
      showMessage("User created successfully!", "success");
    } catch (error) {
      showMessage("Error creating user!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update user (PUT)
  const updateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showMessage("Please fill all fields!", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${editingId}`, formData);
      setUsers(
        users.map((user) => (user.id === editingId ? response.data : user))
      );
      setFormData({ name: "", email: "" });
      setEditingId(null);
      showMessage("User updated successfully!", "success");
    } catch (error) {
      showMessage("Error updating user!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete user (DELETE)
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      showMessage("User deleted successfully!", "success");
    } catch (error) {
      showMessage("Error deleting user!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Set user for editing
  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", email: "" });
  };

  // Show message
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="page-title">Simple CRUD App</h1>

        {/* Toast Message */}
        {message && (
          <div
            className={`toast-message animate-slide-in ${
              message.type === "success" ? "toast-success" : "toast-error"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="card animate-slide-in">
          <h2 className="section-title">
            {editingId ? "Edit User" : "Add New User"}
          </h2>
          <form onSubmit={editingId ? updateUser : createUser}>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="btn-group">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading
                  ? "Processing..."
                  : editingId
                  ? "Update User"
                  : "Add User"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="card">
          <h2 className="section-title">Users List</h2>
          {loading && users.length === 0 ? (
            <p className="loading-state">Loading...</p>
          ) : users.length === 0 ? (
            <p className="empty-state">No users found. Add one above!</p>
          ) : (
            <div className="users-list">
              {users.map((user) => (
                <div key={user.id} className="user-item animate-slide-in">
                  <div className="user-info">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="user-actions">
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
