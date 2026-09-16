import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RiskProgressionChart } from '@/components/charts/RiskCharts';

interface AIHealthInsightsProps {
  pregnancy: { riskScore: number; riskLevel: string; gestationalWeek: number };
  riskHistory: { week: number; riskScore: number; riskLevel: string }[];
}

export function AIHealthInsights({ pregnancy, riskHistory }: AIHealthInsightsProps) {
  const { t } = useTranslation();
  const score = pregnancy.riskScore;
  const history = riskHistory.slice(-5);

  // Compute trend
  const trend: 'improving' | 'stable' | 'worsening' = useMemo(() => {
    if (history.length < 2) return 'stable';
    const last = history[history.length - 1].riskScore;
    const prev = history[history.length - 2].riskScore;
    if (last < prev - 3) return 'improving';
    if (last > prev + 3) return 'worsening';
    return 'stable';
  }, [history]);

  const predicted7 = trend === 'improving' ? Math.max(5, score - 4) : trend === 'worsening' ? Math.min(95, score + 5) : score;
  const predicted30 = trend === 'improving' ? Math.max(5, score - 10) : trend === 'worsening' ? Math.min(95, score + 12) : score + 2;

  const TrendIcon = trend === 'improving' ? TrendingDown : trend === 'worsening' ? TrendingUp : Minus;
  const trendStyle = trend === 'improving'
    ? { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-500', label: t('woman.improving', 'Improving') }
    : trend === 'worsening'
    ? { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: 'text-red-500', label: t('woman.worsening', 'Worsening') }
    : { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: 'text-amber-500', label: t('woman.stable', 'Stable') };

  const scoreColor = score >= 65 ? '#ef4444' : score >= 35 ? '#f59e0b' : '#10b981';

  // Gauge ring
  const r = 38, c = 2 * Math.PI * r;
  const fill = (score / 100) * c;

  const demoFactors = score < 35
    ? ['Good hydration', 'Regular medicines', 'Normal BP']
    : score < 65
    ? ['Mild headache reported', 'Low water intake', 'Borderline BP']
    : ['Elevated blood pressure', 'Reduced fetal movement', 'Severe headache'];

  const demoRec = score < 35
    ? 'Continue routine care and daily check-ins. You are doing great!'
    : score < 65
    ? 'Increase hydration to 8+ glasses/day. Monitor BP daily. Contact ASHA if headache persists.'
    : 'Visit PHC immediately. Contact your ASHA worker. Avoid physical exertion.';

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-violet-50">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            {t('woman.aiHealthInsights', 'AI Health Insights')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Score + Trend row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Gauge */}
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-500">{t('woman.currentRiskScore', 'Current Risk Score')}</p>
              <div className="relative h-24 w-24">
                <svg className="rotate-[-90deg]" width="96" height="96" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <motion.circle cx="48" cy="48" r={r} fill="none" stroke={scoreColor} strokeWidth="8"
                    strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - fill }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{score}</span>
                  <span className="text-[10px] text-gray-400">/ 100</span>
                </div>
              </div>
              <Badge variant={pregnancy.riskLevel === 'RED' ? 'red' : pregnancy.riskLevel === 'YELLOW' ? 'yellow' : 'green'} className="text-xs">
                {pregnancy.riskLevel === 'GREEN' ? 'Low Risk' : pregnancy.riskLevel === 'YELLOW' ? 'Medium Risk' : 'High Risk'}
              </Badge>
            </div>

            {/* Trend + predictions */}
            <div className="space-y-2">
              <div className={cn('rounded-2xl border p-3', trendStyle.bg)}>
                <p className="text-[10px] font-semibold text-gray-500 mb-1">{t('woman.trend', 'Trend')}</p>
                <div className="flex items-center gap-2">
                  <TrendIcon className={cn('h-5 w-5', trendStyle.icon)} />
                  <span className={cn('text-sm font-bold', trendStyle.text)}>{trendStyle.label}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3">
                <p className="text-[10px] font-semibold text-gray-500 mb-1.5">{t('woman.forecast', 'Forecast')}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{t('woman.next7Days', 'Next 7 Days')}</span>
                    <span className="text-xs font-bold text-blue-700">{predicted7}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-blue-100">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${predicted7}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full bg-blue-400" />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">{t('woman.next30Days', 'Next 30 Days')}</span>
                    <span className="text-xs font-bold text-indigo-700">{predicted30}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-indigo-100">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${predicted30}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full rounded-full bg-indigo-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk factors */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">{t('woman.mainRiskFactors', 'Main Risk Factors')}</p>
            <div className="flex flex-wrap gap-1.5">
              {demoFactors.map(f => (
                <span key={f} className={cn('rounded-full border px-2.5 py-1 text-xs font-medium',
                  score >= 65 ? 'bg-red-50 border-red-200 text-red-700' :
                  score >= 35 ? 'bg-amber-50 border-amber-200 text-amber-700' :
                  'bg-emerald-50 border-emerald-200 text-emerald-700')}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* AI recommendation */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-primary-50 border border-violet-100 p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-violet-600 mb-0.5">{t('woman.aiRecommendation', 'AI Recommendation')}</p>
                <p className="text-xs text-gray-700 leading-relaxed">{demoRec}</p>
              </div>
            </div>
          </div>

          {/* Mini risk chart */}
          {riskHistory.length > 1 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">{t('woman.riskHistory', 'Risk History')}</p>
              <RiskProgressionChart weeks={riskHistory.map(h => h.week)} scores={riskHistory.map(h => h.riskScore)} />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
