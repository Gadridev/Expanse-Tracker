import express from 'express';
import { forgotPassword, login, protect, resetPassword, signup } from '../Controller/AuthController';
import { validate } from '../Middleware/Validator';
import { createUserSchema, loginUserSchema } from '../schema/userSchema';


const Router = express.Router();
// Use POST method for signup
Router.post('/signup', validate(createUserSchema), signup);
Router.post('/login', validate(loginUserSchema), login);
Router.post('/forgotPassword',protect, forgotPassword);
Router.patch('/resetPassword/:token', resetPassword);
Router.get('/protected', protect, (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'You have accessed a protected route!',
    });
  });

export default Router;
