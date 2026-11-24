import React, { useState } from 'react';

type BiViewMode = 'aging' | 'turnover' | 'leadtime';

interface BiDashboardPreviewProps {
  compact?: boolean;
}

const BI_VIEWS: Record<
  BiViewMode,
  {
    title: string;
    subtitle: string;
    rows: { label: string; value: number; unit: string; note: string }[];
  }
> = {
  aging: {
    title: 'Batch Expiry & Shelf-Life Aging Template',
    subtitle: 'Illustrative Power BI / SQL aging bucket structure for perishable SKUs',
    rows: [
      { label: '0–15 Days to Expiry (Priority FEFO)', value: 18, unit: '%', note: 'Immediate dispatch window' },
      { label: '16–45 Days to Expiry', value: 34, unit: '%', note: 'Standard retail allocation' },
      { label: '46–90 Days to Expiry', value: 31, unit: '%', note: 'Healthy buffer stock' },
      { label: '90+ Days Shelf Life', value: 17, unit: '%', note: 'Long-cycle storage' },
    ],
  },
  turnover: {
    title: 'Category Velocity & Stock Classification Template',
    subtitle: 'ABC / velocity segmentation layout built with Power Query measures',
    rows: [
      { label: 'Fast-Moving Staples (Class A)', value: 78, unit: 'idx', note: 'High replenishment cadence' },
      { label: 'Seasonal Beverages (Class B)', value: 52, unit: 'idx', note: 'Variable monthly demand' },
      { label: 'Personal Care Lines (Class B)', value: 44, unit: 'idx', note: 'Steady reorder intervals' },
      { label: 'Slow-Moving SKUs (Class C)', value: 16, unit: 'idx', note: 'Candidate for order reduction' },
    ],
  },
  leadtime: {
    title: 'Supplier Lead-Time Consistency Template',
    subtitle: 'Structured procurement monitoring model comparing expected vs. actual delivery days',
    rows: [
      { label: 'Regional Dairy & Cold Chain', value: 2.4, unit: 'days', note: 'Tight variance window' },
      { label: 'Packaged Dry Goods Hub', value: 4.8, unit: 'days', note: 'Standard warehouse cycle' },
      { label: 'Imported Specialty Lines', value: 11.2, unit: 'days', note: 'Requires safety buffer' },
      { label: 'Packaging & Bulk Supplies', value: 6.1, unit: 'days', note: 'Scheduled weekly batch' },
    ],
  },
};

export const BiDashboardPreview: React.FC<BiDashboardPreviewProps> = ({ compact = false }) => {
  const [mode, setMode] = useState<BiViewMode>('aging');
  const active = BI_VIEWS[mode];
  const maxVal = Math.max(...active.rows.map((r) => r.value));

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            BI Report Structure Prototype (Sample Template Values)
          </p>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5">
            {active.title}
          </h4>
        </div>

        {!compact && (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#070D19] border border-slate-200 dark:border-[#1E2D4A]">
            {(
              [
                { id: 'aging', label: 'Expiry Aging' },
                { id: 'turnover', label: 'Velocity' },
                { id: 'leadtime', label: 'Lead Time' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{active.subtitle}</p>

      <div className="space-y-3.5">
        {active.rows.map((row) => {
          const pct = Math.round((row.value / maxVal) * 100);
          return (
            <div
              key={row.label}
              className="p-3 rounded-lg bg-slate-50 dark:bg-[#070D19] border border-slate-200 dark:border-[#1E2D4A]"
            >
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium text-slate-800 dark:text-slate-200">{row.label}</span>
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums shrink-0">
                  {row.value} {row.unit}
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {!compact && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{row.note}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
