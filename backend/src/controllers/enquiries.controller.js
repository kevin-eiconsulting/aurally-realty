import { pool } from '../config/db.js';

// POST /api/enquiries
// Accepts property_id OR service_listing_id OR service_id
export const createEnquiry = async (req, res) => {
  const { 
    property_id, 
    service_listing_id, 
    service_id, 
    supplier_listing_id, 
    business_profile_id,
    contact_name, 
    contact_phone, 
    contact_email, 
    subject, 
    message,
    desired_date,
    requested_quantity,
    requested_unit
  } = req.body;

  if (!contact_name || (!contact_phone && !contact_email)) {
    return res.status(400).json({ error: 'Contact name and either phone or email are required.' });
  }

  try {
    const userId = req.user ? req.user.id : null;
    const cleanPhone = contact_phone ? contact_phone.replace(/\D/g, '') : null;
    const msg = message || 'Interested in this offering and requesting further details or a callback.';

    let resolvedPropertyId = property_id ? Number(property_id) : null;
    let resolvedServiceListingId = service_listing_id ? Number(service_listing_id) : null;
    let resolvedSupplierListingId = supplier_listing_id ? Number(supplier_listing_id) : null;
    let resolvedBusinessProfileId = business_profile_id ? Number(business_profile_id) : null;

    // If service_id is passed instead of service_listing_id
    if (!resolvedServiceListingId && !resolvedPropertyId && !resolvedSupplierListingId && !resolvedBusinessProfileId && service_id) {
      const slRes = await pool.query(
        "SELECT id FROM service_listings WHERE service_id = $1 AND listing_status = 'published' LIMIT 1;",
        [Number(service_id)]
      );
      if (slRes.rows.length > 0) {
        resolvedServiceListingId = slRes.rows[0].id;
      } else {
        // Find any active service listing to associate with the service enquiry
        const fallbackRes = await pool.query(
          "SELECT id FROM service_listings WHERE listing_status = 'published' LIMIT 1;"
        );
        if (fallbackRes.rows.length > 0) {
          resolvedServiceListingId = fallbackRes.rows[0].id;
        }
      }
    }

    // Verify exactly one target is non-null
    const nonNullCount = [resolvedPropertyId, resolvedSupplierListingId, resolvedServiceListingId, resolvedBusinessProfileId].filter(x => x !== null && x !== undefined).length;

    if (nonNullCount !== 1) {
      return res.status(400).json({ 
        error: 'Enquiry must be targeted to exactly one item: property, service listing, or supplier listing.' 
      });
    }

    const insertQuery = `
      INSERT INTO enquiries (
        created_by_user_id,
        property_id,
        supplier_listing_id,
        service_listing_id,
        business_profile_id,
        contact_name,
        contact_phone,
        contact_email,
        subject,
        message,
        desired_date,
        requested_quantity,
        requested_unit,
        enquiry_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'new')
      RETURNING *;
    `;

    const { rows } = await pool.query(insertQuery, [
      userId,
      resolvedPropertyId,
      resolvedSupplierListingId,
      resolvedServiceListingId,
      resolvedBusinessProfileId,
      contact_name.trim(),
      cleanPhone,
      contact_email ? contact_email.trim() : null,
      subject || 'Platform Enquiry',
      msg,
      desired_date || null,
      requested_quantity || null,
      requested_unit || null
    ]);

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. A representative will contact you shortly.',
      enquiry: rows[0]
    });
  } catch (err) {
    console.error('Error creating enquiry:', err);
    return res.status(500).json({ error: 'Failed to submit enquiry.' });
  }
};

// GET /api/enquiries/my
// Returns user's sent and received enquiries (authenticated)
export const getUserEnquiries = async (req, res) => {
  try {
    const userId = req.user.id;

    const queryStr = `
      SELECT 
        e.*,
        p.title AS property_title,
        p.price AS property_price,
        p.slug AS property_slug,
        ploc.name AS property_location,
        sl.title AS service_title,
        s.name AS service_name,
        s.slug AS service_slug,
        sp.public_name AS service_provider_name,
        CASE 
          WHEN e.created_by_user_id = $1 THEN 'sent'
          ELSE 'received'
        END AS enquiry_type
      FROM enquiries e
      LEFT JOIN properties p ON e.property_id = p.id
      LEFT JOIN locations ploc ON p.location_id = ploc.id
      LEFT JOIN service_listings sl ON e.service_listing_id = sl.id
      LEFT JOIN services s ON sl.service_id = s.id
      LEFT JOIN service_providers sp ON sl.provider_id = sp.id
      WHERE e.created_by_user_id = $1 
         OR p.owner_user_id = $1
         OR sp.user_id = $1
      ORDER BY e.created_at DESC;
    `;

    const { rows } = await pool.query(queryStr, [userId]);
    return res.json(rows);
  } catch (err) {
    console.error('Error in getUserEnquiries:', err);
    return res.status(500).json({ error: 'Failed to fetch user enquiries.' });
  }
};

// GET /api/enquiries (admin)
export const getEnquiries = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        e.*,
        p.title as property_title,
        p.price as property_price,
        loc.name as area_name,
        sl.title as service_title,
        sp.public_name as provider_name
      FROM enquiries e
      LEFT JOIN properties p ON e.property_id = p.id
      LEFT JOIN locations loc ON p.location_id = loc.id
      LEFT JOIN service_listings sl ON e.service_listing_id = sl.id
      LEFT JOIN service_providers sp ON sl.provider_id = sp.id
      ORDER BY e.created_at DESC
      LIMIT 100;
    `);
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    return res.status(500).json({ error: 'Failed to fetch enquiries.' });
  }
};
