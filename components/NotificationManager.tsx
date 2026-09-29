
import React, { useEffect, useState } from 'react';
import { useApp } from '../store/AppContext';
import { Transaction } from '../types';
import { BellRing, X, Info } from 'lucide-react';

const NotificationManager: React.FC = () => {
  const { transactions, patients } = useApp();
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (permission === 'default') {
      setShowBanner(true);
    }
  }, [permission]);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    setShowBanner(false);
  };

  useEffect(() => {
    if (permission !== 'granted') return;

    const notifiedIds = JSON.parse(localStorage.getItem('notified_transactions') || '[]');
    const newNotifiedIds = [...notifiedIds];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    transactions.forEach((t) => {
      if (notifiedIds.includes(t.id)) return;

      const transDate = new Date(t.date);
      transDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((transDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let title = '';
      let body = '';
      let shouldNotify = false;

      const patient = patients.find(p => p.id === t.patientId);
      const name = patient?.fullName || 'Externo';

      // Alerta para contas a receber atrasadas (Atrasadas)
      if (t.type === 'RECEBER' && diffDays < 0) {
        title = '⚠️ Cobrança Atrasada!';
        body = `O pagamento de ${name} no valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.value)} está vencido.`;
        shouldNotify = true;
      }
      
      // Alerta para contas a pagar próximas (Vencimento em 1 ou 2 dias)
      if (t.type === 'PAGAR' && diffDays >= 0 && diffDays <= 2) {
        title = '📅 Próximo Vencimento';
        body = `Você tem uma conta de ${t.description} (${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.value)}) vencendo em ${diffDays === 0 ? 'hoje' : diffDays + ' dias'}.`;
        shouldNotify = true;
      }

      if (shouldNotify) {
        new Notification(title, {
          body,
          icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' // Ícone genérico de sino
        });
        newNotifiedIds.push(t.id);
      }
    });

    if (newNotifiedIds.length !== notifiedIds.length) {
      localStorage.setItem('notified_transactions', JSON.stringify(newNotifiedIds));
    }
  }, [transactions, permission, patients]);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 p-5 max-w-sm flex gap-4 items-start ring-4 ring-indigo-500/10">
        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
          <BellRing size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 text-sm mb-1">Ativar Notificações?</h4>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Deseja receber alertas automáticos de contas atrasadas e vencimentos próximos diretamente no seu computador?
          </p>
          <div className="flex gap-2">
            <button 
              onClick={requestPermission}
              className="flex-1 bg-indigo-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ativar Agora
            </button>
            <button 
              onClick={() => setShowBanner(false)}
              className="px-3 bg-slate-100 text-slate-500 text-[10px] font-bold py-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Depois
            </button>
          </div>
        </div>
        <button onClick={() => setShowBanner(false)} className="text-slate-300 hover:text-slate-500">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationManager;
