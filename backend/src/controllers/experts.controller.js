import { pool } from '../config/db.js';

// GET /api/experts
// Query params: ?discipline=... &type=... &q=... &verified=true
export const getExperts = async (req, res) => {
  try {
    const { discipline, type, q, verified } = req.query;

    const conditions = ["sp.profile_status = 'published'"];
    const params = [];

    if (verified === 'true' || verified === true) {
      params.push('verified');
      conditions.push(`sp.verification_status = $${params.length}`);
    }

    if (type && type !== 'all') {
      params.push(type.toLowerCase());
      conditions.push(`LOWER(sp.provider_type) = $${params.length}`);
    }

    if (discipline && discipline !== 'all') {
      params.push(`%${discipline.toLowerCase()}%`);
      const dIdx = params.length;
      conditions.push(`(
        EXISTS (
          SELECT 1 FROM service_listings sl2
          JOIN services s2 ON sl2.service_id = s2.id
          LEFT JOIN categories c2 ON s2.category_id = c2.id
          WHERE sl2.provider_id = sp.id
            AND (
              LOWER(s2.name) LIKE $${dIdx}
              OR LOWER(s2.slug) LIKE $${dIdx}
              OR LOWER(c2.name) LIKE $${dIdx}
              OR LOWER(c2.slug) LIKE $${dIdx}
            )
        )
        OR LOWER(sp.headline) LIKE $${dIdx}
        OR LOWER(sp.public_name) LIKE $${dIdx}
        OR LOWER(sp.qualifications) LIKE $${dIdx}
      )`);
    }

    if (q) {
      params.push(`%${q.toLowerCase()}%`);
      const qIdx = params.length;
      conditions.push(`(
        LOWER(sp.public_name) LIKE $${qIdx}
        OR LOWER(sp.headline) LIKE $${qIdx}
        OR LOWER(sp.description) LIKE $${qIdx}
        OR LOWER(sp.qualifications) LIKE $${qIdx}
        OR LOWER(loc.name) LIKE $${qIdx}
      )`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const queryStr = `
      SELECT 
        sp.id,
        sp.user_id,
        sp.public_name,
        sp.provider_type,
        sp.headline,
        sp.description,
        sp.qualifications,
        sp.license_number,
        sp.years_experience,
        sp.contact_email,
        sp.contact_phone,
        sp.verification_status,
        sp.profile_status,
        sp.created_at,
        loc.name AS location_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', sl.id,
              'service_id', s.id,
              'title', sl.title,
              'service_name', s.name,
              'service_slug', s.slug,
              'pricing_model', sl.pricing_model,
              'starting_price', sl.starting_price,
              'currency', sl.currency,
              'service_mode', sl.service_mode
            )
          ) FILTER (WHERE sl.id IS NOT NULL),
          '[]'
        ) AS services_offered,
        COALESCE(AVG(r.rating), 4.9)::numeric(2,1) AS average_rating,
        COUNT(DISTINCT r.id) AS reviews_count
      FROM service_providers sp
      LEFT JOIN locations loc ON sp.location_id = loc.id
      LEFT JOIN service_listings sl ON sl.provider_id = sp.id AND sl.listing_status = 'published'
      LEFT JOIN services s ON sl.service_id = s.id
      LEFT JOIN reviews r ON r.service_provider_id = sp.id AND r.moderation_status = 'published'
      ${whereClause}
      GROUP BY sp.id, loc.name
      ORDER BY sp.verification_status = 'verified' DESC, sp.years_experience DESC;
    `;

    const { rows } = await pool.query(queryStr, params);
    return res.json(rows);
  } catch (err) {
    console.error('Error in getExperts:', err);
    return res.status(500).json({ error: 'Failed to fetch expert providers.' });
  }
};

// GET /api/experts/:id
export const getExpertById = async (req, res) => {
  const { id } = req.params;

  try {
    const queryStr = `
      SELECT 
        sp.id,
        sp.user_id,
        sp.public_name,
        sp.provider_type,
        sp.headline,
        sp.description,
        sp.qualifications,
        sp.license_number,
        sp.years_experience,
        sp.contact_email,
        sp.contact_phone,
        sp.verification_status,
        sp.profile_status,
        sp.created_at,
        loc.name AS location_name,
        COALESCE(AVG(r.rating), 4.9)::numeric(2,1) AS average_rating,
        COUNT(DISTINCT r.id) AS reviews_count
      FROM service_providers sp
      LEFT JOIN locations loc ON sp.location_id = loc.id
      LEFT JOIN reviews r ON r.service_provider_id = sp.id AND r.moderation_status = 'published'
      WHERE sp.id = $1
      GROUP BY sp.id, loc.name;
    `;

    const { rows } = await pool.query(queryStr, [Number(id)]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expert not found.' });
    }

    const expert = rows[0];

    // Fetch listings for this expert
    const listingsQuery = `
      SELECT 
        sl.id,
        sl.title,
        sl.description,
        sl.pricing_model,
        sl.starting_price,
        sl.currency,
        sl.service_mode,
        s.id AS service_id,
        s.name AS service_name,
        s.slug AS service_slug,
        c.name AS category_name
      FROM service_listings sl
      JOIN services s ON sl.service_id = s.id
      JOIN categories c ON s.category_id = c.id
      WHERE sl.provider_id = $1 AND sl.listing_status = 'published'
      ORDER BY sl.created_at ASC;
    `;

    const { rows: listings } = await pool.query(listingsQuery, [expert.id]);

    return res.json({
      ...expert,
      listings
    });
  } catch (err) {
    console.error('Error in getExpertById:', err);
    return res.status(500).json({ error: 'Failed to fetch expert profile.' });
  }
};
