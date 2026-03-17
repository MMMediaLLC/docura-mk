import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  MoreVertical, 
  Download, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
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
      setError("Failed to load history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;
    
    try {
      await firebaseService.deleteAnalysis(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      console.error("Failed to delete analysis", err);
      alert("Failed to delete analysis");
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 font-sans selection:bg-brand-100 selection:text-brand-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">Document History</h1>
          <p className="text-slate-500 font-medium mt-2 leading-relaxed">Manage and review your previously analyzed intelligence reports.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/80 backdrop-blur-md border border-white/60 pl-11 pr-5 py-3 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm w-64 text-slate-800"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl text-sm font-bold text-slate-700 hover:bg-white transition-all shadow-sm active:scale-95">
            <Filter className="w-4 h-4" />
            Filter
          </button>
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
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading history...</p>
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
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No documents found</p>
            <p className="text-slate-400 text-sm font-medium">Upload a document from the dashboard to see it here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Document Name</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Type</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Size</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-all duration-300 border border-slate-100 group-hover:border-brand-200 shadow-sm">
                          <FileText className="w-5 h-5 text-slate-400 group-hover:text-brand-600" />
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors text-base">{doc.fileName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3.5 py-1.5 bg-slate-100/80 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200/50 mix-blend-multiply">
                        {doc.documentType || 'Document'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/analysis/${doc.id}`}
                          className="p-2.5 bg-white hover:bg-brand-50 rounded-xl text-slate-500 hover:text-brand-600 transition-all border border-slate-200 hover:border-brand-200 shadow-sm"
                          title="View Analysis"
                        >
                          <ExternalLink className="w-4.5 h-4.5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-2.5 bg-white hover:bg-rose-50 rounded-xl text-slate-500 hover:text-rose-600 transition-all border border-slate-200 hover:border-rose-200 shadow-sm" 
                          title="Delete"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-slate-200/40 flex items-center justify-between bg-white/20 rounded-b-[2.5rem]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Showing {filteredDocs.length} of {documents.length} documents
          </p>
          <div className="flex items-center gap-3">
            <button disabled className="p-2 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm disabled:opacity-30 shadow-sm hover:bg-white transition-all">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button disabled className="p-2 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm disabled:opacity-30 shadow-sm hover:bg-white transition-all">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-400/5 blur-[120px] rounded-full -mr-[250px] -mt-[250px] pointer-events-none" />

    </div>
  );
}
