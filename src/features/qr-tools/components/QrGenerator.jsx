import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link as LinkIcon, Wifi, Mail, Download, Settings2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { downloadQrCode, buildWifiString } from '../utils/qrUtils';

const TYPES = [
  { id: 'text', label: 'URL / Text', icon: LinkIcon },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'email', label: 'Email', icon: Mail },
];

const MAX_CHARS = 2000;

export default function QrGenerator() {
  const [type, setType] = useState('text');
  const [value, setValue] = useState('https://SuperApp.vercel.app/');
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [colors, setColors] = useState({ fg: '#000000', bg: '#ffffff' });

  const [wifi, setWifi] = useState({ ssid: '', pass: '', enc: 'WPA', hidden: false });
  const [showPass, setShowPass] = useState(false);

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  // wifi builder
  useEffect(() => {
    if (type === 'wifi') {
      const wifiString = buildWifiString({
        ssid: wifi.ssid,
        password: wifi.pass,
        encryption: wifi.enc,
        hidden: wifi.hidden
      });

      if (wifiString) setValue(wifiString);
    }
  }, [wifi, type]);

  // email format
  useEffect(() => {
    if (type === 'email' && value && !value.startsWith('mailto:')) {
      setValue(`mailto:${value}`);
    }
  }, [type]);

  const isTooLong = debouncedValue.length > MAX_CHARS;

  return (
    <div className="flex flex-col lg:flex-row lg:h-full w-full animate-fade-in relative lg:overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
       
       {/* === LEFT SIDE: CONTROLS === */}
       <div className="w-full lg:w-[400px] h-auto lg:h-full border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 relative z-10 rounded-2xl">
          
          <div className="p-6 lg:overflow-y-auto custom-scrollbar flex-1 space-y-8">
              
              {/* Type Selector */}
              <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">QR Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TYPES.map(t => (
                        <button
                        key={t.id}
                        onClick={() => setType(t.id)}
                        className={`py-3 rounded-xl text-xs font-bold flex flex-col items-center gap-2 transition-all border
                        ${type === t.id 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                            : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400'}`}
                        >
                        <t.icon size={18}/> {t.label}
                        </button>
                    ))}
                  </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <label className="text-xs font-bold text-slate-400 uppercase">Content</label>
                     <span className={`text-[10px] font-bold ${value.length > MAX_CHARS ? 'text-red-500' : 'text-slate-400'}`}>
                        {value.length} / {MAX_CHARS}
                     </span>
                  </div>
                  
                  {type === 'text' && (
                      <textarea 
                        value={value} 
                        onChange={(e) => setValue(e.target.value)}
                        className={`w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border outline-none text-sm resize-none transition-colors h-32 leading-relaxed custom-scrollbar
                        ${value.length > MAX_CHARS 
                            ? 'border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/10' 
                            : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'}`}
                        placeholder="Enter website URL or text..."
                      />
                  )}

                  {type === 'wifi' && (
                      <div className="space-y-4">
                        <input 
                            value={wifi.ssid} onChange={(e) => setWifi({...wifi, ssid: e.target.value})}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-sm focus:border-blue-500 transition-colors"
                            placeholder="Network Name (SSID)"
                        />
                        <div className="relative">
                            <input 
                            type={showPass ? "text" : "password"} 
                            value={wifi.pass} onChange={(e) => setWifi({...wifi, pass: e.target.value})}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-sm focus:border-blue-500 transition-colors pr-10"
                            placeholder="Password"
                            />
                            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-blue-500">
                                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <select 
                                value={wifi.enc} onChange={(e) => setWifi({...wifi, enc: e.target.value})}
                                className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-sm cursor-pointer"
                            >
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">None</option>
                            </select>
                            <label className="flex items-center gap-2 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <input type="checkbox" checked={wifi.hidden} onChange={(e) => setWifi({...wifi, hidden: e.target.checked})} className="accent-blue-600 w-4 h-4 rounded"/>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">Hidden</span>
                            </label>
                        </div>
                      </div>
                  )}
                  
                  {type === 'email' && (
                      <textarea 
                        value={value} 
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-sm resize-none focus:border-blue-500 transition-colors h-32"
                        placeholder="Enter email address..."
                      />
                  )}
              </div>

              {/* Color & Style  */}
              <div>
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase">
                      <Settings2 size={14}/> Appearance
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex flex-col items-center gap-1">
                            <input type="color" value={colors.fg} onChange={(e) => setColors({...colors, fg: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"/>
                            <span className="text-[10px] text-slate-400 font-mono">Fore</span>
                        </div>
                        <span className="text-slate-300">➜</span>
                        <div className="flex flex-col items-center gap-1">
                            <input type="color" value={colors.bg} onChange={(e) => setColors({...colors, bg: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200 shadow-sm hover:scale-110 transition-transform"/>
                            <span className="text-[10px] text-slate-400 font-mono">Back</span>
                        </div>
                  </div>
              </div>

          </div>
       </div>

       {/* === RIGHT SIDE: PREVIEW === */}
       <div className="w-full lg:flex-1 bg-slate-100 dark:bg-slate-950/50 flex flex-col items-center justify-center p-8 relative overflow-hidden min-h-[500px] lg:min-h-0">
          
          {/* Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
                backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                backgroundPosition: 'center center'
            }}
          >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#f1f5f9_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
              <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800 mb-8 transition-transform hover:scale-105 duration-300">
                {!isTooLong ? (
                    <QRCodeSVG 
                        id="qr-code-svg"
                        value={debouncedValue} 
                        size={280}
                        fgColor={colors.fg}
                        bgColor={colors.bg}
                        level={debouncedValue.length > 500 ? "L" : "Q"} 
                        includeMargin={true}
                    />
                ) : (
                    <div className="w-[280px] h-[280px] flex flex-col items-center justify-center bg-red-50 rounded-xl text-center p-4">
                        <AlertTriangle size={40} className="text-red-500 mb-2"/>
                        <p className="text-red-600 font-bold text-sm">Content Too Long</p>
                        <p className="text-red-400 text-xs mt-1">Please reduce text to generate QR.</p>
                    </div>
                )}
              </div>
              
              <div className="flex gap-4 w-full">
                <button onClick={() => downloadQrCode('png')} disabled={isTooLong} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Download size={18}/> PNG
                </button>
                <button onClick={() => downloadQrCode('svg')} disabled={isTooLong} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Download size={18}/> SVG
                </button>
              </div>
              
              <p className="text-xs text-slate-400 mt-6 text-center leading-relaxed">
                  {isTooLong 
                    ? <span className="text-red-400 font-bold">Character limit exceeded ({value.length}/{MAX_CHARS})</span> 
                    : (type === 'wifi' ? 'Scan to join Wi-Fi instantly.' : 'Generates high-quality QR codes for print.')}
              </p>
          </div>
       </div>

    </div>
  );
}