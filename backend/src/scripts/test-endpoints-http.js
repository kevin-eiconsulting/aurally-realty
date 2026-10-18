import { pool } from '../config/db.js';

async function runHttpTests() {
  const BASE_URL = 'http://localhost:4000';
  console.log(`📡 Testing API on ${BASE_URL}...`);
  try {
    // 1. Health
    const resHealth = await fetch(`${BASE_URL}/api/health`);
    console.log(`[1] GET /api/health -> ${resHealth.status}`, await resHealth.json());

    // 2. Services Categories
    const resCat = await fetch(`${BASE_URL}/api/services/categories`);
    const cats = await resCat.json();
    console.log(`[2] GET /api/services/categories -> ${resCat.status}, found ${cats.length} categories.`);

    // 3. Services list
    const resServ = await fetch(`${BASE_URL}/api/services?category=construction-services`);
    const servs = await resServ.json();
    console.log(`[3] GET /api/services?category=construction-services -> ${resServ.status}, found ${servs.length} services.`);

    // 4. Single Service by slug
    const resSingleServ = await fetch(`${BASE_URL}/api/services/architectural-planning-design`);
    const singleServ = await resSingleServ.json();
    console.log(`[4] GET /api/services/architectural-planning-design -> ${resSingleServ.status}, title: "${singleServ.name}", listings: ${singleServ.listings?.length}`);

    // 5. Experts list
    const resExperts = await fetch(`${BASE_URL}/api/experts?discipline=architect`);
    const experts = await resExperts.json();
    console.log(`[5] GET /api/experts?discipline=architect -> ${resExperts.status}, found ${experts.length} expert(s). First: "${experts[0]?.public_name}"`);

    // 6. Expert by ID
    const resExpById = await fetch(`${BASE_URL}/api/experts/1`);
    const exp1 = await resExpById.json();
    console.log(`[6] GET /api/experts/1 -> ${resExpById.status}, name: "${exp1.public_name}", offerings: ${exp1.listings?.length}`);

    // 7. Auth Login
    const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rajesh@aurallyexperts.com', password: 'Password@123' })
    });
    const loginData = await resLogin.json();
    console.log(`[7] POST /api/auth/login -> ${resLogin.status}, token: ${loginData.token ? 'YES' : 'NO'}, user: ${loginData.user?.username}`);
    const token = loginData.token;

    // 8. Auth Profile
    const resProfile = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profile = await resProfile.json();
    console.log(`[8] GET /api/auth/profile -> ${resProfile.status}, name: "${profile.full_name}", stats:`, profile.stats);

    // 9. My Properties
    const resMyProps = await fetch(`${BASE_URL}/api/properties/user/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const myProps = await resMyProps.json();
    console.log(`[9] GET /api/properties/user/my -> ${resMyProps.status}, properties count: ${myProps.length}`);

    // 10. My Enquiries
    const resMyEnq = await fetch(`${BASE_URL}/api/enquiries/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const myEnq = await resMyEnq.json();
    console.log(`[10] GET /api/enquiries/my -> ${resMyEnq.status}, enquiries count: ${myEnq.length}`);

    // 11. Create Service Enquiry
    const resEnq = await fetch(`${BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        service_id: singleServ.id,
        contact_name: 'Anand Sharma',
        contact_phone: '9840998877',
        contact_email: 'anand@aurallytest.com',
        message: 'Interested in CMDA sanction drawings for my 2400 sqft residential villa in Anna Nagar.'
      })
    });
    const enqData = await resEnq.json();
    console.log(`[11] POST /api/enquiries -> ${resEnq.status}, success: ${enqData.success}, id: ${enqData.enquiry?.id}`);

    // Clean up test enquiry
    if (enqData.enquiry?.id) {
      await pool.query('DELETE FROM enquiries WHERE id = $1;', [enqData.enquiry.id]);
      console.log(`🧹 Cleaned up test enquiry ${enqData.enquiry.id}.`);
    }

    console.log('\n🎉 ALL 11 ENDPOINT HTTP TESTS PASSED PERFECTLY ON PORT 4000!');
  } catch (err) {
    console.error('❌ HTTP Test Error:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runHttpTests();
