import React from 'react';

function AboutSection({ data, sectionName = 'about' }) {
  const content = data?.[0] || {};

  return (
    <section id={sectionName} className="py-24 px-8 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 
            className="text-4xl font-bold mb-8 text-slate-900"
            data-dock-bind={`${sectionName}.0.koptekst`}
          >
            {content.koptekst || 'Over Ons'}
          </h2>
          <div 
            className="text-lg text-slate-600 leading-relaxed space-y-4"
            data-dock-bind={`${sectionName}.0.inhoud`}
          >
            {content.inhoud || 'Vertel hier je verhaal.'}
          </div>
        </div>
        <div className="aspect-video rounded-3xl bg-slate-100 overflow-hidden shadow-xl">
           <img 
             src={content.afbeelding || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"} 
             alt="About" 
             className="w-full h-full object-cover" 
             data-dock-bind={`${sectionName}.0.afbeelding`}
             data-dock-type="media"
           />
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
