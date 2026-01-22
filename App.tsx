
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
        setError("Missing Destination: Enter a Chat ID.");
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
        console.error("Geocoding suppressed.");
      }

      setStatus(AppStatus.SENDING_TELEGRAM);
      await sendLocationToTelegram(posData, chatId);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Transmission failed.");
      setStatus(AppStatus.ERROR);
    }
  }, [chatId]);

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setLocation(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Background Orbs (Vite style) */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#bd34fe]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#41d1ff]/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full z-10">
        {/* Vite Header */}
        <div className="flex items-center justify-center gap-4 mb-10 group cursor-default">
            <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl group-hover:bg-white/40 transition-all rounded-full"></div>
                <div className="relative w-16 h-16 vite-gradient rounded-2xl flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                    <i className="fas fa-location-arrow text-white text-3xl"></i>
                </div>
            </div>
            <div>
                <h1 className="text-4xl font-extrabold tracking-tighter leading-none">
                    Geo<span className="vite-text-gradient">Share</span>
                </h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Version 2.0.0-beta</p>
            </div>
        </div>

        {/* Content Card */}
        <div className="glass-card rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
          
          {status === AppStatus.IDLE && (
            <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 mb-8 text-center">
                <h2 className="text-2xl font-bold text-white">Deploy Location</h2>
                <p className="text-slate-400 text-sm">Securely push your coordinates to Telegram.</p>
              </div>

              <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Destination ID</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Target Chat ID..."
                            value={chatId}
                            onChange={(e) => setChatId(e.target.value)}
                            className="w-full bg-[#1e232d] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#41d1ff]/50 transition-all mono-font text-sm"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${chatId ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                    </div>
                </div>

                <PrivacyNotice />

                <button
                  onClick={handleStartSharing}
                  className="w-full vite-gradient text-white font-extrabold py-5 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(189,52,254,0.3)] flex items-center justify-center gap-3 transform active:scale-95 hover:brightness-110"
                >
                  <i className="fas fa-bolt"></i>
                  RUN SHARING
                </button>
              </div>
            </div>
          )}

          {(status === AppStatus.REQUESTING_PERMISSION || status === AppStatus.LOCATING || status === AppStatus.SENDING_TELEGRAM) && (
            <div className="p-16 flex flex-col items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 border-2 border-[#41d1ff]/20 rounded-full animate-ping absolute"></div>
                <div className="w-24 h-24 border-4 border-t-[#bd34fe] border-l-[#41d1ff] border-r-transparent border-b-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight italic uppercase">
                  {status === AppStatus.REQUESTING_PERMISSION && "Requesting Sync..."}
                  {status === AppStatus.LOCATING && "Fetching Hot Module..."}
                  {status === AppStatus.SENDING_TELEGRAM && "Pushing to Remote..."}
                </h3>
                <div className="flex items-center justify-center gap-2">
                   <div className="h-1.5 w-1.5 bg-[#41d1ff] rounded-full animate-pulse"></div>
                   <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">Building session...</p>
                </div>
              </div>
            </div>
          )}

          {status === AppStatus.ERROR && (
            <div className="p-10 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-bug text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Build Failed</h3>
              <p className="text-slate-400 text-sm mb-8 px-4 font-mono">
                {error}
              </p>
              <button
                onClick={reset}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10"
              >
                Clear Cache & Retry
              </button>
            </div>
          )}

          {status === AppStatus.SUCCESS && location && (
            <div className="animate-in fade-in duration-700">
              <div className="bg-[#10b981] text-white p-3 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]">
                <i className="fas fa-check-circle"></i>
                HMR Complete: Data Transferred
              </div>
              
              <div className="p-6">
                <LocationDisplay data={location} />

                <button
                  onClick={reset}
                  className="w-full mt-6 text-slate-500 hover:text-[#41d1ff] text-[10px] font-black py-4 transition-all uppercase tracking-widest border-t border-white/5"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  New Session
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tech Footer */}
        <div className="mt-10 text-center space-y-4">
            <div className="flex justify-center items-center gap-4 text-slate-600">
                <i className="fab fa-react hover:text-[#61dafb] cursor-pointer transition-colors text-xl"></i>
                <i className="fab fa-node-js hover:text-[#68a063] cursor-pointer transition-colors text-xl"></i>
                <i className="fas fa-shield-halved hover:text-[#bd34fe] cursor-pointer transition-colors text-xl"></i>
            </div>
            <div className="bg-[#1e232d] px-4 py-2 rounded-full inline-flex items-center gap-3 border border-white/5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">API Status: Operational</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
