const db = require("../config/db");
const multer = require("multer");
const path = require("path");

exports.getRoles = (req, res) => {
  const query = "SELECT id, role_name, status FROM roles";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching roles" });
    }
    res.status(200).json(results);
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.createUser = (req, res) => {
  const { name, mobile, email, role_id, status } = req.body;
  const profileImage = req.file ? req.file.filename : null;
  const checkEmailQuery = "SELECT COUNT(*) AS count FROM users WHERE email = ?";

  db.execute(checkEmailQuery, [email], (err, result) => {
    if (err) {
      console.error("Error checking email existence:", err);
      return res
        .status(500)
        .json({ message: "Error checking email existence", error: err });
    }

    if (result[0].count > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const query = `INSERT INTO users (name, mobile, email, role_id, status, profile_image, created_at, updated_at) 
                   VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    db.execute(
      query,
      [name, mobile, email, role_id, status, profileImage],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into the database:", err);
          return res
            .status(500)
            .json({ message: "Error inserting data", error: err });
        }

        res.status(201).json({
          message: "User created successfully",
          userId: result.insertId,
        });
      }
    );
  });
};

exports.getUsers = async (req, res) => {
  try {
    const query = "SELECT id, name, mobile, email, role_id, status FROM users";

    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Server Error" });
      }

      res.status(200).json({ success: true, users: results });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  // Validate that the ID is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    // Query to fetch the user by ID and join with the roles table to get the role name
    const [user] = await db.promise().query(
      `SELECT u.id, u.name, u.mobile, u.email, r.role_name, u.profile_image, u.status 
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [id]
    );

    // If no user found with the given ID
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the fetched user as a JSON response
    return res.json(user[0]);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, mobile, email, role_id, status, existingProfileImage } =
    req.body;

  // Check if all required fields are provided
  if (!name || !mobile || !email || !role_id || !status) {
    return res
      .status(400)
      .json({
        message:
          "All fields (name, mobile, email, role_id, status) are required",
      });
  }

  // Handle file upload if present
  const profileImage = req.file ? req.file.filename : existingProfileImage;

  // Check if the user exists
  const checkUserQuery = "SELECT COUNT(*) AS count FROM users WHERE id = ?";
  db.execute(checkUserQuery, [id], (err, result) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res
        .status(500)
        .json({ message: "Error checking user existence", error: err });
    }

    if (result[0].count === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate role_id
    const validateRoleQuery = "SELECT id FROM roles WHERE id = ?";
    db.execute(validateRoleQuery, [role_id], (err, roleResult) => {
      if (err) {
        console.error("Error validating role_id:", err);
        return res
          .status(500)
          .json({ message: "Error validating role ID", error: err });
      }

      if (roleResult.length === 0) {
        return res.status(400).json({ message: "Invalid role_id" });
      }

      // Update user data
      const updateQuery = `
        UPDATE users 
        SET name = ?, mobile = ?, email = ?, role_id = ?, status = ?, profile_image = ?, updated_at = NOW() 
        WHERE id = ?
      `;
      const newProfileImage =
        profileImage || existingProfileImage || "default-profile.jpg";

      db.execute(
        updateQuery,
        [name, mobile, email, role_id, status, newProfileImage, id],
        (err, result) => {
          if (err) {
            console.error("Error updating user data:", err);
            return res
              .status(500)
              .json({ message: "Error updating user", error: err });
          }

          if (result.affectedRows === 0) {
            return res
              .status(400)
              .json({ message: "No changes made to the user" });
          }

          res.status(200).json({
            message: "User updated successfully",
            userId: id,
          });
        }
      );
    });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM users WHERE id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Failed to delete user" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};
