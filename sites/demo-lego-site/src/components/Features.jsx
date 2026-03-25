import React from 'react';

const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;

function FeaturesSection({ data, sectionName = 'features' }) {
  const items = data || [
    { titel: 'Snelheid', tekst: 'Razendsnelle laadtijden.' },
    { titel: 'Modulariteit', tekst: 'Bouw met Lego blokken.' },
    { titel: 'Design', tekst: 'Goud-Standaard esthetiek.' }
  ];

  return (
    <section id={sectionName} className="py-24 px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16 tracking-tight">Onze Kracht</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <IconCheck className="w-12 h-12 text-blue-600 mb-6 group-hover:scale-110 transition-transform" />
              <h3 
                className="text-2xl font-bold mb-4" 
                data-dock-bind={`${sectionName}.${i}.titel`}
              >
                {item.titel}
              </h3>
              <p 
                className="text-slate-600 leading-relaxed" 
                data-dock-bind={`${sectionName}.${i}.tekst`}
              >
                {item.tekst}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
