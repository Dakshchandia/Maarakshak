import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Utensils } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import KnowledgeHubPage from './KnowledgeHubPage';
import NutritionPlannerPage from './NutritionPlannerPage';

interface Props { defaultTab?: string; }

export default function PregnancyHubPage({ defaultTab }: Props) {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const initial = defaultTab === 'journey' ? 'knowledge' : (defaultTab || params.get('tab') || 'knowledge');
  const [tab, setTab] = useState(initial);

  const TABS = [
    { id: 'knowledge', label: t('nav.knowledgeHub'),     icon: BookOpen },
    { id: 'nutrition', label: t('nav.nutritionPlanner'), icon: Utensils },
  ];

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="glass-card rounded-2xl p-1.5 flex gap-1">
        {TABS.map(tabItem => {
          const active = tab === tabItem.id;
          return (
            <button key={tabItem.id} onClick={() => setTab(tabItem.id)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all',
                active
                  ? 'bg-gradient-to-r from-primary-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}>
              <tabItem.icon className="h-4 w-4" />
              <span>{tabItem.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
          {tab === 'knowledge' && <KnowledgeHubPage />}
          {tab === 'nutrition' && <NutritionPlannerPage />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
