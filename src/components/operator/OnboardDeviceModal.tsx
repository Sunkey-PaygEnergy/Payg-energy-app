'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { HardwareType } from '@/types';
import { Cpu, Wifi, KeyRound, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface OnboardDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorAddress: string;
  onDeviceRegistered?: (device: any) => void;
}

export const OnboardDeviceModal: React.FC<OnboardDeviceModalProps> = ({
  isOpen,
  onClose,
  operatorAddress,
  onDeviceRegistered,
}) => {
  const [deviceId, setDeviceId] = useState('');
  const [deviceModel, setDeviceModel] = useState('Sinoware SunHome-Base 100');
  const [hardwareType, setHardwareType] = useState<HardwareType>('iot_connected');
  const [firmwareVersion, setFirmwareVersion] = useState('v2.4.1-openpaygo');
  const [openpaygoKey, setOpenpaygoKey] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registeredResult, setRegisteredResult] = useState<any | null>(null);

  const generateRandomKey = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const hex = Array.from(array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    setOpenpaygoKey(hex);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceId.trim()) {
      setErrorMsg('Device Serial ID is required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Simulate Soroban contract register_device call
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const newDevice = {
        deviceId: deviceId.trim().toUpperCase(),
        operatorAddress,
        deviceModel,
        hardwareType,
        tokenCount: 0,
        firmwareVersion,
        lastSyncStatus: 'locked',
        registeredAt: new Date().toISOString(),
        txHash: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
      };

      setRegisteredResult(newDevice);
      if (onDeviceRegistered) {
        onDeviceRegistered(newDevice);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to register device on Stellar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setDeviceId('');
    setRegisteredResult(null);
    setErrorMsg(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title="Onboard Solar Hardware Unit"
    >
      {registeredResult ? (
        <div className="space-y-5 text-center py-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Device Successfully Registered!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Recorded on Stellar Ledger and synced with OpenPAYGO bridge.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Device ID:</span>
              <span className="text-solar-400 font-bold">{registeredResult.deviceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Model:</span>
              <span className="text-slate-300">{registeredResult.deviceModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hardware:</span>
              <span className="text-slate-300 capitalize">{registeredResult.hardwareType.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tx Hash:</span>
              <span className="text-emerald-400 truncate max-w-[180px]">{registeredResult.txHash}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleReset} className="w-1/2 text-xs">
              Onboard Another
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="w-1/2 text-xs bg-solar-500 text-slate-950 font-bold"
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-400">
            Register hardware serials to enable Soroban lease creation, telemetry ingestion, and OpenPAYGO activation tokens.
          </p>

          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Device ID */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Device Serial / IMEI Identifier *
            </label>
            <Input
              placeholder="e.g. DEV-SH100-9920 or 864501048827110"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="font-mono text-xs"
              required
            />
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Hardware Model Specification
            </label>
            <select
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-solar-500 focus:outline-none"
            >
              <option value="Sinoware SunHome-Base 100">Sinoware SunHome-Base 100 (50W Solar, 12V LiFePO4)</option>
              <option value="Victron SHS200 Smart">Victron SHS200 Smart (200W MPPT, USB/DC Output)</option>
              <option value="Bboxx Flexx40 Keypad">Bboxx Flexx40 Keypad (40Wh Entry Kit)</option>
              <option value="Bluetti Solar P150">Bluetti Solar P150 (150W Portable Generator)</option>
              <option value="Lorentz S1-200 Pump">Lorentz S1-200 Solar Irrigation Pump</option>
              <option value="IONA Home Max 300">IONA Home Max 300 (Clean Cookstove + Solar Hub)</option>
            </select>
          </div>

          {/* Hardware Connection Type */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Access Control Architecture
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHardwareType('iot_connected')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  hardwareType === 'iot_connected'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                }`}
              >
                <Wifi className={`w-4 h-4 ${hardwareType === 'iot_connected' ? 'text-emerald-400' : ''}`} />
                <div>
                  <div className="text-xs font-semibold">IoT 4G / NB-IoT</div>
                  <div className="text-[10px] text-slate-400">Over-the-air relay</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setHardwareType('offline_keypad')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  hardwareType === 'offline_keypad'
                    ? 'border-solar-500/50 bg-solar-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className={`w-4 h-4 ${hardwareType === 'offline_keypad' ? 'text-solar-400' : ''}`} />
                <div>
                  <div className="text-xs font-semibold">Offline Keypad</div>
                  <div className="text-[10px] text-slate-400">9-digit HMAC token</div>
                </div>
              </button>
            </div>
          </div>

          {/* OpenPAYGO Secret Key if Keypad */}
          {hardwareType === 'offline_keypad' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">
                  OpenPAYGO Shared Secret Key (128-bit)
                </label>
                <button
                  type="button"
                  onClick={generateRandomKey}
                  className="text-[11px] text-solar-400 hover:underline"
                >
                  Generate Key
                </button>
              </div>
              <Input
                placeholder="16-byte hex seed (e.g. 4a8f9c2d1b...)"
                value={openpaygoKey}
                onChange={(e) => setOpenpaygoKey(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Stored in device secure enclave and KMS for token derivation.
              </p>
            </div>
          )}

          {/* Firmware version */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Firmware Tag
            </label>
            <Input
              value={firmwareVersion}
              onChange={(e) => setFirmwareVersion(e.target.value)}
              className="text-xs font-mono"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full bg-solar-500 text-slate-950 font-bold hover:bg-solar-400"
            >
              {submitting ? 'Registering on Stellar Ledger...' : 'Register Hardware Asset'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
