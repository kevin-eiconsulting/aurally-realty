import { pool } from '../config/db.js';

// Helper to format a DB row into the shape expected by the frontend
const formatPropertyRow = (row, mediaMap = {}, featuresMap = {}) => {
  const media = mediaMap[row.id] || [];
  const features = featuresMap[row.id] || {};

  const primaryImage = media.find(m => m.is_primary)?.file_url || media[0]?.file_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
  const allImages = media.length > 0 ? media.map(m => m.file_url) : [primaryImage];

  const isRent = row.listing_type === 'rent';
  let defaultPriceUnit = isRent ? '/mo' : 'Lakhs';
  let numericPrice = Number(row.price);

  // If in Lakhs / Cr for frontend display convenience
  if (!isRent) {
    if (numericPrice >= 10000000) {
      defaultPriceUnit = 'Cr';
      numericPrice = Number((numericPrice / 10000000).toFixed(2));
    } else if (numericPrice >= 100000) {
      defaultPriceUnit = 'Lakhs';
      numericPrice = Number((numericPrice / 100000).toFixed(2));
    }
  }

  // Parse amenities
  let amenitiesList = [];
  if (features.amenities) {
    try {
      amenitiesList = typeof features.amenities === 'string' ? JSON.parse(features.amenities) : features.amenities;
    } catch {
      amenitiesList = String(features.amenities).split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  return {
    id: Number(row.id),
    title: row.title,
    slug: row.slug,
    area: row.area_name || 'Chennai',
    city: row.city_name || 'Chennai',
    type: row.property_type?.toLowerCase() || 'apartment',
    status: row.listing_type === 'rent' ? 'for-rent' : 'for-sale',
    listingStatus: row.listing_status,
    price: numericPrice,
    rawPrice: Number(row.price),
    priceUnit: features.priceUnit || defaultPriceUnit,
    beds: row.bedrooms || 0,
    baths: row.bathrooms || 0,
    sqft: Number(row.built_up_area) || 0,
    carpetArea: features.carpetArea ? Number(features.carpetArea) : null,
    floor: features.floor || 'Ground',
    totalFloors: features.totalFloors ? Number(features.totalFloors) : null,
    facing: features.facing || 'East',
    age: features.age || 'New',
    furnishing: features.furnishing || 'Semi Furnished',
    ownershipType: features.ownershipType || 'Freehold',
    maintenance: features.maintenance ? Number(features.maintenance) : 0,
    reraNumber: row.rera_number || features.reraNumber || '',
    videoUrl: features.videoUrl || '',
    amenities: Array.isArray(amenitiesList) ? amenitiesList : [],
    image: primaryImage,
    images: allImages,
    featured: features.featured === 'true' || (row.listing_status === 'published' && features.featured !== 'false' && false),
    verified: features.verified === 'true' || row.approval_status === 'approved',
    description: row.description || '',
    address: row.address_line1 || '',
    owner: row.owner_name || 'Property Owner',
    phone: row.contact_phone || row.owner_phone || '',
    views: Number(row.views_count) || 0,
    leadsCount: row.leads_count !== undefined ? Number(row.leads_count) : 0,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

// GET /api/properties
export const getProperties = async (req, res) => {
  try {
    const {
      status,       // 'for-sale' | 'for-rent'
      area,         // locality name
      city,         // city name (e.g. Coimbatore, Chennai)
      type,         // 'apartment', 'villa', etc.
      beds,         // 1, 2, 3, 4
      budget,       // 30, 60, 100, 100+
      minPrice,
      maxPrice,
      sortBy = 'featured',
      q,
      ownerId,
      limit = 50,
      offset = 0
    } = req.query;

    const conditions = ownerId ? [] : ["p.listing_status = 'published'"];
    const params = [];

    // Filter by owner
    if (ownerId) {
      params.push(Number(ownerId));
      conditions.push(`p.owner_user_id = $${params.length}`);
    }

    // Filter by listing type
    if (status) {
      const listingType = status === 'for-rent' ? 'rent' : 'sale';
      params.push(listingType);
      conditions.push(`p.listing_type = $${params.length}`);
    }

    // Filter by property type
    if (type && type !== 'all') {
      params.push(`%${type.toLowerCase()}%`);
      conditions.push(`LOWER(p.property_type) LIKE $${params.length}`);
    }

    // Filter by area
    if (area && area !== 'all') {
      params.push(`%${area.toLowerCase()}%`);
      conditions.push(`LOWER(loc.name) LIKE $${params.length}`);
    }

    // Filter by city
    if (city && city !== 'all' && city !== 'All Tamil Nadu') {
      params.push(`%${city.toLowerCase()}%`);
      const cIdx = params.length;
      conditions.push(`(
        LOWER(parent_loc.name) LIKE $${cIdx} 
        OR (loc.location_type = 'city' AND LOWER(loc.name) LIKE $${cIdx})
        OR LOWER(p.title) LIKE $${cIdx}
        OR LOWER(p.description) LIKE $${cIdx}
      )`);
    }

    // Filter by bedrooms
    if (beds) {
      params.push(Number(beds));
      conditions.push(`p.bedrooms = $${params.length}`);
    }

    // Filter by budget
    if (minPrice) {
      params.push(Number(minPrice));
      conditions.push(`p.price >= $${params.length}`);
    }
    if (maxPrice) {
      params.push(Number(maxPrice));
      conditions.push(`p.price <= $${params.length}`);
    }

    // Query text search
    if (q) {
      params.push(`%${q.toLowerCase()}%`);
      const pIdx = params.length;
      conditions.push(`(LOWER(p.title) LIKE $${pIdx} OR LOWER(p.description) LIKE $${pIdx} OR LOWER(loc.name) LIKE $${pIdx})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sort order
    let orderClause = 'ORDER BY p.created_at DESC';
    if (sortBy === 'price-low') {
      orderClause = 'ORDER BY p.price ASC';
    } else if (sortBy === 'price-high') {
      orderClause = 'ORDER BY p.price DESC';
    }

    const queryStr = `
      SELECT p.*,
             loc.name as area_name,
             COALESCE(CASE WHEN loc.location_type = 'city' THEN loc.name WHEN parent_loc.location_type = 'city' THEN parent_loc.name ELSE 'Chennai' END, 'Chennai') as city_name,
             u.full_name as owner_name,
             u.phone as owner_phone
      FROM properties p
      LEFT JOIN locations loc ON p.location_id = loc.id
      LEFT JOIN locations parent_loc ON loc.parent_id = parent_loc.id
      LEFT JOIN users u ON p.owner_user_id = u.id
      ${whereClause}
      ${orderClause}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2};
    `;
    params.push(Number(limit), Number(offset));

    const { rows } = await pool.query(queryStr, params);

    if (rows.length === 0) {
      return res.json([]);
    }

    const propertyIds = rows.map(r => r.id);

    // Fetch media and features in batch
    const [mediaRes, featuresRes] = await Promise.all([
      pool.query(
        `SELECT property_id, file_url, is_primary, sort_order 
         FROM property_media 
         WHERE property_id = ANY($1) 
         ORDER BY sort_order ASC;`,
        [propertyIds]
      ),
      pool.query(
        `SELECT property_id, feature_key, feature_value 
         FROM property_features 
         WHERE property_id = ANY($1);`,
        [propertyIds]
      )
    ]);

    const mediaMap = {};
    for (const m of mediaRes.rows) {
      if (!mediaMap[m.property_id]) mediaMap[m.property_id] = [];
      mediaMap[m.property_id].push(m);
    }

    const featuresMap = {};
    for (const f of featuresRes.rows) {
      if (!featuresMap[f.property_id]) featuresMap[f.property_id] = {};
      featuresMap[f.property_id][f.feature_key] = f.feature_value;
    }

    let formatted = rows.map(r => formatPropertyRow(r, mediaMap, featuresMap));

    // Handle frontend budget filter presets
    if (budget) {
      if (budget === '30') formatted = formatted.filter(p => p.rawPrice <= 3000000);
      else if (budget === '60') formatted = formatted.filter(p => p.rawPrice > 3000000 && p.rawPrice <= 6000000);
      else if (budget === '100') formatted = formatted.filter(p => p.rawPrice > 6000000 && p.rawPrice <= 10000000);
      else if (budget === '100+') formatted = formatted.filter(p => p.rawPrice > 10000000);
    }

    // Client-side sort by featured if requested
    if (sortBy === 'featured') {
      formatted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return res.json(formatted);
  } catch (err) {
    console.error('Error in getProperties:', err);
    return res.status(500).json({ error: 'Failed to fetch properties.' });
  }
};

// GET /api/properties/:id
export const getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    const isNumeric = !isNaN(Number(id));
    const queryStr = `
      SELECT p.*,
             loc.name as area_name,
             u.full_name as owner_name,
             u.phone as owner_phone
      FROM properties p
      LEFT JOIN locations loc ON p.location_id = loc.id
      LEFT JOIN users u ON p.owner_user_id = u.id
      WHERE ${isNumeric ? 'p.id = $1' : 'p.slug = $1'};
    `;
    const { rows } = await pool.query(queryStr, [isNumeric ? Number(id) : id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const prop = rows[0];

    const [mediaRes, featuresRes] = await Promise.all([
      pool.query(
        'SELECT file_url, is_primary, sort_order FROM property_media WHERE property_id = $1 ORDER BY sort_order ASC;',
        [prop.id]
      ),
      pool.query(
        'SELECT feature_key, feature_value FROM property_features WHERE property_id = $1;',
        [prop.id]
      )
    ]);

    const mediaMap = { [prop.id]: mediaRes.rows };
    const featuresMap = { [prop.id]: {} };
    for (const f of featuresRes.rows) {
      featuresMap[prop.id][f.feature_key] = f.feature_value;
    }

    return res.json(formatPropertyRow(prop, mediaMap, featuresMap));
  } catch (err) {
    console.error('Error in getPropertyById:', err);
    return res.status(500).json({ error: 'Failed to fetch property details.' });
  }
};

// POST /api/properties
export const createProperty = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      title,
      listingType = 'sale',
      propertyType = 'Apartment',
      area,
      address,
      beds = 0,
      baths = 1,
      sqft = 1000,
      price,
      facing = 'East',
      floor = '1st of 4',
      furnishing = 'Semi Furnished',
      age = 'New',
      description = '',
      phone,
      image,
      images,
      carpetArea,
      totalFloors,
      ownershipType = 'Freehold',
      maintenance = 0,
      reraNumber = '',
      videoUrl = '',
      amenities = []
    } = req.body;

    if (!title || !price || !area) {
      return res.status(400).json({ error: 'Title, price, and area are required.' });
    }

    await client.query('BEGIN');

    // 1. Resolve owner user
    let ownerId = req.user ? req.user.id : null;
    if (!ownerId) {
      // Find or create user by phone
      const contactPhone = phone || '9876543210';
      const cleanPhone = contactPhone.replace(/\D/g, '');
      const userRes = await client.query('SELECT id FROM users WHERE phone = $1;', [cleanPhone]);
      if (userRes.rows.length > 0) {
        ownerId = userRes.rows[0].id;
      } else {
        const newUser = await client.query(
          `INSERT INTO users (full_name, phone, account_status)
           VALUES ('Property Owner', $1, 'active')
           RETURNING id;`,
          [cleanPhone]
        );
        ownerId = newUser.rows[0].id;
      }
    }

    // 2. Resolve location
    let locationId = null;
    const locRes = await client.query('SELECT id FROM locations WHERE LOWER(name) = LOWER($1) LIMIT 1;', [area.trim()]);
    if (locRes.rows.length > 0) {
      locationId = locRes.rows[0].id;
    } else {
      // Create new locality under selected city (default to Chennai)
      const targetCity = (req.body.city || 'Chennai').trim();
      const cityRes = await client.query("SELECT id FROM locations WHERE LOWER(name) = LOWER($1) LIMIT 1;", [targetCity]);
      const parentId = cityRes.rows[0]?.id || null;
      const newLoc = await client.query(
        `INSERT INTO locations (parent_id, location_type, name)
         VALUES ($1, 'district', $2)
         ON CONFLICT (parent_id, location_type, name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id;`,
        [parentId, area.trim()]
      );
      locationId = newLoc.rows[0].id;
    }

    // 3. Resolve category
    const catRes = await client.query("SELECT id FROM categories WHERE slug = 'properties' LIMIT 1;");
    const categoryId = catRes.rows[0]?.id || 1;

    // 4. Calculate actual storage price (if Lakhs, convert to rupees)
    const isRent = listingType === 'rent';
    let rawPrice = Number(price);
    if (!isRent && rawPrice < 10000) {
      // If entered as 75 (meaning 75 Lakhs)
      rawPrice = rawPrice * 100000;
    }

    // 5. Generate unique slug
    const baseSlug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${area.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

    // 6. Insert property
    const propInsertRes = await client.query(
      `INSERT INTO properties (
        owner_user_id, category_id, location_id, title, slug,
        listing_type, property_type, description, price, currency,
        built_up_area, built_up_area_unit, bedrooms, bathrooms,
        address_line1, contact_phone, listing_status, published_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, 'INR',
        $10, 'sq.ft', $11, $12,
        $13, $14, 'published', NOW()
      ) RETURNING *;`,
      [
        ownerId,
        categoryId,
        locationId,
        title,
        slug,
        listingType,
        propertyType,
        description,
        rawPrice,
        Number(sqft),
        Number(beds),
        Number(baths),
        address,
        phone || req.user?.phone || '',
        reraNumber ? reraNumber.trim() : null
      ]
    );
    const newProp = propInsertRes.rows[0];

    // 7. Insert media
    const imgList = Array.isArray(images) && images.length > 0
      ? images
      : (image ? [image] : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80']);

    for (let i = 0; i < imgList.length; i++) {
      await client.query(
        `INSERT INTO property_media (property_id, media_type, file_url, sort_order, is_primary)
         VALUES ($1, 'image', $2, $3, $4);`,
        [newProp.id, imgList[i], i, i === 0]
      );
    }

    // 8. Insert features
    const features = [
      { key: 'floor', val: String(floor || 'Ground') },
      { key: 'facing', val: String(facing || 'East') },
      { key: 'age', val: String(age || 'New') },
      { key: 'furnishing', val: String(furnishing || 'Semi Furnished') },
      { key: 'featured', val: 'false' },
      { key: 'verified', val: 'false' },
      { key: 'priceUnit', val: isRent ? '/mo' : (rawPrice >= 10000000 ? 'Cr' : 'Lakhs') },
      { key: 'carpetArea', val: carpetArea ? String(carpetArea) : '' },
      { key: 'totalFloors', val: totalFloors ? String(totalFloors) : '' },
      { key: 'ownershipType', val: String(ownershipType || 'Freehold') },
      { key: 'maintenance', val: maintenance ? String(maintenance) : '0' },
      { key: 'videoUrl', val: String(videoUrl || '') },
      { key: 'amenities', val: Array.isArray(amenities) ? JSON.stringify(amenities) : String(amenities || '[]') }
    ];

    for (const f of features) {
      await client.query(
        `INSERT INTO property_features (property_id, feature_key, feature_value)
         VALUES ($1, $2, $3);`,
        [newProp.id, f.key, f.val]
      );
    }

    await client.query('COMMIT');

    const createdFormatted = formatPropertyRow(
      { ...newProp, area_name: area, owner_name: req.user?.name || 'Property Owner', owner_phone: phone },
      { [newProp.id]: [{ file_url: imgList[0], is_primary: true }] },
      { [newProp.id]: { floor, facing, age, furnishing, featured: 'false', verified: 'false' } }
    );

    return res.status(201).json(createdFormatted);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating property:', err);
    return res.status(500).json({ error: 'Failed to create property listing.' });
  } finally {
    client.release();
  }
};

// GET /api/properties/user/my
// Returns all listings created by the authenticated user
export const getMyProperties = async (req, res) => {
  try {
    const userId = req.user.id;
    const queryStr = `
      SELECT p.*,
             loc.name as area_name,
             COALESCE(CASE WHEN loc.location_type = 'city' THEN loc.name WHEN parent_loc.location_type = 'city' THEN parent_loc.name ELSE 'Chennai' END, 'Chennai') as city_name,
             u.full_name as owner_name,
             u.phone as owner_phone,
             COALESCE(e.leads_count, 0) as leads_count
      FROM properties p
      LEFT JOIN locations loc ON p.location_id = loc.id
      LEFT JOIN locations parent_loc ON loc.parent_id = parent_loc.id
      LEFT JOIN users u ON p.owner_user_id = u.id
      LEFT JOIN (
        SELECT property_id, COUNT(*) as leads_count 
        FROM enquiries 
        GROUP BY property_id
      ) e ON e.property_id = p.id
      WHERE p.owner_user_id = $1
      ORDER BY p.created_at DESC;
    `;
    const { rows } = await pool.query(queryStr, [userId]);
    if (rows.length === 0) {
      return res.json([]);
    }

    const propertyIds = rows.map(r => r.id);
    const [mediaRes, featuresRes] = await Promise.all([
      pool.query(
        `SELECT property_id, file_url, is_primary, sort_order 
         FROM property_media 
         WHERE property_id = ANY($1) 
         ORDER BY sort_order ASC;`,
        [propertyIds]
      ),
      pool.query(
        `SELECT property_id, feature_key, feature_value 
         FROM property_features 
         WHERE property_id = ANY($1);`,
        [propertyIds]
      )
    ]);

    const mediaMap = {};
    for (const m of mediaRes.rows) {
      if (!mediaMap[m.property_id]) mediaMap[m.property_id] = [];
      mediaMap[m.property_id].push(m);
    }

    const featuresMap = {};
    for (const f of featuresRes.rows) {
      if (!featuresMap[f.property_id]) featuresMap[f.property_id] = {};
      featuresMap[f.property_id][f.feature_key] = f.feature_value;
    }

    const formatted = rows.map(r => formatPropertyRow(r, mediaMap, featuresMap));
    return res.json(formatted);
  } catch (err) {
    console.error('Error in getMyProperties:', err);
    return res.status(500).json({ error: 'Failed to fetch user properties.' });
  }
};

// DELETE /api/properties/:id
export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin;

  try {
    const propRes = await pool.query('SELECT owner_user_id FROM properties WHERE id = $1;', [Number(id)]);
    if (propRes.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    if (!isAdmin && Number(propRes.rows[0].owner_user_id) !== Number(userId)) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own properties.' });
    }

    await pool.query('DELETE FROM properties WHERE id = $1;', [Number(id)]);
    return res.json({ success: true, message: 'Property deleted successfully.' });
  } catch (err) {
    console.error('Error deleting property:', err);
    return res.status(500).json({ error: 'Failed to delete property.' });
  }
};


// PUT /api/properties/:id
// Update an existing property listing (Owner or Admin)
export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin;
  const client = await pool.connect();

  try {
    const propRes = await client.query('SELECT * FROM properties WHERE id = $1;', [Number(id)]);
    if (propRes.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const existingProp = propRes.rows[0];
    if (!isAdmin && Number(existingProp.owner_user_id) !== Number(userId)) {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own listings.' });
    }

    const {
      title,
      listingType,
      propertyType,
      area,
      city,
      address,
      beds,
      baths,
      sqft,
      price,
      facing,
      floor,
      furnishing,
      age,
      description,
      phone,
      images,
      image,
      carpetArea,
      totalFloors,
      ownershipType,
      maintenance,
      reraNumber,
      videoUrl,
      amenities,
      listingStatus
    } = req.body;

    await client.query('BEGIN');

    // 1. Resolve location if area changed
    let locationId = existingProp.location_id;
    if (area && area.trim()) {
      const locRes = await client.query('SELECT id FROM locations WHERE LOWER(name) = LOWER($1) LIMIT 1;', [area.trim()]);
      if (locRes.rows.length > 0) {
        locationId = locRes.rows[0].id;
      } else {
        const targetCity = (city || 'Chennai').trim();
        const cityRes = await client.query('SELECT id FROM locations WHERE LOWER(name) = LOWER($1) LIMIT 1;', [targetCity]);
        const parentId = cityRes.rows[0]?.id || null;
        const newLoc = await client.query(
          `INSERT INTO locations (parent_id, location_type, name)
           VALUES ($1, 'district', $2)
           ON CONFLICT (parent_id, location_type, name) DO UPDATE SET name = EXCLUDED.name
           RETURNING id;`,
          [parentId, area.trim()]
        );
        locationId = newLoc.rows[0].id;
      }
    }

    // 2. Resolve price
    let rawPrice = existingProp.price;
    if (price !== undefined && price !== null && price !== '') {
      rawPrice = Number(price);
      const isRent = (listingType || existingProp.listing_type) === 'rent';
      if (!isRent && rawPrice < 10000) {
        rawPrice = rawPrice * 100000;
      }
    }

    // 3. Update properties table
    const updatePropQuery = `
      UPDATE properties SET
        title = COALESCE($1, title),
        listing_type = COALESCE($2, listing_type),
        property_type = COALESCE($3, property_type),
        location_id = COALESCE($4, location_id),
        address_line1 = COALESCE($5, address_line1),
        bedrooms = COALESCE($6, bedrooms),
        bathrooms = COALESCE($7, bathrooms),
        built_up_area = COALESCE($8, built_up_area),
        price = COALESCE($9, price),
        description = COALESCE($10, description),
        contact_phone = COALESCE($11, contact_phone),
        rera_number = COALESCE($12, rera_number),
        listing_status = COALESCE($13, listing_status),
        updated_at = NOW()
      WHERE id = $14
      RETURNING *;
    `;

    const updatedPropRes = await client.query(updatePropQuery, [
      title ? title.trim() : null,
      listingType || null,
      propertyType || null,
      locationId,
      address ? address.trim() : null,
      beds !== undefined && beds !== '' ? Number(beds) : null,
      baths !== undefined && baths !== '' ? Number(baths) : null,
      sqft !== undefined && sqft !== '' ? Number(sqft) : null,
      rawPrice !== null ? Number(rawPrice) : null,
      description !== undefined ? description : null,
      phone ? phone.trim() : null,
      reraNumber !== undefined ? (reraNumber ? reraNumber.trim() : null) : null,
      listingStatus || null,
      existingProp.id
    ]);
    const updatedProp = updatedPropRes.rows[0];

    // 4. Update features
    const featureUpdates = {};
    if (floor !== undefined) featureUpdates.floor = String(floor);
    if (facing !== undefined) featureUpdates.facing = String(facing);
    if (age !== undefined) featureUpdates.age = String(age);
    if (furnishing !== undefined) featureUpdates.furnishing = String(furnishing);
    if (carpetArea !== undefined) featureUpdates.carpetArea = String(carpetArea);
    if (totalFloors !== undefined) featureUpdates.totalFloors = String(totalFloors);
    if (ownershipType !== undefined) featureUpdates.ownershipType = String(ownershipType);
    if (maintenance !== undefined) featureUpdates.maintenance = String(maintenance);
    if (videoUrl !== undefined) featureUpdates.videoUrl = String(videoUrl);
    if (amenities !== undefined) {
      featureUpdates.amenities = Array.isArray(amenities) ? JSON.stringify(amenities) : String(amenities);
    }
    const isRentListing = (listingType || existingProp.listing_type) === 'rent';
    featureUpdates.priceUnit = isRentListing ? '/mo' : (Number(rawPrice) >= 10000000 ? 'Cr' : 'Lakhs');

    for (const [key, val] of Object.entries(featureUpdates)) {
      await client.query(`
        INSERT INTO property_features (property_id, feature_key, feature_value)
        VALUES ($1, $2, $3)
        ON CONFLICT (property_id, feature_key) DO UPDATE SET feature_value = EXCLUDED.feature_value;
      `, [updatedProp.id, key, val]);
    }

    // 5. Update media if images supplied
    const imgList = Array.isArray(images) && images.length > 0 ? images : (image ? [image] : null);
    if (imgList) {
      await client.query('DELETE FROM property_media WHERE property_id = $1;', [updatedProp.id]);
      for (let i = 0; i < imgList.length; i++) {
        await client.query(
          `INSERT INTO property_media (property_id, media_type, file_url, sort_order, is_primary)
           VALUES ($1, 'image', $2, $3, $4);`,
          [updatedProp.id, imgList[i], i, i === 0]
        );
      }
    }

    await client.query('COMMIT');

    // Fetch refreshed features & media to return formatted row
    const [mediaRes, featuresRes] = await Promise.all([
      pool.query('SELECT file_url, is_primary, sort_order FROM property_media WHERE property_id = $1 ORDER BY sort_order ASC;', [updatedProp.id]),
      pool.query('SELECT feature_key, feature_value FROM property_features WHERE property_id = $1;', [updatedProp.id])
    ]);
    const fMap = {};
    for (const f of featuresRes.rows) {
      fMap[f.feature_key] = f.feature_value;
    }

    return res.json({
      success: true,
      message: 'Property updated successfully.',
      property: formatPropertyRow(
        { ...updatedProp, area_name: area || existingProp.address_line1, owner_name: req.user.name, owner_phone: updatedProp.contact_phone },
        { [updatedProp.id]: mediaRes.rows },
        { [updatedProp.id]: fMap }
      )
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating property:', err);
    return res.status(500).json({ error: 'Failed to update property.' });
  } finally {
    client.release();
  }
};

// PATCH /api/properties/:id/status
// Quick status toggle (published, draft, archived, sold)
export const updateListingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin;

  const validStatuses = ['published', 'draft', 'pending', 'archived', 'sold'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Allowed values: ${validStatuses.join(', ')}` });
  }

  try {
    const propRes = await pool.query('SELECT owner_user_id FROM properties WHERE id = $1;', [Number(id)]);
    if (propRes.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    if (!isAdmin && Number(propRes.rows[0].owner_user_id) !== Number(userId)) {
      return res.status(403).json({ error: 'Forbidden: You can only update the status of your own properties.' });
    }

    const { rows } = await pool.query(
      'UPDATE properties SET listing_status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, listing_status, updated_at;',
      [status, Number(id)]
    );

    return res.json({
      success: true,
      message: `Property listing status updated to ${status}.`,
      property: rows[0]
    });
  } catch (err) {
    console.error('Error updating listing status:', err);
    return res.status(500).json({ error: 'Failed to update property status.' });
  }
};

// POST /api/properties/:id/view
// Safely increment property views
export const recordPropertyView = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'UPDATE properties SET views_count = COALESCE(views_count, 0) + 1 WHERE id = $1 RETURNING id, views_count;',
      [Number(id)]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }
    return res.json({ success: true, views: rows[0].views_count });
  } catch (err) {
    console.error('Error recording view:', err);
    return res.status(500).json({ error: 'Failed to record view.' });
  }
};
