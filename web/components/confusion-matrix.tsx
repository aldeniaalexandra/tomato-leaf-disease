"use client";

import { useState } from "react";
import {
  confusionMatrix,
  matrixLabels,
  matrixShortLabels,
  matrixTinyLabels,
} from "@/lib/confusion-matrix";
import { cn } from "@/lib/utils";

interface HoveredCell {
  row: number;
  col: number;
}

// sqrt scale keeps the rare 1-2% misclassifications visible next to the
// 97-100% diagonal without inventing a second hue
function mixPercent(value: number) {
  return Math.round(Math.sqrt(value / 100) * 100);
}

function cellBackground(value: number) {
  return `color-mix(in oklab, var(--heat-max) ${mixPercent(value)}%, var(--heat-min))`;
}

export function ConfusionMatrix() {
  const [hovered, setHovered] = useState<HoveredCell | null>(null);

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">Confusion matrix, test set</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>0%</span>
          <span
            aria-hidden
            className="h-2 w-24 rounded-full"
            style={{
              background:
                "linear-gradient(to right, var(--heat-min), var(--heat-max))",
            }}
          />
          <span>100%</span>
        </div>
      </div>

      <div className="mt-4">
        {/* Column headers: rotated 45 degrees on small screens so the full
            label stays readable without a horizontal scroll */}
        <div className="grid grid-cols-[3.5rem_repeat(10,minmax(0,1fr))] sm:grid-cols-[7rem_repeat(10,minmax(0,1fr))]">
          <span />
          {matrixShortLabels.map((label, col) => (
            <span
              key={label}
              className={cn(
                "text-[8px] transition-colors sm:block sm:truncate sm:px-0.5 sm:pb-2 sm:text-center sm:text-[11px]",
                "max-sm:relative max-sm:block max-sm:h-12",
                hovered?.col === col
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
              title={matrixLabels[col]}
            >
              <span className="max-sm:absolute max-sm:bottom-1 max-sm:right-0.5 max-sm:origin-bottom-right max-sm:-rotate-45 max-sm:whitespace-nowrap">
                <span className="sm:hidden">{matrixTinyLabels[col]}</span>
                <span className="max-sm:hidden">{label}</span>
              </span>
            </span>
          ))}
        </div>

        {/* Rows */}
        {confusionMatrix.map((row, r) => (
          <div
            key={matrixLabels[r]}
            className="grid grid-cols-[3.5rem_repeat(10,minmax(0,1fr))] sm:grid-cols-[7rem_repeat(10,minmax(0,1fr))]"
          >
            <span
              className={cn(
                "self-center pr-2 text-right text-[9px] transition-colors sm:pr-3 sm:text-[11px] max-sm:truncate",
                hovered?.row === r
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
              title={matrixLabels[r]}
            >
              {matrixShortLabels[r]}
            </span>
            {row.map((value, c) => {
              const active = hovered?.row === r && hovered?.col === c;
              const dimmed =
                hovered !== null && hovered.row !== r && hovered.col !== c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-label={`True ${matrixLabels[r]}, predicted ${matrixLabels[c]}: ${value} percent`}
                  onMouseEnter={() => setHovered({ row: r, col: c })}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered({ row: r, col: c })}
                  onBlur={() => setHovered(null)}
                  className={cn(
                    "relative m-px flex aspect-square cursor-default items-center justify-center rounded-[3px] font-mono text-[10px] transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-xs",
                    value >= 50
                      ? "text-[color:var(--heat-ink-strong)]"
                      : "text-muted-foreground",
                    dimmed && "opacity-40",
                    active && "ring-1 ring-ring"
                  )}
                  style={{ backgroundColor: cellBackground(value) }}
                >
                  <span className="max-sm:hidden">{value > 0 ? value : ""}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <p className="mt-4 min-h-5 text-xs text-muted-foreground" aria-live="polite">
        {hovered
          ? `True ${matrixLabels[hovered.row]}, predicted ${matrixLabels[hovered.col]}: ${confusionMatrix[hovered.row][hovered.col]}% of that class`
          : "Rows are true labels, columns are predictions, values are row percentages. Tap or hover a cell for detail."}
      </p>
    </div>
  );
}
