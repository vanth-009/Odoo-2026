import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_request: NextRequest) {
  try {
    const responses = await prisma.surveyResponse.findMany({
      orderBy: { submittedAt: 'desc' },
      include: { survey: true }
    });

    const totalResponses = responses.length;

    if (totalResponses === 0) {
      return NextResponse.json({
        data: {
          responses: [],
          overallScore: 0,
          categoryBreakdown: {
            workLifeBalance: 0,
            teamCollaboration: 0,
            growthOpportunities: 0,
            managementSupport: 0,
          },
          trendData: [],
          responseRate: 0,
          totalResponses: 0,
          totalEmployees: 0,
        },
      });
    }

    const overallScore = parseFloat(
      (responses.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / totalResponses).toFixed(2)
    );

    const categoryBreakdown = {
      workLifeBalance: parseFloat(
        (responses.reduce((sum, s) => sum + (s.workLifeBalance ?? 0), 0) / totalResponses).toFixed(2)
      ),
      teamCollaboration: parseFloat(
        (responses.reduce((sum, s) => sum + (s.teamCollaboration ?? 0), 0) / totalResponses).toFixed(2)
      ),
      growthOpportunities: parseFloat(
        (responses.reduce((sum, s) => sum + (s.growthOpportunities ?? 0), 0) / totalResponses).toFixed(2)
      ),
      managementSupport: parseFloat(
        (responses.reduce((sum, s) => sum + (s.managementSupport ?? 0), 0) / totalResponses).toFixed(2)
      ),
    };

    const quarterMap: Record<string, { sum: number; count: number }> = {};
    for (const response of responses) {
      const survey = response.survey;
      if (!survey) continue;
      const key = `${survey.year}-${survey.quarter}`;
      if (!quarterMap[key]) {
        quarterMap[key] = { sum: 0, count: 0 };
      }
      quarterMap[key].sum += response.overallScore ?? 0;
      quarterMap[key].count++;
    }

    const trendData = Object.entries(quarterMap)
      .map(([quarter, data]) => ({
        quarter,
        averageScore: parseFloat((data.sum / data.count).toFixed(2)),
        responses: data.count,
      }))
      .sort((a, b) => a.quarter.localeCompare(b.quarter));

    const totalEmployees = await prisma.employee.count();
    const responseRate = totalEmployees > 0
      ? parseFloat(((totalResponses / totalEmployees) * 100).toFixed(2))
      : 0;

    return NextResponse.json({
      data: {
        surveys: responses,
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
