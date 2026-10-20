'use client';
import { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '@/lib/api';
import { FALLBACK_MATERIALS, FALLBACK_MATERIAL_CATEGORIES } from '@/lib/materials-data';
import styles from './page.module.css';

const CATEGORY_ICONS = {
  'cement': '🏗️',
  'steel-rebar': '🔩',
  'bricks-blocks': '🧱',
  'sand-aggregates': '⛏️',
  'rmc-concrete': '🪣',
  'tiles-flooring': '🏛️',
  'paints-finishes': '🎨',
  'wood-boards': '🪵',
  'plumbing': '🚰',
  'electrical': '⚡',
  'sanitaryware': '🚽',
  'bath-fittings': '🚿',
  'sanitary-accessories': '🪞',
  'hardware': '🔧',
  'tools': '🛠️',
  'safety-site-equipment': '⛑️',
  'construction-chemicals': '🧪',
  'fasteners-fabrication': '🔗',
  'doors-windows': '🚪',
  'glass-aluminium': '🪟',
  'waterproofing': '💧',
  'kitchen-interiors': '🍳',
  'roofing': '🏠',
  'insulation-gypsum': '🧊',
  'landscaping-external': '🌿',
  'miscellaneous-civil': '📦',
};

export default function MaterialsPage() {
  const [categories, setCategories] = useState(FALLBACK_MATERIAL_CATEGORIES);
  const [products, setProducts] = useState(FALLBACK_MATERIALS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch from API in background, upgrade if live server available
  useEffect(() => {
    Promise.all([
      apiFetch('/materials/categories').catch(() => null),
      apiFetch('/materials?limit=1000').catch(() => null)
    ]).then(([catData, prodData]) => {
      if (Array.isArray(catData) && catData.length > 0) {
        setCategories(catData);
      }
      if (Array.isArray(prodData) && prodData.length > 0) {
        setProducts(prodData);
      }
    }).catch(() => {
      // Fallback data already active
    });
  }, []);

  // Compute category product counts dynamically
  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      counts[p.subcategory_slug] = (counts[p.subcategory_slug] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Real-time instant filtering as user types (like Services page)
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.subcategory_slug === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const specs = p.specifications || {};
      return (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.subcategory_name && p.subcategory_name.toLowerCase().includes(q)) ||
        (specs.grade && specs.grade.toLowerCase().includes(q)) ||
        (specs.is_bis_standard && specs.is_bis_standard.toLowerCase().includes(q))
      );
    });
  }, [products, selectedCategory, searchQuery]);

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    setSearchQuery('');
  };

  const handleQuoteRequest = (product) => {
    const msg = encodeURIComponent(`Hi, I'd like to request a quote for: ${product.name} (Brand: ${product.brand}, Unit: ${product.default_unit})`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const selectedCatName = selectedCategory === 'all'
    ? 'All Materials'
    : categories.find(c => c.slug === selectedCategory)?.name || 'Materials';

  return (
    <div className={styles.page}>
      {/* ─── HERO ─── */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>🏗️ Aurally Realty Marketplace</span>
            <h1 className={styles.heroTitle}>
              Verified Quality <span>Building Materials</span>
            </h1>
            <p className={styles.heroSub}>
              Cement, steel, tiles, plumbing, electrical, and 26 more categories — wholesale & retail prices sourced directly from verified Tamil Nadu suppliers.
            </p>

            {/* Instant Search Bar without search icon or search button */}
            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search products, brands, grades (e.g. UltraTech, Fe550D TMT, Kajaria)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >✕</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="container">
        {/* Category Horizontal Scroll Tabs */}
        <div className={styles.tabsWrapper}>
          <div className={styles.tabsScroll}>
            <button
              type="button"
              className={`${styles.tabBtn} ${selectedCategory === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => handleCategoryClick('all')}
            >
              <span className={styles.tabIcon}>⚡</span>
              <span>All Materials</span>
              <span className={styles.tabCount}>
                {products.length}
              </span>
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                type="button"
                className={`${styles.tabBtn} ${selectedCategory === cat.slug ? styles.tabBtnActive : ''}`}
                onClick={() => handleCategoryClick(cat.slug)}
              >
                <span className={styles.tabIcon}>{CATEGORY_ICONS[cat.slug] || '📦'}</span>
                <span>{cat.name}</span>
                <span className={styles.tabCount}>{categoryCounts[cat.slug] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.catalogSection}>
          {/* ─── PRODUCT GRID ─── */}
          <main className={styles.main}>
            <div className={styles.mainHeader}>
              <h2 className={styles.mainTitle}>
                {selectedCatName}
                {searchQuery && <span className={styles.searchBadge}> — "{searchQuery}"</span>}
              </h2>
              <span className={styles.resultCount}>
                {`${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>No products found</h3>
                <p>
                  {searchQuery
                    ? `No results for "${searchQuery}" in ${selectedCatName}.`
                    : `No products available in ${selectedCatName} yet.`}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    className={styles.resetBtn}
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  >
                    View all materials
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredProducts.map(product => {
                  const specs = product.specifications || {};
                  return (
                    <div key={product.id} className={styles.card}>
                      <div className={styles.cardCatBadge}>
                        {CATEGORY_ICONS[product.subcategory_slug] || '📦'} {product.subcategory_name}
                      </div>
                      <h3 className={styles.cardTitle}>{product.name}</h3>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardBrand}>
                          <span className={styles.metaLabel}>Brand</span>
                          {product.brand}
                        </span>
                        <span className={styles.cardUnit}>
                          <span className={styles.metaLabel}>Unit</span>
                          {product.default_unit}
                        </span>
                      </div>
                      {specs.grade && (
                        <div className={styles.cardGrade}>
                          <span className={styles.gradePill}>{specs.grade}</span>
                          {specs.is_bis_standard && specs.is_bis_standard !== 'N/A' && (
                            <span className={styles.bisPill}>✅ {specs.is_bis_standard}</span>
                          )}
                        </div>
                      )}
                      {specs.moq && (
                        <div className={styles.cardMoq}>
                          <span className={styles.metaLabel}>MOQ:</span> {specs.moq}
                        </div>
                      )}
                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          className={styles.quoteBtn}
                          onClick={() => handleQuoteRequest(product)}
                        >
                          Request Wholesale Quote
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

        {/* ─── FOOTER BANNER ─── */}
        <div className={styles.supportBanner}>
          <div className={styles.supportContent}>
            <h2>Bulk Procurement & Site Delivery Across Tamil Nadu</h2>
            <p>
              Direct factory rates, batch test certificates, GST invoices, and transit insurance for construction projects across Chennai, Coimbatore, Madurai, Hosur, and all TN districts.
            </p>
          </div>
          <a
            href="https://wa.me/?text=Hi%2C%20I%20have%20a%20bulk%20building%20material%20procurement%20requirement."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.supportBtn}
          >
            Contact Procurement Desk
          </a>
        </div>
      </div>
    </div>
  );
}
