import { signToken } from '../middlewares/auth.js';
import User from '../models/employeeModel.js';

export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      hireDate,
      gender,
      status,
      inactiveDate,
      email,
      mobileNumber,
      sameAsWhatsappNumber,
      whatsappNumber,
      company,
      role,
      agency,
    } = req.body;

    const user = new User({
      firstName,
      lastName,
      hireDate,
      gender,
      status,
      inactiveDate,
      email,
      mobileNumber,
      sameAsWhatsappNumber,
      whatsappNumber,
      company,
      role,
      agency,
    });

    await user.save();

    return res.status(201).send({
      success: true,
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(400).json({ error: 'Email address already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// Get all users

export const getUsers = async (req, res) => {
  const { name } = req.body;
  console.log(name)
  try {
    // Initialize an empty filter object
    const filter = {};

    // Add name filter if provided
    if (name) {
      filter['$or'] = [
        { firstName: { $regex: name, $options: 'i' } }, // Case-insensitive match for first name
        { lastName: { $regex: name, $options: 'i' } }  // Case-insensitive match for last name
      ];
    }

    // Fetch users based on the filter criteria (if any)
    const users = await User.find(filter);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const loginUser = async (req, res) => {
  // #swagger.tags = ['User Management']
  const user = await User.findOne({
    "email": req.body.email,
  });
  if (user) {
    const user2 = await User.findOne({
      "email": req.body.email,
      "status": true,
    });
    if (user2) {
      const token = signToken(user);
      res.send({
        token,
        ...user2
      });
    }
  }
  else {
    res.status(401).send({
      message: "Your Account Is Not Verified",
    });
  }
};