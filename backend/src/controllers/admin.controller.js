import { pool } from '../config/db.js';

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const [propsRes, usersRes, activePropsRes, pendingPropsRes, enquiriesRes] = await Promise.all([
      pool.query('SELECT COUNT(*)::int as count FROM properties;'),
      pool.query('SELECT COUNT(*)::int as count FROM users;'),
      pool.query("SELECT COUNT(*)::int as count FROM properties WHERE listing_status = 'published';"),
      pool.query("SELECT COUNT(*)::int as count FROM properties WHERE listing_status IN ('pending_review', 'draft');"),
      pool.query('SELECT COUNT(*)::int as count FROM enquiries;')
    ]);

    return res.json({
      totalListings: propsRes.rows[0].count,
      registeredUsers: usersRes.rows[0].count,
      activeProperties: activePropsRes.rows[0].count,
      pendingReview: pendingPropsRes.rows[0].count,
      totalEnquiries: enquiriesRes.rows[0].count
    });
  } catch (err) {
    console.error('Error in getAdminStats:', err);
    return res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
};

// GET /api/admin/users
export const getAdminUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.full_name as name, u.phone, u.email, u.account_status as status,
             u.created_at,
             COUNT(DISTINCT p.id)::int as listings,
             COALESCE(array_agg(DISTINCT r.role_key) FILTER (WHERE r.role_key IS NOT NULL), '{}') as roles
      FROM users u
      LEFT JOIN properties p ON u.id = p.owner_user_id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      GROUP BY u.id
      ORDER BY u.created_at DESC;
    `);

    return res.json(rows);
  } catch (err) {
    console.error('Error in getAdminUsers:', err);
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// PATCH /api/admin/properties/:id/status
export const updatePropertyStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'published' | 'draft' | 'sold' | 'rejected'

  const validStatuses = ['draft', 'pending_review', 'published', 'paused', 'sold', 'rented', 'expired', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE properties
       SET listing_status = $1,
           published_at = CASE WHEN $1 = 'published' THEN NOW() ELSE published_at END,
           updated_at = NOW()
       WHERE id = $2
       RETURNING id, title, listing_status;`,
      [status, Number(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    return res.json({ success: true, property: rows[0] });
  } catch (err) {
    console.error('Error in updatePropertyStatus:', err);
    return res.status(500).json({ error: 'Failed to update property status.' });
  }
};

// DELETE /api/admin/properties/:id
export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM properties WHERE id = $1;', [Number(id)]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }
    return res.json({ success: true, message: 'Property deleted successfully.' });
  } catch (err) {
    console.error('Error in deleteProperty:', err);
    return res.status(500).json({ error: 'Failed to delete property.' });
  }
};
