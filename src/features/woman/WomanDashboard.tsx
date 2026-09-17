import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, ClipboardCheck, Heart, Stethoscope,
  AlertTriangle, Bell,
  Utensils, FileText, Pill, Calendar,
  MapPin, Upload,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { NavGroup } from '@/components/layout/DashboardLayout';
import WomanHome from './pages/WomanHome';
import DailyCheckInPage from './pages/DailyCheckInPage';
import JourneyPage from './pages/JourneyPage';
import NutritionPlannerPage from './pages/NutritionPlannerPage';
import MedicalCenterPage from './pages/MedicalCenterPage';
import EmergencyPage from './pages/EmergencyPage';
import NotificationsPage from '@/features/shared/NotificationsPage';

export default function WomanDashboard() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language; // consume language to ensure re-render on change

  // Force re-render when language changes so nav labels update
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const onLangChange = () => forceUpdate(n => n + 1);
    i18n.on('languageChanged', onLangChange);
    return () => i18n.off('languageChanged', onLangChange);
  }, [i18n]);

  const nav: NavGroup[] = [
    {
      label: t('nav.home'),
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: '/dashboard/woman',
      direct: true,
    },
    {
      label: t('nav.dailyCheckin'),
      icon: <ClipboardCheck className="h-4 w-4" />,
      path: '/dashboard/woman/checkin',
      direct: true,
    },
    {
      label: t('nav.pregnancyJourney'),
      icon: <Heart className="h-4 w-4" />,
      children: [
        { path: '/dashboard/woman/journey',   label: t('nav.timelineCalendar'), icon: <Heart className="h-3.5 w-3.5" /> },
        { path: '/dashboard/woman/nutrition', label: t('nav.nutritionPlanner'), icon: <Utensils className="h-3.5 w-3.5" /> },
      ],
    },
    {
      label: t('nav.medicalCenter'),
      icon: <Stethoscope className="h-4 w-4" />,
      children: [
        { path: '/dashboard/woman/medical?tab=reports',      label: t('nav.healthReports'),  icon: <FileText className="h-3.5 w-3.5" /> },
        { path: '/dashboard/woman/medical?tab=analyzer',     label: t('nav.reportAnalyzer'), icon: <Upload className="h-3.5 w-3.5" /> },
        { path: '/dashboard/woman/medical?tab=medicines',    label: t('nav.medicines'),      icon: <Pill className="h-3.5 w-3.5" /> },
        { path: '/dashboard/woman/medical?tab=appointments', label: t('nav.appointments'),   icon: <Calendar className="h-3.5 w-3.5" /> },
      ],
    },
    {
      label: t('nav.emergencyHospitals'),
      icon: <AlertTriangle className="h-4 w-4" />,
      children: [
        { path: '/dashboard/woman/emergency?tab=sos',       label: t('nav.sosAlerts'),   icon: <AlertTriangle className="h-3.5 w-3.5" /> },
        { path: '/dashboard/woman/emergency?tab=hospitals', label: t('nav.findHospital'), icon: <MapPin className="h-3.5 w-3.5" /> },
      ],
    },
    {
      label: t('nav.notifications'),
      icon: <Bell className="h-4 w-4" />,
      path: '/dashboard/woman/notifications',
      direct: true,
    },
  ];

  return (
    <DashboardLayout titleKey="woman.dashboardTitle" navItems={nav}>
      <Routes>
        <Route index                  element={<WomanHome />} />
        <Route path="checkin"         element={<DailyCheckInPage />} />
        <Route path="voice"           element={<DailyCheckInPage />} />
        <Route path="journey"         element={<JourneyPage />} />
        <Route path="knowledge"       element={<JourneyPage />} />
        <Route path="nutrition"       element={<NutritionPlannerPage />} />
        <Route path="medical"         element={<MedicalCenterPage />} />
        <Route path="emergency"       element={<EmergencyPage />} />
        <Route path="hospitals"       element={<EmergencyPage defaultTab="hospitals" />} />
        <Route path="notifications"   element={<NotificationsPage />} />
        {/* Backwards compat aliases */}
        <Route path="appointments"    element={<MedicalCenterPage defaultTab="appointments" />} />
        <Route path="medicines"       element={<MedicalCenterPage defaultTab="medicines" />} />
        <Route path="reports"         element={<MedicalCenterPage defaultTab="reports" />} />
        <Route path="report-analyzer" element={<MedicalCenterPage defaultTab="analyzer" />} />
        <Route path="high-risk"       element={<MedicalCenterPage defaultTab="reports" />} />
        <Route path="*"               element={<Navigate to="/dashboard/woman" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
