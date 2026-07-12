import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

function getEsgWeights() {
  const defaultWeights = { env: 40, soc: 30, gov: 30 };
  try {
    const settingsPath = path.join(process.cwd(), 'src/lib/settings.json');
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed.esgWeights) {
        return parsed.esgWeights;
      }
    }
  } catch (err) {
    console.error("Failed to read esgWeights from settings", err);
  }
  return defaultWeights;
}

export async function GET(_request: NextRequest) {
  try {
    // 1. Calculate Environmental Score (avg of Department.score)
    const departments = await prisma.department.findMany({ select: { score: true } });
    const envScore = departments.length > 0 
      ? Math.round(departments.reduce((sum, d) => sum + d.score, 0) / departments.length)
      : 80;

    // 2. Calculate Governance Score (avg of Audit.score)
    const audits = await prisma.audit.findMany({
      where: { score: { not: null } },
      select: { score: true }
    });
    let govScore = 80;
    if (audits.length > 0) {
      govScore = Math.round(audits.reduce((sum, a) => sum + (a.score as number), 0) / audits.length);
    }

    // 3. Calculate Social Score (avg of SurveyResponse.overallScore)
    const surveyResponses = await prisma.surveyResponse.findMany({ select: { overallScore: true } });
    let socScore = 85;
    if (surveyResponses.length > 0) {
      socScore = Math.round(surveyResponses.reduce((sum, r) => sum + r.overallScore, 0) / surveyResponses.length);
    }

    // 4. Calculate Overall ESG Score based on weights
    const weights = getEsgWeights();
    
    // Normalize weights just in case they don't add up to 100
    const totalWeight = weights.env + weights.soc + weights.gov;
    const normEnv = weights.env / totalWeight;
    const normSoc = weights.soc / totalWeight;
    const normGov = weights.gov / totalWeight;

    const overallEsgScore = Math.round(
      (envScore * normEnv) +
      (socScore * normSoc) +
      (govScore * normGov)
    );

    return NextResponse.json({
      success: true,
      data: {
        overallEsgScore,
        envScore,
        socScore,
        govScore,
        weights
      }
    });

  } catch (error: any) {
    console.error('Error fetching global dashboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch global dashboard data' },
      { status: 500 }
    );
  }
}
