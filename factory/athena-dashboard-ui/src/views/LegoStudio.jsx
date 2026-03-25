import React, { useState, useEffect } from 'react';
import { Box, Plus, Save, Play, Trash2, Layout, Zap, ArrowRight, ChevronRight, X, CheckCircle, AlertCircle, Loader, Terminal, BookOpen } from 'lucide-react';
import { ApiService } from '../services/ApiService';

const LegoStudio = () => {
    const [library, setLibrary] = useState({ headers: [], footers: [], heros: [], sections: [] });
    const [siteTypes, setSiteTypes] = useState([]);
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [activeTab, setActiveTab] = useState('sections');
    const [showGenereer, setShowGenereer] = useState(false);
    const [siteName, setSiteName] = useState('');
    const [generating, setGenerating] = useState(false);
    const [genResult, setGenResult] = useState(null); // { success, message, siteName }

    useEffect(() => {
        ApiService.getLegoLibrary().then(setLibrary).catch(err => console.error("Library Error:", err));
        ApiService.getLegoSitetypes().then(setSiteTypes).catch(err => console.error("SiteTypes Error:", err));
    }, []);

    const applySiteType = (recipe) => {
        const blocks = [];
        if (recipe.layout.header) blocks.push({ id: 'header', type: 'headers', variant: recipe.layout.header });
        if (recipe.layout.hero) blocks.push({ id: 'hero', type: 'heros', variant: recipe.layout.hero });
        recipe.layout.sections.forEach((s, i) => {
            blocks.push({ id: `section_${i}`, type: 'sections', variant: s });
        });
        if (recipe.layout.footer) blocks.push({ id: 'footer', type: 'footers', variant: recipe.layout.footer });
        setSelectedBlocks(blocks);
    };

    const removeBlock = (id) => {
        setSelectedBlocks(selectedBlocks.filter(b => b.id !== id));
    };

    const addBlock = (type, variant) => {
        const id = `${type}_${Date.now()}`;
        setSelectedBlocks([...selectedBlocks, { id, type, variant: variant.id }]);
    };

    const generateSite = async () => {
        if (!siteName.trim() || selectedBlocks.length === 0) return;
        setGenerating(true);
        setGenResult(null);
        try {
            const data = await ApiService.generateLegoSite(siteName, selectedBlocks);
            setGenResult({ success: true, message: data.message, siteName: data.siteName });
        } catch (e) {
            setGenResult({ success: false, message: 'Fout bij genereren: ' + e.message });
        }
        setGenerating(false);
    };

    const hydrateAndStart = async () => {
        if (!genResult?.siteName) return;
        setGenerating(true);
        try {
            await ApiService.hydrateLegoSite(genResult.siteName);
            setGenResult({ ...genResult, hydrated: true, message: 'Installatie gestart. De site is over enkele ogenblikken online.' });
            // Start hem ook direct
            await ApiService.startLegoSite(genResult.siteName);
        } catch (e) {
            setGenResult({ ...genResult, success: false, message: 'Fout bij hydratatie: ' + e.message });
        }
        setGenerating(false);
    };

    return (
        <div className="p-12 max-w-7xl mx-auto">
            <header className="flex justify-between items-start mb-16">
                <div>
                    <h2 className="text-5xl font-black text-slate-100 tracking-tighter flex items-center gap-4">
                        <Box className="w-12 h-12 text-blue-500" />
                        Lego Studio
                    </h2>
                    <p className="text-xl text-slate-400 mt-2">Bouw je v9.0 site modulair en autonoom.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-slate-800 text-slate-100 px-8 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-all flex items-center gap-3">
                        <Save className="w-5 h-5" /> Recept Opslaan
                    </button>
                    <button
                        onClick={() => { setShowGenereer(true); setGenResult(null); }}
                        disabled={selectedBlocks.length === 0}
                        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-3 group disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Play className="w-5 h-5 group-hover:scale-110 transition-transform" /> Genereer Project
                    </button>
                </div>
            </header>

            {/* SiteType Galerie */}
            <section className="mb-16">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" /> Snelstart Recepten
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {siteTypes.map(recipe => (
                        <div 
                            key={recipe.id} 
                            onClick={() => applySiteType(recipe)}
                            className="bg-athena-panel p-8 rounded-[40px] border-2 border-athena-border hover:border-blue-500 transition-all cursor-pointer group shadow-sm hover:shadow-xl"
                        >
                            <h4 className="text-2xl font-black mb-2 text-white group-hover:text-blue-500 transition-colors">{recipe.name}</h4>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{recipe.description}</p>
                            <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                                Gebruik dit recept <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-12 gap-12">
                {/* De Bouwplaats */}
                <div className="col-span-8 space-y-6">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Layout className="w-4 h-4" /> De Bouwplaats
                    </h3>
                    <div className="bg-black/20 rounded-[50px] border-4 border-dashed border-athena-border p-8 min-h-[700px] space-y-4">
                        {selectedBlocks.length > 0 ? selectedBlocks.map((block, idx) => (
                            <div key={block.id} className="bg-athena-panel p-6 rounded-3xl shadow-sm border border-athena-border flex justify-between items-center group hover:border-blue-500 hover:shadow-lg transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-black/40 text-slate-500 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-colors">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white capitalize text-lg tracking-tight">{block.type.slice(0,-1)}: <span className="text-blue-500">{block.variant}</span></h4>
                                        <p className="text-sm text-slate-500 font-medium">Koppeling: <code className="bg-black/40 px-2 py-0.5 rounded text-blue-400 italic">src/data/{block.variant.toLowerCase()}.json</code></p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeBlock(block.id)}
                                    className="text-slate-600 hover:text-red-500 transition-colors p-3 hover:bg-red-500/10 rounded-2xl"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-[500px] text-center">
                                <Box className="w-20 h-20 text-athena-border mb-6" />
                                <p className="text-slate-500 font-bold text-xl">De bouwplaats is leeg.<br/>Kies een recept of voeg blokken toe.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-4 space-y-8">
                      <div className="bg-black/20 p-8 rounded-[40px] border border-blue-600/20 shadow-inner">
                        <h3 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Workflow Tips
                        </h3>
                        <ul className="space-y-4 text-xs font-medium text-slate-400">
                            <li className="flex gap-3">
                                <span className="text-blue-500 font-black">→</span>
                                <div><b className="text-slate-300">Layout Volgorde:</b> Begin met een Hero, voeg Sections toe, en eindig met een Footer.</div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-500 font-black">→</span>
                                <div><b className="text-slate-300">Data Sync:</b> Elk blok herkent zijn eigen data in <code className="text-blue-400">src/data/</code>.</div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-500 font-black">→</span>
                                <div><b className="text-slate-300">Hydrate:</b> Gebruik de Hydrate knop na genereren om dependencies in één keer te installeren.</div>
                            </li>
                        </ul>
                      </div>

                      <div className="sticky top-12 bg-athena-panel p-8 rounded-[40px] border border-athena-border shadow-xl">
                        <h3 className="font-black text-2xl mb-8 tracking-tight text-white">Lego Library</h3>
                        
                        <div className="flex gap-2 mb-8 bg-black/40 p-1 rounded-2xl">
                            {['headers', 'heros', 'sections', 'footers'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {tab.slice(0, 1)}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {library[activeTab]?.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => addBlock(activeTab, item)}
                                    className="w-full text-left p-4 rounded-2xl border border-athena-border bg-black/20 hover:border-blue-500 hover:bg-black/40 transition-all group flex justify-between items-center"
                                >
                                    <span className="font-bold text-slate-300 group-hover:text-blue-500 transition-colors">{item.name}</span>
                                    <Plus className="w-4 h-4 text-slate-600 group-hover:text-blue-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Genereer Modal ─────────────────────────────────────────── */}
            {showGenereer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !generating && setShowGenereer(false)} />
                    <div className="relative bg-athena-panel rounded-[40px] border border-athena-border w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-black text-white tracking-tighter">Genereer Site</h3>
                                <button onClick={() => setShowGenereer(false)} className="text-slate-500 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {!genResult ? (
                                <>
                                    {/* Overzicht geselecteerde blokken */}
                                    <div className="bg-black/40 rounded-2xl p-4 mb-6 space-y-2">
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Geselecteerde blokken</p>
                                        {selectedBlocks.map((b, i) => (
                                            <div key={b.id} className="flex items-center gap-3 text-sm">
                                                <span className="w-6 h-6 bg-blue-600/20 text-blue-500 rounded-lg flex items-center justify-center text-xs font-black">{i+1}</span>
                                                <span className="font-bold text-slate-300 capitalize">{b.type.slice(0,-1)}:</span>
                                                <span className="text-blue-500 font-bold font-mono">{b.variant}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Sitenaam</label>
                                        <input
                                            type="text"
                                            value={siteName}
                                            onChange={(e) => setSiteName(e.target.value)}
                                            placeholder="mijn-nieuwe-site"
                                            className="w-full bg-black/40 border-2 border-athena-border rounded-2xl py-4 px-5 font-bold text-white focus:outline-none focus:border-blue-600 transition-all"
                                            onKeyDown={(e) => e.key === 'Enter' && generateSite()}
                                            autoFocus
                                        />
                                        <p className="text-xs text-slate-500 mt-2 font-mono">→ sites/{siteName.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') || '...'}/</p>
                                    </div>

                                    <button
                                        onClick={generateSite}
                                        disabled={generating || !siteName.trim()}
                                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-40 flex items-center justify-center gap-3 shadow-lg shadow-blue-900/40"
                                    >
                                        {generating ? <><Loader className="w-5 h-5 animate-spin" /> Genereren...</> : <><Play className="w-5 h-5" /> Genereer Site</>}
                                    </button>
                                </>
                            ) : (
                                <div className={`text-center py-8 ${genResult.success ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {genResult.success
                                        ? <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                                        : <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                                    }
                                    <p className="font-black text-xl mb-4">{genResult.success ? '✅ Site aangemaakt!' : '❌ Fout'}</p>
                                    <p className="text-slate-400 text-sm mb-6">{genResult.message}</p>
                                    {genResult.success && !genResult.hydrated && (
                                        <div className="space-y-4 mb-6">
                                            <div className="bg-black/60 text-emerald-400 font-mono text-xs rounded-2xl p-4 text-left border border-athena-border">
                                                <p className="text-slate-500 text-[10px] mb-1"># Project Locatie:</p>
                                                <p>sites/{genResult.siteName}</p>
                                            </div>
                                            <button 
                                                onClick={hydrateAndStart}
                                                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/40"
                                            >
                                                <Terminal className="w-5 h-5" /> Hydrate & Start Dev
                                            </button>
                                        </div>
                                    )}
                                    {genResult.hydrated && (
                                        <div className="bg-emerald-600/10 border border-emerald-600/20 text-emerald-500 p-6 rounded-3xl mb-6 flex flex-col items-center gap-3">
                                            <Loader className="w-8 h-8 animate-spin" />
                                            <p className="font-bold">Bezig met installatie en opstarten...</p>
                                            <p className="text-xs opacity-70">Check de Servers view voor status.</p>
                                        </div>
                                    )}
                                    <button onClick={() => setShowGenereer(false)} className="bg-slate-800 text-slate-300 py-3 px-8 rounded-2xl font-bold hover:bg-slate-700 transition-all">
                                        Sluiten
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LegoStudio;
