import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/social/engagement
// Return employee engagement survey data and computed metrics
export async function GET(_request: NextRequest) {
  try {
    // Fetch all surveys
    const surveys = await prisma.engagementSurvey.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const totalSurveys = surveys.length;

    if (totalSurveys === 0) {
      return NextResponse.json({
        data: {
          surveys: [],
          overallScore: 0,
          categoryBreakdown: {
            workLifeBalance: 0,
            teamCollaboration: 0,
            growthOpportunities: 0,
            managementSupport: 0,
          },
          trendData: [],
          responseRate: 0,
        },
      });
    }

    // --- Surveys with avg scores per dimension ---
    const surveysWithAvg = surveys.map((survey) => ({
      ...survey,
      averageScores: {
        workLifeBalance: survey.workLifeBalance,
        teamCollaboration: survey.teamCollaboration,
        growthOpportunities: survey.growthOpportunities,
        managementSupport: survey.managementSupport,
        overallScore: survey.overallScore,
      },
    }));

    // --- Overall Score: avg of all overallScore values ---
    const overallScore = parseFloat(
      (surveys.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / totalSurveys).toFixed(2)
    );

    // --- Category Breakdown: avg for each dimension ---
    const categoryBreakdown = {
      workLifeBalance: parseFloat(
        (surveys.reduce((sum, s) => sum + (s.workLifeBalance ?? 0), 0) / totalSurveys).toFixed(2)
      ),
      teamCollaboration: parseFloat(
        (surveys.reduce((sum, s) => sum + (s.teamCollaboration ?? 0), 0) / totalSurveys).toFixed(2)
      ),
      growthOpportunities: parseFloat(
        (surveys.reduce((sum, s) => sum + (s.growthOpportunities ?? 0), 0) / totalSurveys).toFixed(2)
      ),
      managementSupport: parseFloat(
        (surveys.reduce((sum, s) => sum + (s.managementSupport ?? 0), 0) / totalSurveys).toFixed(2)
      ),
    };

    // --- Trend Data: avg overallScore grouped by quarter ---
    const quarterMap: Record<string, { sum: number; count: number }> = {};
    for (const survey of surveys) {
      const date = new Date(survey.createdAt);
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      const key = `${date.getFullYear()}-Q${quarter}`;
      if (!quarterMap[key]) {
        quarterMap[key] = { sum: 0, count: 0 };
      }
      quarterMap[key].sum += survey.overallScore ?? 0;
      quarterMap[key].count++;
    }

    const trendData = Object.entries(quarterMap)
      .map(([quarter, data]) => ({
        quarter,
        averageScore: parseFloat((data.sum / data.count).toFixed(2)),
        responses: data.count,
      }))
      .sort((a, b) => a.quarter.localeCompare(b.quarter));

    // --- Response Rate: totalResponses / totalEmployees ---
    const totalEmployees = await prisma.employee.count();
    const totalResponses = totalSurveys;
    const responseRate = totalEmployees > 0
      ? parseFloat(((totalResponses / totalEmployees) * 100).toFixed(2))
      : 0;

    return NextResponse.json({
      data: {
        surveys: surveysWithAvg,
        overallScore,
        categoryBreakdown,
        trendData,
        responseRate,
        totalResponses,
        totalEmployees,
      },
    });
  } catch (error) {
    console.error('Error fetching engagement data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engagement data' },
      { status: 500 }
    );
  }
}
