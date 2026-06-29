import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Pill, Check, Clock, Plus, AlertTriangle, Sparkles,
  CheckCircle, XCircle, TrendingUp, ChevronDown, ChevronUp,
  Activity, X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { MedicineReminder } from '@/types';

// ─── AI-recommended medicines based on pregnancy context ─────────────────────
const AI_RECS = [
  { name: 'Iron + Folic Acid', reason: 'Essential for preventing anaemia and supporting fetal neural development during pregnancy.', urgency: 'high' },
  { name: 'Calcium + Vitamin D3', reason: 'Supports fetal bone development and prevents maternal bone density loss.', urgency: 'medium' },
  { name: 'Omega-3 (DHA)', reason: 'Supports fetal brain and eye development, especially in the third trimester.', urgency: 'medium' },
];

// ─── Drug interaction warnings ─────────────────────────────────────────────
const INTERACTIONS = [
  { drugs: ['Iron', 'Calcium'], warning: 'Iron and Calcium should not be taken together. Maintain a 2-hour gap between doses.' },
  { drugs: ['Iron', 'Antacid'], warning: 'Antacids reduce iron absorption. Take iron 2 hours before or after antacids.' },
  { drugs: ['Metformin', 'Folic Acid'], warning: 'Metformin may reduce folic acid absorption. Ensure adequate supplementation.' },
];

// ─── Add Medicine Modal ────────────────────────────────────────────────────
function AddMedicineModal({ pregnancyId, womanId, onAdd, onClose }: {
  pregnancyId: string; womanId: string;
  onAdd: (med: Omit<MedicineReminder, 'id'>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [time, setTime] = useState('08:00');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    onAdd({ pregnancyId, womanId, name: name.trim(), dosage: dosage || 'As prescribed', frequency, time, taken: false });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-gray-900">Add Medicine</h3>
          <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Medicine Name *</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Iron + Folic Acid" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Dosage</label>
              <Input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g. 200mg" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Time</label>
              <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Frequency</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
              {['Once daily', 'Twice daily', 'Thrice daily', 'Once at night', 'As needed', 'Weekly'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Notes (optional)</label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Take after meals" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} disabled={!name.trim()}>
            <Plus className="h-4 w-4 mr-1" /> Save Medicine
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MedicinesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { medicines, pregnancies, toggleMedicineTaken, addMedicineFromReport } = useData();
  const pregnancy = pregnancies.find(p => p.id === user?.linkedPregnancyId) || pregnancies[0];
  const myMeds = medicines.filter(m => m.pregnancyId === pregnancy?.id);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);

  const now = new Date();
  const currentHour = now.getHours() * 60 + now.getMinutes();

  const getMedStatus = (med: MedicineReminder) => {
    if (med.taken) return 'taken';
    const [h, m] = (med.time || '08:00').split(':').map(Number);
    const medMinutes = h * 60 + m;
    if (medMinutes < currentHour - 30) return 'missed';
    if (medMinutes <= currentHour + 60) return 'upcoming';
    return 'pending';
  };

  const taken = myMeds.filter(m => m.taken).length;
  const adherence = myMeds.length > 0 ? Math.round((taken / myMeds.length) * 100) : 0;

  // Check interactions
  const medNames = myMeds.map(m => m.name.toLowerCase());
  const activeInteractions = INTERACTIONS.filter(i =>
    i.drugs.every(d => medNames.some(n => n.includes(d.toLowerCase())))
  );

  const timelineMeds = [...myMeds].sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <div className="space-y-5 pb-10">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-primary-500 to-pink-500 p-6 text-white">
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">MEDICATION HUB</p>
            <h1 className="text-2xl font-bold">{t('medicines.title')}</h1>
            <p className="text-white/80 text-sm mt-1">Week {pregnancy?.gestationalWeek} · Smart medication management</p>
          </div>
          <Button size="sm" variant="outline"
            className="border-white/30 text-white bg-transparent hover:bg-white/20 shrink-0"
            onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        {/* Adherence bar */}
        {myMeds.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>Today's adherence</span>
              <span>{taken}/{myMeds.length} taken</span>
            </div>
            <div className="h-2 rounded-full bg-white/20">
              <motion.div initial={{ width: 0 }} animate={{ width: `${adherence}%` }}
                transition={{ duration: 1 }} className="h-full rounded-full bg-white" />
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Drug Interaction Alert ── */}
      {activeInteractions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="p-4">
              <button onClick={() => setShowInteractions(v => !v)}
                className="flex items-center justify-between w-full">
                <p className="flex items-center gap-2 text-sm font-bold text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                  {activeInteractions.length} Drug Interaction Warning{activeInteractions.length > 1 ? 's' : ''}
                </p>
                {showInteractions ? <ChevronUp className="h-4 w-4 text-amber-500" /> : <ChevronDown className="h-4 w-4 text-amber-500" />}
              </button>
              <AnimatePresence>
                {showInteractions && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3 space-y-2">
                    {activeInteractions.map((inter, i) => (
                      <div key={i} className="rounded-xl bg-white border border-amber-200 p-3">
                        <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ {inter.drugs.join(' + ')}</p>
                        <p className="text-xs text-gray-600">{inter.warning}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Today's Medicines ── */}
      {myMeds.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-purple-500 to-primary-500 flex items-center justify-center">
                  <Pill className="h-4 w-4 text-white" />
                </div>
                Today's Medications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {timelineMeds.map(med => {
                const status = getMedStatus(med);
                return (
                  <motion.div key={med.id} layout
                    className={cn('rounded-2xl border p-4 flex items-center gap-4 transition-all',
                      status === 'taken' ? 'bg-emerald-50 border-emerald-200' :
                      status === 'missed' ? 'bg-red-50 border-red-200' :
                      status === 'upcoming' ? 'bg-primary-50 border-primary-200' :
                      'bg-white border-gray-100')}>
                    <div className={cn('rounded-xl p-2.5 shrink-0',
                      status === 'taken' ? 'bg-emerald-100' :
                      status === 'missed' ? 'bg-red-100' :
                      status === 'upcoming' ? 'bg-primary-100' : 'bg-gray-100')}>
                      <Pill className={cn('h-5 w-5',
                        status === 'taken' ? 'text-emerald-600' :
                        status === 'missed' ? 'text-red-600' :
                        status === 'upcoming' ? 'text-primary-600' : 'text-gray-500')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{med.name}</p>
                      <p className="text-xs text-gray-500">{med.dosage} · {med.frequency}</p>
                      {(med as any).purpose && (
                        <p className="text-xs text-blue-600 mt-0.5">📋 {(med as any).purpose}</p>
                      )}
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {med.time || '08:00'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge variant={status === 'taken' ? 'green' : status === 'missed' ? 'red' : 'yellow'}>
                        {status === 'taken' ? '✓ Taken' : status === 'missed' ? '✗ Missed' : status === 'upcoming' ? '⏰ Soon' : 'Pending'}
                      </Badge>
                      <Button size="sm" variant={med.taken ? 'outline' : 'default'}
                        className="text-xs h-7" onClick={() => toggleMedicineTaken(med.id)}>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        {med.taken ? t('common.undo') : t('common.markTaken')}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Empty State */
        <Card className="border-dashed border-2 border-primary-200">
          <CardContent className="py-12 text-center space-y-3">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary-100 flex items-center justify-center">
              <Pill className="h-8 w-8 text-primary-400" />
            </div>
            <p className="font-semibold text-gray-600">No medications added yet</p>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Upload a prescription, analyze a report, or add medicines manually.
            </p>
            <Button className="mt-2" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Medicine
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Adherence Score ── */}
      {myMeds.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-1">Medication Adherence</p>
                  <p className="text-4xl font-bold text-gray-800">{adherence}%</p>
                  <p className={cn('text-sm font-semibold mt-0.5',
                    adherence >= 90 ? 'text-emerald-600' : adherence >= 70 ? 'text-amber-600' : 'text-red-600')}>
                    {adherence >= 90 ? '🌟 Excellent' : adherence >= 70 ? '👍 Good' : '⚠️ Needs Improvement'}
                  </p>
                </div>
                <div className="relative h-20 w-20">
                  <svg className="rotate-[-90deg]" width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#e0e7ff" strokeWidth="8" />
                    <motion.circle cx="40" cy="40" r="32" fill="none"
                      stroke={adherence >= 90 ? '#10b981' : adherence >= 70 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8" strokeDasharray={2 * Math.PI * 32}
                      initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - adherence / 100) }}
                      transition={{ duration: 1.2, ease: 'easeOut' }} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700">{adherence}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600">
                <Activity className="h-3.5 w-3.5" />
                <span>{taken} of {myMeds.length} medicines taken today</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── AI Recommendations ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-violet-500" /> AI Recommended Supplements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {AI_RECS.map((rec, i) => (
              <div key={i} className="rounded-2xl bg-violet-50 border border-violet-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{rec.name}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{rec.reason}</p>
                  </div>
                  <Badge className={cn('shrink-0 text-[10px]',
                    rec.urgency === 'high' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200')}>
                    {rec.urgency === 'high' ? 'Essential' : 'Recommended'}
                  </Badge>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-gray-400 text-center pt-1">
              ⚕️ AI recommendations are informational. Always verify with your doctor.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Smart Insights ── */}
      {myMeds.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-primary-50 to-pink-50 border-primary-100">
            <CardContent className="p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide text-primary-600 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Smart Insights
              </p>
              {adherence === 100 && (
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">All medicines taken today. Keep up the excellent adherence!</p>
                </div>
              )}
              {adherence < 100 && adherence >= 70 && (
                <div className="flex items-start gap-2.5">
                  <TrendingUp className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{myMeds.length - taken} medicine{myMeds.length - taken > 1 ? 's' : ''} still pending today. Set a reminder to take them.</p>
                </div>
              )}
              {adherence < 70 && (
                <div className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Medication adherence is low. Regular intake is important for pregnancy health.</p>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <Pill className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Continue Iron supplementation daily. Take 1 hour before meals for best absorption.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Add Medicine Modal ── */}
      <AnimatePresence>
        {showAddModal && pregnancy && (
          <AddMedicineModal
            pregnancyId={pregnancy.id}
            womanId={user?.id || pregnancy.womanId}
            onAdd={addMedicineFromReport}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
