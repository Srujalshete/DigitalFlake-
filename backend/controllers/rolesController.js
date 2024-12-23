const db = require("../config/db");

// Add a new role
const addRole = async (req, res) => {
  const { role_name, status } = req.body;

  if (!role_name || role_name.trim() === "") {
    return res
      .status(400)
      .json({ message: "Role name is required and cannot be empty." });
  }

  try {
    // Check if the role already exists
    const [existingRole] = await db
      .promise()
      .query("SELECT * FROM roles WHERE role_name = ?", [role_name]);

    if (existingRole.length > 0) {
      return res.status(400).json({ message: "Role already exists." });
    }

    // Insert the new role into the database
    const [result] = await db
      .promise()
      .query("INSERT INTO roles (role_name, status) VALUES (?, ?)", [
        role_name,
        status || "Active",
      ]);

    return res.status(201).json({
      message: "Role added successfully.",
      roleId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error.",
      error: err.message,
    });
  }
};

const getRoles = async (req, res) => {
  try {
    // Fetch roles from the database
    const [rows] = await db
      .promise()
      .query("SELECT id, role_name, status FROM roles");

    // If no roles found, you can return a custom message
    if (rows.length === 0) {
      return res.status(404).json({ message: "No roles found." });
    }

    // Send the fetched data as a response
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching roles:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getRoleById = async (req, res) => {
  const { id } = req.params; // Get the role ID from the URL parameters

  // Validate that the ID is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    // Query to fetch the role by ID
    const [roles] = await db
      .promise()
      .query("SELECT id, role_name, status FROM roles WHERE id = ?", [id]);

    // If no role found with the given ID
    if (roles.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Return the fetched role as a JSON response
    return res.json(roles[0]);
  } catch (error) {
    console.error("Error fetching role by ID:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { role_name, status } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (!role_name || !status) {
    return res
      .status(400)
      .json({ message: "Role name and status are required" });
  }

  try {
    const result = await db.execute(
      "UPDATE roles SET role_name = ?, status = ? WHERE id = ?",
      [role_name, status, id]
    );

    console.log(result);

    if (result && result[0] && result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const deleteRole = (req, res) => {
  const roleId = req.params.id;

  const query = "DELETE FROM roles WHERE id = ?";

  db.query(query, [roleId], (err, result) => {
    if (err) {
      console.error("Error deleting role:", err);
      return res.status(500).json({ message: "Failed to delete role" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json({ message: "Role deleted successfully" });
  });
};

module.exports = { addRole, getRoles, getRoleById, updateRole, deleteRole };
