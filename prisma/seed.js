const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding environmental database...');

  // 1. Clean existing records to prevent duplicates
  await prisma.sustainabilityGoal.deleteMany({});
  await prisma.carbonTransaction.deleteMany({});
  await prisma.emissionFactor.deleteMany({});
  await prisma.department.deleteMany({});

  // 2. Create Departments
  const depts = [
    { name: 'Manufacturing', targetEmissions: 500.0, score: 62, status: 'Warning', trend: 'up' },
    { name: 'Logistics & Fleet', targetEmissions: 300.0, score: 85, status: 'On Track', trend: 'down' },
    { name: 'Office Operations', targetEmissions: 90.0, score: 92, status: 'On Track', trend: 'down' },
    { name: 'R&D Labs', targetEmissions: 100.0, score: 71, status: 'Warning', trend: 'up' },
    { name: 'IT & Data Centers', targetEmissions: 130.0, score: 78, status: 'On Track', trend: 'down' },
    { name: 'Marketing & Sales', targetEmissions: 35.0, score: 95, status: 'On Track', trend: 'down' },
    { name: 'Corporate Events', targetEmissions: 30.0, score: 74, status: 'Warning', trend: 'up' },
    { name: 'Supply Chain Ops', targetEmissions: 15.0, score: 89, status: 'On Track', trend: 'down' }
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
    { key: 'electricity', name: 'Grid Electricity', value: 0.385, unit: 'kg CO2e/kWh', type: 'Scope 2' },
    { key: 'natural_gas', name: 'Natural Gas', value: 2.031, unit: 'kg CO2e/m³', type: 'Scope 1' },
    { key: 'diesel', name: 'Diesel Fuel', value: 2.68, unit: 'kg CO2e/liter', type: 'Scope 1' },
    { key: 'gasoline', name: 'Motor Gasoline', value: 2.31, unit: 'kg CO2e/liter', type: 'Scope 1' },
    { key: 'aviation_fuel', name: 'Aviation Fuel', value: 3.15, unit: 'kg CO2e/kg', type: 'Scope 3' }
  ];

  for (const factor of factors) {
    const dbFactor = await prisma.emissionFactor.create({
      data: factor
    });
    console.log(`Created emission factor: ${dbFactor.name}`);
  }

  // 4. Create Carbon Transactions spanning last 12 months to generate trend data
  const manufacturing = dbDepts.find(d => d.name === 'Manufacturing');
  const logistics = dbDepts.find(d => d.name === 'Logistics & Fleet');
  const offices = dbDepts.find(d => d.name === 'Office Operations');
  const it = dbDepts.find(d => d.name === 'IT & Data Centers');
  const events = dbDepts.find(d => d.name === 'Corporate Events');
  const rd = dbDepts.find(d => d.name === 'R&D Labs');

  const now = new Date();
  
  // Sample transactions base
  const txTemplates = [
    { dept: manufacturing, operation: 'Assembly Line A Boiler Run', product: 'Natural Gas', baseCarbon: 22.0 },
    { dept: manufacturing, operation: 'Assembly Line B Heat Cycle', product: 'Natural Gas', baseCarbon: 18.0 },
    { dept: logistics, operation: 'Delivery Route Zone A', product: 'Diesel Fuel', baseCarbon: 12.0 },
    { dept: logistics, operation: 'Delivery Route Zone B', product: 'Diesel Fuel', baseCarbon: 10.0 },
    { dept: it, operation: 'Data Center Cooling Cycle', product: 'Grid Electricity', baseCarbon: 14.0 },
    { dept: offices, operation: 'HQ HVAC Daily Run', product: 'Grid Electricity', baseCarbon: 8.0 },
    { dept: rd, operation: 'Material Stress Test Furnace', product: 'Natural Gas', baseCarbon: 6.0 },
    { dept: events, operation: 'Annual General Meeting Travel', product: 'Aviation Fuel', baseCarbon: 15.0 }
  ];

  let txCounter = 10000;
  // Generate data for 12 months (offset 0 to 11)
  for (let offset = 11; offset >= 0; offset--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - offset, 15);
    
    // Add 4-6 random transactions per month
    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const template = txTemplates[Math.floor(Math.random() * txTemplates.length)];
      if (!template.dept) continue;
      // Random variation +/- 15%
      const carbonVal = parseFloat((template.baseCarbon * (0.85 + Math.random() * 0.3)).toFixed(1));
      
      txCounter++;
      await prisma.carbonTransaction.create({
        data: {
          txId: `TX-${txCounter}`,
          departmentId: template.dept.id,
          operation: template.operation,
          product: template.product,
          carbon: carbonVal,
          timestamp: targetDate,
          status: 'Approved'
        }
      });
    }
  }
  console.log(`Created ${txCounter - 10000} carbon transactions.`);

  // 5. Create Sustainability Goals
  const goals = [
    { name: 'Reduce Manufacturing Grid Power', departmentId: manufacturing.id, owner: 'Sarah Connor', progress: 68, target: 120.0, remaining: 38.4, deadline: new Date('2026-12-31'), status: 'On Track', risk: 'Low' },
    { name: 'Electrify 80% Fleet Vehicles', departmentId: logistics.id, owner: 'James Smith', progress: 42, target: 80, remaining: 38, deadline: new Date('2026-10-15'), status: 'Behind Schedule', risk: 'High' },
    { name: 'Transition to LED/Smart Lighting', departmentId: offices.id, owner: 'Robert Patrick', progress: 100, target: 15.0, remaining: 0, deadline: new Date('2026-05-30'), status: 'Completed', risk: 'None' },
    { name: 'Cooling Unit Efficiency Upgrade', departmentId: it.id, owner: 'Linda Hamilton', progress: 75, target: 50.0, remaining: 12.5, deadline: new Date('2026-09-01'), status: 'On Track', risk: 'Medium' }
  ];

  for (const goal of goals) {
    const dbGoal = await prisma.sustainabilityGoal.create({
      data: goal
    });
    console.log(`Created sustainability goal: ${dbGoal.name}`);
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
