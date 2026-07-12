const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding environmental database...');

  // 1. Clean existing records to prevent duplicates
  await prisma.environmentalReport.deleteMany({});
  await prisma.sustainabilityGoal.deleteMany({});
  await prisma.carbonTransaction.deleteMany({});
  await prisma.productESGProfile.deleteMany({});
  await prisma.emissionFactor.deleteMany({});
  await prisma.department.deleteMany({});

  // 2. Create Departments
  const depts = [
    { name: 'Manufacturing', targetEmissions: 500.0, score: 62, status: 'Warning', trend: 'up', manager: 'Sarah Connor', employeeCount: 145 },
    { name: 'Logistics & Fleet', targetEmissions: 300.0, score: 85, status: 'On Track', trend: 'down', manager: 'James Smith', employeeCount: 68 },
    { name: 'Office Operations', targetEmissions: 90.0, score: 92, status: 'On Track', trend: 'down', manager: 'Robert Patrick', employeeCount: 220 },
    { name: 'R&D Labs', targetEmissions: 100.0, score: 71, status: 'Warning', trend: 'up', manager: 'Dr. Silberman', employeeCount: 42 },
    { name: 'IT & Data Centers', targetEmissions: 130.0, score: 78, status: 'On Track', trend: 'down', manager: 'Miles Dyson', employeeCount: 35 },
    { name: 'Marketing & Sales', targetEmissions: 35.0, score: 95, status: 'On Track', trend: 'down', manager: 'Linda Hamilton', employeeCount: 88 },
    { name: 'Corporate Events', targetEmissions: 30.0, score: 74, status: 'Warning', trend: 'up', manager: 'Peter Hollens', employeeCount: 12 },
    { name: 'Supply Chain Ops', targetEmissions: 15.0, score: 89, status: 'On Track', trend: 'down', manager: 'John Connor', employeeCount: 50 }
  ];

  const dbDepts = [];
  for (const dept of depts) {
    const dbDept = await prisma.department.create({
      data: dept
    });
    dbDepts.push(dbDept);
    console.log(`Created department: ${dbDept.name}`);
  }

  // 3. Create Emission Factors
  const factors = [
    {
      name: 'Diesel Fuel Factor',
      category: 'Fuel',
      subcategory: 'Mobile Combustion',
      unit: 'liters',
      value: 2.68,
      source: 'EPA Emission Factors Hub 2025',
      version: '1.2.0',
      effectiveDate: new Date('2025-01-01'),
      description: 'Standard ultra-low sulfur diesel coefficient for medium and heavy-duty vehicles.',
      status: 'ACTIVE'
    },
    {
      name: 'Petrol Factor',
      category: 'Fuel',
      subcategory: 'Mobile Combustion',
      unit: 'liters',
      value: 2.31,
      source: 'EPA Emission Factors Hub 2025',
      version: '1.1.0',
      effectiveDate: new Date('2025-01-01'),
      description: 'Motor gasoline combustion coefficient for light passenger fleets.',
      status: 'ACTIVE'
    },
    {
      name: 'Electricity Grid Factor',
      category: 'Electricity',
      subcategory: 'Indirect Emissions (Scope 2)',
      unit: 'kWh',
      value: 0.385,
      source: 'EIA eGRID 2025 Subregion Output',
      version: '2.0.1',
      effectiveDate: new Date('2025-02-15'),
      description: 'Weighted subregion greenhouse gas coefficient for grid electricity consumption.',
      status: 'ACTIVE'
    },
    {
      name: 'Natural Gas Factor',
      category: 'Fuel',
      subcategory: 'Stationary Combustion',
      unit: 'm³',
      value: 2.03,
      source: 'EPA Emission Factors Hub 2025',
      version: '1.0.0',
      effectiveDate: new Date('2025-01-01'),
      description: 'Boiler and furnace natural gas combustion coefficient.',
      status: 'ACTIVE'
    },
    {
      name: 'Air Travel Factor',
      category: 'Business Travel',
      subcategory: 'Scope 3 Category 6',
      unit: 'passenger-km',
      value: 0.12,
      source: 'DEFRA Carbon Reporting 2025',
      version: '3.0.0',
      effectiveDate: new Date('2025-03-01'),
      description: 'Short and long haul economy passenger air travel flight coefficient.',
      status: 'ACTIVE'
    },
    {
      name: 'Rail Transport Factor',
      category: 'Business Travel',
      subcategory: 'Scope 3 Category 6',
      unit: 'passenger-km',
      value: 0.04,
      source: 'DEFRA Carbon Reporting 2025',
      version: '2.1.0',
      effectiveDate: new Date('2025-03-01'),
      description: 'Electric and diesel rail transportation passenger travel coefficient.',
      status: 'ACTIVE'
    },
    {
      name: 'Plastic Packaging Factor',
      category: 'Material',
      subcategory: 'Upstream Purchased Materials',
      unit: 'kg',
      value: 1.89,
      source: 'ECOINVENT Database v3.10',
      version: '4.2.0',
      effectiveDate: new Date('2025-04-10'),
      description: 'High-density polyethylene (HDPE) polymer raw material supply chain footprint.',
      status: 'ACTIVE'
    },
    {
      name: 'Paper Packaging Factor',
      category: 'Material',
      subcategory: 'Upstream Purchased Materials',
      unit: 'kg',
      value: 0.92,
      source: 'ECOINVENT Database v3.10',
      version: '2.0.0',
      effectiveDate: new Date('2025-04-10'),
      description: 'Recycled corrugated cardboard packing material supply chain coefficient.',
      status: 'ACTIVE'
    },
    {
      name: 'Coal Factor (Legacy)',
      category: 'Fuel',
      subcategory: 'Stationary Combustion',
      unit: 'kg',
      value: 2.86,
      source: 'EPA Emission Factors Hub 2024',
      version: '1.0.0',
      effectiveDate: new Date('2024-01-01'),
      description: 'Legacy bituminous coal combustion factor. Archived for active reporting.',
      status: 'ARCHIVED'
    }
  ];

  const dbFactors = [];
  for (const factor of factors) {
    const dbFactor = await prisma.emissionFactor.create({
      data: factor
    });
    dbFactors.push(dbFactor);
    console.log(`Created emission factor: ${dbFactor.name}`);
  }

  // 4. Create Product ESG Profiles
  const plasticFactor = dbFactors.find(f => f.name === 'Plastic Packaging Factor');
  const paperFactor = dbFactors.find(f => f.name === 'Paper Packaging Factor');
  const dieselFactor = dbFactors.find(f => f.name === 'Diesel Fuel Factor');

  const products = [
    {
      name: 'Steel Construction Rods',
      code: 'PROD-STL-001',
      category: 'Structural Metal',
      supplier: 'Apex Steel Industries',
      packagingType: 'None',
      recyclablePercent: 95.0,
      manufacturingCountry: 'Germany',
      lifecycleStage: 'Production',
      hazardClass: 'Non-Hazardous',
      carbonCategory: 'Scope 3 Purchased Goods',
      preferredEmissionFactorId: null,
      esgRating: 'AA',
      description: 'High-strength structural steel reinforcement bars for concrete projects.',
      status: 'ACTIVE'
    },
    {
      name: 'Portland Cement Bag (50kg)',
      code: 'PROD-CEM-50KG',
      category: 'Binder Materials',
      supplier: 'Heidelberg Materials',
      packagingType: 'Paper Packaging',
      recyclablePercent: 100.0,
      manufacturingCountry: 'Poland',
      lifecycleStage: 'Raw Material Extraction',
      hazardClass: 'Skin/Eye Irritant (Dust)',
      carbonCategory: 'Scope 3 Purchased Goods',
      preferredEmissionFactorId: paperFactor ? paperFactor.id : null,
      esgRating: 'BBB',
      description: 'General purpose Portland cement bagged in compostable kraft paper sacks.',
      status: 'ACTIVE'
    },
    {
      name: 'Recycled Cardboard Shipping Box',
      code: 'PROD-CRD-BOX',
      category: 'Packaging',
      supplier: 'International Paper Co.',
      packagingType: 'Cardboard Wrap',
      recyclablePercent: 100.0,
      manufacturingCountry: 'United States',
      lifecycleStage: 'Manufacturing',
      hazardClass: 'Non-Hazardous',
      carbonCategory: 'Scope 3 Packaging Materials',
      preferredEmissionFactorId: paperFactor ? paperFactor.id : null,
      esgRating: 'AAA',
      description: 'Double-walled heavy-duty corrugated shipping box made of recycled pulp.',
      status: 'ACTIVE'
    },
    {
      name: 'PET Plastic Water Bottles',
      code: 'PROD-PET-1L',
      category: 'Containers',
      supplier: 'Plastipak Packaging',
      packagingType: 'Plastic Shrink-wrap',
      recyclablePercent: 45.0,
      manufacturingCountry: 'Mexico',
      lifecycleStage: 'Use Stage',
      hazardClass: 'Non-Hazardous',
      carbonCategory: 'Scope 3 Packaging Materials',
      preferredEmissionFactorId: plasticFactor ? plasticFactor.id : null,
      esgRating: 'B',
      description: '1-liter polyethylene terephthalate water bottles with post-consumer recycled plastic mix.',
      status: 'ACTIVE'
    },
    {
      name: 'Bright White A4 Office Paper',
      code: 'PROD-PAP-A4',
      category: 'Office Supplies',
      supplier: 'Mondi Group',
      packagingType: 'Paper Wrapping',
      recyclablePercent: 100.0,
      manufacturingCountry: 'Austria',
      lifecycleStage: 'Use Stage',
      hazardClass: 'Non-Hazardous',
      carbonCategory: 'Scope 3 Office Supplies',
      preferredEmissionFactorId: paperFactor ? paperFactor.id : null,
      esgRating: 'A',
      description: 'Premium white copy and printing paper, Chlorine-free processing certified.',
      status: 'ACTIVE'
    },
    {
      name: 'Premium Biodiesel B20',
      code: 'PROD-DSL-B20',
      category: 'Energy & Fuels',
      supplier: 'Chevron Renewable Energy',
      packagingType: 'Bulk Liquid Container',
      recyclablePercent: 0.0,
      manufacturingCountry: 'United States',
      lifecycleStage: 'Combustion / End of Life',
      hazardClass: 'Flammable Liquid Class 3',
      carbonCategory: 'Scope 1 Fuel Combustion',
      preferredEmissionFactorId: dieselFactor ? dieselFactor.id : null,
      esgRating: 'AA',
      description: '20% soybean-based biodiesel blend fuel for freight operations.',
      status: 'ACTIVE'
    },
    {
      name: 'Industrial Lithium-Ion Pack',
      code: 'PROD-BAT-LION',
      category: 'Electronics',
      supplier: 'CATL Battery Tech',
      packagingType: 'Wooden Pallet',
      recyclablePercent: 82.0,
      manufacturingCountry: 'China',
      lifecycleStage: 'Production',
      hazardClass: 'Dangerous Goods Class 9',
      carbonCategory: 'Scope 3 Purchased Goods',
      preferredEmissionFactorId: null,
      esgRating: 'BBB',
      description: 'High capacity lithium-ion battery modules designed for forklift applications.',
      status: 'ACTIVE'
    },
    {
      name: 'Anodized Aluminum Sheet',
      code: 'PROD-ALM-SHT',
      category: 'Structural Metal',
      supplier: 'Alcoa Corp.',
      packagingType: 'None',
      recyclablePercent: 100.0,
      manufacturingCountry: 'Canada',
      lifecycleStage: 'Production',
      hazardClass: 'Non-Hazardous',
      carbonCategory: 'Scope 3 Purchased Goods',
      preferredEmissionFactorId: null,
      esgRating: 'AA',
      description: 'Corrosion-resistant anodized aluminum siding plates.',
      status: 'ACTIVE'
    },
    {
      name: 'Monocrystalline Solar Panel (400W)',
      code: 'PROD-SLR-400W',
      category: 'Energy Systems',
      supplier: 'JinkoSolar Holding',
      packagingType: 'Cardboard Box / Pallet',
      recyclablePercent: 90.0,
      manufacturingCountry: 'Vietnam',
      lifecycleStage: 'Operational Use',
      hazardClass: 'Non-Hazardous',
      carbonCategory: 'Scope 3 Capital Goods',
      preferredEmissionFactorId: null,
      esgRating: 'AAA',
      description: 'High efficiency residential and industrial silicon photo-voltaic panels.',
      status: 'ACTIVE'
    },
    {
      name: 'Heat-Treated Wooden Pallet',
      code: 'PROD-WOD-PLT',
      category: 'Logistics Equipment',
      supplier: 'PalletOne Inc.',
      packagingType: 'None',
      recyclablePercent: 100.0,
      manufacturingCountry: 'United States',
      lifecycleStage: 'Transport / Distribution',
      hazardClass: 'Non-Hazardous',
      carbonCategory: 'Scope 3 Packaging Materials',
      preferredEmissionFactorId: null,
      esgRating: 'A',
      description: 'Standard wooden logistics pallets, pest-free certified heat treatment.',
      status: 'ACTIVE'
    },
    {
      name: 'Single-Use Plastic Straws (Legacy)',
      code: 'PROD-STR-PLST',
      category: 'Dining Supplies',
      supplier: 'Generic Packaging Corp',
      packagingType: 'Plastic Wrapper',
      recyclablePercent: 0.0,
      manufacturingCountry: 'China',
      lifecycleStage: 'End of Life disposal',
      hazardClass: 'Non-Hazardous',
      carbonCategory: 'Scope 3 Purchased Goods',
      preferredEmissionFactorId: plasticFactor ? plasticFactor.id : null,
      esgRating: 'CCC',
      description: 'Non-biodegradable legacy plastic drinking straws. Archived for phasing out.',
      status: 'ARCHIVED'
    }
  ];

  const dbProducts = [];
  for (const product of products) {
    const dbProduct = await prisma.productESGProfile.create({
      data: product
    });
    dbProducts.push(dbProduct);
    console.log(`Created product ESG profile: ${dbProduct.name} [${dbProduct.code}]`);
  }

  // 5. Create Carbon Transactions spanning last 12 months
  const manufacturing = dbDepts.find(d => d.name === 'Manufacturing');
  const logistics = dbDepts.find(d => d.name === 'Logistics & Fleet');
  const offices = dbDepts.find(d => d.name === 'Office Operations');
  const it = dbDepts.find(d => d.name === 'IT & Data Centers');
  const events = dbDepts.find(d => d.name === 'Corporate Events');
  const rd = dbDepts.find(d => d.name === 'R&D Labs');
  const supply = dbDepts.find(d => d.name === 'Supply Chain Ops');

  const now = new Date();
  
  // Sample transactions base
  const txTemplates = [
    { dept: manufacturing, operation: 'Assembly Line A Boiler Run', product: 'Natural Gas', source: 'Manufacturing', baseQty: 100, factor: dbFactors.find(f => f.name === 'Natural Gas Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-DSL-B20'), notes: 'Steam generator combustion' },
    { dept: manufacturing, operation: 'Assembly Line B Heat Cycle', product: 'Natural Gas', source: 'Manufacturing', baseQty: 80, factor: dbFactors.find(f => f.name === 'Natural Gas Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-DSL-B20'), notes: 'High heat furnace cure' },
    { dept: logistics, operation: 'Delivery Route Zone A Freight', product: 'Diesel Fuel', source: 'Fleet', baseQty: 50, factor: dbFactors.find(f => f.name === 'Diesel Fuel Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-DSL-B20'), notes: 'Medium truck fleet dispatch' },
    { dept: logistics, operation: 'Delivery Route Zone B Freight', product: 'Diesel Fuel', source: 'Fleet', baseQty: 40, factor: dbFactors.find(f => f.name === 'Diesel Fuel Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-DSL-B20'), notes: 'Heavy transport logistics' },
    { dept: it, operation: 'Data Center Cooling Cycle', product: 'Electricity Grid', source: 'Electricity', baseQty: 200, factor: dbFactors.find(f => f.name === 'Electricity Grid Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-SLR-400W'), notes: 'Server farm chillers power consumption' },
    { dept: offices, operation: 'HQ HVAC Daily Run', product: 'Electricity Grid', source: 'Electricity', baseQty: 100, factor: dbFactors.find(f => f.name === 'Electricity Grid Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-PAP-A4'), notes: 'Administrative building daily ventilation power' },
    { dept: rd, operation: 'Material Stress Test Furnace', product: 'Natural Gas', source: 'Manufacturing', baseQty: 30, factor: dbFactors.find(f => f.name === 'Natural Gas Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-STL-001'), notes: 'Stress testing experimental alloys' },
    { dept: events, operation: 'Annual General Meeting Travel', product: 'Air Travel', source: 'Business Travel', baseQty: 1000, factor: dbFactors.find(f => f.name === 'Air Travel Factor'), prodRef: null, notes: 'Executive board flight ticket conversions' },
    { dept: supply, operation: 'Cardboard Box Disposals', product: 'Paper Packaging', source: 'Waste Management', baseQty: 80, factor: dbFactors.find(f => f.name === 'Paper Packaging Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-CRD-BOX'), notes: 'Scrap packaging waste cycle' }
  ];

  let txCounter = 10000;
  // Generate data for 12 months (offset 0 to 11)
  for (let offset = 11; offset >= 0; offset--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - offset, 15);
    
    // Add 4-6 random transactions per month
    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const template = txTemplates[Math.floor(Math.random() * txTemplates.length)];
      if (!template.dept || !template.factor) continue;
      
      const qty = parseFloat((template.baseQty * (0.85 + Math.random() * 0.3)).toFixed(1));
      const fValue = template.factor.value;
      const carbonVal = parseFloat((qty * fValue).toFixed(4));
      
      txCounter++;
      await prisma.carbonTransaction.create({
        data: {
          txId: `TX-${txCounter}`,
          departmentId: template.dept.id,
          emissionFactorId: template.factor.id,
          productId: template.prodRef ? template.prodRef.id : null,
          operation: template.operation,
          product: template.product,
          source: template.source,
          quantity: qty,
          unit: template.factor.unit,
          factorValue: fValue,
          carbon: carbonVal,
          formula: `Quantity (${qty} ${template.factor.unit}) × Factor (${fValue} tCO2e/${template.factor.unit})`,
          status: 'Verified',
          createdBy: 'System',
          notes: template.notes,
          timestamp: targetDate
        }
      });
    }
  }
  console.log(`Created ${txCounter - 10000} carbon transactions.`);

  // 6. Create Sustainability Goals covering different departments
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const sixMonthsHence = new Date();
  sixMonthsHence.setMonth(sixMonthsHence.getMonth() + 6);

  const goals = [
    {
      name: 'Reduce Fleet Emissions by 20%',
      description: 'Optimize routing, transition vehicles to biodiesel, and scale back diesel consumption.',
      departmentId: logistics.id,
      category: 'Reduce Fleet Emissions',
      baselineCarbon: 550.0,
      targetCarbon: 440.0,
      startDate: sixMonthsAgo,
      targetDate: sixMonthsHence,
      owner: 'James Smith',
      priority: 'High',
      status: 'Active'
    },
    {
      name: 'Lower Office Electricity Usage',
      description: 'Deploy smart thermostats, switch admin lighting to low-heat LEDs, and establish automatic shutdown cycles.',
      departmentId: offices.id,
      category: 'Reduce Electricity Consumption',
      baselineCarbon: 320.0,
      targetCarbon: 250.0,
      startDate: sixMonthsAgo,
      targetDate: sixMonthsHence,
      owner: 'Robert Patrick',
      priority: 'Medium',
      status: 'On Track'
    },
    {
      name: 'Reduce Manufacturing Carbon Output',
      description: 'Refactor main assembly line curing heat times and upgrade furnace gaskets to reduce natural gas combustion.',
      departmentId: manufacturing.id,
      category: 'Reduce Manufacturing Emissions',
      baselineCarbon: 800.0,
      targetCarbon: 600.0,
      startDate: sixMonthsAgo,
      targetDate: sixMonthsHence,
      owner: 'Sarah Connor',
      priority: 'High',
      status: 'At Risk'
    },
    {
      name: 'Cut Packaging Waste',
      description: 'Limit single-use container acquisitions and double recyclability rates of materials used in supply chain operations.',
      departmentId: supply.id,
      category: 'Packaging Waste Reduction',
      baselineCarbon: 150.0,
      targetCarbon: 100.0,
      startDate: sixMonthsAgo,
      targetDate: sixMonthsHence,
      owner: 'Linda Hamilton',
      priority: 'Low',
      status: 'Active'
    },
    {
      name: 'Improve Renewable Energy Utilization',
      description: 'Install monocrystalline solar sheets across IT center rooftops to feed renewable electricity back to local arrays.',
      departmentId: it.id,
      category: 'Renewable Energy Adoption',
      baselineCarbon: 400.0,
      targetCarbon: 300.0,
      startDate: sixMonthsAgo,
      targetDate: sixMonthsHence,
      owner: 'Miles Dyson',
      priority: 'Medium',
      status: 'Completed'
    }
  ];

  for (const goal of goals) {
    const dbGoal = await prisma.sustainabilityGoal.create({
      data: goal
    });
    console.log(`Created sustainability goal: ${dbGoal.name}`);
  }

  // 7. Seed Reports History
  const reports = [
    {
      name: 'Q2 ESG Performance Audit',
      type: 'Quarterly Environmental Assessment',
      generatedBy: 'Sarah Connor',
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      filters: JSON.stringify({ dateRange: 'Q2', format: 'CSV' }),
      format: 'CSV',
      status: 'Ready'
    },
    {
      name: 'Annual Carbon Footprint Summary',
      type: 'Annual Environmental Report',
      generatedBy: 'James Smith',
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), // 12 days ago
      filters: JSON.stringify({ dateRange: 'Yearly', format: 'JSON' }),
      format: 'JSON',
      status: 'Ready'
    },
    {
      name: 'Logistics Fleet MoM Review',
      type: 'Monthly Sustainability Review',
      generatedBy: 'James Smith',
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      filters: JSON.stringify({ dateRange: 'Monthly', departmentId: logistics.id, format: 'CSV' }),
      format: 'CSV',
      status: 'Ready'
    }
  ];

  for (const rep of reports) {
    const dbRep = await prisma.environmentalReport.create({
      data: rep
    });
    console.log(`Created environmental report history item: ${dbRep.name}`);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
