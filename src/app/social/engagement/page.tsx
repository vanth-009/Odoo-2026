import React from 'react';
import { prisma } from '@/lib/db';
import { Users, BookOpen, Award, CheckCircle } from 'lucide-react';

export const revalidate = 0; // Disable caching

export default async function EngagementTrainingPage() {
  // Fetch real data from the database
  const responses = await prisma.surveyResponse.findMany();
  const totalResponses = responses.length;

  const engagementCategories = [
    { label: 'Work-Life Balance', key: 'workLifeBalance', color: 'bg-emerald-500' },
    { label: 'Team Collaboration', key: 'teamCollaboration', color: 'bg-teal-500' },
    { label: 'Growth Opportunities', key: 'growthOpportunities', color: 'bg-purple-500' },
    { label: 'Management Support', key: 'managementSupport', color: 'bg-blue-500' },
  ];

  const engagementData = engagementCategories.map(cat => {
    const sum = responses.reduce((s, r) => s + (r[cat.key as keyof typeof r] as number), 0);
    // Our survey ratings are out of 10, let's map them to 100% (e.g. rating 8 -> 80%)
    const avgPercentage = totalResponses > 0 ? Math.round((sum / totalResponses) * 10) : 0;
    return {
      category: cat.label,
      score: avgPercentage,
      color: cat.color
    };
  });

  const trainingPrograms = await prisma.trainingProgram.findMany({
    include: {
      completions: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const trainingData = trainingPrograms.map(prog => {
    const enrolled = prog.completions.length;
    const completed = prog.completions.filter(c => c.status === 'COMPLETED').length;
    const completionRate = enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0;
    return {
      id: prog.id,
      title: prog.title,
      category: prog.category,
      enrolled,
      completed,
      completionRate,
      isMandatory: prog.isMandatory
    };
  });

  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h3 className="text-xl font-bold text-white">Engagement &amp; Training</h3>
        <p className="mt-1 text-slate-400 text-sm">Monitor employee survey sentiment scores and track compliance training progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Surveys */}
        <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-sm flex flex-col">
          <h4 className="text-base font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Employee Survey Scores
          </h4>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {totalResponses === 0 ? (
              <p className="text-slate-400 text-sm text-center">No survey responses received yet.</p>
            ) : (
              engagementData.map((item, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-300 group-hover:text-emerald-400 transition-colors">{item.category}</span>
                    <span className="text-sm font-bold text-emerald-400">{item.score}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-1000 ease-out`} 
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 border-t border-white/5 pt-4 text-xs text-slate-500 flex justify-between">
            <span>Based on {totalResponses} total employee submissions</span>
            <span>Scale calibrated out of 10</span>
          </div>
        </div>

        {/* Training Programs */}
        <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Training Progress Track
          </h4>
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {trainingData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center">No training programs registered.</p>
            ) : (
              trainingData.map((prog) => (
                <div key={prog.id} className="p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{prog.title}</span>
                          {prog.isMandatory && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 font-medium">Mandatory</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {prog.completed} / {prog.enrolled} enrolled completed
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {prog.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${prog.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
