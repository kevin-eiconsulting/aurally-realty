import { PROPERTIES } from './data';
import { supabase, isSupabaseConfigured } from './supabase';

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

// Fetch all properties (combines Supabase + mock data + locally added)
export async function fetchProperties({ type, area, status, minPrice, maxPrice } = {}) {
  let list = [];

  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('properties').select('*, profiles(username, phone)');
      if (status) {
        query = query.eq('status', status);
      }
      if (type) {
        query = query.ilike('property_type', `%${type}%`);
      }
      if (area) {
        query = query.ilike('area', `%${area}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Map Supabase rows to app format
        list = data.map(item => ({
          id: item.id,
          title: item.title,
          area: item.area,
          type: item.property_type?.toLowerCase() || 'apartment',
          status: item.listing_type === 'rent' ? 'for-rent' : 'for-sale',
          price: Number(item.price),
          priceUnit: item.price_unit || (item.listing_type === 'rent' ? '/mo' : 'Lakhs'),
          beds: item.beds || 0,
          baths: item.baths || 0,
          sqft: item.sqft || 0,
          floor: item.floor_number ? `${item.floor_number} of ${item.total_floors || 1}` : 'Ground',
          facing: item.facing || 'East',
          age: item.property_age || 'New',
          image: (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
          images: item.images || [],
          featured: item.is_featured || false,
          verified: item.is_verified || false,
          description: item.description || '',
          address: item.address || '',
          furnishing: item.furnishing || 'Semi Furnished',
          owner: item.profiles?.username || 'Owner',
          phone: item.profiles?.phone || ''
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch from Supabase, falling back to local:', err);
    }
  }

  // If no Supabase list or in demo mode, combine mock properties with user-created ones
  if (list.length === 0) {
    const local = getLocalProperties();
    list = [...local, ...PROPERTIES];
  }

  // Filter in-memory if needed
  if (status) {
    list = list.filter(p => p.status === status);
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
  const numericId = Number(id);

  if (isSupabaseConfigured() && !isNaN(numericId) && numericId > 100) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, profiles(username, phone)')
        .eq('id', numericId)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          area: data.area,
          type: data.property_type?.toLowerCase() || 'apartment',
          status: data.listing_type === 'rent' ? 'for-rent' : 'for-sale',
          price: Number(data.price),
          priceUnit: data.price_unit || (data.listing_type === 'rent' ? '/mo' : 'Lakhs'),
          beds: data.beds || 0,
          baths: data.baths || 0,
          sqft: data.sqft || 0,
          floor: data.floor_number ? `${data.floor_number} of ${data.total_floors || 1}` : 'Ground',
          facing: data.facing || 'East',
          age: data.property_age || 'New',
          image: (data.images && data.images[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
          images: data.images?.length ? data.images : [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
          ],
          featured: data.is_featured || false,
          verified: data.is_verified || false,
          description: data.description || '',
          address: data.address || '',
          furnishing: data.furnishing || 'Semi Furnished',
          owner: data.profiles?.username || 'Owner',
          phone: data.profiles?.phone || ''
        };
      }
    } catch (e) {
      console.warn('Error fetching single property from Supabase:', e);
    }
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
  const isRent = propertyData.listingType === 'rent';
  const newProp = {
    id: Date.now(),
    title: propertyData.title,
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
    image: propertyData.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    images: [
      propertyData.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
    ],
    featured: false,
    verified: false,
    owner: user?.username || 'Property Owner',
    phone: propertyData.phone || user?.phone || '',
    created_at: new Date().toISOString()
  };

  // If Supabase is configured and user is real
  if (isSupabaseConfigured() && user?.id && !user.isDemo) {
    try {
      const { data, error } = await supabase.from('properties').insert({
        owner_id: user.id,
        listing_type: propertyData.listingType,
        status: 'pending',
        title: propertyData.title,
        description: propertyData.description,
        property_type: propertyData.propertyType.toLowerCase(),
        area: propertyData.area,
        address: propertyData.address,
        beds: Number(propertyData.beds) || 0,
        baths: Number(propertyData.baths) || 0,
        sqft: Number(propertyData.sqft) || 0,
        facing: propertyData.facing || 'East',
        furnishing: propertyData.furnishing || 'Semi Furnished',
        property_age: propertyData.age || 'New',
        price: Number(propertyData.price),
        price_unit: isRent ? '/mo' : 'Lakhs',
        images: newProp.images,
      }).select();

      if (error) {
        console.error('Supabase property insert error:', error);
      } else if (data && data[0]) {
        newProp.id = data[0].id;
      }
    } catch (err) {
      console.error('Supabase add property exception:', err);
    }
  }

  // Always save locally so the client can immediately preview it!
  saveLocalProperty(newProp);
  return newProp;
}
