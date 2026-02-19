import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, PieChart, Percent, Clock } from 'lucide-react';

export default function FinanceApp() {
  const [mode, setMode] = useState('loan'); 
  
  // Loan State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5); 
  const [tenure, setTenure] = useState(5); 

  // SIP State
  const [monthlyInv, setMonthlyInv] = useState(5000);
  const [returnRate, setReturnRate] = useState(12); 
  const [timePeriod, setTimePeriod] = useState(10); 

  const [result, setResult] = useState(null);

  useEffect(() => {
    if (mode === 'loan') calculateLoan();
    else calculateSIP();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, loanAmount, interestRate, tenure, monthlyInv, returnRate, timePeriod]);

  const calculateLoan = () => {
    const P = loanAmount;
    const R = interestRate / 12 / 100;
    const N = tenure * 12;
    
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayable = emi * N;
    const totalInterest = totalPayable - P;

    setResult({
      primary: Math.round(emi),
      total: Math.round(totalPayable),
      breakdown: Math.round(totalInterest),
      labelPrimary: 'Monthly EMI',
      labelTotal: 'Total Payable',
      labelBreakdown: 'Total Interest',
      chartData: [P, totalInterest] 
    });
  };

  const calculateSIP = () => {
    const P = monthlyInv;
    const i = returnRate / 12 / 100;
    const n = timePeriod * 12;

    const fv = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = P * n;
    const returns = fv - invested;

    setResult({
      primary: Math.round(fv),
      total: Math.round(invested),
      breakdown: Math.round(returns),
      labelPrimary: 'Maturity Value',
      labelTotal: 'Invested Amount',
      labelBreakdown: 'Total Returns',
      chartData: [invested, returns] 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row animate-fade-in">
      
      {/* INPUTS */}
      <div className="w-full md:w-1/2 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
         <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setMode('loan')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2
              ${mode === 'loan' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
            >
               <DollarSign size={16}/> Loan EMI
            </button>
            <button 
              onClick={() => setMode('sip')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2
              ${mode === 'sip' ? 'bg-white dark:bg-slate-700 shadow-sm text-green-600 dark:text-green-400' : 'text-slate-500'}`}
            >
               <TrendingUp size={16}/> SIP Investment
            </button>
         </div>

         <div className="space-y-6">
            {mode === 'loan' ? (
                <>
                   <InputGroup label="Loan Amount" icon="₹" value={loanAmount} onChange={setLoanAmount} min={1000} step={5000} />
                   <InputGroup label="Interest Rate (%)" icon={<Percent size={14}/>} value={interestRate} onChange={setInterestRate} min={1} max={30} step={0.1} />
                   <InputGroup label="Tenure (Years)" icon={<Clock size={14}/>} value={tenure} onChange={setTenure} min={1} max={30} />
                </>
            ) : (
                <>
                   <InputGroup label="Monthly Investment" icon="₹" value={monthlyInv} onChange={setMonthlyInv} min={500} step={500} />
                   <InputGroup label="Expected Return (%)" icon={<Percent size={14}/>} value={returnRate} onChange={setReturnRate} min={1} max={30} step={0.1} />
                   <InputGroup label="Time Period (Years)" icon={<Clock size={14}/>} value={timePeriod} onChange={setTimePeriod} min={1} max={40} />
                </>
            )}
         </div>
      </div>

      {/* RESULTS */}
      <div className="w-full md:w-1/2 p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
         
         <div className="text-center mb-8">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{result?.labelPrimary}</p>
            <h2 className={`text-4xl font-black ${mode === 'loan' ? 'text-blue-600' : 'text-green-500'}`}>
               ₹{result?.primary.toLocaleString()}
            </h2>
         </div>

         <div className="relative w-48 h-48 mb-8">
            {result && (
                <SimplePieChart 
                   data={result.chartData} 
                   colors={mode === 'loan' ? ['#3b82f6', '#93c5fd'] : ['#22c55e', '#86efac']} 
                />
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <PieChart size={32} className="text-slate-300 dark:text-slate-700 opacity-50"/>
            </div>
         </div>

         <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <p className="text-xs text-slate-500 mb-1">{result?.labelTotal}</p>
               <p className="text-lg font-bold text-slate-800 dark:text-white">₹{result?.total.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <p className="text-xs text-slate-500 mb-1">{result?.labelBreakdown}</p>
               <p className={`text-lg font-bold ${mode === 'loan' ? 'text-red-500' : 'text-green-500'}`}>
                  ₹{result?.breakdown.toLocaleString()}
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}

function InputGroup({ label, icon, value, onChange, min, max, step = 1 }) {
    return (
        <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">{label}</label>
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 transition-colors">
                <span className="text-slate-400 font-bold">{icon}</span>
                <input 
                  type="number" 
                  value={value} 
                  onChange={(e) => onChange(Number(e.target.value))}
                  className="w-full bg-transparent outline-none font-bold text-slate-700 dark:text-white"
                  min={min} max={max} step={step}
                />
            </div>
            <input 
              type="range" min={min} max={max || 1000000} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
              className="w-full mt-3 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
        </div>
    );
}

function SimplePieChart({ data, colors }) {
    if (!data || data.length < 2) return <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800"></div>;
    const total = data[0] + data[1];
    if (total === 0) return <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800"></div>;
    const deg = (data[0] / total) * 360;
    return (
        <div 
          className="w-full h-full rounded-full shadow-inner"
          style={{ background: `conic-gradient(${colors[0]} 0deg ${deg}deg, ${colors[1]} ${deg}deg 360deg)` }}
        >
           <div className="absolute inset-4 bg-slate-50 dark:bg-slate-950 rounded-full"></div>
        </div>
    );
}