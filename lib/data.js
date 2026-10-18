// Shared property and location data for Tamil Nadu
export const TAMIL_NADU_CITIES = [
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Trichy',
  'Salem',
  'Hosur',
  'Tirunelveli',
  'Vellore'
];

export const CITY_AREAS = {
  'Chennai': ['Anna Nagar', 'T. Nagar', 'Velachery', 'OMR', 'Adyar', 'Porur', 'Sholinganallur', 'Ambattur', 'Tambaram', 'Perambur'],
  'Coimbatore': ['RS Puram', 'Gandhipuram', 'Saravanampatti', 'Peelamedu', 'Saibaba Colony', 'Race Course', 'Singanallur', 'Vadavalli'],
  'Madurai': ['KK Nagar', 'Anna Nagar', 'Mattuthavani', 'Simmakkal', 'TVS Nagar', 'SS Colony', 'Koodal Nagar', 'Iyer Bungalow'],
  'Trichy': ['Srirangam', 'Thillai Nagar', 'Cantonment', 'KK Nagar', 'Kattur', 'Vayalur Road', 'Crawford', 'Ponmalai'],
  'Salem': ['Fairlands', 'Alagapuram', 'Suramangalam', 'Hasthampatti', 'Ammapet', 'Shevapet', 'Meyyanur', 'Kannankurichi'],
  'Hosur': ['Bagalur Road', 'Sipcot Phase 1', 'Mathigiri', 'Avalapalli', 'Mookandapalli', 'Rayakottai Road'],
  'Tirunelveli': ['Palayamkottai', 'Vannarpettai', 'Town', 'Perumalpuram', 'Tirunelveli Junction', 'Shanthi Nagar'],
  'Vellore': ['Katpadi', 'Gandhi Nagar', 'Sathuvachari', 'Bagayam', 'Thorapadi', 'Otteri']
};

export const PROPERTIES = [
  // Chennai Properties
  {
    id: 1, title: 'Luxury 3BHK Apartment', city: 'Chennai', area: 'Anna Nagar', type: 'apartment',
    status: 'for-sale', price: 85, priceUnit: 'Lakhs', beds: 3, baths: 2, sqft: 1450,
    floor: '4th of 12', facing: 'East', age: 'New', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 2, title: 'Spacious 2BHK Flat', city: 'Chennai', area: 'T. Nagar', type: 'apartment',
    status: 'for-rent', price: 22000, priceUnit: '/mo', beds: 2, baths: 2, sqft: 1100,
    floor: '2nd of 8', facing: 'North', age: '5 Yrs', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 3, title: 'Modern Villa with Pool', city: 'Chennai', area: 'Adyar', type: 'villa',
    status: 'for-sale', price: 2.4, priceUnit: 'Cr', beds: 4, baths: 4, sqft: 3200,
    floor: 'Ground', facing: 'North-East', age: '2 Yrs', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 4, title: '1BHK Studio Apartment', city: 'Chennai', area: 'Velachery', type: 'apartment',
    status: 'for-rent', price: 12000, priceUnit: '/mo', beds: 1, baths: 1, sqft: 550,
    floor: '3rd of 6', facing: 'West', age: '3 Yrs', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    featured: false, verified: true,
  },
  {
    id: 5, title: '4BHK Independent House', city: 'Chennai', area: 'OMR', type: 'villa',
    status: 'for-sale', price: 1.1, priceUnit: 'Cr', beds: 4, baths: 3, sqft: 2600,
    floor: 'G+1', facing: 'South', age: '4 Yrs', image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80',
    featured: false, verified: false,
  },
  {
    id: 6, title: 'Commercial Office Space', city: 'Chennai', area: 'Porur', type: 'commercial',
    status: 'for-rent', price: 65000, priceUnit: '/mo', beds: 0, baths: 4, sqft: 4200,
    floor: '6th of 10', facing: 'East', age: 'New', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    featured: false, verified: true,
  },
  {
    id: 7, title: 'Prime Residential Plot', city: 'Chennai', area: 'Sholinganallur', type: 'plot',
    status: 'for-sale', price: 45, priceUnit: 'Lakhs', beds: 0, baths: 0, sqft: 1200,
    floor: 'Ground', facing: 'East', age: 'NA', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
    featured: false, verified: false,
  },
  {
    id: 8, title: 'Semi-Furnished 3BHK', city: 'Chennai', area: 'Ambattur', type: 'apartment',
    status: 'for-rent', price: 18000, priceUnit: '/mo', beds: 3, baths: 2, sqft: 1300,
    floor: '1st of 5', facing: 'North', age: '6 Yrs', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    featured: false, verified: true,
  },

  // Coimbatore Properties
  {
    id: 9, title: 'Premium 3BHK Gated Community', city: 'Coimbatore', area: 'RS Puram', type: 'apartment',
    status: 'for-sale', price: 95, priceUnit: 'Lakhs', beds: 3, baths: 3, sqft: 1680,
    floor: '5th of 10', facing: 'East', age: 'New', image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 10, title: 'Independent Luxury Villa', city: 'Coimbatore', area: 'Saravanampatti', type: 'villa',
    status: 'for-sale', price: 1.35, priceUnit: 'Cr', beds: 4, baths: 4, sqft: 2850,
    floor: 'G+1', facing: 'North', age: '1 Yr', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 11, title: '2BHK Family Flat for Rent', city: 'Coimbatore', area: 'Gandhipuram', type: 'apartment',
    status: 'for-rent', price: 16000, priceUnit: '/mo', beds: 2, baths: 2, sqft: 1050,
    floor: '3rd of 5', facing: 'East', age: '3 Yrs', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    featured: false, verified: true,
  },

  // Madurai Properties
  {
    id: 12, title: '3BHK Duplex House', city: 'Madurai', area: 'KK Nagar', type: 'villa',
    status: 'for-sale', price: 78, priceUnit: 'Lakhs', beds: 3, baths: 3, sqft: 1950,
    floor: 'G+1', facing: 'East', age: 'New', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 13, title: 'Commercial Plot on Ring Road', city: 'Madurai', area: 'Mattuthavani', type: 'plot',
    status: 'for-sale', price: 55, priceUnit: 'Lakhs', beds: 0, baths: 0, sqft: 2400,
    floor: 'Ground', facing: 'North', age: 'NA', image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&q=80',
    featured: false, verified: true,
  },
  {
    id: 14, title: 'Comfortable 2BHK Flat', city: 'Madurai', area: 'Anna Nagar', type: 'apartment',
    status: 'for-rent', price: 13500, priceUnit: '/mo', beds: 2, baths: 2, sqft: 980,
    floor: '2nd of 4', facing: 'South', age: '4 Yrs', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    featured: false, verified: true,
  },

  // Trichy Properties
  {
    id: 15, title: '2BHK River View Flat', city: 'Trichy', area: 'Srirangam', type: 'apartment',
    status: 'for-sale', price: 52, priceUnit: 'Lakhs', beds: 2, baths: 2, sqft: 1150,
    floor: '3rd of 6', facing: 'East', age: '2 Yrs', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 16, title: 'Prime Retail Space', city: 'Trichy', area: 'Thillai Nagar', type: 'commercial',
    status: 'for-rent', price: 40000, priceUnit: '/mo', beds: 0, baths: 2, sqft: 1800,
    floor: '1st of 4', facing: 'North', age: '1 Yr', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    featured: false, verified: true,
  },

  // Salem Properties
  {
    id: 17, title: '3BHK Contemporary Villa', city: 'Salem', area: 'Fairlands', type: 'villa',
    status: 'for-sale', price: 82, priceUnit: 'Lakhs', beds: 3, baths: 3, sqft: 2200,
    floor: 'G+1', facing: 'North-East', age: 'New', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    featured: true, verified: true,
  },

  // Hosur Properties
  {
    id: 18, title: 'Spacious 3BHK Villa near Electronic City Road', city: 'Hosur', area: 'Bagalur Road', type: 'villa',
    status: 'for-sale', price: 88, priceUnit: 'Lakhs', beds: 3, baths: 3, sqft: 2100,
    floor: 'G+1', facing: 'East', age: 'New', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    featured: false, verified: true,
  }
];

export const AREAS = CITY_AREAS['Chennai'];

export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Independent House'];

export function formatPrice(price, unit) {
  if (unit === 'Lakhs') return `₹${price} L`;
  if (unit === 'Cr') return `₹${price} Cr`;
  if (unit === '/mo') return `₹${price.toLocaleString('en-IN')}/mo`;
  return `₹${price}`;
}
