
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { FileDown, Filter, Calendar, BarChart3, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const Reports: React.FC = () => {
  const { transactions } = useApp();
  const [filterType, setFilterType] = useState('ANUAL');

  const exportCSV = () => {
    const headers = "Data,Descricao,Tipo,Valor,Metodo\n";
    const rows = transactions.map(t => `${t.date},${t.description},${t.type},${t.value},${t.method}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio_financeiro.csv';
    a.click();
  };

  const exportPDF = () => {
    alert("Exportando PDF consolidado de " + filterType + "...");
  };

  const monthlyTotals = transactions.reduce((acc: any, t) => {
    const month = new Date(t.date).toLocaleString('pt-BR', { month: 'short' });
    if (!acc[month]) acc[month] = 0;
    acc[month] += t.type === 'PAGAR' ? -t.value : t.value;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterType('MENSAL')}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${filterType === 'MENSAL' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
          >
            Mensal
          </button>
          <button 
            onClick={() => setFilterType('ANUAL')}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${filterType === 'ANUAL' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
          >
            Anual
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportCSV}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center font-bold hover:bg-slate-200"
          >
            <Download size={18} className="mr-2" /> CSV
          </button>
          <button 
            onClick={exportPDF}
            className="flex-1 sm:flex-none px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold hover:bg-indigo-100"
          >
            <FileDown size={18} className="mr-2" /> PDF
          </button>
        </div>
      </div>

      {/* Fluxo de Caixa Simulado */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center">
          <BarChart3 className="mr-2 text-indigo-600" /> Fluxo de Caixa Detalhado
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 items-end h-48 mb-6">
          {Object.keys(monthlyTotals).map((month, i) => {
            const val = monthlyTotals[month];
            const height = Math.min(Math.abs(val) / 10, 100);
            return (
              <div key={i} className="flex flex-col items-center group relative">
                <div 
                  className={`w-full rounded-t-sm transition-all ${val >= 0 ? 'bg-indigo-500' : 'bg-rose-500'}`}
                  style={{ height: `${height}%` }}
                >
                  <div className="hidden group-hover:block absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded">
                    {formatCurrency(val)}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 uppercase font-bold">{month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold">Relatório Consolidado</h3>
          <Filter size={20} className="text-slate-400" />
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
              <span className="text-slate-500">Total de Entradas</span>
              <span className="font-bold text-emerald-600">{formatCurrency(transactions.filter(t => t.type !== 'PAGAR').reduce((a,b) => a + b.value, 0))}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
              <span className="text-slate-500">Total de Saídas</span>
              <span className="font-bold text-rose-600">{formatCurrency(transactions.filter(t => t.type === 'PAGAR').reduce((a,b) => a + b.value, 0))}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-lg">Saldo Líquido</span>
              <span className={`font-bold text-lg ${transactions.reduce((a,b) => a + (b.type === 'PAGAR' ? -b.value : b.value), 0) >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                {formatCurrency(transactions.reduce((a,b) => a + (b.type === 'PAGAR' ? -b.value : b.value), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
