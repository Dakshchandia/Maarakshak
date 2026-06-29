import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Pill, Check, Clock, Plus, AlertTriangle, Sparkles,
  Upload, FileText, Image, Video, X, Loader2,
  CheckCircle, Trash2, Activity,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { MedicineReminder } from '@/types';

// ─── Upload Source Button ─────────────────────────────────────────────────────
function UploadSourceBtn({ icon: Icon, label, accept, onFile, loading }: {
  icon: React.ElementType; label: string; accept: string;
  onFile: (f: File) => void; loading?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button onClick={() => ref.current?.click()} disabled={loading}
        className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 p-4 text-center hover:border-primary-400 hover:bg-primary-50 transition-all disabled:opacity-50 min-w-[100px]">
        {loading ? <Loader2 className="h-6 w-6 text-primary-400 animate-spin" /> : <Icon className="h-6 w-6 text-primary-500" />}
        <span className="text-xs font-semibold text-primary-700">{label}</span>
      </button>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
    </>
  );
}

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
  const [duration, setDuration] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    onAdd({
      pregnancyId, womanId,
      name: name.trim(),
      dosage: dosage || 'As prescribed',
      frequency, time,
      taken: false,
    });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-gray-900">Add Medicine Manually</h3>
          <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Medicine Name *</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Iron + Folic Acid" autoFocus />
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                {['Once daily','Twice daily','Thrice daily','1-0-1','0-0-1','Once at night','Weekly','As needed'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Duration</label>
              <Input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 3 months" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Purpose (optional)</label>
            <Input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. Iron deficiency anaemia" />
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
  const {
    medicines, pregnancies, toggleMedicineTaken,
    addMedicineFromReport, addManualMedicine, deleteMedicine,
    addAppointmentFromReport,
  } = useData();
  const pregnancy = pregnancies.find(p => p.id === user?.linkedPregnancyId) || pregnancies[0];
  // Only show user's medicines (report-extracted or manually added)
  const myMeds = medicines.filter(m => m.pregnancyId === pregnancy?.id);

  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const getMedStatus = (med: MedicineReminder) => {
    if (med.taken) return 'taken';
    const [h, m] = (med.time || '08:00').split(':').map(Number);
    const medMin = h * 60 + m;
    if (medMin < currentMinutes - 30) return 'missed';
    if (medMin <= currentMinutes + 60) return 'upcoming';
    return 'pending';
  };

  const taken = myMeds.filter(m => m.taken).length;
  const adherence = myMeds.length > 0 ? Math.round((taken / myMeds.length) * 100) : 0;

  // Upload and extract medicines from any file
  const handleUpload = async (file: File, sourceLabel: string) => {
    if (!pregnancy) return;
    setUploading(true);
    setUploadMsg(`Analyzing ${sourceLabel}...`);
    try {
      const res = await api.analyzeFile(file, 'prescription', pregnancy.gestationalWeek);
      const meds = (res as any).medicines || [];
      const appts = (res as any).appointments || [];

      let added = 0;
      for (const med of meds) {
        if (med?.name?.trim()) {
          addMedicineFromReport({
            pregnancyId: pregnancy.id,
            womanId: user?.id || pregnancy.womanId,
            name: med.name,
            dosage: med.dosage || med.dose || 'As prescribed',
            frequency: med.frequency || 'As directed',
            time: med.time || '08:00',
            taken: false,
          });
          added++;
        }
      }
      for (const appt of appts) {
        if (appt?.title?.trim()) {
          addAppointmentFromReport({
            pregnancyId: pregnancy.id,
            womanId: user?.id || pregnancy.womanId,
            type: (['ANC','ultrasound','lab','follow_up'].includes(appt.type) ? appt.type : 'follow_up') as any,
            title: appt.title,
            date: appt.date ? new Date(appt.date).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
            status: 'upcoming',
            location: appt.location || 'Nearest PHC',
            notes: `Extracted from ${sourceLabel}`,
          });
        }
      }
      setUploadMsg(added > 0
        ? `✅ ${added} medicine${added > 1 ? 's' : ''} extracted and added!`
        : '⚠️ No medicines found in this file. Try typing values below or add manually.');
      setTimeout(() => setUploadMsg(''), 4000);
    } catch (err) {
      setUploadMsg('❌ Upload failed. Please try again.');
      setTimeout(() => setUploadMsg(''), 3000);
    } finally {
      setUploading(false);
    }
  };

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (myMeds.length === 0) {
    return (
      <div className="space-y-5 pb-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-primary-500 to-pink-500 p-6 text-white">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">MEDICATION HUB</p>
            <h1 className="text-2xl font-bold">{t('medicines.title')}</h1>
            <p className="text-white/80 text-sm mt-1">Upload a prescription to get started</p>
          </div>
        </div>

        {/* Upload options */}
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="text-center space-y-2 py-2">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-primary-100 flex items-center justify-center">
                <Pill className="h-8 w-8 text-primary-400" />
              </div>
              <p className="font-bold text-gray-700 text-lg">No Medicines Added</p>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                Upload a prescription, medical report, image, or recording to automatically extract medicine reminders.
              </p>
            </div>

            {uploadMsg && (
              <div className={cn('rounded-2xl p-3 text-sm text-center font-medium',
                uploadMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                uploadMsg.startsWith('❌') ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-blue-50 text-blue-700 border border-blue-200')}>
                {uploadMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <UploadSourceBtn icon={FileText} label="PDF Prescription" accept=".pdf"
                onFile={f => handleUpload(f, 'PDF Prescription')} loading={uploading} />
              <UploadSourceBtn icon={FileText} label="Medical Report" accept=".pdf"
                onFile={f => handleUpload(f, 'Medical Report')} loading={uploading} />
              <UploadSourceBtn icon={Image} label="Prescription Image" accept="image/*"
                onFile={f => handleUpload(f, 'Prescription Image')} loading={uploading} />
              <UploadSourceBtn icon={Video} label="Consultation Video" accept="video/*,audio/*"
                onFile={f => handleUpload(f, 'Consultation Recording')} loading={uploading} />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <Button className="w-full" variant="outline" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Medicine Manually
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence>
          {showAddModal && pregnancy && (
            <AddMedicineModal
              pregnancyId={pregnancy.id} womanId={user?.id || pregnancy.womanId}
              onAdd={addManualMedicine} onClose={() => setShowAddModal(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Medicines list ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-primary-500 to-pink-500 p-6 text-white">
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">MEDICATION HUB</p>
            <h1 className="text-2xl font-bold">{t('medicines.title')}</h1>
            <p className="text-white/80 text-sm mt-1">
              {myMeds.length > 0
                ? `${myMeds.length} medicine${myMeds.length > 1 ? 's' : ''} · Week ${pregnancy?.gestationalWeek}`
                : `Week ${pregnancy?.gestationalWeek} · Upload a prescription to start`}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline"
              className="border-white/30 text-white bg-transparent hover:bg-white/20"
              onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {myMeds.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>Today's adherence</span><span>{taken}/{myMeds.length} taken</span>
            </div>
            <div className="h-2 rounded-full bg-white/20">
              <motion.div initial={{ width: 0 }} animate={{ width: `${adherence}%` }}
                transition={{ duration: 1 }} className="h-full rounded-full bg-white" />
            </div>
          </div>
        )}      </motion.div>

      {/* Upload more */}
      <Card className="border-dashed border-primary-200 bg-primary-50/30">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-primary-600 mb-3 flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Add from prescription / report
          </p>
          {uploadMsg && (
            <div className={cn('rounded-xl p-2.5 text-xs text-center font-medium mb-3',
              uploadMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' :
              uploadMsg.startsWith('❌') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700')}>
              {uploadMsg}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <UploadSourceBtn icon={FileText} label="PDF" accept=".pdf"
              onFile={f => handleUpload(f, 'PDF')} loading={uploading} />
            <UploadSourceBtn icon={Image} label="Image" accept="image/*"
              onFile={f => handleUpload(f, 'Image')} loading={uploading} />
            <UploadSourceBtn icon={Video} label="Video" accept="video/*,audio/*"
              onFile={f => handleUpload(f, 'Recording')} loading={uploading} />
          </div>
        </CardContent>
      </Card>

      {/* Adherence score */}
      <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Adherence Score</p>
            <p className="text-3xl font-bold text-gray-800">{adherence}%</p>
            <p className={cn('text-sm font-semibold',
              adherence >= 90 ? 'text-emerald-600' : adherence >= 70 ? 'text-amber-600' : 'text-red-600')}>
              {adherence >= 90 ? '🌟 Excellent' : adherence >= 70 ? '👍 Good' : '⚠️ Needs Improvement'}
            </p>
          </div>
          <div className="relative h-16 w-16">
            <svg className="rotate-[-90deg]" width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#e0e7ff" strokeWidth="7" />
              <motion.circle cx="32" cy="32" r="26" fill="none"
                stroke={adherence >= 90 ? '#10b981' : adherence >= 70 ? '#f59e0b' : '#ef4444'}
                strokeWidth="7" strokeDasharray={2 * Math.PI * 26}
                initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - adherence / 100) }}
                transition={{ duration: 1.2 }} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="h-5 w-5 text-indigo-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Medications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Pill className="h-5 w-5 text-primary-500" /> Today's Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {myMeds.map(med => {
            const status = getMedStatus(med);
            return (
              <motion.div key={med.id} layout
                className={cn('rounded-2xl border p-4 flex items-center gap-3 transition-all',
                  status === 'taken' ? 'bg-emerald-50 border-emerald-200' :
                  status === 'missed' ? 'bg-red-50 border-red-200' :
                  status === 'upcoming' ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-100')}>
                <div className={cn('rounded-xl p-2.5 shrink-0',
                  status === 'taken' ? 'bg-emerald-100' : status === 'missed' ? 'bg-red-100' :
                  status === 'upcoming' ? 'bg-primary-100' : 'bg-gray-100')}>
                  <Pill className={cn('h-5 w-5',
                    status === 'taken' ? 'text-emerald-600' : status === 'missed' ? 'text-red-600' :
                    status === 'upcoming' ? 'text-primary-600' : 'text-gray-500')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{med.name}</p>
                  <p className="text-xs text-gray-500">{med.dosage} · {med.frequency}</p>
                  {(med as any).purpose && <p className="text-xs text-blue-600 mt-0.5">📋 {(med as any).purpose}</p>}
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> {med.time || '08:00'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge variant={status === 'taken' ? 'green' : status === 'missed' ? 'red' : 'yellow'} className="text-[10px]">
                    {status === 'taken' ? '✓ Taken' : status === 'missed' ? '✗ Missed' : status === 'upcoming' ? '⏰ Soon' : 'Pending'}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant={med.taken ? 'outline' : 'default'}
                      className="text-xs h-7 px-2" onClick={() => toggleMedicineTaken(med.id)}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline"
                      className="text-xs h-7 px-2 text-red-500 hover:text-red-700 hover:border-red-300"
                      onClick={() => deleteMedicine(med.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Smart Insight */}
      <Card className="bg-gradient-to-br from-primary-50 to-pink-50 border-primary-100">
        <CardContent className="p-4 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-primary-600 mb-1">Smart Insight</p>
            <p className="text-sm text-gray-700">
              {adherence === 100 ? 'All medicines taken today! Keep up the excellent adherence.' :
               taken === 0 ? `${myMeds.length} medicines pending today. Tap ✓ to mark each as taken.` :
               `${myMeds.length - taken} medicine${myMeds.length - taken > 1 ? 's' : ''} still pending. Regular intake is important for pregnancy health.`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && pregnancy && (
          <AddMedicineModal
            pregnancyId={pregnancy.id} womanId={user?.id || pregnancy.womanId}
            onAdd={addManualMedicine} onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
