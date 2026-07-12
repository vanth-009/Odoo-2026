import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const surveys = await prisma.engagementSurvey.findMany({
      include: {
        responses: true,
      },
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

    const surveysWithAvg = surveys.map((survey) => {
      const resp = survey.responses || [];
      const count = resp.length;
      return {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        quarter: survey.quarter,
        year: survey.year,
        isActive: survey.isActive,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt,
        responsesCount: count,
        averageScores: {
          workLifeBalance: count > 0 ? parseFloat((resp.reduce((s, r) => s + r.workLifeBalance, 0) / count).toFixed(2)) : 0,
          teamCollaboration: count > 0 ? parseFloat((resp.reduce((s, r) => s + r.teamCollaboration, 0) / count).toFixed(2)) : 0,
          growthOpportunities: count > 0 ? parseFloat((resp.reduce((s, r) => s + r.growthOpportunities, 0) / count).toFixed(2)) : 0,
          managementSupport: count > 0 ? parseFloat((resp.reduce((s, r) => s + r.managementSupport, 0) / count).toFixed(2)) : 0,
          overallScore: count > 0 ? parseFloat((resp.reduce((s, r) => s + r.overallScore, 0) / count).toFixed(2)) : 0,
        }
      };
    });

    const allResponses = await prisma.surveyResponse.findMany();
    const totalResponses = allResponses.length;
    
    const overallScore = totalResponses > 0
      ? parseFloat((allResponses.reduce((sum, r) => sum + r.overallScore, 0) / totalResponses).toFixed(2))
      : 0;

    const categoryBreakdown = {
      workLifeBalance: totalResponses > 0
        ? parseFloat((allResponses.reduce((sum, r) => sum + r.workLifeBalance, 0) / totalResponses).toFixed(2))
        : 0,
      teamCollaboration: totalResponses > 0
        ? parseFloat((allResponses.reduce((sum, r) => sum + r.teamCollaboration, 0) / totalResponses).toFixed(2))
        : 0,
      growthOpportunities: totalResponses > 0
        ? parseFloat((allResponses.reduce((sum, r) => sum + r.growthOpportunities, 0) / totalResponses).toFixed(2))
        : 0,
      managementSupport: totalResponses > 0
        ? parseFloat((allResponses.reduce((sum, r) => sum + r.managementSupport, 0) / totalResponses).toFixed(2))
        : 0,
    };

    const quarterMap: Record<string, { sum: number; count: number }> = {};
    for (const survey of surveys) {
      const date = new Date(survey.createdAt);
      const key = `${survey.year}-Q${survey.quarter}`;
      const resp = survey.responses || [];
      const count = resp.length;
      if (count > 0) {
        if (!quarterMap[key]) {
          quarterMap[key] = { sum: 0, count: 0 };
        }
        quarterMap[key].sum += resp.reduce((s, r) => s + r.overallScore, 0);
        quarterMap[key].count += count;
      }
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
