import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// POST /api/auth/signup
export const signup = async (req, res) => {
  const { phone, username, password, email } = req.body;

  if (!phone && !email) {
    return res.status(400).json({ error: 'Phone or email is required.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const cleanPhone = phone ? phone.replace(/\D/g, '') : null;
  const fullName = username ? username.trim() : 'User';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if phone or email already registered
    const existing = await client.query(
      'SELECT id FROM users WHERE (phone IS NOT NULL AND phone = $1) OR (email IS NOT NULL AND LOWER(email) = LOWER($2));',
      [cleanPhone, email || '']
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Account with this phone or email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userRes = await client.query(
      `INSERT INTO users (full_name, phone, email, password_hash, account_status)
       VALUES ($1, $2, $3, $4, 'active')
       RETURNING id, full_name, phone, email, created_at;`,
      [fullName, cleanPhone, email || null, passwordHash]
    );
    const user = userRes.rows[0];

    // Assign default role 'customer'
    const roleRes = await client.query("SELECT id FROM roles WHERE role_key = 'customer';");
    if (roleRes.rows.length > 0) {
      await client.query(
        'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2);',
        [user.id, roleRes.rows[0].id]
      );
    }

    await client.query('COMMIT');

    const token = generateToken(user.id);
    res.cookie('token', token, cookieOptions);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.full_name,
        phone: user.phone,
        email: user.email,
        isAdmin: false,
        roles: ['customer']
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Failed to create account.' });
  } finally {
    client.release();
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { phone, email, password } = req.body;

  if ((!phone && !email) || !password) {
    return res.status(400).json({ error: 'Phone/email and password are required.' });
  }

  const cleanPhone = phone ? phone.replace(/\D/g, '') : null;

  try {
    const userQuery = `
      SELECT u.id, u.full_name, u.phone, u.email, u.password_hash, u.account_status,
             COALESCE(array_agg(r.role_key) FILTER (WHERE r.role_key IS NOT NULL), '{}') as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE (u.phone IS NOT NULL AND u.phone = $1)
         OR (u.email IS NOT NULL AND LOWER(u.email) = LOWER($2))
      GROUP BY u.id;
    `;
    const { rows } = await pool.query(userQuery, [cleanPhone, email || '']);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const user = rows[0];

    if (!user.password_hash) {
      return res.status(401).json({ error: 'Invalid login method. Please reset password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid phone or password.' });
    }

    if (user.account_status === 'suspended' || user.account_status === 'closed') {
      return res.status(403).json({ error: 'Account has been suspended or closed.' });
    }

    // Update last_login_at
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1;', [user.id]);

    const token = generateToken(user.id);
    res.cookie('token', token, cookieOptions);

    const isAdmin = user.roles.includes('admin');

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.full_name,
        phone: user.phone,
        email: user.email,
        isAdmin,
        roles: user.roles
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
};

// GET /api/auth/me
export const getCurrentUser = async (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      username: req.user.name,
      phone: req.user.phone,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      roles: req.user.roles
    }
  });
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie('token', cookieOptions);
  return res.json({ message: 'Logged out successfully.' });
};
