import { pool } from '../config/db.js';

// GET /api/materials/categories
// Returns all subcategories under 'building-materials' with product counts
export const getCategories = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.id, c.name, c.slug, c.sort_order,
             COUNT(p.id)::int AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.product_status = 'active'
      JOIN categories pc ON c.parent_category_id = pc.id
      WHERE pc.slug = 'building-materials'
      GROUP BY c.id, c.name, c.slug, c.sort_order
      ORDER BY c.sort_order ASC NULLS LAST, c.name ASC;
    `);
    return res.json(rows);
  } catch (err) {
    console.error('Error in getCategories (materials):', err);
    return res.status(500).json({ error: 'Failed to fetch material categories.' });
  }
};

// GET /api/materials
// Query params: category (subcategory slug), brand, q, limit, offset
export const getMaterials = async (req, res) => {
  try {
    const {
      category,         // subcategory slug
      brand,
      q,                // search query
      limit = 48,
      offset = 0
    } = req.query;

    const conditions = [`pc.slug = 'building-materials'`, `p.product_status = 'active'`];
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      conditions.push(`c.slug = $${params.length}`);
    }

    if (brand) {
      params.push(`%${brand.toLowerCase()}%`);
      conditions.push(`LOWER(p.brand) LIKE $${params.length}`);
    }

    if (q) {
      params.push(`%${q.toLowerCase()}%`);
      const qIdx = params.length;
      conditions.push(`(
        LOWER(p.name) LIKE $${qIdx}
        OR LOWER(p.brand) LIKE $${qIdx}
        OR LOWER(c.name) LIKE $${qIdx}
      )`);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const queryStr = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.brand,
        p.default_unit,
        p.specifications,
        p.product_status,
        p.created_at,
        c.id   AS subcategory_id,
        c.name AS subcategory_name,
        c.slug AS subcategory_slug,
        pc.id   AS parent_category_id,
        pc.name AS parent_category_name
      FROM products p
      JOIN categories c  ON p.category_id = c.id
      JOIN categories pc ON c.parent_category_id = pc.id
      ${whereClause}
      ORDER BY p.name ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2};
    `;
    params.push(Number(limit), Number(offset));

    const { rows } = await pool.query(queryStr, params);
    return res.json(rows);
  } catch (err) {
    console.error('Error in getMaterials:', err);
    return res.status(500).json({ error: 'Failed to fetch materials.' });
  }
};

// GET /api/materials/:id
// Returns single product detail with full specifications
export const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(Number(id));

    const { rows } = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.brand,
        p.default_unit,
        p.specifications,
        p.product_status,
        p.created_at,
        c.id   AS subcategory_id,
        c.name AS subcategory_name,
        c.slug AS subcategory_slug,
        pc.id   AS parent_category_id,
        pc.name AS parent_category_name
      FROM products p
      JOIN categories c  ON p.category_id = c.id
      JOIN categories pc ON c.parent_category_id = pc.id
      WHERE pc.slug = 'building-materials'
        AND ${isNumeric ? 'p.id = $1' : 'p.slug = $1'};
    `, [isNumeric ? Number(id) : id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Material product not found.' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Error in getMaterialById:', err);
    return res.status(500).json({ error: 'Failed to fetch material details.' });
  }
};
