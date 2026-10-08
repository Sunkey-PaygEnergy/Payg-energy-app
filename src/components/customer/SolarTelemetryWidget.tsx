import React from 'react';
import { BatteryCharging, SunMedium, Zap, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Telemetry } from '@/types';
import { Card } from '@/components/ui/Card';

export interface SolarTelemetryWidgetProps {
  telemetry?: Telemetry;
}

export const SolarTelemetryWidget: React.FC<SolarTelemetryWidgetProps> = ({ telemetry }) => {
  const t = telemetry || {
    deviceId: 'SINOWARE-SHB100-01',
    batteryVoltageMv: 12650,
    solarInputMv: 18400,
    outputCurrentMa: 1350,
    energyGeneratedWh: 450.8,
    relayState: true,
    tamperFlag: false,
    recordedAt: new Date().toISOString(),
  };

  const batteryVolts = (t.batteryVoltageMv / 1000).toFixed(2);
  const solarVolts = (t.solarInputMv / 1000).toFixed(1);
  const currentAmps = (t.outputCurrentMa / 1000).toFixed(2);

  // Approximate LiFePO4 percentage (12.0V ~ 10%, 13.4V ~ 100%)
  const batteryPct = Math.min(
    100,
    Math.max(10, Math.round(((t.batteryVoltageMv - 11800) / (13400 - 11800)) * 100))
  );

  return (
    <Card className="p-5 border-slate-800/90">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-clean-500/15 text-clean-400">
            <SunMedium className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Solar & Battery Health
            </h4>
            <p className="text-[11px] text-slate-400">Live Hardware Telemetry</p>
          </div>
        </div>

        {/* Tamper Status */}
        {t.tamperFlag ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
            <ShieldAlert className="h-3 w-3" />
            Tamper Alert
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-clean-400 bg-clean-500/10 px-2 py-0.5 rounded-full border border-clean-500/30">
            <ShieldCheck className="h-3 w-3" />
            Hardware Secure
          </span>
        )}
      </div>

      {/* Primary Battery Gauge */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <BatteryCharging className="h-4 w-4 text-clean-400" />
            Battery Charge
          </span>
          <span className="text-sm font-bold text-white">
            {batteryVolts}V <span className="text-clean-400 text-xs">({batteryPct}%)</span>
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-clean-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-clean-500/50"
            style={{ width: `${batteryPct}%` }}
          />
        </div>
      </div>

      {/* Telemetry 3-Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block mb-0.5">Solar PV</span>
          <span className="text-xs font-bold text-solar-400">{solarVolts}V</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block mb-0.5">Load Draw</span>
          <span className="text-xs font-bold text-slate-200">{currentAmps}A</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block mb-0.5">Energy Gen</span>
          <span className="text-xs font-bold text-clean-400">{t.energyGeneratedWh} Wh</span>
        </div>
      </div>
    </Card>
  );
};
