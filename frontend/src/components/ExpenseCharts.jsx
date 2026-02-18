import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

function formatMonthLabel(dateLike) {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "Sconosciuto";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

function makeGradient(ctx, area, from, to) {
  const g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
  g.addColorStop(0, from);
  g.addColorStop(1, to);
  return g;
}

const PALETTE = [
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#a78bfa",
  "#22d3ee",
  "#fb7185",
  "#c084fc",
  "#4ade80",
  "#f97316",
];

export default function ExpenseCharts({ expenses }) {
  const totalByMonth = useMemo(() => {
    const map = new Map();
    for (const e of expenses || []) {
      const key = formatMonthLabel(e.createdAt || e.date);
      map.set(key, (map.get(key) || 0) + Number(e.amount || 0));
    }
    const labels = Array.from(map.keys()).sort();
    const values = labels.map((k) => round2(map.get(k)));
    return { labels, values };
  }, [expenses]);

  const totalByPayer = useMemo(() => {
    const map = new Map();
    for (const e of expenses || []) {
      const payer = (e.paidBy || "Sconosciuto").trim() || "Sconosciuto";
      map.set(payer, (map.get(payer) || 0) + Number(e.amount || 0));
    }
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    return {
      labels: entries.map(([k]) => k),
      values: entries.map(([, v]) => round2(v)),
    };
  }, [expenses]);

  const participationCount = useMemo(() => {
    const map = new Map();
    for (const e of expenses || []) {
      const parts = Array.isArray(e.participants) ? e.participants : [];
      for (const p of parts) {
        const name = String(p || "").trim();
        if (!name) continue;
        map.set(name, (map.get(name) || 0) + 1);
      }
    }
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    return {
      labels: entries.map(([k]) => k),
      values: entries.map(([, v]) => v),
    };
  }, [expenses]);

  if (!expenses || expenses.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Grafici</h3>
        <p>Nessuna spesa disponibile: aggiungi qualche spesa per vedere i grafici.</p>
      </div>
    );
  }

  
  const lineData = {
    labels: totalByMonth.labels,
    datasets: [
      {
        label: "Totale spese per mese",
        data: totalByMonth.values,
        borderColor: "#3b82f6",
        
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(59,130,246,.15)";
          return makeGradient(
            ctx,
            chartArea,
            "rgba(59,130,246,.35)",
            "rgba(59,130,246,0)"
          );
        },
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#3b82f6",
        borderWidth: 3,
      },
    ],
  };

  const barData = {
    labels: totalByPayer.labels,
    datasets: [
      {
        label: "Totale pagato (per persona)",
        data: totalByPayer.values,
        backgroundColor: totalByPayer.labels.map((_, i) => PALETTE[i % PALETTE.length]),
        borderColor: "rgba(0,0,0,.08)",
        borderWidth: 1,
        borderRadius: 10,
        maxBarThickness: 44,
      },
    ],
  };

  const doughnutData = {
    labels: participationCount.labels,
    datasets: [
      {
        label: "Presenze come partecipante",
        data: participationCount.values,
        backgroundColor: participationCount.labels.map((_, i) => PALETTE[i % PALETTE.length]),
        borderColor: "rgba(255,255,255,.95)",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "rgba(15,23,42,.85)", font: { weight: "600" } },
      },
      tooltip: {
        backgroundColor: "rgba(15,23,42,.92)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255,255,255,.15)",
        borderWidth: 1,
      },
      title: {
        display: true,
        color: "rgba(15,23,42,.9)",
        font: { size: 16, weight: "800" },
      },
    },
    scales: {
      x: {
        ticks: { color: "rgba(15,23,42,.7)" },
        grid: { color: "rgba(15,23,42,.06)" },
      },
      y: {
        ticks: { color: "rgba(15,23,42,.7)" },
        grid: { color: "rgba(15,23,42,.06)" },
      },
    },
  };

  const lineOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: { ...commonOptions.plugins.title, text: "Andamento spese nel tempo" },
    },
  };

  const barOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: { ...commonOptions.plugins.title, text: "Chi ha pagato di più" },
    },
  };

  const doughnutOptions = {
    ...commonOptions,
    scales: undefined,
    plugins: {
      ...commonOptions.plugins,
      title: { ...commonOptions.plugins.title, text: "Partecipazione alle spese" },
    },
  };

    const cardStyle = (from) => ({
    borderRadius: 18,
    padding: 14,
    background: `linear-gradient(180deg, ${from}, rgba(255,255,255,0))`,
    border: "1px solid rgba(2,6,23,.08)",
    boxShadow: "0 8px 30px rgba(2,6,23,.06)",
    minHeight: "clamp(240px, 35vh, 380px)", // ✅ altezza fluida
  });

  return (
    <div className="chartsRoot">
      <div className="chartsHeader">
        <div>
          <h2 style={{ margin: 0 }}>Grafici Spese</h2>
          <p style={{ margin: "6px 0 0", color: "rgba(15,23,42,.65)" }}>
            Trend, pagatori e partecipazione
          </p>
        </div>
      </div>

      <div className="chartsGrid">
        <div className="chartCard" style={cardStyle("rgba(59,130,246,.10)")}>
          <div className="chartCanvas">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        <div className="chartCard" style={cardStyle("rgba(34,197,94,.10)")}>
          <div className="chartCanvas">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="chartCard chartCardFull" style={cardStyle("rgba(168,85,247,.12)")}>
          <div className="chartCanvas">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}