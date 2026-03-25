import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, ExternalLink } from 'lucide-react';

const ImagesView = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/images')
            .then(res => res.json())
            .then(data => {
                setImages(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Error:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                        <ImageIcon className="w-10 h-10 text-blue-500" />
                        Images Manager
                    </h2>
                    <p className="text-slate-400 mt-2">Beheer je digitale assets voor alle Lego projecten.</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Uploaden
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.length > 0 ? images.map(img => (
                        <div key={img.name} className="group bg-athena-panel rounded-3xl border border-athena-border overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500 transition-all">
                            <div className="aspect-square bg-black/40 relative overflow-hidden">
                                <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <button className="p-2 bg-white rounded-lg text-slate-900 hover:bg-blue-500 hover:text-white transition-all shadow-lg">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-white rounded-lg text-slate-900 hover:bg-red-500 hover:text-white transition-all shadow-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-athena-panel/50 border-t border-athena-border/30">
                                <p className="font-bold text-slate-200 truncate text-sm" title={img.name}>{img.name}</p>
                                <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">{(img.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-black/20 rounded-3xl border-2 border-dashed border-athena-border">
                             <ImageIcon className="w-12 h-12 text-athena-border mx-auto mb-4" />
                             <p className="text-slate-500 font-medium font-mono uppercase tracking-widest text-sm">Geen assets gevonden.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImagesView;
