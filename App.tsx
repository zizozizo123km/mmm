
import React, { useState, useCallback, useEffect } from 'react';
import { AppStatus, LocationData } from './types';
import { getCurrentPosition } from './services/geoService';
import { sendLocationToTelegram } from './services/telegramService';
import { getReverseGeocode } from './services/geminiService';
import PrivacyNotice from './components/PrivacyNotice';
import LocationDisplay from './components/LocationDisplay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string>(localStorage.getItem('tg_chat_id') || '');

  useEffect(() => {
    localStorage.setItem('tg_chat_id', chatId);
  }, [chatId]);

  const handleStartSharing = useCallback(async () => {
    if (!chatId) {
        setError("Build Error: Target Chat ID undefined.");
        return;
    }

    setStatus(AppStatus.REQUESTING_PERMISSION);
    setError(null);

    try {
      const posData = await getCurrentPosition();
      setLocation(posData);
      setStatus(AppStatus.LOCATING);

      try {
        const result = await getReverseGeocode(posData.latitude, posData.longitude);
        posData.address = result.address;
        posData.groundingUrls = result.groundingUrls;
        setLocation({ ...posData });
      } catch (geoError) {
        console.error("Geocoding module skipped in production build.");
      }

      setStatus(AppStatus.SENDING_TELEGRAM);
      await sendLocationToTelegram(posData, chatId);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Edge Function Timeout: Transmission failed.");
      setStatus(AppStatus.ERROR);
    }
  }, [chatId]);

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setLocation(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 selection:bg-[#41d1ff]/30">
      {/* Dynamic Production Background */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#bd34fe]/10 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#41d1ff]/10 rounded-full blur-[160px] pointer-events-none animate-pulse delay-1000"></div>

      <div className="max-w-md w-full z-10">
        {/* Vercel Style Header */}
        <div className="text-center mb-10">
            <div className="inline-block mb-4 relative">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
                <div className="relative w-20 h-20 vite-gradient rounded-[1.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(189,52,254,0.3)] transition-transform hover:scale-105 duration-500">
                    <i className="fas fa-location-arrow text-white text-4xl"></i>
                </div>
                {/* Vercel Badge */}
                <div className="absolute -bottom-2 -right-2 bg-black text-white text-[8px] font-black px-2 py-1 rounded-md border border-white/20 shadow-xl flex items-center gap-1">
                    <i className="fas fa-triangle text-[6px]"></i> VERCEL_READY
                </div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
                Geo<span className="vite-text-gradient">Share</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
                <span className="h-1 w-1 bg-green-500 rounded-full animate-ping"></span>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Live Production Cluster</p>
            </div>
        </div>

        {/* Deployment Container */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10">
          
          {status === AppStatus.IDLE && (
            <div className="p-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="space-y-3 mb-10">
                <h2 className="text-2xl font-bold text-white tracking-tight">System Initialization</h2>
                <p className="text-slate-400 text-sm leading-relaxed">Configure your secure uplink to begin real-time location telemetry transmission.</p>
              </div>

              <div className="space-y-6">
                <div className="group">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Deployment Target</label>
                        <span className="text-[9px] font-bold text-blue-400 opacity-0 group-focus-within:opacity-100 transition-opacity">REQUIRED_ID</span>
                    </div>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Telegram Chat ID..."
                            value={chatId}
                            onChange={(e) => setChatId(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-[#41d1ff]/50 focus:border-transparent transition-all mono-font text-sm placeholder:text-slate-700"
                        />
                    </div>
                </div>

                <PrivacyNotice />

                <button
                  onClick={handleStartSharing}
                  className="w-full vite-gradient text-white font-black py-5 px-6 rounded-2xl transition-all shadow-[0_10px_30px_rgba(189,52,254,0.4)] flex items-center justify-center gap-3 transform active:scale-95 hover:brightness-110 hover:-translate-y-0.5 text-lg"
                >
                  <i className="fas fa-rocket"></i>
                  DEPLOY TELEMETRY
                </button>
              </div>
            </div>
          )}

          {(status === AppStatus.REQUESTING_PERMISSION || status === AppStatus.LOCATING || status === AppStatus.SENDING_TELEGRAM) && (
            <div className="p-20 flex flex-col items-center gap-10">
              <div className="relative">
                <div className="w-32 h-32 border-[1px] border-[#41d1ff]/10 rounded-full animate-ping absolute"></div>
                <div className="w-32 h-32 border-4 border-t-[#bd34fe] border-l-[#41d1ff] border-r-transparent border-b-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md">
                        <i className="fas fa-satellite-dish text-[#41d1ff] text-2xl animate-pulse"></i>
                    </div>
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-xl font-black text-white italic uppercase tracking-wider">
                  {status === AppStatus.REQUESTING_PERMISSION && "Requesting Sync..."}
                  {status === AppStatus.LOCATING && "Fetching Hot Data..."}
                  {status === AppStatus.SENDING_TELEGRAM && "Pushing to Edge..."}
                </h3>
                <div className="inline-flex items-center bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                   <div className="h-1.5 w-1.5 bg-[#bd34fe] rounded-full animate-pulse mr-3"></div>
                   <p className="text-slate-500 text-[9px] font-black tracking-[0.2em] uppercase">Status: Routing...</p>
                </div>
              </div>
            </div>
          )}

          {status === AppStatus.ERROR && (
            <div className="p-12 text-center animate-in fade-in slide-in-from-top-4">
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
                <i className="fas fa-triangle-exclamation text-red-500 text-3xl"></i>
              </div>
              <h3 className="text-3xl font-black text-white mb-3">Runtime Error</h3>
              <p className="text-slate-400 text-sm mb-10 px-6 font-mono bg-black/30 p-4 rounded-xl border border-white/5">
                {error}
              </p>
              <button
                onClick={reset}
                className="w-full bg-white text-black font-black py-5 rounded-2xl transition-all hover:bg-slate-200 active:scale-95 shadow-xl"
              >
                REBUILD SESSION
              </button>
            </div>
          )}

          {status === AppStatus.SUCCESS && location && (
            <div className="animate-in fade-in duration-1000">
              <div className="bg-[#10b981] text-white p-4 flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.3em] shadow-lg">
                <i className="fas fa-check-double animate-bounce"></i>
                Vercel Edge: Delivery Complete
              </div>
              
              <div className="p-8">
                <LocationDisplay data={location} />

                <button
                  onClick={reset}
                  className="w-full mt-8 text-slate-500 hover:text-white text-[10px] font-black py-5 transition-all uppercase tracking-[0.4em] border-t border-white/5 group"
                >
                  <i className="fas fa-code-branch mr-2 group-hover:rotate-180 transition-transform duration-500"></i>
                  New Deployment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vercel Optimized Footer */}
        <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <i className="fab fa-react text-2xl"></i>
                <i className="fab fa-google text-xl"></i>
                <i className="fab fa-telegram text-2xl"></i>
                <i className="fas fa-shield-halved text-xl"></i>
            </div>
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.5em] flex items-center gap-2">
                <span className="w-8 h-[1px] bg-slate-800"></span>
                Cloud Native Environment
                <span className="w-8 h-[1px] bg-slate-800"></span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
