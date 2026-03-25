import React from 'react';
import { BookOpen, Zap, Rocket, Layers, Shield, Cpu, Code2, ArrowRight, ExternalLink } from 'lucide-react';

const HomeView = () => {
    return (
        <div className="p-12 max-w-7xl mx-auto space-y-16">
            <header className="space-y-4">
                <h1 className="text-6xl font-black text-white tracking-tighter">
                    Athena <span className="text-blue-500">Command Center</span>
                </h1>
                <p className="text-2xl text-slate-400 font-medium max-w-3xl">
                    Welkom bij de gecombineerde Athena v8.7 & v9.0 Factory. Jouw centrale hub voor autonome site-productie.
                </p>
            </header>

            {/* SOP Sectie */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-athena-panel rounded-[50px] border border-athena-border p-10 space-y-8 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">SOP: v8.7 Workflow</h2>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <span className="w-8 h-8 bg-black/40 text-blue-500 rounded-full flex items-center justify-center font-black flex-shrink-0">1</span>
                            <div>
                                <p className="font-bold text-white text-lg">Discovery & Interview</p>
                                <p className="text-slate-400 text-sm">Gebruik de "Marketing" tool om een klantprofiel en discovery.json te genereren.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="w-8 h-8 bg-black/40 text-blue-500 rounded-full flex items-center justify-center font-black flex-shrink-0">2</span>
                            <div>
                                <p className="font-bold text-white text-lg">Site Creatie</p>
                                <p className="text-slate-400 text-sm">Kies een SiteType en laat de engine de mappenstructuur en boilerplate opzetten.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="w-8 h-8 bg-black/40 text-blue-500 rounded-full flex items-center justify-center font-black flex-shrink-0">3</span>
                            <div>
                                <p className="font-bold text-white text-lg">Data Koppeling</p>
                                <p className="text-slate-400 text-sm">Link een Google Sheet via de site-kaart. Gebruik "Auto-Provision" voor snelle setup.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="w-8 h-8 bg-black/40 text-blue-500 rounded-full flex items-center justify-center font-black flex-shrink-0">4</span>
                            <div>
                                <p className="font-bold text-white text-lg">Live Review & Deploy</p>
                                <p className="text-slate-400 text-sm">Preview je site met live data en druk op "Deploy" om naar GitHub/Server te pushen.</p>
                            </div>
                        </div>
                    </div>
                    
                    <button className="w-full bg-slate-800 text-slate-300 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                        Lees Draft v8.7 Specs <ExternalLink className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-athena-panel rounded-[50px] border border-blue-600/30 p-10 space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[100px] rounded-full"></div>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">SOP: v9.0 Lego Workflow</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <span className="w-8 h-8 bg-black/40 text-emerald-500 rounded-full flex items-center justify-center font-black flex-shrink-0">1</span>
                            <div>
                                <p className="font-bold text-white text-lg">Lego Studio Design</p>
                                <p className="text-slate-400 text-sm">Combineer Heros, Sections en Footers in de Studio bouwplaats.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="w-8 h-8 bg-black/40 text-emerald-500 rounded-full flex items-center justify-center font-black flex-shrink-0">2</span>
                            <div>
                                <p className="font-bold text-white text-lg">Lego Site Genereren</p>
                                <p className="text-slate-400 text-sm">Druk op "Genereer Project". De engine maakt een autonome Vite-site met 1-op-1 componenten.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="w-8 h-8 bg-black/40 text-emerald-500 rounded-full flex items-center justify-center font-black flex-shrink-0">3</span>
                            <div>
                                <p className="font-bold text-white text-lg">Custom Blokken</p>
                                <p className="text-slate-400 text-sm">Voeg nieuwe blokken toe via de "Library" editor om je herbruikbare collectie uit te breiden.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="w-8 h-8 bg-black/40 text-emerald-500 rounded-full flex items-center justify-center font-black flex-shrink-0">4</span>
                            <div>
                                <p className="font-bold text-white text-lg">1-op-1 Data Sync</p>
                                <p className="text-slate-400 text-sm">Elk lego-blok is direct gekoppeld aan de "Source Data" in je Master Sheet.</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 py-4 rounded-2xl font-bold hover:bg-emerald-600/20 transition-all flex items-center justify-center gap-2">
                        Open Lego Studio <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* Developer Toolkit */}
            <section className="space-y-8">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Code2 className="w-5 h-5" /> Developer Toolkit & Best Practices
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-black/20 p-8 rounded-[40px] border border-athena-border hover:bg-black/40 transition-all group">
                        <Layers className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="text-xl font-bold text-white mb-2">Opslagbeheer</h4>
                        <p className="text-slate-500 text-sm">Gebruik "Dehydrate" voor inactieve projecten om schijfruimte te besparen op je Chromebook.</p>
                    </div>
                    <div className="bg-black/20 p-8 rounded-[40px] border border-athena-border hover:bg-black/40 transition-all group">
                        <Cpu className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="text-xl font-bold text-white mb-2">Port Management</h4>
                        <p className="text-slate-500 text-sm">De Port-Manager wijst automatisch vrije poorten toe in de 6100+ range voor Lego projecten.</p>
                    </div>
                    <div className="bg-black/20 p-8 rounded-[40px] border border-athena-border hover:bg-black/40 transition-all group">
                        <Shield className="w-10 h-10 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="text-xl font-bold text-white mb-2">Security & Secrets</h4>
                        <p className="text-slate-500 text-sm">API-keys staan veilig in ENV/Vault. Gebruik de Secrets tool voor synchronisatie.</p>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <footer className="pt-8 border-t border-athena-border flex justify-between items-center text-slate-500">
                <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
                    <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">GitHub</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">Support</a>
                </div>
                <div className="text-xs font-mono bg-black/40 py-2 px-4 rounded-full border border-athena-border">
                    Athena Project v10.0 (Unified) | IP: localhost
                </div>
            </footer>
        </div>
    );
};

export default HomeView;
