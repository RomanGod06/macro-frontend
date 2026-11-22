import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const devices = [
  { id: "SEN-0042", name: "Temp Sensor A1", loc: "Warehouse A", status: "online" },
  { id: "GW-019", name: "Gateway Node 19", loc: "Zone B — Roof", status: "online" },
  { id: "SEN-0107", name: "Humidity Probe", loc: "Cold Storage", status: "idle" },
  { id: "CAM-003", name: "Camera Unit 3", loc: "Entry Gate", status: "online" },
  { id: "SEN-0088", name: "CO₂ Monitor", loc: "Lab B", status: "online" },
  { id: "ACT-011", name: "Actuator Valve", loc: "Irrigation Z1", status: "idle" },
  { id: "SEN-0031", name: "Light Sensor", loc: "Greenhouse", status: "online" },
  { id: "GW-007", name: "Gateway Node 7", loc: "Zone A — Main", status: "offline" },
];

const events = [
  { color: "bg-emerald-500", msg: <><strong>SEN-0042</strong> came online</>, time: "2m ago" },
  { color: "bg-amber-400", msg: <><strong>GW-019</strong> update scheduled</>, time: "5m ago" },
  { color: "bg-red-500", msg: <><strong>SEN-0107</strong> battery critical</>, time: "9m ago" },
];

const usageBars = [
  { label: "Data Bandwidth", pct: 78, color: "bg-sky-400" },
  { label: "Storage Utilization", pct: 54, color: "bg-amber-400" },
];

const statusStyles = {
  online: { badge: "bg-emerald-100 text-emerald-700" },
  idle: { badge: "bg-amber-100 text-amber-700" },
  offline: { badge: "bg-red-100 text-red-600" },
};

const FILTERS = ["All", "Online", "Idle", "Offline"];

function Sparkline({ offline }) {
  const points = [6, 14, 10, 18, 12, 20, 15, 22, 14, 18]
    .map((y, i) => `${i * 20},${y}`)
    .join(" ");

  return (
    <svg viewBox="0 0 180 28" className="w-full h-7 mt-2" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={offline ? "#CBD5E1" : "#0EA5E9"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeviceCard({ device, index }) {
  const s = statusStyles[device.status];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 hover:border-[#0EA5E9] transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-slate-500">{device.id}</span>
        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${s.badge}`}>
          {device.status}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#0F172A]">{device.name}</p>
      <p className="text-xs text-slate-500 mb-2">{device.loc}</p>
      <Sparkline offline={device.status === "offline"} />
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = devices.filter((d) =>
    activeFilter === "All" ? true : d.status === activeFilter.toLowerCase()
  );

  return (
    <div className="relative bg-[#F8FAFC] text-[#0F172A] min-h-screen overflow-x-hidden">
      <main className="relative z-10">
        <section className="flex flex-col items-center text-center px-6 pt-16 pb-14">
          <div className="inline-flex items-center gap-2 bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9] text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
            MACRO IoT Control Platform
          </div>

          <h1
            className="text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.08] tracking-[-1.5px] text-[#0F172A] max-w-2xl mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Manage your <span className="text-[#0EA5E9]">IoT fleet</span> with precision
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mb-8">
            Monitor connected nodes, design hardware blueprints, and trigger real-time automation rules from one console.
          </p>

          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              Access Dashboard →
            </button>
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#E2E8F0] border-y border-[#E2E8F0] bg-white">
          {[
            { val: "ESP32 / RPi", lbl: "Supported Nodes" },
            { val: "Real-Time", lbl: "WebSocket Telemetry" },
            { val: "Visual Canvas", lbl: "Hardware & Rules" },
            { val: "Cloud Sync", lbl: "PostgreSQL & Channels" },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="flex flex-col items-center py-6 px-4 text-center">
              <span
                className="text-2xl font-bold tracking-tight text-[#0F172A]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {val}
              </span>
              <span className="text-xs text-slate-500 mt-1">{lbl}</span>
            </div>
          ))}
        </div>

        <div className="bg-white/60 border-b border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Sample Fleet Overview
              </h2>
              <div className="flex gap-2 flex-wrap">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      activeFilter === f
                        ? "bg-[#0EA5E9] text-white border-[#0EA5E9]"
                        : "bg-white text-slate-600 border-[#E2E8F0] hover:border-slate-300"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((d, i) => (
                  <DeviceCard key={d.id} device={d} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <section className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2E8F0] font-semibold">Recent Events</div>
              {events.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-1.5 ${e.color}`} />
                    <p className="text-sm text-slate-700">{e.msg}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono shrink-0">{e.time}</span>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
              <div className="font-semibold mb-4">Resource Usage</div>
              {usageBars.map(({ label, pct, color }) => (
                <div key={label} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full ${color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}