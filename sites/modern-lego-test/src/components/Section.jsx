
import React from 'react';


function Section({ data }) {
  if (!data) return <div className="p-20 text-center font-bold text-slate-400">Loading data...</div>;

  return (
    <div className="sections-wrapper">
      {/* No active sections found */}
    </div>
  );
}

export default Section;
