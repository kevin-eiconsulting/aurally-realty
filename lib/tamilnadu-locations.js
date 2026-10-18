// Comprehensive Tamil Nadu Location Database
// Covers all 38 Districts, Municipal Corporations, and prominent residential/commercial localities

export const TAMIL_NADU_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Hosur', // Major industrial corporation (Krishnagiri)
  'Kallakurichi',
  'Kanchipuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar'
];

// Top commercial & residential hubs (for quick-picks / prominent tabs)
export const POPULAR_TN_HUBS = [
  'Chennai',
  'Coimbatore',
  'Hosur',
  'Madurai',
  'Trichy',
  'Salem',
  'Tirunelveli',
  'Vellore',
  'Tiruppur',
  'Erode'
];

// Backward-compatible alias for cities list
export const TAMIL_NADU_CITIES = [
  'Chennai',
  'Coimbatore',
  'Hosur',
  'Madurai',
  'Trichy',
  'Salem',
  'Tirunelveli',
  'Vellore',
  'Tiruppur',
  'Erode',
  'Chengalpattu',
  'Kanchipuram',
  'Tiruvallur',
  'Thanjavur',
  'Dindigul',
  'Thoothukudi',
  'Nagercoil',
  'Cuddalore',
  'Dharmapuri',
  'Krishnagiri',
  'Karur',
  'Namakkal',
  'Ooty',
  'Karaikudi',
  'Sivakasi',
  'Theni',
  'Ramanathapuram',
  'Pudukkottai',
  'Nagapattinam',
  'Mayiladuthurai',
  'Tiruvarur',
  'Tiruvannamalai',
  'Ranipet',
  'Tirupathur',
  'Kallakurichi',
  'Tenkasi',
  'Ariyalur',
  'Perambalur',
  'Viluppuram'
];

// Comprehensive mapping of all Cities & Districts to Localities / Suburbs / Zones
export const CITY_AREAS = {
  'Chennai': [
    'Anna Nagar', 'T. Nagar', 'Velachery', 'OMR', 'Adyar', 'Besant Nagar', 'Porur',
    'Tambaram', 'Sholinganallur', 'Ambattur', 'Perambur', 'Guindy', 'Mylapore',
    'Nungambakkam', 'Kilpauk', 'Kodambakkam', 'Vadapalani', 'Alwarpet', 'Thiruvanmiyur',
    'Medavakkam', 'Madipakkam', 'Perungudi', 'Navalur', 'Siruseri', 'Pallavaram',
    'Chromepet', 'Avadi', 'Poonamallee', 'Mogappair', 'Kolathur', 'Koyambedu',
    'Ashok Nagar', 'Saidapet', 'Royapettah', 'Egmore', 'Triplicane', 'George Town',
    'Washermanpet', 'Royapuram', 'Madhavaram', 'Manali', 'Red Hills', 'Ennore',
    'Kundrathur', 'Mangadu', 'Iyyappanthangal', 'Ramapuram', 'Valasaravakkam',
    'Virugambakkam', 'KK Nagar', 'West Mambalam', 'Nandanam', 'RA Puram',
    'Kotturpuram', 'Thoraipakkam', 'Karapakkam', 'Semmancheri', 'Kelambakkam',
    'Padur', 'Guduvanchery', 'Urapakkam', 'Vandalur', 'Perungalathur', 'Maraimalai Nagar'
  ],

  'Hosur': [
    'Bagalur Road', 'Sipcot Phase 1', 'Sipcot Phase 2', 'Mathigiri', 'Avalapalli',
    'Mookandapalli', 'Rayakottai Road', 'Moranapalli', 'Zuzuvadi', 'Denkanikottai Road',
    'Thally Road', 'Kelamangalam Road', 'Nallur', 'Shoolagiri', 'Attibele Border',
    'Begepalli', 'Poonapalli', 'Chennathur', 'Alasanatham', 'Kothur', 'Bathalapalli',
    'Chinna Elasagiri', 'Pedda Elasagiri', 'Anthivadi', 'Kamaraj Nagar',
    'Railway Station Road', 'Ring Road', 'Onnalvadi', 'Sanasandiram', 'Thorapalli'
  ],

  'Coimbatore': [
    'RS Puram', 'Gandhipuram', 'Saravanampatti', 'Peelamedu', 'Saibaba Colony',
    'Race Course', 'Singanallur', 'Vadavalli', 'Ramanathapuram', 'Hopes College',
    'Ganapathy', 'Kovaipudur', 'Thudiyalur', 'Kalapatti', 'Kuniyamuthur',
    'Sundarapuram', 'Ukkadam', 'Town Hall', 'Ondipudur', 'Sulur', 'Podanur',
    'Eachanari', 'Malumichampatti', 'Kinathukadavu', 'Pollachi Road', 'Avinashi Road',
    'Trichy Road', 'Mettupalayam Road', 'Sathy Road', 'Kurichi', 'Perur',
    'Chinnavedampatti', 'Vilankurichi', 'Neelambur', 'Irugur', 'Vellalore'
  ],

  'Madurai': [
    'KK Nagar', 'Anna Nagar', 'Mattuthavani', 'Simmakkal', 'TVS Nagar', 'SS Colony',
    'Koodal Nagar', 'Iyer Bungalow', 'Goripalayam', 'Tallakulam', 'Othakadai',
    'Thirunagar', 'Villapuram', 'Sellur', 'Palanganatham', 'Pasumalai',
    'Tirupparankunram', 'Teppakulam', 'Munichalai', 'South Gate', 'Periyar',
    'Bypass Road', 'Ellis Nagar', 'Kochadai', 'Anaiyur', 'Alagar Kovil Road'
  ],

  'Trichy': [
    'Srirangam', 'Thillai Nagar', 'Cantonment', 'KK Nagar', 'Kattur', 'Vayalur Road',
    'Crawford', 'Ponmalai', 'Woraiyur', 'Palakkarai', 'Central Bus Stand',
    'Junction', 'Karumandapam', 'Subramaniyapuram', 'Airport Area', 'Gundur',
    'Mathur', 'BHEL Township', 'Thuvakudi', 'Samayapuram', 'No.1 Tollgate',
    'Lalgudi', 'Manachanallur', 'Dindigul Road'
  ],
  'Tiruchirappalli': [
    'Srirangam', 'Thillai Nagar', 'Cantonment', 'KK Nagar', 'Kattur', 'Vayalur Road',
    'Crawford', 'Ponmalai', 'Woraiyur', 'Palakkarai', 'Karumandapam', 'Airport Area',
    'BHEL Township', 'Thuvakudi', 'Samayapuram', 'No.1 Tollgate'
  ],

  'Salem': [
    'Fairlands', 'Alagapuram', 'Suramangalam', 'Hasthampatti', 'Ammapet',
    'Shevapet', 'Meyyanur', 'Kannankurichi', 'Salem Junction', 'Gugai',
    'Dadagapatti', 'Kondalampatti', 'Steel Plant Road', 'Omalur Road',
    'Yercaud Foothills', 'Gorimedu', 'Seelanaickenpatti', 'Ayothiapattinam'
  ],

  'Tirunelveli': [
    'Palayamkottai', 'Vannarpettai', 'Town', 'Perumalpuram', 'Tirunelveli Junction',
    'Shanthi Nagar', 'Maharajanagar', 'NGO Colony', 'Samathanapuram', 'Thachanallur',
    'Melapalayam', 'Pettai', 'Suthamalli', 'Reddiarpatti', 'KTC Nagar'
  ],

  'Vellore': [
    'Katpadi', 'Gandhi Nagar', 'Sathuvachari', 'Bagayam', 'Thorapadi', 'Otteri',
    'Sankaranpalayam', 'Kosapet', 'Saidapet', 'Rangapuram', 'Shenbakkam',
    'Salavanpet', 'VIT Area', 'Dharapadavedu', 'Konavattam'
  ],

  'Tiruppur': [
    'Avinashi Road', 'Palladam Road', 'Kangeyam Road', 'Dharapuram Road',
    'Mangalam Road', 'College Road', 'Rayapuram', 'Kumar Nagar', 'Anupparpalayam',
    'Veerapandi', 'Nallur', 'Velampalayam', 'Chettipalayam', 'Angeripalayam'
  ],

  'Erode': [
    'Perundurai Road', 'Brough Road', 'Sathy Road', 'Bhavani Road', 'Collectorate',
    'Solar', 'Thindal', 'Veerappanchatram', 'Surampatti', 'Rangampalayam',
    'Chithode', 'Modakkurichi', 'Kasipalayam', 'Villarasampatti'
  ],

  'Chengalpattu': [
    'Tambaram Sanatorium', 'Maraimalai Nagar', 'Mahindra World City', 'Guduvanchery',
    'Chengalpattu Town', 'Singaperumal Koil', 'Kelambakkam', 'Mamallapuram',
    'Thiruporur', 'Urapakkam', 'Vandalur', 'Madambakkam'
  ],

  'Kanchipuram': [
    'Enathur', 'Walajabad', 'Sriperumbudur', 'Sunguvarchatram', 'Kanchipuram Town',
    'Pillayarpalayam', 'Orikkai', 'Little Kanchipuram', 'Collectorate Area'
  ],

  'Tiruvallur': [
    'Avadi', 'Poonamallee', 'Thiruninravur', 'Gummidipoondi', 'Ponneri',
    'Minjur', 'Tiruvallur Town', 'Manavala Nagar', 'Veppampattu', 'Pattabiram'
  ],

  'Thanjavur': [
    'Medical College Road', 'New Bus Stand', 'Old Bus Stand', 'Karanthai',
    'Vallam', 'Kumbakonam', 'Papanasam', 'Pattukkottai', 'Raja Serfoji College Area'
  ],

  'Dindigul': [
    'Palani Road', 'Batlagundu Road', 'Trichy Road', 'Round Road', 'Begambur',
    'GTN Nagar', 'RM Colony', 'Palani', 'Kodaikanal', 'Natham Road'
  ],

  'Thoothukudi': [
    'Millerpuram', 'Bryant Nagar', 'Toovipuram', 'Harbour Area', 'Spic Nagar',
    'Muthiapuram', 'SIPCOT', 'Kovilpatti', 'Tiruchendur Road'
  ],

  'Kanyakumari': [
    'Vadasery', 'Kottar', 'Asaripallam', 'Parvathipuram', 'Chetti Kulam',
    'Nagercoil Town', 'Kanyakumari Beach', 'Marthandam', 'Thuckalay'
  ],
  'Nagercoil': [
    'Vadasery', 'Kottar', 'Asaripallam', 'Parvathipuram', 'Chetti Kulam',
    'Court Road', 'KP Road', 'Suchindram'
  ],

  'Cuddalore': [
    'Manjakuppam', 'Thirupapuliyur', 'Semmandalam', 'Cuddalore Port',
    'Panruti', 'Chidambaram', 'Neyveli Township', 'Vadalur'
  ],

  'Dharmapuri': [
    'Collectorate', 'Pennagaram Road', 'Salem Road', 'Harur', 'Palacode',
    'Marandahalli', 'Bharathipuram', 'Pidamaneri'
  ],

  'Krishnagiri': [
    'Old Pet', 'New Pet', 'Rayakottai Road', 'Bangalore Road', 'Kuppam Road',
    'Bargur', 'Kaveripattinam', 'Pochampalli', 'Collectorate Complex'
  ],

  'Karur': [
    'Thanthonimalai', 'Gandhigramam', 'Vengamedu', 'Pasupathipalayam',
    'Light House Corner', 'Velayuthampalayam', 'Kulithalai'
  ],

  'Namakkal': [
    'Tiruchengode', 'Paramathi Velur', 'Rasipuram', 'Mohanur Road',
    'Salem Road', 'Thuraiyur Road', 'Collectorate Area'
  ],

  'Nilgiris': [
    'Charing Cross', 'Commercial Road', 'Fingerpost', 'Coonoor', 'Kotagiri',
    'Gudalur', 'Wellington', 'Lovedale'
  ],
  'Ooty': [
    'Charing Cross', 'Commercial Road', 'Fingerpost', 'Fernhill', 'Lovedale', 'Botanical Garden Area'
  ],

  'Sivaganga': [
    'Karaikudi College Road', 'Sekkalai', 'Subramaniyapuram', 'Sivaganga Town',
    'Devakottai', 'Manamadurai', 'Tiruppattur'
  ],
  'Karaikudi': [
    'College Road', 'Sekkalai', 'Subramaniyapuram', 'Kottaiyur', 'Alagappa Puram'
  ],

  'Virudhunagar': [
    'Sivakasi Town', 'Rajapalayam', 'Srivilliputhur', 'Aruppukkottai',
    'Virudhunagar Collectorate', 'Sattur'
  ],
  'Sivakasi': [
    'Vilampatti Road', 'Satchiyapuram', 'Thiruthangal', 'Paraipatti', 'Palaniandavar Colony'
  ],

  'Theni': [
    'Periyakulam', 'Bodinayakanur', 'Cumbum', 'Allinagaram', 'Theni Old Bus Stand', 'Chinnamanur'
  ],

  'Ramanathapuram': [
    'Rameswaram', 'Paramakudi', 'Mandapam', 'Ramanathapuram Town', 'Keelakarai'
  ],

  'Pudukkottai': [
    'Machuvadi', 'Rajagopalapuram', 'Alangudi', 'Aranthangi', 'Pudukkottai Town', 'Thirumayam'
  ],

  'Nagapattinam': [
    'Velankanni', 'Nagore', 'Vedaranyam', 'Nagapattinam Port Area', 'Kilvelur'
  ],

  'Mayiladuthurai': [
    'Kaveri Nagar', 'Pattamangala Street', 'Sirkazhi', 'Tharangambadi', 'Kuthalam'
  ],

  'Tiruvarur': [
    'Mannargudi', 'Thiruthuraipoondi', 'Kudavasal', 'Tiruvarur Town', 'Needamangalam'
  ],

  'Tiruvannamalai': [
    'Girivalam Road', 'Polur Road', 'Chengam Road', 'Tindivanam Road', 'Arani', 'Cheyyar'
  ],

  'Ranipet': [
    'Ranipet Town', 'Walaja', 'Arcot', 'Sholinghur', 'BHEL Ranipet', 'Melvisharam'
  ],

  'Tirupathur': [
    'Tirupathur Town', 'Vaniyambadi', 'Ambur', 'Jolarpet', 'Natrampalli'
  ],

  'Kallakurichi': [
    'Kallakurichi Town', 'Ulundurpet', 'Sankarapuram', 'Tirukoilur', 'Chinnasalem'
  ],

  'Tenkasi': [
    'Tenkasi Town', 'Courtallam', 'Sankarankovil', 'Kadayanallur', 'Sengottai', 'Alangulam'
  ],

  'Ariyalur': [
    'Ariyalur Town', 'Jayankondam', 'Sendurai', 'Udayarpalayam'
  ],

  'Perambalur': [
    'Perambalur Town', 'Veppanthattai', 'Kunnam', 'Alathur'
  ],

  'Viluppuram': [
    'Viluppuram Town', 'Tindivanam', 'Gingee', 'Valavanur', 'Vikravandi'
  ]
};

// Flattened list of all locations for fast matching
export const ALL_LOCATIONS = [];

// Populate flat array
Object.entries(CITY_AREAS).forEach(([cityName, localities]) => {
  localities.forEach(locality => {
    ALL_LOCATIONS.push({
      locality,
      city: cityName,
      label: `${locality}, ${cityName}`,
      type: 'locality'
    });
  });
});

// Add all cities as standalone entries
TAMIL_NADU_CITIES.forEach(city => {
  ALL_LOCATIONS.push({
    locality: '',
    city: city,
    label: `${city}, Tamil Nadu`,
    type: 'city'
  });
});

/**
 * Smart Search through all Tamil Nadu locations
 * @param {string} query Search text
 * @param {string} preferredCity Optional currently active city
 * @param {number} limit Max results to return
 * @returns {Array} List of matched locations
 */
export function searchTamilNaduLocations(query, preferredCity = '', limit = 12) {
  if (!query || !query.trim()) {
    // Return popular localities for preferredCity if query is empty
    const cityLocalities = CITY_AREAS[preferredCity] || CITY_AREAS['Hosur'] || [];
    return cityLocalities.slice(0, limit).map(loc => ({
      locality: loc,
      city: preferredCity || 'Hosur',
      label: `${loc}, ${preferredCity || 'Hosur'}`,
      type: 'locality'
    }));
  }

  const cleanQuery = query.toLowerCase().trim();
  const results = [];
  const seen = new Set();

  // 1. Exact city name match
  TAMIL_NADU_CITIES.forEach(city => {
    if (city.toLowerCase().startsWith(cleanQuery)) {
      const key = `city:${city}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          locality: '',
          city,
          label: `${city}, Tamil Nadu`,
          type: 'city',
          score: 100
        });
      }
    }
  });

  // 2. Localities in current preferred city (prioritized)
  if (preferredCity && CITY_AREAS[preferredCity]) {
    CITY_AREAS[preferredCity].forEach(loc => {
      const locLower = loc.toLowerCase();
      if (locLower.startsWith(cleanQuery)) {
        const key = `loc:${preferredCity}:${loc}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            locality: loc,
            city: preferredCity,
            label: `${loc}, ${preferredCity}`,
            type: 'locality',
            score: 90
          });
        }
      } else if (locLower.includes(cleanQuery)) {
        const key = `loc:${preferredCity}:${loc}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            locality: loc,
            city: preferredCity,
            label: `${loc}, ${preferredCity}`,
            type: 'locality',
            score: 70
          });
        }
      }
    });
  }

  // 3. Localities across ALL other cities in Tamil Nadu
  Object.entries(CITY_AREAS).forEach(([cityName, localities]) => {
    localities.forEach(loc => {
      const locLower = loc.toLowerCase();
      if (locLower.startsWith(cleanQuery)) {
        const key = `loc:${cityName}:${loc}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            locality: loc,
            city: cityName,
            label: `${loc}, ${cityName}`,
            type: 'locality',
            score: 80
          });
        }
      } else if (locLower.includes(cleanQuery)) {
        const key = `loc:${cityName}:${loc}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            locality: loc,
            city: cityName,
            label: `${loc}, ${cityName}`,
            type: 'locality',
            score: 50
          });
        }
      }
    });
  });

  // Sort by relevance score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}
