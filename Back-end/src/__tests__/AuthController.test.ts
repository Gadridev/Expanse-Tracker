import request from 'supertest';
import app from '../app'; // Adjust the path to your app file
import User from '../Model/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const userId = new mongoose.Types.ObjectId().toHexString();
const userPayload = {
  _id: userId,
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123',
};

const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

describe('AuthController', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await new User(userPayload).save();
  });

  describe('POST /signup', () => {
    it('should create a new user and return a token', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'NewUser',
          email: 'newuser@example.com',
          password: 'Password123',
        })
        .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('_id');
      expect(res.body.data.user.email).toBe('newuser@example.com');
    });
  });

  describe('POST /login', () => {
    it('should log in an existing user and return a token', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: userPayload.email,
          password: userPayload.password,
        })
        .expect(200);

      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      await request(app)
        .post('/api/v1/users/login')
        .send({
          email: userPayload.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('POST /forgotPassword', () => {
    it('should send a password reset token to the user email', async () => {
      const res = await request(app)
        .post('/api/v1/users/forgotPassword')
        .send({ email: userPayload.email })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Password reset token sent!');
    });

    it('should return 404 for non-existing email', async () => {
      await request(app)
        .post('/api/v1/users/forgotPassword')
        .send({ email: 'nonexisting@example.com' })
        .expect(404);
    });
  });

  describe('PATCH /resetPassword/:token', () => {
    it('should reset the user password', async () => {
      const user = await User.findOne({ email: userPayload.email });
      const resetToken = user!.createPasswordResetToken();
      await user!.save({ validateBeforeSave: false });

      const res = await request(app)
        .patch(`/api/v1/users/resetPassword/${resetToken}`)
        .send({
          password: 'newpassword123',
          passwordConfirm: 'newpassword123',
        })
        .expect(200);

      expect(res.body).toHaveProperty('token');
    });

    it('should return 400 for invalid or expired token', async () => {
      await request(app)
        .patch('/api/v1/users/resetPassword/invalidtoken')
        .send({
          password: 'newpassword123',
          passwordConfirm: 'newpassword123',
        })
        .expect(400);
    });
  });

  describe('GET /protected', () => {
    it('should grant access to a protected route with a valid token', async () => {
      const res = await request(app)
        .get('/api/v1/users/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.message).toBe('You have accessed a protected route!');
    });

    it('should return 401 for accessing a protected route without a token', async () => {
      await request(app).get('/api/v1/users/protected').expect(401);
    });
  });
});