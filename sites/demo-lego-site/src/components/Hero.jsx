import React from 'react';

function StandardHero({ data, sectionName = 'hero' }) {
  const hero = data?.[0] || {};
  const image = hero.afbeelding || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80';

  return (
    <section id={sectionName} className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt="Hero" 
          className="w-full h-full object-cover" 
          data-dock-bind={`${sectionName}.0.afbeelding`}
          data-dock-type="media"
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-brightness-50"></div>
      </div>
      <div className="relative z-10 text-center text-white px-6">
        <h1 
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
          data-dock-bind={`${sectionName}.0.titel`}
        >
          {hero.titel || 'v9.0 Lego Factory'}
        </h1>
        <p 
          className="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto"
          data-dock-bind={`${sectionName}.0.ondertitel`}
        >
          {hero.ondertitel || 'De toekomst van visueel bouwen.'}
        </p>
        <a 
          href="#about" 
          className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all"
        >
          Ontdek Meer
        </a>
      </div>
    </section>
  );
}

export default StandardHero;
