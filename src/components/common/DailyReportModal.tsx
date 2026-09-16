import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Droplets, Moon, HeartPulse, ClipboardList, AlertCircle, Thermometer } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  status: 'low' | 'medium' | 'high' | 'missed';
  score: number;
}

export function DailyReportModal({ isOpen, onClose, date, status, score }: DailyReportModalProps) {
  if (!date) return null;

  // Mocking data based on status
  const riskVariant = status === 'high' ? 'red' : status === 'medium' ? 'yellow' : status === 'low' ? 'green' : 'default';
  
  const symptoms = status === 'high' 
    ? ['Severe Headache', 'Swelling in hands', 'Blurred vision']
    : status === 'medium'
    ? ['Mild nausea', 'Fatigue']
    : ['None reported'];

  const bp = status === 'high' ? '145/95 mmHg' : status === 'medium' ? '130/85 mmHg' : '118/78 mmHg';
  const weight = '64.5 kg';
  const temp = '98.6 °F';
  
  const aiRecommendation = status === 'high'
    ? 'Critical Alert: Immediate medical attention required. Please visit the PHC. Contact your ASHA worker.'
    : status === 'medium'
    ? 'Monitor blood pressure closely. Drink plenty of water and rest. If symptoms persist, contact ASHA.'
    : 'All vital signs are normal. Continue with routine care and daily check-ins.';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur-md">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Daily Report</h2>
                <p className="text-sm text-gray-500">{format(date, 'EEEE, MMMM d, yyyy')}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {status === 'missed' ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No Report Submitted</h3>
                  <p className="text-gray-500 mt-2 text-sm max-w-[250px]">The patient missed their daily check-in on this date.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Risk Assessment</p>
                      <Badge variant={riskVariant as any} className="uppercase px-3 py-1 text-xs">
                        {status} Risk
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Health Score</p>
                      <p className="text-2xl font-bold text-gray-900">{score}/100</p>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <HeartPulse className="h-4 w-4 text-gray-500" />
                      Vitals Logged
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500">Blood Pressure</p>
                        <p className="font-semibold text-gray-900">{bp}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="font-semibold text-gray-900">{weight}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500">Temperature</p>
                        <p className="font-semibold text-gray-900">{temp}</p>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      Symptoms Reported
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {symptoms.map((sym, i) => (
                        <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                    <h3 className="font-semibold text-primary-900 flex items-center gap-2 mb-2 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      AI Recommendation Generated
                    </h3>
                    <p className="text-sm text-primary-800 leading-relaxed">
                      {aiRecommendation}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
