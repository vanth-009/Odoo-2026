import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        gender: true,
        dateOfBirth: true,
        department: {
          select: { name: true }
        },
        ethnicity: true,
      },
    });

    const totalEmployees = employees.length;

    if (totalEmployees === 0) {
      return NextResponse.json({
        data: {
          totalEmployees: 0,
          genderDistribution: [],
          ageDistribution: [],
          departmentDistribution: [],
          ethnicityDistribution: [],
          diversityIndex: 0,
        },
      });
    }

    // Gender Distribution
    const genderCounts: Record<string, number> = {};
    for (const emp of employees) {
      const gender = emp.gender || 'Unknown';
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    }
    const genderDistribution = Object.entries(genderCounts).map(([gender, count]) => ({
      gender,
      count,
      percentage: parseFloat(((count / totalEmployees) * 100).toFixed(2)),
    }));

    // Age Distribution
    const ageBuckets: Record<string, number> = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '55+': 0,
    };

    const now = new Date();
    for (const emp of employees) {
      if (!emp.dateOfBirth) continue;
      const dob = new Date(emp.dateOfBirth);
      let age = now.getFullYear() - dob.getFullYear();
      const monthDiff = now.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
        age--;
      }

      if (age >= 18 && age <= 25) ageBuckets['18-25']++;
      else if (age >= 26 && age <= 35) ageBuckets['26-35']++;
      else if (age >= 36 && age <= 45) ageBuckets['36-45']++;
      else if (age >= 46 && age <= 55) ageBuckets['46-55']++;
      else if (age > 55) ageBuckets['55+']++;
    }

    const employeesWithDob = employees.filter((e) => e.dateOfBirth).length;
    const ageDistribution = Object.entries(ageBuckets).map(([range, count]) => ({
      range,
      count,
      percentage: employeesWithDob > 0
        ? parseFloat(((count / employeesWithDob) * 100).toFixed(2))
        : 0,
    }));

    // Department Distribution
    const departmentCounts: Record<string, number> = {};
    for (const emp of employees) {
      const dept = emp.department?.name || 'Unknown';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    }
    const departmentDistribution = Object.entries(departmentCounts).map(([department, count]) => ({
      department,
      count,
      percentage: parseFloat(((count / totalEmployees) * 100).toFixed(2)),
    }));

    // Ethnicity Distribution
    const ethnicityCounts: Record<string, number> = {};
    for (const emp of employees) {
      const ethnicity = emp.ethnicity || 'Unknown';
      ethnicityCounts[ethnicity] = (ethnicityCounts[ethnicity] || 0) + 1;
    }
    const ethnicityDistribution = Object.entries(ethnicityCounts).map(([ethnicity, count]) => ({
      ethnicity,
      count,
      percentage: parseFloat(((count / totalEmployees) * 100).toFixed(2)),
    }));

    // Diversity Index (Shannon Index)
    const allDistributions = [genderDistribution, ethnicityDistribution];
    let shannonSum = 0;
    let categoriesCount = 0;

    for (const dist of allDistributions) {
      for (const item of dist) {
        const pi = item.count / totalEmployees;
        if (pi > 0) {
          shannonSum += -pi * Math.log(pi);
          categoriesCount++;
        }
      }
    }

    const maxEntropy = categoriesCount > 1 ? Math.log(categoriesCount) : 1;
    const diversityIndex = parseFloat((shannonSum / maxEntropy).toFixed(4));

    return NextResponse.json({
      data: {
        totalEmployees,
        genderDistribution,
        ageDistribution,
        departmentDistribution,
        ethnicityDistribution,
        diversityIndex,
      },
    });
  } catch (error) {
    console.error('Error computing diversity metrics:', error);
    return NextResponse.json(
      { error: 'Failed to compute diversity metrics' },
      { status: 500 }
    );
  }
}
