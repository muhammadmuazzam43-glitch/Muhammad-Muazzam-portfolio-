import React, { useState } from 'react';
import { DatabaseTableSpec } from '../../types/portfolio';
import { Database, KeyRound, Link2, Layers } from 'lucide-react';

interface FmcgSchemaAndPreviewProps {
  tables: DatabaseTableSpec[];
}

export const FmcgSchemaAndPreview: React.FC<FmcgSchemaAndPreviewProps> = ({ tables }) => {
  const [selectedTable, setSelectedTable] = useState<string>(tables[0]?.tableName || 'products');
  const activeTable = tables.find((t) => t.tableName === selectedTable) || tables[0];

  return (
    <div className="space-y-8">
      {/* Interactive PostgreSQL ER Schema Explorer */}
      <div className="rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              PostgreSQL Relational Architecture · ER Schema Explorer
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">
              Core Entity-Relationship Model
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {tables.length} Core Tables · 3NF Normalized
          </span>
        </div>

        {/* Table selector grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
          {tables.map((t) => {
            const isActive = t.tableName === activeTable?.tableName;
            return (
              <button
                key={t.tableName}
                type="button"
                onClick={() => setSelectedTable(t.tableName)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-[#070D19] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1E2D4A] hover:border-blue-500/60'
                }`}
              >
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span className="font-mono text-xs truncate">{t.tableName}</span>
              </button>
            );
          })}
        </div>

        {activeTable && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 rounded-lg border border-slate-200 dark:border-[#1E2D4A] overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 dark:bg-[#070D19] border-b border-slate-200 dark:border-[#1E2D4A] flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                  {activeTable.tableName}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeTable.columns.length} columns
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#1E2D4A] text-slate-500 dark:text-slate-400">
                      <th className="py-2.5 px-4 font-medium">Column</th>
                      <th className="py-2.5 px-4 font-medium">SQL Type</th>
                      <th className="py-2.5 px-4 font-medium">Constraint</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#1E2D4A]">
                    {activeTable.columns.map((col) => (
                      <tr key={col.name} className="text-slate-700 dark:text-slate-300">
                        <td className="py-2.5 px-4 font-mono font-medium flex items-center gap-1.5">
                          {col.constraint?.includes('PK') && (
                            <KeyRound className="w-3 h-3 text-blue-500 shrink-0" />
                          )}
                          {col.constraint?.includes('FK') && (
                            <Link2 className="w-3 h-3 text-sky-500 shrink-0" />
                          )}
                          {col.name}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                          {col.type}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-blue-600 dark:text-blue-400">
                          {col.constraint || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#070D19] border border-slate-200 dark:border-[#1E2D4A]">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Table Responsibility
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {activeTable.purpose}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#070D19] border border-slate-200 dark:border-[#1E2D4A]">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Foreign Key & Cardinality Links
                </p>
                <ul className="space-y-1.5">
                  {activeTable.relationships.map((rel) => (
                    <li
                      key={rel}
                      className="font-mono text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {rel}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Structural Software Dashboard Interface Preview (clearly labeled as UI wireframe/prototype) */}
      <div className="rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
          <div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Software Interface Design Preview · Illustrative Structure
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">
              Operational Control View (Inventory, FEFO Expiry &amp; Replenishment)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Representative UI Layout (Sample Records)
          </span>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Active SKU Catalog', value: 'Schema Ready', sub: 'products table' },
              { label: 'FEFO Expiry Queue', value: 'Windowed SQL', sub: 'product_batches' },
              { label: 'Reorder Thresholds', value: 'Rule Check', sub: 'qty <= reorder_point' },
              { label: 'Audit Ledger', value: 'Append-Only', sub: 'stock_movements' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-lg bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-[#1E2D4A]"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                  {item.value}
                </p>
                <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1E2D4A] text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-4 font-medium">Sample Batch Slot</th>
                  <th className="py-2.5 px-4 font-medium">Category</th>
                  <th className="py-2.5 px-4 font-medium">Warehouse</th>
                  <th className="py-2.5 px-4 font-medium">Dispatch Priority</th>
                  <th className="py-2.5 px-4 font-medium">Replenishment State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1E2D4A] text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 px-4 font-mono">BATCH-DAIRY-01</td>
                  <td className="py-2.5 px-4">Perishable Beverages</td>
                  <td className="py-2.5 px-4">Multan Hub A</td>
                  <td className="py-2.5 px-4 font-medium text-amber-600 dark:text-amber-400">
                    FEFO Priority (Near Window)
                  </td>
                  <td className="py-2.5 px-4">Below Reorder Point</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono">BATCH-GRAIN-04</td>
                  <td className="py-2.5 px-4">Dry Staples</td>
                  <td className="py-2.5 px-4">Multan Hub B</td>
                  <td className="py-2.5 px-4">Standard Queue</td>
                  <td className="py-2.5 px-4 text-blue-600 dark:text-blue-400">Healthy Coverage</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono">BATCH-CARE-09</td>
                  <td className="py-2.5 px-4">Personal Care</td>
                  <td className="py-2.5 px-4">Multan Hub A</td>
                  <td className="py-2.5 px-4">Slow-Moving Monitor</td>
                  <td className="py-2.5 px-4">Hold New Orders</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
