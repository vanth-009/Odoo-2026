const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting full ESG Platform database seeding...\n');

  // 1. Clean existing records in reverse dependency order
  console.log('🧹 Cleaning existing tables...');
  await prisma.notification.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.complianceIssue.deleteMany({});
  await prisma.auditFinding.deleteMany({});
  await prisma.audit.deleteMany({});
  await prisma.policyAcknowledgement.deleteMany({});
  await prisma.policyVersion.deleteMany({});
  await prisma.policy.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.trainingCompletion.deleteMany({});
  await prisma.surveyResponse.deleteMany({});
  await prisma.employeeParticipation.deleteMany({});
  await prisma.csrActivity.deleteMany({});
  await prisma.csrCategory.deleteMany({});
  await prisma.trainingProgram.deleteMany({});
  await prisma.engagementSurvey.deleteMany({});
  await prisma.environmentalReport.deleteMany({});
  await prisma.rewardRedemption.deleteMany({});
  await prisma.employeeBadge.deleteMany({});
  await prisma.xPTransaction.deleteMany({});
  await prisma.challengeParticipation.deleteMany({});
  await prisma.challenge.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.reward.deleteMany({});
  
  await prisma.sustainabilityGoal.deleteMany({});
  await prisma.carbonTransaction.deleteMany({});
  await prisma.productESGProfile.deleteMany({});
  await prisma.emissionFactor.deleteMany({});

  await prisma.employee.deleteMany({});
  await prisma.department.deleteMany({});
  console.log('✅ Database cleaned.\n');

  // 2. Create Departments (Unified list)
  const deptsData = [
    { name: 'Manufacturing', code: 'MFG', targetEmissions: 500.0, score: 62, status: 'Warning', trend: 'up', manager: 'Sarah Connor', employeeCount: 145 },
    { name: 'Logistics & Fleet', code: 'LOG', targetEmissions: 300.0, score: 85, status: 'On Track', trend: 'down', manager: 'James Smith', employeeCount: 68 },
    { name: 'Office Operations', code: 'OFF', targetEmissions: 90.0, score: 92, status: 'On Track', trend: 'down', manager: 'Robert Patrick', employeeCount: 220 },
    { name: 'R&D Labs', code: 'RD', targetEmissions: 100.0, score: 71, status: 'Warning', trend: 'up', manager: 'Dr. Silberman', employeeCount: 42 },
    { name: 'IT & Data Centers', code: 'IT', targetEmissions: 130.0, score: 78, status: 'On Track', trend: 'down', manager: 'Miles Dyson', employeeCount: 35 },
    { name: 'Marketing', code: 'MKT', targetEmissions: 35.0, score: 95, status: 'On Track', trend: 'down', manager: 'Sofia Martinez', employeeCount: 88 },
    { name: 'Corporate Events', code: 'EVT', targetEmissions: 30.0, score: 74, status: 'Warning', trend: 'up', manager: 'Peter Hollens', employeeCount: 12 },
    { name: 'Supply Chain Ops', code: 'SC', targetEmissions: 15.0, score: 89, status: 'On Track', trend: 'down', manager: 'John Connor', employeeCount: 50 },
    { name: 'Engineering', code: 'ENG', targetEmissions: 40.0, score: 88, status: 'On Track', trend: 'down', manager: 'Raj Patel', employeeCount: 12 },
    { name: 'Human Resources', code: 'HR', targetEmissions: 20.0, score: 90, status: 'On Track', trend: 'down', manager: 'Amara Okafor', employeeCount: 6 },
    { name: 'Finance', code: 'FIN', targetEmissions: 25.0, score: 91, status: 'On Track', trend: 'down', manager: 'David Chen', employeeCount: 5 },
    { name: 'Sales', code: 'SAL', targetEmissions: 30.0, score: 85, status: 'On Track', trend: 'down', manager: 'Marcus Johnson', employeeCount: 6 },
    { name: 'Legal', code: 'LEG', targetEmissions: 15.0, score: 94, status: 'On Track', trend: 'down', manager: 'Elena Vasquez', employeeCount: 3 },
    { name: 'Product', code: 'PRD', targetEmissions: 20.0, score: 92, status: 'On Track', trend: 'down', manager: 'Kenji Tanaka', employeeCount: 3 },
    { name: 'Compliance', code: 'COMP', targetEmissions: 10.0, score: 96, status: 'On Track', trend: 'down', manager: 'Amit Kumar', employeeCount: 5 },
    { name: 'ESG Committee', code: 'ESG', targetEmissions: 12.0, score: 95, status: 'On Track', trend: 'down', manager: 'Priya Patel', employeeCount: 8 }
  ];

  const depts = {};
  for (const item of deptsData) {
    const dept = await prisma.department.create({
      data: item
    });
    depts[item.code] = dept;
  }
  console.log(`✅ Created ${Object.keys(depts).length} unified departments.`);

  // 3. Create Employees (Unified list)
  const employeeData = [
    // Engineering (12)
    { code: 'EMP001', first: 'Arjun', last: 'Mehta', email: 'arjun.mehta@ecosphere.com', phone: '+1-415-555-0101', deptCode: 'ENG', designation: 'Senior Software Engineer', gender: 'MALE', dob: '1990-03-15', ethnicity: 'Asian', join: '2022-01-10', status: 'ACTIVE' },
    { code: 'EMP002', first: 'Priya', last: 'Sharma', email: 'priya.sharma@ecosphere.com', phone: '+1-415-555-0102', deptCode: 'ENG', designation: 'Full Stack Developer', gender: 'FEMALE', dob: '1994-07-22', ethnicity: 'Asian', join: '2023-03-15', status: 'ACTIVE' },
    { code: 'EMP003', first: 'Marcus', last: 'Williams', email: 'marcus.williams@ecosphere.com', phone: '+1-415-555-0103', deptCode: 'ENG', designation: 'DevOps Engineer', gender: 'MALE', dob: '1988-11-30', ethnicity: 'African American', join: '2021-06-01', status: 'ACTIVE' },
    { code: 'EMP004', first: 'Yuki', last: 'Nakamura', email: 'yuki.nakamura@ecosphere.com', phone: '+1-415-555-0104', deptCode: 'ENG', designation: 'Frontend Developer', gender: 'FEMALE', dob: '1996-02-14', ethnicity: 'Asian', join: '2023-09-01', status: 'ACTIVE' },
    { code: 'EMP005', first: 'Carlos', last: 'Rodriguez', email: 'carlos.rodriguez@ecosphere.com', phone: '+1-415-555-0105', deptCode: 'ENG', designation: 'Backend Developer', gender: 'MALE', dob: '1992-09-08', ethnicity: 'Hispanic', join: '2022-07-20', status: 'ACTIVE' },
    { code: 'EMP006', first: 'Aisha', last: 'Ibrahim', email: 'aisha.ibrahim@ecosphere.com', phone: '+1-415-555-0106', deptCode: 'ENG', designation: 'QA Engineer', gender: 'FEMALE', dob: '1993-05-19', ethnicity: 'Middle Eastern', join: '2023-01-09', status: 'ACTIVE' },
    { code: 'EMP007', first: 'Liam', last: 'O\'Brien', email: 'liam.obrien@ecosphere.com', phone: '+1-415-555-0107', deptCode: 'ENG', designation: 'Software Engineer', gender: 'MALE', dob: '1997-12-03', ethnicity: 'Caucasian', join: '2024-02-12', status: 'ACTIVE' },
    { code: 'EMP008', first: 'Wei', last: 'Zhang', email: 'wei.zhang@ecosphere.com', phone: '+1-415-555-0108', deptCode: 'ENG', designation: 'Data Engineer', gender: 'MALE', dob: '1991-08-25', ethnicity: 'Asian', join: '2022-04-18', status: 'ACTIVE' },
    { code: 'EMP009', first: 'Natasha', last: 'Petrova', email: 'natasha.petrova@ecosphere.com', phone: '+1-415-555-0109', deptCode: 'ENG', designation: 'Machine Learning Engineer', gender: 'FEMALE', dob: '1989-01-07', ethnicity: 'Caucasian', join: '2021-11-15', status: 'ACTIVE' },
    { code: 'EMP010', first: 'Kwame', last: 'Asante', email: 'kwame.asante@ecosphere.com', phone: '+1-415-555-0110', deptCode: 'ENG', designation: 'Cloud Architect', gender: 'MALE', dob: '1986-06-12', ethnicity: 'African American', join: '2020-09-01', status: 'ACTIVE' },
    { code: 'EMP011', first: 'Taylor', last: 'Morgan', email: 'taylor.morgan@ecosphere.com', phone: '+1-415-555-0111', deptCode: 'ENG', designation: 'Security Engineer', gender: 'NON_BINARY', dob: '1995-04-28', ethnicity: 'Caucasian', join: '2023-06-05', status: 'ACTIVE' },
    { code: 'EMP012', first: 'Raj', last: 'Patel', email: 'raj.patel@ecosphere.com', phone: '+1-415-555-0112', deptCode: 'ENG', designation: 'Engineering Manager', gender: 'MALE', dob: '1984-10-20', ethnicity: 'Asian', join: '2019-03-01', status: 'ACTIVE' },

    // Marketing (8)
    { code: 'EMP013', first: 'Sofia', last: 'Martinez', email: 'sofia.martinez@ecosphere.com', phone: '+1-415-555-0113', deptCode: 'MKT', designation: 'Marketing Director', gender: 'FEMALE', dob: '1985-12-05', ethnicity: 'Hispanic', join: '2020-01-15', status: 'ACTIVE' },
    { code: 'EMP014', first: 'James', last: 'Thompson', email: 'james.thompson@ecosphere.com', phone: '+1-415-555-0114', deptCode: 'MKT', designation: 'Content Strategist', gender: 'MALE', dob: '1993-03-17', ethnicity: 'Caucasian', join: '2022-08-22', status: 'ACTIVE' },
    { code: 'EMP015', first: 'Zara', last: 'Khan', email: 'zara.khan@ecosphere.com', phone: '+1-415-555-0115', deptCode: 'MKT', designation: 'Digital Marketing Specialist', gender: 'FEMALE', dob: '1996-09-30', ethnicity: 'Middle Eastern', join: '2023-05-10', status: 'ACTIVE' },
    { code: 'EMP016', first: 'Derek', last: 'Washington', email: 'derek.washington@ecosphere.com', phone: '+1-415-555-0116', deptCode: 'MKT', designation: 'Brand Manager', gender: 'MALE', dob: '1990-07-14', ethnicity: 'African American', join: '2021-10-03', status: 'ACTIVE' },
    { code: 'EMP017', first: 'Mei', last: 'Lin', email: 'mei.lin@ecosphere.com', phone: '+1-415-555-0117', deptCode: 'MKT', designation: 'Graphic Designer', gender: 'FEMALE', dob: '1998-01-22', ethnicity: 'Asian', join: '2024-01-08', status: 'ACTIVE' },
    { code: 'EMP018', first: 'Gabriel', last: 'Santos', email: 'gabriel.santos@ecosphere.com', phone: '+1-415-555-0118', deptCode: 'MKT', designation: 'Social Media Manager', gender: 'MALE', dob: '1995-11-09', ethnicity: 'Hispanic', join: '2023-07-14', status: 'ACTIVE' },
    { code: 'EMP019', first: 'Hannah', last: 'Mueller', email: 'hannah.mueller@ecosphere.com', phone: '+1-415-555-0119', deptCode: 'MKT', designation: 'SEO Analyst', gender: 'FEMALE', dob: '1994-06-28', ethnicity: 'Caucasian', join: '2022-12-01', status: 'ACTIVE' },
    { code: 'EMP020', first: 'Omar', last: 'Hassan', email: 'omar.hassan@ecosphere.com', phone: '+1-415-555-0120', deptCode: 'MKT', designation: 'Marketing Analyst', gender: 'MALE', dob: '1992-04-15', ethnicity: 'Middle Eastern', join: '2022-05-20', status: 'ACTIVE' },

    // Human Resources (6)
    { code: 'EMP021', first: 'Amara', last: 'Okafor', email: 'amara.okafor@ecosphere.com', phone: '+1-415-555-0121', deptCode: 'HR', designation: 'HR Director', gender: 'FEMALE', dob: '1983-08-17', ethnicity: 'African American', join: '2019-06-01', status: 'ACTIVE' },
    { code: 'EMP022', first: 'Ryan', last: 'Cooper', email: 'ryan.cooper@ecosphere.com', phone: '+1-415-555-0122', deptCode: 'HR', designation: 'Talent Acquisition Lead', gender: 'MALE', dob: '1991-02-03', ethnicity: 'Caucasian', join: '2021-04-12', status: 'ACTIVE' },
    { code: 'EMP023', first: 'Ananya', last: 'Gupta', email: 'ananya.gupta@ecosphere.com', phone: '+1-415-555-0123', deptCode: 'HR', designation: 'HR Business Partner', gender: 'FEMALE', dob: '1990-10-11', ethnicity: 'Asian', join: '2022-02-28', status: 'ACTIVE' },
    { code: 'EMP024', first: 'Jamal', last: 'Davis', email: 'jamal.davis@ecosphere.com', phone: '+1-415-555-0124', deptCode: 'HR', designation: 'People Operations Specialist', gender: 'MALE', dob: '1996-05-26', ethnicity: 'African American', join: '2023-08-14', status: 'ACTIVE' },
    { code: 'EMP025', first: 'Isabella', last: 'Rossi', email: 'isabella.rossi@ecosphere.com', phone: '+1-415-555-0125', deptCode: 'HR', designation: 'Learning & Development Manager', gender: 'FEMALE', dob: '1988-12-19', ethnicity: 'Caucasian', join: '2021-01-18', status: 'ACTIVE' },
    { code: 'EMP026', first: 'Hiroshi', last: 'Kimura', email: 'hiroshi.kimura@ecosphere.com', phone: '+1-415-555-0126', deptCode: 'HR', designation: 'Compensation Analyst', gender: 'MALE', dob: '1993-07-08', ethnicity: 'Asian', join: '2023-03-22', status: 'ACTIVE' },

    // Finance (5)
    { code: 'EMP027', first: 'David', last: 'Chen', email: 'david.chen@ecosphere.com', phone: '+1-415-555-0127', deptCode: 'FIN', designation: 'Finance Director', gender: 'MALE', dob: '1982-04-02', ethnicity: 'Asian', join: '2019-08-15', status: 'ACTIVE' },
    { code: 'EMP028', first: 'Sarah', last: 'Anderson', email: 'sarah.anderson@ecosphere.com', phone: '+1-415-555-0128', deptCode: 'FIN', designation: 'Senior Accountant', gender: 'FEMALE', dob: '1989-09-13', ethnicity: 'Caucasian', join: '2021-07-06', status: 'ACTIVE' },
    { code: 'EMP029', first: 'Ahmed', last: 'El-Sayed', email: 'ahmed.elsayed@ecosphere.com', phone: '+1-415-555-0129', deptCode: 'FIN', designation: 'Financial Analyst', gender: 'MALE', dob: '1994-01-28', ethnicity: 'Middle Eastern', join: '2023-02-13', status: 'ACTIVE' },
    { code: 'EMP030', first: 'Carmen', last: 'Reyes', email: 'carmen.reyes@ecosphere.com', phone: '+1-415-555-0130', deptCode: 'FIN', designation: 'Tax Specialist', gender: 'FEMALE', dob: '1991-11-07', ethnicity: 'Hispanic', join: '2022-09-19', status: 'ACTIVE' },
    { code: 'EMP031', first: 'Oluwaseun', last: 'Adeyemi', email: 'oluwaseun.adeyemi@ecosphere.com', phone: '+1-415-555-0131', deptCode: 'FIN', designation: 'Accounts Payable Coordinator', gender: 'MALE', dob: '1997-06-15', ethnicity: 'African American', join: '2024-03-04', status: 'ACTIVE' },

    // Corporate Governance & ESG Head (3)
    { code: 'EMP051', first: 'Amit', last: 'Kumar', email: 'amit.kumar@ecosphere.com', phone: '+1-415-555-0151', deptCode: 'COMP', designation: 'Chief Compliance Officer', gender: 'MALE', dob: '1980-01-15', ethnicity: 'Asian', join: '2022-01-15', status: 'ACTIVE' },
    { code: 'EMP052', first: 'Rahul', last: 'Sharma', email: 'rahul.sharma@ecosphere.com', phone: '+1-415-555-0152', deptCode: 'OFF', designation: 'Operations Manager', gender: 'MALE', dob: '1988-06-01', ethnicity: 'Asian', join: '2023-06-01', status: 'ACTIVE' },
    { code: 'EMP053', first: 'Priya', last: 'Patel', email: 'priya.patel@ecosphere.com', phone: '+1-415-555-0153', deptCode: 'ESG', designation: 'ESG Lead', gender: 'FEMALE', dob: '1992-03-10', ethnicity: 'Asian', join: '2024-03-10', status: 'ACTIVE' }
  ];

  // Also include remaining 18 social employees to reach index 50
  for (let i = 32; i <= 50; i++) {
    const code = `EMP${String(i).padStart(3, '0')}`;
    employeeData.push({
      code,
      first: `Employee_${i}`,
      last: `Last_${i}`,
      email: `${code.toLowerCase()}@ecosphere.com`,
      phone: `+1-415-555-01${i}`,
      deptCode: i % 2 === 0 ? 'MKT' : 'ENG',
      designation: 'Associate Staff',
      gender: i % 3 === 0 ? 'MALE' : 'FEMALE',
      dob: '1995-05-15',
      ethnicity: 'Caucasian',
      join: '2023-01-01',
      status: 'ACTIVE'
    });
  }

  const employees = [];
  const employeesMap = {};
  for (const e of employeeData) {
    const emp = await prisma.employee.create({
      data: {
        employeeCode: e.code,
        firstName: e.first,
        lastName: e.last,
        email: e.email,
        phone: e.phone,
        designation: e.designation,
        gender: e.gender,
        dateOfBirth: new Date(e.dob),
        ethnicity: e.ethnicity,
        joinDate: new Date(e.join),
        status: e.status,
        departmentId: depts[e.deptCode]?.id || null
      }
    });
    employees.push(emp);
    employeesMap[e.code] = emp;
  }
  console.log(`✅ Created ${employees.length} unified employees.`);

  // Update headEmployee references for compliance
  const complianceDept = depts['COMP'];
  const complianceHead = employeesMap['EMP051'];
  if (complianceDept && complianceHead) {
    await prisma.department.update({
      where: { id: complianceDept.id },
      data: { headEmployeeId: complianceHead.id }
    });
  }

  // Update managerId reference for Operations Manager
  const operationsManager = employeesMap['EMP052'];
  if (operationsManager && complianceHead) {
    await prisma.employee.update({
      where: { id: operationsManager.id },
      data: { managerId: complianceHead.id }
    });
  }

  // 4. Create Users (Governance Auth / Roles)
  const hashedPassword = await bcrypt.hash('123456', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'anilkumarjena4323@gmail.com',
      password: hashedPassword,
      role: 'company_admin'
    }
  });
  const secretaryUser = await prisma.user.create({
    data: {
      email: 'secretary@company.com',
      password: hashedPassword,
      role: 'company_secretary'
    }
  });
  console.log('✅ Created administrative users.');

  // 5. Create Companies & Documents (Governance Reports catalog)
  const company1 = await prisma.company.create({
    data: {
      tier: 'Tier 1',
      companyData: {
        companyName: 'Acme Corporates',
        officialCompanyEmail: 'contact@acme.com',
        pan: 'ABCDE1234F',
        paidUpCapital: 5000000
      },
      status: 'active'
    }
  });
  const company2 = await prisma.company.create({
    data: {
      tier: 'Tier 2',
      companyData: {
        companyName: 'Stark Industries',
        officialCompanyEmail: 'info@stark.com',
        pan: 'STARK9876I',
        paidUpCapital: 10000000
      },
      status: 'active'
    }
  });

  const doc1 = await prisma.document.create({
    data: {
      companyId: company1.id,
      categoryId: 'tds',
      title: 'TDS Report Q1',
      docType: 'report',
      fileName: 'tds_q1.pdf',
      filePath: '/uploads/tds_q1.pdf',
      mimeType: 'application/pdf',
      size: 1024,
      registeredAt: new Date(),
      uploadedAt: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      reminderSent: false
    }
  });

  const doc2 = await prisma.document.create({
    data: {
      companyId: company2.id,
      categoryId: 'compliance-status',
      title: 'Compliance Status Q1',
      docType: 'compliance',
      fileName: 'compliance_status_q1.pdf',
      filePath: '/uploads/compliance_status_q1.pdf',
      mimeType: 'application/pdf',
      size: 2048,
      registeredAt: new Date(),
      uploadedAt: new Date(),
      expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      reminderSent: true
    }
  });
  console.log('✅ Created corporate document registries.');

  // 6. Create CSR Categories
  const csrCategories = [];
  const categoriesList = [
    { name: 'Environmental Conservation', description: 'Activities focused on protecting natural ecosystems.', icon: '🌿', color: '#10B981' },
    { name: 'Community Development', description: 'Initiatives to strengthen local communities.', icon: '🏘️', color: '#6366F1' },
    { name: 'Education & Literacy', description: 'Programs aimed at improving access to learning.', icon: '📚', color: '#F59E0B' },
    { name: 'Health & Wellness', description: 'Campaigns promoting physical and mental health.', icon: '❤️', color: '#EF4444' }
  ];
  for (const cat of categoriesList) {
    const dbCat = await prisma.csrCategory.create({ data: cat });
    csrCategories.push(dbCat);
  }

  // 7. Create CSR Activities
  const csrActivities = [
    await prisma.csrActivity.create({
      data: {
        title: 'Coastal Mangrove Restoration Drive',
        description: 'Planting native mangrove saplings along the shorelines.',
        categoryId: csrCategories[0].id,
        location: 'San Francisco Bay, CA',
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-03-16'),
        maxParticipants: 40,
        xpReward: 25,
        status: 'COMPLETED',
        organizerName: 'Green Earth Foundation'
      }
    }),
    await prisma.csrActivity.create({
      data: {
        title: 'Urban Community Garden Project',
        description: 'Transforming an abandoned lot into a community garden.',
        categoryId: csrCategories[1].id,
        location: 'Tenderloin District, SF',
        startDate: new Date('2025-04-05'),
        endDate: new Date('2025-04-06'),
        maxParticipants: 30,
        xpReward: 20,
        status: 'COMPLETED',
        organizerName: 'Sofia Martinez'
      }
    }),
    await prisma.csrActivity.create({
      data: {
        title: 'STEM Mentorship for Underprivileged Youth',
        description: 'Six-week coding and electronics mentorship program.',
        categoryId: csrCategories[2].id,
        location: 'Mission High School, SF',
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-03-21'),
        maxParticipants: 20,
        xpReward: 50,
        status: 'COMPLETED',
        organizerName: 'Raj Patel'
      }
    }),
    await prisma.csrActivity.create({
      data: {
        title: 'E-Waste Recycling & Awareness',
        description: 'Responsible electronics recycling drive.',
        categoryId: csrCategories[0].id,
        location: 'EcoSphere HQ Parking Lot',
        startDate: new Date('2025-07-19'),
        endDate: new Date('2025-07-19'),
        maxParticipants: 80,
        xpReward: 10,
        status: 'ONGOING',
        organizerName: 'Marcus Williams'
      }
    })
  ];
  console.log(`✅ Created ${csrActivities.length} CSR activities.`);

  // 8. Create Employee Participations
  const volunteer1 = employeesMap['EMP001'];
  const volunteer2 = employeesMap['EMP002'];
  const volunteer3 = employeesMap['EMP003'];

  await prisma.employeeParticipation.create({
    data: {
      employeeId: volunteer1.id,
      activityId: csrActivities[0].id,
      registeredAt: new Date('2025-03-08'),
      completedAt: new Date('2025-03-16'),
      hoursContributed: 8.0,
      feedback: 'Amazing experience planting mangroves!',
      rating: 5,
      approvalStatus: 'APPROVED',
      approvedBy: 'Sofia Martinez',
      approvalDate: new Date('2025-03-18'),
      pointsEarned: 25
    }
  });

  await prisma.employeeParticipation.create({
    data: {
      employeeId: volunteer2.id,
      activityId: csrActivities[1].id,
      registeredAt: new Date('2025-03-28'),
      completedAt: new Date('2025-04-06'),
      hoursContributed: 10.0,
      feedback: 'Very rewarding community garden layout design.',
      rating: 5,
      approvalStatus: 'APPROVED',
      approvedBy: 'Amara Okafor',
      approvalDate: new Date('2025-04-08'),
      pointsEarned: 20
    }
  });

  await prisma.employeeParticipation.create({
    data: {
      employeeId: volunteer3.id,
      activityId: csrActivities[2].id,
      registeredAt: new Date('2025-02-03'),
      completedAt: new Date('2025-03-21'),
      hoursContributed: 30.0,
      feedback: 'Mentoring high school kids was fantastic.',
      rating: 5,
      approvalStatus: 'APPROVED',
      approvedBy: 'Raj Patel',
      approvalDate: new Date('2025-03-23'),
      pointsEarned: 50
    }
  });

  // 9. Engagement Surveys
  const survey = await prisma.engagementSurvey.create({
    data: {
      title: 'Q3 2025 Employee Engagement Survey',
      description: 'Third quarter pulse survey focusing on team dynamics and wellness.',
      quarter: 'Q3',
      year: 2025,
      isActive: true
    }
  });

  await prisma.surveyResponse.create({
    data: {
      surveyId: survey.id,
      employeeId: volunteer1.id,
      overallScore: 8,
      workLifeBalance: 7,
      teamCollaboration: 9,
      growthOpportunities: 8,
      managementSupport: 8,
      comments: 'Work culture is great. Keep it up!',
      submittedAt: new Date()
    }
  });

  await prisma.surveyResponse.create({
    data: {
      surveyId: survey.id,
      employeeId: volunteer2.id,
      overallScore: 9,
      workLifeBalance: 9,
      teamCollaboration: 9,
      growthOpportunities: 8,
      managementSupport: 9,
      comments: 'Fascinated by the carbon accounting integration.',
      submittedAt: new Date()
    }
  });

  // 10. Training Programs
  const program = await prisma.trainingProgram.create({
    data: {
      title: 'ESG Fundamentals & Sustainability Reporting',
      description: 'Introductory course on carbon accounting and ESG metrics.',
      category: 'Compliance',
      durationHours: 8,
      isMandatory: true,
      deadline: new Date('2025-06-30'),
      status: 'ACTIVE'
    }
  });

  await prisma.trainingCompletion.create({
    data: {
      trainingId: program.id,
      employeeId: volunteer1.id,
      startedAt: new Date('2025-04-01'),
      completedAt: new Date('2025-04-15'),
      score: 92.5,
      status: 'COMPLETED',
      certificateUrl: 'https://ecosphere.com/certificates/emp001.pdf'
    }
  });
  console.log('✅ Created engagement surveys & training completions.');

  // 11. Seed ESG Corporate Policies (Governance)
  const policy1 = await prisma.policy.create({
    data: {
      policyName: 'Code of Business Conduct',
      category: 'Ethics & Integrity',
      description: 'Standards of ethical behavior, conflict of interest, and corporate compliance.',
      version: '2.1',
      effectiveDate: new Date('2026-01-01'),
      expiryDate: new Date('2027-01-01'),
      ownerDepartmentId: complianceDept ? complianceDept.id : null,
      ownerEmployeeId: complianceHead ? complianceHead.id : null,
      documentUrl: '/uploads/policies/code_of_conduct_v2.1.pdf',
      status: 'Active',
      createdBy: 'System'
    }
  });

  const pVer1 = await prisma.policyVersion.create({
    data: {
      policyId: policy1.id,
      versionNumber: '2.1',
      documentUrl: '/uploads/policies/code_of_conduct_v2.1.pdf',
      changeSummary: 'Updated gift policies and whistleblowing hotlines.',
      effectiveDate: new Date('2026-01-01'),
      uploadedBy: 'Amit Kumar'
    }
  });

  await prisma.policyAcknowledgement.create({
    data: {
      policyId: policy1.id,
      employeeId: volunteer1.id,
      versionNumber: '2.1',
      status: 'Accepted',
      acceptedAt: new Date(),
      ipAddress: '192.168.1.55',
      remarks: 'Read and understood.'
    }
  });

  await prisma.policyAcknowledgement.create({
    data: {
      policyId: policy1.id,
      employeeId: volunteer2.id,
      versionNumber: '2.1',
      status: 'Pending'
    }
  });
  console.log('✅ Created Governance ESG policies & version controls.');

  // 12. Seed Audits & Findings
  const auditOps = await prisma.audit.create({
    data: {
      name: 'Q2 ESG Performance Review',
      departmentId: depts['MFG'] ? depts['MFG'].id : depts['OFF'].id,
      auditType: 'ESG Compliance',
      auditorEmployeeId: complianceHead ? complianceHead.id : null,
      startDate: new Date('2026-04-10'),
      endDate: new Date('2026-04-20'),
      status: 'Completed',
      score: 88.5,
      remarks: 'Manufacturing team met all waste disposal targets but emission log sheets were late.',
      createdBy: 'System'
    }
  });

  const finding1 = await prisma.auditFinding.create({
    data: {
      auditId: auditOps.id,
      title: 'Delayed Carbon Log Sheet Entry',
      description: 'The carbon calculations for Scope 1 natural gas usage were submitted 5 days late.',
      severity: 'Medium',
      status: 'Resolved',
      evidenceUrl: '/uploads/evidences/delayed_log_reasons.pdf'
    }
  });

  const issue1 = await prisma.complianceIssue.create({
    data: {
      auditId: auditOps.id,
      departmentId: depts['MFG'] ? depts['MFG'].id : depts['OFF'].id,
      ownerEmployeeId: operationsManager ? operationsManager.id : null,
      title: 'Cylinder Leakage in Assembly Line B',
      description: 'Minor natural gas pressure drop detected indicating potential seal failures.',
      severity: 'High',
      dueDate: new Date('2026-07-30'),
      status: 'In Progress'
    }
  });

  await prisma.evidence.create({
    data: {
      issueId: issue1.id,
      uploadedBy: 'Rahul Sharma',
      fileUrl: '/uploads/evidences/cylinder_valve_photo.jpg',
      fileType: 'image/jpeg'
    }
  });

  await prisma.notification.create({
    data: {
      employeeId: volunteer1.id,
      title: 'New Policy Acknowledgement Required',
      message: 'Please review and accept the Code of Business Conduct version 2.1.',
      type: 'Policy Reminder',
      referenceType: 'Policy',
      referenceId: policy1.id
    }
  });
  console.log('✅ Created Audits, findings, compliance issues, and notification queues.');

  // 13. Seed Environmental Factors
  const factors = [
    { name: 'Diesel Fuel Factor', category: 'Fuel', subcategory: 'Mobile Combustion', unit: 'liters', value: 2.68, source: 'EPA Hub 2025', version: '1.2.0', status: 'ACTIVE' },
    { name: 'Petrol Factor', category: 'Fuel', subcategory: 'Mobile Combustion', unit: 'liters', value: 2.31, source: 'EPA Hub 2025', version: '1.1.0', status: 'ACTIVE' },
    { name: 'Electricity Grid Factor', category: 'Electricity', subcategory: 'Scope 2', unit: 'kWh', value: 0.385, source: 'EIA eGRID 2025', version: '2.0.1', status: 'ACTIVE' },
    { name: 'Natural Gas Factor', category: 'Fuel', subcategory: 'Stationary Combustion', unit: 'm³', value: 2.03, source: 'EPA Hub 2025', version: '1.0.0', status: 'ACTIVE' },
    { name: 'Air Travel Factor', category: 'Business Travel', subcategory: 'Scope 3 Category 6', unit: 'passenger-km', value: 0.12, source: 'DEFRA 2025', version: '3.0.0', status: 'ACTIVE' },
    { name: 'Paper Packaging Factor', category: 'Material', subcategory: 'Upstream Materials', unit: 'kg', value: 0.92, source: 'ECOINVENT v3.10', version: '2.0.0', status: 'ACTIVE' }
  ];

  const dbFactors = [];
  for (const fact of factors) {
    const f = await prisma.emissionFactor.create({ data: fact });
    dbFactors.push(f);
  }

  // 14. Seed Product ESG Profiles
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
      description: 'High-strength structural steel reinforcement bars.',
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
      lifecycleStage: 'Raw Extraction',
      hazardClass: 'Skin Irritant',
      carbonCategory: 'Scope 3 Purchased Goods',
      preferredEmissionFactorId: paperFactor ? paperFactor.id : null,
      esgRating: 'BBB',
      description: 'Portland cement bagged in compostable kraft paper sacks.',
      status: 'ACTIVE'
    },
    {
      name: 'Premium Biodiesel B20',
      code: 'PROD-DSL-B20',
      category: 'Energy & Fuels',
      supplier: 'Chevron Renewable',
      packagingType: 'Bulk Liquid',
      recyclablePercent: 0.0,
      manufacturingCountry: 'United States',
      lifecycleStage: 'Combustion',
      hazardClass: 'Flammable Liquid',
      carbonCategory: 'Scope 1 Fuel',
      preferredEmissionFactorId: dieselFactor ? dieselFactor.id : null,
      esgRating: 'AA',
      description: '20% soybean-based biodiesel fuel.',
      status: 'ACTIVE'
    }
  ];

  const dbProducts = [];
  for (const prod of products) {
    const p = await prisma.productESGProfile.create({ data: prod });
    dbProducts.push(p);
  }

  // 15. Create Carbon Transactions spanning last 12 months
  const now = new Date();
  const txTemplates = [
    { dept: depts['MFG'], operation: 'Assembly Line Boiler Run', product: 'Natural Gas', source: 'Manufacturing', baseQty: 100, factor: dbFactors.find(f => f.name === 'Natural Gas Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-DSL-B20'), notes: 'Steam generator combustion' },
    { dept: depts['LOG'], operation: 'Freight Distribution Zone A', product: 'Diesel Fuel', source: 'Fleet', baseQty: 50, factor: dbFactors.find(f => f.name === 'Diesel Fuel Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-DSL-B20'), notes: 'Medium truck fleet dispatch' },
    { dept: depts['IT'], operation: 'Data Center Cooling Cycle', product: 'Electricity Grid', source: 'Electricity', baseQty: 200, factor: dbFactors.find(f => f.name === 'Electricity Grid Factor'), prodRef: null, notes: 'Server farm power consumption' },
    { dept: depts['OFF'], operation: 'HQ HVAC Daily Run', product: 'Electricity Grid', source: 'Electricity', baseQty: 100, factor: dbFactors.find(f => f.name === 'Electricity Grid Factor'), prodRef: dbProducts.find(p => p.code === 'PROD-CEM-50KG'), notes: 'Administrative building daily power' }
  ];

  let txCounter = 10000;
  for (let offset = 11; offset >= 0; offset--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - offset, 15);
    const count = 4;
    for (let i = 0; i < count; i++) {
      const template = txTemplates[i % txTemplates.length];
      if (!template.dept || !template.factor) continue;

      const qty = parseFloat((template.baseQty * (0.9 + Math.random() * 0.2)).toFixed(1));
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

  // 16. Sustainability Goals
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixMonthsHence = new Date();
  sixMonthsHence.setMonth(sixMonthsHence.getMonth() + 6);

  await prisma.sustainabilityGoal.create({
    data: {
      name: 'Reduce Fleet Emissions by 20%',
      description: 'Optimize routing and transition vehicles to biodiesel.',
      departmentId: depts['LOG'].id,
      category: 'Reduce Fleet Emissions',
      baselineCarbon: 550.0,
      targetCarbon: 440.0,
      startDate: sixMonthsAgo,
      targetDate: sixMonthsHence,
      owner: 'James Smith',
      priority: 'High',
      status: 'Active'
    }
  });

  await prisma.sustainabilityGoal.create({
    data: {
      name: 'Lower Office Electricity Usage',
      description: 'Establish smart thermostats and automatic shutdown cycles.',
      departmentId: depts['OFF'].id,
      category: 'Reduce Electricity Consumption',
      baselineCarbon: 320.0,
      targetCarbon: 250.0,
      startDate: sixMonthsAgo,
      targetDate: sixMonthsHence,
      owner: 'Robert Patrick',
      priority: 'Medium',
      status: 'On Track'
    }
  });

  console.log(`✅ Created Environmental emissions targets & goals.`);

  // ─── Gamification Seeding ──────────────────────────────────────────────────
  console.log('🌱 Seeding Gamification data...');

  const challenge1 = await prisma.challenge.create({
    data: {
      title: 'Water Saving Challenge',
      category: 'Environmental',
      description: 'Establish household or office water-saving habits. Fix leaking faucets or install aerators.',
      difficulty: 'Medium',
      evidenceRequired: 'Upload photos of water meter or faucet aerator installations',
      xp: 150,
      startDate: new Date('2026-07-01'),
      deadline: new Date('2026-07-31'),
      status: 'Active',
      createdBy: 'Sarah Connor'
    }
  });

  const challenge2 = await prisma.challenge.create({
    data: {
      title: 'Reduce Printing Waste',
      category: 'Office Operations',
      description: 'Achieve zero paper printing for 1 week.',
      difficulty: 'Easy',
      evidenceRequired: 'Submit screenshot of printer log indicating 0 pages printed',
      xp: 100,
      startDate: new Date('2026-07-05'),
      deadline: new Date('2026-07-15'),
      status: 'Active',
      createdBy: 'Sarah Connor'
    }
  });

  const challenge3 = await prisma.challenge.create({
    data: {
      title: 'Zero Waste Day',
      category: 'Environmental',
      description: 'Spend an entire day without producing any landfill waste.',
      difficulty: 'Hard',
      evidenceRequired: 'Upload photos of compost bin and recyclable assortments',
      xp: 300,
      startDate: new Date('2026-07-10'),
      deadline: new Date('2026-07-20'),
      status: 'Under Review',
      createdBy: 'Sarah Connor'
    }
  });

  const badge1 = await prisma.badge.create({
    data: {
      name: 'Eco Warrior',
      description: 'Completed 10 sustainability challenges or earned 1000 XP',
      icon: '🏅',
      unlockRule: 'Complete 10 Challenges or Earn 1000 XP',
      xpThreshold: 1000,
      challengesCountThreshold: 10,
      status: 'ACTIVE'
    }
  });

  const badge2 = await prisma.badge.create({
    data: {
      name: 'Green Champion',
      description: 'Earned 500 XP in sustainability activities',
      icon: '🏆',
      unlockRule: 'Earn 500 XP',
      xpThreshold: 500,
      status: 'ACTIVE'
    }
  });

  const badge3 = await prisma.badge.create({
    data: {
      name: 'Water Saver',
      description: 'Completed the Water Saving Challenge',
      icon: '💧',
      unlockRule: 'Complete Water Saving Challenge',
      challengesCountThreshold: 1,
      status: 'ACTIVE'
    }
  });

  const reward1 = await prisma.reward.create({
    data: {
      name: 'Cafeteria Coffee Voucher',
      costXp: 100,
      stock: 50,
      description: 'Get a free eco-friendly premium coffee at the headquarters cafeteria.',
      status: 'ACTIVE'
    }
  });

  const reward2 = await prisma.reward.create({
    data: {
      name: 'Amazon Gift Card (500 INR)',
      costXp: 500,
      stock: 10,
      description: 'INR 500 electronic gift card for Amazon India purchases.',
      status: 'ACTIVE'
    }
  });

  const reward3 = await prisma.reward.create({
    data: {
      name: 'Tree Plantation Certificate',
      costXp: 200,
      stock: 100,
      description: 'We will plant a certified native tree in your name to restore forest canopy.',
      status: 'ACTIVE'
    }
  });

  const reward4 = await prisma.reward.create({
    data: {
      name: 'Extra Paid Day Off',
      costXp: 1000,
      stock: 5,
      description: 'Apply for 1 additional day of fully paid leave.',
      status: 'ACTIVE'
    }
  });

  // Seed participations using the core employees map
  const e1 = employeesMap['EMP001'];
  const e2 = employeesMap['EMP002'];
  const e3 = employeesMap['EMP003'];

  if (e1 && e2 && e3) {
    // EMP001 completed printing challenge, earned 100 XP
    await prisma.challengeParticipation.create({
      data: {
        challengeId: challenge2.id,
        employeeId: e1.id,
        progress: 100,
        proof: 'Link to print logs: /uploads/proofs/printer_log_emp001.png',
        approvalStatus: 'APPROVED',
        submittedAt: new Date('2026-07-10'),
        approvedAt: new Date('2026-07-11'),
        approvedBy: 'Sarah Connor'
      }
    });

    await prisma.xPTransaction.create({
      data: {
        employeeId: e1.id,
        challengeId: challenge2.id,
        xp: 100,
        activityName: 'Completed Challenge: Reduce Printing Waste'
      }
    });

    // EMP002 participating in water saving challenge (progress 50%)
    await prisma.challengeParticipation.create({
      data: {
        challengeId: challenge1.id,
        employeeId: e2.id,
        progress: 50,
        approvalStatus: 'PENDING',
        createdAt: new Date('2026-07-08')
      }
    });

    // EMP003 completed water saving, pending approval, submitted proof
    await prisma.challengeParticipation.create({
      data: {
        challengeId: challenge1.id,
        employeeId: e3.id,
        progress: 100,
        proof: 'Faucet aerator receipt and photo uploaded to /uploads/proofs/aerator_install.jpg',
        approvalStatus: 'PENDING',
        submittedAt: new Date('2026-07-12')
      }
    });

    // Seed badge award
    await prisma.employeeBadge.create({
      data: {
        employeeId: e1.id,
        badgeId: badge2.id,
        earnedAt: new Date('2026-07-11')
      }
    });

    // Seed reward redemption
    await prisma.rewardRedemption.create({
      data: {
        employeeId: e1.id,
        rewardId: reward1.id,
        xpUsed: 100,
        status: 'DELIVERED',
        createdAt: new Date('2026-07-12')
      }
    });
  }

  console.log('✅ Created Gamification mock challenges, badges, and rewards.');

  console.log('\n⭐ Database successfully seeded! ⭐');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
