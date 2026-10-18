import { pool } from '../config/db.js';

const r1 = await pool.query('SELECT id, name, slug, sort_order FROM categories WHERE parent_category_id IS NULL ORDER BY sort_order');
console.log('=== TOP-LEVEL CATEGORIES ===');
console.table(r1.rows);

const r2 = await pool.query("SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id=c.id JOIN categories pc ON c.parent_category_id=pc.id WHERE pc.slug='building-materials'");
console.log('Products under building-materials:', r2.rows[0].count);

const r3 = await pool.query('SELECT c.name, COUNT(p.id) cnt FROM products p JOIN categories c ON p.category_id=c.id GROUP BY c.name ORDER BY c.name');
console.log('=== PRODUCTS PER SUBCATEGORY ===');
console.table(r3.rows);

await pool.end();
