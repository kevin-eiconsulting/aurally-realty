import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

const AREAS = [
  'Anna Nagar',
  'T. Nagar',
  'Velachery',
  'OMR',
  'Adyar',
  'Porur',
  'Sholinganallur',
  'Ambattur',
  'Tambaram',
  'Perambur'
];

const MOCK_PROPERTIES = [
  {
    title: 'Luxury 3BHK Apartment',
    area: 'Anna Nagar',
    type: 'apartment',
    listingType: 'sale',
    price: 8500000, // 85 Lakhs
    priceUnit: 'Lakhs',
    beds: 3,
    baths: 2,
    sqft: 1450,
    floor: '4th of 12',
    facing: 'East',
    age: 'New',
    furnishing: 'Semi Furnished',
    featured: true,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
    ]
  },
  {
    title: 'Spacious 2BHK Flat',
    area: 'T. Nagar',
    type: 'apartment',
    listingType: 'rent',
    price: 22000,
    priceUnit: '/mo',
    beds: 2,
    baths: 2,
    sqft: 1100,
    floor: '2nd of 8',
    facing: 'North',
    age: '5 Yrs',
    furnishing: 'Fully Furnished',
    featured: true,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
    ]
  },
  {
    title: 'Modern Villa with Pool',
    area: 'Adyar',
    type: 'villa',
    listingType: 'sale',
    price: 24000000, // 2.4 Cr
    priceUnit: 'Cr',
    beds: 4,
    baths: 4,
    sqft: 3200,
    floor: 'Ground',
    facing: 'North-East',
    age: '2 Yrs',
    furnishing: 'Fully Furnished',
    featured: true,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80'
    ]
  },
  {
    title: '1BHK Studio Apartment',
    area: 'Velachery',
    type: 'apartment',
    listingType: 'rent',
    price: 12000,
    priceUnit: '/mo',
    beds: 1,
    baths: 1,
    sqft: 550,
    floor: '3rd of 6',
    facing: 'West',
    age: '3 Yrs',
    furnishing: 'Semi Furnished',
    featured: false,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
    ]
  },
  {
    title: '4BHK Independent House',
    area: 'OMR',
    type: 'villa',
    listingType: 'sale',
    price: 11000000, // 1.1 Cr
    priceUnit: 'Cr',
    beds: 4,
    baths: 3,
    sqft: 2600,
    floor: 'G+1',
    facing: 'South',
    age: '4 Yrs',
    furnishing: 'Unfurnished',
    featured: false,
    verified: false,
    images: [
      'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&q=80'
    ]
  },
  {
    title: 'Commercial Office Space',
    area: 'Porur',
    type: 'commercial',
    listingType: 'rent',
    price: 65000,
    priceUnit: '/mo',
    beds: 0,
    baths: 4,
    sqft: 4200,
    floor: '6th of 10',
    facing: 'East',
    age: 'New',
    furnishing: 'Fully Furnished',
    featured: false,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
    ]
  },
  {
    title: 'Prime Residential Plot',
    area: 'Sholinganallur',
    type: 'plot',
    listingType: 'sale',
    price: 4500000, // 45 Lakhs
    priceUnit: 'Lakhs',
    beds: 0,
    baths: 0,
    sqft: 1200,
    floor: 'Ground',
    facing: 'East',
    age: 'NA',
    furnishing: 'Unfurnished',
    featured: false,
    verified: false,
    images: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80'
    ]
  },
  {
    title: 'Semi-Furnished 3BHK',
    area: 'Ambattur',
    type: 'apartment',
    listingType: 'rent',
    price: 18000,
    priceUnit: '/mo',
    beds: 3,
    baths: 2,
    sqft: 1300,
    floor: '1st of 5',
    facing: 'North',
    age: '6 Yrs',
    furnishing: 'Semi Furnished',
    featured: false,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
    ]
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Seeding initial data into Supabase PostgreSQL...');
    await client.query('BEGIN');

    // 1. Seed Locations (India -> Tamil Nadu -> Chennai -> Areas)
    console.log('Seeding locations...');
    // Country
    let countryRes = await client.query(
      `INSERT INTO locations (location_type, name, code)
       VALUES ('country', 'India', 'IN')
       ON CONFLICT (parent_id, location_type, name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id;`
    );
    const countryId = countryRes.rows[0]?.id || (await client.query("SELECT id FROM locations WHERE code='IN'")).rows[0].id;

    // State
    let stateRes = await client.query(
      `INSERT INTO locations (parent_id, location_type, name, code)
       VALUES ($1, 'state', 'Tamil Nadu', 'TN')
       ON CONFLICT (parent_id, location_type, name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id;`,
      [countryId]
    );
    const stateId = stateRes.rows[0]?.id || (await client.query("SELECT id FROM locations WHERE code='TN'")).rows[0].id;

    // City: Chennai
    let cityRes = await client.query(
      `INSERT INTO locations (parent_id, location_type, name, code)
       VALUES ($1, 'city', 'Chennai', 'MAA')
       ON CONFLICT (parent_id, location_type, name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id;`,
      [stateId]
    );
    const cityId = cityRes.rows[0]?.id || (await client.query("SELECT id FROM locations WHERE name='Chennai' AND parent_id=$1", [stateId])).rows[0].id;

    // Localities
    const locationMap = {};
    for (const area of AREAS) {
      const locRes = await client.query(
        `INSERT INTO locations (parent_id, location_type, name)
         VALUES ($1, 'district', $2)
         ON CONFLICT (parent_id, location_type, name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id;`,
        [cityId, area]
      );
      locationMap[area] = locRes.rows[0]?.id || (await client.query("SELECT id FROM locations WHERE name=$1 AND parent_id=$2", [area, cityId])).rows[0].id;
    }
    console.log(`✅ Seeded ${AREAS.length} localities under Chennai.`);

    // 2. Ensure property category
    const catRes = await client.query("SELECT id FROM categories WHERE slug='properties' LIMIT 1;");
    let categoryId = catRes.rows[0]?.id;
    if (!categoryId) {
      const newCat = await client.query(
        `INSERT INTO categories (category_group, name, slug, sort_order)
         VALUES ('property', 'Properties', 'properties', 1)
         RETURNING id;`
      );
      categoryId = newCat.rows[0].id;
    }

    // 3. Seed Users (Admin & Agent)
    console.log('Seeding demo admin and agent users...');
    const passwordHash = await bcrypt.hash('Password@123', 10);

    // Admin User
    const adminUserRes = await client.query(
      `INSERT INTO users (full_name, phone, email, password_hash, account_status)
       VALUES ('Aurally Admin', '9876543210', 'admin@aurallyrealty.com', $1, 'active')
       ON CONFLICT DO NOTHING
       RETURNING id;`,
      [passwordHash]
    );
    const adminId = adminUserRes.rows[0]?.id || (await client.query("SELECT id FROM users WHERE phone='9876543210'")).rows[0].id;

    // Assign admin role
    const adminRoleRes = await client.query("SELECT id FROM roles WHERE role_key='admin';");
    if (adminRoleRes.rows.length > 0) {
      await client.query(
        `INSERT INTO user_roles (user_id, role_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, role_id) DO NOTHING;`,
        [adminId, adminRoleRes.rows[0].id]
      );
    }

    // Agent / Seller User
    const agentUserRes = await client.query(
      `INSERT INTO users (full_name, phone, email, password_hash, account_status)
       VALUES ('Priya Suresh', '9840012345', 'priya@aurallyrealty.com', $1, 'active')
       ON CONFLICT DO NOTHING
       RETURNING id;`,
      [passwordHash]
    );
    const agentId = agentUserRes.rows[0]?.id || (await client.query("SELECT id FROM users WHERE phone='9840012345'")).rows[0].id;

    const agentRoleRes = await client.query("SELECT id FROM roles WHERE role_key='property_agent';");
    if (agentRoleRes.rows.length > 0) {
      await client.query(
        `INSERT INTO user_roles (user_id, role_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, role_id) DO NOTHING;`,
        [agentId, agentRoleRes.rows[0].id]
      );
    }
    console.log('✅ Seeded users: admin (9876543210) and agent (9840012345). Password: Password@123');

    // 4. Seed Properties
    console.log('Seeding properties...');
    for (const prop of MOCK_PROPERTIES) {
      const slug = prop.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + prop.area.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const locationId = locationMap[prop.area] || cityId;

      const propRes = await client.query(
        `INSERT INTO properties (
          owner_user_id, category_id, location_id, title, slug,
          listing_type, property_type, description, price, currency,
          built_up_area, built_up_area_unit, bedrooms, bathrooms,
          address_line1, listing_status, published_at, contact_name, contact_phone
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, 'INR',
          $10, 'sq.ft', $11, $12,
          $13, 'published', NOW(), 'Priya Suresh', '9840012345'
        )
        ON CONFLICT (slug) DO UPDATE SET
          price = EXCLUDED.price,
          listing_status = 'published'
        RETURNING id;`,
        [
          agentId,
          categoryId,
          locationId,
          prop.title,
          slug,
          prop.listingType,
          prop.type,
          `Premium ${prop.beds > 0 ? prop.beds + ' BHK ' : ''}${prop.type} located in prime locality of ${prop.area}, Chennai. Excellent connectivity to IT corridors, schools, and hospitals.`,
          prop.price,
          prop.sqft,
          prop.beds,
          prop.baths,
          `${prop.area}, Chennai, Tamil Nadu`
        ]
      );

      const propertyId = propRes.rows[0].id;

      // Seed property media
      for (let i = 0; i < prop.images.length; i++) {
        await client.query(
          `INSERT INTO property_media (property_id, media_type, file_url, sort_order, is_primary)
           VALUES ($1, 'image', $2, $3, $4)
           ON CONFLICT DO NOTHING;`,
          [propertyId, prop.images[i], i, i === 0]
        );
      }

      // Seed property features (floor, facing, age, furnishing, featured, verified, priceUnit)
      const features = [
        { key: 'floor', val: prop.floor },
        { key: 'facing', val: prop.facing },
        { key: 'age', val: prop.age },
        { key: 'furnishing', val: prop.furnishing },
        { key: 'featured', val: String(prop.featured) },
        { key: 'verified', val: String(prop.verified) },
        { key: 'priceUnit', val: prop.priceUnit }
      ];

      for (const f of features) {
        await client.query(
          `INSERT INTO property_features (property_id, feature_key, feature_value)
           VALUES ($1, $2, $3)
           ON CONFLICT (property_id, feature_key) DO UPDATE SET feature_value = EXCLUDED.feature_value;`,
          [propertyId, f.key, f.val]
        );
      }
    }

    console.log(`✅ Successfully seeded ${MOCK_PROPERTIES.length} properties with images and features.`);
    await client.query('COMMIT');
    console.log('🎉 Database seeding complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
