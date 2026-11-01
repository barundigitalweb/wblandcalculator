import React, { useState } from 'react';
import { calculateWBStampDuty, type DeedType } from '../lib/land-math';
import { Building2 } from 'lucide-react';

export default function StampDutyCalculator() {
  const [marketValue, setMarketValue] = useState<string>('2500000');
  const [areaType, setAreaType] = useState<'panchayat' | 'municipality'>('municipality');
  const [deedType, setDeedType] = useState<DeedType>('sale');

  const numVal = parseFloat(marketValue) || 0;
  const result = calculateWBStampDuty(numVal, areaType, deedType);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur">
            <Building2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              পশ্চিমবঙ্গ ফ্ল্যাট ও জমি রেজিস্ট্রি খরচ ক্যালকুলেটর
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              West Bengal Property Stamp Duty & Registration Fees Estimator (IGR Guidelines)
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Market Value Input */}
          <div className="md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              সম্পত্তি / জমির বাজারমূল্য (Market Value)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                step="10000"
                value={marketValue}
                onChange={(e) => setMarketValue(e.target.value)}
                placeholder="2500000"
                className="w-full text-xl font-bold bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-2.5 focus:border-emerald-600 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[1000000, 2500000, 5000000, 10000000].map((v) => (
                <button
                  key={v}
                  onClick={() => setMarketValue(String(v))}
                  className="text-[11px] bg-white border border-slate-200 hover:border-emerald-400 px-2 py-0.5 rounded transition text-slate-600"
                >
                  ₹{v / 100000}L
                </button>
              ))}
            </div>
          </div>

          {/* Location Type */}
          <div className="md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              এলাকার ধরন (Property Location)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-emerald-300 transition">
                <input
                  type="radio"
                  name="areaType"
                  value="municipality"
                  checked={areaType === 'municipality'}
                  onChange={() => setAreaType('municipality')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold text-slate-700">
                  পৌরসভা / কর্পোরেশন (Urban)
                </span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-emerald-300 transition">
                <input
                  type="radio"
                  name="areaType"
                  value="panchayat"
                  checked={areaType === 'panchayat'}
                  onChange={() => setAreaType('panchayat')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold text-slate-700">
                  গ্রাম পঞ্চায়েত এলাকা (Rural)
                </span>
              </label>
            </div>
          </div>

          {/* Deed Type */}
          <div className="md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              দলিলের ধরন (Deed Type)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-emerald-300 transition">
                <input
                  type="radio"
                  name="deedType"
                  value="sale"
                  checked={deedType === 'sale'}
                  onChange={() => setDeedType('sale')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold text-slate-700">
                  বিক্রয় দলিল / সাফ-কবলা (Sale Deed)
                </span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-emerald-300 transition">
                <input
                  type="radio"
                  name="deedType"
                  value="gift_family"
                  checked={deedType === 'gift_family'}
                  onChange={() => setDeedType('gift_family')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-700 block">
                    রক্তের সম্পর্কে দানপত্র (Family Gift Deed)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    ০.৫% কনসেশনাল স্ট্যাম্প ডিউটি
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Official Statutory Clarification Note */}
        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl text-xs text-slate-700 space-y-1">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <span>⚖️ পশ্চিমবঙ্গ সরকারের প্রামাণ্য নিয়মাবলী (IGR West Bengal):</span>
          </div>
          <p>
            • <strong>মহিলা ক্রেতা সংক্রান্ত তথ্য:</strong> পশ্চিমবঙ্গে সাধারণ বিক্রয় দলিলের (Sale Deed) ক্ষেত্রে পুরুষ ও মহিলা ক্রেতাদের জন্য স্ট্যাম্প ডিউটি সমান (আলাদা কোনো ছাড় নেই)।
          </p>
          <p>
            • <strong>পারিবারিক দানপত্র ছাড়:</strong> নিকট রক্তের সম্পর্কের আত্মীয়দের (বাবা-মা, সন্তান, স্বামী-স্ত্রী, ভাই-বোন) মধ্যে দানপত্রে রাজ্য সরকার <strong>০.৫%</strong> বিশেষ কনসেশনাল স্ট্যাম্প ডিউটি প্রদান করে।
          </p>
          <p>
            • <strong>হাই-ভ্যালু সারচার্জ:</strong> বাজারমূল্য ১ কোটি টাকার অধিক হলে মূল হারের ওপর অতিরিক্ত ১% স্ট্যাম্প ডিউটি প্রযোজ্য হয়।
          </p>
        </div>

        {/* Results Overview */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {/* Stamp Duty */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block">
                স্ট্যাম্প ডিউটি ({result.stampDutyRate}%)
              </span>
              <span className="text-2xl font-black text-slate-800">
                ₹{result.stampDutyAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Registration Fee */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block">
                রেজিস্ট্রেশন ফি ({result.registrationFeeRate}%)
              </span>
              <span className="text-2xl font-black text-slate-800">
                ₹{result.registrationFeeAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Mutation Fee Estimate */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block">
                আনুমানিক প্রসেসিং/মিউটেশন
              </span>
              <span className="text-2xl font-black text-slate-800">
                ₹{result.mutationFeeEstimate.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Total Government Charges */}
            <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md">
              <span className="text-xs font-semibold text-emerald-100 block">
                মোট আনুমানিক সরকারি খরচ
              </span>
              <span className="text-2xl sm:text-3xl font-black">
                ₹{result.totalGovernmentCharges.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center mt-4">
            * এটি পশ্চিমবঙ্গ সরকারের অফিশিয়াল IGR সার্কুলার অনুযায়ী একটি আনুমানিক খরচ হিসাব। চূড়ান্ত ভ্যালুয়েশন Banglarbhumi ও রেজিস্ট্রি অফিসের সার্কেল রেট (Circle Rate) দ্বারা নির্ধারিত হয়।
          </p>
        </div>
      </div>
    </div>
  );
}
