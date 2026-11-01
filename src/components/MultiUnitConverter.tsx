import React, { useState } from 'react';
import { WB_LAND_UNITS, convertLandUnit, getFractionalBreakdown } from '../lib/land-math';
import { Calculator, Copy, Check, Sparkles } from 'lucide-react';

interface Props {
  initialUnit?: string;
  initialValue?: number;
  featuredTitle?: string;
}

export default function MultiUnitConverter({
  initialUnit = 'katha',
  initialValue = 1,
  featuredTitle
}: Props) {
  const [activeUnit, setActiveUnit] = useState<string>(initialUnit);
  const [inputValue, setInputValue] = useState<string>(String(initialValue));
  const [copiedUnit, setCopiedUnit] = useState<string | null>(null);

  const numVal = parseFloat(inputValue) || 0;
  const conversions = convertLandUnit(numVal, activeUnit);
  const breakdown = getFractionalBreakdown(conversions.sqft);

  const handleCopy = (unitId: string, val: number) => {
    const rounded = Math.round(val * 10000) / 10000;
    navigator.clipboard.writeText(`${rounded}`);
    setCopiedUnit(unitId);
    setTimeout(() => setCopiedUnit(null), 2000);
  };

  const handleQuickPreset = (unit: string, val: number) => {
    setActiveUnit(unit);
    setInputValue(String(val));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              ১০০% সঠিক পশ্চিমবঙ্গ ভূমি পরিমাপ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {featuredTitle || 'পশ্চিমবঙ্গ জমি পরিমাপ কনভার্টার (All Units)'}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base mt-1">
              ১ কাঠা = ৭২০ বর্গফুট | ১ শতক = ৪৩৫.৬ বর্গফুট | ১ বিঘা = ২০ কাঠা
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/40 backdrop-blur px-4 py-2 rounded-xl border border-emerald-400/20 text-xs sm:text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>WB Land Reforms Act Verified</span>
          </div>
        </div>

        {/* Quick Click Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-emerald-600/40 text-xs">
          <span className="text-emerald-200 font-medium">জনপ্রিয় পরিমাপ:</span>
          <button
            onClick={() => handleQuickPreset('katha', 1)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium"
          >
            ১ কাঠা
          </button>
          <button
            onClick={() => handleQuickPreset('satak', 1)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium"
          >
            ১ শতক (Decimal)
          </button>
          <button
            onClick={() => handleQuickPreset('sqft', 1000)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium"
          >
            ১,০০০ বর্গফুট
          </button>
          <button
            onClick={() => handleQuickPreset('bigha', 1)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium"
          >
            ১ বিঘা
          </button>
          <button
            onClick={() => handleQuickPreset('chatak', 1)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium"
          >
            ১ ছটাক
          </button>
        </div>
      </div>

      {/* Main Interactive Controls */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Input Box Row */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            পরিমাপের মান ও একক নির্বাচন করুন (Enter Value & Select Unit)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7 relative">
              <input
                type="number"
                min="0"
                step="any"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="সংখ্যা লিখুন (যেমন: 1, 5, 2.5)..."
                className="w-full text-2xl sm:text-3xl font-black text-slate-800 bg-white border-2 border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 rounded-xl px-4 py-3 outline-none transition"
              />
            </div>
            <div className="sm:col-span-5">
              <select
                value={activeUnit}
                onChange={(e) => setActiveUnit(e.target.value)}
                aria-label="একক নির্বাচন করুন"
                className="w-full h-full text-base sm:text-lg font-bold text-slate-700 bg-white border-2 border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 rounded-xl px-4 py-3 outline-none cursor-pointer transition"
              >
                {WB_LAND_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.bengaliName} ({u.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Instant Fractional Breakdown Highlight */}
        {numVal > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base">
                <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                  <Calculator className="w-4 h-4" />
                </span>
                <span>দলিল ও আমিনের নিখুঁত ভাঙানি (Deed & Amin Fractional Breakdown):</span>
              </div>
              <span className="text-xs bg-emerald-200/80 text-emerald-900 font-semibold px-2.5 py-0.5 rounded-full">
                {conversions.sqft.toLocaleString('en-IN')} Sq Ft
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
              👉 {breakdown.formattedBengali}
            </div>
            <div className="text-xs sm:text-sm text-emerald-800 mt-1 font-medium">
              English: <span className="font-semibold">{breakdown.formattedEnglish}</span> (শতক হিসেবে: {breakdown.satakDecimal} শতক)
            </div>
          </div>
        )}

        {/* All Converted Units Grid */}
        <div>
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">
            সব এককে সমপরিমাণ মান (Equivalent Values in All Units):
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {WB_LAND_UNITS.map((unit) => {
              const val = conversions[unit.id] ?? 0;
              const formattedVal = val >= 1000 ? val.toLocaleString('en-IN', { maximumFractionDigits: 4 }) : (Math.round(val * 10000) / 10000).toString();
              const isSelected = unit.id === activeUnit;

              return (
                <div
                  key={unit.id}
                  onClick={() => {
                    setActiveUnit(unit.id);
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer relative group ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/30'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium mb-1">
                    <span className={isSelected ? 'text-emerald-100 font-bold' : 'text-slate-500'}>
                      {unit.bengaliName}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(unit.id, val);
                      }}
                      title="মান কপি করুন"
                      className={`p-1 rounded-md transition ${
                        isSelected
                          ? 'hover:bg-emerald-700 text-white'
                          : 'hover:bg-slate-200 text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      {copiedUnit === unit.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-xl font-extrabold truncate tracking-tight">
                    {formattedVal}
                  </div>
                  <div
                    className={`text-[11px] mt-1 truncate ${
                      isSelected ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {unit.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
