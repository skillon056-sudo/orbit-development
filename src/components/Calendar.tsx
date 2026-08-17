"use client";
import { useState } from "react";

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Custom, mobile-friendly month picker. Past dates disabled, selected highlighted.
export default function Calendar({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayYmd = ymd(today);
  const init = value ? new Date(value + "T00:00:00") : today;
  const [view, setView] = useState(new Date(init.getFullYear(), init.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const canPrev = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const navBtn = "grid h-8 w-8 place-items-center rounded-lg border border-line text-white/70 transition hover:border-neonblue disabled:opacity-30";

  return (
    <div className="rounded-xl border border-line bg-ink2 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => setView(new Date(year, month - 1, 1))} className={navBtn}>
          ‹
        </button>
        <div className="text-sm font-semibold">{MONTHS[month]} {year}</div>
        <button type="button" aria-label="Next month" onClick={() => setView(new Date(year, month + 1, 1))} className={navBtn}>
          ›
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] text-white/40">
        {DOW.map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const s = ymd(d);
          const past = s < todayYmd;
          const selected = s === value;
          const isToday = s === todayYmd;
          return (
            <button
              key={i}
              type="button"
              disabled={past}
              onClick={() => onChange(s)}
              className={`aspect-square rounded-lg text-sm transition ${
                selected
                  ? "bg-neonblue font-semibold text-white"
                  : past
                    ? "cursor-not-allowed text-white/20"
                    : `text-white/80 hover:bg-white/5 ${isToday ? "ring-1 ring-neonblue/50" : ""}`
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
