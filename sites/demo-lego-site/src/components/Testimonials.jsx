import React from 'react';

const IconStar = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

function TestimonialsSection({ data, sectionName = 'testimonials' }) {
  const items = data || [
    { naam: 'Karel', rol: 'CEO Athena', tekst: 'De Lego Factory is een game-changer voor onze workflow.' },
    { naam: 'Jean', rol: 'Developer', tekst: 'Eindelijk een systeem dat écht modulair is en de 1-op-1 regel volgt.' }
  ];

  return (
    <section id={sectionName} className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16 tracking-tight">Wat Klanten Zeggen</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => <IconStar key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-xl italic text-slate-700 leading-relaxed">"{item.tekst}"</p>
              <div>
                <p 
                  className="font-bold text-slate-900" 
                  data-dock-bind={`${sectionName}.${i}.naam`}
                >
                  {item.naam}
                </p>
                <p 
                  className="text-sm text-slate-500" 
                  data-dock-bind={`${sectionName}.${i}.rol`}
                >
                  {item.rol}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
