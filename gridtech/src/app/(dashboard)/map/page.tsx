'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import { programs } from '@/data/programs';
import { formatCurrency, getCategoryLabel, getCategoryColor, getProviderLabel } from '@/lib/utils';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { utilityTerritories, dacAreas } from '@/data/utility-territories';
import Link from 'next/link';

// Dynamically import the map component to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
      <p className="text-gray-400">Loading map...</p>
    </div>
  ),
});

export default function MapPage() {
  const { profile } = useAppStore();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(profile?.utility_provider || null);
  const [showDAC, setShowDAC] = useState(false);

  const regionPrograms = useMemo(() => {
    if (!selectedRegion) return [];
    return programs.filter((p) => {
      const criteria = p.eligibility_criteria;
      if (!criteria.utility_providers) return true;
      return criteria.utility_providers.includes(selectedRegion as any);
    });
  }, [selectedRegion]);

  const selectedInfo = utilityTerritories.find((r) => r.provider === selectedRegion);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">NY Energy Programs Map</h1>
      <p className="text-gray-500 mb-6">Explore programs available by utility territory</p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: '600px' }}>
            <LeafletMap
              territories={utilityTerritories}
              dacAreas={showDAC ? dacAreas : []}
              selectedRegion={selectedRegion}
              userUtility={profile?.utility_provider || null}
              onRegionSelect={setSelectedRegion}
            />
          </div>

          {/* Controls */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowDAC(!showDAC)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                showDAC ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {showDAC ? 'Hide' : 'Show'} Disadvantaged Communities
            </button>
            <div className="flex flex-wrap gap-2">
              {utilityTerritories.map((t) => (
                <button
                  key={t.provider}
                  onClick={() => setSelectedRegion(t.provider)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedRegion === t.provider ? 'bg-white shadow-sm border border-gray-200' : 'hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Region Details Panel */}
        <div>
          {selectedInfo ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedInfo.color }} />
                <h2 className="text-lg font-semibold text-gray-900">{selectedInfo.name}</h2>
              </div>

              {profile?.utility_provider === selectedInfo.provider && (
                <div className="mb-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 font-medium">
                  This is your utility territory
                </div>
              )}

              <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                <div className="text-sm text-emerald-700 font-medium">{regionPrograms.length} programs available</div>
              </div>

              <h3 className="text-sm font-semibold text-gray-700 mb-3">Available Programs</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {regionPrograms.map((p) => (
                  <Link
                    key={p.id}
                    href={`/programs/${p.id}`}
                    className="block p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getCategoryColor(p.category)}`}>
                          {getCategoryLabel(p.category)}
                        </span>
                        <h4 className="text-sm font-medium text-gray-900 mt-1">{p.name}</h4>
                      </div>
                      {p.savings_estimate_annual > 0 && (
                        <span className="text-xs font-bold text-emerald-600">{formatCurrency(p.savings_estimate_annual)}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
              <MapPinIcon className="h-10 w-10 mx-auto mb-3" />
              <p>Click a region on the map to see available programs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
