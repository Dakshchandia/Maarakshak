import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { getDemoStats, DEMO_DISTRICTS } from '@/lib/demo-data';
import { StatCard } from '@/components/common/StatCard';
import { PregnancyCard } from '@/components/common/PregnancyCard';
import { PatientDetailsModal } from '@/components/common/PatientDetailsModal';
import { RiskDistributionChart } from '@/components/charts/RiskCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertTriangle, FileText, Activity, MapPin } from 'lucide-react';
import { sortByRisk } from '@/lib/utils';
import type { Pregnancy } from '@/types';

export default function PhcHome() {
  const { t } = useTranslation();
  const { pregnancies, alerts, riskReports } = useData();
  const stats = getDemoStats('phc');
  const highRisk = sortByRisk(pregnancies.filter(p => p.riskLevel !== 'GREEN')).slice(0, 4);
  const [selectedPregnancy, setSelectedPregnancy] = useState<Pregnancy | null>(null);
  const district = DEMO_DISTRICTS[0];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">{district.name} {t('phc.dashboardTitle', { defaultValue: 'Medical Officer Dashboard' })}</h2>
          <p className="text-gray-600">{district.state} · {t('common.population', { defaultValue: 'Population' })}: {district.population.toLocaleString()}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title={t('phc.totalPatients', { defaultValue: 'Total Patients' })} value={stats.totalPregnancies} icon={Users} />
        <StatCard title={t('phc.highRiskCases', { defaultValue: 'High Risk' })} value={stats.highRisk} icon={AlertTriangle} color="from-red-500 to-rose-500" />
        <StatCard title={t('district.villagesCovered', { defaultValue: 'Villages Covered' })} value={5} icon={MapPin} color="from-blue-500 to-indigo-500" />
        <StatCard title={t('phc.reportsGenerated', { defaultValue: 'Reports' })} value={riskReports.length} icon={FileText} />
        <StatCard title={t('phc.alertsToday', { defaultValue: 'Alerts Today' })} value={stats.alertsToday} icon={Activity} color="from-amber-500 to-orange-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t('phc.riskDistribution', { defaultValue: 'Risk Distribution' })}</CardTitle></CardHeader>
          <CardContent>
            <RiskDistributionChart green={stats.lowRisk} yellow={stats.mediumRisk} red={stats.highRisk} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t('phc.recentAlerts', { defaultValue: 'Recent Alerts' })}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {alerts.slice(0, 4).map(a => (
              <div key={a.id} className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="font-medium">{a.womanName} — {a.riskLevel}</p>
                <p className="text-xs text-gray-500 mt-1">{a.message.slice(0, 80)}...</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold">{t('phc.casesAttention', { defaultValue: 'Cases Needing Attention' })}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {highRisk.map(p => <PregnancyCard key={p.id} pregnancy={p} onClick={() => setSelectedPregnancy(p)} />)}
      </div>

      <PatientDetailsModal
        pregnancy={selectedPregnancy}
        isOpen={!!selectedPregnancy}
        onClose={() => setSelectedPregnancy(null)}
      />
    </div>
  );
}
