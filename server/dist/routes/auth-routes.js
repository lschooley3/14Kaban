import { Router } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const login = async (req, res) => {
    // TODO: If the user exists and the password is correct, return a JWT token
    const { username, password } = req.body;
    const user = await User.findOne({
        where: {
            username: username,
        },
    });
    if (!user) {
        return res.status(402).json({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    if (!validPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.username } });
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return {
        token,
        user: {
            id: user.id,
            email: user.username,
        },
    };
};
const router = Router();
// POST /login - Login a user
router.post('/login', login);
export default router;
