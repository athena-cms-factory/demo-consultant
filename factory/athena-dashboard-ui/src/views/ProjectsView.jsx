import { useState, useEffect } from 'react'
import { ApiService } from '../services/ApiService'
import { useToast } from '../services/ToastContext'

export default function ProjectsView() {
  const { addToast } = useToast()
  const [projects, setProjects] = useState([])
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      const [projData, siteData] = await Promise.all([
        ApiService.getProjects(),
        ApiService.getSites()
      ])
      setProjects(projData)
      setSites(siteData)
    } catch (e) { console.error("Projects fetch failed") }
    setLoading(false)
  }

  const handleDelete = async (projectId) => {
    // 1. Basisbevestiging
    const confirmLocal = window.confirm(`⚠️ WEET JE HET ZEKER?\n\nWil je project '${projectId}' (input data) volledig verwijderen uit Athena?`);
    if (!confirmLocal) return;

    // 2. GitHub Check & Detectie
    let deleteRemote = false;
    let remoteRepoTarget = "";
    let displayUrl = "";
    
    const site = sites.find(s => s.name === projectId || s.name === `${projectId}-site`);
    if (site && site.deployData?.repoUrl) {
      displayUrl = site.deployData.repoUrl;
      remoteRepoTarget = displayUrl;
    } else {
      // Fallback naar de projectId
      remoteRepoTarget = projectId;
      displayUrl = `(Geen URL gevonden, probeer: ${projectId})`;
    }

    const confirmRemote = window.confirm(`🌐 Wil je ook de repository op GitHub verwijderen?\n\nGevonden URL: ${displayUrl}\n\n(Dit kan niet ongedaan worden gemaakt)`);
    
    if (confirmRemote) {
      const editedRepo = window.prompt(`Bevestig de volledige URL of owner/repo van de GitHub repo:`, remoteRepoTarget);
      if (editedRepo !== null) {
        deleteRemote = true;
        remoteRepoTarget = editedRepo;
      }
    }

    // Voor deze specifieke workflow (monorepo) vraagt de gebruiker om de map in sites/ eventueel te laten staan,
    // maar onze standaard deleteProject verwijst naar zowel site als data. 
    // We laten de gebruiker nu kiezen via een simpele confirm voor de sitemap.
    const deleteSite = window.confirm(`📂 Wil je ook de lokale sitemap in athena/sites/${projectId} verwijderen?`);

    addToast(`Project ${projectId} aan het verwijderen...`, 'info');
    try {
      const res = await ApiService.deleteProject(projectId, { 
        deleteSite, 
        deleteData: true, 
        deleteRemote,
        remoteRepoName: remoteRepoTarget
      });
      
      if (res.success) {
        addToast(`✅ ${projectId} succesvol verwijderd.`, 'success');
        if (deleteRemote) {
           const logMsg = res.logs.find(l => l.includes('remote repository')) || 'GitHub repo verwijderd (indien gevonden)';
           addToast(logMsg, 'info');
        }
        refresh();
      } else {
        addToast(`❌ Fout bij verwijderen: ${res.error}`, 'error');
      }
    } catch (e) {
      addToast("Fout bij verbinden met de API.", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-athena-panel p-5 border border-athena-border rounded-sm shadow-sm">
        <div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Pipeline Architectuur</h3>
          <p className="text-slate-500 text-[11px] font-medium">Flow van Ingestie naar Cloud Deployment.</p>
        </div>
        <button className="px-4 py-2 bg-athena-accent text-white text-[11px] font-black uppercase rounded shadow-lg shadow-blue-900/20">
          ADD SOURCE
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project, idx) => {
          const site = sites.find(s => s.name === project || s.name === `${project}-site`);
          return (
            <div key={idx} className="bg-athena-panel p-4 border border-athena-border rounded-sm flex flex-col md:flex-row gap-6 items-center group hover:border-athena-accent transition-colors">
              <div className="w-full md:w-48 space-y-2">
                 <div>
                    <h4 className="font-bold text-white text-[13px] group-hover:text-athena-accent transition-colors truncate">{project.replace(/-/g, ' ')}</h4>
                    <code className="text-[9px] text-slate-500 font-mono tracking-tighter">input/{project}/</code>
                 </div>
                 <div className="flex gap-1.5">
                    <button className="flex-1 bg-[#21262d] border border-athena-border text-slate-400 text-[9px] font-black uppercase py-1.5 rounded hover:text-white transition-colors">
                       CREATE
                    </button>
                     <button 
                        onClick={() => handleDelete(project)}
                        className="px-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded hover:bg-rose-500 hover:text-white transition-all text-[10px]"
                        title="Verwijder project en site"
                      >
                        🗑️
                      </button>

                 </div>
              </div>

              <div className="flex-1 grid grid-cols-4 gap-2 w-full">
                  <PipelineStep icon="📁" label="INGEST" active={true} sub="READY" />
                  <PipelineStep icon="🤖" label="PARSE" active={project.includes('ai')} sub={project.includes('ai') ? 'AI DONE' : 'WAITING'} />
                  <PipelineStep icon="⚙️" label="CORE" active={!!site} sub={site ? 'LINKED' : 'NO SITE'} />
                  <PipelineStep icon="☁️" label="CLOUD" active={!!site?.sheetUrl} sub={site?.sheetUrl ? 'SYNC' : 'LOCAL'} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PipelineStep({ icon, label, active, sub }) {
  return (
    <div className={`relative flex flex-col items-center justify-center p-3 rounded-sm border transition-all ${active ? 'bg-black/20 border-emerald-500/30' : 'bg-black/10 border-athena-border/50 opacity-30'}`}>
       <div className="text-base mb-1">{icon}</div>
       <div className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-white' : 'text-slate-500'}`}>{label}</div>
       <div className={`text-[8px] font-bold ${active ? 'text-athena-accent' : 'text-slate-600'}`}>{sub}</div>
       {active && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>}
    </div>
  )
}
