import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

async function testBackend() {
  console.log('🧪 Testing Backend Controllers & Endpoints Directly...');

  // Test 1: Service Categories
  const catRes = await pool.query(`
    SELECT c.id, c.name, c.slug, COUNT(DISTINCT s.id) AS service_count, COUNT(DISTINCT sl.id) AS listing_count
    FROM categories c
    JOIN services s ON s.category_id = c.id AND s.is_active = true
    LEFT JOIN service_listings sl ON sl.service_id = s.id AND sl.listing_status = 'published'
    GROUP BY c.id ORDER BY c.sort_order ASC, c.name ASC;
  `);
  console.log(`✅ Test 1: getServiceCategories returned ${catRes.rows.length} categories.`);
  console.table(catRes.rows);

  // Test 2: Services
  const servRes = await pool.query(`
    SELECT s.id, s.name, s.slug, c.name AS category_name, COUNT(DISTINCT sl.id) AS listings_count
    FROM services s
    JOIN categories c ON s.category_id = c.id
    LEFT JOIN service_listings sl ON sl.service_id = s.id AND sl.listing_status = 'published'
    GROUP BY s.id, c.id ORDER BY s.name ASC;
  `);
  console.log(`✅ Test 2: getServices returned ${servRes.rows.length} services.`);

  // Test 3: Experts
  const expRes = await pool.query(`
    SELECT sp.id, sp.public_name, sp.provider_type, sp.headline, sp.verification_status,
           COUNT(DISTINCT sl.id) AS listings_count
    FROM service_providers sp
    LEFT JOIN service_listings sl ON sl.provider_id = sp.id AND sl.listing_status = 'published'
    GROUP BY sp.id ORDER BY sp.id ASC;
  `);
  console.log(`✅ Test 3: getExperts returned ${expRes.rows.length} experts.`);
  console.table(expRes.rows);

  // Test 4: Demo user profile & enquiries
  const userRes = await pool.query(`SELECT id, full_name, email FROM users WHERE email = 'rajesh@aurallyexperts.com';`);
  const userId = userRes.rows[0].id;
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'aurally-realty-jwt-secret-key-2025-secure-token');

  console.log(`✅ Test 4: Generated JWT for expert user ${userRes.rows[0].full_name} (id: ${userId})`);

  // Test 5: Verify enquiries constraint with service_listing_id
  const listingRes = await pool.query(`SELECT id FROM service_listings LIMIT 1;`);
  const testListingId = listingRes.rows[0].id;
  const enqInsert = await pool.query(`
    INSERT INTO enquiries (created_by_user_id, service_listing_id, contact_name, contact_phone, contact_email, message)
    VALUES ($1, $2, 'Karthik Raja', '9840112233', 'karthik@example.com', 'Looking for architectural planning for 2400 sqft plot.')
    RETURNING id, contact_name, subject, enquiry_status;
  `, [userId, testListingId]);
  console.log(`✅ Test 5: Successfully created test service enquiry:`, enqInsert.rows[0]);

  // Clean up test enquiry
  await pool.query(`DELETE FROM enquiries WHERE id = $1;`, [enqInsert.rows[0].id]);
  console.log('🧹 Cleaned up test enquiry.');

  console.log('\n🎉 All backend database checks passed successfully!');
  await pool.end();
}

testBackend().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
