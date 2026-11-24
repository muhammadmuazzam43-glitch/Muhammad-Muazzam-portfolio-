import React, { useMemo, useState } from 'react';

interface EoqModelExplorerProps {
  compact?: boolean;
}

export const EoqModelExplorer: React.FC<EoqModelExplorerProps> = ({ compact = false }) => {
  const [demand, setDemand] = useState(12000);
  const [orderCost, setOrderCost] = useState(180);
  const [holdingCost, setHoldingCost] = useState(12);

  const metrics = useMemo(() => {
    const qStar = Math.sqrt((2 * demand * orderCost) / holdingCost);
    const minTotalCost = (demand / qStar) * orderCost + (qStar / 2) * holdingCost;
    const ordersPerYear = demand / qStar;
    return { qStar, minTotalCost, ordersPerYear };
  }, [demand, orderCost, holdingCost]);

  const width = 560;
  const height = 240;
  const padL = 52;
  const padR = 20;
  const padT = 20;
  const padB = 34;

  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const qMin = Math.max(80, metrics.qStar * 0.25);
  const qMax = metrics.qStar * 2.3;

  const points = useMemo(() => {
    const steps = 48;
    const totalPts: { q: number; tc: number; oc: number; hc: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const q = qMin + ((qMax - qMin) * i) / steps;
      const oc = (demand / q) * orderCost;
      const hc = (q / 2) * holdingCost;
      totalPts.push({ q, tc: oc + hc, oc, hc });
    }
    return totalPts;
  }, [demand, orderCost, holdingCost, qMin, qMax]);

  const maxCost = Math.max(...points.map((p) => p.tc)) * 1.05;

  const toX = (q: number) => padL + ((q - qMin) / (qMax - qMin)) * plotW;
  const toY = (c: number) => padT + plotH - (c / maxCost) * plotH;

  const totalPath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(p.q).toFixed(1)} ${toY(p.tc).toFixed(1)}`)
    .join(' ');
  const orderPath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(p.q).toFixed(1)} ${toY(p.oc).toFixed(1)}`)
    .join(' ');
  const holdingPath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(p.q).toFixed(1)} ${toY(p.hc).toFixed(1)}`)
    .join(' ');

  const optX = toX(metrics.qStar);
  const optY = toY(metrics.minTotalCost);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Interactive Mathematical Model
          </p>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5">
            Economic Order Quantity (EOQ) Cost Minimization
          </h4>
        </div>
        <span className="font-mono text-xs text-slate-600 dark:text-slate-300 tabular-nums">
          Q* = √(2DS / H) = {Math.round(metrics.qStar).toLocaleString()} units
        </span>
      </div>

      <div className="w-full overflow-hidden rounded-lg bg-slate-50 dark:bg-[#070D19] border border-slate-200 dark:border-[#1E2D4A] p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block"
          role="img"
          aria-label="EOQ Total Cost, Ordering Cost, and Holding Cost curves"
        >
          {[0.25, 0.5, 0.75, 1].map((t) => {
            const y = padT + plotH * (1 - t);
            return (
              <line
                key={t}
                x1={padL}
                y1={y}
                x2={width - padR}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeDasharray="3 4"
              />
            );
          })}

          <line
            x1={padL}
            y1={padT}
            x2={padL}
            y2={padT + plotH}
            className="stroke-slate-400 dark:stroke-slate-600"
            strokeWidth="1.2"
          />
          <line
            x1={padL}
            y1={padT + plotH}
            x2={width - padR}
            y2={padT + plotH}
            className="stroke-slate-400 dark:stroke-slate-600"
            strokeWidth="1.2"
          />

          <path d={orderPath} fill="none" stroke="#64748B" strokeWidth="1.5" strokeDasharray="5 4" />
          <path d={holdingPath} fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d={totalPath} fill="none" stroke="#3B82F6" strokeWidth="2.6" />

          <line
            x1={optX}
            y1={optY}
            x2={optX}
            y2={padT + plotH}
            stroke="#3B82F6"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <circle cx={optX} cy={optY} r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />

          <text
            x={optX + 8}
            y={Math.max(padT + 14, optY - 8)}
            className="fill-slate-900 dark:fill-slate-100 font-mono text-[11px]"
          >
            Min TC ({Math.round(metrics.minTotalCost).toLocaleString()})
          </text>
          <text
            x={optX}
            y={padT + plotH + 16}
            textAnchor="middle"
            className="fill-blue-600 dark:fill-blue-400 font-mono text-[11px] font-semibold"
          >
            Q* = {Math.round(metrics.qStar)}
          </text>
          <text
            x={padL - 8}
            y={padT + 8}
            textAnchor="end"
            className="fill-slate-500 dark:fill-slate-400 font-mono text-[10px]"
          >
            Cost
          </text>
          <text
            x={width - padR}
            y={padT + plotH + 16}
            textAnchor="end"
            className="fill-slate-500 dark:fill-slate-400 font-mono text-[10px]"
          >
            Order Quantity Q
          </text>
        </svg>

        <div className="flex flex-wrap items-center gap-5 mt-2 pt-2 border-t border-slate-200 dark:border-[#1E2D4A] text-xs text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-0.5 bg-blue-500 inline-block" /> Total Cost TC(Q)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-0.5 bg-sky-500 inline-block" /> Holding Cost (Q/2)·H
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-0.5 bg-slate-500 inline-block" /> Ordering Cost (D/Q)·S
          </span>
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <label className="block">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5">
              <span>Annual Demand (D)</span>
              <span className="font-mono tabular-nums">{demand.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={2000}
              max={30000}
              step={500}
              value={demand}
              onChange={(e) => setDemand(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5">
              <span>Ordering Cost (S)</span>
              <span className="font-mono tabular-nums">{orderCost}</span>
            </div>
            <input
              type="range"
              min={50}
              max={500}
              step={10}
              value={orderCost}
              onChange={(e) => setOrderCost(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </label>
          <label className="block">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5">
              <span>Holding Cost / Unit (H)</span>
              <span className="font-mono tabular-nums">{holdingCost}</span>
            </div>
            <input
              type="range"
              min={4}
              max={40}
              step={1}
              value={holdingCost}
              onChange={(e) => setHoldingCost(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </label>
        </div>
      )}

      {!compact && (
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-[#1E2D4A] text-center">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Optimal Order Qty</p>
            <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums mt-0.5">
              {Math.round(metrics.qStar).toLocaleString()} units
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Order Frequency</p>
            <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums mt-0.5">
              {metrics.ordersPerYear.toFixed(1)} / yr
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Minimum Annual Cost</p>
            <p className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 tabular-nums mt-0.5">
              {Math.round(metrics.minTotalCost).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
