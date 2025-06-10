// controllers/userController.js
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// Get all users
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// Get single user
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Create new user
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse("Email already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  // Exclude password from response
  const userObj = user.toObject();
  delete userObj.password;
  console.log(userObj);
  res.status(201).json({
    success: true,
    data: userObj,
  });
});

// Update user
exports.updateUser = asyncHandler(async (req, res, next) => {
  console.log(req, "users");
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const userId = req.user?._id || req.params.id;

  const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Delete user (soft delete)
// exports.deleteUser = asyncHandler(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.params.id);

//   res.status(200).json({
//     success: true,
//     data: {},
//   });
// });

exports.followUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.user.id;

  if (userId === currentUserId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  const userToFollow = await User.findById(userId);
  const currentUser = await User.findById(currentUserId);

  if (!userToFollow || !currentUser) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!currentUser.following.includes(userId)) {
    currentUser.following.push(userId);
    userToFollow.followers.push(currentUserId);
    await currentUser.save();
    await userToFollow.save();
    return res.status(200).json({ message: "Followed successfully" });
  } else {
    return res.status(400).json({ message: "Already following" });
  }
});

exports.unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.user.id;

  const userToUnfollow = await User.findById(userId);
  const currentUser = await User.findById(currentUserId);

  if (!userToUnfollow || !currentUser) {
    return res.status(404).json({ message: "User not found" });
  }

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== userId
  );
  userToUnfollow.followers = userToUnfollow.followers.filter(
    (id) => id.toString() !== currentUserId
  );

  await currentUser.save();
  await userToUnfollow.save();

  return res.status(200).json({ message: "Unfollowed successfully" });
});

exports.getFollowData = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("followers", "name email") // populate only name and email
      .populate("following", "name email");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
