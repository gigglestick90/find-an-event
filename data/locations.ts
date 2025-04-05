// data/locations.ts

// Define the structure for a location
export interface LocationData {
  id: string;
  name: string;
  category: 'Restaurant' | 'Hiking' | 'Games' | 'Museum' | 'Sports' | 'Shopping' | 'Park' | 'Entertainment'; // Expanded categories
  coordinates: { lat: number; lng: number };
  description?: string;
  neighborhood?: string; // Optional: Add more details like neighborhood
  website?: string; // Optional: Add website URL
}

// Array of location data
export const allLocations: LocationData[] = [
  // RESTAURANTS
  { id: 'r1', name: 'Kaya', category: 'Restaurant', coordinates: { lat: 40.4519, lng: -79.9836 }, neighborhood: 'Strip District', description: 'Caribbean-inspired cuisine.' },
  { id: 'r2', name: 'Morcilla', category: 'Restaurant', coordinates: { lat: 40.4652, lng: -79.9529 }, neighborhood: 'Lawrenceville', description: 'Spanish tapas and small plates.' },
  { id: 'r3', name: 'Apteka', category: 'Restaurant', coordinates: { lat: 40.4637, lng: -79.9473 }, neighborhood: 'Bloomfield', description: 'Central & Eastern European vegan.' },
  { id: 'r5', name: 'Pamela\'s Diner', category: 'Restaurant', coordinates: { lat: 40.4524, lng: -79.9823 }, neighborhood: 'Strip District', description: 'Famous for breakfast crepe-hotcakes.' },
  { id: 'r6', name: 'Meat & Potatoes', category: 'Restaurant', coordinates: { lat: 40.4428, lng: -79.9981 }, neighborhood: 'Downtown', description: 'Gastropub focusing on meat dishes.' },
  { id: 'r7', name: 'Gaucho Parrilla Argentina', category: 'Restaurant', coordinates: { lat: 40.4424, lng: -79.9989 }, neighborhood: 'Downtown', description: 'Argentinean wood-fired grill.' },
  { id: 'r8', name: 'Pusadee\'s Garden', category: 'Restaurant', coordinates: { lat: 40.4711, lng: -79.9557 }, neighborhood: 'Lawrenceville', description: 'High-end Thai restaurant with beautiful garden setting.' },
  { id: 'r9', name: 'Fet-Fisk', category: 'Restaurant', coordinates: { lat: 40.4633, lng: -79.9431 }, neighborhood: 'Bloomfield', description: 'Scandinavian-inspired seafood and Nordic cuisine.' },
  { id: 'r10', name: 'Fig & Ash', category: 'Restaurant', coordinates: { lat: 40.4567, lng: -80.0085 }, neighborhood: 'North Side', description: 'Wood-fired farm-to-table cooking.' },
  { id: 'r11', name: 'Gi-Jin', category: 'Restaurant', coordinates: { lat: 40.4429, lng: -79.9986 }, neighborhood: 'Downtown', description: 'Gin and raw bar focused on sushi hand rolls.' },
  { id: 'r12', name: 'The Parlor Dim Sum', category: 'Restaurant', coordinates: { lat: 40.4664, lng: -79.9611 }, neighborhood: 'Lawrenceville', description: 'Cantonese dim sum with inventive cocktails.' },
  { id: 'r13', name: 'Yaba\'s', category: 'Restaurant', coordinates: { lat: 40.4445, lng: -79.9868 }, neighborhood: 'Uptown', description: 'Mediterranean and Middle Eastern cuisine with homemade recipes.' },
  { id: 'r14', name: 'Grand Concourse', category: 'Restaurant', coordinates: { lat: 40.4336, lng: -80.0039 }, neighborhood: 'Station Square', description: 'Seafood restaurant in a historic train station with stunning architecture.' },
  { id: 'r16', name: 'Balvanera', category: 'Restaurant', coordinates: { lat: 40.4502, lng: -79.9898 }, neighborhood: 'Strip District', description: 'Argentinian cuisine featuring small plates and homemade sausages.' }, // Note: Neighborhood updated based on address
  { id: 'r17', name: 'Casbah', category: 'Restaurant', coordinates: { lat: 40.4524, lng: -79.9342 }, neighborhood: 'Shadyside', description: 'Mediterranean-inspired cuisine with seasonal menu.' },
  { id: 'r18', name: 'Eleven', category: 'Restaurant', coordinates: { lat: 40.4523, lng: -79.9846 }, neighborhood: 'Strip District', description: 'Upscale fine dining with contemporary American cuisine.' },
  { id: 'r19', name: 'Altius', category: 'Restaurant', coordinates: { lat: 40.4382, lng: -80.0210 }, neighborhood: 'Mt. Washington', description: 'Modern American cuisine with spectacular city views.' },

  // HIKING
  { id: 'h1', name: 'Frick Park Trailhead (Forbes & Braddock)', category: 'Hiking', coordinates: { lat: 40.4387, lng: -79.9019 }, description: 'Large city park with extensive trails.' },
  { id: 'h3', name: 'Three Rivers Heritage Trail (North Shore)', category: 'Hiking', coordinates: { lat: 40.4464, lng: -80.0041 }, description: 'Paved riverfront trail access near PNC Park.' },
  { id: 'h4', name: 'Point State Park', category: 'Hiking', coordinates: { lat: 40.4417, lng: -80.0084 }, description: 'Historic park at the confluence.' }, // Note: Also GAP Terminus
  { id: 'h5', name: 'Riverview Park', category: 'Hiking', coordinates: { lat: 40.4812, lng: -80.0110 }, description: 'Wooded trails and observatory (Observatory area coords).' },
  { id: 'h6', name: 'Montour Trail', category: 'Hiking', coordinates: { lat: 40.4350, lng: -80.2899 }, description: '60+ mile trail (Boggs Trailhead near Imperial coords).' },
  { id: 'h7', name: 'Great Allegheny Passage (Downtown Trailhead)', category: 'Hiking', coordinates: { lat: 40.4355, lng: -79.9981 }, description: '150-mile trail connecting to Washington DC (First Ave T-Station access coords).' },
  { id: 'h8', name: 'Fall Run Park', category: 'Hiking', coordinates: { lat: 40.5305, lng: -79.9479 }, neighborhood: 'Glenshaw', description: '94-acre park with beautiful waterfall trail (Lower parking coords).' },
  { id: 'h9', name: 'Raccoon Creek State Park', category: 'Hiking', coordinates: { lat: 40.5035, lng: -80.4247 }, neighborhood: 'Hookstown', description: 'Multiple trails with lake, waterfall, and forest scenery (Park Office coords).' },
  { id: 'h10', name: 'Rachel Carson Trail', category: 'Hiking', coordinates: { lat: 40.5841, lng: -79.8696 }, description: '46-mile challenging trail through rugged terrain (Near Emmerling Park coords).' },
  { id: 'h11', name: 'South Side Park Trail', category: 'Hiking', coordinates: { lat: 40.4214, lng: -79.9783 }, neighborhood: 'South Side Slopes', description: 'Urban trail with great city skyline views (Near Bandi Schaum entrance coords).' },
  { id: 'h12', name: 'North Park Lake Trail', category: 'Hiking', coordinates: { lat: 40.5970, lng: -80.0130 }, description: 'Scenic trail circling the lake with diverse landscapes (Near Boathouse coords).' },
  { id: 'h13', name: 'Beechwood Farms Nature Reserve', category: 'Hiking', coordinates: { lat: 40.5431, lng: -79.9052 }, neighborhood: 'Fox Chapel', description: '134-acre nature reserve with bird watching opportunities (Main entrance coords).' },
  { id: 'h14', name: 'Boyce Mayview Park', category: 'Hiking', coordinates: { lat: 40.3370, lng: -80.0900 }, neighborhood: 'Upper St. Clair', description: '475-acre park with paved and rugged trails (Near Community Center coords).' },
  { id: 'h15', name: 'Montour Woods', category: 'Hiking', coordinates: { lat: 40.4916, lng: -80.1510 }, neighborhood: 'Moon', description: '300-acre park on former Nike Missile site with scenic trails (Hassam Rd Parking coords).' },

  // GAMES
  { id: 'g1', name: 'Kickback Pinball Cafe', category: 'Games', coordinates: { lat: 40.4641, lng: -79.9517 }, neighborhood: 'Lawrenceville', description: 'Pinball, coffee, snacks.' },
  { id: 'g2', name: 'Victory Pointe Arcade', category: 'Games', coordinates: { lat: 40.4286, lng: -79.9898 }, neighborhood: 'South Side', description: 'Arcade games and bar.' },
  { id: 'g3', name: 'Coop De Ville', category: 'Games', coordinates: { lat: 40.4560, lng: -79.9807 }, neighborhood: 'Strip District', description: 'Restaurant with classic arcade games & duckpin bowling.' }, // Updated coords
  { id: 'g4', name: 'Dragon\'s Roast Cafe', category: 'Games', coordinates: { lat: 40.4365, lng: -79.9229 }, neighborhood: 'Squirrel Hill', description: 'Board game cafe.' }, // Updated coords
  { id: 'g5', name: 'Barcadia', category: 'Games', coordinates: { lat: 40.4408, lng: -80.0004 }, neighborhood: 'Downtown', description: 'Bar with retro arcade games. (Note: May be permanently closed)' }, // Updated coords
  { id: 'g6', name: 'Shorty\'s Pins x Pints', category: 'Games', coordinates: { lat: 40.4462, lng: -80.0116 }, neighborhood: 'North Shore', description: 'Duckpin bowling, pinball, arcade games, and outdoor games.' }, // Updated coords
  { id: 'g7', name: 'Helicon Brewing', category: 'Games', coordinates: { lat: 40.4165, lng: -80.1792 }, neighborhood: 'Oakdale', description: 'Brewery featuring over 40 pinball machines.' }, // Updated coords
  { id: 'g8', name: 'Pins Mechanical Co.', category: 'Games', coordinates: { lat: 40.4290, lng: -79.9719 }, neighborhood: 'South Side Works', description: 'Large arcade with duckpin bowling, ping pong, and multiple bars.' }, // Updated coords
  { id: 'g9', name: 'Games N\' At', category: 'Games', coordinates: { lat: 40.4271, lng: -79.9650 }, neighborhood: 'South Side Flats', description: 'Retro arcade and BYOB spot with classic games. (Note: Permanently closed)' },
  { id: 'g10', name: 'Lili Coffee Shop', category: 'Games', coordinates: { lat: 40.4576, lng: -79.9700 }, neighborhood: 'Polish Hill', description: 'Coffee shop with board games.' }, // Updated coords
  { id: 'g11', name: 'Pittsburgh Pinball Dojo', category: 'Games', coordinates: { lat: 40.4968, lng: -80.0597 }, neighborhood: 'Bellevue', description: 'BYOB pinball venue with free play machines spanning eight decades.' }, // Updated coords & address
  { id: 'g12', name: 'Phantom of the Attic Games', category: 'Games', coordinates: { lat: 40.4458, lng: -79.9442 }, neighborhood: 'Oakland', description: 'Game store with board games, RPGs, and card games.' },
  { id: 'g13', name: 'Zone 28', category: 'Games', coordinates: { lat: 40.5438, lng: -79.7755 }, neighborhood: 'Harmarville', description: 'Entertainment complex with bowling, arcade games, and laser tag.' }, // Updated coords
  { id: 'g14', name: 'Rezzanine Esports Lounge', category: 'Games', coordinates: { lat: 40.3586, lng: -80.1153 }, neighborhood: 'Bridgeville', description: 'Gaming lounge with PC and console games, plus classic arcade games.' }, // Updated coords
  { id: 'g15', name: 'Ace\'s Breakaway and Play', category: 'Games', coordinates: { lat: 40.4740, lng: -80.1610 }, neighborhood: 'Robinson', description: 'Mall arcade with classic and modern games (in The Mall at Robinson).' }, // Updated coords

  // MUSEUMS
  { id: 'm1', name: 'The Andy Warhol Museum', category: 'Museum', coordinates: { lat: 40.4486, lng: -80.0015 }, neighborhood: 'North Shore', description: 'Largest museum dedicated to a single artist in North America, showcasing Warhol\'s art and archives.' },
  { id: 'm2', name: 'Carnegie Museum of Art', category: 'Museum', coordinates: { lat: 40.4433, lng: -79.9492 }, neighborhood: 'Oakland', description: 'Major art museum with collections spanning from the Old Masters to contemporary art.' },
  { id: 'm3', name: 'Carnegie Museum of Natural History', category: 'Museum', coordinates: { lat: 40.4433, lng: -79.9492 }, neighborhood: 'Oakland', description: 'Natural history museum featuring dinosaur exhibits and gems.' },
  { id: 'm4', name: 'Heinz History Center', category: 'Museum', coordinates: { lat: 40.4466, lng: -79.9923 }, neighborhood: 'Strip District', description: 'Smithsonian-affiliated museum showcasing Western Pennsylvania history.' },
  { id: 'm5', name: 'Mattress Factory', category: 'Museum', coordinates: { lat: 40.4573, lng: -80.0100 }, neighborhood: 'North Side', description: 'Contemporary art museum specializing in site-specific installations.' },
  { id: 'm6', name: 'Phipps Conservatory and Botanical Gardens', category: 'Museum', coordinates: { lat: 40.4389, lng: -79.9481 }, neighborhood: 'Oakland', description: 'Historic glass conservatory with seasonal flower shows and gardens.' },
  { id: 'm8', name: 'Carnegie Science Center', category: 'Museum', coordinates: { lat: 40.4465, lng: -80.0182 }, neighborhood: 'North Shore', description: 'Interactive science museum with planetarium and submarine.' },
  { id: 'm9', name: 'Moonshot Museum', category: 'Museum', coordinates: { lat: 40.4561, lng: -80.0125 }, neighborhood: 'North Side', description: 'Space-themed museum featuring spacecraft assembly and lunar mission simulations.' },
  { id: 'm10', name: 'The Frick Pittsburgh', category: 'Museum', coordinates: { lat: 40.4419, lng: -79.9017 }, neighborhood: 'Point Breeze', description: 'Art collection, historic home, and car museum on a 5.5-acre estate.' },
  { id: 'm13', name: 'Fort Pitt Museum', category: 'Museum', coordinates: { lat: 40.4412, lng: -80.0108 }, neighborhood: 'Point State Park', description: 'Historical museum focused on Western PA\'s role in the French and Indian War and American Revolution.' },
  { id: 'm15', name: 'Roberto Clemente Museum', category: 'Museum', coordinates: { lat: 40.4712, lng: -79.9615 }, neighborhood: 'Lawrenceville', description: 'Museum dedicated to the Pirates baseball legend in a restored firehouse.' },

  // SPORTS VENUES
  { id: 's1', name: 'PNC Park', category: 'Sports', coordinates: { lat: 40.4469, lng: -80.0058 }, neighborhood: 'North Shore', description: 'Home of the Pittsburgh Pirates baseball team with stunning city views.' }, // Updated coords
  { id: 's2', name: 'Acrisure Stadium', category: 'Sports', coordinates: { lat: 40.4468, lng: -80.0158 }, neighborhood: 'North Shore', description: 'Home of the Pittsburgh Steelers football team.' }, // Kept adjusted coords
  { id: 's3', name: 'PPG Paints Arena', category: 'Sports', coordinates: { lat: 40.4394, lng: -79.9892 }, neighborhood: 'Downtown', description: 'Home of the Pittsburgh Penguins hockey team.' }, // Updated coords
  { id: 's4', name: 'Highmark Stadium', category: 'Sports', coordinates: { lat: 40.4361, lng: -80.0094 }, neighborhood: 'Station Square', description: 'Home of the Pittsburgh Riverhounds soccer team, with riverfront views.' }, // Updated coords
  { id: 's5', name: 'Petersen Events Center', category: 'Sports', coordinates: { lat: 40.4438, lng: -79.9623 }, neighborhood: 'Oakland', description: 'University of Pittsburgh basketball arena.' }, // Updated coords

  // SHOPPING
  { id: 'sh1', name: 'Strip District Marketplace', category: 'Shopping', coordinates: { lat: 40.4518, lng: -79.9835 }, neighborhood: 'Strip District', description: 'Historic market district with international grocers, specialty shops, and street vendors.' },
  { id: 'sh2', name: 'Market Square', category: 'Shopping', coordinates: { lat: 40.4409, lng: -80.0004 }, neighborhood: 'Downtown', description: 'Historic square in downtown with restaurants, shops, and outdoor events.' }, // Updated coords
  { id: 'sh3', name: 'The Terminal', category: 'Shopping', coordinates: { lat: 40.4495, lng: -79.9865 }, neighborhood: 'Strip District', description: 'Renovated historic produce terminal with shops, restaurants, and entertainment.' }, // Updated coords
  { id: 'sh4', name: 'Shadyside Shopping District', category: 'Shopping', coordinates: { lat: 40.4518, lng: -79.9344 }, neighborhood: 'Shadyside', description: 'Upscale shopping area with boutiques, galleries, and restaurants along Walnut Street.' },
  { id: 'sh5', name: 'South Side Works', category: 'Shopping', coordinates: { lat: 40.4289, lng: -79.9721 }, neighborhood: 'South Side', description: 'Riverside shopping and entertainment complex with stores, restaurants, and a cinema.' }, // Updated coords
  { id: 'sh6', name: 'Station Square', category: 'Shopping', coordinates: { lat: 40.4335, lng: -80.0035 }, neighborhood: 'South Shore', description: '52-acre riverfront complex with restaurants, shopping, and entertainment.' }, // Updated coords

  // PARKS
  { id: 'p1', name: 'Point State Park', category: 'Park', coordinates: { lat: 40.4417, lng: -80.0084 }, neighborhood: 'Downtown', description: 'Historic park at the confluence of the three rivers with a 150-foot fountain.' },
  { id: 'p2', name: 'Frick Park', category: 'Park', coordinates: { lat: 40.4375, lng: -79.9020 }, neighborhood: 'Point Breeze/Squirrel Hill', description: 'Pittsburgh\'s largest municipal park, featuring woodland trails and wildlife.' },
  { id: 'p3', name: 'Schenley Park', category: 'Park', coordinates: { lat: 40.4390, lng: -79.9453 }, neighborhood: 'Oakland', description: 'Historic 456-acre park with trails, golf course, and ice skating rink.' },
  { id: 'p4', name: 'Highland Park', category: 'Park', coordinates: { lat: 40.4820, lng: -79.9133 }, neighborhood: 'Highland Park', description: 'Victorian-era park featuring the Pittsburgh Zoo and reservoir with walking track.' },
  { id: 'p5', name: 'Riverview Park', category: 'Park', coordinates: { lat: 40.4812, lng: -80.0110 }, neighborhood: 'Observatory Hill', description: '259-acre wooded park featuring the Allegheny Observatory.' }, // Kept updated coords from h5
  { id: 'p6', name: 'Mellon Park', category: 'Park', coordinates: { lat: 40.4544, lng: -79.9185 }, neighborhood: 'Shadyside', description: 'Historic park with gardens, tennis courts, and cultural events.' },
  { id: 'p7', name: 'North Park', category: 'Park', coordinates: { lat: 40.5955, lng: -80.0168 }, neighborhood: 'McCandless', description: 'Allegheny County\'s largest park with lake, pool, and nature center.' },
  { id: 'p8', name: 'South Park', category: 'Park', coordinates: { lat: 40.3006, lng: -79.9979 }, neighborhood: 'South Park Township', description: '2,013-acre park with wave pool, golf course, and ice rink.' },

  // ENTERTAINMENT
  { id: 'e4', name: 'Pittsburgh Public Theater', category: 'Entertainment', coordinates: { lat: 40.4425, lng: -79.9987 }, neighborhood: 'Cultural District', description: 'Professional theater company in the O\'Reilly Theater.' },
  { id: 'e5', name: 'Kelly Strayhorn Theater', category: 'Entertainment', coordinates: { lat: 40.4653, lng: -79.9293 }, neighborhood: 'East Liberty', description: 'Community performing arts theater with diverse programming.' },
  { id: 'e6', name: 'Duquesne Incline', category: 'Entertainment', coordinates: { lat: 40.4386, lng: -80.0185 }, neighborhood: 'Mt. Washington', description: 'Historic cable car offering panoramic views of the Pittsburgh skyline.' },
  { id: 'e7', name: 'National Aviary', category: 'Entertainment', coordinates: { lat: 40.4535, lng: -80.0099 }, neighborhood: 'North Side', description: 'Nation\'s largest aviary, home to over 500 birds from around the world.' },
  { id: 'e8', name: 'Pittsburgh Zoo & PPG Aquarium', category: 'Entertainment', coordinates: { lat: 40.4854, lng: -79.9134 }, neighborhood: 'Highland Park', description: 'Zoo and aquarium with over 8,000 animals of 600 species.' },
  { id: 'e9', name: 'Kennywood Park', category: 'Entertainment', coordinates: { lat: 40.3870, lng: -79.8640 }, neighborhood: 'West Mifflin', description: 'Historic amusement park with classic and modern rides.' }, // Updated coords
  { id: 'e10', name: 'Rivers Casino', category: 'Entertainment', coordinates: { lat: 40.4467, lng: -80.0165 }, neighborhood: 'North Shore', description: 'Riverfront casino with slots, table games, and restaurants.' }
];