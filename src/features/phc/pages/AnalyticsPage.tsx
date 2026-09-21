import { useTranslation } from 'react-i18next';
import { DEMO_ANALYTICS } from '@/lib/demo-data';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskTrendChart, RiskDistributionChart } from '@/components/charts/RiskCharts';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { pregnancies } = useData();
  
  // Use the latest district-level analytics for the pie chart and summary
  // to make the data scale realistic (thousands of pregnancies)
  const latestAnalytics = DEMO_ANALYTICS[DEMO_ANALYTICS.length - 1];
  const stats = {
    green: latestAnalytics.greenCount,
    yellow: latestAnalytics.yellowCount,
    red: latestAnalytics.redCount,
  };

  const insights = [
    'RED cases increased by 15% in week 25 — primarily in Chomu and Sanganer villages',
    'ASHA follow-up compliance at 87% — above target of 80%',
    'Voice reporting adoption increased 35% since MaaRaksha deployment',
    'Preeclampsia early detection rate improved by 40% compared to paper register baseline',
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t('phc.analytics', { defaultValue: 'Analytics & Insights' })}</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t('phc.weeklyTrend', { defaultValue: 'Risk Trend' })}</CardTitle></CardHeader>
          <CardContent>
            <RiskTrendChart
              labels={DEMO_ANALYTICS.map(a => a.week.replace('2026-', ''))}
              green={DEMO_ANALYTICS.map(a => a.greenCount)}
              yellow={DEMO_ANALYTICS.map(a => a.yellowCount)}
              red={DEMO_ANALYTICS.map(a => a.redCount)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t('phc.populationDist', { defaultValue: 'Population Distribution' })}</CardTitle></CardHeader>
          <CardContent>
            <RiskDistributionChart green={stats.green} yellow={stats.yellow} red={stats.red} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('district.aiInsights', { defaultValue: 'AI Insights' })}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-indigo-50 p-4">
              <Badge>{i + 1}</Badge>
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t('phc.monthlySummary', { defaultValue: 'Monthly Summary' })}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-4 text-center">
                <p className="text-3xl font-bold text-emerald-600">{stats.green}</p>
                <p className="text-sm text-emerald-700">{t('phc.lowRiskGreen', { defaultValue: 'Low Risk' })}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">{stats.yellow}</p>
                <p className="text-sm text-amber-700">{t('phc.mediumRiskYellow', { defaultValue: 'Medium' })}</p>
              </div>
              <div className="rounded-xl bg-red-50 p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{stats.red}</p>
                <p className="text-sm text-red-700">{t('phc.highRiskRed', { defaultValue: 'High Risk' })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t('district.trimesterBreakdown', { defaultValue: 'Trimester Breakdown' })}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { tri: 1, count: 685, red: 32 },
                { tri: 2, count: 820, red: 58 },
                { tri: 3, count: 805, red: 78 }
              ].map(({ tri, count, red }) => (
                <div key={tri} className="rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold">T{tri}</p>
                  <p className="text-sm text-gray-500">{count} {t('district.pregnancies', { defaultValue: 'pregnancies' })}</p>
                  <p className="text-xs text-red-500 mt-1">{red} {t('common.high', { defaultValue: 'high' }).toLowerCase()} risk</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
