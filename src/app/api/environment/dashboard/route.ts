import { NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/environment/services/dashboard';

export async function GET() {
  try {
    const data = await getDashboardMetrics();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error in dashboard metrics route:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve dashboard metrics: ' + error.message },
      { status: 500 }
    );
  }
}
