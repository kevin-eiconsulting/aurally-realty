import { pool } from '../config/db.js';

// ─────────────────────────────────────────────
// PRODUCT DATA: 26 subcategories × ~6 products each (~156 total)
// ─────────────────────────────────────────────

const MATERIAL_SUBCATEGORIES = [
  {
    name: 'Cement',
    slug: 'cement',
    products: [
      { name: 'UltraTech OPC 43 Grade Cement', brand: 'UltraTech', unit: 'Bag (50 kg)', grade: 'OPC 43', hsn_code: '2523', pack_size: '50 kg', moq: '10 Bags', is_bis_standard: 'IS 8112' },
      { name: 'Ambuja OPC 53 Grade Cement', brand: 'Ambuja', unit: 'Bag (50 kg)', grade: 'OPC 53', hsn_code: '2523', pack_size: '50 kg', moq: '10 Bags', is_bis_standard: 'IS 12269' },
      { name: 'ACC PPC Fly Ash Blended Cement', brand: 'ACC', unit: 'Bag (50 kg)', grade: 'PPC', hsn_code: '2523', pack_size: '50 kg', moq: '10 Bags', is_bis_standard: 'IS 1489' },
      { name: 'Birla White Cement', brand: 'Birla White', unit: 'Bag (25 kg)', grade: 'White Cement', hsn_code: '2523', pack_size: '25 kg', moq: '5 Bags', is_bis_standard: 'IS 8042' },
      { name: 'Rapid Hardening Cement RHC', brand: 'Standard', unit: 'Bag (50 kg)', grade: 'RHC', hsn_code: '2523', pack_size: '50 kg', moq: '10 Bags', is_bis_standard: 'IS 8041' },
      { name: 'Sulphate Resistant Cement SRC', brand: 'Standard', unit: 'Bag (50 kg)', grade: 'SRC', hsn_code: '2523', pack_size: '50 kg', moq: '10 Bags', is_bis_standard: 'IS 12330' },
    ]
  },
  {
    name: 'Steel & Rebar',
    slug: 'steel-rebar',
    products: [
      { name: 'TMT Fe500D Rebar 8mm', brand: 'TATA Tiscon', unit: 'MT', grade: 'Fe500D', hsn_code: '7214', pack_size: '1 MT', moq: '1 MT', is_bis_standard: 'IS 1786' },
      { name: 'TMT Fe500D Rebar 12mm', brand: 'TATA Tiscon', unit: 'MT', grade: 'Fe500D', hsn_code: '7214', pack_size: '1 MT', moq: '1 MT', is_bis_standard: 'IS 1786' },
      { name: 'TMT Fe550D Rebar 16mm', brand: 'JSW Neosteel', unit: 'MT', grade: 'Fe550D', hsn_code: '7214', pack_size: '1 MT', moq: '1 MT', is_bis_standard: 'IS 1786' },
      { name: 'Mild Steel Flat Bar 50x6mm', brand: 'Standard', unit: 'MT', grade: 'MS Flat', hsn_code: '7216', pack_size: '1 MT', moq: '500 kg', is_bis_standard: 'IS 2062' },
      { name: 'Galvanized Binding Wire 18 Gauge', brand: 'Standard', unit: 'kg', grade: 'GI Wire', hsn_code: '7217', pack_size: '25 kg', moq: '25 kg', is_bis_standard: 'IS 280' },
      { name: 'Structural Steel ISA Angle 50x50x5mm', brand: 'Standard', unit: 'MT', grade: 'Structural', hsn_code: '7216', pack_size: '1 MT', moq: '1 MT', is_bis_standard: 'IS 808' },
    ]
  },
  {
    name: 'Bricks & Blocks',
    slug: 'bricks-blocks',
    products: [
      { name: 'Red Clay Bricks Modular 190x90x90mm', brand: 'Local Kiln', unit: 'Nos', grade: 'Standard', hsn_code: '6901', pack_size: '1000 Nos', moq: '500 Nos', is_bis_standard: 'IS 1077' },
      { name: 'Fly Ash Bricks Class B', brand: 'Standard', unit: 'Nos', grade: 'Class B', hsn_code: '6901', pack_size: '1000 Nos', moq: '500 Nos', is_bis_standard: 'IS 12894' },
      { name: 'AAC Blocks 600x200x200mm', brand: 'Siporex', unit: 'Cubic Metre', grade: 'D550 Grade', hsn_code: '6803', pack_size: '1 CBM', moq: '2 CBM', is_bis_standard: 'IS 2185' },
      { name: 'Hollow Concrete Blocks 400x200x200mm', brand: 'Standard', unit: 'Nos', grade: 'Grade A', hsn_code: '6810', pack_size: '100 Nos', moq: '100 Nos', is_bis_standard: 'IS 2185' },
      { name: 'Solid Concrete Blocks 400x200x150mm', brand: 'Standard', unit: 'Nos', grade: 'M5 Mix', hsn_code: '6810', pack_size: '100 Nos', moq: '100 Nos', is_bis_standard: 'IS 2185' },
      { name: 'CLC Cellular Lightweight Blocks 600x200x200mm', brand: 'Standard', unit: 'Cubic Metre', grade: 'D800', hsn_code: '6803', pack_size: '1 CBM', moq: '2 CBM', is_bis_standard: 'IS 2185' },
    ]
  },
  {
    name: 'Sand & Aggregates',
    slug: 'sand-aggregates',
    products: [
      { name: 'Manufactured M-Sand Fine Aggregate Zone II', brand: 'Standard', unit: 'Cubic Foot', grade: 'Zone II', hsn_code: '2505', pack_size: '1 CFT', moq: '100 CFT', is_bis_standard: 'IS 383' },
      { name: 'P-Sand Plastering Sand Fine', brand: 'Standard', unit: 'Cubic Foot', grade: 'Fine', hsn_code: '2505', pack_size: '1 CFT', moq: '50 CFT', is_bis_standard: 'IS 383' },
      { name: '20mm Crushed Stone Aggregate', brand: 'Standard', unit: 'Cubic Foot', grade: '20mm', hsn_code: '2517', pack_size: '1 CFT', moq: '100 CFT', is_bis_standard: 'IS 383' },
      { name: '40mm Blue Metal Jelly Aggregate', brand: 'Standard', unit: 'Cubic Foot', grade: '40mm', hsn_code: '2517', pack_size: '1 CFT', moq: '100 CFT', is_bis_standard: 'IS 383' },
      { name: 'River Sand Natural Fine Aggregate', brand: 'Standard', unit: 'Cubic Foot', grade: 'Natural', hsn_code: '2505', pack_size: '1 CFT', moq: '200 CFT', is_bis_standard: 'IS 383' },
      { name: '6mm Stone Chips Fine Aggregate', brand: 'Standard', unit: 'Cubic Foot', grade: '6mm', hsn_code: '2517', pack_size: '1 CFT', moq: '50 CFT', is_bis_standard: 'IS 383' },
    ]
  },
  {
    name: 'RMC & Concrete',
    slug: 'rmc-concrete',
    products: [
      { name: 'Ready Mix Concrete M20 Grade', brand: 'UltraTech RMC', unit: 'Cubic Metre', grade: 'M20', hsn_code: '3824', pack_size: '1 CBM', moq: '5 CBM', is_bis_standard: 'IS 456' },
      { name: 'Ready Mix Concrete M25 Grade', brand: 'UltraTech RMC', unit: 'Cubic Metre', grade: 'M25', hsn_code: '3824', pack_size: '1 CBM', moq: '5 CBM', is_bis_standard: 'IS 456' },
      { name: 'Ready Mix Concrete M30 Grade', brand: 'ACC RMC', unit: 'Cubic Metre', grade: 'M30', hsn_code: '3824', pack_size: '1 CBM', moq: '5 CBM', is_bis_standard: 'IS 456' },
      { name: 'Ready Mix Concrete M35 Grade', brand: 'ACC RMC', unit: 'Cubic Metre', grade: 'M35', hsn_code: '3824', pack_size: '1 CBM', moq: '5 CBM', is_bis_standard: 'IS 456' },
      { name: 'Ready Mix Concrete M40 High Strength', brand: 'Standard', unit: 'Cubic Metre', grade: 'M40', hsn_code: '3824', pack_size: '1 CBM', moq: '5 CBM', is_bis_standard: 'IS 456' },
      { name: 'Precast Concrete Planks 2400x600x75mm', brand: 'Standard', unit: 'Nos', grade: 'Precast', hsn_code: '6810', pack_size: '1 Panel', moq: '10 Panels', is_bis_standard: 'IS 456' },
    ]
  },
  {
    name: 'Tiles & Flooring',
    slug: 'tiles-flooring',
    products: [
      { name: 'Double Charged Vitrified Tiles 600x600mm', brand: 'Kajaria', unit: 'Box (1.44 sqm)', grade: 'Double Charge', hsn_code: '6907', pack_size: '1.44 sqm', moq: '5 Boxes', is_bis_standard: 'IS 15622' },
      { name: 'Ceramic Wall Tiles 300x450mm Glossy', brand: 'Johnson', unit: 'Box (1.35 sqm)', grade: 'Glossy', hsn_code: '6907', pack_size: '1.35 sqm', moq: '5 Boxes', is_bis_standard: 'IS 13753' },
      { name: 'Polished Granite Slab Black Galaxy 20mm', brand: 'Standard', unit: 'sqft', grade: 'Polished', hsn_code: '6802', pack_size: '1 sqft', moq: '50 sqft', is_bis_standard: 'IS 3316' },
      { name: 'Kota Stone Flooring Natural 900x600x25mm', brand: 'Standard', unit: 'sqft', grade: 'Natural', hsn_code: '6802', pack_size: '1 sqft', moq: '50 sqft', is_bis_standard: 'N/A' },
      { name: 'Marble Slab Italian White Carrara 18mm', brand: 'Standard', unit: 'sqft', grade: 'Polished', hsn_code: '6802', pack_size: '1 sqft', moq: '50 sqft', is_bis_standard: 'N/A' },
      { name: 'Anti-Skid Floor Tiles 300x300mm Matte', brand: 'Kajaria', unit: 'Box (0.90 sqm)', grade: 'Anti-Skid', hsn_code: '6907', pack_size: '0.90 sqm', moq: '5 Boxes', is_bis_standard: 'IS 13630' },
    ]
  },
  {
    name: 'Paints & Finishes',
    slug: 'paints-finishes',
    products: [
      { name: 'Asian Paints Apex Exterior Emulsion 20L', brand: 'Asian Paints', unit: 'Bucket (20L)', grade: 'Exterior', hsn_code: '3210', pack_size: '20 Litres', moq: '1 Bucket', is_bis_standard: 'IS 15489' },
      { name: 'Berger Weathercoat All Guard Exterior Paint 10L', brand: 'Berger', unit: 'Bucket (10L)', grade: 'Exterior', hsn_code: '3210', pack_size: '10 Litres', moq: '1 Bucket', is_bis_standard: 'IS 15489' },
      { name: 'Asian Paints Tractor Emulsion Interior 20L', brand: 'Asian Paints', unit: 'Bucket (20L)', grade: 'Interior', hsn_code: '3210', pack_size: '20 Litres', moq: '1 Bucket', is_bis_standard: 'IS 15491' },
      { name: 'Alkyd Enamel Paint White 4L', brand: 'Nerolac', unit: 'Can (4L)', grade: 'Enamel', hsn_code: '3210', pack_size: '4 Litres', moq: '1 Can', is_bis_standard: 'IS 2932' },
      { name: 'Wall Primer Alkali Resistant 20L', brand: 'Asian Paints', unit: 'Bucket (20L)', grade: 'Primer', hsn_code: '3210', pack_size: '20 Litres', moq: '1 Bucket', is_bis_standard: 'IS 341' },
      { name: 'Textured Exterior Paint Sand Finish 25 kg', brand: 'Asian Paints', unit: 'Bag (25 kg)', grade: 'Textured', hsn_code: '3210', pack_size: '25 kg', moq: '1 Bag', is_bis_standard: 'N/A' },
    ]
  },
  {
    name: 'Wood & Boards',
    slug: 'wood-boards',
    products: [
      { name: 'Commercial Plywood BWR Grade 18mm 8x4ft', brand: 'Century Ply', unit: 'Sheet', grade: 'BWR', hsn_code: '4412', pack_size: '8x4 ft', moq: '10 Sheets', is_bis_standard: 'IS 303' },
      { name: 'Marine Grade Plywood BWP 12mm 8x4ft', brand: 'Kitply', unit: 'Sheet', grade: 'BWP', hsn_code: '4412', pack_size: '8x4 ft', moq: '10 Sheets', is_bis_standard: 'IS 710' },
      { name: 'MDF Board 18mm 8x4ft', brand: 'Greenlam', unit: 'Sheet', grade: 'MDF E2', hsn_code: '4411', pack_size: '8x4 ft', moq: '5 Sheets', is_bis_standard: 'IS 12823' },
      { name: 'Particle Board 12mm 8x4ft', brand: 'Duratuf', unit: 'Sheet', grade: 'P2 Grade', hsn_code: '4410', pack_size: '8x4 ft', moq: '5 Sheets', is_bis_standard: 'IS 12823' },
      { name: 'Block Board 19mm 8x4ft', brand: 'Century Ply', unit: 'Sheet', grade: 'Block Board', hsn_code: '4412', pack_size: '8x4 ft', moq: '5 Sheets', is_bis_standard: 'IS 1659' },
      { name: 'Teak Wood Square Timber 3x3 Inch', brand: 'Standard', unit: 'CFT', grade: 'Grade A Teak', hsn_code: '4403', pack_size: '1 CFT', moq: '5 CFT', is_bis_standard: 'N/A' },
    ]
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    products: [
      { name: 'CPVC Pipe 25mm 3m Hot & Cold Water', brand: 'Ashirvad', unit: 'Length (3m)', grade: 'CPVC SDR11', hsn_code: '3917', pack_size: '3 Metres', moq: '10 Pipes', is_bis_standard: 'IS 15778' },
      { name: 'uPVC Rigid Pipe 110mm 6m Underground', brand: 'Supreme', unit: 'Length (6m)', grade: 'SWR uPVC', hsn_code: '3917', pack_size: '6 Metres', moq: '5 Pipes', is_bis_standard: 'IS 4985' },
      { name: 'PVC Pressure Pipe 50mm Class IV 6m', brand: 'Finolex', unit: 'Length (6m)', grade: 'Class IV', hsn_code: '3917', pack_size: '6 Metres', moq: '5 Pipes', is_bis_standard: 'IS 4985' },
      { name: 'Plastic Ball Valve 25mm PN16', brand: 'Zoloto', unit: 'Nos', grade: 'PN16', hsn_code: '8481', pack_size: '1 Nos', moq: '5 Nos', is_bis_standard: 'IS 17141' },
      { name: 'HDPE Overhead Water Tank 1000L', brand: 'Sintex', unit: 'Nos', grade: '1000 Litre', hsn_code: '3926', pack_size: '1 Tank', moq: '1 Tank', is_bis_standard: 'IS 12701' },
      { name: 'GI Pipe 25mm Medium Class 6m', brand: 'Tata GI', unit: 'Length (6m)', grade: 'Medium Class', hsn_code: '7306', pack_size: '6 Metres', moq: '5 Pipes', is_bis_standard: 'IS 1239' },
    ]
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    products: [
      { name: 'FRLS Copper Wire 1.5 sq mm 90m', brand: 'Finolex', unit: 'Coil (90m)', grade: 'FRLS 1.5 sqmm', hsn_code: '8544', pack_size: '90 Metres', moq: '1 Coil', is_bis_standard: 'IS 694' },
      { name: 'FRLS Copper Wire 4 sq mm 90m', brand: 'Polycab', unit: 'Coil (90m)', grade: 'FRLS 4 sqmm', hsn_code: '8544', pack_size: '90 Metres', moq: '1 Coil', is_bis_standard: 'IS 694' },
      { name: 'PVC Electrical Conduit Pipe 20mm 3m', brand: 'Precision', unit: 'Length (3m)', grade: 'Light Duty', hsn_code: '3917', pack_size: '3 Metres', moq: '50 Pipes', is_bis_standard: 'IS 9537' },
      { name: 'MCB Single Pole 16A C-Curve', brand: 'Legrand', unit: 'Nos', grade: '16A C-Curve', hsn_code: '8536', pack_size: '1 Nos', moq: '10 Nos', is_bis_standard: 'IS 60898' },
      { name: 'Distribution Board 6-Way TPN 125A', brand: 'Schneider', unit: 'Nos', grade: '6W TPN', hsn_code: '8537', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'IS 8623' },
      { name: 'Modular Switch 6A 1-Way White', brand: 'Havells', unit: 'Nos', grade: '6A 1-Way', hsn_code: '8536', pack_size: '1 Nos', moq: '10 Nos', is_bis_standard: 'IS 3854' },
    ]
  },
  {
    name: 'Sanitaryware',
    slug: 'sanitaryware',
    products: [
      { name: 'Two-Piece EWC Western Toilet S-Trap White', brand: 'Cera', unit: 'Set', grade: 'Standard', hsn_code: '6910', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'IS 2556' },
      { name: 'Wall Hung WC Toilet Pan White', brand: 'Kohler', unit: 'Nos', grade: 'Wall Hung', hsn_code: '6910', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'IS 2556' },
      { name: 'Wash Basin Under Counter 500x400mm White', brand: 'Hindware', unit: 'Nos', grade: 'Under Counter', hsn_code: '6910', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'IS 2556' },
      { name: 'Pedestal Wash Basin 660x460mm White', brand: 'Parryware', unit: 'Set', grade: 'Pedestal', hsn_code: '6910', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'IS 2556' },
      { name: 'Urinal Flat Back Wall Hung White', brand: 'Cera', unit: 'Nos', grade: 'Standard', hsn_code: '6910', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'IS 2556' },
      { name: 'Flush Valve Exposed Piston Type 32mm', brand: 'Hindware', unit: 'Nos', grade: 'Piston Type', hsn_code: '8481', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'IS 6938' },
    ]
  },
  {
    name: 'Bath Fittings',
    slug: 'bath-fittings',
    products: [
      { name: 'Single Lever Basin Mixer Tap Chrome', brand: 'Jaquar', unit: 'Nos', grade: 'Chrome Finish', hsn_code: '8481', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'IS 8931' },
      { name: 'Overhead Rain Shower 300mm Square Chrome', brand: 'Kohler', unit: 'Nos', grade: 'Rain Shower', hsn_code: '8481', pack_size: '1 Set', moq: '1 Nos', is_bis_standard: 'IS 8931' },
      { name: 'Single Lever Bath Shower Mixer with Diverter', brand: 'Jaquar', unit: 'Set', grade: 'Diverter', hsn_code: '8481', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'IS 8931' },
      { name: 'Bib Cock 15mm Brass Quarter Turn', brand: 'Standard', unit: 'Nos', grade: 'Brass Body', hsn_code: '8481', pack_size: '1 Nos', moq: '5 Nos', is_bis_standard: 'IS 781' },
      { name: 'Health Faucet Spray Jet with Hose 1.5m', brand: 'Parryware', unit: 'Set', grade: 'Standard', hsn_code: '8481', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'N/A' },
      { name: 'Angle Valve 15mm Chrome Plated', brand: 'Standard', unit: 'Nos', grade: 'Chrome', hsn_code: '8481', pack_size: '1 Nos', moq: '5 Nos', is_bis_standard: 'IS 4038' },
    ]
  },
  {
    name: 'Sanitary Accessories',
    slug: 'sanitary-accessories',
    products: [
      { name: 'Stainless Steel Towel Rail 600mm SS 304', brand: 'Standard', unit: 'Nos', grade: 'SS 304', hsn_code: '7324', pack_size: '1 Nos', moq: '5 Nos', is_bis_standard: 'N/A' },
      { name: 'SS Soap Dish Wall Mounted SS 304', brand: 'Standard', unit: 'Nos', grade: 'SS 304', hsn_code: '7324', pack_size: '1 Nos', moq: '5 Nos', is_bis_standard: 'N/A' },
      { name: 'Toilet Paper Holder SS 304 Chrome', brand: 'Jaquar', unit: 'Nos', grade: 'SS 304', hsn_code: '7324', pack_size: '1 Nos', moq: '5 Nos', is_bis_standard: 'N/A' },
      { name: 'Robe Hook Double SS Wall Mounted', brand: 'Standard', unit: 'Nos', grade: 'SS 304', hsn_code: '7324', pack_size: '1 Nos', moq: '5 Nos', is_bis_standard: 'N/A' },
      { name: 'Vanity Mirror 600x900mm with Light', brand: 'Standard', unit: 'Nos', grade: 'Float Glass', hsn_code: '7009', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'N/A' },
      { name: 'Bathroom Glass Shelf 600mm Toughened', brand: 'Standard', unit: 'Nos', grade: 'Toughened', hsn_code: '7020', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'N/A' },
    ]
  },
  {
    name: 'Hardware',
    slug: 'hardware',
    products: [
      { name: 'Butt Hinge SS 304 100x75mm Pair', brand: 'Standard', unit: 'Pair', grade: 'SS 304', hsn_code: '8302', pack_size: '2 Pcs', moq: '10 Pair', is_bis_standard: 'IS 1341' },
      { name: 'Mortise Lock Set 60mm Brass Body', brand: 'Godrej', unit: 'Set', grade: 'Mortise', hsn_code: '8301', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'IS 2209' },
      { name: 'GI Wood Screw 75mm Self-Tapping 100pc', brand: 'Standard', unit: 'Box (100 Nos)', grade: 'GI', hsn_code: '7318', pack_size: '100 Nos', moq: '5 Boxes', is_bis_standard: 'IS 6761' },
      { name: 'Common Wire Nail 75mm 1 kg', brand: 'Standard', unit: 'kg', grade: 'Bright', hsn_code: '7317', pack_size: '1 kg', moq: '5 kg', is_bis_standard: 'IS 723' },
      { name: 'Tower Bolt SS 150mm', brand: 'Standard', unit: 'Nos', grade: 'SS 201', hsn_code: '8302', pack_size: '1 Nos', moq: '10 Nos', is_bis_standard: 'N/A' },
      { name: 'M10 Hex Bolt with Nut GI 50mm', brand: 'Standard', unit: 'Bag (50 Nos)', grade: 'Grade 4.8', hsn_code: '7318', pack_size: '50 Nos', moq: '5 Bags', is_bis_standard: 'IS 1364' },
    ]
  },
  {
    name: 'Tools',
    slug: 'tools',
    products: [
      { name: 'Steel Trowel Plastering 280mm', brand: 'Taparia', unit: 'Nos', grade: 'Carbon Steel', hsn_code: '8205', pack_size: '1 Nos', moq: '5 Nos', is_bis_standard: 'N/A' },
      { name: 'Spirit Level Aluminium 900mm Magnetic', brand: 'Stanley', unit: 'Nos', grade: '3-Vial', hsn_code: '9017', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'N/A' },
      { name: 'Sledge Hammer 3 kg Fibreglass Handle', brand: 'Taparia', unit: 'Nos', grade: 'Drop Forged', hsn_code: '8205', pack_size: '1 Nos', moq: '2 Nos', is_bis_standard: 'IS 1891' },
      { name: 'Cordless Drill Driver 18V 2-Speed', brand: 'Bosch', unit: 'Set', grade: '18V Li-Ion', hsn_code: '8467', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'N/A' },
      { name: 'SDS Plus Rotary Hammer Drill 800W', brand: 'Bosch', unit: 'Nos', grade: '800W', hsn_code: '8467', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'N/A' },
      { name: 'Angle Grinder 100mm 850W', brand: 'Makita', unit: 'Nos', grade: '850W', hsn_code: '8467', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'N/A' },
    ]
  },
  {
    name: 'Safety & Site Equipment',
    slug: 'safety-site-equipment',
    products: [
      { name: 'Construction Safety Helmet HDPE Yellow', brand: 'Karam', unit: 'Nos', grade: 'Type I Class C', hsn_code: '6506', pack_size: '1 Nos', moq: '10 Nos', is_bis_standard: 'IS 2925' },
      { name: 'Safety Harness Full Body Double Lanyard', brand: 'Karam', unit: 'Set', grade: 'Class A1', hsn_code: '6211', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'IS 3521' },
      { name: 'Steel Toe Safety Boots S3 Black', brand: 'Bata Industrials', unit: 'Pair', grade: 'S3 Standard', hsn_code: '6403', pack_size: '1 Pair', moq: '1 Pair', is_bis_standard: 'IS 15298' },
      { name: 'High-Vis Safety Vest Yellow Class 2', brand: 'Standard', unit: 'Nos', grade: 'Class 2', hsn_code: '6211', pack_size: '1 Nos', moq: '10 Nos', is_bis_standard: 'IS 15809' },
      { name: 'Dust Mask N95 FFP2 Respirator 10pc', brand: '3M', unit: 'Box (10 Nos)', grade: 'N95 FFP2', hsn_code: '6307', pack_size: '10 Nos', moq: '1 Box', is_bis_standard: 'IS 9473' },
      { name: 'Safety Goggles Anti-Fog Clear Lens', brand: '3M', unit: 'Nos', grade: 'ANSI Z87', hsn_code: '9004', pack_size: '1 Nos', moq: '5 Nos', is_bis_standard: 'IS 5983' },
    ]
  },
  {
    name: 'Construction Chemicals',
    slug: 'construction-chemicals',
    products: [
      { name: 'Waterproofing Compound Integral Powder 1 kg', brand: 'Fosroc', unit: 'kg', grade: 'Integral', hsn_code: '3824', pack_size: '1 kg', moq: '5 kg', is_bis_standard: 'IS 2645' },
      { name: 'SBR Bonding Agent Latex 20 kg', brand: 'Dr. Fixit', unit: 'Can (20 kg)', grade: 'SBR Polymer', hsn_code: '3824', pack_size: '20 kg', moq: '1 Can', is_bis_standard: 'N/A' },
      { name: 'Curing Compound Resin Based 20L', brand: 'Fosroc', unit: 'Can (20L)', grade: 'Resin Curing', hsn_code: '3824', pack_size: '20 Litres', moq: '1 Can', is_bis_standard: 'IS 9504' },
      { name: 'Epoxy Tile Grout 2-Component 1 kg', brand: 'Laticrete', unit: 'kg', grade: 'Epoxy Grout', hsn_code: '3824', pack_size: '1 kg', moq: '5 kg', is_bis_standard: 'N/A' },
      { name: 'Polyurethane Joint Sealant 600ml', brand: 'Dow', unit: 'Cartridge', grade: 'PU Sealant', hsn_code: '3910', pack_size: '600 ml', moq: '12 Cartridges', is_bis_standard: 'N/A' },
      { name: 'Superplasticizer Concrete Admixture 5L', brand: 'Fosroc', unit: 'Can (5L)', grade: 'PCE Based', hsn_code: '3824', pack_size: '5 Litres', moq: '2 Cans', is_bis_standard: 'IS 9103' },
    ]
  },
  {
    name: 'Fasteners & Fabrication',
    slug: 'fasteners-fabrication',
    products: [
      { name: 'Chemical Anchor Bolt M12 x 100mm GI', brand: 'Hilti', unit: 'Box (25 Nos)', grade: 'Grade 8.8', hsn_code: '7318', pack_size: '25 Nos', moq: '1 Box', is_bis_standard: 'N/A' },
      { name: 'Expansion Anchor Bolt M10 x 80mm', brand: 'Fischer', unit: 'Box (50 Nos)', grade: 'Wedge Anchor', hsn_code: '7318', pack_size: '50 Nos', moq: '1 Box', is_bis_standard: 'N/A' },
      { name: 'Threaded Rod M16 x 1000mm Grade 4.8', brand: 'Standard', unit: 'Nos', grade: 'Grade 4.8', hsn_code: '7318', pack_size: '1000 mm', moq: '10 Rods', is_bis_standard: 'IS 1367' },
      { name: 'SS 304 Stud Bolt M12 x 120mm with Nut', brand: 'Standard', unit: 'Set', grade: 'SS 304', hsn_code: '7318', pack_size: '1 Set', moq: '20 Sets', is_bis_standard: 'IS 1367' },
      { name: 'Self-Drilling Screw Tek 12 x 50mm Zinc 100pc', brand: 'Standard', unit: 'Box (100 Nos)', grade: 'Zinc Plated', hsn_code: '7318', pack_size: '100 Nos', moq: '5 Boxes', is_bis_standard: 'N/A' },
      { name: 'GI Nut M16 Hex Full DIN 934', brand: 'Standard', unit: 'Box (100 Nos)', grade: 'Grade 8', hsn_code: '7318', pack_size: '100 Nos', moq: '5 Boxes', is_bis_standard: 'IS 1363' },
    ]
  },
  {
    name: 'Doors & Windows',
    slug: 'doors-windows',
    products: [
      { name: 'Solid Teak Wood Door 2100x900x40mm', brand: 'Standard', unit: 'Nos', grade: 'Grade A Teak', hsn_code: '4418', pack_size: '1 Panel', moq: '1 Nos', is_bis_standard: 'IS 4021' },
      { name: 'Aluminium Sliding Window 1200x1200mm', brand: 'Hindalco', unit: 'Set', grade: 'Aluminium 6063', hsn_code: '7610', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'IS 1948' },
      { name: 'uPVC Casement Window 1000x1000mm', brand: 'Fenesta', unit: 'Set', grade: 'uPVC 5-Chamber', hsn_code: '3925', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'IS 16146' },
      { name: 'Flush Door HDF Pre-Laminated 2100x900mm', brand: 'Greenply', unit: 'Nos', grade: 'HDF Core', hsn_code: '4418', pack_size: '1 Panel', moq: '1 Nos', is_bis_standard: 'IS 2202' },
      { name: 'Aluminium Casement Door 2100x900mm', brand: 'Standard', unit: 'Set', grade: 'Aluminium', hsn_code: '7610', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'IS 1948' },
      { name: 'Steel Security Door 2100x900mm', brand: 'Dorset', unit: 'Set', grade: 'GI Steel', hsn_code: '7308', pack_size: '1 Set', moq: '1 Set', is_bis_standard: 'N/A' },
    ]
  },
  {
    name: 'Glass & Aluminium',
    slug: 'glass-aluminium',
    products: [
      { name: 'Float Glass Clear 4mm 2440x3660mm', brand: 'Saint-Gobain', unit: 'sqft', grade: '4mm Clear', hsn_code: '7005', pack_size: '1 sqft', moq: '50 sqft', is_bis_standard: 'IS 2835' },
      { name: 'Toughened Safety Glass 8mm Clear', brand: 'Saint-Gobain', unit: 'sqft', grade: '8mm Toughened', hsn_code: '7007', pack_size: '1 sqft', moq: '20 sqft', is_bis_standard: 'IS 2553' },
      { name: 'Double Glazed IGU Unit 4+12+4mm', brand: 'Standard', unit: 'sqft', grade: 'Double Glazed', hsn_code: '7007', pack_size: '1 sqft', moq: '10 sqft', is_bis_standard: 'N/A' },
      { name: 'Aluminium Extrusion Section 38x38mm 6m', brand: 'Hindalco', unit: 'Length (6m)', grade: 'Alloy 6063 T5', hsn_code: '7604', pack_size: '6 Metres', moq: '10 Lengths', is_bis_standard: 'IS 733' },
      { name: 'Laminated Safety Glass 6mm+PVB+6mm', brand: 'Standard', unit: 'sqft', grade: 'Laminated', hsn_code: '7007', pack_size: '1 sqft', moq: '20 sqft', is_bis_standard: 'IS 2553' },
      { name: 'Reflective Tinted Glass 6mm Bronze', brand: 'Saint-Gobain', unit: 'sqft', grade: 'Bronze Tinted', hsn_code: '7005', pack_size: '1 sqft', moq: '50 sqft', is_bis_standard: 'IS 2835' },
    ]
  },
  {
    name: 'Waterproofing',
    slug: 'waterproofing',
    products: [
      { name: 'Crystalline Waterproofing Coating 25 kg', brand: 'Xypex', unit: 'Bag (25 kg)', grade: 'Crystalline', hsn_code: '3824', pack_size: '25 kg', moq: '1 Bag', is_bis_standard: 'N/A' },
      { name: 'Bituminous Waterproof Membrane 3mm 10sqm', brand: 'Dr. Fixit', unit: 'Roll (10 sqm)', grade: '3mm SBS', hsn_code: '6807', pack_size: '10 sqm', moq: '5 Rolls', is_bis_standard: 'IS 1322' },
      { name: 'Elastomeric Waterproof Coating 20 kg', brand: 'Fosroc', unit: 'Can (20 kg)', grade: 'Elastomeric', hsn_code: '3214', pack_size: '20 kg', moq: '1 Can', is_bis_standard: 'N/A' },
      { name: 'PVC Waterproof Membrane 1.5mm 20sqm', brand: 'Sika', unit: 'Roll (20 sqm)', grade: '1.5mm PVC', hsn_code: '3921', pack_size: '20 sqm', moq: '3 Rolls', is_bis_standard: 'N/A' },
      { name: 'Flexible Cementitious Waterproofing 20 kg', brand: 'Dr. Fixit', unit: 'Can (20 kg)', grade: 'Type II Flex', hsn_code: '3824', pack_size: '20 kg', moq: '1 Can', is_bis_standard: 'N/A' },
      { name: 'HDPE Waterproof Membrane Dimple Sheet 2mm', brand: 'Standard', unit: 'Roll (20 sqm)', grade: 'HDPE Dimple', hsn_code: '3921', pack_size: '20 sqm', moq: '3 Rolls', is_bis_standard: 'N/A' },
    ]
  },
  {
    name: 'Kitchen & Interiors',
    slug: 'kitchen-interiors',
    products: [
      { name: 'Modular Kitchen Cabinet Box 600x720mm BWP', brand: 'Hettich', unit: 'Nos', grade: 'BWP Ply Core', hsn_code: '9403', pack_size: '1 Cabinet', moq: '1 Nos', is_bis_standard: 'N/A' },
      { name: 'Granite Kitchen Countertop 600mm x RM', brand: 'Standard', unit: 'Running Metre', grade: 'Polished Granite', hsn_code: '6802', pack_size: '1 Running Metre', moq: '3 RM', is_bis_standard: 'N/A' },
      { name: 'Stainless Steel Single Bowl Kitchen Sink 600x450mm', brand: 'Nirali', unit: 'Nos', grade: 'SS 304 Grade', hsn_code: '7324', pack_size: '1 Nos', moq: '1 Nos', is_bis_standard: 'IS 13983' },
      { name: 'Soft-Close Drawer Slide 450mm Full Extension', brand: 'Hettich', unit: 'Pair', grade: 'Full Extension', hsn_code: '8302', pack_size: '1 Pair', moq: '5 Pairs', is_bis_standard: 'N/A' },
      { name: 'High Pressure Laminate HPL Sheet 8x4ft 1mm', brand: 'Merino', unit: 'Sheet', grade: 'HPL 1mm', hsn_code: '4823', pack_size: '8x4 ft', moq: '5 Sheets', is_bis_standard: 'IS 2046' },
      { name: 'False Ceiling Grid System T-Bar 600x600mm', brand: 'Armstrong', unit: 'sqm', grade: 'T-24 System', hsn_code: '7308', pack_size: '1 sqm', moq: '10 sqm', is_bis_standard: 'N/A' },
    ]
  },
  {
    name: 'Roofing',
    slug: 'roofing',
    products: [
      { name: 'Mangalore Pattern Clay Roof Tiles', brand: 'Standard', unit: 'Nos', grade: 'Natural Clay', hsn_code: '6905', pack_size: '1 Nos', moq: '100 Nos', is_bis_standard: 'IS 654' },
      { name: 'Galvanised Corrugated Iron Roofing Sheet 0.5mm', brand: 'Tata Shaktee', unit: 'Sheet', grade: '0.5mm GI', hsn_code: '7210', pack_size: '2.5m Sheet', moq: '20 Sheets', is_bis_standard: 'IS 277' },
      { name: 'Pre-painted Metal Roofing Sheet 0.5mm', brand: 'Tata BlueScope', unit: 'Sheet', grade: 'PPGI 0.5mm', hsn_code: '7210', pack_size: '2.5m Sheet', moq: '20 Sheets', is_bis_standard: 'IS 14246' },
      { name: 'Polycarbonate Hollow Sheet 6mm 2100x600mm', brand: 'Palram', unit: 'Sheet', grade: '6mm Hollow', hsn_code: '3920', pack_size: '1 Sheet', moq: '5 Sheets', is_bis_standard: 'N/A' },
      { name: 'Self-Adhesive Bitumen Underlay Membrane 20sqm', brand: 'Standard', unit: 'Roll (20 sqm)', grade: 'SBS Modified', hsn_code: '6807', pack_size: '20 sqm', moq: '2 Rolls', is_bis_standard: 'N/A' },
      { name: 'Concrete Interlocking Roof Tiles 420x330mm', brand: 'Standard', unit: 'Nos', grade: 'Concrete', hsn_code: '6810', pack_size: '1 Nos', moq: '100 Nos', is_bis_standard: 'IS 654' },
    ]
  },
  {
    name: 'Insulation & Gypsum',
    slug: 'insulation-gypsum',
    products: [
      { name: 'Rock Wool Insulation Slab 50mm 1200x600mm', brand: 'Rockwool', unit: 'sqm', grade: '50mm 60 kg/m3', hsn_code: '6811', pack_size: '1 sqm', moq: '10 sqm', is_bis_standard: 'IS 8183' },
      { name: 'Glass Wool Insulation Blanket 50mm Roll', brand: 'Isover', unit: 'Roll (10 sqm)', grade: '50mm 11 kg/m3', hsn_code: '7019', pack_size: '10 sqm', moq: '2 Rolls', is_bis_standard: 'IS 8183' },
      { name: 'Gypsum Plasterboard 12.5mm 2400x1200mm', brand: 'Saint-Gobain', unit: 'Sheet', grade: 'Standard 12.5mm', hsn_code: '6809', pack_size: '1 Sheet', moq: '10 Sheets', is_bis_standard: 'IS 2095' },
      { name: 'Acoustic Foam Panels 50mm 600x600mm', brand: 'Standard', unit: 'Box (6 Panels)', grade: '50mm Acoustic', hsn_code: '3921', pack_size: '6 Panels', moq: '2 Boxes', is_bis_standard: 'N/A' },
      { name: 'XPS Extruded Polystyrene Board 50mm 1200x600mm', brand: 'Owens Corning', unit: 'sqm', grade: 'XPS 35 Grade', hsn_code: '3921', pack_size: '1 sqm', moq: '10 sqm', is_bis_standard: 'N/A' },
      { name: 'Gypsum Board Fire Resistant 15mm 2400x1200mm', brand: 'USG Boral', unit: 'Sheet', grade: 'FR 15mm', hsn_code: '6809', pack_size: '1 Sheet', moq: '10 Sheets', is_bis_standard: 'IS 2095' },
    ]
  },
  {
    name: 'Landscaping & External',
    slug: 'landscaping-external',
    products: [
      { name: 'Concrete Interlocking Paver Block 60mm Grey', brand: 'Standard', unit: 'sqm', grade: 'M30 Grade', hsn_code: '6810', pack_size: '1 sqm', moq: '10 sqm', is_bis_standard: 'IS 15658' },
      { name: 'Granite Kerb Stone 150x300x600mm', brand: 'Standard', unit: 'Nos', grade: 'Polished Granite', hsn_code: '6802', pack_size: '1 Nos', moq: '50 Nos', is_bis_standard: 'IS 5758' },
      { name: 'Garden Topsoil Enriched Mix 50 kg', brand: 'Standard', unit: 'Bag (50 kg)', grade: 'Enriched', hsn_code: '2503', pack_size: '50 kg', moq: '5 Bags', is_bis_standard: 'N/A' },
      { name: 'River Boulder Rockery Stone 150-300mm', brand: 'Standard', unit: 'MT', grade: 'Natural', hsn_code: '2516', pack_size: '1 MT', moq: '1 MT', is_bis_standard: 'N/A' },
      { name: 'Chain Link Fencing GI 1800mm x 10m Roll', brand: 'Standard', unit: 'Roll (10m)', grade: 'GI 2mm Wire', hsn_code: '7314', pack_size: '10 Metres', moq: '2 Rolls', is_bis_standard: 'IS 278' },
      { name: 'Composite Decking Board WPC 25x150mm 4m', brand: 'Standard', unit: 'Length (4m)', grade: 'WPC 25mm', hsn_code: '3918', pack_size: '4 Metres', moq: '10 Lengths', is_bis_standard: 'N/A' },
    ]
  },
  {
    name: 'Miscellaneous Civil',
    slug: 'miscellaneous-civil',
    products: [
      { name: 'Polypropylene Woven Sack 80x55cm 500pc', brand: 'Standard', unit: 'Bundle (500 Nos)', grade: 'PP Woven', hsn_code: '6305', pack_size: '500 Nos', moq: '1 Bundle', is_bis_standard: 'IS 11652' },
      { name: 'Expansion Joint Filler Board 25mm 1200x50mm', brand: 'Fosroc', unit: 'Nos', grade: 'Closed Cell', hsn_code: '3921', pack_size: '1200mm Length', moq: '10 Nos', is_bis_standard: 'IS 1838' },
      { name: 'GMS Survey Peg 500mm Long 30x30mm', brand: 'Standard', unit: 'Nos', grade: 'MS Painted', hsn_code: '7308', pack_size: '1 Nos', moq: '50 Nos', is_bis_standard: 'N/A' },
      { name: 'Polythene DPC Membrane 1000 Gauge 4m Roll', brand: 'Standard', unit: 'Roll (30m)', grade: '1000 Gauge', hsn_code: '3921', pack_size: '30 Metres', moq: '2 Rolls', is_bis_standard: 'IS 7634' },
      { name: 'Gunny Jute Hessian Cloth 1m x 100m Roll', brand: 'Standard', unit: 'Roll (100m)', grade: 'Hessian', hsn_code: '5310', pack_size: '100 Metres', moq: '1 Roll', is_bis_standard: 'N/A' },
      { name: 'Glass Fibre Mesh Tape 50mm x 90m', brand: 'Standard', unit: 'Roll (90m)', grade: 'Alkali Resistant', hsn_code: '7019', pack_size: '90 Metres', moq: '5 Rolls', is_bis_standard: 'N/A' },
    ]
  }
];

// ─────────────────────────────────────────────
// HELPER: convert name to kebab-case slug
// ─────────────────────────────────────────────
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────
async function seedMaterials() {
  const client = await pool.connect();
  try {
    console.log('🌱 Starting Building Materials seed...');
    await client.query('BEGIN');

    // Step 1: Get building-materials parent category id
    const catRes = await client.query(`
      SELECT id FROM categories WHERE slug = 'building-materials' LIMIT 1;
    `);
    if (catRes.rows.length === 0) {
      throw new Error('❌ Parent category "building-materials" not found in categories table!');
    }
    const parentId = catRes.rows[0].id;
    console.log(`✅ Building Materials parent category id = ${parentId}`);

    let totalInserted = 0;
    const categoryCounts = [];

    // Step 2: For each subcategory, insert cat + products
    for (const subcat of MATERIAL_SUBCATEGORIES) {
      // Insert subcategory
      const subcatRes = await client.query(`
        INSERT INTO categories (name, slug, category_group, parent_category_id, sort_order)
        VALUES ($1, $2, 'material', $3, (
          SELECT COALESCE(MAX(sort_order), 0) + 1 FROM categories WHERE parent_category_id = $3
        ))
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          category_group = 'material',
          parent_category_id = EXCLUDED.parent_category_id
        RETURNING id, name, slug;
      `, [subcat.name, subcat.slug, parentId]);

      const subcatId = subcatRes.rows[0].id;
      console.log(`\n📦 Subcategory: ${subcat.name} (id=${subcatId})`);

      let insertedCount = 0;

      // Insert each product
      for (const p of subcat.products) {
        const slug = toSlug(p.name + '-' + subcat.slug);
        const specs = {
          grade: p.grade,
          subcategory: subcat.name,
          hsn_code: p.hsn_code,
          pack_size: p.pack_size,
          moq: p.moq,
          is_bis_standard: p.is_bis_standard
        };

        const prodRes = await client.query(`
          INSERT INTO products (name, slug, category_id, brand, default_unit, specifications, product_status)
          VALUES ($1, $2, $3, $4, $5, $6::jsonb, 'active')
          ON CONFLICT (slug) DO NOTHING
          RETURNING id;
        `, [p.name, slug, subcatId, p.brand, p.unit, JSON.stringify(specs)]);

        if (prodRes.rows.length > 0) {
          insertedCount++;
          totalInserted++;
        }
      }

      console.log(`   ✅ Inserted ${insertedCount}/${subcat.products.length} products`);
      categoryCounts.push({ category: subcat.name, inserted: insertedCount, total: subcat.products.length });
    }

    await client.query('COMMIT');
    console.log('\n🎉 Materials seed committed!');
    console.log('\n📊 Summary by Category:');
    console.table(categoryCounts);
    console.log(`\n✅ Total products inserted: ${totalInserted}`);

    // Final verification
    const countRes = await client.query(`
      SELECT COUNT(*) as count FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE c.parent_category_id = $1;
    `, [parentId]);
    console.log(`\n📋 DB Verification — Products under building-materials: ${countRes.rows[0].count}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Materials seed failed, rolled back:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedMaterials();
