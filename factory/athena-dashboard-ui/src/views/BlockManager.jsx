import React, { useState, useEffect } from 'react';
import { LayoutGrid, Search, Plus, Eye, Code2, Trash2, X, Save, ChevronDown, Monitor } from 'lucide-react';

// ─── Dummy Data per Categorie ─────────────────────────────────────────────
const DUMMY_DATA = {
    sections: [
        { titel: 'Preview Sectie', tekst: 'Dit is een automatische preview met dummy data. Pas de component aan en sla op om hier de echte versie te zien.', naam: 'Team', functie: 'Athena Factory' }
    ],
    headers: [
        { label: 'Home', anchor: '#' }, { label: 'Over', anchor: '#over' }, { label: 'Diensten', anchor: '#diensten' }, { label: 'Contact', anchor: '#contact' }
    ],
    heros: [
        { titel: 'Preview Hero', subtitel: 'Jouw hero sectie ziet er zo uit.', cta: 'Meer Weten' }
    ],
    footers: [
        { bedrijf: 'Athena v9.0', jaar: '2026' }
    ]
};

// ─── HTML Generator voor iframe Preview ──────────────────────────────────
const generatePreviewHTML = (code, category) => {
    // Extract component name from export default
    const match = code.match(/export default (\w+)/);
    const componentName = match ? match[1] : 'Component';
    // Remove import statements and export line (will use UMD builds)
    const stripped = code
        .replace(/import React.*?;\n?/g, '')
        .replace(/import \{[^}]+\}.*?;\n?/g, '')
        .replace(/export default \w+;?\n?/g, '');
    const dummyData = JSON.stringify(DUMMY_DATA[category] || [{ titel: 'Preview' }]);
    return `<!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>body{margin:0;padding:0;font-family:sans-serif;}</style>
</head><body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;
        ${stripped}
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(${componentName}, { data: ${dummyData} }));
    <\/script>
</body></html>`;
};

// ─── Code Templates per Categorie ───────────────────────────────────────────
const TEMPLATES = {
    sections: (id, name) => `import React from 'react';

function ${name.replace(/\s+/g, '')}({ data }) {
  const items = data || [
    { titel: '${name}', tekst: 'Beschrijving hier.' }
  ];

  return (
    <section id="${id}" className="py-24 px-8 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-16 text-center">
          {items[0]?.titel}
        </h2>
        <p className="text-xl text-slate-600 text-center max-w-3xl mx-auto">
          {items[0]?.tekst}
        </p>
      </div>
    </section>
  );
}

export default ${name.replace(/\s+/g, '')};
`,
    headers: (id, name) => `import React from 'react';

function ${name.replace(/\s+/g, '')}({ data }) {
  const menu = data || [
    { label: 'Home', anchor: '#' },
    { label: 'Over', anchor: '#over' },
    { label: 'Contact', anchor: '#contact' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-100 shadow-sm text-slate-900">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <div className="font-black text-xl text-slate-900 tracking-tighter">LOGO</div>
        <nav className="flex items-center gap-8">
          {menu.map((item, i) => (
            <a key={i} href={item.anchor} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default ${name.replace(/\s+/g, '')};
`,
    heros: (id, name) => `import React from 'react';

function ${name.replace(/\s+/g, '')}({ data }) {
  const info = data?.[0] || {
    titel: 'Jouw Titel Hier',
    subtitel: 'Jouw beschrijving hier.',
    cta: 'Meer Weten'
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-8">
      <div className="text-center max-w-4xl">
        <h1 className="text-7xl font-black tracking-tighter mb-8">{info.titel}</h1>
        <p className="text-2xl text-slate-400 mb-12">{info.subtitel}</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all">
          {info.cta}
        </button>
      </div>
    </section>
  );
}

export default ${name.replace(/\s+/g, '')};
`,
    footers: (id, name) => `import React from 'react';

function ${name.replace(/\s+/g, '')}({ data }) {
  return (
    <footer className="bg-slate-900 text-white py-12 px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="font-black text-xl tracking-tighter">ATHENA</div>
        <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Alle rechten voorbehouden.</p>
      </div>
    </footer>
  );
}

export default ${name.replace(/\s+/g, '')};
`
};

const BlockManager = () => {
    const [blocks, setBlocks] = useState({ headers: [], footers: [], heros: [], sections: [] });
    const [activeCategory, setActiveCategory] = useState('sections');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [preview, setPreview] = useState(null); // { name, code }
    const [loadingPreview, setLoadingPreview] = useState(false);

    const [newBlock, setNewBlock] = useState({
        category: 'sections',
        id: '',
        name: '',
        code: ''
    });

    const fetchBlocks = () => {
        fetch('/api/lego/library')
            .then(res => res.json())
            .then(data => setBlocks(data))
            .catch(err => console.error("Library Error:", err));
    };

    useEffect(() => { fetchBlocks(); }, []);

    const openModal = () => {
        const id = 'nieuw-blok';
        const naam = 'Nieuw Blok';
        setNewBlock({
            category: activeCategory,
            id,
            name: naam,
            code: TEMPLATES[activeCategory]?.(id, naam) || ''
        });
        setShowModal(true);
    };

    const updateField = (field, value) => {
        setNewBlock(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'name' || field === 'category') {
                const id = updated.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                updated.id = id || 'blok';
                updated.code = TEMPLATES[updated.category]?.(updated.id, updated.name) || '';
            }
            return updated;
        });
    };

    const saveBlock = async () => {
        if (!newBlock.name.trim() || !newBlock.code.trim()) return;
        setSaving(true);
        try {
            const res = await fetch('/api/lego/blocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBlock)
            });
            const data = await res.json();
            if (data.success) {
                setSaveMsg('✅ Blok opgeslagen!');
                fetchBlocks();
                setTimeout(() => { setShowModal(false); setSaveMsg(''); }, 1200);
            }
        } catch (e) {
            setSaveMsg('❌ Fout bij opslaan.');
        }
        setSaving(false);
    };

    const deleteBlock = async (category, id) => {
        if (!confirm(`Verwijder blok "${id}"?`)) return;
        await fetch(`/api/lego/blocks/${category}/${id}`, { method: 'DELETE' });
        fetchBlocks();
    };

    const openPreview = async (category, block) => {
        setLoadingPreview(true);
        setPreview({ name: block.name, category, code: '...' });
        try {
            const res = await fetch(`/api/lego/blocks/${category}/${block.id}`);
            const data = await res.json();
            setPreview({ name: block.name, category, id: block.id, code: data.code || 'Kon code niet laden.' });
        } catch {
            setPreview({ name: block.name, category, id: block.id, code: '// Fout: API niet bereikbaar.' });
        }
        setLoadingPreview(false);
    };

    const categories = [
        { id: 'headers', name: 'Headers' },
        { id: 'heros', name: 'Heros' },
        { id: 'sections', name: 'Sections' },
        { id: 'footers', name: 'Footers' }
    ];

    const filteredBlocks = blocks[activeCategory]?.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="p-12 max-w-7xl mx-auto">
            <header className="flex justify-between items-end mb-16">
                <div>
                    <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                        <LayoutGrid className="w-12 h-12 text-blue-500" />
                        Lego Library
                    </h2>
                    <p className="text-xl text-slate-400 mt-2">Bouw, beheer en gebruik modulaire blokken.</p>
                </div>
                <button
                    onClick={openModal}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 group"
                >
                    Nieuw Blok <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-athena-border">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat.id ? 'bg-athena-panel text-blue-500 shadow-sm border border-athena-border' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {cat.name}
                            <span className="ml-2 text-[10px] opacity-60">({blocks[cat.id]?.length || 0})</span>
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Zoek blokken..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-athena-panel border border-athena-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 text-white shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlocks.map(block => (
                    <div key={block.id} className="bg-athena-panel rounded-[40px] border border-athena-border overflow-hidden group hover:border-blue-500 hover:shadow-2xl transition-all flex flex-col">
                        <div className="aspect-video bg-gradient-to-br from-black/40 to-black/20 flex items-center justify-center border-b border-athena-border relative">
                            <span className="text-athena-border font-black text-5xl uppercase tracking-tighter opacity-30">{activeCategory.slice(0, -1)}</span>
                            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors"></div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-black text-white tracking-tight">{block.name}</h3>
                                <span className="text-[10px] font-black bg-blue-600/20 text-blue-500 px-2 py-1 rounded-lg uppercase tracking-widest">{block.id}</span>
                            </div>
                            <p className="text-slate-500 text-xs mb-6 font-mono truncate">{block.path}</p>
                            <div className="mt-auto flex gap-2">
                                <button
                                        onClick={() => openPreview(activeCategory, block)}
                                        className="flex-1 bg-black/40 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/10 hover:text-blue-500 transition-all flex items-center justify-center gap-2 border border-athena-border">
                                    <Eye className="w-4 h-4" /> Preview
                                </button>
                                <button
                                    onClick={() => deleteBlock(activeCategory, block.id)}
                                    className="bg-red-500/10 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBlocks.length === 0 && (
                <div className="text-center py-40 bg-black/20 rounded-[60px] border-4 border-dashed border-athena-border">
                    <LayoutGrid className="w-16 h-16 text-athena-border mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-lg uppercase tracking-widest">Geen blokken in {activeCategory}.</p>
                    <button onClick={openModal} className="mt-6 text-blue-500 font-black text-sm underline">
                        Maak je eerste blok →
                    </button>
                </div>
            )}

            {preview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPreview(null)} />
                    <div className="relative bg-athena-panel rounded-[40px] border border-athena-border w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-athena-border bg-black/60">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                </div>
                                <span className="text-slate-500 font-mono text-xs ml-3">{preview.id}.jsx</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPreview(p => ({ ...p, viewMode: 'visual' }))}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        (preview.viewMode || 'visual') === 'visual'
                                            ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
                                >
                                    <Monitor className="w-3.5 h-3.5" /> Visueel
                                </button>
                                <button
                                    onClick={() => setPreview(p => ({ ...p, viewMode: 'code' }))}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        preview.viewMode === 'code'
                                            ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                                >
                                    <Code2 className="w-3.5 h-3.5" /> Code
                                </button>
                                <button onClick={() => setPreview(null)} className="text-slate-500 hover:text-white transition-colors ml-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {(preview.viewMode || 'visual') === 'visual' && (
                            <div className="flex-1 bg-white overflow-hidden" style={{ minHeight: '500px' }}>
                                {loadingPreview ? (
                                    <div className="flex items-center justify-center h-full bg-athena-dark">
                                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <iframe
                                        srcDoc={generatePreviewHTML(preview.code, preview.category)}
                                        className="w-full h-full border-0"
                                        style={{ minHeight: '500px' }}
                                        sandbox="allow-scripts"
                                        title={`Preview: ${preview.name}`}
                                    />
                                )}
                            </div>
                        )}

                        {preview.viewMode === 'code' && (
                            <pre className="flex-1 overflow-y-auto bg-black text-emerald-400 font-mono text-sm p-8 leading-relaxed whitespace-pre-wrap" style={{ minHeight: '500px' }}>
                                <code>{preview.code}</code>
                            </pre>
                        )}
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-athena-panel rounded-[40px] border border-athena-border w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-8 border-b border-athena-border sticky top-0 bg-athena-panel z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                    <Code2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">Nieuw Blok Ontwerpen</h3>
                                    <p className="text-sm text-slate-500">Pas de template aan naar wens</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Categorie</label>
                                    <select
                                            value={newBlock.category}
                                            onChange={(e) => updateField('category', e.target.value)}
                                            className="w-full bg-black/40 border border-athena-border rounded-xl py-3 px-4 font-bold text-white focus:outline-none focus:border-blue-600 appearance-none"
                                        >
                                            {categories.map(c => <option key={c.id} value={c.id} className="bg-athena-panel">{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Bloknaam</label>
                                    <input
                                        type="text"
                                        value={newBlock.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="bijv. FAQ Sectie"
                                        className="w-full bg-black/40 border border-athena-border rounded-xl py-3 px-4 font-bold text-white focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                    <Code2 className="w-4 h-4" /> JSX Code
                                </label>
                                <textarea
                                    value={newBlock.code}
                                    onChange={(e) => setNewBlock(p => ({ ...p, code: e.target.value }))}
                                    className="w-full h-80 bg-black text-emerald-400 font-mono text-xs rounded-xl p-6 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed custom-scrollbar"
                                    spellCheck={false}
                                />
                            </div>

                            <div className="flex gap-4 items-center pt-2">
                                <button
                                    onClick={saveBlock}
                                    disabled={saving || !newBlock.name.trim()}
                                    className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {saving ? 'Opslaan...' : <><Save className="w-5 h-5" /> Blok Opslaan</>}
                                </button>
                                <button onClick={() => setShowModal(false)} className="px-8 py-4 rounded-xl font-bold text-slate-500 hover:bg-white/5 transition-all">
                                    Annuleer
                                </button>
                            </div>
                            {saveMsg && <div className="text-center font-bold text-blue-500">{saveMsg}</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlockManager;
