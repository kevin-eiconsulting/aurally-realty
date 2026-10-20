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

// GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userRes = await pool.query(`
      SELECT u.id, u.full_name, u.phone, u.email, u.account_status, u.created_at, u.last_login_at,
             COALESCE(array_agg(r.role_key) FILTER (WHERE r.role_key IS NOT NULL), '{}') as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
      GROUP BY u.id;
    `, [userId]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = userRes.rows[0];

    // Aggregate seller & builder stats
    const [propCount, activePropCount, viewsCount, leadsCount, enqCount, favCount, providerRes, bizProfileRes] = await Promise.all([
      pool.query('SELECT count(*) as count FROM properties WHERE owner_user_id = $1;', [userId]),
      pool.query("SELECT count(*) as count FROM properties WHERE owner_user_id = $1 AND listing_status = 'published';", [userId]),
      pool.query("SELECT COALESCE(SUM(views_count), 0) as views FROM properties WHERE owner_user_id = $1;", [userId]),
      pool.query("SELECT count(*) as count FROM enquiries e JOIN properties p ON e.property_id = p.id WHERE p.owner_user_id = $1;", [userId]),
      pool.query('SELECT count(*) as count FROM enquiries WHERE created_by_user_id = $1;', [userId]),
      pool.query('SELECT count(*) as count FROM favourites WHERE user_id = $1;', [userId]),
      pool.query('SELECT * FROM service_providers WHERE user_id = $1 LIMIT 1;', [userId]),
      pool.query('SELECT * FROM business_profiles WHERE owner_user_id = $1 LIMIT 1;', [userId])
    ]);

    return res.json({
      id: user.id,
      username: user.full_name,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      account_status: user.account_status,
      created_at: user.created_at,
      last_login_at: user.last_login_at,
      roles: user.roles,
      isAdmin: user.roles.includes('admin'),
      stats: {
        propertiesCount: parseInt(propCount.rows[0]?.count || 0),
        activePropertiesCount: parseInt(activePropCount.rows[0]?.count || 0),
        totalViews: parseInt(viewsCount.rows[0]?.views || 0),
        leadsReceivedCount: parseInt(leadsCount.rows[0]?.count || 0),
        enquiriesCount: parseInt(enqCount.rows[0]?.count || 0),
        favouritesCount: parseInt(favCount.rows[0]?.count || 0)
      },
      businessProfile: bizProfileRes.rows[0] ? {
        id: bizProfileRes.rows[0].id,
        businessName: bizProfileRes.rows[0].business_name,
        businessSlug: bizProfileRes.rows[0].business_slug,
        businessType: bizProfileRes.rows[0].business_type,
        description: bizProfileRes.rows[0].description,
        reraNumber: bizProfileRes.rows[0].rera_registration_number,
        whatsappNumber: bizProfileRes.rows[0].whatsapp_number,
        phone: bizProfileRes.rows[0].phone,
        email: bizProfileRes.rows[0].email,
        websiteUrl: bizProfileRes.rows[0].website_url
      } : null,
      providerProfile: providerRes.rows[0] || null
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { 
    full_name, 
    email, 
    phone, 
    currentPassword, 
    newPassword,
    company_name,
    business_type,
    rera_number,
    whatsapp_number,
    bio,
    website_url
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verify current user exists
    const userRes = await client.query('SELECT id, password_hash FROM users WHERE id = $1;', [userId]);
    if (userRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found.' });
    }
    const currentUser = userRes.rows[0];

    // Check unique email / phone conflicts
    const cleanPhone = phone ? phone.replace(/\D/g, '') : null;
    if (email || cleanPhone) {
      const conflictRes = await client.query(`
        SELECT id FROM users 
        WHERE id != $1 AND (
          (email IS NOT NULL AND LOWER(email) = LOWER($2))
          OR (phone IS NOT NULL AND phone = $3)
        );
      `, [userId, email || '', cleanPhone || '']);

      if (conflictRes.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'Email or phone number is already in use by another account.' });
      }
    }

    // Password change verification
    let newHash = null;
    if (newPassword) {
      if (newPassword.length < 6) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'New password must be at least 6 characters.' });
      }
      if (currentUser.password_hash && currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, currentUser.password_hash);
        if (!isMatch) {
          await client.query('ROLLBACK');
          return res.status(401).json({ error: 'Current password does not match.' });
        }
      }
      newHash = await bcrypt.hash(newPassword, 10);
    }

    // Perform update on users
    const updateRes = await client.query(`
      UPDATE users SET
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        password_hash = COALESCE($4, password_hash),
        updated_at = NOW()
      WHERE id = $5
      RETURNING id, full_name, email, phone, updated_at;
    `, [full_name?.trim() || null, email?.trim() || null, cleanPhone, newHash, userId]);

    // Handle builder business_profile if company fields passed
    let updatedBiz = null;
    if (company_name !== undefined || rera_number !== undefined || whatsapp_number !== undefined || bio !== undefined || website_url !== undefined) {
      const existingBiz = await client.query('SELECT * FROM business_profiles WHERE owner_user_id = $1 LIMIT 1;', [userId]);
      if (existingBiz.rows.length > 0) {
        const bizRes = await client.query(`
          UPDATE business_profiles SET
            business_name = COALESCE($1, business_name),
            business_type = COALESCE($2, business_type),
            description = COALESCE($3, description),
            rera_registration_number = COALESCE($4, rera_registration_number),
            whatsapp_number = COALESCE($5, whatsapp_number),
            website_url = COALESCE($6, website_url),
            updated_at = NOW()
          WHERE owner_user_id = $7
          RETURNING *;
        `, [
          company_name ? company_name.trim() : null,
          business_type || null,
          bio !== undefined ? bio : null,
          rera_number ? rera_number.trim() : null,
          whatsapp_number ? whatsapp_number.replace(/\D/g, '') : null,
          website_url ? website_url.trim() : null,
          userId
        ]);
        updatedBiz = bizRes.rows[0];
      } else if (company_name && company_name.trim()) {
        const slug = `${company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
        const bizRes = await client.query(`
          INSERT INTO business_profiles (
            owner_user_id, business_name, business_slug, business_type,
            description, rera_registration_number, whatsapp_number, website_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *;
        `, [
          userId,
          company_name.trim(),
          slug,
          business_type || 'builder',
          bio || '',
          rera_number ? rera_number.trim() : null,
          whatsapp_number ? whatsapp_number.replace(/\D/g, '') : null,
          website_url ? website_url.trim() : null
        ]);
        updatedBiz = bizRes.rows[0];
      }
    }

    await client.query('COMMIT');

    const updated = updateRes.rows[0];
    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updated.id,
        username: updated.full_name,
        full_name: updated.full_name,
        email: updated.email,
        phone: updated.phone,
        roles: req.user.roles,
        isAdmin: req.user.isAdmin
      },
      businessProfile: updatedBiz ? {
        id: updatedBiz.id,
        businessName: updatedBiz.business_name,
        businessSlug: updatedBiz.business_slug,
        businessType: updatedBiz.business_type,
        description: updatedBiz.description,
        reraNumber: updatedBiz.rera_registration_number,
        whatsappNumber: updatedBiz.whatsapp_number,
        websiteUrl: updatedBiz.website_url
      } : null
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating profile:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  } finally {
    client.release();
  }
};

// GET /api/auth/favourites
export const getMyFavourites = async (req, res) => {
  try {
    const userId = req.user.id;

    const queryStr = `
      SELECT 
        f.id AS favourite_id,
        f.created_at AS favourited_at,
        p.id,
        p.title,
        p.slug,
        p.price,
        p.listing_type,
        p.property_type,
        p.built_up_area,
        p.bedrooms,
        p.bathrooms,
        p.address_line1,
        loc.name AS area_name,
        COALESCE(pm.file_url, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80') AS image
      FROM favourites f
      JOIN properties p ON f.property_id = p.id
      LEFT JOIN locations loc ON p.location_id = loc.id
      LEFT JOIN LATERAL (
        SELECT file_url FROM property_media 
        WHERE property_id = p.id 
        ORDER BY is_primary DESC, sort_order ASC 
        LIMIT 1
      ) pm ON true
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC;
    `;

    const { rows } = await pool.query(queryStr, [userId]);
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching favourites:', err);
    return res.status(500).json({ error: 'Failed to fetch saved properties.' });
  }
};

// POST /api/auth/favourites/toggle
export const toggleFavourite = async (req, res) => {
  const userId = req.user.id;
  const { property_id, service_listing_id } = req.body;

  if (!property_id && !service_listing_id) {
    return res.status(400).json({ error: 'Target ID required.' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM favourites WHERE user_id = $1 AND property_id = $2;',
      [userId, property_id ? Number(property_id) : null]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM favourites WHERE id = $1;', [existing.rows[0].id]);
      return res.json({ favourited: false, message: 'Removed from saved properties.' });
    } else {
      await pool.query(
        'INSERT INTO favourites (user_id, property_id) VALUES ($1, $2);',
        [userId, Number(property_id)]
      );
      return res.json({ favourited: true, message: 'Added to saved properties.' });
    }
  } catch (err) {
    console.error('Error toggling favourite:', err);
    return res.status(500).json({ error: 'Failed to update favourite.' });
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie('token', cookieOptions);
  return res.json({ message: 'Logged out successfully.' });
};
