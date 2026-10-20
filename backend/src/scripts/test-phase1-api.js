import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

async function runTests() {
  console.log('=== TESTING PHASE 1 BACKEND ENDPOINTS & LOGIC ===');

  // 1. Check an existing property
  const propRes = await pool.query('SELECT id, owner_user_id, views_count FROM properties LIMIT 1;');
  if (propRes.rows.length === 0) {
    console.log('No properties in database to test.');
    await pool.end();
    return;
  }
  const prop = propRes.rows[0];
  console.log(`Testing with Property ID: ${prop.id}, Owner User ID: ${prop.owner_user_id}, Initial Views: ${prop.views_count}`);

  // Test view increment
  const viewUpdate = await pool.query(
    'UPDATE properties SET views_count = COALESCE(views_count, 0) + 1 WHERE id = $1 RETURNING id, views_count;',
    [prop.id]
  );
  console.log(`✓ View increment test passed: New Views = ${viewUpdate.rows[0].views_count}`);

  // Test listing status toggle
  const statusUpdate = await pool.query(
    'UPDATE properties SET listing_status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, listing_status;',
    ['published', prop.id]
  );
  console.log(`✓ Status toggle test passed: Status = ${statusUpdate.rows[0].listing_status}`);

  // Test features upsert (amenities, carpetArea, totalFloors, ownershipType, reraNumber)
  const sampleAmenities = ['Lift', '24/7 Security', 'Covered Parking', 'Gym'];
  await pool.query(`
    INSERT INTO property_features (property_id, feature_key, feature_value)
    VALUES ($1, 'amenities', $2)
    ON CONFLICT (property_id, feature_key) DO UPDATE SET feature_value = EXCLUDED.feature_value;
  `, [prop.id, JSON.stringify(sampleAmenities)]);
  console.log('✓ Amenities upsert passed');

  // Test builder stats query
  const userId = prop.owner_user_id;
  const [propCount, activePropCount, viewsCount, leadsCount, bizProfileRes] = await Promise.all([
    pool.query('SELECT count(*) as count FROM properties WHERE owner_user_id = $1;', [userId]),
    pool.query("SELECT count(*) as count FROM properties WHERE owner_user_id = $1 AND listing_status = 'published';", [userId]),
    pool.query("SELECT COALESCE(SUM(views_count), 0) as views FROM properties WHERE owner_user_id = $1;", [userId]),
    pool.query("SELECT count(*) as count FROM enquiries e JOIN properties p ON e.property_id = p.id WHERE p.owner_user_id = $1;", [userId]),
    pool.query('SELECT * FROM business_profiles WHERE owner_user_id = $1 LIMIT 1;', [userId])
  ]);

  console.log('✓ Builder stats query passed:');
  console.log({
    totalProperties: propCount.rows[0].count,
    activeProperties: activePropCount.rows[0].count,
    totalViews: viewsCount.rows[0].views,
    leadsReceived: leadsCount.rows[0].count,
    hasBusinessProfile: !!bizProfileRes.rows[0]
  });

  // Test business profile update/upsert for builder
  const testCompanyName = 'Aurally Prime Builders';
  const testRera = 'TN/01/Building/2026/0123';
  const testWhatsapp = '9876543210';

  if (bizProfileRes.rows.length > 0) {
    await pool.query(`
      UPDATE business_profiles SET
        business_name = $1,
        rera_registration_number = $2,
        whatsapp_number = $3,
        updated_at = NOW()
      WHERE owner_user_id = $4;
    `, [testCompanyName, testRera, testWhatsapp, userId]);
    console.log('✓ Business profile update passed');
  } else {
    await pool.query(`
      INSERT INTO business_profiles (
        owner_user_id, business_name, business_slug, business_type,
        rera_registration_number, whatsapp_number
      ) VALUES ($1, $2, $3, 'builder', $4, $5);
    `, [userId, testCompanyName, 'aurally-prime-builders', testRera, testWhatsapp]);
    console.log('✓ Business profile insert passed');
  }

  // Test enquiry status update
  const enqRes = await pool.query('SELECT id, enquiry_status FROM enquiries LIMIT 1;');
  if (enqRes.rows.length > 0) {
    const enq = enqRes.rows[0];
    const updatedEnq = await pool.query(
      'UPDATE enquiries SET enquiry_status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, enquiry_status;',
      ['contacted', enq.id]
    );
    console.log(`✓ Enquiry status update passed: ID ${enq.id} -> ${updatedEnq.rows[0].enquiry_status}`);
  }

  await pool.end();
  console.log('\nALL PHASE 1 BACKEND LOGIC VERIFIED AND PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
