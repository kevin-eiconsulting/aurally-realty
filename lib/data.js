import { TAMIL_NADU_CITIES, CITY_AREAS, TAMIL_NADU_DISTRICTS, POPULAR_TN_HUBS } from './tamilnadu-locations';
export { TAMIL_NADU_CITIES, CITY_AREAS, TAMIL_NADU_DISTRICTS, POPULAR_TN_HUBS };



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
  },
  // Additional Property Types for Tamil Nadu
  {
    id: 19, title: '4BHK Independent House with Private Garden', city: 'Chennai', area: 'Adyar', type: 'individual-house',
    status: 'for-sale', price: 1.85, priceUnit: 'Cr', beds: 4, baths: 4, sqft: 2900,
    floor: 'G+1', facing: 'North', age: '2 Yrs', image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 20, title: 'Sea-Facing Sky Penthouse with Terrace Garden', city: 'Chennai', area: 'OMR', type: 'penthouse',
    status: 'for-sale', price: 2.9, priceUnit: 'Cr', beds: 4, baths: 5, sqft: 3800,
    floor: '18th of 18', facing: 'East', age: 'New', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 21, title: 'Heritage Colonial Bungalow on 2 Grounds', city: 'Coimbatore', area: 'Race Course', type: 'bungalow',
    status: 'for-sale', price: 3.2, priceUnit: 'Cr', beds: 5, baths: 5, sqft: 4500,
    floor: 'Ground', facing: 'North-East', age: '8 Yrs', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 22, title: '1.5 Acre Fertile Organic Farm Land with Coconut Trees', city: 'Coimbatore', area: 'Vadavalli', type: 'farm-land',
    status: 'for-sale', price: 75, priceUnit: 'Lakhs', beds: 0, baths: 0, sqft: 65340,
    floor: 'Ground', facing: 'East', age: 'NA', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
    featured: false, verified: true,
  },
  {
    id: 23, title: 'Fully Furnished Grade-A IT Office Space', city: 'Chennai', area: 'OMR', type: 'office-space',
    status: 'for-rent', price: 95000, priceUnit: '/mo', beds: 0, baths: 4, sqft: 3400,
    floor: '5th of 12', facing: 'North', age: 'New', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    featured: true, verified: true,
  },
  {
    id: 24, title: 'Independent 3BHK House for Rent', city: 'Coimbatore', area: 'Saibaba Colony', type: 'individual-house',
    status: 'for-rent', price: 28000, priceUnit: '/mo', beds: 3, baths: 3, sqft: 1850,
    floor: 'Ground', facing: 'East', age: '3 Yrs', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    featured: false, verified: true,
  },
  {
    id: 25, title: 'Luxury Duplex Penthouse for Rent', city: 'Chennai', area: 'Velachery', type: 'penthouse',
    status: 'for-rent', price: 55000, priceUnit: '/mo', beds: 3, baths: 4, sqft: 2600,
    floor: '12th of 12', facing: 'East', age: '1 Yr', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    featured: true, verified: true,
  },

  // Properties across all other Tamil Nadu Districts & Cities
  {
    id: 26, title: "Modern 3BHK Gated Villa in Palayamkottai", city: "Tirunelveli", area: "Palayamkottai", type: "villa",
    status: "for-sale", price: 47, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 27, title: "Comfortable 2BHK Family Flat in Vannarpettai", city: "Tirunelveli", area: "Vannarpettai", type: "apartment",
    status: "for-rent", price: 10300, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 28, title: "DTCP Approved Residential Plot in Town", city: "Tirunelveli", area: "Town", type: "plot",
    status: "for-sale", price: 32, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 29, title: "Spacious 3BHK Premium Apartment in Katpadi", city: "Vellore", area: "Katpadi", type: "apartment",
    status: "for-sale", price: 68, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 30, title: "Comfortable 2BHK Family Flat in Gandhi Nagar", city: "Vellore", area: "Gandhi Nagar", type: "apartment",
    status: "for-rent", price: 13000, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 31, title: "DTCP Approved Residential Plot in Sathuvachari", city: "Vellore", area: "Sathuvachari", type: "plot",
    status: "for-sale", price: 44, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 32, title: "Modern 3BHK Gated Villa in Avinashi Road", city: "Tiruppur", area: "Avinashi Road", type: "villa",
    status: "for-sale", price: 89, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 33, title: "Comfortable 2BHK Family Flat in Palladam Road", city: "Tiruppur", area: "Palladam Road", type: "apartment",
    status: "for-rent", price: 15700, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 34, title: "DTCP Approved Residential Plot in Kangeyam Road", city: "Tiruppur", area: "Kangeyam Road", type: "plot",
    status: "for-sale", price: 56, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 35, title: "Spacious 3BHK Premium Apartment in Perundurai Road", city: "Erode", area: "Perundurai Road", type: "apartment",
    status: "for-sale", price: 65, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "1 Yr", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 36, title: "Comfortable 2BHK Family Flat in Brough Road", city: "Erode", area: "Brough Road", type: "apartment",
    status: "for-rent", price: 18400, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 37, title: "DTCP Approved Residential Plot in Sathy Road", city: "Erode", area: "Sathy Road", type: "plot",
    status: "for-sale", price: 33, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 38, title: "Modern 3BHK Gated Villa in Tambaram Sanatorium", city: "Chengalpattu", area: "Tambaram Sanatorium", type: "villa",
    status: "for-sale", price: 86, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 39, title: "Comfortable 2BHK Family Flat in Maraimalai Nagar", city: "Chengalpattu", area: "Maraimalai Nagar", type: "apartment",
    status: "for-rent", price: 21100, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 40, title: "DTCP Approved Residential Plot in Mahindra World City", city: "Chengalpattu", area: "Mahindra World City", type: "plot",
    status: "for-sale", price: 45, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 41, title: "Spacious 3BHK Premium Apartment in Enathur", city: "Kanchipuram", area: "Enathur", type: "apartment",
    status: "for-sale", price: 62, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 42, title: "Comfortable 2BHK Family Flat in Walajabad", city: "Kanchipuram", area: "Walajabad", type: "apartment",
    status: "for-rent", price: 11800, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 43, title: "DTCP Approved Residential Plot in Sriperumbudur", city: "Kanchipuram", area: "Sriperumbudur", type: "plot",
    status: "for-sale", price: 57, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 44, title: "Modern 3BHK Gated Villa in Avadi", city: "Tiruvallur", area: "Avadi", type: "villa",
    status: "for-sale", price: 83, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 45, title: "Comfortable 2BHK Family Flat in Poonamallee", city: "Tiruvallur", area: "Poonamallee", type: "apartment",
    status: "for-rent", price: 14500, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 46, title: "DTCP Approved Residential Plot in Thiruninravur", city: "Tiruvallur", area: "Thiruninravur", type: "plot",
    status: "for-sale", price: 34, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 47, title: "Spacious 3BHK Premium Apartment in Medical College Road", city: "Thanjavur", area: "Medical College Road", type: "apartment",
    status: "for-sale", price: 59, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "1 Yr", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 48, title: "Comfortable 2BHK Family Flat in New Bus Stand", city: "Thanjavur", area: "New Bus Stand", type: "apartment",
    status: "for-rent", price: 17200, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 49, title: "DTCP Approved Residential Plot in Old Bus Stand", city: "Thanjavur", area: "Old Bus Stand", type: "plot",
    status: "for-sale", price: 46, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 50, title: "Modern 3BHK Gated Villa in Palani Road", city: "Dindigul", area: "Palani Road", type: "villa",
    status: "for-sale", price: 80, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 51, title: "Comfortable 2BHK Family Flat in Batlagundu Road", city: "Dindigul", area: "Batlagundu Road", type: "apartment",
    status: "for-rent", price: 19900, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 52, title: "DTCP Approved Residential Plot in Trichy Road", city: "Dindigul", area: "Trichy Road", type: "plot",
    status: "for-sale", price: 58, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 53, title: "Spacious 3BHK Premium Apartment in Millerpuram", city: "Thoothukudi", area: "Millerpuram", type: "apartment",
    status: "for-sale", price: 56, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 54, title: "Comfortable 2BHK Family Flat in Bryant Nagar", city: "Thoothukudi", area: "Bryant Nagar", type: "apartment",
    status: "for-rent", price: 10600, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 55, title: "DTCP Approved Residential Plot in Toovipuram", city: "Thoothukudi", area: "Toovipuram", type: "plot",
    status: "for-sale", price: 35, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 56, title: "Modern 3BHK Gated Villa in Vadasery", city: "Nagercoil", area: "Vadasery", type: "villa",
    status: "for-sale", price: 77, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 57, title: "Comfortable 2BHK Family Flat in Kottar", city: "Nagercoil", area: "Kottar", type: "apartment",
    status: "for-rent", price: 13300, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 58, title: "DTCP Approved Residential Plot in Asaripallam", city: "Nagercoil", area: "Asaripallam", type: "plot",
    status: "for-sale", price: 47, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 59, title: "Spacious 3BHK Premium Apartment in Manjakuppam", city: "Cuddalore", area: "Manjakuppam", type: "apartment",
    status: "for-sale", price: 53, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "1 Yr", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 60, title: "Comfortable 2BHK Family Flat in Thirupapuliyur", city: "Cuddalore", area: "Thirupapuliyur", type: "apartment",
    status: "for-rent", price: 16000, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 61, title: "DTCP Approved Residential Plot in Semmandalam", city: "Cuddalore", area: "Semmandalam", type: "plot",
    status: "for-sale", price: 59, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 62, title: "Modern 3BHK Gated Villa in Collectorate", city: "Dharmapuri", area: "Collectorate", type: "villa",
    status: "for-sale", price: 74, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 63, title: "Comfortable 2BHK Family Flat in Pennagaram Road", city: "Dharmapuri", area: "Pennagaram Road", type: "apartment",
    status: "for-rent", price: 18700, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 64, title: "DTCP Approved Residential Plot in Salem Road", city: "Dharmapuri", area: "Salem Road", type: "plot",
    status: "for-sale", price: 36, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 65, title: "Spacious 3BHK Premium Apartment in Old Pet", city: "Krishnagiri", area: "Old Pet", type: "apartment",
    status: "for-sale", price: 50, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 66, title: "Comfortable 2BHK Family Flat in New Pet", city: "Krishnagiri", area: "New Pet", type: "apartment",
    status: "for-rent", price: 21400, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 67, title: "DTCP Approved Residential Plot in Rayakottai Road", city: "Krishnagiri", area: "Rayakottai Road", type: "plot",
    status: "for-sale", price: 48, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 68, title: "Modern 3BHK Gated Villa in Thanthonimalai", city: "Karur", area: "Thanthonimalai", type: "villa",
    status: "for-sale", price: 71, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 69, title: "Comfortable 2BHK Family Flat in Gandhigramam", city: "Karur", area: "Gandhigramam", type: "apartment",
    status: "for-rent", price: 12100, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 70, title: "DTCP Approved Residential Plot in Vengamedu", city: "Karur", area: "Vengamedu", type: "plot",
    status: "for-sale", price: 25, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 71, title: "Spacious 3BHK Premium Apartment in Tiruchengode", city: "Namakkal", area: "Tiruchengode", type: "apartment",
    status: "for-sale", price: 47, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "1 Yr", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 72, title: "Comfortable 2BHK Family Flat in Paramathi Velur", city: "Namakkal", area: "Paramathi Velur", type: "apartment",
    status: "for-rent", price: 14800, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 73, title: "DTCP Approved Residential Plot in Rasipuram", city: "Namakkal", area: "Rasipuram", type: "plot",
    status: "for-sale", price: 37, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 74, title: "Modern 3BHK Gated Villa in Charing Cross", city: "Ooty", area: "Charing Cross", type: "villa",
    status: "for-sale", price: 68, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 75, title: "Comfortable 2BHK Family Flat in Commercial Road", city: "Ooty", area: "Commercial Road", type: "apartment",
    status: "for-rent", price: 17500, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 76, title: "DTCP Approved Residential Plot in Fingerpost", city: "Ooty", area: "Fingerpost", type: "plot",
    status: "for-sale", price: 49, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 77, title: "Spacious 3BHK Premium Apartment in College Road", city: "Karaikudi", area: "College Road", type: "apartment",
    status: "for-sale", price: 89, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 78, title: "Comfortable 2BHK Family Flat in Sekkalai", city: "Karaikudi", area: "Sekkalai", type: "apartment",
    status: "for-rent", price: 20200, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 79, title: "DTCP Approved Residential Plot in Subramaniyapuram", city: "Karaikudi", area: "Subramaniyapuram", type: "plot",
    status: "for-sale", price: 26, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 80, title: "Modern 3BHK Gated Villa in Vilampatti Road", city: "Sivakasi", area: "Vilampatti Road", type: "villa",
    status: "for-sale", price: 65, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 81, title: "Comfortable 2BHK Family Flat in Satchiyapuram", city: "Sivakasi", area: "Satchiyapuram", type: "apartment",
    status: "for-rent", price: 10900, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 82, title: "DTCP Approved Residential Plot in Thiruthangal", city: "Sivakasi", area: "Thiruthangal", type: "plot",
    status: "for-sale", price: 38, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 83, title: "Spacious 3BHK Premium Apartment in Periyakulam", city: "Theni", area: "Periyakulam", type: "apartment",
    status: "for-sale", price: 86, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "1 Yr", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 84, title: "Comfortable 2BHK Family Flat in Bodinayakanur", city: "Theni", area: "Bodinayakanur", type: "apartment",
    status: "for-rent", price: 13600, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 85, title: "DTCP Approved Residential Plot in Cumbum", city: "Theni", area: "Cumbum", type: "plot",
    status: "for-sale", price: 50, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 86, title: "Modern 3BHK Gated Villa in Rameswaram", city: "Ramanathapuram", area: "Rameswaram", type: "villa",
    status: "for-sale", price: 62, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 87, title: "Comfortable 2BHK Family Flat in Paramakudi", city: "Ramanathapuram", area: "Paramakudi", type: "apartment",
    status: "for-rent", price: 16300, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 88, title: "DTCP Approved Residential Plot in Mandapam", city: "Ramanathapuram", area: "Mandapam", type: "plot",
    status: "for-sale", price: 27, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 89, title: "Spacious 3BHK Premium Apartment in Machuvadi", city: "Pudukkottai", area: "Machuvadi", type: "apartment",
    status: "for-sale", price: 83, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 90, title: "Comfortable 2BHK Family Flat in Rajagopalapuram", city: "Pudukkottai", area: "Rajagopalapuram", type: "apartment",
    status: "for-rent", price: 19000, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 91, title: "DTCP Approved Residential Plot in Alangudi", city: "Pudukkottai", area: "Alangudi", type: "plot",
    status: "for-sale", price: 39, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 92, title: "Modern 3BHK Gated Villa in Velankanni", city: "Nagapattinam", area: "Velankanni", type: "villa",
    status: "for-sale", price: 59, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 93, title: "Comfortable 2BHK Family Flat in Nagore", city: "Nagapattinam", area: "Nagore", type: "apartment",
    status: "for-rent", price: 21700, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 94, title: "DTCP Approved Residential Plot in Vedaranyam", city: "Nagapattinam", area: "Vedaranyam", type: "plot",
    status: "for-sale", price: 51, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 95, title: "Spacious 3BHK Premium Apartment in Kaveri Nagar", city: "Mayiladuthurai", area: "Kaveri Nagar", type: "apartment",
    status: "for-sale", price: 80, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "1 Yr", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 96, title: "Comfortable 2BHK Family Flat in Pattamangala Street", city: "Mayiladuthurai", area: "Pattamangala Street", type: "apartment",
    status: "for-rent", price: 12400, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 97, title: "DTCP Approved Residential Plot in Sirkazhi", city: "Mayiladuthurai", area: "Sirkazhi", type: "plot",
    status: "for-sale", price: 28, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 98, title: "Modern 3BHK Gated Villa in Mannargudi", city: "Tiruvarur", area: "Mannargudi", type: "villa",
    status: "for-sale", price: 56, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 99, title: "Comfortable 2BHK Family Flat in Thiruthuraipoondi", city: "Tiruvarur", area: "Thiruthuraipoondi", type: "apartment",
    status: "for-rent", price: 15100, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 100, title: "DTCP Approved Residential Plot in Kudavasal", city: "Tiruvarur", area: "Kudavasal", type: "plot",
    status: "for-sale", price: 40, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 101, title: "Spacious 3BHK Premium Apartment in Girivalam Road", city: "Tiruvannamalai", area: "Girivalam Road", type: "apartment",
    status: "for-sale", price: 77, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 102, title: "Comfortable 2BHK Family Flat in Polur Road", city: "Tiruvannamalai", area: "Polur Road", type: "apartment",
    status: "for-rent", price: 17800, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 103, title: "DTCP Approved Residential Plot in Chengam Road", city: "Tiruvannamalai", area: "Chengam Road", type: "plot",
    status: "for-sale", price: 52, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 104, title: "Modern 3BHK Gated Villa in Ranipet Town", city: "Ranipet", area: "Ranipet Town", type: "villa",
    status: "for-sale", price: 53, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 105, title: "Comfortable 2BHK Family Flat in Walaja", city: "Ranipet", area: "Walaja", type: "apartment",
    status: "for-rent", price: 20500, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 106, title: "DTCP Approved Residential Plot in Arcot", city: "Ranipet", area: "Arcot", type: "plot",
    status: "for-sale", price: 29, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 107, title: "Spacious 3BHK Premium Apartment in Tirupathur Town", city: "Tirupathur", area: "Tirupathur Town", type: "apartment",
    status: "for-sale", price: 74, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "1 Yr", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 108, title: "Comfortable 2BHK Family Flat in Vaniyambadi", city: "Tirupathur", area: "Vaniyambadi", type: "apartment",
    status: "for-rent", price: 11200, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 109, title: "DTCP Approved Residential Plot in Ambur", city: "Tirupathur", area: "Ambur", type: "plot",
    status: "for-sale", price: 41, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 110, title: "Modern 3BHK Gated Villa in Kallakurichi Town", city: "Kallakurichi", area: "Kallakurichi Town", type: "villa",
    status: "for-sale", price: 50, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 111, title: "Comfortable 2BHK Family Flat in Ulundurpet", city: "Kallakurichi", area: "Ulundurpet", type: "apartment",
    status: "for-rent", price: 13900, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 112, title: "DTCP Approved Residential Plot in Sankarapuram", city: "Kallakurichi", area: "Sankarapuram", type: "plot",
    status: "for-sale", price: 53, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 113, title: "Spacious 3BHK Premium Apartment in Tenkasi Town", city: "Tenkasi", area: "Tenkasi Town", type: "apartment",
    status: "for-sale", price: 71, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 114, title: "Comfortable 2BHK Family Flat in Courtallam", city: "Tenkasi", area: "Courtallam", type: "apartment",
    status: "for-rent", price: 16600, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 115, title: "DTCP Approved Residential Plot in Sankarankovil", city: "Tenkasi", area: "Sankarankovil", type: "plot",
    status: "for-sale", price: 30, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 116, title: "Modern 3BHK Gated Villa in Ariyalur Town", city: "Ariyalur", area: "Ariyalur Town", type: "villa",
    status: "for-sale", price: 47, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 117, title: "Comfortable 2BHK Family Flat in Jayankondam", city: "Ariyalur", area: "Jayankondam", type: "apartment",
    status: "for-rent", price: 19300, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 118, title: "DTCP Approved Residential Plot in Sendurai", city: "Ariyalur", area: "Sendurai", type: "plot",
    status: "for-sale", price: 42, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 119, title: "Spacious 3BHK Premium Apartment in Perambalur Town", city: "Perambalur", area: "Perambalur Town", type: "apartment",
    status: "for-sale", price: 68, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1420,
    floor: "3rd of 8", facing: "North", age: "1 Yr", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 120, title: "Comfortable 2BHK Family Flat in Veppanthattai", city: "Perambalur", area: "Veppanthattai", type: "apartment",
    status: "for-rent", price: 10000, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "North", age: "2 Yrs", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 121, title: "DTCP Approved Residential Plot in Kunnam", city: "Perambalur", area: "Kunnam", type: "plot",
    status: "for-sale", price: 54, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 122, title: "Modern 3BHK Gated Villa in Viluppuram Town", city: "Viluppuram", area: "Viluppuram Town", type: "villa",
    status: "for-sale", price: 89, priceUnit: "Lakhs", beds: 3, baths: 3, sqft: 1850,
    floor: "G+1", facing: "North", age: "New", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    featured: true, verified: true,
  },
  {
    id: 123, title: "Comfortable 2BHK Family Flat in Tindivanam", city: "Viluppuram", area: "Tindivanam", type: "apartment",
    status: "for-rent", price: 12700, priceUnit: "/mo", beds: 2, baths: 2, sqft: 1050,
    floor: "2nd of 4", facing: "East", age: "2 Yrs", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    featured: false, verified: true,
  },
  {
    id: 124, title: "DTCP Approved Residential Plot in Gingee", city: "Viluppuram", area: "Gingee", type: "plot",
    status: "for-sale", price: 31, priceUnit: "Lakhs", beds: 0, baths: 0, sqft: 1500,
    floor: "Ground", facing: "East", age: "NA", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    featured: false, verified: true,
  }
];

export const PROPERTY_TYPE_OPTIONS = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'villa', label: 'Villa' },
  { id: 'plot', label: 'Plot' },
  { id: 'individual-house', label: 'Individual House' },
  { id: 'farm-land', label: 'Farm Land' },
  { id: 'penthouse', label: 'Penthouse' },
  { id: 'bungalow', label: 'Bungalow' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'office-space', label: 'Office Space' }
];

export const AREAS = CITY_AREAS['Chennai'];

export const PROPERTY_TYPES = PROPERTY_TYPE_OPTIONS.map(p => p.label);

export function formatPrice(price, unit) {
  if (unit === 'Lakhs') return `₹${price} L`;
  if (unit === 'Cr') return `₹${price} Cr`;
  if (unit === '/mo') return `₹${price.toLocaleString('en-IN')}/mo`;
  return `₹${price}`;
}
