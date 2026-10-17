// Shared property data for the app
export const PROPERTIES = [
  {
    id: 1, title: 'Luxury 3BHK Apartment', area: 'Anna Nagar', type: 'apartment',
    status: 'for-sale', price: 85, priceUnit: 'Lakhs', beds: 3, baths: 2, sqft: 1450,
    floor: '4th of 12', facing: 'East', age: 'New', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 2, title: 'Spacious 2BHK Flat', area: 'T. Nagar', type: 'apartment',
    status: 'for-rent', price: 22000, priceUnit: '/mo', beds: 2, baths: 2, sqft: 1100,
    floor: '2nd of 8', facing: 'North', age: '5 Yrs', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 3, title: 'Modern Villa with Pool', area: 'Adyar', type: 'villa',
    status: 'for-sale', price: 2.4, priceUnit: 'Cr', beds: 4, baths: 4, sqft: 3200,
    floor: 'Ground', facing: 'North-East', age: '2 Yrs', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 4, title: '1BHK Studio Apartment', area: 'Velachery', type: 'apartment',
    status: 'for-rent', price: 12000, priceUnit: '/mo', beds: 1, baths: 1, sqft: 550,
    floor: '3rd of 6', facing: 'West', age: '3 Yrs', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    featured: false, verified: true,
  },
  {
    id: 5, title: '4BHK Independent House', area: 'OMR', type: 'villa',
    status: 'for-sale', price: 1.1, priceUnit: 'Cr', beds: 4, baths: 3, sqft: 2600,
    floor: 'G+1', facing: 'South', age: '4 Yrs', image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80',
    featured: false, verified: false,
  },
  {
    id: 6, title: 'Commercial Office Space', area: 'Porur', type: 'commercial',
    status: 'for-rent', price: 65000, priceUnit: '/mo', beds: 0, baths: 4, sqft: 4200,
    floor: '6th of 10', facing: 'East', age: 'New', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    featured: false, verified: true,
  },
  {
    id: 7, title: 'Prime Residential Plot', area: 'Sholinganallur', type: 'plot',
    status: 'for-sale', price: 45, priceUnit: 'Lakhs', beds: 0, baths: 0, sqft: 1200,
    floor: 'Ground', facing: 'East', age: 'NA', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
    featured: false, verified: false,
  },
  {
    id: 8, title: 'Semi-Furnished 3BHK', area: 'Ambattur', type: 'apartment',
    status: 'for-rent', price: 18000, priceUnit: '/mo', beds: 3, baths: 2, sqft: 1300,
    floor: '1st of 5', facing: 'North', age: '6 Yrs', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    featured: false, verified: true,
  },
];

export const AREAS = ['Anna Nagar', 'T. Nagar', 'Velachery', 'OMR', 'Adyar', 'Porur', 'Sholinganallur', 'Ambattur', 'Tambaram', 'Perambur'];

export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Commercial', 'PG/Hostel', 'Independent House'];

export function formatPrice(price, unit) {
  if (unit === 'Lakhs') return `₹${price} L`;
  if (unit === 'Cr') return `₹${price} Cr`;
  if (unit === '/mo') return `₹${price.toLocaleString('en-IN')}/mo`;
  return `₹${price}`;
}
