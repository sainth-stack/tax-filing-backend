import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/users', createUser);
router.post('/users/filter', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/login',loginUser)
export default router;
