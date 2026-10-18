'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
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
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories once on mount
  useEffect(() => {
    apiFetch('/materials/categories')
      .then(data => setCategories(data || []))
      .catch(err => {
        console.warn('Could not load material categories:', err.message);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch products when category or search changes
  const fetchProducts = useCallback(async (category, q) => {
    setProductsLoading(true);
    try {
      const params = new URLSearchParams({ limit: 96, offset: 0 });
      if (category && category !== 'all') params.set('category', category);
      if (q && q.trim()) params.set('q', q.trim());
      const data = await apiFetch(`/materials?${params.toString()}`);
      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.warn('Could not load materials:', err.message);
      setError('Unable to connect to the server. Please try again later.');
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory, searchQuery);
  }, [selectedCategory, fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(selectedCategory, searchQuery);
  };

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    setSearchQuery('');
  };

  const handleQuoteRequest = (product) => {
    const msg = encodeURIComponent(`Hi, I'd like to request a quote for: ${product.name} (Brand: ${product.brand}, Unit: ${product.default_unit})`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingHero}>
          <div className={styles.spinner} />
          <p>Loading Building Materials...</p>
        </div>
      </div>
    );
  }

  const selectedCatName = selectedCategory === 'all'
    ? 'All Materials'
    : categories.find(c => c.slug === selectedCategory)?.name || 'Materials';

  return (
    <div className={styles.page}>
      {/* ─── HERO ─── */}
      <div className={styles.hero}>
        <div className="container">
          <p className={styles.heroEyebrow}>🏗️ Aurally Realty Marketplace</p>
          <h1 className={styles.heroTitle}>
            Building <span>Materials</span>
          </h1>
          <p className={styles.heroSub}>
            Cement, steel, tiles, plumbing, electrical and 26 more categories — sourced from verified suppliers.
          </p>

          {/* Search bar */}
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search products, brands, grades..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => { setSearchQuery(''); fetchProducts(selectedCategory, ''); }}
                >✕</button>
              )}
              <button type="submit" className={styles.searchBtn}>Search</button>
            </div>
          </form>
        </div>
      </div>

      {/* ─── MAIN LAYOUT ─── */}
      <div className="container">
        <div className={styles.layout}>

          {/* ─── SIDEBAR ─── */}
          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Categories</h3>
            <button
              className={`${styles.catPill} ${selectedCategory === 'all' ? styles.catPillActive : ''}`}
              onClick={() => handleCategoryClick('all')}
            >
              <span className={styles.catIcon}>🏬</span>
              <span className={styles.catLabel}>All Materials</span>
              <span className={styles.catCount}>{categories.reduce((a, c) => a + (c.product_count || 0), 0)}</span>
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                className={`${styles.catPill} ${selectedCategory === cat.slug ? styles.catPillActive : ''}`}
                onClick={() => handleCategoryClick(cat.slug)}
              >
                <span className={styles.catIcon}>{CATEGORY_ICONS[cat.slug] || '📦'}</span>
                <span className={styles.catLabel}>{cat.name}</span>
                <span className={styles.catCount}>{cat.product_count || 0}</span>
              </button>
            ))}
          </aside>

          {/* ─── PRODUCT GRID ─── */}
          <main className={styles.main}>
            <div className={styles.mainHeader}>
              <h2 className={styles.mainTitle}>
                {selectedCatName}
                {searchQuery && <span className={styles.searchBadge}> — "{searchQuery}"</span>}
              </h2>
              <span className={styles.resultCount}>
                {productsLoading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
              </span>
            </div>

            {error && (
              <div className={styles.errorBanner}>
                ⚠️ {error}
              </div>
            )}

            {productsLoading ? (
              <div className={styles.gridLoading}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={styles.skeletonCard} />
                ))}
              </div>
            ) : products.length === 0 ? (
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
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); fetchProducts('all', ''); }}
                  >
                    View all materials
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.grid}>
                {products.map(product => {
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
                        <p className={styles.cardMoq}>
                          <span className={styles.metaLabel}>MOQ:</span> {specs.moq}
                          {specs.pack_size && ` · Pack: ${specs.pack_size}`}
                        </p>
                      )}
                      <button
                        className={styles.quoteBtn}
                        onClick={() => handleQuoteRequest(product)}
                      >
                        📩 Request Quote
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
