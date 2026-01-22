
import React from 'react';
import { LocationData } from '../types';

interface Props {
  data: LocationData;
}

const LocationDisplay: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* High-Performance Map Widget */}
      <div className="rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] aspect-[16/10] relative bg-black group">
         <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=17&output=embed&t=k`}
          className="grayscale brightness-125 contrast-[1.1] opacity-60 group-hover:opacity-80 transition-opacity duration-700"
          title="Satellite Module"
         ></iframe>
         
         {/* HUD Interface Overlay */}
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="bg-[#bd34fe] text-white text-[8px] font-black px-2 py-1 rounded-md shadow-lg flex items-center gap-1.5 uppercase tracking-widest border border-white/20">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
                    Module: GEO_X2
                </div>
                <div className="bg-black/60 backdrop-blur-md text-slate-300 text-[8px] font-mono px-2 py-1 rounded border border-white/5 uppercase tracking-tighter">
                    Stream: Latency 42ms
                </div>
            </div>
            
            {/* Grid Lines Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
                <div className="h-1 w-16 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#41d1ff] w-4/5"></div>
                </div>
                <span className="text-white text-[7px] font-black tracking-[0.3em] uppercase opacity-60">Signal Strength</span>
            </div>
         </div>
      </div>

      {/* Production Metadata Modules */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/40 rounded-2xl p-5 border border-white/5 hover:border-white/20 transition-colors">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">X_Coordinate</p>
            <p className="text-xl font-bold text-[#bd34fe] mono-font leading-none">{data.latitude.toFixed(6)}</p>
        </div>
        <div className="bg-black/40 rounded-2xl p-5 border border-white/5 hover:border-white/20 transition-colors">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Y_Coordinate</p>
            <p className="text-xl font-bold text-[#41d1ff] mono-font leading-none">{data.longitude.toFixed(6)}</p>
        </div>
      </div>

      {/* Address Decryption Module */}
      <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 flex gap-5 items-start relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500">
        <div className="absolute top-0 left-0 w-[2px] h-full vite-gradient"></div>
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-inner">
          <i className="fas fa-location-dot text-[#41d1ff] text-xl"></i>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resolved Endpoint</p>
          <p className="text-sm font-bold text-slate-100 leading-relaxed italic group-hover:text-white transition-colors">{data.address || 'Resolving network path...'}</p>
        </div>
      </div>

      {/* Interactive Command Suite */}
      <div className="space-y-4 pt-4">
        <a 
          href={data.googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between group w-full bg-white text-black font-black py-5 px-8 rounded-2xl transition-all hover:bg-slate-100 shadow-[0_15px_40px_rgba(255,255,255,0.1)] active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
              <i className="fab fa-google text-xl group-hover:rotate-12 transition-transform"></i>
              <span className="text-sm tracking-tighter uppercase font-black">Open External Matrix</span>
          </div>
          <i className="fas fa-chevron-right opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
        </a>

        {data.groundingUrls && data.groundingUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {data.groundingUrls.map((url, idx) => (
              <a 
                key={idx} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-slate-500 hover:text-white font-black bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all border border-white/5 flex items-center gap-2 hover:border-[#bd34fe]/50"
              >
                <i className="fas fa-fingerprint text-[#bd34fe] text-[8px]"></i>
                RE_HASH_{idx + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDisplay;
