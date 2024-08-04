import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/environment.js';

export const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: '2d',
    }
  );
};

export const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

