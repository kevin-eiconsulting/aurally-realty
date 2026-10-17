import { pool } from '../config/db.js';

// POST /api/enquiries
export const createEnquiry = async (req, res) => {
  const { property_id, contact_name, contact_phone, contact_email, message } = req.body;

  if (!property_id || !contact_name || (!contact_phone && !contact_email)) {
    return res.status(400).json({ error: 'Property ID, name, and contact phone or email are required.' });
  }

  try {
    const userId = req.user ? req.user.id : null;
    const cleanPhone = contact_phone ? contact_phone.replace(/\D/g, '') : null;
    const msg = message || 'Interested in this property and requesting further details or site visit.';

    const { rows } = await pool.query(
      `INSERT INTO enquiries (
        created_by_user_id, property_id, contact_name, contact_phone, contact_email, message, enquiry_status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'new')
      RETURNING *;`,
      [userId, Number(property_id), contact_name, cleanPhone, contact_email || null, msg]
    );

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. The seller will contact you shortly.',
      enquiry: rows[0]
    });
  } catch (err) {
    console.error('Error creating enquiry:', err);
    return res.status(500).json({ error: 'Failed to submit enquiry.' });
  }
};

// GET /api/enquiries
export const getEnquiries = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT e.*, p.title as property_title, p.price as property_price, loc.name as area_name
      FROM enquiries e
      LEFT JOIN properties p ON e.property_id = p.id
      LEFT JOIN locations loc ON p.location_id = loc.id
      ORDER BY e.created_at DESC
      LIMIT 100;
    `);
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    return res.status(500).json({ error: 'Failed to fetch enquiries.' });
  }
};
