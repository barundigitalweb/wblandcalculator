import React, { useState } from 'react';
import { getFractionalBreakdown } from '../lib/land-math';
import { Layers, ArrowRight, Check, Copy } from 'lucide-react';

export default function FractionalBreakdown() {
  const [sqftInput, setSqftInput] = useState<string>('3850');
  const [copied, setCopied] = useState<boolean>(false);

  const numVal = parseFloat(sqftInput) || 0;
  const breakdown = getFractionalBreakdown(numVal);

  const handleCopy = () => {
    navigator.clipboard.writeText(breakdown.formattedBengali);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800">
            জমির নিখুঁত দলিল ও আমিন ভাঙানি হিসাব (Fractional Breakdown)
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            মোট স্কয়ার ফিট লিখুন — এক নিমিষে বের হবে কত কাঠা, কত ছটাক এবং কত স্কয়ার ফিট জমি অবশিষ্ট রইল
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Input */}
        <div className="md:col-span-5">
          <label htmlFor="fractional-sqft-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            মোট স্কয়ার ফিট (Total Sq Ft) লিখুন:
          </label>
          <div className="relative">
            <input
              id="fractional-sqft-input"
              aria-label="মোট স্কয়ার ফিট লিখুন"
              type="number"
              min="0"
              step="any"
              value={sqftInput}
              onChange={(e) => setSqftInput(e.target.value)}
              placeholder="যেমন: 3850"
              className="w-full text-2xl font-extrabold text-slate-800 bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 focus:border-emerald-600 focus:bg-white outline-none transition"
            />
            <span className="absolute right-4 top-4 text-xs font-bold text-slate-600">
              Sq Ft
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[720, 1440, 2160, 3850, 7200].map((preset) => (
              <button
                key={preset}
                aria-label={`${preset} স্কয়ার ফিট সেট করুন`}
                onClick={() => setSqftInput(String(preset))}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-md transition font-semibold"
              >
                {preset} ft
              </button>
            ))}
          </div>
        </div>

        {/* Divider arrow */}
        <div className="md:col-span-1 flex justify-center text-slate-400">
          <ArrowRight className="w-6 h-6 hidden md:block" />
        </div>

        {/* Output card */}
        <div className="md:col-span-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-300/80 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
            <span>ভাঙানি ফলাফল (Deed Record Format):</span>
            <button
              onClick={handleCopy}
              aria-label="ভাঙানি ফলাফল কপি করুন"
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
            </button>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
            {breakdown.formattedBengali}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-emerald-200 text-center">
            <div className="bg-white p-2 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-slate-500 block">বিঘা (Bigha)</span>
              <span className="text-lg font-black text-slate-800">{breakdown.bigha}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-slate-500 block">কাঠা (Katha)</span>
              <span className="text-lg font-black text-slate-800">{breakdown.katha}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-slate-500 block">ছটাক (Chatak)</span>
              <span className="text-lg font-black text-slate-800">{breakdown.chatak}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-slate-500 block">অবশিষ্ট Sq Ft</span>
              <span className="text-lg font-black text-slate-800">{breakdown.remainingSqFt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
