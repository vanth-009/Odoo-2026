import {
  PrismaClient,
  Gender,
  EmployeeStatus,
  ActivityStatus,
  ApprovalStatus,
  TrainingCompletionStatus,
  ProgramStatus,
} from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding EcoSphere Social Module database...\n')

  // ── Clean existing data in reverse dependency order ─────────────────────
  await prisma.trainingCompletion.deleteMany()
  await prisma.surveyResponse.deleteMany()
  await prisma.employeeParticipation.deleteMany()
  await prisma.csrActivity.deleteMany()
  await prisma.csrCategory.deleteMany()
  await prisma.trainingProgram.deleteMany()
  await prisma.engagementSurvey.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.department.deleteMany()

  console.log('✅ Cleaned existing data\n')

  // ── 1. Departments ─────────────────────────────────────────────────────
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Engineering',
        code: 'ENG',
        description: 'Software engineering and platform development',
        headName: 'Raj Patel',
        employeeCount: 12,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Marketing',
        code: 'MKT',
        description: 'Brand strategy, digital marketing, and communications',
        headName: 'Sofia Martinez',
        employeeCount: 8,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Human Resources',
        code: 'HR',
        description: 'Talent acquisition, employee relations, and people operations',
        headName: 'Amara Okafor',
        employeeCount: 6,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Finance',
        code: 'FIN',
        description: 'Financial planning, accounting, and compliance',
        headName: 'David Chen',
        employeeCount: 5,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Operations',
        code: 'OPS',
        description: 'Supply chain management and operational excellence',
        headName: 'Fatima Al-Hassan',
        employeeCount: 7,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Sales',
        code: 'SAL',
        description: 'Enterprise sales, business development, and partnerships',
        headName: 'Marcus Johnson',
        employeeCount: 6,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Legal',
        code: 'LEG',
        description: 'Corporate law, regulatory compliance, and intellectual property',
        headName: 'Elena Vasquez',
        employeeCount: 3,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Product',
        code: 'PRD',
        description: 'Product strategy, design, and user experience',
        headName: 'Kenji Tanaka',
        employeeCount: 3,
      },
    }),
  ])

  console.log(`✅ Created ${departments.length} departments`)

  // ── 2. Employees (50) ──────────────────────────────────────────────────
  const employeeData = [
    // Engineering (12)
    { code: 'EMP001', first: 'Arjun', last: 'Mehta', email: 'arjun.mehta@ecosphere.com', phone: '+1-415-555-0101', deptIdx: 0, designation: 'Senior Software Engineer', gender: Gender.MALE, dob: '1990-03-15', ethnicity: 'Asian', join: '2022-01-10', status: EmployeeStatus.ACTIVE },
    { code: 'EMP002', first: 'Priya', last: 'Sharma', email: 'priya.sharma@ecosphere.com', phone: '+1-415-555-0102', deptIdx: 0, designation: 'Full Stack Developer', gender: Gender.FEMALE, dob: '1994-07-22', ethnicity: 'Asian', join: '2023-03-15', status: EmployeeStatus.ACTIVE },
    { code: 'EMP003', first: 'Marcus', last: 'Williams', email: 'marcus.williams@ecosphere.com', phone: '+1-415-555-0103', deptIdx: 0, designation: 'DevOps Engineer', gender: Gender.MALE, dob: '1988-11-30', ethnicity: 'African American', join: '2021-06-01', status: EmployeeStatus.ACTIVE },
    { code: 'EMP004', first: 'Yuki', last: 'Nakamura', email: 'yuki.nakamura@ecosphere.com', phone: '+1-415-555-0104', deptIdx: 0, designation: 'Frontend Developer', gender: Gender.FEMALE, dob: '1996-02-14', ethnicity: 'Asian', join: '2023-09-01', status: EmployeeStatus.ACTIVE },
    { code: 'EMP005', first: 'Carlos', last: 'Rodriguez', email: 'carlos.rodriguez@ecosphere.com', phone: '+1-415-555-0105', deptIdx: 0, designation: 'Backend Developer', gender: Gender.MALE, dob: '1992-09-08', ethnicity: 'Hispanic', join: '2022-07-20', status: EmployeeStatus.ACTIVE },
    { code: 'EMP006', first: 'Aisha', last: 'Ibrahim', email: 'aisha.ibrahim@ecosphere.com', phone: '+1-415-555-0106', deptIdx: 0, designation: 'QA Engineer', gender: Gender.FEMALE, dob: '1993-05-19', ethnicity: 'Middle Eastern', join: '2023-01-09', status: EmployeeStatus.ACTIVE },
    { code: 'EMP007', first: 'Liam', last: 'O\'Brien', email: 'liam.obrien@ecosphere.com', phone: '+1-415-555-0107', deptIdx: 0, designation: 'Software Engineer', gender: Gender.MALE, dob: '1997-12-03', ethnicity: 'Caucasian', join: '2024-02-12', status: EmployeeStatus.ACTIVE },
    { code: 'EMP008', first: 'Wei', last: 'Zhang', email: 'wei.zhang@ecosphere.com', phone: '+1-415-555-0108', deptIdx: 0, designation: 'Data Engineer', gender: Gender.MALE, dob: '1991-08-25', ethnicity: 'Asian', join: '2022-04-18', status: EmployeeStatus.ACTIVE },
    { code: 'EMP009', first: 'Natasha', last: 'Petrova', email: 'natasha.petrova@ecosphere.com', phone: '+1-415-555-0109', deptIdx: 0, designation: 'Machine Learning Engineer', gender: Gender.FEMALE, dob: '1989-01-07', ethnicity: 'Caucasian', join: '2021-11-15', status: EmployeeStatus.ACTIVE },
    { code: 'EMP010', first: 'Kwame', last: 'Asante', email: 'kwame.asante@ecosphere.com', phone: '+1-415-555-0110', deptIdx: 0, designation: 'Cloud Architect', gender: Gender.MALE, dob: '1986-06-12', ethnicity: 'African American', join: '2020-09-01', status: EmployeeStatus.ACTIVE },
    { code: 'EMP011', first: 'Taylor', last: 'Morgan', email: 'taylor.morgan@ecosphere.com', phone: '+1-415-555-0111', deptIdx: 0, designation: 'Security Engineer', gender: Gender.FEMALE, dob: '1995-04-28', ethnicity: 'Caucasian', join: '2023-06-05', status: EmployeeStatus.ACTIVE },
    { code: 'EMP012', first: 'Raj', last: 'Patel', email: 'raj.patel@ecosphere.com', phone: '+1-415-555-0112', deptIdx: 0, designation: 'Engineering Manager', gender: Gender.MALE, dob: '1984-10-20', ethnicity: 'Asian', join: '2019-03-01', status: EmployeeStatus.ACTIVE },

    // Marketing (8)
    { code: 'EMP013', first: 'Sofia', last: 'Martinez', email: 'sofia.martinez@ecosphere.com', phone: '+1-415-555-0113', deptIdx: 1, designation: 'Marketing Director', gender: Gender.FEMALE, dob: '1985-12-05', ethnicity: 'Hispanic', join: '2020-01-15', status: EmployeeStatus.ACTIVE },
    { code: 'EMP014', first: 'James', last: 'Thompson', email: 'james.thompson@ecosphere.com', phone: '+1-415-555-0114', deptIdx: 1, designation: 'Content Strategist', gender: Gender.MALE, dob: '1993-03-17', ethnicity: 'Caucasian', join: '2022-08-22', status: EmployeeStatus.ACTIVE },
    { code: 'EMP015', first: 'Zara', last: 'Khan', email: 'zara.khan@ecosphere.com', phone: '+1-415-555-0115', deptIdx: 1, designation: 'Digital Marketing Specialist', gender: Gender.FEMALE, dob: '1996-09-30', ethnicity: 'Middle Eastern', join: '2023-05-10', status: EmployeeStatus.ACTIVE },
    { code: 'EMP016', first: 'Derek', last: 'Washington', email: 'derek.washington@ecosphere.com', phone: '+1-415-555-0116', deptIdx: 1, designation: 'Brand Manager', gender: Gender.MALE, dob: '1990-07-14', ethnicity: 'African American', join: '2021-10-03', status: EmployeeStatus.ACTIVE },
    { code: 'EMP017', first: 'Mei', last: 'Lin', email: 'mei.lin@ecosphere.com', phone: '+1-415-555-0117', deptIdx: 1, designation: 'Graphic Designer', gender: Gender.FEMALE, dob: '1998-01-22', ethnicity: 'Asian', join: '2024-01-08', status: EmployeeStatus.ACTIVE },
    { code: 'EMP018', first: 'Gabriel', last: 'Santos', email: 'gabriel.santos@ecosphere.com', phone: '+1-415-555-0118', deptIdx: 1, designation: 'Social Media Manager', gender: Gender.MALE, dob: '1995-11-09', ethnicity: 'Hispanic', join: '2023-07-14', status: EmployeeStatus.ACTIVE },
    { code: 'EMP019', first: 'Hannah', last: 'Mueller', email: 'hannah.mueller@ecosphere.com', phone: '+1-415-555-0119', deptIdx: 1, designation: 'SEO Analyst', gender: Gender.FEMALE, dob: '1994-06-28', ethnicity: 'Caucasian', join: '2022-12-01', status: EmployeeStatus.ACTIVE },
    { code: 'EMP020', first: 'Omar', last: 'Hassan', email: 'omar.hassan@ecosphere.com', phone: '+1-415-555-0120', deptIdx: 1, designation: 'Marketing Analyst', gender: Gender.MALE, dob: '1992-04-15', ethnicity: 'Middle Eastern', join: '2022-05-20', status: EmployeeStatus.ACTIVE },

    // Human Resources (6)
    { code: 'EMP021', first: 'Amara', last: 'Okafor', email: 'amara.okafor@ecosphere.com', phone: '+1-415-555-0121', deptIdx: 2, designation: 'HR Director', gender: Gender.FEMALE, dob: '1983-08-17', ethnicity: 'African American', join: '2019-06-01', status: EmployeeStatus.ACTIVE },
    { code: 'EMP022', first: 'Ryan', last: 'Cooper', email: 'ryan.cooper@ecosphere.com', phone: '+1-415-555-0122', deptIdx: 2, designation: 'Talent Acquisition Lead', gender: Gender.MALE, dob: '1991-02-03', ethnicity: 'Caucasian', join: '2021-04-12', status: EmployeeStatus.ACTIVE },
    { code: 'EMP023', first: 'Ananya', last: 'Gupta', email: 'ananya.gupta@ecosphere.com', phone: '+1-415-555-0123', deptIdx: 2, designation: 'HR Business Partner', gender: Gender.FEMALE, dob: '1990-10-11', ethnicity: 'Asian', join: '2022-02-28', status: EmployeeStatus.ACTIVE },
    { code: 'EMP024', first: 'Jamal', last: 'Davis', email: 'jamal.davis@ecosphere.com', phone: '+1-415-555-0124', deptIdx: 2, designation: 'People Operations Specialist', gender: Gender.MALE, dob: '1996-05-26', ethnicity: 'African American', join: '2023-08-14', status: EmployeeStatus.ACTIVE },
    { code: 'EMP025', first: 'Isabella', last: 'Rossi', email: 'isabella.rossi@ecosphere.com', phone: '+1-415-555-0125', deptIdx: 2, designation: 'Learning & Development Manager', gender: Gender.FEMALE, dob: '1988-12-19', ethnicity: 'Caucasian', join: '2021-01-18', status: EmployeeStatus.ACTIVE },
    { code: 'EMP026', first: 'Hiroshi', last: 'Kimura', email: 'hiroshi.kimura@ecosphere.com', phone: '+1-415-555-0126', deptIdx: 2, designation: 'Compensation Analyst', gender: Gender.MALE, dob: '1993-07-08', ethnicity: 'Asian', join: '2023-03-22', status: EmployeeStatus.ACTIVE },

    // Finance (5)
    { code: 'EMP027', first: 'David', last: 'Chen', email: 'david.chen@ecosphere.com', phone: '+1-415-555-0127', deptIdx: 3, designation: 'Finance Director', gender: Gender.MALE, dob: '1982-04-02', ethnicity: 'Asian', join: '2019-08-15', status: EmployeeStatus.ACTIVE },
    { code: 'EMP028', first: 'Sarah', last: 'Anderson', email: 'sarah.anderson@ecosphere.com', phone: '+1-415-555-0128', deptIdx: 3, designation: 'Senior Accountant', gender: Gender.FEMALE, dob: '1989-09-13', ethnicity: 'Caucasian', join: '2021-07-06', status: EmployeeStatus.ACTIVE },
    { code: 'EMP029', first: 'Ahmed', last: 'El-Sayed', email: 'ahmed.elsayed@ecosphere.com', phone: '+1-415-555-0129', deptIdx: 3, designation: 'Financial Analyst', gender: Gender.MALE, dob: '1994-01-28', ethnicity: 'Middle Eastern', join: '2023-02-13', status: EmployeeStatus.ACTIVE },
    { code: 'EMP030', first: 'Carmen', last: 'Reyes', email: 'carmen.reyes@ecosphere.com', phone: '+1-415-555-0130', deptIdx: 3, designation: 'Tax Specialist', gender: Gender.FEMALE, dob: '1991-11-07', ethnicity: 'Hispanic', join: '2022-09-19', status: EmployeeStatus.ACTIVE },
    { code: 'EMP031', first: 'Oluwaseun', last: 'Adeyemi', email: 'oluwaseun.adeyemi@ecosphere.com', phone: '+1-415-555-0131', deptIdx: 3, designation: 'Accounts Payable Coordinator', gender: Gender.MALE, dob: '1997-06-15', ethnicity: 'African American', join: '2024-03-04', status: EmployeeStatus.ACTIVE },

    // Operations (7)
    { code: 'EMP032', first: 'Fatima', last: 'Al-Hassan', email: 'fatima.alhassan@ecosphere.com', phone: '+1-415-555-0132', deptIdx: 4, designation: 'Operations Director', gender: Gender.FEMALE, dob: '1984-03-21', ethnicity: 'Middle Eastern', join: '2020-02-10', status: EmployeeStatus.ACTIVE },
    { code: 'EMP033', first: 'Patrick', last: 'O\'Sullivan', email: 'patrick.osullivan@ecosphere.com', phone: '+1-415-555-0133', deptIdx: 4, designation: 'Supply Chain Manager', gender: Gender.MALE, dob: '1987-08-04', ethnicity: 'Caucasian', join: '2021-05-24', status: EmployeeStatus.ACTIVE },
    { code: 'EMP034', first: 'Ling', last: 'Wu', email: 'ling.wu@ecosphere.com', phone: '+1-415-555-0134', deptIdx: 4, designation: 'Logistics Coordinator', gender: Gender.FEMALE, dob: '1995-12-16', ethnicity: 'Asian', join: '2023-04-03', status: EmployeeStatus.ACTIVE },
    { code: 'EMP035', first: 'Andre', last: 'Jackson', email: 'andre.jackson@ecosphere.com', phone: '+1-415-555-0135', deptIdx: 4, designation: 'Warehouse Supervisor', gender: Gender.MALE, dob: '1990-02-27', ethnicity: 'African American', join: '2022-06-13', status: EmployeeStatus.ACTIVE },
    { code: 'EMP036', first: 'Maria', last: 'Fernandez', email: 'maria.fernandez@ecosphere.com', phone: '+1-415-555-0136', deptIdx: 4, designation: 'Quality Assurance Lead', gender: Gender.FEMALE, dob: '1992-10-08', ethnicity: 'Hispanic', join: '2022-11-28', status: EmployeeStatus.ACTIVE },
    { code: 'EMP037', first: 'Sebastian', last: 'Keller', email: 'sebastian.keller@ecosphere.com', phone: '+1-415-555-0137', deptIdx: 4, designation: 'Process Improvement Analyst', gender: Gender.MALE, dob: '1994-07-19', ethnicity: 'Caucasian', join: '2023-10-16', status: EmployeeStatus.ACTIVE },
    { code: 'EMP038', first: 'Nina', last: 'Popov', email: 'nina.popov@ecosphere.com', phone: '+1-415-555-0138', deptIdx: 4, designation: 'Procurement Specialist', gender: Gender.FEMALE, dob: '1993-04-11', ethnicity: 'Caucasian', join: '2023-01-23', status: EmployeeStatus.ON_LEAVE },

    // Sales (6)
    { code: 'EMP039', first: 'Marcus', last: 'Johnson', email: 'marcus.johnson@ecosphere.com', phone: '+1-415-555-0139', deptIdx: 5, designation: 'Sales Director', gender: Gender.MALE, dob: '1985-09-23', ethnicity: 'African American', join: '2020-04-06', status: EmployeeStatus.ACTIVE },
    { code: 'EMP040', first: 'Rachel', last: 'Kim', email: 'rachel.kim@ecosphere.com', phone: '+1-415-555-0140', deptIdx: 5, designation: 'Enterprise Account Executive', gender: Gender.FEMALE, dob: '1991-06-30', ethnicity: 'Asian', join: '2022-03-07', status: EmployeeStatus.ACTIVE },
    { code: 'EMP041', first: 'Alejandro', last: 'Cruz', email: 'alejandro.cruz@ecosphere.com', phone: '+1-415-555-0141', deptIdx: 5, designation: 'Business Development Manager', gender: Gender.MALE, dob: '1989-12-12', ethnicity: 'Hispanic', join: '2021-09-20', status: EmployeeStatus.ACTIVE },
    { code: 'EMP042', first: 'Destiny', last: 'Brown', email: 'destiny.brown@ecosphere.com', phone: '+1-415-555-0142', deptIdx: 5, designation: 'Sales Operations Analyst', gender: Gender.FEMALE, dob: '1996-03-05', ethnicity: 'African American', join: '2023-11-06', status: EmployeeStatus.ACTIVE },
    { code: 'EMP043', first: 'Viktor', last: 'Andersen', email: 'viktor.andersen@ecosphere.com', phone: '+1-415-555-0143', deptIdx: 5, designation: 'Account Manager', gender: Gender.MALE, dob: '1992-08-18', ethnicity: 'Caucasian', join: '2022-10-31', status: EmployeeStatus.ACTIVE },
    { code: 'EMP044', first: 'Noor', last: 'Abbasi', email: 'noor.abbasi@ecosphere.com', phone: '+1-415-555-0144', deptIdx: 5, designation: 'Partnership Lead', gender: Gender.FEMALE, dob: '1990-05-14', ethnicity: 'Middle Eastern', join: '2022-01-24', status: EmployeeStatus.ACTIVE },

    // Legal (3)
    { code: 'EMP045', first: 'Elena', last: 'Vasquez', email: 'elena.vasquez@ecosphere.com', phone: '+1-415-555-0145', deptIdx: 6, designation: 'General Counsel', gender: Gender.FEMALE, dob: '1980-11-28', ethnicity: 'Hispanic', join: '2019-01-14', status: EmployeeStatus.ACTIVE },
    { code: 'EMP046', first: 'Benjamin', last: 'Clarke', email: 'benjamin.clarke@ecosphere.com', phone: '+1-415-555-0146', deptIdx: 6, designation: 'Corporate Attorney', gender: Gender.MALE, dob: '1987-04-09', ethnicity: 'Caucasian', join: '2021-08-16', status: EmployeeStatus.ACTIVE },
    { code: 'EMP047', first: 'Aditi', last: 'Nair', email: 'aditi.nair@ecosphere.com', phone: '+1-415-555-0147', deptIdx: 6, designation: 'Compliance Officer', gender: Gender.FEMALE, dob: '1991-01-21', ethnicity: 'Asian', join: '2022-06-27', status: EmployeeStatus.ACTIVE },

    // Product (3)
    { code: 'EMP048', first: 'Kenji', last: 'Tanaka', email: 'kenji.tanaka@ecosphere.com', phone: '+1-415-555-0148', deptIdx: 7, designation: 'VP of Product', gender: Gender.MALE, dob: '1983-06-07', ethnicity: 'Asian', join: '2019-11-04', status: EmployeeStatus.ACTIVE },
    { code: 'EMP049', first: 'Chloe', last: 'Bernard', email: 'chloe.bernard@ecosphere.com', phone: '+1-415-555-0149', deptIdx: 7, designation: 'Senior Product Manager', gender: Gender.FEMALE, dob: '1990-02-18', ethnicity: 'Caucasian', join: '2021-03-29', status: EmployeeStatus.ACTIVE },
    { code: 'EMP050', first: 'Jordan', last: 'Rivera', email: 'jordan.rivera@ecosphere.com', phone: '+1-415-555-0150', deptIdx: 7, designation: 'UX Designer', gender: Gender.FEMALE, dob: '1997-08-10', ethnicity: 'Hispanic', join: '2024-01-15', status: EmployeeStatus.ACTIVE },
  ]

  const employees = await Promise.all(
    employeeData.map((e) =>
      prisma.employee.create({
        data: {
          employeeCode: e.code,
          firstName: e.first,
          lastName: e.last,
          email: e.email,
          phone: e.phone,
          departmentId: departments[e.deptIdx].id,
          designation: e.designation,
          gender: e.gender,
          dateOfBirth: new Date(e.dob),
          ethnicity: e.ethnicity,
          joinDate: new Date(e.join),
          status: e.status,
        },
      })
    )
  )

  console.log(`✅ Created ${employees.length} employees`)

  // ── 3. CSR Categories ──────────────────────────────────────────────────
  const csrCategories = await Promise.all([
    prisma.csrCategory.create({
      data: {
        name: 'Environmental Conservation',
        description: 'Activities focused on protecting and restoring natural ecosystems, reducing carbon footprint, and promoting sustainability.',
        icon: '🌿',
        color: '#10B981',
        isActive: true,
      },
    }),
    prisma.csrCategory.create({
      data: {
        name: 'Community Development',
        description: 'Initiatives to strengthen local communities through infrastructure, economic empowerment, and social welfare programs.',
        icon: '🏘️',
        color: '#6366F1',
        isActive: true,
      },
    }),
    prisma.csrCategory.create({
      data: {
        name: 'Education & Literacy',
        description: 'Programs aimed at improving access to education, digital literacy, and lifelong learning opportunities.',
        icon: '📚',
        color: '#F59E0B',
        isActive: true,
      },
    }),
    prisma.csrCategory.create({
      data: {
        name: 'Health & Wellness',
        description: 'Campaigns promoting physical and mental health, preventive care, and well-being in underserved areas.',
        icon: '❤️',
        color: '#EF4444',
        isActive: true,
      },
    }),
    prisma.csrCategory.create({
      data: {
        name: 'Disaster Relief',
        description: 'Rapid response initiatives providing aid, shelter, and rebuilding support during natural and man-made disasters.',
        icon: '🆘',
        color: '#F97316',
        isActive: true,
      },
    }),
    prisma.csrCategory.create({
      data: {
        name: 'Cultural Preservation',
        description: 'Efforts to safeguard cultural heritage, indigenous knowledge, and artistic traditions for future generations.',
        icon: '🏛️',
        color: '#8B5CF6',
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${csrCategories.length} CSR categories`)

  // ── 4. CSR Activities (12) ─────────────────────────────────────────────
  const csrActivities = await Promise.all([
    prisma.csrActivity.create({
      data: {
        title: 'Coastal Mangrove Restoration Drive',
        description: 'Join us for a weekend of restoring coastal mangrove forests along the San Francisco Bay. Volunteers will plant native mangrove saplings, clean debris from shorelines, and learn about the critical role mangroves play in carbon sequestration and coastal protection. Lunch and transportation provided.',
        categoryId: csrCategories[0].id,
        location: 'San Francisco Bay, CA',
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-03-16'),
        maxParticipants: 40,
        xpReward: 25,
        status: ActivityStatus.COMPLETED,
        imageUrl: 'https://picsum.photos/seed/csractivity1/800/400',
        organizerName: 'Green Earth Foundation',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'Urban Community Garden Project',
        description: 'Help transform an abandoned lot in the Tenderloin district into a vibrant community garden. Activities include soil preparation, raised bed construction, planting vegetables and herbs, and setting up a drip irrigation system. This garden will serve as a source of fresh produce for 200+ local families.',
        categoryId: csrCategories[1].id,
        location: 'Tenderloin District, San Francisco, CA',
        startDate: new Date('2025-04-05'),
        endDate: new Date('2025-04-06'),
        maxParticipants: 30,
        xpReward: 20,
        status: ActivityStatus.COMPLETED,
        imageUrl: 'https://picsum.photos/seed/csractivity2/800/400',
        organizerName: 'Sofia Martinez',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'STEM Mentorship for Underprivileged Youth',
        description: 'A six-week mentorship program pairing EcoSphere engineers with high school students from underserved communities. Mentors will guide students through coding fundamentals, robotics, and environmental science projects. Culminates in a student showcase event.',
        categoryId: csrCategories[2].id,
        location: 'Mission High School, San Francisco, CA',
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-03-21'),
        maxParticipants: 20,
        xpReward: 50,
        status: ActivityStatus.COMPLETED,
        imageUrl: 'https://picsum.photos/seed/csractivity3/800/400',
        organizerName: 'Raj Patel',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'Corporate Blood Donation Camp',
        description: 'EcoSphere is hosting its annual blood donation camp in partnership with the American Red Cross. Walk-in donations welcome. Each unit of blood can save up to three lives. Refreshments and a recovery area will be available for all donors.',
        categoryId: csrCategories[3].id,
        location: 'EcoSphere HQ, Floor 2 Atrium',
        startDate: new Date('2025-05-12'),
        endDate: new Date('2025-05-12'),
        maxParticipants: 100,
        xpReward: 15,
        status: ActivityStatus.COMPLETED,
        imageUrl: 'https://picsum.photos/seed/csractivity4/800/400',
        organizerName: 'Amara Okafor',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'Flood Relief Supply Assembly',
        description: 'Assemble emergency relief kits containing clean water, non-perishable food, hygiene supplies, and first-aid materials for communities affected by recent flooding in the Central Valley. Kits will be distributed through partner NGOs within 48 hours.',
        categoryId: csrCategories[4].id,
        location: 'EcoSphere Warehouse, Oakland, CA',
        startDate: new Date('2025-01-20'),
        endDate: new Date('2025-01-21'),
        maxParticipants: 50,
        xpReward: 20,
        status: ActivityStatus.COMPLETED,
        imageUrl: 'https://picsum.photos/seed/csractivity5/800/400',
        organizerName: 'Fatima Al-Hassan',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'Indigenous Art Exhibition & Workshop',
        description: 'Celebrate and preserve indigenous art forms through an interactive exhibition featuring Native American artists from Northern California. Employees can participate in pottery, weaving, and storytelling workshops. All proceeds support the Tribal Cultural Foundation.',
        categoryId: csrCategories[5].id,
        location: 'EcoSphere HQ Gallery Space',
        startDate: new Date('2025-06-14'),
        endDate: new Date('2025-06-15'),
        maxParticipants: 60,
        xpReward: 15,
        status: ActivityStatus.COMPLETED,
        imageUrl: 'https://picsum.photos/seed/csractivity6/800/400',
        organizerName: 'Kenji Tanaka',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'E-Waste Recycling & Awareness Campaign',
        description: 'Bring your old electronics for responsible recycling and learn about the environmental impact of e-waste. Partnered with Recycle Right SF, this event includes hands-on demonstrations of device refurbishment and a panel discussion on circular economy practices.',
        categoryId: csrCategories[0].id,
        location: 'EcoSphere HQ Parking Lot',
        startDate: new Date('2025-07-19'),
        endDate: new Date('2025-07-19'),
        maxParticipants: 80,
        xpReward: 10,
        status: ActivityStatus.ONGOING,
        imageUrl: 'https://picsum.photos/seed/csractivity7/800/400',
        organizerName: 'Marcus Williams',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'Habitat for Humanity Home Build',
        description: 'Spend a full day alongside Habitat for Humanity volunteers constructing affordable housing units in East Oakland. No prior construction experience required — training provided on-site. Help us build the foundation for a family\'s future.',
        categoryId: csrCategories[1].id,
        location: 'East Oakland, CA',
        startDate: new Date('2025-08-09'),
        endDate: new Date('2025-08-10'),
        maxParticipants: 25,
        xpReward: 30,
        status: ActivityStatus.UPCOMING,
        imageUrl: 'https://picsum.photos/seed/csractivity8/800/400',
        organizerName: 'Andre Jackson',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'Digital Literacy Workshops for Seniors',
        description: 'Teach senior citizens at the Sunset Community Center how to use smartphones, navigate the internet safely, use telemedicine platforms, and connect with family through video calls. A hands-on, patient-paced workshop series over three Saturdays.',
        categoryId: csrCategories[2].id,
        location: 'Sunset Community Center, San Francisco, CA',
        startDate: new Date('2025-09-06'),
        endDate: new Date('2025-09-20'),
        maxParticipants: 15,
        xpReward: 35,
        status: ActivityStatus.UPCOMING,
        imageUrl: 'https://picsum.photos/seed/csractivity9/800/400',
        organizerName: 'Isabella Rossi',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'Mental Health Awareness Marathon',
        description: 'A 5K run/walk to raise awareness and funds for mental health services in the Bay Area. Includes guided meditation sessions, counselor booths, and a post-race wellness fair. All registration fees go directly to the Bay Area Mental Health Alliance.',
        categoryId: csrCategories[3].id,
        location: 'Golden Gate Park, San Francisco, CA',
        startDate: new Date('2025-10-11'),
        endDate: new Date('2025-10-11'),
        maxParticipants: 200,
        xpReward: 15,
        status: ActivityStatus.UPCOMING,
        imageUrl: 'https://picsum.photos/seed/csractivity10/800/400',
        organizerName: 'Ryan Cooper',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'Wildfire Recovery Tree Planting',
        description: 'Partner with the California Conservation Corps to replant native trees in areas devastated by recent wildfires in Napa County. Each volunteer will plant approximately 25 trees over the weekend. Equipment, meals, and camping supplies provided.',
        categoryId: csrCategories[0].id,
        location: 'Napa County, CA',
        startDate: new Date('2025-11-08'),
        endDate: new Date('2025-11-09'),
        maxParticipants: 35,
        xpReward: 30,
        status: ActivityStatus.DRAFT,
        imageUrl: 'https://picsum.photos/seed/csractivity11/800/400',
        organizerName: 'Patrick O\'Sullivan',
      },
    }),
    prisma.csrActivity.create({
      data: {
        title: 'Holiday Food Drive & Soup Kitchen Service',
        description: 'Collect non-perishable food items and serve warm meals at the Glide Memorial Soup Kitchen during the holiday season. Shifts are available from 8 AM to 8 PM. This is a wonderful opportunity to give back and spread holiday cheer to those in need.',
        categoryId: csrCategories[1].id,
        location: 'Glide Memorial, San Francisco, CA',
        startDate: new Date('2025-12-20'),
        endDate: new Date('2025-12-22'),
        maxParticipants: 45,
        xpReward: 20,
        status: ActivityStatus.DRAFT,
        imageUrl: 'https://picsum.photos/seed/csractivity12/800/400',
        organizerName: 'Amara Okafor',
      },
    }),
  ])

  console.log(`✅ Created ${csrActivities.length} CSR activities`)

  // ── 5. Employee Participations (45) ────────────────────────────────────
  const participationData = [
    // Activity 0 - Coastal Mangrove (COMPLETED)
    { empIdx: 0, actIdx: 0, completedAt: '2025-03-16', hours: 8, feedback: 'Amazing experience planting mangroves. Learned so much about coastal ecosystems.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Sofia Martinez', approvalDate: '2025-03-18', points: 25 },
    { empIdx: 2, actIdx: 0, completedAt: '2025-03-16', hours: 7.5, feedback: 'Great team effort. The bay looked completely different by the end.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Sofia Martinez', approvalDate: '2025-03-18', points: 25 },
    { empIdx: 4, actIdx: 0, completedAt: '2025-03-16', hours: 6, feedback: 'Really enjoyed the hands-on work. Would love to do more of these.', rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Sofia Martinez', approvalDate: '2025-03-18', points: 25 },
    { empIdx: 14, actIdx: 0, completedAt: '2025-03-16', hours: 8, feedback: null, rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Sofia Martinez', approvalDate: '2025-03-18', points: 25 },
    { empIdx: 21, actIdx: 0, completedAt: '2025-03-16', hours: 5, feedback: 'Good initiative but logistics could be improved.', rating: 3, approval: ApprovalStatus.APPROVED, approvedBy: 'Sofia Martinez', approvalDate: '2025-03-18', points: 25 },

    // Activity 1 - Community Garden (COMPLETED)
    { empIdx: 12, actIdx: 1, completedAt: '2025-04-06', hours: 10, feedback: 'Organizing this was rewarding. The community was so grateful!', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-04-08', points: 20 },
    { empIdx: 16, actIdx: 1, completedAt: '2025-04-06', hours: 9, feedback: 'Designed the garden layout signage. Beautiful result!', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-04-08', points: 20 },
    { empIdx: 34, actIdx: 1, completedAt: '2025-04-06', hours: 8, feedback: 'Hard physical work but the before/after was incredible.', rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-04-08', points: 20 },
    { empIdx: 49, actIdx: 1, completedAt: '2025-04-06', hours: 7, feedback: 'Great event. Loved the sense of community.', rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-04-08', points: 20 },

    // Activity 2 - STEM Mentorship (COMPLETED)
    { empIdx: 1, actIdx: 2, completedAt: '2025-03-21', hours: 30, feedback: 'Mentoring these students was the highlight of my quarter. Two of my mentees are now applying to CS programs!', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Raj Patel', approvalDate: '2025-03-23', points: 50 },
    { empIdx: 3, actIdx: 2, completedAt: '2025-03-21', hours: 28, feedback: 'Incredible to see these kids light up when their robots worked.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Raj Patel', approvalDate: '2025-03-23', points: 50 },
    { empIdx: 7, actIdx: 2, completedAt: '2025-03-21', hours: 25, feedback: 'Taught data visualization. Students created an environmental dashboard!', rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Raj Patel', approvalDate: '2025-03-23', points: 50 },
    { empIdx: 10, actIdx: 2, completedAt: '2025-03-21', hours: 24, feedback: 'Focused on cybersecurity basics. Students were engaged throughout.', rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Raj Patel', approvalDate: '2025-03-23', points: 50 },

    // Activity 3 - Blood Donation (COMPLETED)
    { empIdx: 5, actIdx: 3, completedAt: '2025-05-12', hours: 1.5, feedback: 'Quick and easy. Happy to contribute.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-05-13', points: 15 },
    { empIdx: 8, actIdx: 3, completedAt: '2025-05-12', hours: 1.5, feedback: null, rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-05-13', points: 15 },
    { empIdx: 13, actIdx: 3, completedAt: '2025-05-12', hours: 1, feedback: 'Well organized camp. Great refreshments too!', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-05-13', points: 15 },
    { empIdx: 22, actIdx: 3, completedAt: '2025-05-12', hours: 1.5, feedback: null, rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-05-13', points: 15 },
    { empIdx: 27, actIdx: 3, completedAt: '2025-05-12', hours: 1, feedback: 'First time donating. Glad I did it.', rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-05-13', points: 15 },
    { empIdx: 33, actIdx: 3, completedAt: '2025-05-12', hours: 1.5, feedback: null, rating: 3, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-05-13', points: 15 },
    { empIdx: 38, actIdx: 3, completedAt: '2025-05-12', hours: 1, feedback: 'Great initiative. Should do this every quarter.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-05-13', points: 15 },
    { empIdx: 44, actIdx: 3, completedAt: '2025-05-12', hours: 1, feedback: null, rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-05-13', points: 15 },

    // Activity 4 - Flood Relief (COMPLETED)
    { empIdx: 6, actIdx: 4, completedAt: '2025-01-21', hours: 12, feedback: 'Assembled over 300 kits. The efficiency of the team was impressive.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Fatima Al-Hassan', approvalDate: '2025-01-23', points: 20 },
    { empIdx: 9, actIdx: 4, completedAt: '2025-01-21', hours: 10, feedback: 'Meaningful work. Knowing these kits went out within 48 hours was motivating.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Fatima Al-Hassan', approvalDate: '2025-01-23', points: 20 },
    { empIdx: 31, actIdx: 4, completedAt: '2025-01-21', hours: 14, feedback: 'Led the logistics coordination. Proud of what we accomplished.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Fatima Al-Hassan', approvalDate: '2025-01-23', points: 20 },
    { empIdx: 35, actIdx: 4, completedAt: '2025-01-21', hours: 11, feedback: null, rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Fatima Al-Hassan', approvalDate: '2025-01-23', points: 20 },

    // Activity 5 - Indigenous Art (COMPLETED)
    { empIdx: 15, actIdx: 5, completedAt: '2025-06-15', hours: 6, feedback: 'The pottery workshop was incredible. Bought two pieces to support the artists.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Kenji Tanaka', approvalDate: '2025-06-17', points: 15 },
    { empIdx: 17, actIdx: 5, completedAt: '2025-06-15', hours: 5, feedback: 'Helped set up social media coverage for the event. Got great engagement.', rating: 4, approval: ApprovalStatus.APPROVED, approvedBy: 'Kenji Tanaka', approvalDate: '2025-06-17', points: 15 },
    { empIdx: 40, actIdx: 5, completedAt: '2025-06-15', hours: 4, feedback: 'Beautiful exhibition. Important cultural preservation work.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Kenji Tanaka', approvalDate: '2025-06-17', points: 15 },
    { empIdx: 47, actIdx: 5, completedAt: '2025-06-15', hours: 8, feedback: 'Organized the entire event. The storytelling session was deeply moving.', rating: 5, approval: ApprovalStatus.APPROVED, approvedBy: 'Kenji Tanaka', approvalDate: '2025-06-17', points: 15 },

    // Activity 6 - E-Waste (ONGOING) - some pending approvals
    { empIdx: 11, actIdx: 6, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.PENDING, approvedBy: null, approvalDate: null, points: 0 },
    { empIdx: 19, actIdx: 6, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.PENDING, approvedBy: null, approvalDate: null, points: 0 },
    { empIdx: 23, actIdx: 6, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.PENDING, approvedBy: null, approvalDate: null, points: 0 },
    { empIdx: 28, actIdx: 6, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.PENDING, approvedBy: null, approvalDate: null, points: 0 },
    { empIdx: 36, actIdx: 6, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.PENDING, approvedBy: null, approvalDate: null, points: 0 },

    // Activity 7 - Habitat (UPCOMING) - registrations
    { empIdx: 24, actIdx: 7, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-07-15', points: 0 },
    { empIdx: 29, actIdx: 7, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-07-15', points: 0 },
    { empIdx: 41, actIdx: 7, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-07-15', points: 0 },
    { empIdx: 42, actIdx: 7, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-07-16', points: 0 },
    { empIdx: 48, actIdx: 7, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.APPROVED, approvedBy: 'Amara Okafor', approvalDate: '2025-07-16', points: 0 },

    // Some rejections
    { empIdx: 37, actIdx: 7, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.REJECTED, approvedBy: 'Amara Okafor', approvalDate: '2025-07-15', points: 0 },
    { empIdx: 25, actIdx: 6, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.REJECTED, approvedBy: 'Marcus Williams', approvalDate: '2025-07-10', points: 0 },

    // Activity 8 - Digital Literacy (UPCOMING)
    { empIdx: 18, actIdx: 8, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.APPROVED, approvedBy: 'Isabella Rossi', approvalDate: '2025-08-20', points: 0 },
    { empIdx: 26, actIdx: 8, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.PENDING, approvedBy: null, approvalDate: null, points: 0 },
    { empIdx: 46, actIdx: 8, completedAt: null, hours: null, feedback: null, rating: null, approval: ApprovalStatus.PENDING, approvedBy: null, approvalDate: null, points: 0 },
  ]

  const participations = await Promise.all(
    participationData.map((p) =>
      prisma.employeeParticipation.create({
        data: {
          employeeId: employees[p.empIdx].id,
          activityId: csrActivities[p.actIdx].id,
          registeredAt: p.completedAt ? new Date(new Date(p.completedAt).getTime() - 7 * 24 * 60 * 60 * 1000) : new Date(),
          completedAt: p.completedAt ? new Date(p.completedAt) : null,
          hoursContributed: p.hours,
          proofUrl: p.completedAt ? `https://ecosphere-cdn.com/proofs/${employees[p.empIdx].employeeCode.toLowerCase()}-activity-${p.actIdx + 1}.jpg` : null,
          feedback: p.feedback,
          rating: p.rating,
          approvalStatus: p.approval,
          approvedBy: p.approvedBy,
          approvalDate: p.approvalDate ? new Date(p.approvalDate) : null,
          rejectionReason: p.approval === ApprovalStatus.REJECTED ? 'Schedule conflict with mandatory training deadline.' : null,
          pointsEarned: p.points,
        },
      })
    )
  )

  console.log(`✅ Created ${participations.length} employee participations`)

  // ── 6. Engagement Surveys ──────────────────────────────────────────────
  const surveys = await Promise.all([
    prisma.engagementSurvey.create({
      data: {
        title: 'Q1 2025 Employee Engagement Survey',
        description: 'Quarterly pulse check measuring employee satisfaction, work-life balance, and organizational alignment.',
        quarter: 'Q1',
        year: 2025,
        isActive: false,
      },
    }),
    prisma.engagementSurvey.create({
      data: {
        title: 'Q2 2025 Employee Engagement Survey',
        description: 'Mid-year engagement survey with expanded sections on DEI initiatives and professional growth.',
        quarter: 'Q2',
        year: 2025,
        isActive: false,
      },
    }),
    prisma.engagementSurvey.create({
      data: {
        title: 'Q3 2025 Employee Engagement Survey',
        description: 'Third quarter pulse survey focusing on team dynamics, hybrid work effectiveness, and wellness programs.',
        quarter: 'Q3',
        year: 2025,
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${surveys.length} engagement surveys`)

  // ── 7. Survey Responses (35) ───────────────────────────────────────────
  const surveyResponseData = [
    // Q1 2025 - 12 responses
    { surveyIdx: 0, empIdx: 0, overall: 8, wlb: 7, team: 9, growth: 7, mgmt: 8, comment: 'Good quarter overall. Would appreciate more flexible work hours.' },
    { surveyIdx: 0, empIdx: 1, overall: 9, wlb: 8, team: 9, growth: 8, mgmt: 9, comment: 'Love the team culture. The new mentorship program is excellent.' },
    { surveyIdx: 0, empIdx: 5, overall: 7, wlb: 6, team: 8, growth: 7, mgmt: 7, comment: 'Workload has been heavy but manageable. More clarity on promotion paths would help.' },
    { surveyIdx: 0, empIdx: 12, overall: 8, wlb: 7, team: 8, growth: 8, mgmt: 8, comment: null },
    { surveyIdx: 0, empIdx: 20, overall: 9, wlb: 9, team: 8, growth: 9, mgmt: 9, comment: 'Best workplace I have been part of. The ESG mission is truly inspiring.' },
    { surveyIdx: 0, empIdx: 27, overall: 7, wlb: 6, team: 7, growth: 6, mgmt: 7, comment: 'Finance team needs more headcount. We are stretched thin.' },
    { surveyIdx: 0, empIdx: 31, overall: 8, wlb: 8, team: 8, growth: 7, mgmt: 8, comment: 'Operations is running smoothly. Would like more cross-department projects.' },
    { surveyIdx: 0, empIdx: 38, overall: 8, wlb: 7, team: 9, growth: 8, mgmt: 8, comment: 'Sales targets are ambitious but achievable. Great team support.' },
    { surveyIdx: 0, empIdx: 44, overall: 7, wlb: 5, team: 7, growth: 6, mgmt: 6, comment: 'Legal workload is intense. Need better work-life balance policies.' },
    { surveyIdx: 0, empIdx: 47, overall: 9, wlb: 8, team: 9, growth: 9, mgmt: 9, comment: 'Product team has great autonomy. Love the innovation focus.' },
    { surveyIdx: 0, empIdx: 15, overall: 6, wlb: 5, team: 7, growth: 6, mgmt: 5, comment: 'Communication from leadership could be more transparent.' },
    { surveyIdx: 0, empIdx: 33, overall: 7, wlb: 7, team: 7, growth: 7, mgmt: 7, comment: null },

    // Q2 2025 - 13 responses
    { surveyIdx: 1, empIdx: 0, overall: 8, wlb: 8, team: 9, growth: 8, mgmt: 8, comment: 'Improvements in flexible scheduling have been noticed and appreciated.' },
    { surveyIdx: 1, empIdx: 3, overall: 8, wlb: 7, team: 8, growth: 8, mgmt: 8, comment: 'The new DEI training was eye-opening. More of these please.' },
    { surveyIdx: 1, empIdx: 7, overall: 7, wlb: 6, team: 8, growth: 7, mgmt: 7, comment: 'Data infrastructure improvements are exciting. Need more ML resources.' },
    { surveyIdx: 1, empIdx: 13, overall: 9, wlb: 8, team: 9, growth: 9, mgmt: 9, comment: 'Content strategy is really coming together. Proud of the team.' },
    { surveyIdx: 1, empIdx: 16, overall: 8, wlb: 8, team: 8, growth: 7, mgmt: 8, comment: 'Love the creative freedom in the marketing team.' },
    { surveyIdx: 1, empIdx: 22, overall: 8, wlb: 7, team: 8, growth: 8, mgmt: 8, comment: 'HR initiatives this quarter have been impactful.' },
    { surveyIdx: 1, empIdx: 28, overall: 7, wlb: 6, team: 7, growth: 7, mgmt: 7, comment: 'Financial reporting deadlines are stressful. Need better tooling.' },
    { surveyIdx: 1, empIdx: 34, overall: 7, wlb: 7, team: 8, growth: 6, mgmt: 7, comment: null },
    { surveyIdx: 1, empIdx: 39, overall: 9, wlb: 8, team: 9, growth: 8, mgmt: 9, comment: 'Client relationships are strong. Great support from leadership.' },
    { surveyIdx: 1, empIdx: 41, overall: 8, wlb: 7, team: 8, growth: 8, mgmt: 8, comment: 'Business development opportunities are plentiful.' },
    { surveyIdx: 1, empIdx: 45, overall: 7, wlb: 6, team: 7, growth: 7, mgmt: 7, comment: 'Compliance workload increasing. Regulatory landscape is complex.' },
    { surveyIdx: 1, empIdx: 48, overall: 9, wlb: 9, team: 9, growth: 9, mgmt: 9, comment: 'Product roadmap is ambitious and exciting. Best quarter yet.' },
    { surveyIdx: 1, empIdx: 10, overall: 8, wlb: 7, team: 8, growth: 8, mgmt: 8, comment: 'Security team is growing nicely. Appreciate the investment in our domain.' },

    // Q3 2025 - 10 responses (current, active survey)
    { surveyIdx: 2, empIdx: 2, overall: 8, wlb: 7, team: 9, growth: 8, mgmt: 8, comment: 'DevOps improvements have reduced deployment time by 40%. Great progress.' },
    { surveyIdx: 2, empIdx: 4, overall: 7, wlb: 7, team: 8, growth: 7, mgmt: 7, comment: 'Backend team doing solid work. Would appreciate more architecture discussions.' },
    { surveyIdx: 2, empIdx: 9, overall: 9, wlb: 8, team: 9, growth: 9, mgmt: 9, comment: 'Cloud migration project was a massive success. Team morale is high.' },
    { surveyIdx: 2, empIdx: 14, overall: 6, wlb: 5, team: 7, growth: 6, mgmt: 6, comment: 'Feeling a bit burnt out. The on-call rotation needs adjusting.' },
    { surveyIdx: 2, empIdx: 20, overall: 9, wlb: 9, team: 9, growth: 8, mgmt: 9, comment: 'HR continues to be the best department to work in. Culture is amazing.' },
    { surveyIdx: 2, empIdx: 25, overall: 8, wlb: 7, team: 8, growth: 8, mgmt: 8, comment: 'L&D programs this quarter were excellent. The leadership workshop was transformative.' },
    { surveyIdx: 2, empIdx: 32, overall: 7, wlb: 7, team: 8, growth: 7, mgmt: 7, comment: null },
    { surveyIdx: 2, empIdx: 40, overall: 8, wlb: 7, team: 8, growth: 7, mgmt: 8, comment: 'Closed two major enterprise deals. Pipeline is healthy.' },
    { surveyIdx: 2, empIdx: 46, overall: 8, wlb: 7, team: 8, growth: 8, mgmt: 8, comment: 'Compliance automation project is going well. Great cross-team collaboration.' },
    { surveyIdx: 2, empIdx: 49, overall: 9, wlb: 9, team: 9, growth: 9, mgmt: 9, comment: 'UX redesign project is my best work yet. Love the collaborative process.' },
  ]

  const surveyResponses = await Promise.all(
    surveyResponseData.map((r, idx) =>
      prisma.surveyResponse.create({
        data: {
          surveyId: surveys[r.surveyIdx].id,
          employeeId: employees[r.empIdx].id,
          overallScore: r.overall,
          workLifeBalance: r.wlb,
          teamCollaboration: r.team,
          growthOpportunities: r.growth,
          managementSupport: r.mgmt,
          comments: r.comment,
          submittedAt: new Date(
            r.surveyIdx === 0
              ? '2025-03-28'
              : r.surveyIdx === 1
              ? '2025-06-27'
              : '2025-09-26'
          ),
        },
      })
    )
  )

  console.log(`✅ Created ${surveyResponses.length} survey responses`)

  // ── 8. Training Programs (8) ───────────────────────────────────────────
  const trainingPrograms = await Promise.all([
    prisma.trainingProgram.create({
      data: {
        title: 'ESG Fundamentals & Sustainability Reporting',
        description: 'Comprehensive training on Environmental, Social, and Governance frameworks including GRI Standards, SASB, and TCFD reporting requirements. Covers materiality assessments, stakeholder engagement, and sustainability disclosure best practices.',
        category: 'Compliance',
        durationHours: 8,
        isMandatory: true,
        deadline: new Date('2025-06-30'),
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.trainingProgram.create({
      data: {
        title: 'Unconscious Bias & Inclusive Leadership',
        description: 'Interactive workshop exploring unconscious biases in the workplace and strategies for building inclusive teams. Includes role-playing scenarios, case studies, and action planning for creating psychologically safe environments.',
        category: 'DEI',
        durationHours: 4,
        isMandatory: true,
        deadline: new Date('2025-09-30'),
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.trainingProgram.create({
      data: {
        title: 'Data Privacy & GDPR Compliance',
        description: 'Essential training on data protection regulations including GDPR, CCPA, and emerging privacy laws. Covers data handling best practices, breach notification procedures, and privacy-by-design principles.',
        category: 'Compliance',
        durationHours: 6,
        isMandatory: true,
        deadline: new Date('2025-08-31'),
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.trainingProgram.create({
      data: {
        title: 'Advanced Cloud Architecture on AWS',
        description: 'Deep dive into AWS services for building scalable, resilient, and cost-effective cloud architectures. Topics include serverless computing, container orchestration, multi-region deployments, and infrastructure as code with Terraform.',
        category: 'Technical',
        durationHours: 16,
        isMandatory: false,
        deadline: new Date('2025-12-31'),
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.trainingProgram.create({
      data: {
        title: 'Effective Communication & Stakeholder Management',
        description: 'Build skills for clear communication across teams, cultures, and hierarchies. Learn stakeholder mapping, influence strategies, and presentation techniques for high-stakes meetings and board presentations.',
        category: 'Soft Skills',
        durationHours: 6,
        isMandatory: false,
        deadline: null,
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.trainingProgram.create({
      data: {
        title: 'Carbon Accounting & Net-Zero Strategy',
        description: 'Specialized training on Scope 1, 2, and 3 emissions measurement, science-based target setting, carbon offset mechanisms, and developing organizational roadmaps to achieve net-zero emissions by 2050.',
        category: 'Sustainability',
        durationHours: 10,
        isMandatory: false,
        deadline: new Date('2025-11-30'),
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.trainingProgram.create({
      data: {
        title: 'Agile Project Management & Scrum Master Certification',
        description: 'Comprehensive Agile training covering Scrum, Kanban, and SAFe frameworks. Prepares participants for the Certified Scrum Master (CSM) examination with hands-on sprint simulations and retrospective facilitation.',
        category: 'Management',
        durationHours: 12,
        isMandatory: false,
        deadline: null,
        status: ProgramStatus.ACTIVE,
      },
    }),
    prisma.trainingProgram.create({
      data: {
        title: 'Workplace Safety & Emergency Preparedness',
        description: 'Annual mandatory training covering workplace safety protocols, fire evacuation procedures, first aid basics, earthquake preparedness, and active threat response. Includes hands-on fire extinguisher training.',
        category: 'Safety',
        durationHours: 3,
        isMandatory: true,
        deadline: new Date('2025-04-30'),
        status: ProgramStatus.ARCHIVED,
      },
    }),
  ])

  console.log(`✅ Created ${trainingPrograms.length} training programs`)

  // ── 9. Training Completions (45) ───────────────────────────────────────
  const trainingCompletionData = [
    // ESG Fundamentals (mandatory) - wide participation
    { trainingIdx: 0, empIdx: 0, startedAt: '2025-04-01', completedAt: '2025-04-15', score: 92, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/esg-fundamentals/emp001.pdf' },
    { trainingIdx: 0, empIdx: 1, startedAt: '2025-04-03', completedAt: '2025-04-18', score: 88, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/esg-fundamentals/emp002.pdf' },
    { trainingIdx: 0, empIdx: 12, startedAt: '2025-03-20', completedAt: '2025-04-02', score: 95, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/esg-fundamentals/emp013.pdf' },
    { trainingIdx: 0, empIdx: 20, startedAt: '2025-03-15', completedAt: '2025-03-28', score: 97, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/esg-fundamentals/emp021.pdf' },
    { trainingIdx: 0, empIdx: 27, startedAt: '2025-05-01', completedAt: '2025-05-20', score: 85, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/esg-fundamentals/emp028.pdf' },
    { trainingIdx: 0, empIdx: 38, startedAt: '2025-04-10', completedAt: '2025-04-28', score: 90, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/esg-fundamentals/emp039.pdf' },
    { trainingIdx: 0, empIdx: 44, startedAt: '2025-05-15', completedAt: '2025-06-01', score: 93, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/esg-fundamentals/emp045.pdf' },
    { trainingIdx: 0, empIdx: 47, startedAt: '2025-04-05', completedAt: '2025-04-20', score: 96, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/esg-fundamentals/emp048.pdf' },
    { trainingIdx: 0, empIdx: 5, startedAt: '2025-06-01', completedAt: null, score: null, status: TrainingCompletionStatus.IN_PROGRESS, cert: null },
    { trainingIdx: 0, empIdx: 30, startedAt: null, completedAt: null, score: null, status: TrainingCompletionStatus.OVERDUE, cert: null },

    // Unconscious Bias (mandatory)
    { trainingIdx: 1, empIdx: 2, startedAt: '2025-05-10', completedAt: '2025-05-12', score: 87, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/unconscious-bias/emp003.pdf' },
    { trainingIdx: 1, empIdx: 13, startedAt: '2025-05-15', completedAt: '2025-05-17', score: 91, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/unconscious-bias/emp014.pdf' },
    { trainingIdx: 1, empIdx: 21, startedAt: '2025-04-20', completedAt: '2025-04-22', score: 94, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/unconscious-bias/emp022.pdf' },
    { trainingIdx: 1, empIdx: 31, startedAt: '2025-06-01', completedAt: '2025-06-03', score: 86, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/unconscious-bias/emp032.pdf' },
    { trainingIdx: 1, empIdx: 39, startedAt: '2025-07-01', completedAt: null, score: null, status: TrainingCompletionStatus.IN_PROGRESS, cert: null },
    { trainingIdx: 1, empIdx: 45, startedAt: '2025-06-15', completedAt: '2025-06-17', score: 89, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/unconscious-bias/emp046.pdf' },
    { trainingIdx: 1, empIdx: 8, startedAt: null, completedAt: null, score: null, status: TrainingCompletionStatus.NOT_STARTED, cert: null },

    // Data Privacy (mandatory)
    { trainingIdx: 2, empIdx: 3, startedAt: '2025-06-10', completedAt: '2025-06-20', score: 90, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/data-privacy/emp004.pdf' },
    { trainingIdx: 2, empIdx: 10, startedAt: '2025-06-01', completedAt: '2025-06-12', score: 96, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/data-privacy/emp011.pdf' },
    { trainingIdx: 2, empIdx: 46, startedAt: '2025-05-20', completedAt: '2025-06-02', score: 98, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/data-privacy/emp047.pdf' },
    { trainingIdx: 2, empIdx: 22, startedAt: '2025-07-01', completedAt: null, score: null, status: TrainingCompletionStatus.IN_PROGRESS, cert: null },
    { trainingIdx: 2, empIdx: 35, startedAt: null, completedAt: null, score: null, status: TrainingCompletionStatus.NOT_STARTED, cert: null },

    // AWS Cloud Architecture (optional)
    { trainingIdx: 3, empIdx: 0, startedAt: '2025-07-01', completedAt: null, score: null, status: TrainingCompletionStatus.IN_PROGRESS, cert: null },
    { trainingIdx: 3, empIdx: 7, startedAt: '2025-05-15', completedAt: '2025-07-01', score: 94, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/aws-cloud/emp008.pdf' },
    { trainingIdx: 3, empIdx: 9, startedAt: '2025-04-01', completedAt: '2025-06-15', score: 98, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/aws-cloud/emp010.pdf' },
    { trainingIdx: 3, empIdx: 11, startedAt: '2025-06-20', completedAt: null, score: null, status: TrainingCompletionStatus.IN_PROGRESS, cert: null },

    // Communication (optional)
    { trainingIdx: 4, empIdx: 14, startedAt: '2025-05-01', completedAt: '2025-05-15', score: 82, status: TrainingCompletionStatus.COMPLETED, cert: null },
    { trainingIdx: 4, empIdx: 23, startedAt: '2025-06-01', completedAt: '2025-06-10', score: 88, status: TrainingCompletionStatus.COMPLETED, cert: null },
    { trainingIdx: 4, empIdx: 40, startedAt: '2025-04-15', completedAt: '2025-04-28', score: 91, status: TrainingCompletionStatus.COMPLETED, cert: null },
    { trainingIdx: 4, empIdx: 42, startedAt: '2025-07-05', completedAt: null, score: null, status: TrainingCompletionStatus.IN_PROGRESS, cert: null },

    // Carbon Accounting (optional)
    { trainingIdx: 5, empIdx: 31, startedAt: '2025-06-15', completedAt: '2025-07-10', score: 89, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/carbon-accounting/emp032.pdf' },
    { trainingIdx: 5, empIdx: 47, startedAt: '2025-07-01', completedAt: null, score: null, status: TrainingCompletionStatus.IN_PROGRESS, cert: null },
    { trainingIdx: 5, empIdx: 27, startedAt: '2025-06-20', completedAt: '2025-07-15', score: 93, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/carbon-accounting/emp028.pdf' },

    // Agile Project Management (optional)
    { trainingIdx: 6, empIdx: 48, startedAt: '2025-03-01', completedAt: '2025-04-15', score: 95, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/agile-pm/emp049.pdf' },
    { trainingIdx: 6, empIdx: 4, startedAt: '2025-05-01', completedAt: '2025-06-20', score: 87, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/agile-pm/emp005.pdf' },
    { trainingIdx: 6, empIdx: 16, startedAt: '2025-07-01', completedAt: null, score: null, status: TrainingCompletionStatus.IN_PROGRESS, cert: null },
    { trainingIdx: 6, empIdx: 33, startedAt: null, completedAt: null, score: null, status: TrainingCompletionStatus.NOT_STARTED, cert: null },

    // Workplace Safety (archived, mandatory)
    { trainingIdx: 7, empIdx: 0, startedAt: '2025-03-01', completedAt: '2025-03-05', score: 100, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/workplace-safety/emp001.pdf' },
    { trainingIdx: 7, empIdx: 12, startedAt: '2025-02-15', completedAt: '2025-02-18', score: 100, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/workplace-safety/emp013.pdf' },
    { trainingIdx: 7, empIdx: 20, startedAt: '2025-01-20', completedAt: '2025-01-23', score: 98, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/workplace-safety/emp021.pdf' },
    { trainingIdx: 7, empIdx: 31, startedAt: '2025-03-10', completedAt: '2025-03-13', score: 100, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/workplace-safety/emp032.pdf' },
    { trainingIdx: 7, empIdx: 38, startedAt: '2025-02-01', completedAt: '2025-02-04', score: 95, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/workplace-safety/emp039.pdf' },
    { trainingIdx: 7, empIdx: 44, startedAt: '2025-03-20', completedAt: '2025-03-23', score: 100, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/workplace-safety/emp045.pdf' },
    { trainingIdx: 7, empIdx: 47, startedAt: '2025-01-10', completedAt: '2025-01-13', score: 97, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/workplace-safety/emp048.pdf' },
    { trainingIdx: 7, empIdx: 6, startedAt: '2025-04-01', completedAt: '2025-04-04', score: 100, status: TrainingCompletionStatus.COMPLETED, cert: 'https://ecosphere-cdn.com/certs/workplace-safety/emp007.pdf' },
  ]

  const trainingCompletions = await Promise.all(
    trainingCompletionData.map((tc) =>
      prisma.trainingCompletion.create({
        data: {
          trainingId: trainingPrograms[tc.trainingIdx].id,
          employeeId: employees[tc.empIdx].id,
          startedAt: tc.startedAt ? new Date(tc.startedAt) : null,
          completedAt: tc.completedAt ? new Date(tc.completedAt) : null,
          score: tc.score,
          status: tc.status,
          certificateUrl: tc.cert,
        },
      })
    )
  )

  console.log(`✅ Created ${trainingCompletions.length} training completions`)

  // ── Summary ────────────────────────────────────────────────────────────
  console.log('\n🎉 Seeding complete! Summary:')
  console.log(`   Departments:            ${departments.length}`)
  console.log(`   Employees:              ${employees.length}`)
  console.log(`   CSR Categories:         ${csrCategories.length}`)
  console.log(`   CSR Activities:         ${csrActivities.length}`)
  console.log(`   Participations:         ${participations.length}`)
  console.log(`   Engagement Surveys:     ${surveys.length}`)
  console.log(`   Survey Responses:       ${surveyResponses.length}`)
  console.log(`   Training Programs:      ${trainingPrograms.length}`)
  console.log(`   Training Completions:   ${trainingCompletions.length}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
