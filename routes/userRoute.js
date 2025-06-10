const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  // deleteUser,
  followUser,
  unfollowUser,
  getFollowData,
} = require("../controllers/userController");

const router = express.Router();

router.use(protect);

router.get("/", protect, getUsers);
router.get("/:id", protect, getUser);

router.post("/createuser", protect, createUser);
router.put("/me", protect, updateUser);

// router.put("/deleteuser", protect, deleteUser);

router.post("/follow", protect, followUser);
router.post("/unfollow", protect, unfollowUser);
router.get("/:userId/follow-data", protect, getFollowData);

module.exports = router;
