const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSocial() {
  console.log('🌱 Seeding Social Module data...');
  
  // 1. Create CSR Categories
  await prisma.csrCategory.createMany({
    skipDuplicates: true,
    data: [
      { id: 1, name: 'Environmental', icon: 'TreePine', color: 'bg-green-500' },
      { id: 2, name: 'Community', icon: 'Users', color: 'bg-blue-500' },
      { id: 3, name: 'Education', icon: 'BookOpen', color: 'bg-yellow-500' },
      { id: 4, name: 'Health', icon: 'HeartPulse', color: 'bg-red-500' },
      { id: 5, name: 'Disaster Relief', icon: 'ShieldAlert', color: 'bg-orange-500' },
      { id: 6, name: 'Animal Welfare', icon: 'Dog', color: 'bg-amber-700' },
    ]
  });

  // 2. Create CSR Activities (with Picsum images)
  await prisma.csrActivity.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 1,
        title: 'Coastal Mangrove Restoration Drive',
        description: 'Join us in restoring the coastal mangroves to protect local shorelines and support biodiversity. We will be planting over 500 saplings.',
        categoryId: 1,
        location: 'Bay Area Coastal Reserve',
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-03-16'),
        maxParticipants: 40,
        xpReward: 25,
        status: 'COMPLETED',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
        organizerName: 'Green Earth Foundation',
      },
      {
        id: 2,
        title: 'Urban Community Garden Project',
        description: 'Help build a sustainable urban garden for the local neighborhood. Activities include soil preparation, planting, and setting up irrigation.',
        categoryId: 2,
        location: 'Downtown Community Center',
        startDate: new Date('2025-04-05'),
        endDate: new Date('2025-04-06'),
        maxParticipants: 30,
        xpReward: 20,
        status: 'COMPLETED',
        imageUrl: 'https://images.unsplash.com/photo-1466692476877-3aa0a14afc24?w=800&q=80',
        organizerName: 'Sofia Martinez',
      },
      {
        id: 3,
        title: 'STEM Mentorship for Underprivileged Youth',
        description: 'Spend your weekends mentoring high school students in basic programming, robotics, and mathematics. Make a lasting impact on their careers.',
        categoryId: 3,
        location: 'City Library Hub',
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-03-21'),
        maxParticipants: 20,
        xpReward: 50,
        status: 'COMPLETED',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
        organizerName: 'Raj Patel',
      },
      {
        id: 4,
        title: 'Habitat for Humanity House Build',
        description: 'Partner with Habitat for Humanity to build a new home for a family in need. No prior construction experience required.',
        categoryId: 2,
        location: 'Westside Suburbs',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-03'),
        maxParticipants: 15,
        xpReward: 40,
        status: 'UPCOMING',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?w=800&q=80',
        organizerName: 'Habitat for Humanity',
      },
      {
        id: 5,
        title: 'Corporate Blood Donation Camp',
        description: 'Annual corporate blood donation drive in partnership with the Red Cross. Every drop counts!',
        categoryId: 4,
        location: 'Main Office Campus (Lobby)',
        startDate: new Date('2025-05-12'),
        endDate: new Date('2025-05-12'),
        maxParticipants: 100,
        xpReward: 15,
        status: 'COMPLETED',
        imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&q=80',
        organizerName: 'Amara Okafor',
      },
    ]
  });

  // Fetch employees to assign participations
  const employees = await prisma.employee.findMany();
  
  if (employees.length === 0) {
    console.log('No employees found, skipping participations.');
    return;
  }

  // Assign Participations
  for (let i = 0; i < 20; i++) {
    const emp = employees[i % employees.length];
    await prisma.employeeParticipation.create({
      data: {
        employeeId: emp.id,
        activityId: (i % 5) + 1,
        hoursContributed: 4.5,
        approvalStatus: 'APPROVED',
        pointsEarned: 25,
      }
    }).catch(() => {});
  }

  // Create Engagement Surveys
  await prisma.engagementSurvey.createMany({
    skipDuplicates: true,
    data: [
      { id: 1, title: 'Q1 2025 Engagement Survey', quarter: 'Q1', year: 2025, isActive: false },
      { id: 2, title: 'Q2 2025 Engagement Survey', quarter: 'Q2', year: 2025, isActive: true },
    ]
  });

  // Add Survey Responses
  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    await prisma.surveyResponse.create({
      data: {
        surveyId: 2,
        employeeId: emp.id,
        overallScore: Math.floor(Math.random() * 3) + 7, // 7 to 9
        workLifeBalance: Math.floor(Math.random() * 4) + 6,
        teamCollaboration: Math.floor(Math.random() * 3) + 8,
        growthOpportunities: Math.floor(Math.random() * 4) + 5,
        managementSupport: Math.floor(Math.random() * 4) + 6,
      }
    }).catch(() => {});
  }

  // Training Programs
  await prisma.trainingProgram.createMany({
    skipDuplicates: true,
    data: [
      { id: 1, title: 'Code of Conduct 2025', category: 'Compliance', durationHours: 1.5, isMandatory: true, status: 'ACTIVE' },
      { id: 2, title: 'Anti-Harassment Workshop', category: 'Compliance', durationHours: 2, isMandatory: true, status: 'ACTIVE' },
      { id: 3, title: 'Data Privacy & Security', category: 'Compliance', durationHours: 1, isMandatory: true, status: 'ACTIVE' },
    ]
  });

  // Training Completions
  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    await prisma.trainingCompletion.create({
      data: {
        trainingId: 1,
        employeeId: emp.id,
        status: i % 3 === 0 ? 'NOT_STARTED' : 'COMPLETED',
      }
    }).catch(() => {});
  }

  console.log('✅ Social data successfully seeded!');
}

seedSocial()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
