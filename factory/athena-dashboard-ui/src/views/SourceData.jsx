import React from 'react';
import { Database, Table, ExternalLink, RefreshCw } from 'lucide-react';

const SourceData = () => {
    return (
        <div className="p-12 max-w-7xl mx-auto">
             <header className="mb-16 flex justify-between items-end">
                <div>
                    <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                        <Database className="w-12 h-12 text-blue-500" />
                        Bron Data
                    </h2>
                    <p className="text-xl text-slate-400 mt-2">De 1-op-1 datakoppeling via Google Sheets.</p>
                </div>
                <button className="bg-athena-panel text-white border border-athena-border px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-black/50 transition-all">
                    Data Syncen <RefreshCw className="w-5 h-5 text-blue-500" />
                </button>
            </header>

            <div className="bg-athena-panel rounded-[40px] border border-athena-border overflow-hidden shadow-sm">
                <div className="p-8 border-b border-athena-border bg-black/20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                            <Table className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-white">Athena v9 Master Sheet</p>
                            <p className="text-xs text-slate-500 font-mono">ID: 15uExv... (Goud-Standaard)</p>
                        </div>
                    </div>
                    <a href="https://docs.google.com/spreadsheets/d/15uExvUqA936k6G6XlFqUo6jR1Zc7-06R_9F_Z-Z9Z9Z" target="_blank" className="text-blue-500 font-bold flex items-center gap-2 hover:text-blue-400">
                        Open in Sheets <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                <div className="p-8">
                    <h3 className="text-lg font-bold mb-6 text-slate-200">Actieve Koppelingen (1-op-1)</h3>
                    <div className="space-y-4">
                        {[
                            { tab: '_metadata', type: 'Systeem', status: 'Gekoppeld' },
                            { tab: 'header', type: 'Lego Blok', status: 'Gekoppeld' },
                            { tab: 'hero', type: 'Lego Blok', status: 'Gekoppeld' },
                            { tab: 'features', type: 'Lego Blok', status: 'Gekoppeld' }
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-5 bg-black/10 rounded-2xl border border-athena-border/50">
                                <div className="flex gap-4 items-center">
                                    <span className="font-mono text-blue-400 font-bold">{item.tab}</span>
                                    <span className="text-[10px] px-3 py-1 bg-athena-panel border border-athena-border rounded-full text-slate-400 font-black uppercase tracking-widest">{item.type}</span>
                                </div>
                                <span className="text-emerald-500 font-bold text-sm italic">{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SourceData;
