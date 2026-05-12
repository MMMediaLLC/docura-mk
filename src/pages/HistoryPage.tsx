import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  FileText,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { firebaseService } from '../services/firebaseService';

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setIsLoading(true);
      const analyses = await firebaseService.listAnalyses(user.uid);
      setDocuments(analyses);
    } catch (err) {
      console.error("Failed to fetch history", err);
      setError("Неуспешно вчитување на историјата. Ве молиме обидете се повторно.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Дали сте сигурни дека сакате да ја избришете оваа анализа?')) return;
    
    try {
      await firebaseService.deleteAnalysis(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      console.error("Failed to delete analysis", err);
      alert("Неуспешно бришење на анализата");
    }
  };

  const filteredDocs = documents.filter(doc => 
    (doc.documentName || doc.fileName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 font-sans selection:bg-brand-100 selection:text-brand-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">Историја на документи</h1>
          <p className="text-slate-500 font-medium mt-2 leading-relaxed">Управувајте и прегледувајте ги вашите претходно анализирани извештаи.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
          <input
            type="text"
            placeholder="Пребарај документи..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/80 backdrop-blur-md border border-white/60 pl-11 pr-5 py-3 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm w-64 text-slate-800"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel border-white/60 p-1 sm:p-2 min-h-[400px] relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-400/20 blur-xl rounded-full animate-pulse" />
              <div className="w-16 h-16 bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/10 relative z-10">
                <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
              </div>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Вчитување на историјата...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
               <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <p className="text-slate-700 font-bold">{error}</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-200/50 mb-4 shadow-inner">
               <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Не се пронајдени документи</p>
            <p className="text-slate-400 text-sm font-medium">Прикачете документ од почетната страница за да го видите тука.</p>
          </div>
        ) : (
          <div className="space-y-4 p-4 lg:p-8">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5 transition-all group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors border border-slate-100 shrink-0">
                      <FileText className="w-5 h-5 text-slate-400 group-hover:text-brand-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors text-lg truncate">
                        {doc.documentName || doc.fileName || 'Неименуван документ'}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                        {new Date(doc.createdAt || doc.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {doc.summary && (
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mt-3 md:ml-13">
                      {doc.summary}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 mt-4 md:ml-13">
                    <div className="px-3 py-1.5 bg-rose-50 border border-rose-100/50 text-rose-700 rounded-lg text-xs font-bold leading-none flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                       {doc.risks?.length || 0} Ризици
                    </div>
                    <div className="px-3 py-1.5 bg-amber-50 border border-amber-100/50 text-amber-700 rounded-lg text-xs font-bold leading-none flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                       {doc.obligations?.length || 0} Обврски
                    </div>
                    <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100/50 text-indigo-700 rounded-lg text-xs font-bold leading-none flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                       {doc.deadlines?.length || 0} Рокови
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:pl-6 md:border-l border-slate-100 shrink-0 mt-2 md:mt-0">
                  <Link 
                    to={`/analysis/${doc.id}`}
                    className="flex-1 md:flex-none btn-primary py-2.5 px-6 rounded-xl text-sm justify-center shadow-sm"
                  >
                    Отвори извештај
                  </Link>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="p-2.5 bg-white hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all border border-slate-200 hover:border-rose-200 shadow-sm shrink-0" 
                    title="Избриши"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-8 py-6 border-t border-slate-200/40 bg-white/20 rounded-b-[2.5rem]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Прикажани {filteredDocs.length} од {documents.length} документи
          </p>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-400/5 blur-[120px] rounded-full -mr-[250px] -mt-[250px] pointer-events-none" />

    </div>
  );
}
