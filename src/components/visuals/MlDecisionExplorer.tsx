import React, { useMemo, useState } from 'react';

interface MlDecisionExplorerProps {
  compact?: boolean;
}

const REG_POINTS = [
  { x: 1, y: 2.1 },
  { x: 2, y: 3.4 },
  { x: 3, y: 3.9 },
  { x: 4, y: 5.5 },
  { x: 5, y: 6.2 },
  { x: 6, y: 7.4 },
  { x: 7, y: 8.6 },
  { x: 8, y: 9.2 },
];

const CLASS_A = [
  { x: 1.5, y: 6.5 },
  { x: 2.2, y: 7.8 },
  { x: 3.0, y: 6.2 },
  { x: 3.6, y: 8.1 },
  { x: 2.5, y: 5.4 },
];

const CLASS_B = [
  { x: 5.8, y: 2.4 },
  { x: 6.6, y: 3.8 },
  { x: 7.4, y: 2.1 },
  { x: 8.1, y: 4.0 },
  { x: 6.9, y: 1.5 },
];

export const MlDecisionExplorer: React.FC<MlDecisionExplorerProps> = ({ compact = false }) => {
  const [mode, setMode] = useState<'regression' | 'classification'>('regression');
  const [slopeOffset, setSlopeOffset] = useState(0);

  const width = 520;
  const height = 220;
  const pad = 34;

  const toX = (x: number) => pad + (x / 9.5) * (width - pad * 2);
  const toY = (y: number) => height - pad - (y / 10.5) * (height - pad * 2);

  const mse = useMemo(() => {
    const slope = 1.03 + slopeOffset * 0.12;
    const intercept = 1.08;
    const err = REG_POINTS.reduce((acc, p) => {
      const pred = slope * p.x + intercept;
      return acc + (p.y - pred) ** 2;
    }, 0);
    return (err / REG_POINTS.length).toFixed(3);
  }, [slopeOffset]);

  const currentSlope = 1.03 + slopeOffset * 0.12;
  const currentIntercept = 1.08;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Interactive Statistical Learning Concept
          </p>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5">
            {mode === 'regression'
              ? 'Least-Squares Linear Regression & Residual Loss'
              : 'Linear Decision Boundary for Binary Classification'}
          </h4>
        </div>

        {!compact && (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#070D19] border border-slate-200 dark:border-[#1E2D4A]">
            <button
              type="button"
              onClick={() => setMode('regression')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'regression'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Regression
            </button>
            <button
              type="button"
              onClick={() => setMode('classification')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'classification'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Classification
            </button>
          </div>
        )}
      </div>

      <div className="w-full overflow-hidden rounded-lg bg-slate-50 dark:bg-[#070D19] border border-slate-200 dark:border-[#1E2D4A] p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block"
          role="img"
          aria-label="Statistical learning visualization"
        >
          <line
            x1={pad}
            y1={pad}
            x2={pad}
            y2={height - pad}
            className="stroke-slate-400 dark:stroke-slate-600"
            strokeWidth="1.2"
          />
          <line
            x1={pad}
            y1={height - pad}
            x2={width - pad}
            y2={height - pad}
            className="stroke-slate-400 dark:stroke-slate-600"
            strokeWidth="1.2"
          />

          {mode === 'regression' ? (
            <>
              {REG_POINTS.map((p, idx) => {
                const predY = currentSlope * p.x + currentIntercept;
                return (
                  <g key={idx}>
                    <line
                      x1={toX(p.x)}
                      y1={toY(p.y)}
                      x2={toX(p.x)}
                      y2={toY(predY)}
                      stroke="#94A3B8"
                      strokeDasharray="3 3"
                      strokeWidth="1.2"
                    />
                    <circle cx={toX(p.x)} cy={toY(p.y)} r="4.5" fill="#F8FAFC" stroke="#2563EB" strokeWidth="2" />
                  </g>
                );
              })}
              <line
                x1={toX(0.4)}
                y1={toY(currentSlope * 0.4 + currentIntercept)}
                x2={toX(8.8)}
                y2={toY(currentSlope * 8.8 + currentIntercept)}
                stroke="#3B82F6"
                strokeWidth="2.5"
              />
            </>
          ) : (
            <>
              <line
                x1={toX(1.2)}
                y1={toY(1.2)}
                x2={toX(8.4)}
                y2={toY(8.4)}
                stroke="#3B82F6"
                strokeWidth="2.5"
              />
              <line
                x1={toX(0.7)}
                y1={toY(1.9)}
                x2={toX(7.6)}
                y2={toY(8.8)}
                stroke="#3B82F6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1={toX(1.9)}
                y1={toY(0.7)}
                x2={toX(8.8)}
                y2={toY(7.6)}
                stroke="#3B82F6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {CLASS_A.map((p, i) => (
                <circle key={`a-${i}`} cx={toX(p.x)} cy={toY(p.y)} r="5" fill="#3B82F6" />
              ))}
              {CLASS_B.map((p, i) => (
                <rect
                  key={`b-${i}`}
                  x={toX(p.x) - 4.5}
                  y={toY(p.y) - 4.5}
                  width="9"
                  height="9"
                  rx="2"
                  fill="#94A3B8"
                />
              ))}
            </>
          )}
        </svg>
      </div>

      {!compact && mode === 'regression' && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <label className="flex-1 min-w-[200px]">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
              <span>Adjust Slope Perturbation (β₁)</span>
              <span className="font-mono tabular-nums">β₁ = {currentSlope.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.5}
              value={slopeOffset}
              onChange={(e) => setSlopeOffset(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </label>
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Mean Squared Error</span>
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
              MSE = {mse}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
