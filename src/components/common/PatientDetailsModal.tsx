import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, User as UserIcon, AlertTriangle, ActivityIcon, Clock, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import type { Pregnancy } from '@/types';
import { DEMO_USERS } from '@/lib/demo-data';
import { Badge } from '@/components/ui/badge';
import { cn, formatDateTime, getRiskColor } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { RiskProgressionChart } from '@/components/charts/RiskCharts';
import { PregnancyCalendar } from '@/components/common/PregnancyCalendar';

interface PatientDetailsModalProps {
  pregnancy: Pregnancy | null;
  isOpen: boolean;
  onClose: () => void;
}


export function PatientDetailsModal({ pregnancy, isOpen, onClose }: PatientDetailsModalProps) {
  const { t } = useTranslation();
  const { riskHistory } = useData();
  const { user } = useAuth();

  if (!pregnancy) return null;

  const ashaWorker = DEMO_USERS.find(u => u.id === pregnancy.ashaWorkerId);
  const riskVariant = pregnancy.riskLevel === 'RED' ? 'red' : pregnancy.riskLevel === 'YELLOW' ? 'yellow' : 'green';
  const myHistory = riskHistory.filter(r => r.pregnancyId === pregnancy.id).sort((a, b) => a.week - b.week);

  const score = pregnancy.riskScore;
  const demoRec = score < 35
    ? 'Continue routine care and daily check-ins. You are doing great!'
    : score < 65
    ? 'Increase hydration to 8+ glasses/day. Monitor BP daily. Contact ASHA if headache persists.'
    : 'Visit PHC immediately. Contact your ASHA worker. Avoid physical exertion.';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur-md">
              <h2 className="text-xl font-bold text-gray-900">{t('common.patientDetails', 'Patient Information')}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {pregnancy.womanName}
                    {pregnancy.isHighRisk && <AlertTriangle className="h-5 w-5 text-red-500" />}
                  </h1>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {pregnancy.villageName}
                    </div>
                  </div>
                </div>
                <Badge variant={riskVariant} className="text-sm px-3 py-1 uppercase self-start">
                  {pregnancy.riskLevel}
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">{t('pregnancyCard.week', 'Week')}</p>
                  <p className="text-xl font-bold text-primary-600">{pregnancy.gestationalWeek}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">{t('pregnancyCard.score', 'Score')}</p>
                  <p className="text-xl font-bold text-gray-900">{pregnancy.riskScore}/100</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">{t('pregnancyCard.trimester', 'Trimester')}</p>
                  <p className="text-xl font-bold text-gray-900">T{pregnancy.trimester}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">{t('common.dueDate', 'Due Date')}</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{new Date(pregnancy.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Medical Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5 text-gray-500" />
                  Health Indicators
                </h3>
                <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                  {pregnancy.bloodPressure && (
                    <div className="flex items-center justify-between p-4 bg-white">
                      <span className="text-sm text-gray-500">Blood Pressure</span>
                      <span className={cn("font-medium px-2 py-1 rounded-lg border", getRiskColor(pregnancy.riskLevel))}>
                        {pregnancy.bloodPressure}
                      </span>
                    </div>
                  )}
                  {pregnancy.previousComplications && pregnancy.previousComplications.length > 0 && (
                    <div className="p-4 space-y-2 bg-white">
                      <span className="text-sm text-gray-500 block">Previous Complications</span>
                      <div className="flex flex-wrap gap-2">
                        {pregnancy.previousComplications.map((comp, idx) => (
                          <span key={idx} className="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-md border border-red-100">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-4 bg-white">
                    <span className="text-sm text-gray-500">Last Report</span>
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formatDateTime(pregnancy.lastReportAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Graph and AI Rec */}
              {myHistory.length > 1 && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-primary-50 border border-violet-100 p-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-semibold text-violet-600 mb-0.5">{t('woman.aiRecommendation', 'AI Recommendation')}</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{demoRec}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                      <ActivityIcon className="h-5 w-5 text-gray-500" />
                      Risk History
                    </h3>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <RiskProgressionChart 
                        weeks={myHistory.map(h => h.week)} 
                        scores={myHistory.map(h => h.riskScore)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pregnancy Calendar */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  Daily Log
                </h3>
                <PregnancyCalendar pregnancy={pregnancy} />
              </div>

              {/* PHC Doctor Only: ASHA Visit History */}
              {user?.role === 'phc' && (
                <div className="space-y-3">
                   <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                     <UserIcon className="h-5 w-5 text-gray-500" />
                     ASHA Visit History
                   </h3>
                   <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100 bg-white overflow-hidden">
                      <div className="p-4 flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium text-gray-900">Home Visit (Routine)</p>
                           <p className="text-xs text-gray-500">Checked BP, weight, gave supplements</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                           <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
                           <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                             <Clock className="h-3 w-3" /> 2 days ago
                           </span>
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium text-gray-900">Phone Follow-up</p>
                           <p className="text-xs text-gray-500">Discussed recent symptom report</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                           <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
                           <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                             <Clock className="h-3 w-3" /> 1 week ago
                           </span>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Management Info */}
              <div className="rounded-2xl bg-primary-50/50 border border-primary-100 p-5">
                <h3 className="text-sm font-semibold text-primary-900 mb-3 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Managed By
                </h3>
                {ashaWorker ? (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold">
                      {ashaWorker.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{ashaWorker.name} (ASHA)</p>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" />
                        {ashaWorker.phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">ASHA Worker info not available.</p>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
