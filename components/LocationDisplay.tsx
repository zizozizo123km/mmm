
import React from 'react';
import { LocationData } from '../types';

interface Props {
  data: LocationData;
}

const LocationDisplay: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Map Widget */}
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video relative bg-[#0b0e14]">
         <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=16&output=embed&t=k`}
          className="grayscale brightness-110 contrast-125 opacity-80"
          title="Satellite Module"
         ></iframe>
         <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5"></div>
         {/* HUD Overlay */}
         <div className="absolute top-3 left-3 flex flex-col gap-1">
            <div className="bg-[#bd34fe]/90 backdrop-blur shadow-sm text-white text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-tighter">
                SCAN_RADAR: ACTIVE
            </div>
            <div className="bg-white/10 backdrop-blur text-white text-[9px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                Z-INDEX: 16
            </div>
         </div>
         <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className="h-2 w-10 bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-[#41d1ff] w-3/4 animate-pulse"></div>
            </div>
            <span className="text-white text-[8px] font-black tracking-widest uppercase">Signal</span>
         </div>
      </div>

      {/* Data Modules */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Latitude</p>
            <p className="text-lg font-bold text-[#bd34fe] mono-font mt-1 leading-none">{data.latitude.toFixed(6)}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Longitude</p>
            <p className="text-lg font-bold text-[#41d1ff] mono-font mt-1 leading-none">{data.longitude.toFixed(6)}</p>
        </div>
      </div>

      {/* Address Module */}
      <div className="bg-[#1e232d] rounded-2xl p-5 border border-white/5 flex gap-4 items-start relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full vite-gradient"></div>
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <i className="fas fa-location-dot text-[#41d1ff]"></i>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Geocoded Address</p>
          <p className="text-xs font-bold text-slate-200 leading-relaxed italic">{data.address || 'Processing coordinates...'}</p>
        </div>
      </div>

      {/* Action Suite */}
      <div className="space-y-3 pt-2">
        <a 
          href={data.googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between group w-full bg-white text-black font-black py-4 px-6 rounded-2xl transition-all hover:bg-slate-200 shadow-xl"
        >
          <div className="flex items-center gap-3">
              <i className="fab fa-google text-lg"></i>
              <span className="text-sm tracking-tight">VIRTUAL VIEWPORT</span>
          </div>
          <i className="fas fa-arrow-right -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
        </a>

        {data.groundingUrls && data.groundingUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {data.groundingUrls.map((url, idx) => (
              <a 
                key={idx} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] text-slate-500 hover:text-white font-black bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-all border border-white/5 flex items-center gap-2"
              >
                <i className="fas fa-fingerprint text-[#bd34fe]"></i>
                REF_{idx + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDisplay;
