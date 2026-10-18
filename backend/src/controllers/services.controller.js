import { pool } from '../config/db.js';

// GET /api/services
// Query params: ?category=<slug> or ?category_id=... or ?q=...
export const getServices = async (req, res) => {
  try {
    const { category, category_id, q } = req.query;

    const conditions = ['s.is_active = true'];
    const params = [];

    if (category) {
      params.push(category.toLowerCase());
      conditions.push(`(LOWER(c.slug) = $${params.length} OR LOWER(c.name) = $${params.length})`);
    }

    if (category_id) {
      params.push(Number(category_id));
      conditions.push(`s.category_id = $${params.length}`);
    }

    if (q) {
      params.push(`%${q.toLowerCase()}%`);
      const qIdx = params.length;
      conditions.push(`(LOWER(s.name) LIKE $${qIdx} OR LOWER(s.description) LIKE $${qIdx} OR LOWER(c.name) LIKE $${qIdx})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const queryStr = `
      SELECT 
        s.id,
        s.name,
        s.slug,
        s.description,
        s.category_id,
        s.created_at,
        c.name AS category_name,
        c.slug AS category_slug,
        c.category_group,
        COUNT(DISTINCT sl.id) AS listings_count,
        COUNT(DISTINCT sl.provider_id) AS providers_count,
        MIN(sl.starting_price) AS min_starting_price
      FROM services s
      JOIN categories c ON s.category_id = c.id
      LEFT JOIN service_listings sl ON sl.service_id = s.id AND sl.listing_status = 'published'
      ${whereClause}
      GROUP BY s.id, c.id
      ORDER BY c.sort_order ASC, s.name ASC;
    `;

    const { rows } = await pool.query(queryStr, params);
    return res.json(rows);
  } catch (err) {
    console.error('Error in getServices:', err);
    return res.status(500).json({ error: 'Failed to fetch services.' });
  }
};

// GET /api/services/categories
// Returns categories that have active services, with counts
export const getServiceCategories = async (req, res) => {
  try {
    const queryStr = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.category_group,
        c.description,
        COUNT(DISTINCT s.id) AS service_count,
        COUNT(DISTINCT sl.id) AS listing_count
      FROM categories c
      JOIN services s ON s.category_id = c.id AND s.is_active = true
      LEFT JOIN service_listings sl ON sl.service_id = s.id AND sl.listing_status = 'published'
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC;
    `;

    const { rows } = await pool.query(queryStr);
    return res.json(rows);
  } catch (err) {
    console.error('Error in getServiceCategories:', err);
    return res.status(500).json({ error: 'Failed to fetch service categories.' });
  }
};

// GET /api/services/:idOrSlug
// Returns single service + provider listings
export const getServiceByIdOrSlug = async (req, res) => {
  const { idOrSlug } = req.params;

  try {
    const isNumeric = !isNaN(Number(idOrSlug));
    const serviceQuery = `
      SELECT 
        s.id,
        s.name,
        s.slug,
        s.description,
        s.category_id,
        s.created_at,
        c.name AS category_name,
        c.slug AS category_slug,
        c.category_group
      FROM services s
      JOIN categories c ON s.category_id = c.id
      WHERE ${isNumeric ? 's.id = $1' : 's.slug = $1'};
    `;

    const { rows: serviceRows } = await pool.query(serviceQuery, [isNumeric ? Number(idOrSlug) : idOrSlug]);

    if (serviceRows.length === 0) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    const service = serviceRows[0];

    // Fetch active listings for this service
    const listingsQuery = `
      SELECT 
        sl.id,
        sl.title,
        sl.description,
        sl.pricing_model,
        sl.starting_price,
        sl.currency,
        sl.service_mode,
        sl.listing_status,
        sp.id AS provider_id,
        sp.public_name,
        sp.provider_type,
        sp.headline,
        sp.description AS provider_description,
        sp.qualifications,
        sp.license_number,
        sp.years_experience,
        sp.contact_email,
        sp.contact_phone,
        sp.verification_status,
        loc.name AS location_name
      FROM service_listings sl
      JOIN service_providers sp ON sl.provider_id = sp.id
      LEFT JOIN locations loc ON sl.location_id = loc.id
      WHERE sl.service_id = $1 
        AND sl.listing_status = 'published'
        AND sp.profile_status = 'published'
      ORDER BY sp.verification_status = 'verified' DESC, sp.years_experience DESC;
    `;

    const { rows: listings } = await pool.query(listingsQuery, [service.id]);

    return res.json({
      ...service,
      listings
    });
  } catch (err) {
    console.error('Error in getServiceByIdOrSlug:', err);
    return res.status(500).json({ error: 'Failed to fetch service details.' });
  }
};
