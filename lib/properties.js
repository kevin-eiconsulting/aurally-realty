import { PROPERTIES } from './data';
import { apiFetch } from './api';

const LOCAL_STORAGE_KEY = 'aurally_user_properties';

// Helper to get local user-submitted properties
export function getLocalProperties() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading local properties:', e);
    return [];
  }
}

// Helper to save a new property locally
export function saveLocalProperty(property) {
  if (typeof window === 'undefined') return property;
  try {
    const existing = getLocalProperties();
    const updated = [property, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return property;
  } catch (e) {
    console.error('Error saving local property:', e);
    return property;
  }
}

// Fetch all properties (Calls Express API connected to Supabase PostgreSQL, with fallback)
export async function fetchProperties({ type, area, city, status, minPrice, maxPrice, sortBy, budget } = {}) {
  try {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (type && type !== 'all') params.set('type', type);
    if (city && city !== 'all' && city !== 'All Tamil Nadu') params.set('city', city);
    if (area && area !== 'all') params.set('area', area);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy) params.set('sortBy', sortBy);
    if (budget) params.set('budget', budget);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const apiData = await apiFetch(`/properties${queryStr}`);

    if (Array.isArray(apiData) && apiData.length > 0) {
      return apiData;
    }
  } catch (err) {
    console.warn('Backend API unavailable, falling back to local/mock data:', err.message);
  }

  // Fallback to local & mock properties if backend is offline
  let list = [...getLocalProperties(), ...PROPERTIES];

  if (status) {
    list = list.filter(p => p.status === status);
  }
  if (city && city !== 'all' && city !== 'All Tamil Nadu') {
    list = list.filter(p => (p.city || 'Chennai').toLowerCase() === city.toLowerCase());
  }
  if (type && type !== 'all') {
    list = list.filter(p => p.type?.toLowerCase() === type.toLowerCase());
  }
  if (area && area !== 'all') {
    list = list.filter(p => p.area?.toLowerCase() === area.toLowerCase());
  }
  if (minPrice) {
    list = list.filter(p => p.price >= minPrice);
  }
  if (maxPrice) {
    list = list.filter(p => p.price <= maxPrice);
  }

  return list;
}

// Fetch single property by ID
export async function fetchPropertyById(id) {
  try {
    const prop = await apiFetch(`/properties/${id}`);
    if (prop && prop.id) {
      return prop;
    }
  } catch (err) {
    console.warn(`Backend fetch for property ${id} failed, checking local:`, err.message);
  }

  // Check local properties
  const localProps = getLocalProperties();
  const foundLocal = localProps.find(p => String(p.id) === String(id));
  if (foundLocal) return foundLocal;

  // Check mock properties
  const foundMock = PROPERTIES.find(p => String(p.id) === String(id));
  if (foundMock) {
    return {
      ...foundMock,
      images: [
        foundMock.image,
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
      ],
      description: `Premium ${foundMock.beds > 0 ? foundMock.beds + ' BHK ' : ''}${foundMock.type} located in prime locality of ${foundMock.area}, Chennai. Excellent connectivity to IT corridors, schools, and hospitals.`,
      address: `${foundMock.area}, Chennai, Tamil Nadu`,
      furnishing: 'Semi Furnished',
      owner: 'Aurally Partner',
      phone: '98400 12345'
    };
  }

  return null;
}

// Add a new property
export async function addProperty(propertyData, user) {
  let createdProp = null;

  try {
    createdProp = await apiFetch('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData)
    });
  } catch (err) {
    console.warn('Could not save property to backend API:', err.message);
  }

  if (createdProp) {
    saveLocalProperty(createdProp);
    return createdProp;
  }

  // Fallback local save if API is down
  const isRent = propertyData.listingType === 'rent';
  const newProp = {
    id: Date.now(),
    title: propertyData.title,
    city: propertyData.city || 'Chennai',
    area: propertyData.area,
    type: (propertyData.propertyType || 'Apartment').toLowerCase(),
    status: isRent ? 'for-rent' : 'for-sale',
    price: Number(propertyData.price),
    priceUnit: isRent ? '/mo' : 'Lakhs',
    beds: Number(propertyData.beds) || 0,
    baths: Number(propertyData.baths) || 1,
    sqft: Number(propertyData.sqft) || 1000,
    floor: propertyData.floor || '1st of 4',
    facing: propertyData.facing || 'East',
    age: propertyData.age || 'New',
    furnishing: propertyData.furnishing || 'Semi Furnished',
    description: propertyData.description || '',
    address: propertyData.address || '',
    image: (Array.isArray(propertyData.images) && propertyData.images.length > 0) ? propertyData.images[0] : (propertyData.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80'),
    images: (Array.isArray(propertyData.images) && propertyData.images.length > 0) ? propertyData.images : [propertyData.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'],
    featured: false,
    verified: false,
    owner: user?.username || 'Property Owner',
    phone: propertyData.phone || user?.phone || '',
    created_at: new Date().toISOString()
  };

  saveLocalProperty(newProp);
  return newProp;
}
