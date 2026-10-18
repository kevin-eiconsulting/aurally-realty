import { pool } from '../config/db.js';

async function updateTaxonomy() {
  const client = await pool.connect();
  try {
    console.log('🔧 Starting taxonomy update...');
    await client.query('BEGIN');

    // STEP 1: Rename category id=3 from 'Experts & Construction Services' to 'Construction Services'
    console.log('Step 1: Renaming category id=3...');
    const renameRes = await client.query(`
      UPDATE categories
      SET name = 'Construction Services',
          slug = 'construction-services',
          category_group = 'professional_service',
          sort_order = 3
      WHERE id = 3
      RETURNING id, name, slug, sort_order;
    `);
    if (renameRes.rows.length > 0) {
      console.log(`  ✅ Renamed: ${JSON.stringify(renameRes.rows[0])}`);
    } else {
      console.log('  ⚠️  Category id=3 not found or already updated.');
    }

    // STEP 2: Insert new categories (Experts on Demand, GeoBuild)
    console.log('Step 2: Inserting new categories...');

    const newCategories = [
      { name: 'Experts on Demand', slug: 'experts-on-demand', group: 'professional_service', sort_order: 4 },
      { name: 'GeoBuild', slug: 'geobuild', group: 'general', sort_order: 5 },
    ];

    for (const cat of newCategories) {
      const res = await client.query(`
        INSERT INTO categories (name, slug, category_group, sort_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO NOTHING
        RETURNING id, name, slug;
      `, [cat.name, cat.slug, cat.group, cat.sort_order]);
      if (res.rows.length > 0) {
        console.log(`  ✅ Inserted: ${res.rows[0].name} (slug: ${res.rows[0].slug})`);
      } else {
        console.log(`  ℹ️  Already exists: ${cat.name} — skipped.`);
      }
    }

    // STEP 3: Update sort_orders for existing categories to match img1
    console.log('Step 3: Updating sort orders for existing categories...');

    const sortUpdates = [
      { slug: 'properties', sort_order: 1 },
      { slug: 'building-materials', sort_order: 2 },
      { slug: 'construction-services', sort_order: 3 },
      { slug: 'experts-on-demand', sort_order: 4 },
      { slug: 'geobuild', sort_order: 5 },
      { slug: 'quality-testing', sort_order: 6 },
      { slug: 'tools-equipment', sort_order: 7 },
      { slug: 'storage-logistics', sort_order: 8 },
      { slug: 'interiors-home-improvement', sort_order: 9 },
      { slug: 'finance-legal-approvals', sort_order: 10 },
      { slug: 'property-management', sort_order: 11 },
      { slug: 'sustainability-utilities', sort_order: 12 },
      { slug: 'other-services', sort_order: 13 },
    ];

    for (const upd of sortUpdates) {
      const res = await client.query(`
        UPDATE categories SET sort_order = $1 WHERE slug = $2
        RETURNING id, name, slug, sort_order;
      `, [upd.sort_order, upd.slug]);
      if (res.rows.length > 0) {
        console.log(`  ✅ sort_order=${upd.sort_order} → ${res.rows[0].name}`);
      } else {
        console.log(`  ⚠️  Slug '${upd.slug}' not found — skipping sort_order update.`);
      }
    }

    await client.query('COMMIT');
    console.log('\n✅ Taxonomy update committed!');

    // Verify: Print all categories
    const allCats = await client.query(`
      SELECT id, name, slug, category_group, sort_order, parent_category_id
      FROM categories
      ORDER BY sort_order ASC NULLS LAST, id ASC;
    `);
    console.log('\n📋 Current categories table:');
    console.table(allCats.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Taxonomy update failed, rolled back:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

updateTaxonomy();
