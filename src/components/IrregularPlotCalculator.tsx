import React, { useState, useEffect, useRef } from 'react';
import { calculateHeronPlot } from '../lib/land-math';
import { Compass, AlertCircle, CheckCircle2, Ruler, HelpCircle } from 'lucide-react';

export default function IrregularPlotCalculator() {
  const [sideA, setSideA] = useState<string>('50'); // North
  const [sideB, setSideB] = useState<string>('40'); // East
  const [sideC, setSideC] = useState<string>('55'); // South
  const [sideD, setSideD] = useState<string>('42'); // West
  const [diagonal, setDiagonal] = useState<string>('65'); // Diagonal

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const valA = parseFloat(sideA) || 0;
  const valB = parseFloat(sideB) || 0;
  const valC = parseFloat(sideC) || 0;
  const valD = parseFloat(sideD) || 0;
  const valDiag = parseFloat(diagonal) || 0;

  const result = calculateHeronPlot(valA, valB, valC, valD, valDiag);

  // Draw plot on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (!result.isValid || valA <= 0 || valB <= 0 || valC <= 0 || valD <= 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('সঠিক পরিমাপ দিলে এখানে জমির ভিজ্যুয়াল নকশা দেখা যাবে', width / 2, height / 2);
      return;
    }

    // Normalized coordinates for drawing a representative quadrilateral
    const padding = 50;
    const p1 = { x: padding + 30, y: padding }; // Top Left (North-West)
    const p2 = { x: width - padding - 20, y: padding + 20 }; // Top Right (North-East)
    const p3 = { x: width - padding - 40, y: height - padding }; // Bottom Right (South-East)
    const p4 = { x: padding, y: height - padding - 20 }; // Bottom Left (South-West)

    // Fill Triangle 1 (p1, p2, p3) - North, East & Diagonal
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'; // Emerald 500 light
    ctx.fill();

    // Fill Triangle 2 (p3, p4, p1) - South, West & Diagonal
    ctx.beginPath();
    ctx.moveTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(13, 148, 136, 0.15)'; // Teal 600 light
    ctx.fill();

    // Draw Outer Boundary
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.strokeStyle = '#047857'; // Emerald 700
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Diagonal (p1 to p3: NW to SE)
    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.strokeStyle = '#d97706'; // Amber 600
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Labels & Corners
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = '#0f172a';

    // Corner dots
    const corners = [p1, p2, p3, p4];
    corners.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#047857';
      ctx.fill();
    });

    // Side labels
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    // North (p1 to p2)
    ctx.fillText(`উত্তর: ${valA} ft`, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2 - 12);
    // East (p2 to p3)
    ctx.fillText(`পূর্ব: ${valB} ft`, (p2.x + p3.x) / 2 + 35, (p2.y + p3.y) / 2);
    // South (p3 to p4)
    ctx.fillText(`দক্ষিণ: ${valC} ft`, (p3.x + p4.x) / 2, (p3.y + p4.y) / 2 + 20);
    // West (p4 to p1)
    ctx.fillText(`পশ্চিম: ${valD} ft`, (p4.x + p1.x) / 2 - 35, (p4.y + p1.y) / 2);

    // Diagonal Label
    ctx.fillStyle = '#b45309';
    ctx.fillText(`কর্ণ: ${valDiag} ft`, (p1.x + p3.x) / 2 + 20, (p1.y + p3.y) / 2 - 10);
  }, [valA, valB, valC, valD, valDiag, result.isValid]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-emerald-900 text-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur">
            <Compass className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              আঁকাবাঁকা ও বিষমবাহু জমির পরিমাপক (Heron's Formula)
            </h2>
            <p className="text-emerald-100 text-sm mt-1">
              আমিন ও সার্ভেয়ারদের বৈজ্ঞানিক ২-ত্রিভুজ পদ্ধতি (১০০% নির্ভুল ক্ষেত্রফল)
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Input Matrix */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-emerald-600" />
              ৪টি সীমানা ও কোনাকুনি কর্ণের মাপ লিখুন (ফুটে / Feet):
            </label>
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
              সব মাপ ফুটে (Feet) দিন
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Side A */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label htmlFor="irregular-side-a" className="block text-xs font-bold text-slate-700 mb-1">
                বাহু ১ / উত্তর (North Side)
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="irregular-side-a"
                  aria-label="বাহু ১ উত্তর পরিমাপ"
                  type="number"
                  min="0"
                  step="any"
                  value={sideA}
                  onChange={(e) => setSideA(e.target.value)}
                  className="w-full text-xl font-bold bg-white border border-slate-300 rounded-lg p-2.5 focus:border-emerald-600 outline-none"
                  placeholder="যেমন: 50"
                />
                <span className="text-xs font-semibold text-slate-600">ft</span>
              </div>
            </div>

            {/* Side B */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label htmlFor="irregular-side-b" className="block text-xs font-bold text-slate-700 mb-1">
                বাহু ২ / পূর্ব (East Side)
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="irregular-side-b"
                  aria-label="বাহু ২ পূর্ব পরিমাপ"
                  type="number"
                  min="0"
                  step="any"
                  value={sideB}
                  onChange={(e) => setSideB(e.target.value)}
                  className="w-full text-xl font-bold bg-white border border-slate-300 rounded-lg p-2.5 focus:border-emerald-600 outline-none"
                  placeholder="যেমন: 40"
                />
                <span className="text-xs font-semibold text-slate-600">ft</span>
              </div>
            </div>

            {/* Side C */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label htmlFor="irregular-side-c" className="block text-xs font-bold text-slate-700 mb-1">
                বাহু ৩ / দক্ষিণ (South Side)
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="irregular-side-c"
                  aria-label="বাহু ৩ দক্ষিণ পরিমাপ"
                  type="number"
                  min="0"
                  step="any"
                  value={sideC}
                  onChange={(e) => setSideC(e.target.value)}
                  className="w-full text-xl font-bold bg-white border border-slate-300 rounded-lg p-2.5 focus:border-emerald-600 outline-none"
                  placeholder="যেমন: 55"
                />
                <span className="text-xs font-semibold text-slate-600">ft</span>
              </div>
            </div>

            {/* Side D */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label htmlFor="irregular-side-d" className="block text-xs font-bold text-slate-700 mb-1">
                বাহু ৪ / পশ্চিম (West Side)
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="irregular-side-d"
                  aria-label="বাহু ৪ পশ্চিম পরিমাপ"
                  type="number"
                  min="0"
                  step="any"
                  value={sideD}
                  onChange={(e) => setSideD(e.target.value)}
                  className="w-full text-xl font-bold bg-white border border-slate-300 rounded-lg p-2.5 focus:border-emerald-600 outline-none"
                  placeholder="যেমন: 42"
                />
                <span className="text-xs font-semibold text-slate-600">ft</span>
              </div>
            </div>

            {/* Diagonal E */}
            <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-300">
              <label htmlFor="irregular-diagonal" className="block text-xs font-bold text-amber-900 mb-1">
                কোনাকুনি কর্ণ (NW ↔ SE Diagonal)
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="irregular-diagonal"
                  aria-label="কোনাকুনি কর্ণ পরিমাপ"
                  type="number"
                  min="0"
                  step="any"
                  value={diagonal}
                  onChange={(e) => setDiagonal(e.target.value)}
                  className="w-full text-xl font-black bg-white border border-amber-400 rounded-lg p-2.5 focus:border-amber-600 outline-none text-amber-950"
                  placeholder="যেমন: 65"
                />
                <span className="text-xs font-bold text-amber-800">ft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Map Canvas & Result Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Canvas Box */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-slate-700 uppercase">
                জমির ভিজ্যুয়াল নকশা (Visual Plot Map)
              </span>
              <span className="text-[11px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
                ২টি ত্রিভুজ পদ্ধতি
              </span>
            </div>
            <canvas
              ref={canvasRef}
              width={380}
              height={260}
              role="img"
              aria-label="আমিন বিষমবাহু জমির নকশা চিত্র"
              className="w-full max-w-[380px] bg-white rounded-xl shadow-inner border border-slate-200"
            >
              <p>আমিন বিষমবাহু জমির ভিজ্যুয়াল নকশা</p>
            </canvas>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              * হলুদ ড্যাশ লাইনটি হলো কোনাকুনি কর্ণ (উত্তর-পশ্চিম থেকে দক্ষিণ-পূর্ব কোণ), যা জমিকে ২টি ত্রিভুজে বিভক্ত করেছে।
            </p>
          </div>

          {/* Result Cards */}
          <div className="lg:col-span-7 space-y-4">
            {!result.isValid ? (
              <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base">পরিমাপ ত্রুটি!</h4>
                  <p className="text-sm mt-1">{result.errorMessage}</p>
                  <p className="text-xs mt-2 text-rose-700">
                    পরামর্শ: কোনাকুনি কর্ণের মাপটি একটু বড় বা উভয় পাশের বাহুদ্বয়ের যোগফলের চেয়ে ছোট হতে হবে (ত্রিভুজ শর্ত)।
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Heron's True Area */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-100 mb-1">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      হিরন ফর্মুলায় ১০০% সঠিক মোট ক্ষেত্রফল:
                    </span>
                    <span className="bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                      Heron's Formula
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">
                    {result.totalAreaSqFt.toLocaleString('en-IN')} <span className="text-xl font-normal text-emerald-200">Sq Ft (বর্গফুট)</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-emerald-500/40 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur">
                      <div className="text-xs text-emerald-100 font-medium">শতক / ডেসিমেল</div>
                      <div className="text-lg font-black">{result.breakdown.satakDecimal} শতক</div>
                    </div>
                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur">
                      <div className="text-xs text-emerald-100 font-medium">কাঠা হিসেবে</div>
                      <div className="text-lg font-black">
                        {(Math.round((result.totalAreaSqFt / 720) * 1000) / 1000)} কাঠা
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 bg-white/10 p-2.5 rounded-xl backdrop-blur">
                      <div className="text-xs text-emerald-100 font-medium">দলিল ভাঙানি</div>
                      <div className="text-sm font-bold truncate">
                        {result.breakdown.formattedBengali}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accuracy Comparison vs Average Method */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>কেন সাধারণ গড় পদ্ধতিতে জমি মাপলে আপনি ঠকবেন?</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">সাধারণ গড় পদ্ধতি (Average Method):</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {result.averageMethodAreaSqFt.toLocaleString('en-IN')} Sq Ft
                      </span>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
                      <span className="block text-amber-700">পার্থক্য / ভুলের পরিমাণ (Difference):</span>
                      <span className="font-extrabold text-sm">
                        {result.differenceSqFt} Sq Ft ({result.errorPercentage}% ভুল)
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    * সাধারণ গড় পদ্ধতি বিষমবাহু জমিতে সবসময় বেশি বা ভুল ক্ষেত্রফল দেয়। আমিনরা সবসময় কোনাকুনি কর্ণ মেপে হিরন ফর্মুলা ব্যবহার করেন।
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
