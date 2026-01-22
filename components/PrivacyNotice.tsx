
import React from 'react';

const PrivacyNotice: React.FC = () => {
  return (
    <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-shield-check text-blue-400 text-sm"></i>
        </div>
        <div>
          <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Security Middleware</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            Location access is requested on-demand. Assets are transmitted via encrypted socket hooks directly to your Telegram endpoint. No persistent logs are generated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
