const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    it('create & save user successfully', async () => {
        const validUser = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        const savedUser = await validUser.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(validUser.username);
        expect(savedUser.email).toBe(validUser.email);
    });

    it('insert user with required field missing fails', async () => {
        const userWithoutRequiredField = new User({ username: 'testuser' });
        let err;
        try {
            await userWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});
