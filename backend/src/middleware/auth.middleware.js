import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user with their roles from PostgreSQL
    const userQuery = `
      SELECT u.id, u.full_name, u.phone, u.email, u.account_status,
             COALESCE(array_agg(r.role_key) FILTER (WHERE r.role_key IS NOT NULL), '{}') as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
      GROUP BY u.id;
    `;
    const { rows } = await pool.query(userQuery, [decoded.id]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    const user = rows[0];
    if (user.account_status === 'suspended' || user.account_status === 'closed') {
      return res.status(403).json({ error: 'Account is suspended or closed.' });
    }

    req.user = {
      id: user.id,
      name: user.full_name,
      phone: user.phone,
      email: user.email,
      roles: user.roles,
      isAdmin: user.roles.includes('admin')
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { rows } = await pool.query(
        `SELECT u.id, u.full_name, u.phone, u.email,
                COALESCE(array_agg(r.role_key) FILTER (WHERE r.role_key IS NOT NULL), '{}') as roles
         FROM users u
         LEFT JOIN user_roles ur ON u.id = ur.user_id
         LEFT JOIN roles r ON ur.role_id = r.id
         WHERE u.id = $1 GROUP BY u.id;`,
        [decoded.id]
      );
      if (rows.length > 0) {
        req.user = {
          id: rows[0].id,
          name: rows[0].full_name,
          phone: rows[0].phone,
          email: rows[0].email,
          roles: rows[0].roles,
          isAdmin: rows[0].roles.includes('admin')
        };
      }
    }
  } catch (_) {
    // Ignore invalid tokens for optional auth
  }
  next();
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!req.user.roles || (!req.user.roles.includes(role) && !req.user.roles.includes('admin'))) {
      return res.status(403).json({ error: `Forbidden: requires '${role}' role.` });
    }
    next();
  };
};
