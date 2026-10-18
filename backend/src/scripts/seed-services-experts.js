import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

// ─────────────────────────────────────────────
// CORE SERVICES CATALOGUE
// ─────────────────────────────────────────────
const CORE_SERVICES = [
  // Category 3: Construction Services
  {
    category_id: 3,
    name: 'Turnkey Construction',
    slug: 'turnkey-construction',
    description: 'Complete end-to-end residential and commercial building construction from excavation to key handover.'
  },
  {
    category_id: 3,
    name: 'Civil Works & Masonry',
    slug: 'civil-works-masonry',
    description: 'Structural brickwork, blockwork, plastering, lintels, and foundation masonry works.'
  },
  {
    category_id: 3,
    name: 'Renovation & Remodeling',
    slug: 'renovation-remodeling',
    description: 'Comprehensive home expansion, floor additions, structural modifications, and modern remodeling.'
  },
  {
    category_id: 3,
    name: 'Waterproofing Solutions',
    slug: 'waterproofing-solutions',
    description: 'Advanced crystalline, PU coating, and membrane waterproofing for roofs, basements, and wet areas.'
  },
  {
    category_id: 3,
    name: 'Demolition & Excavation',
    slug: 'demolition-excavation',
    description: 'Controlled building demolition, site clearance, earthmoving, and heavy foundation excavation.'
  },
  {
    category_id: 3,
    name: 'Structural Retrofitting',
    slug: 'structural-retrofitting',
    description: 'Carbon fiber wrapping, micro-concreting, and column jacketing for seismic and load retrofits.'
  },

  // Category 12: Experts on Demand
  {
    category_id: 12,
    name: 'Architectural Planning & 3D Design',
    slug: 'architectural-planning-design',
    description: 'CMDA compliant architectural blueprints, elevation renderings, 3D walkthroughs, and space planning.'
  },
  {
    category_id: 12,
    name: 'Structural Engineering & Certification',
    slug: 'structural-engineering-certification',
    description: 'Seismic structural analysis, foundation design, stability certification, and peer review.'
  },
  {
    category_id: 12,
    name: 'Land & Topographic Surveying',
    slug: 'land-topographic-surveying',
    description: 'High-precision DGPS boundary demarcation, drone contour surveys, and layout plotting.'
  },
  {
    category_id: 12,
    name: 'Property Valuation & Estimation',
    slug: 'property-valuation-estimation',
    description: 'Government-approved valuation for bank loans, capital gains, court probate, and fair market assessments.'
  },
  {
    category_id: 12,
    name: 'RERA & Legal Title Verification',
    slug: 'rera-legal-title-verification',
    description: '30-year encumbrance review, parent deed verification, patta clearance, and TNRERA compliance.'
  },
  {
    category_id: 12,
    name: 'Vastu & Sustainable Site Planning',
    slug: 'vastu-sustainable-planning',
    description: 'Scientific Vedic Vastu orientation analysis and eco-friendly bioclimatic site layout design.'
  },

  // Category 7: Interiors & Home Improvement
  {
    category_id: 7,
    name: 'Modular Kitchen Design',
    slug: 'modular-kitchen-design',
    description: 'Ergonomic acrylic, PU, and marine ply modular kitchens with branded soft-close German hardware.'
  },
  {
    category_id: 7,
    name: 'False Ceiling & Lighting',
    slug: 'false-ceiling-lighting',
    description: 'Gypsum ceiling design, acoustic baffles, cove lighting, and architectural magnetic track illumination.'
  },
  {
    category_id: 7,
    name: 'Full Interior Fitouts',
    slug: 'full-interior-fitouts',
    description: 'Turnkey interior execution including custom wardrobes, TV units, wall paneling, and loose furniture.'
  },
  {
    category_id: 7,
    name: 'Painting & Textured Wall Finishes',
    slug: 'painting-textured-finishes',
    description: 'Airless spray interior luxury finishes, Italian stucco textures, exterior elastomeric weather shields.'
  },

  // Category 8: Finance, Legal & Approvals
  {
    category_id: 8,
    name: 'Home Loan Advisory',
    slug: 'home-loan-advisory',
    description: 'Multi-bank mortgage consultation, balance transfers, PMAY subsidy guidance, and swift loan sanctions.'
  },
  {
    category_id: 8,
    name: 'CMDA / DTCP Building Approvals',
    slug: 'cmda-dtcp-building-approvals',
    description: 'Fast-track building plan approval submission, online scrutiny clearance, and completion certificates.'
  },
  {
    category_id: 8,
    name: 'Property Registration & Patta Transfer',
    slug: 'property-registration-patta-transfer',
    description: 'Sub-registrar document registration, guideline value computation, chitta and online patta transfers.'
  },

  // Category 9: Property Management
  {
    category_id: 9,
    name: 'Rental Property Management',
    slug: 'rental-property-management',
    description: 'Tenant screening, rental agreement drafting, rent escrow collection, and tenant changeover management.'
  },
  {
    category_id: 9,
    name: 'Facility & Society Maintenance',
    slug: 'facility-society-maintenance',
    description: 'Gated community facility operations, security management, electrical and plumbing AMC maintenance.'
  },
  {
    category_id: 9,
    name: 'Periodic Home Inspection & Audit',
    slug: 'periodic-home-inspection-audit',
    description: 'Comprehensive 150-point structural, seepage, electrical, and plumbing snag audit with digital report.'
  },

  // Category 10: Sustainability & Utilities
  {
    category_id: 10,
    name: 'Rooftop Solar Installation',
    slug: 'rooftop-solar-installation',
    description: 'On-grid and hybrid rooftop solar PV systems with TANGEDCO bi-directional net metering setup.'
  },
  {
    category_id: 10,
    name: 'Rainwater Harvesting Systems',
    slug: 'rainwater-harvesting-systems',
    description: 'Recharge borewells, percolation pits, filtration units, and MetroWater statutory compliance.'
  },
  {
    category_id: 10,
    name: 'Sewage Treatment Plants (STP)',
    slug: 'sewage-treatment-plants-stp',
    description: 'MBBR and SBR technology sewage treatment units, recycling wastewater for gardening and flushing.'
  }
];

// ─────────────────────────────────────────────
// 6 VERIFIED EXPERT USERS AND PROFILES
// ─────────────────────────────────────────────
const EXPERTS = [
  {
    user: {
      full_name: 'Ar. Rajesh Balan',
      email: 'rajesh@aurallyexperts.com',
      phone: '9841023456',
      role: 'professional'
    },
    profile: {
      public_name: 'Ar. Rajesh Balan, B.Arch, AIIA',
      provider_type: 'individual',
      headline: 'Senior Chartered Architect & Urban Planner',
      description: 'Specialist in modern sustainable residential villas, commercial complexes, and CMDA sanction-compliant architectural layouts. Over 14 years of design excellence across Chennai and Coimbatore.',
      qualifications: 'B.Arch (Anna University), Fellow of Indian Institute of Architects (FIIA)',
      license_number: 'CA/2012/54821',
      years_experience: 14,
      verification_status: 'verified',
      profile_status: 'published'
    },
    listings: [
      {
        service_slug: 'architectural-planning-design',
        title: 'Architectural Blueprint, 3D Elevation & CMDA Sanction Drawings',
        description: 'Comprehensive architectural drawing package including working layouts, structural coordination, high-res 3D exterior renders, and regulatory approval submission sets.',
        pricing_model: 'per_sqft',
        starting_price: 35,
        service_mode: 'both'
      }
    ]
  },
  {
    user: {
      full_name: 'Er. K. V. Sundararajan',
      email: 'sundar@aurallyexperts.com',
      phone: '9841034567',
      role: 'professional'
    },
    profile: {
      public_name: 'Er. K. V. Sundararajan, M.E. (Struct)',
      provider_type: 'individual',
      headline: 'Certified Structural Consultant & Foundation Specialist',
      description: 'Expert structural engineering consultation, seismic load analysis, soil-bearing capacity design, and structural safety certification for multi-storey residential and commercial developments.',
      qualifications: 'M.E. Structural Engineering (IIT Madras), Chartered Engineer (IEI)',
      license_number: 'SE/TN/1049',
      years_experience: 18,
      verification_status: 'verified',
      profile_status: 'published'
    },
    listings: [
      {
        service_slug: 'structural-engineering-certification',
        title: 'Structural Design, STAAD Analysis & Stability Certification',
        description: 'Rigorous structural calculation reports, foundation reinforcement drawings, column schedules, and structural stability certificates signed by licensed engineer.',
        pricing_model: 'quote_required',
        starting_price: 15000,
        service_mode: 'both'
      }
    ]
  },
  {
    user: {
      full_name: 'Ananya Deshmukh',
      email: 'ananya@aurallyexperts.com',
      phone: '9841045678',
      role: 'professional'
    },
    profile: {
      public_name: 'Ananya Deshmukh & Associates',
      provider_type: 'team',
      headline: 'Contemporary Interior Architecture & Turnkey Decor',
      description: 'Award-winning interior design studio specializing in bespoke modular kitchens, luxury residential aesthetics, space optimization, and end-to-end interior execution.',
      qualifications: 'M.Des (Interior Architecture, CEPT), IIID Registered',
      license_number: 'IIID/2016/884',
      years_experience: 10,
      verification_status: 'verified',
      profile_status: 'published'
    },
    listings: [
      {
        service_slug: 'modular-kitchen-design',
        title: 'Bespoke German Hardware Modular Kitchens & Wardrobes',
        description: 'Complete custom modular kitchen solutions with marine ply carcasses, acrylic or PU shutters, quartz worktops, and Blum/Hettich fittings.',
        pricing_model: 'quote_required',
        starting_price: 150000,
        service_mode: 'onsite'
      },
      {
        service_slug: 'full-interior-fitouts',
        title: 'Turnkey Luxury Villa & Apartment Interior Fitouts',
        description: 'Complete turnkey home interiors covering false ceilings, mood lighting, custom wood joinery, wallpaper, and bespoke soft furnishings.',
        pricing_model: 'quote_required',
        starting_price: 350000,
        service_mode: 'onsite'
      }
    ]
  },
  {
    user: {
      full_name: 'Senthil Kumar (BuildCraft)',
      email: 'buildcraft@aurallycontractors.com',
      phone: '9841056789',
      role: 'contractor'
    },
    profile: {
      public_name: 'BuildCraft Civil Contractors',
      provider_type: 'company',
      headline: 'Class-1 Civil & Turnkey Residential Contractors',
      description: 'Premier civil engineering contracting firm with end-to-end turnkey residential construction, RCC frame erection, quality control testing, and on-time project handover.',
      qualifications: 'PWD Class-1 Registered Contractor, ISO 9001:2015 Certified',
      license_number: 'PWD/CL1/9822',
      years_experience: 20,
      verification_status: 'verified',
      profile_status: 'published'
    },
    listings: [
      {
        service_slug: 'turnkey-construction',
        title: 'Complete Turnkey Residential House Construction',
        description: 'A-grade material specification construction: Tata Tiscon steel, UltraTech cement, vitrified tiling, teak wood joinery, and 10-year structural warranty.',
        pricing_model: 'per_sqft',
        starting_price: 1950,
        service_mode: 'onsite'
      },
      {
        service_slug: 'civil-works-masonry',
        title: 'Structural RCC Frame & Brick Masonry Contracting',
        description: 'Foundation casting, column erection, slab shuttering, and precision AAC or red clay brickwork with seasoned site supervisor.',
        pricing_model: 'per_sqft',
        starting_price: 650,
        service_mode: 'onsite'
      }
    ]
  },
  {
    user: {
      full_name: 'GeoSurvey Tech Labs',
      email: 'geosurvey@aurallyexperts.com',
      phone: '9841067890',
      role: 'professional'
    },
    profile: {
      public_name: 'GeoSurvey Tech Labs',
      provider_type: 'team',
      headline: 'DGPS, Drone & Total Station Land Surveyors',
      description: 'Advanced surveying laboratory utilizing dual-frequency RTK DGPS, photogrammetry drones, and robotic total stations for boundary demarcations, contour mapping, and subdivision planning.',
      qualifications: 'Licensed Land Surveyors, DGCA Certified Drone Pilots',
      license_number: 'SURV/TN/2018/431',
      years_experience: 8,
      verification_status: 'verified',
      profile_status: 'published'
    },
    listings: [
      {
        service_slug: 'land-topographic-surveying',
        title: 'DGPS Boundary Demarcation & Drone Topographic Survey',
        description: 'Millimeter-accuracy boundary pinning, digital contour CAD models, spot heights, and revenue survey boundary alignment.',
        pricing_model: 'fixed',
        starting_price: 8000,
        service_mode: 'onsite'
      }
    ]
  },
  {
    user: {
      full_name: 'Adv. S. Murugesan',
      email: 'murugesan@aurallylegal.com',
      phone: '9841078901',
      role: 'professional'
    },
    profile: {
      public_name: 'Adv. S. Murugesan, B.A. B.L.',
      provider_type: 'individual',
      headline: 'High Court Property Advocate & RERA Specialist',
      description: '22+ years practicing before Madras High Court and TNRERA. Specializing in property title clearance, 30-year encumbrance scrutiny, parent document verification, and builder agreement vetting.',
      qualifications: 'B.A. B.L. (Madras Law College), Member Bar Council of Tamil Nadu',
      license_number: 'BC/TN/2004/819',
      years_experience: 22,
      verification_status: 'verified',
      profile_status: 'published'
    },
    listings: [
      {
        service_slug: 'rera-legal-title-verification',
        title: '30-Year Property Legal Opinion & Patta Title Due Diligence',
        description: 'Comprehensive legal opinion report, EC scrutiny, link document flow analysis, revenue patta validation, and court litigation clearance.',
        pricing_model: 'fixed',
        starting_price: 12000,
        service_mode: 'both'
      }
    ]
  }
];

// ─────────────────────────────────────────────
// MAIN SEED SCRIPT
// ─────────────────────────────────────────────
async function seedServicesAndExperts() {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting Services & Experts Directory Seed...');
    await client.query('BEGIN');

    // 1. Resolve Chennai Location
    let chennaiLocId = null;
    const locRes = await client.query(`
      SELECT id FROM locations WHERE LOWER(name) = 'chennai' AND location_type = 'city' LIMIT 1;
    `);
    if (locRes.rows.length > 0) {
      chennaiLocId = locRes.rows[0].id;
    } else {
      const stateRes = await client.query(`SELECT id FROM locations WHERE code = 'TN' LIMIT 1;`);
      const parentId = stateRes.rows[0]?.id || null;
      const newLoc = await client.query(`
        INSERT INTO locations (parent_id, location_type, name, code)
        VALUES ($1, 'city', 'Chennai', 'MAA')
        RETURNING id;
      `, [parentId]);
      chennaiLocId = newLoc.rows[0].id;
    }
    console.log(`📍 Location Chennai resolved: id = ${chennaiLocId}`);

    // 2. Seed Services
    console.log(`\n📋 Seeding ${CORE_SERVICES.length} core services...`);
    let serviceCount = 0;
    const serviceSlugToId = {};

    for (const s of CORE_SERVICES) {
      const res = await client.query(`
        INSERT INTO services (category_id, name, slug, description, is_active)
        VALUES ($1, $2, $3, $4, true)
        ON CONFLICT (slug) DO UPDATE SET
          category_id = EXCLUDED.category_id,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          is_active = true,
          updated_at = NOW()
        RETURNING id, slug, name;
      `, [s.category_id, s.name, s.slug, s.description]);

      serviceSlugToId[res.rows[0].slug] = res.rows[0].id;
      serviceCount++;
    }
    console.log(`✅ Upserted ${serviceCount} services in database.`);

    // 3. Resolve Role IDs
    const roleRes = await client.query(`SELECT id, role_key FROM roles;`);
    const roleMap = {};
    for (const r of roleRes.rows) {
      roleMap[r.role_key] = r.id;
    }

    // 4. Seed 6 Verified Experts
    console.log(`\n👷 Seeding ${EXPERTS.length} verified expert providers...`);
    const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

    for (const exp of EXPERTS) {
      // 4a. User upsert
      let userId = null;
      const existingUser = await client.query(`
        SELECT id FROM users WHERE phone = $1 OR (email IS NOT NULL AND LOWER(email) = LOWER($2)) LIMIT 1;
      `, [exp.user.phone, exp.user.email]);

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id;
        await client.query(`
          UPDATE users SET
            full_name = $1,
            email = $2,
            phone = $3,
            account_status = 'active',
            password_hash = COALESCE(password_hash, $4),
            updated_at = NOW()
          WHERE id = $5;
        `, [exp.user.full_name, exp.user.email, exp.user.phone, defaultPasswordHash, userId]);
      } else {
        const newUser = await client.query(`
          INSERT INTO users (full_name, email, phone, password_hash, account_status)
          VALUES ($1, $2, $3, $4, 'active')
          RETURNING id;
        `, [exp.user.full_name, exp.user.email, exp.user.phone, defaultPasswordHash]);
        userId = newUser.rows[0].id;
      }

      // 4b. Role assignment
      const roleId = roleMap[exp.user.role] || roleMap['professional'];
      if (roleId) {
        await client.query(`
          INSERT INTO user_roles (user_id, role_id)
          VALUES ($1, $2)
          ON CONFLICT (user_id, role_id) DO NOTHING;
        `, [userId, roleId]);
      }

      // 4c. Service Provider upsert
      const prof = exp.profile;
      const provRes = await client.query(`
        INSERT INTO service_providers (
          user_id, location_id, public_name, provider_type, headline, description,
          qualifications, license_number, years_experience, contact_email, contact_phone,
          verification_status, profile_status
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11,
          $12, $13
        )
        ON CONFLICT (user_id) DO UPDATE SET
          location_id = EXCLUDED.location_id,
          public_name = EXCLUDED.public_name,
          provider_type = EXCLUDED.provider_type,
          headline = EXCLUDED.headline,
          description = EXCLUDED.description,
          qualifications = EXCLUDED.qualifications,
          license_number = EXCLUDED.license_number,
          years_experience = EXCLUDED.years_experience,
          contact_email = EXCLUDED.contact_email,
          contact_phone = EXCLUDED.contact_phone,
          verification_status = EXCLUDED.verification_status,
          profile_status = EXCLUDED.profile_status,
          updated_at = NOW()
        RETURNING id;
      `, [
        userId,
        chennaiLocId,
        prof.public_name,
        prof.provider_type,
        prof.headline,
        prof.description,
        prof.qualifications,
        prof.license_number,
        prof.years_experience,
        exp.user.email,
        exp.user.phone,
        prof.verification_status,
        prof.profile_status
      ]);

      const providerId = provRes.rows[0].id;

      // Clean existing listings for this provider before re-inserting
      await client.query(`DELETE FROM service_listings WHERE provider_id = $1;`, [providerId]);

      // 4d. Service Listings
      for (const listing of exp.listings) {
        const serviceId = serviceSlugToId[listing.service_slug];
        if (!serviceId) {
          console.warn(`⚠️ Service slug not found: ${listing.service_slug}`);
          continue;
        }

        await client.query(`
          INSERT INTO service_listings (
            provider_id, service_id, location_id, title, description,
            pricing_model, starting_price, currency, service_mode, listing_status
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, 'INR', $8, 'published'
          );
        `, [
          providerId,
          serviceId,
          chennaiLocId,
          listing.title,
          listing.description,
          listing.pricing_model,
          listing.starting_price,
          listing.service_mode
        ]);
      }

      console.log(`   ✨ ${prof.public_name} (Provider ID: ${providerId}, Listings: ${exp.listings.length})`);
    }

    await client.query('COMMIT');
    console.log('\n🎉 Seed completed and transaction committed successfully!');

    // Verification summary
    const sCount = await client.query('SELECT count(*) FROM services;');
    const pCount = await client.query('SELECT count(*) FROM service_providers;');
    const lCount = await client.query('SELECT count(*) FROM service_listings;');

    console.log(`\n📊 DB Verification:`);
    console.log(`   - Services count: ${sCount.rows[0].count}`);
    console.log(`   - Service Providers count: ${pCount.rows[0].count}`);
    console.log(`   - Service Listings count: ${lCount.rows[0].count}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during services/experts seed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedServicesAndExperts();
