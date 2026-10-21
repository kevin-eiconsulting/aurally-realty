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

// Comprehensive mapping of all Cities & Districts to Localities / Suburbs / Villages / Zones
export const CITY_AREAS = {
  'Chennai': [
    'Anna Nagar','Anna Nagar East','Anna Nagar West','T. Nagar','Velachery','OMR','Adyar','Besant Nagar','Porur',
    'Tambaram','Sholinganallur','Ambattur','Perambur','Guindy','Mylapore','Nungambakkam','Kilpauk','Kodambakkam',
    'Vadapalani','Alwarpet','Thiruvanmiyur','Medavakkam','Madipakkam','Perungudi','Navalur','Siruseri',
    'Pallavaram','Chromepet','Avadi','Poonamallee','Mogappair','Kolathur','Koyambedu','Ashok Nagar',
    'Saidapet','Royapettah','Egmore','Triplicane','George Town','Washermanpet','Royapuram','Madhavaram',
    'Manali','Red Hills','Ennore','Kundrathur','Mangadu','Iyyappanthangal','Ramapuram','Valasaravakkam',
    'Virugambakkam','KK Nagar','West Mambalam','Nandanam','RA Puram','Kotturpuram','Thoraipakkam',
    'Karapakkam','Semmancheri','Kelambakkam','Padur','Guduvanchery','Urapakkam','Vandalur','Perungalathur',
    'Maraimalai Nagar','Selaiyur','Chitlapakkam','Nanganallur','Alandur','Adambakkam','Ullagaram',
    'Sembakkam','Peerkankaranai','Pozhichalur','Mudichur','Pammal','Anakaputhur','Maduravoyal',
    'Alapakkam','Nerkundram','Nolambur','Mugalivakkam','Kolapakkam','Kattupakkam','Thiruverkadu',
    'Pattabiram','Perumbakkam','Thaiyur','Neelankarai','Palavakkam','Injambakkam','Akkarai',
    'ECR','Kovalam','Puzhuthivakkam','Kovilambakkam','Pallikaranai','Moolakkadai','Villivakkam',
    'Korukkupet','Purasaiwakkam','Choolai','Sembiam','Otteri','Puliyanthope','Tondiarpet',
    'Tiruvottiyur','Kaladipet','Madhavaram Milk Colony','Puzhal','Mathur','Periyar Nagar',
    'Erukkanchery','Kodungaiyur','Vyasarpadi','New Washermanpet','Basin Bridge','Park Town',
    'Chetpet','Kellys','Vepery','Arumbakkam','Saligramam','Aminjikarai','Ekkatuthangal',
    'Pazhavanthangal','St. Thomas Mount','MGR Nagar','Tambaram West','Tambaram East',
    'Ambattur Estate','SIDCO Industrial Estate','Mogappair West','Mogappair East',
    'Thirumangalam','Thirumullaivoyal','Senneerkuppam','Parivakkam','Velappanchavadi',
    'Ramapuram Main Road','Manapakkam','Taramani','Kandanchavadi','Kottivakkam',
    'Valmiki Nagar','Gandhi Nagar Adyar','Lloyds Road','Chamiers Road','Poes Garden',
    'Gopalapuram','Boat Club Road','MRC Nagar','Raja Annamalai Puram','Mandaveli',
    'Karpagam Garden','Kasturba Nagar','Indira Nagar','Meenambakkam','Airport Colony',
    'Airport Road','Nanmangalam','Oragadam','Singaperumal Koil','Korattur','Puduvoyal',
    'Thirumudivakkam','Mannivakkam','Mappedu','Thirunindravur','Gummidipoondi','Ponneri',
    'Minjur','Avadi Camp Road','ICF Colony','Avadi Main Road','Avadi Camp Area',
    'CRPF Camp','Wimco Nagar','Kathirvedu','Sholavaram','Tiruvottiyur High Road',
    'Ennore Thermal Plant Area','Manali Industrial Area','Madhavaram Bypass',
    'Perambur North','Perambur South','Kolathur Main Road','Poes Garden Extension',
    'Kilpauk Medical College Area','Egmore High Road','Mint','Periamet',
    'Mannady','NSC Bose Road','Sowcarpet','Kondithope','Chintadripet',
    'Chepauk','Mylapore Extension','Alwarpet Extension','Abhiramapuram',
    'Greenways Road','Lattice Bridge Road','Cenotaph Road','Nugambakkam High Road',
    'Harrington Road','Pulla Avenue','Arya Gowda Road','Rangarajapuram',
    'Kodambakkam High Road','Kaliamman Koil Street','Arcot Road','Vadapalani Arcot',
    'Porur Arcot Road','Arcot Road Virugambakkam','Thirumalai Nagar','Gowri Nagar',
    'Balaji Nagar','Ganesh Nagar','Venkateswara Nagar'
  ],

  'Coimbatore': [
    'RS Puram','Gandhipuram','Saravanampatti','Peelamedu','Saibaba Colony','Race Course',
    'Singanallur','Vadavalli','Ramanathapuram','Hopes College','Ganapathy','Kovaipudur',
    'Thudiyalur','Kalapatti','Kuniyamuthur','Sundarapuram','Ukkadam','Town Hall','Ondipudur',
    'Sulur','Podanur','Eachanari','Malumichampatti','Kinathukadavu','Pollachi Road',
    'Avinashi Road','Trichy Road','Mettupalayam Road','Sathy Road','Kurichi','Perur',
    'Chinnavedampatti','Vilankurichi','Neelambur','Irugur','Vellalore','Sowripalayam',
    'Peelamedu Extension','Krishnarayapuram','Chinniyampalayam','Athipalayam','Annur',
    'Palladam','Kovai Kudil','Thadagam','Siruvani Road','Marudamalai','Marudamalai Road',
    'Velandipalayam','Rathinapuri','Pappanaickenpalayam','Nanjundapuram','Pothuvampatti',
    'Chettipalayam','Narasimhanaickenpalayam','Kavundampalayam','Anaimalai Road','Pollachi',
    'Valparai','Oddanchatram','Avinashi','Periyanaickenpalayam','Othakalmandapam',
    'Mettupalayam','Kurumbapalayam','Podanur Junction','Bharathiar University Area',
    'PSG College Area','CODISSIA Area','SIDCO Coimbatore','Selvapuram','Upplipalayam',
    'Saravanampatti Phase 2','Kaniyur','Sultanpet','Cross Cut Road','DB Road',
    'Kollampalayam','Puliakulam','Perur Chettipalayam','Madukkarai','Ettimadai',
    'Karamadai','Sarkar Samakulam','Thondamuthur','Idigarai','Udumalapet',
    'Dharapuram Coimbatore','Kangeyam Coimbatore','Gobichettipalayam','Sathyamangalam',
    'Bannari','Bhavanisagar','Kalingarayanpalayam','Saravanampatty','Periyar Colony',
    'Lakshmi Mills Area','Sidhapudur','Venkitapuram','Ponnaiahrajapuram',
    'Vivekanandapuram','Trichy Road Extension','Bharathi Nagar','Vadavalli Main Road',
    'Thanneer Pandhal','Poonamallee Road Coimbatore','Race Course Road','Civil Aerodrome Road',
    'Telungupalayam','Karumathampatty'
  ],

  'Madurai': [
    'KK Nagar','Anna Nagar','Mattuthavani','Simmakkal','TVS Nagar','SS Colony',
    'Koodal Nagar','Iyer Bungalow','Goripalayam','Tallakulam','Othakadai','Thirunagar',
    'Villapuram','Sellur','Palanganatham','Pasumalai','Tirupparankunram','Teppakulam',
    'Munichalai','South Gate','Periyar','Bypass Road','Ellis Nagar','Kochadai','Anaiyur',
    'Alagar Kovil Road','Arasaradi','Vandiyur','Melur Road','Krishnapuram','Sivaganga Road',
    'Tirumangalam','Usilampatti','Chekkanuthu','Alanganallur','Natham','Vilacheri',
    'Kappalur','Tirunagar','Aavin Colony','Anuppanadi','Melakkal','Nagamalai',
    'Sholavandan','Sathamangalam','Vaigai Colony','Madurai Airport Area','Thirumohur',
    'Melur','Thiruvathavur','Saptur','Virattipathu','Hospital Road','West Masi Street',
    'East Masi Street','North Masi Street','South Masi Street','Big Street Madurai',
    'Nagamalai Pudukottai','Gomathipuram','Arapalayam','Paravai','Thirupalai','Kalavasal',
    'Ponnagaram','Avaniapuram','Koodal Nagar West','Subramaniyapuram Madurai','Viraganur',
    'Sedapatti','Thiruvedagam','Perungudi Madurai','Harveypatti','Thanakkankulam',
    'Srirangam Road Madurai','Alagar Kovil Foothills','Oothu','Sholavandan Road',
    'Keelavalavu','Thiruvathapuram','Thenur','Uthangudi','Visalakshi Nagar',
    'Madurai South','Madurai North','Madurai East','Madurai West',
    'Bye Pass Road North','Bye Pass Road South'
  ],

  'Hosur': [
    'Bagalur Road','Sipcot Phase 1','Sipcot Phase 2','Mathigiri','Avalapalli',
    'Mookandapalli','Rayakottai Road','Moranapalli','Zuzuvadi','Denkanikottai Road',
    'Thally Road','Kelamangalam Road','Nallur','Shoolagiri','Attibele Border','Begepalli',
    'Poonapalli','Chennathur','Alasanatham','Kothur','Bathalapalli','Chinna Elasagiri',
    'Pedda Elasagiri','Anthivadi','Kamaraj Nagar','Railway Station Road','Ring Road',
    'Onnalvadi','Sanasandiram','Thorapalli','Anchetty','Bettagondapalli','Berigai',
    'Hosur Town','Hosur Bus Stand','Royakottai','Singarapettai','Mathigiri Extension',
    'KIADB Area','TVS Area','Foxconn Road','Electronics Highway','Bannerghatta Road',
    'Bommasandra','Sarjapur Road','Chandapura','Anekal','Electronic City Phase 1',
    'Electronic City Phase 2','Narsapura','Malur','Jadigenahalli','Mugapallanahalli',
    'Doddahejjaji','Giddenahalli','Narasimhapura','Haraluru','Budigere','Vajarahalli',
    'Muthanallur','Sarjapur','Doddanapalya','Dommasandra','Devarabisanahalli',
    'Bellandur','Carmelram','Kalkere','Soukya Road','Kadugodi','Krishnasagara',
    'Huskur','Suragajakkanahalli','Rayakottai','Begur Road Hosur','Siruguduvu',
    'Aarappalayam','Kannamangalam Hosur','Mathigiri Town'
  ],

  'Trichy': [
    'Srirangam','Thillai Nagar','Cantonment','KK Nagar','Kattur','Vayalur Road',
    'Crawford','Ponmalai','Woraiyur','Palakkarai','Central Bus Stand','Junction',
    'Karumandapam','Subramaniyapuram','Airport Area','Gundur','Mathur','BHEL Township',
    'Thuvakudi','Samayapuram','No.1 Tollgate','Lalgudi','Manachanallur','Dindigul Road',
    'Palpannai','Tennur','Ariyamangalam','Golden Rock','Melapudur','Khajamalai',
    'Ayyampettai','Pettavaithalai','Thiruverumbur','Siruganur','Navalpattu','Kallakudi',
    'Edamalaipattipudur','Varaganeri','Thiruvissanallur','Puliyur','Elanthakudi',
    'Keelakavani','Somarasampettai','Karuvalanallur','Nathakadu','Manaparai',
    'Tiruverumbur','Ammapettai Trichy','Pirattiyur','Tharanallur','Ammamandapam',
    'Manikandam','Irungalur','Thathanur','Pullambadi','Kodiyalam','No.2 Tollgate',
    'Srirangam North','Srirangam South','Ariyamangalam Road','Mannarpuram',
    'Tatchi Anamali','Vasantha Nagar Trichy','Ponniammanpettai','Puthur',
    'Sadayandi Nagar','Maruti Nagar','Sangam Nagar Trichy'
  ],

  'Tiruchirappalli': [
    'Srirangam','Thillai Nagar','Cantonment','KK Nagar','Kattur','Vayalur Road',
    'Crawford','Ponmalai','Woraiyur','Palakkarai','Karumandapam','Airport Area',
    'BHEL Township','Thuvakudi','Samayapuram','Lalgudi','Manachanallur','Ariyamangalam',
    'Golden Rock','Melapudur','Khajamalai','Ayyampettai','Thiruverumbur','Siruganur',
    'Navalpattu','Tennur','No.1 Tollgate','No.2 Tollgate','Palpannai'
  ],

  'Salem': [
    'Fairlands','Alagapuram','Suramangalam','Hasthampatti','Ammapet','Shevapet','Meyyanur',
    'Kannankurichi','Salem Junction','Gugai','Dadagapatti','Kondalampatti','Steel Plant Road',
    'Omalur Road','Yercaud Foothills','Gorimedu','Seelanaickenpatti','Ayothiapattinam',
    'Mettur Road','Kitchipalayam','Siddapadi','Attur Road','Valavanthankottai',
    'Narasothipatti','Kollapatti','Pannapatti','Thumbal','Periyeri','Gangavalli',
    'Thalaivasal','Edapadi','Mecheri','Panamarathupatti','Nallipalayam','Kolathur Salem',
    'Velur Salem','Valappadi','Mallur','Danishpet','Maniyampet','Jagir Ammapalayam',
    'Karuppur','Idappadi','Omalur','Mettur Dam Road','Bommidi','Bhavani Road Salem',
    'Tiruchengode Road','Namakkal Road','Rasipuram Road','Yercaud Main Road',
    'Shevaroy Hills','Kumaraswamipatti','State Bank Road','Big Bazaar Road',
    'Sankaridrug','Attur','Tharamangalam','Vazhapadi','Kadayampatti',
    'Pethanaickenpalayam','Belur Salem','Nangavalli','Mettur','Yercaud',
    'Salem East','Salem West','Salem North','Salem South','Salem Steel Plant',
    'Seelanaickenpatti Road','Karuppur Road','Omalur Town','Mettur Town',
    'Attur Town','Thalaivasal Road','Edapadi Town','Gangavalli Town'
  ],

  'Tirunelveli': [
    'Palayamkottai','Vannarpettai','Perumalpuram','Tirunelveli Junction','Shanthi Nagar',
    'Maharajanagar','NGO Colony','Samathanapuram','Thachanallur','Melapalayam',
    'Pettai','Suthamalli','Reddiarpatti','KTC Nagar','Alagiyapandipuram',
    'Ambasamudram','Cheranmahadevi','Manur','Kalakad','Nanguneri','Radhapuram',
    'Papanasam','Sankarankovil','Kadayanallur','Sengottai','Alangulam',
    'Muriankuppam','Kuruvikulam','Thiruvenkatam','Melaneelithanallur','Ilanji',
    'Thisayanvilai','Vikramasingapuram','Valliyur','Unnamalaikadai',
    'Krishnapuram Tirunelveli','Kadambur','Sivasailam','Hospital Junction',
    'New Bus Stand Area Tirunelveli','Old Bus Stand Area Tirunelveli',
    'Palayamkottai Road','Cheranmahadevi Road','Puliyangudi','Veeravanadipuram',
    'Surandai','Pavoorchatram','Pattamadai','Abishegapatti','Manimuthar',
    'Pachayappapuram','Nalatinputhur','Tharuvai','Sivagiri Tirunelveli',
    'Melapalayam Extension','Maniachi','Moolaikaraipatti','Palayamkottai Extension',
    'Vanchi Maniyachi','Veeravanallur','Tirunelveli Town','Odaipatti',
    'Devathanapatti','Kayamozhi','Muthiahpuram','Arasaradi Tirunelveli'
  ],

  'Vellore': [
    'Katpadi','Gandhi Nagar','Sathuvachari','Bagayam','Thorapadi','Otteri',
    'Sankaranpalayam','Kosapet','Saidapet Vellore','Rangapuram','Shenbakkam',
    'Salavanpet','VIT Area','Dharapadavedu','Konavattam','Arni Road','Odugathur',
    'Katpadi Road','Virudhampet','Melvisharam','Walajapet','Arcot','Anaicut',
    'CMC Hospital Area','Government Hospital Road','New Bus Stand Vellore',
    'Ambur','Vaniyambadi','Jolarpet','Sholinghur','Kaveripakkam','Melpadi',
    'Timiri','Pernambut','Natrampalli','Panapakkam','Pallikonda','Keelkuppam',
    'Elagiri','Alankuppam','Somasipadi','Thiruvalam','Vellore Fort Area',
    'Sirupakkam','Gudiyattam','Thirumalaikodi','Varanavasi','Perumbair',
    'Vedanthangal','Virinchipuram','Manai','Thuthipattu','Natrampalli Town',
    'Katpadi Junction','Vellore Medical College Road','Yelagiri Road',
    'Arakkonam','Walajabad Vellore','Arcot Town','Sholinghur Town',
    'Ambur Town','Vaniyambadi Town','Jolarpet Junction','Pernambut Town',
    'Tirupattur Road Vellore','Krishnagiri Road Vellore','Chennai Road Vellore'
  ],

  'Tiruppur': [
    'Avinashi Road','Palladam Road','Kangeyam Road','Dharapuram Road','Mangalam Road',
    'College Road','Rayapuram','Kumar Nagar','Anupparpalayam','Veerapandi','Nallur',
    'Velampalayam','Chettipalayam','Angeripalayam','Periyar Nagar','Arulpuram',
    'Ashokapuram','Kamarajapuram','Selvapuram','Kottaipalayam','Sundarapuram Tiruppur',
    'Madathukulam','Uthukuli','Palladam','Kaniyur','Mulanur','Dharapuram',
    'Kangeyam','Udumalpet','Gobichettipalayam','Sathyamangalam','Bannari','Perundurai',
    'Chinniyampalayam','Avinashi','Tiruppur North','Tiruppur South','Tiruppur Junction',
    'Pongaliyur','Perumanallur','Vavipalayam','Kuppichipalayam','Uthukuli Main',
    'Paramathivelur','Sulur Road Tiruppur','Anna Nagar Tiruppur','Nanjundapuram Tiruppur',
    'Kumarapalayam Tiruppur','Padiyur','Oodiyampalayam','Poolavadi','Kunnathur',
    'Vellakovil','Uppilipalayam','Kannampalayam','Odaiyakulam','Karunyapuram',
    'Perumanallur Road','Tiruppur Market','Tiruppur Industrial Area',
    'Annur Road Tiruppur','Coimbatore Road Tiruppur','Palladam Town',
    'Dharapuram Town','Kangeyam Town','Udumalpet Town','Mulanur Town'
  ],

  'Erode': [
    'Perundurai Road','Brough Road','Sathy Road','Bhavani Road','Collectorate Erode',
    'Solar','Thindal','Veerappanchatram','Surampatti','Rangampalayam','Chithode',
    'Modakkurichi','Kasipalayam','Villarasampatti','Bhavani','Anthiyur',
    'Gobichettipalayam','Sathyamangalam','Perundurai','Kodumudi','Nambiyur',
    'Erode West','Erode East','Erode Junction','SIDCO Erode','Selvapuram Erode',
    'Reddiyarpalayam','Gandhipuram Erode','Laxmipuram','Sivagiri','Kavindapadi',
    'Ammachettipalaiyam','Komarapalayam','Thiruchengode','Vellode','Pudupalayam',
    'Moodakkadu','Boothipuram','Erode Town','Chithode Road','Lakkapuram',
    'Periyasemur','Pasur','Thingalur','Sanarpalayam','Unjalur','Ponniammanmedu',
    'Muthampalayam','Nallattipalayam','Ammapettai Erode','Chennimalai',
    'Perundurai SIPCOT','Vellakovil Road Erode','Bhavani Town','Anthiyur Town',
    'Gobichettipalayam Town','Sathyamangalam Town','Perundurai Town','Kodumudi Town',
    'Nambiyur Town','Modakkurichi Town','Kasipalayam Town'
  ],

  'Chengalpattu': [
    'Tambaram Sanatorium','Maraimalai Nagar','Mahindra World City','Guduvanchery',
    'Chengalpattu Town','Singaperumal Koil','Kelambakkam','Mamallapuram','Thiruporur',
    'Urapakkam','Vandalur','Madambakkam','Selaiyur','Chitlapakkam','Pallavaram',
    'Chromepet','Kundrathur','Mangadu','Peerkankaranai','Kolapakkam','Mudichur','Pammal',
    'Anakaputhur','Perungalathur','Nagalkeni','Acharapakkam','Kattankolathur',
    'Thaiyur','Neelankarai','Palavakkam','Puduvoyal','Old Mamallapuram Road',
    'Kovalam','Panaiyur','Salavakkam','Kalpakkam','Chengalpattu Junction','Vedal',
    'Veeranam','Karumattoor','Periyakuppam','Sadras','Brahmadesam','Thandalam',
    'Padappai','Poonthandalam','Nazarathpettai','Poonjeri','Thirumudivakkam',
    'Mannivakkam','Mappedu','Sriperumbudur','Oragadam SIPCOT','Kattankulathur SRM Road',
    'Kelambakkam Bypass','Thiruporur Bypass','Mahabalipuram','ECR Kovalam',
    'ECR Mahabalipuram','ECR Panaiyur','Old Town Chengalpattu',
    'Thiruporur Town','Kelambakkam Town','Guduvanchery Town','Madurantakam Road'
  ],

  'Kanchipuram': [
    'Enathur','Walajabad','Sriperumbudur','Sunguvarchatram','Kanchipuram Town',
    'Pillayarpalayam','Orikkai','Collectorate Area Kanchipuram','Gandhi Nagar Kanchipuram',
    'Uthiramerur','Cheyyar','Acharapakkam','Madurantakam','Salavakkam','Lathur',
    'Kattankulathur','Valathur','Vedal Kanchipuram','Conjeevaram West','Conjeevaram East',
    'Big Kanchipuram','Thirukolathur','Padalam','Sriperumbudur SIPCOT',
    'Vayalur Kanchipuram','Oragadam','Potheri','Pullalavadi','Arali','Ekanapuram',
    'Kunrathur Kanchipuram','Maduranthakam','Nemilicherry','Kanchipuram North',
    'Kanchipuram South','Thirukazhukundram','Walajabad Town','Uthiramerur Town',
    'Madurantakam Town','Sunguvarchatram Town','Orikkai Town','Enathur Town'
  ],

  'Tiruvallur': [
    'Avadi','Poonamallee','Thiruninravur','Gummidipoondi','Ponneri','Minjur',
    'Tiruvallur Town','Manavala Nagar','Veppampattu','Pattabiram','Mappedu',
    'Puduvoyal','Palanjur','Nolambur','Thirumazhisai','Ambattur','Madhavaram',
    'Sholavaram','Red Hills','Puzhal','Perambur','Kolathur','Villivakkam',
    'Tiruvottiyur','Ennore','Kaladipet','Wimco Nagar','Kathirvedu','Arumbakkam',
    'Parivakkam','Velappanchavadi','Sekkadu','Nazarathpettai','Korattur',
    'Mangadu','Thiruverkadu','Kavanur','Poonthandalam','Thirumullaivoyal',
    'Senneerkuppam','Gummidipoondi SIPCOT','SIDCO Thirumullaivoyal',
    'Avadi Main Road','ICF Colony','Ambattur Industrial Estate',
    'Tiruvottiyur High Road','Ennore Thermal Plant Area','Manali Industrial Area',
    'Madhavaram Bypass','Elavur','Arambakkam','Ponneri Town','Minjur Town',
    'Gummidipoondi Town','Tiruvallur Railway Station','Pattabiram Extension',
    'Avadi Extension','Poonamallee High Road','Thiruninravur Town'
  ],

  'Thanjavur': [
    'Medical College Road','New Bus Stand','Old Bus Stand','Karanthai','Vallam',
    'Kumbakonam','Papanasam','Pattukkottai','Raja Serfoji College Area','Thanjavur Town',
    'Srinivasa Nagar','Abraham Pandithar Road','Hospital Road Thanjavur',
    'East Main Street','West Main Street','North Main Street','South Main Street',
    'Big Street Thanjavur','Saraswathi Mahal','Koradacherry','Ayyampet Thanjavur',
    'Thiruvarur Road Thanjavur','Needamangalam Road','Thiruchitrambalam',
    'Thiruvaiyaru','Sengipatti','Pattukottai','Budalur','Orathanadu','Peravurani',
    'Aduthurai','Ammapettai Thanjavur','Saliyamangalam','Madukkur',
    'Kumbakonam Road','Thiruvidaimarudur','Papanasam Road','Nachiapuram',
    'Kumbakonam Town','Thirubuvanam','Kumbakonam SIPCOT','Papanasam Town',
    'Pattukkottai Town','Thanjavur East','Thanjavur West','Swamimalai',
    'Darasuram','Gangaikondacholapuram','Udayalur','Vadaganam',
    'Patteeswaram','Thirukkattupalli','Thiruppanandal','Ammapettai Kumbakonam',
    'Papanasam SIPCOT','Ayyampet Town','Sengipatti Town','Peravurani Town'
  ],

  'Dindigul': [
    'Palani Road','Batlagundu Road','Trichy Road Dindigul','Round Road','Begambur',
    'GTN Nagar','RM Colony','Palani','Kodaikanal','Natham Road','Oddanchatram',
    'Vedasandur','Nilakottai','Athoor','Vadamadurai','Gujiliamparai','Ayyalur',
    'Silamalai','New Colony Dindigul','Thoppampatti','Sanarpatti','Thadikombu',
    'Sriramapuram','Ammaynaickenpatti','Periakottai','Bathalagundu','Kodaikanal Road',
    'Palani Foothills','Dindigul East','Dindigul West','Dindigul Junction',
    'Azhagankulam','Manaparai Road Dindigul','Ambathurai','Kavuthupatti','Nattam',
    'Sithayankottai','Viruveedu','Chinnalapatti','Palar Dindigul','Silukuvarpatti',
    'Kannivadi','Natham Town','Oddanchatram Town','Palani Town','Kodaikanal Town',
    'Vedasandur Town','Nilakottai Town','Athoor Town','Vadamadurai Town',
    'Gujiliamparai Town','Dindigul North','Dindigul South','Dindigul Central'
  ],

  'Thoothukudi': [
    'Millerpuram','Bryant Nagar','Toovipuram','Harbour Area','Spic Nagar',
    'Muthiapuram','SIPCOT Thoothukudi','Kovilpatti','Tiruchendur Road',
    'Thoothukudi Town','Kamaraj Nagar','Anna Nagar Thoothukudi','Chidambaranagar',
    'Pudur','Arockiapuram','Attankaranai','Kuttam','Naraikinaru','Srivaikuntam',
    'Eral','Kayalpatnam','Tiruchendur','Arumuganeri','Meignanapuram','Ottapidaram',
    'Sathankulam','Thisayanvilai','Vilathikulam','Puthiamputhur','Munapandram',
    'Viravanallur','Kulasekarapatnam','Idinthakarai','Sattankulam',
    'Thoothukudi Port','Siluvaipatti','Vadakku Valliyur','Padamathur','Kayathar',
    'Kovilpatti Town','Ettayapuram','Nazareth','Kurumbanoor','Tisaiyanvilai',
    'Thermal Power Station Area','Thoothukudi North','Thoothukudi South',
    'Thoothukudi East','Thoothukudi West'
  ],

  'Kanyakumari': [
    'Vadasery','Kottar','Asaripallam','Parvathipuram','Chetti Kulam',
    'Nagercoil Town','Kanyakumari Beach','Marthandam','Thuckalay','Colachel',
    'Kuzhithurai','Eraniel','Rajakkamangalam','Melpuram','Kaliyakkavilai',
    'Kottaram','Suchindram','Aralvaimozhi','Valiyavilai','Thiruvattar',
    'Nanjilnad','Kanniyakumari','Boothapandy','Thiruvithamcode','Agastheeswaram',
    'Vilavancode','Killiyoor','Gandhi Mandapam Road','Vivekananda Kendra Road',
    'Colachel Port Area','Marthandam Town','Thuckalay Town','Kuzhithurai Town',
    'Eraniel Town','Rajakkamangalam Town'
  ],

  'Nagercoil': [
    'Vadasery','Kottar','Asaripallam','Parvathipuram','Chetti Kulam','Court Road',
    'KP Road','Suchindram','Attoor','Krishnankoil','Munchirai','Vattakottai',
    'Colachel','Marthandam','Thuckalay','Kuzhithurai','Eraniel','Rajakkamangalam',
    'Melpuram','Kaliyakavilai','Kottaram','Thiruvattar','Aralvaimozhi','Valiyavilai',
    'Agastheeswaram','Vilavancode','Nagercoil Junction','Nagercoil Bus Stand',
    'Nagercoil North','Nagercoil South','Nagercoil East','Nagercoil West'
  ],

  'Cuddalore': [
    'Manjakuppam','Thirupapuliyur','Semmandalam','Cuddalore Port','Panruti',
    'Chidambaram','Neyveli Township','Vadalur','Cuddalore Town','SIPCOT Cuddalore',
    'Kattumannarkoil','Sirkazhi','Mayiladuthurai Road Cuddalore','Bhuvanagiri',
    'Tittakudi','Virudhachalam','Ulundurpet','Sankarapuram','Kanai','Sethiathoppu',
    'Parangipettai','Pichavaram','Killai','Cuddalore Old Town','Thiruvandipuram',
    'Nelveli','Annamalai Nagar','Kammapuram','Pennadam','Thirukoilur',
    'Vriddhachalam','Kollidam','Padalur','Cuddalore North','Cuddalore South',
    'Panruti Town','Chidambaram Town','Sirkazhi Town','Virudhachalam Town',
    'Vriddhachalam Town','Ulundurpet Town'
  ],

  'Dharmapuri': [
    'Collectorate Dharmapuri','Pennagaram Road','Salem Road Dharmapuri','Harur',
    'Palacode','Marandahalli','Bharathipuram','Pidamaneri','Dharmapuri Town',
    'Karimangalam','Papireddipatti','Nallampalli','Theerthamalai','Morappur',
    'Kadathur','Hogenakkal','Pennagaram','Malepatti','Bommidi Dharmapuri',
    'Kambainallur','Uthangarai','Santhur','Peppampalli','Tirupattur Road Dharmapuri',
    'Adiyamankottai','Gundalapatti','Harur Town','Palacode Town',
    'Pennagaram Town','Morappur Town','Kadathur Town'
  ],

  'Krishnagiri': [
    'Old Pet','New Pet','Rayakottai Road','Bangalore Road','Kuppam Road','Bargur',
    'Kaveripattinam','Pochampalli','Collectorate Complex Krishnagiri','Hosur Road',
    'Bagalur','Mathigiri Krishnagiri','Krishnagiri Town','Anchetty Krishnagiri',
    'Denkanikottai','Thally','Kelamangalam','Berigai Krishnagiri','Pochampalli Road',
    'Veppanapalli','Uthangarai Road','Hosur Border','Rayakottai','Palakonda',
    'Nagarasampet','Mugaiyur','Sundharapalli','Kaveripattinam Road',
    'Palacode Road Krishnagiri','Muthur Krishnagiri','Bargur Town',
    'Denkanikottai Town','Pochampalli Town','Veppanapalli Town'
  ],

  'Karur': [
    'Thanthonimalai','Gandhigramam','Vengamedu','Pasupathipalayam','Light House Corner',
    'Velayuthampalayam','Kulithalai','Karur Town','Trichy Road Karur',
    'Coimbatore Road Karur','Manmangalam','Kumarapalayam Karur','Aravakurichi',
    'Pallapatti','Mayanur','Punjai Puliyampatti','Vangal','Kallankurichchi',
    'Thogaimalai','Keeranur','Kadavur','Pagalavadi','Noyyal River Area',
    'Paramathy','Amaravathipudur','Paramathivelur Road','Annur Road Karur',
    'Dharapuram Road Karur','Kulithalai Town','Aravakurichi Town',
    'Mayanur Town','Keeranur Town'
  ],

  'Namakkal': [
    'Tiruchengode','Paramathi Velur','Rasipuram','Mohanur Road','Salem Road Namakkal',
    'Thuraiyur Road','Collectorate Area Namakkal','Namakkal Town',
    'Erode Road Namakkal','Trichy Road Namakkal','Senthamangalam','Velur',
    'Mallasamudram','Erumapatty','Pallipalayam','Komarapalayam Namakkal',
    'Nallur Namakkal','Vennandur','Sankari','Elachipalayam','Mohanur','Valasaipatti',
    'Tiruchengode Town','Rasipuram Town','Senthamangalam Town',
    'Paramathi Town','Pallipalayam Town'
  ],

  'Nilgiris': [
    'Charing Cross','Commercial Road','Fingerpost','Coonoor','Kotagiri','Gudalur',
    'Wellington','Lovedale','Ooty Town','Botanical Garden Area','Elk Hill',
    'Doddabetta','Snowdon','Fern Hill','Barliar','Sims Park Area','Vanabhadra',
    'Ethala','Keti','Nanjanad','Bikkatty','Kothagiri','Emerald','Avalanche',
    'Pykara','Mudumalai','Masinagudi','Theppakadu','Bokkapuram','Sholur',
    'Ootacamund','Aruvankad','Devarsholai','Sethumadai','Anaikatti Road',
    'Nilgiris North','Nilgiris South','Coonoor Town','Kotagiri Town',
    'Gudalur Town','Wellington Town'
  ],

  'Ooty': [
    'Charing Cross','Commercial Road','Fingerpost','Fernhill','Lovedale',
    'Botanical Garden Area','Elk Hill','Doddabetta','Snowdon','Fern Hill',
    'Barliar','Sims Park Area','Garden Road','Hospital Road Ooty',
    'Collector Office Road Ooty','Anandagiri','Kodanad','Ettines Road','Havelock Road'
  ],

  'Perambalur': [
    'Perambalur Town','Veppanthattai','Kunnam','Alathur','Ariyalur Road Perambalur',
    'Trichy Road Perambalur','Jayankondam','Gangaikondacholapuram','Arumbavur',
    'Veppur','Sirugambur','Esanai','Kurumbalur','Perambalur New Bus Stand',
    'Industrial Area Perambalur','Veppanthattai Town','Kunnam Town','Alathur Town'
  ],

  'Pudukkottai': [
    'Machuvadi','Rajagopalapuram','Alangudi','Aranthangi','Pudukkottai Town',
    'Thirumayam','Viralimalai','Karambakkudi','Gandarvakottai','Avudaiyarkoil',
    'Illupur','Natham Pudukkottai','Ponnamaravathi','Kiranur','Manamelkudi',
    'Mimisal','Kunnandarkoil','Pallathur','Keeramangalam','Pudukkottai Junction',
    'Trichy Road Pudukkottai','Madurai Road Pudukkottai','Alangudi Town',
    'Aranthangi Town','Karambakkudi Town','Viralimalai Town','Thirumayam Town'
  ],

  'Ramanathapuram': [
    'Rameswaram','Paramakudi','Mandapam','Ramanathapuram Town','Keelakarai',
    'Mudukulathur','Kamuthi','Thiruvadanai','Bogalur','Parthibanur','Sayalgudi',
    'Thiruppullani','Pamban','Arichamunai','Dhanushkodi','Tondi','Ervadi',
    'Valinokkam','Kilakkarai','Thondi','Uchipuli','Devipattinam',
    'Ramanathapuram New Town','Mandapam Camp','Ramanathapuram Harbour','Puliyoor',
    'Paramakudi Town','Mudukulathur Town','Kamuthi Town','Keelakarai Town'
  ],

  'Ranipet': [
    'Ranipet Town','Walaja','Arcot','Sholinghur','BHEL Ranipet','Melvisharam',
    'Naidupet','Vellore Road Ranipet','Chennai Road Ranipet','Kaveripakkam',
    'Timiri','Gudiyattam Road','Odugathur','Pernambut Ranipet',
    'Ranipet Industrial Area','Ranipet SIPCOT','Walajapet Town','Arcot Town',
    'Sholinghur Town','Melvisharam Town','Walaja Town','Naidupet Town'
  ],

  'Sivaganga': [
    'Karaikudi College Road','Sekkalai','Subramaniyapuram Sivaganga','Sivaganga Town',
    'Devakottai','Manamadurai','Tiruppattur','Kalaiyarkoil','Singampunari',
    'Ilayangudi','Sakkottai','Nattarasankottai','Sattur Road Sivaganga',
    'Ramanathapuram Road Sivaganga','Madurai Road Sivaganga','Sivaganga New Town',
    'Sivaganga Bus Stand Area','Sivaganga Collectorate','Poondi',
    'Devakottai Town','Manamadurai Town','Tiruppattur Sivaganga','Kalaiyarkoil Town',
    'Singampunari Town','Ilayangudi Town'
  ],

  'Karaikudi': [
    'College Road','Sekkalai','Subramaniyapuram Karaikudi','Kottaiyur','Alagappa Puram',
    'Devakottai Road','Karaikudi Town','Chettinadu Area','Alagappa University Area',
    'Kanadukathan','Pallathur Karaikudi','Virudhupatti','Kanakarai',
    'Karaikudi North','Karaikudi South','Karaikudi East','Karaikudi West'
  ],

  'Tenkasi': [
    'Tenkasi Town','Courtallam','Sankarankovil','Kadayanallur','Sengottai','Alangulam',
    'Puliyangudi','Veeravanallur','Panpozhil','Surandai','Pavoorchatram',
    'Tirunelveli Road Tenkasi','Kadayam','Shencottai','Tenkasi New Town',
    'Courtallam Waterfalls Road','Tenkasi Bus Stand','Sankarankovil Town',
    'Kadayanallur Town','Sengottai Town','Alangulam Town','Puliyangudi Town',
    'Veeravanallur Town','Surandai Town'
  ],

  'Tirupathur': [
    'Tirupathur Town','Vaniyambadi','Ambur','Jolarpet','Natrampalli','Kandili',
    'Pernambut Tirupathur','Tirupathur New Town','Ambur Town','Vaniyambadi Town',
    'Jolarpet Junction','Tirupathur Collectorate','Ambur Leather Area',
    'Jolarpet Railway Station','Vellore Road Tirupathur','Chennai Road Tirupathur',
    'Tirupathur North','Tirupathur South'
  ],

  'Kallakurichi': [
    'Kallakurichi Town','Ulundurpet','Sankarapuram','Tirukoilur','Chinnasalem',
    'Tindivanam Road Kallakurichi','Villupuram Road Kallakurichi',
    'Kallakurichi New Town','Tirukoilur Town','Ulundurpet Town',
    'Sankarapuram Town','Chinnasalem Town','Kallakurichi Bus Stand',
    'Kallakurichi Collectorate','Salem Road Kallakurichi','Cuddalore Road Kallakurichi'
  ],

  'Viluppuram': [
    'Viluppuram Town','Tindivanam','Gingee','Valavanur','Vikravandi','Mailam',
    'Kallakurichi Road Viluppuram','Cuddalore Road Viluppuram',
    'Trichy Road Viluppuram','Chennai Road Viluppuram','Thiruvennainallur',
    'Vanur','Mundiyampakkam','Marakkanam','Karikal Road','Pondicherry Road',
    'Viluppuram Junction','Viluppuram New Town','SIDCO Viluppuram',
    'Puducherry Bypass','Melmaruvathur','Auroville Border','Tindivanam Town',
    'Gingee Town','Vikravandi Town','Mailam Town'
  ],

  'Virudhunagar': [
    'Sivakasi Town','Rajapalayam','Srivilliputhur','Aruppukkottai',
    'Virudhunagar Collectorate','Sattur','Watrap','Tiruttangal','Kariapatti',
    'Eral Road Virudhunagar','Madurai Road Virudhunagar',
    'Tirunelveli Road Virudhunagar','Virudhunagar Town','Virudhunagar Junction',
    'Sivakasi SIPCOT','Rajapalayam Town','Srivilliputhur Town',
    'Aruppukkottai Town','Sattur Town','Watrap Town','Tiruttangal Town',
    'Kariapatti Town','Virudhunagar North','Virudhunagar South'
  ],

  'Sivakasi': [
    'Vilampatti Road','Satchiyapuram','Thiruthangal','Paraipatti','Palaniandavar Colony',
    'Sivakasi Town','Sivakasi North','Sivakasi South','Vettaiyan Koil Area',
    'Fireworks Factory Area','Rajapalayam Road Sivakasi','Aruppukottai Road Sivakasi',
    'Virudhunagar Road Sivakasi','Sivakasi East','Sivakasi West'
  ],

  'Theni': [
    'Periyakulam','Bodinayakanur','Cumbum','Allinagaram','Theni Old Bus Stand',
    'Chinnamanur','Uthamapalayam','Kambam','Gudalur Theni','Theni Town','Andipatti',
    'Rajakumari','Suruli Falls Road','Thekkady Road','Madurai Road Theni',
    'Dindigul Road Theni','Theni New Bus Stand','Theni Collectorate',
    'Komaralingam','Vanchimaniyachi','Kumily Road','Bodi','Cumbum Valley',
    'Periyakulam Town','Bodinayakanur Town','Cumbum Town','Uthamapalayam Town',
    'Kambam Town','Andipatti Town','Chinnamanur Town'
  ],

  'Nagapattinam': [
    'Velankanni','Nagore','Vedaranyam','Nagapattinam Port Area','Kilvelur',
    'Nagapattinam Town','Sirkali','Kollidam Nagapattinam','Thirumullaivasal',
    'Poompuhar','Karaikal Road Nagapattinam','Thanjavur Road Nagapattinam',
    'Thirumarugal','Nagore Town','Velankanni Church Area','Akkaraipettai',
    'Keechankuppam','Thopputhurai','Nagapattinam Beach','Nagapattinam Bus Stand',
    'Nagapattinam New Town','Sirkali Town','Vedaranyam Town','Kilvelur Town'
  ],

  'Mayiladuthurai': [
    'Kaveri Nagar','Pattamangala Street','Sirkazhi','Tharangambadi','Kuthalam',
    'Mayiladuthurai Town','Kumbakonam Road Mayiladuthurai','Sirkazhi Town',
    'Tharangambadi Beach','Poompuhar Road','Nagapattinam Road Mayiladuthurai',
    'Thanjavur Road Mayiladuthurai','Mayiladuthurai Junction','Mayiladuthurai New Town',
    'Thirumullaivasal Road Mayiladuthurai','Kollidam River Area',
    'Kuthalam Town','Tharangambadi Town'
  ],

  'Tiruvarur': [
    'Mannargudi','Thiruthuraipoondi','Kudavasal','Tiruvarur Town','Needamangalam',
    'Papanasam Road Tiruvarur','Thiruthuraipoondi Town','Mannargudi Town',
    'Nagapattinam Road Tiruvarur','Thanjavur Road Tiruvarur','Tiruvarur Junction',
    'Tiruvarur Bus Stand','Kottur Tiruvarur','Valangaiman','Muthupet',
    'Tiruvarur New Town','Tiruvarur Collectorate','Mannargudi SIPCOT',
    'Needamangalam Town','Valangaiman Town','Muthupet Town'
  ],

  'Tiruvannamalai': [
    'Girivalam Road','Polur Road','Chengam Road','Tindivanam Road Tiruvannamalai',
    'Arani','Cheyyar','Tiruvannamalai Town','Venbakkam','Thandrampet',
    'Jamunamarathur','Kalasapakkam','Vandavasi','Arcot Road Tiruvannamalai',
    'Vellore Road Tiruvannamalai','Arulmigu Arunachaleswarar Temple Area',
    'Tiruvannamalai New Town','Tiruvannamalai Collectorate','Polur Town',
    'Arani Town','Cheyyar Town','Chengam Town','Adaiyapathu',
    'Mangalam Tiruvannamalai','Thellar','Chetpet Tiruvannamalai',
    'Tiruvannamalai Bus Stand','Ponnur','Vandavasi Town','Kalasapakkam Town',
    'Thandrampet Town','Jamunamarathur Town'
  ],

  'Ariyalur': [
    'Ariyalur Town','Jayankondam','Sendurai','Udayarpalayam','Andimadam',
    'Ariyalur New Town','Cement Corporation Area','Trichy Road Ariyalur',
    'Perambalur Road Ariyalur','Jayankondam Town','Sendurai Town',
    'Udayarpalayam Town','Andimadam Town','T Palur','Ariyalur Junction',
    'Ariyalur Bus Stand','Ariyalur Collectorate'
  ],
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
export function searchTamilNaduLocations(query, preferredCity = '', limit = 50) {
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

  // 1. Exact city name match (starts with)
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

  // 1b. Partial city name match (includes but not starts with)
  TAMIL_NADU_CITIES.forEach(city => {
    const cityLower = city.toLowerCase();
    if (!cityLower.startsWith(cleanQuery) && cityLower.includes(cleanQuery)) {
      const key = `city:${city}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          locality: '',
          city,
          label: `${city}, Tamil Nadu`,
          type: 'city',
          score: 75
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
