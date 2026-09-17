import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, AlertTriangle, CheckCircle, Loader2, RefreshCw, WifiOff } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import hospitalIllustration from '@/assets/illustrations/hospital-finder.svg';

interface Facility {
  id: string;
  name: string;
  type: string;
  address: string;
  distance: string;
  distanceKm: number;
  phone: string;
  lat: number;
  lng: number;
  available24h: boolean;
  services: string[];
}

const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
  PHC:      { color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  CHC:      { color: 'text-blue-700',    bg: 'bg-blue-100',    border: 'border-blue-200' },
  Hospital: { color: 'text-purple-700',  bg: 'bg-purple-100',  border: 'border-purple-200' },
  Clinic:   { color: 'text-amber-700',   bg: 'bg-amber-100',   border: 'border-amber-200' },
};

function FacilityCard({ f, isNearest }: { f: Facility; isNearest: boolean }) {
  const { t } = useTranslation();
  const cfg = typeConfig[f.type] || typeConfig.Clinic;
  const hasPhone = f.phone && f.phone.trim().length > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={cn('overflow-hidden', isNearest ? 'ring-2 ring-primary-400 shadow-lg' : '')}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-800 text-sm">{f.name}</h3>
                {isNearest && <Badge className="bg-primary-500 text-white text-[10px]">{t('hospitals.nearest')}</Badge>}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold', cfg.bg, cfg.color, cfg.border)}>{f.type}</span>
                {f.available24h && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 text-[10px] font-semibold">
                    <CheckCircle className="h-2.5 w-2.5" />{t('hospitals.available24h')}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary-600">{f.distance}</p>
              <p className="text-[10px] text-gray-400">{t('hospitals.fromYou')}</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{f.address}</span>
            </div>
            {hasPhone ? (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <a href={`tel:${f.phone}`} className="text-primary-600 font-medium hover:underline">{f.phone}</a>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-400">
                <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{t('hospitals.phoneNotAvailable')}</span>
              </div>
            )}
            {!f.available24h && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" />{t('hospitals.monToSat')}
              </div>
            )}
          </div>

          {f.services.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {f.services.slice(0, 4).map(s => (
                <span key={s} className="rounded-full bg-gray-100 border border-gray-200 px-2 py-0.5 text-[10px] text-gray-600">{s}</span>
              ))}
              {f.services.length > 4 && (
                <span className="rounded-full bg-gray-100 border border-gray-200 px-2 py-0.5 text-[10px] text-gray-400">
                  {t('hospitals.moreServices', { count: f.services.length - 4 })}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button
              size="sm" variant="outline" className="flex-1 text-xs"
              disabled={!hasPhone}
              onClick={() => hasPhone && window.open(`tel:${f.phone}`)}
            >
              <Phone className="h-3.5 w-3.5 mr-1" /> {t('common.call')}
            </Button>
            <Button
              size="sm" className="flex-1 text-xs"
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`, '_blank')}
            >
              <Navigation className="h-3.5 w-3.5 mr-1" /> {t('common.directions')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

type LocationStatus = 'idle' | 'locating' | 'fetching' | 'done' | 'error';

export default function NearbyHospitalsPage() {
  const { t } = useTranslation();
  const { pregnancies } = useData();
  const pregnancy = pregnancies[0];

  const [status, setStatus] = useState<LocationStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [locationLabel, setLocationLabel] = useState('');
  const [filter, setFilter] = useState<string>('All');

  const isHighRisk = pregnancy?.riskLevel === 'RED' || pregnancy?.riskLevel === 'YELLOW';

  const handleLocate = useCallback(async () => {
    setStatus('locating');
    setErrorMsg('');
    setFacilities([]);

    // Step 1: Get browser geolocation
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg(t('hospitals.geoNotSupported'));
      return;
    }

    let coords: GeolocationCoordinates;
    try {
      coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          pos => resolve(pos.coords),
          err => reject(err),
          { timeout: 15000, maximumAge: 60000, enableHighAccuracy: true }
        );
      });
    } catch (err) {
      const geoErr = err as GeolocationPositionError;
      setStatus('error');
      if (geoErr.code === geoErr.PERMISSION_DENIED) {
        setErrorMsg(t('hospitals.permissionDenied'));
      } else if (geoErr.code === geoErr.POSITION_UNAVAILABLE) {
        setErrorMsg(t('hospitals.locationUnavailable'));
      } else if (geoErr.code === geoErr.TIMEOUT) {
        setErrorMsg(t('hospitals.locationTimeout'));
      } else {
        setErrorMsg(t('hospitals.locationFailed'));
      }
      return;
    }

    const { latitude, longitude } = coords;

    // Step 2: Reverse geocode for a human-readable label (OpenStreetMap Nominatim — free)
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json() as { address?: { city?: string; town?: string; village?: string; county?: string; state?: string } };
        const addr = geoData.address || {};
        const place = addr.city || addr.town || addr.village || addr.county || '';
        const state = addr.state || '';
        setLocationLabel([place, state].filter(Boolean).join(', '));
      }
    } catch { /* non-critical — label is optional */ }

    // Step 3: Fetch nearby hospitals from backend
    setStatus('fetching');
    try {
      const result = await api.getNearbyHospitals(latitude, longitude, 10);
      setFacilities(result.facilities);
      setStatus('done');

      if (result.facilities.length === 0) {
        setErrorMsg(t('hospitals.noResults'));
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(t('hospitals.fetchFailed'));
    }
  }, [t]);

  const filtered = filter === 'All'
    ? facilities
    : facilities.filter(f => f.type === filter);

  const nearest = filtered[0];

  const statusLabel = () => {
    if (status === 'locating') return t('hospitals.locating');
    if (status === 'fetching') return t('hospitals.fetching');
    if (status === 'done') return locationLabel ? t('hospitals.showingNear', { location: locationLabel }) : t('hospitals.locationUpdated');
    return t('hospitals.useLocation');
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header banner — exact same as before */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 p-6 text-white">
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
        <img src={hospitalIllustration} alt="" aria-hidden="true"
          className="absolute right-0 bottom-0 h-32 w-auto opacity-25 pointer-events-none select-none" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">{t('hospitals.emergencyCare')}</p>
          <h1 className="text-2xl font-bold">{t('hospitals.title')}</h1>
          <p className="text-white/80 text-sm mt-1">
            {status === 'done' && locationLabel
              ? t('hospitals.showingNear', { location: locationLabel })
              : t('hospitals.subtitle', { village: pregnancy?.villageName || 'your location' })}
          </p>
          <Button
            size="sm" variant="outline"
            onClick={handleLocate}
            disabled={status === 'locating' || status === 'fetching'}
            className="mt-3 border-white/30 text-white bg-transparent hover:bg-white/20"
          >
            {(status === 'locating' || status === 'fetching')
              ? <Loader2 className="h-4 w-4 animate-spin mr-1" />
              : status === 'done'
              ? <RefreshCw className="h-4 w-4 mr-1" />
              : <MapPin className="h-4 w-4 mr-1" />}
            {statusLabel()}
          </Button>
        </div>
      </motion.div>

      {/* High-risk warning */}
      {isHighRisk && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700 text-sm">{t('hospitals.highRiskWarning')}</p>
              <p className="text-xs text-red-600 mt-1">{t('hospitals.highRiskDesc', { level: pregnancy?.riskLevel })}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {(status === 'locating' || status === 'fetching') && (
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-rose-500" />
              </div>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-rose-500" />
            </div>
            <p className="text-gray-600 font-medium">
              {status === 'locating' ? t('hospitals.locating') : t('hospitals.fetching')}
            </p>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              {status === 'locating'
                ? t('hospitals.allowLocation')
                : t('hospitals.searchingWithin')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {status === 'error' && errorMsg && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <WifiOff className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-700 text-sm">{t('hospitals.locationError')}</p>
              <p className="text-xs text-amber-600 mt-1">{errorMsg}</p>
              <Button size="sm" variant="outline" className="mt-2 border-amber-300 text-amber-700" onClick={handleLocate}>
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> {t('hospitals.tryAgain')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No results found */}
      {status === 'done' && facilities.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="py-10 text-center space-y-3">
            <MapPin className="h-10 w-10 mx-auto text-gray-300" />
            <p className="text-gray-500 font-medium">{t('hospitals.noFacilitiesTitle')}</p>
            <p className="text-sm text-gray-400">{t('hospitals.noFacilitiesDesc')}</p>
            <Button size="sm" variant="outline" onClick={handleLocate}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> {t('hospitals.retry')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Idle prompt */}
      {status === 'idle' && (
        <Card className="border-dashed border-2 border-primary-200">
          <CardContent className="py-10 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-primary-50 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-700">{t('hospitals.findNearbyTitle')}</p>
              <p className="text-sm text-gray-400 mt-1">{t('hospitals.findNearbyDesc')}</p>
            </div>
            <Button onClick={handleLocate} className="bg-gradient-to-r from-rose-500 to-pink-500">
              <MapPin className="h-4 w-4 mr-2" /> {t('hospitals.useMyLocation')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters — only show when results available */}
      {status === 'done' && facilities.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'PHC', 'CHC', 'Hospital', 'Clinic'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('shrink-0 rounded-2xl border px-4 py-1.5 text-xs font-semibold transition-all',
                filter === f ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300')}>
              {f === 'All' ? t('hospitals.allFilter') : f}
              {f !== 'All' && (
                <span className="ml-1 text-[10px] opacity-70">
                  ({facilities.filter(x => x.type === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {status === 'done' && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((f, i) => (
            <FacilityCard
              key={f.id}
              f={f}
              isNearest={filter === 'All' ? i === 0 : f.id === nearest?.id}
            />
          ))}
        </div>
      )}

      {/* No results after filter */}
      {status === 'done' && facilities.length > 0 && filtered.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">{t('hospitals.noFilterResults', { type: filter })}</p>
            <button onClick={() => setFilter('All')} className="mt-2 text-sm text-primary-600 underline">{t('hospitals.showAll')}</button>
          </CardContent>
        </Card>
      )}

      {/* Emergency numbers — always visible */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-xs font-bold text-blue-700 mb-2">{t('hospitals.emergencyNumbers')}</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['108', t('hospitals.ambulance')],
              ['1800-180-1104', t('hospitals.nhmHelpline')],
              ['104', t('hospitals.healthHelpline')],
              ['112', t('hospitals.emergencyServices')],
            ].map(([num, label]) => (
              <a key={num} href={`tel:${num}`}
                className="flex items-center gap-2 rounded-xl bg-white border border-blue-100 p-2 hover:bg-blue-50 transition-colors">
                <Phone className="h-3.5 w-3.5 text-blue-500" />
                <div>
                  <p className="text-xs font-bold text-blue-700">{num}</p>
                  <p className="text-[10px] text-gray-500">{label}</p>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
