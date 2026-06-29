import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Baby, Scale, Calendar, User, ArrowRight, Sparkles, Activity,
  Heart, Users, Building, BarChart3, CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/common/Logo';
import { useAuth, getDashboardPath } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const MONTHS = Array.from({ length: 9 }, (_, i) => i + 1);

// ─── Role definitions shown on role-selection screen ─────────────────────────
const ROLES: {
  id: UserRole; emoji: string; label: string;
  desc: string; icon: React.ElementType; color: string; bg: string;
}[] = [
  { id: 'woman',    emoji: '🤰', label: 'Pregnant Patient',  desc: 'Track my pregnancy, health & medicines', icon: Heart,      color: 'text-pink-600',   bg: 'bg-pink-50 border-pink-200' },
  { id: 'asha',     emoji: '👩‍⚕️', label: 'ASHA Worker',      desc: 'Monitor village pregnancy cases',       icon: Users,      color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { id: 'family',   emoji: '👨‍👩‍👧', label: 'Family Member',    desc: 'Monitor my family member\'s health',    icon: Heart,      color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' },
  { id: 'phc',      emoji: '🏥', label: 'PHC / Doctor',      desc: 'Clinical reports & population analytics', icon: Building,  color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200' },
  { id: 'district', emoji: '📊', label: 'District Officer',  desc: 'Population health monitoring',          icon: BarChart3,  color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
];

export default function OnboardingPage() {
  const { t } = useTranslation();
  const { user, needsOnboarding, completeOnboarding, loginWithClerkUser } = useAuth();
  const navigate = useNavigate();

  // Step -1 = role selection (first screen for all new users)
  // Step 0-3 = pregnancy setup (only for 'woman' role)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    user?.role && user.role !== 'woman' ? user.role : null
  );
  const [roleConfirmed, setRoleConfirmed] = useState(false);
  const [step, setStep] = useState(0);

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [gestationalMonth, setGestationalMonth] = useState(user?.gestationalMonth?.toString() || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [symptoms, setSymptoms] = useState<string[]>(user?.symptoms || []);
  const [additionalInfo, setAdditionalInfo] = useState(user?.additionalInfo || '');
  const [previousReports, setPreviousReports] = useState(user?.previousReports || '');

  if (!user) { navigate('/login', { replace: true }); return null; }
  if (!needsOnboarding && user.onboardingComplete) {
    navigate(getDashboardPath(user.role), { replace: true });
    return null;
  }

  // ── Role confirmed — for non-woman roles, complete immediately ────────────
  const handleRoleConfirm = () => {
    if (!selectedRole) return;
    if (selectedRole !== 'woman') {
      // Non-woman roles: complete onboarding immediately with just the role
      completeOnboarding({
        name: user.name || name || 'User',
        age: 30,
        gestationalMonth: 0,
        weight: 60,
        symptoms: [],
        additionalInfo: '',
        previousReports: '',
        role: selectedRole,
      });
      navigate(getDashboardPath(selectedRole), { replace: true });
      return;
    }
    setRoleConfirmed(true);
  };

  // ── Pregnancy onboarding complete ─────────────────────────────────────────
  const handleFinish = () => {
    completeOnboarding({
      name: name.trim(),
      age: Number(age),
      gestationalMonth: Number(gestationalMonth),
      weight: Number(weight),
      symptoms,
      additionalInfo,
      previousReports,
      role: 'woman',
    });
    navigate(getDashboardPath('woman'), { replace: true });
  };

  const pregSteps = [
    { title: t('onboarding.step1Title', { defaultValue: 'About You' }),       subtitle: t('onboarding.step1Subtitle', { defaultValue: 'Tell us about yourself' }), icon: User },
    { title: t('onboarding.step2Title', { defaultValue: 'Your Pregnancy' }),   subtitle: t('onboarding.step2Subtitle', { defaultValue: 'How far along are you?' }),  icon: Baby },
    { title: t('onboarding.step3Title', { defaultValue: 'Health Details' }),   subtitle: t('onboarding.step3Subtitle', { defaultValue: 'Help us personalise care' }),icon: Scale },
    { title: t('onboarding.step4Title', { defaultValue: 'Symptoms & Reports'}),subtitle: t('onboarding.step4Subtitle', { defaultValue: 'How are you feeling?' }),    icon: Activity },
  ];

  const pregCanProceed = () => {
    if (step === 0) return name.trim().length >= 2 && Number(age) >= 15 && Number(age) <= 55;
    if (step === 1) return gestationalMonth !== '' && Number(gestationalMonth) >= 1 && Number(gestationalMonth) <= 9;
    if (step === 2) return Number(weight) >= 30 && Number(weight) <= 200;
    return true;
  };

  const CurrentIcon = pregSteps[step].icon;

  // ── SCREEN 1: Role Selection ───────────────────────────────────────────────
  if (!roleConfirmed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary-200/25 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-purple-200/25 blur-3xl" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <Logo size="md" className="mx-auto" />
            <div className="mt-4">
              <h1 className="font-display text-2xl font-bold text-gray-900">
                Welcome to MaaRaksha
              </h1>
              <p className="mt-2 text-gray-500 text-sm">
                Hi {user.name?.split(' ')[0] || 'there'}! Select your role to get started.
              </p>
            </div>
          </div>

          <div className="glass-card-premium p-6 space-y-3">
            <p className="text-sm font-semibold text-gray-600 mb-4">I am a:</p>
            {ROLES.map(role => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  'w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all',
                  selectedRole === role.id
                    ? `${role.bg} border-current shadow-md`
                    : 'bg-white border-gray-100 hover:border-primary-200'
                )}>
                <span className="text-2xl">{role.emoji}</span>
                <div className="flex-1">
                  <p className={cn('font-bold text-sm', selectedRole === role.id ? role.color : 'text-gray-800')}>
                    {role.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{role.desc}</p>
                </div>
                {selectedRole === role.id && (
                  <CheckCircle className={cn('h-5 w-5 shrink-0', role.color)} />
                )}
              </motion.button>
            ))}

            <Button
              className="w-full mt-4 rounded-2xl" size="lg"
              disabled={!selectedRole}
              onClick={handleRoleConfirm}>
              Continue as {selectedRole ? ROLES.find(r => r.id === selectedRole)?.label : '...'}{' '}
              <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── SCREEN 2: Pregnancy onboarding (woman only) ───────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary-200/25 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-purple-200/25 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Logo size="md" className="mx-auto" />
          <div className="mt-6 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <p className="text-sm font-medium text-primary-600">
              {t('onboarding.welcome', { defaultValue: "Let's set up your health profile" })}
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mb-8 flex justify-center gap-2">
          {pregSteps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${
              i === step ? 'w-8 bg-gradient-to-r from-primary-500 to-purple-600'
              : i < step ? 'w-2 bg-primary-400' : 'w-2 bg-gray-200'
            }`} />
          ))}
        </div>

        <div className="glass-card-premium p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-purple-100">
              <CurrentIcon className="h-7 w-7 text-primary-600" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900">{pregSteps[step].title}</h2>
              <p className="text-sm text-gray-500">{pregSteps[step].subtitle}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }} className="space-y-5">

              {step === 0 && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">{t('onboarding.yourName', { defaultValue: 'Your Name' })}</label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya Sharma" className="h-12 rounded-xl text-base" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">{t('onboarding.yourAge', { defaultValue: 'Your Age' })}</label>
                    <Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 28" min={15} max={55} className="h-12 rounded-xl text-base" />
                  </div>
                </>
              )}

              {step === 1 && (
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">{t('onboarding.pregnancyMonth', { defaultValue: 'Which month of pregnancy?' })}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {MONTHS.map(m => (
                      <button key={m} type="button" onClick={() => setGestationalMonth(String(m))}
                        className={`flex flex-col items-center rounded-2xl border-2 p-4 transition-all ${
                          gestationalMonth === String(m)
                            ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-100 bg-white hover:border-primary-200'
                        }`}>
                        <Calendar className={`mb-1 h-5 w-5 ${gestationalMonth === String(m) ? 'text-primary-600' : 'text-gray-400'}`} />
                        <span className="text-lg font-bold">{m}</span>
                        <span className="text-xs text-gray-500">{t('onboarding.month', { defaultValue: 'month' })}</span>
                      </button>
                    ))}
                  </div>
                  {gestationalMonth && <p className="mt-4 text-center text-sm text-gray-500">≈ Week {Number(gestationalMonth) * 4} of pregnancy</p>}
                </div>
              )}

              {step === 2 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">{t('onboarding.yourWeight', { defaultValue: 'Your current weight' })}</label>
                  <div className="relative">
                    <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 62" min={30} max={200} className="h-12 rounded-xl pr-16 text-base" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">kg</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">{t('onboarding.weightHint', { defaultValue: 'Used to personalise your nutrition plan' })}</p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Select any pre-existing conditions:</label>
                    <div className="flex flex-wrap gap-2">
                      {['High Blood Pressure','Diabetes','Thyroid','Asthma','Anemia','Heart Disease','Kidney Disease','PCOS','Previous Complications','None'].map(sym => (
                        <button key={sym} type="button"
                          onClick={() => {
                            if (sym === 'None') { setSymptoms(['None']); return; }
                            const ns = symptoms.filter(s => s !== 'None');
                            setSymptoms(ns.includes(sym) ? ns.filter(s => s !== sym) : [...ns, sym]);
                          }}
                          className={`rounded-full px-4 py-2 text-sm transition-all ${
                            symptoms.includes(sym)
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'border border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                          }`}>
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Additional Information</label>
                    <textarea value={additionalInfo} onChange={e => setAdditionalInfo(e.target.value)}
                      placeholder="Any other notes..." rows={3}
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Upload Previous Reports (Optional)</label>
                    <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg"
                      onChange={e => {
                        if (e.target.files?.length) {
                          setPreviousReports(Array.from(e.target.files).map(f => f.name).join(', '));
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700" />
                    {previousReports && <p className="mt-2 text-xs text-gray-500">Selected: {previousReports}</p>}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button variant="outline" className="flex-1 rounded-2xl" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button className="flex-1 rounded-2xl" size="lg"
              disabled={!pregCanProceed()}
              onClick={() => step < 3 ? setStep(step + 1) : handleFinish()}>
              {step < 3
                ? <>{t('common.getStarted', { defaultValue: 'Continue' })} <ArrowRight className="h-5 w-5" /></>
                : <>{t('onboarding.startJourney', { defaultValue: 'Start Journey' })} <Sparkles className="h-5 w-5" /></>}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
