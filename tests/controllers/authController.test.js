const authController = require('../../controllers/authController');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

jest.mock('../../models/User');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            req.body = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };
            const mockUser = {
                _id: '123',
                ...req.body
            };
            User.findOne.mockResolvedValue(null);
            User.prototype.save.mockResolvedValue(mockUser);
            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(null, 'token123');
            });

            await authController.register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ token: 'token123' });
        });

        it('should return 400 if user already exists', async () => {
            req.body = {
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'password123'
            };
            User.findOne.mockResolvedValue({ _id: '123' });

            await authController.register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };
            const mockUser = {
                _id: '123',
                email: 'test@example.com',
                password: 'hashedpassword',
                correctPassword: jest.fn().mockResolvedValue(true)
            };
            User.findOne.mockResolvedValue(mockUser);
            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(null, 'token123');
            });

            await authController.login(req, res, next);

            expect(res.json).toHaveBeenCalledWith({ token: 'token123' });
        });

        it('should return 400 for invalid credentials', async () => {
            req.body = {
                email: 'wrong@example.com',
                password: 'wrongpassword'
            };
            User.findOne.mockResolvedValue(null);

            await authController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
    });
});
