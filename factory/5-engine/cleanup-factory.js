/**
 * 🧹 Deep Factory Cleanup (v8.8)
 * Performs non-interactive system maintenance for the Athena Factory.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AthenaConfigManager } from './lib/ConfigManager.js';
import { DoctorController } from './controllers/DoctorController.js';
import { AthenaProcessManager } from './lib/ProcessManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

async function runCleanup() {
    console.log("======================================");
    console.log("🧹 ATHENA DEEP FACTORY CLEANUP");
    console.log("======================================");

    const configManager = new AthenaConfigManager(root);
    const doctor = new DoctorController(configManager);
    const pm = new AthenaProcessManager(root);

    const results = [];

    // 1. Cleanup Temp Data
    try {
        console.log("⏳ Opschonen van tijdelijke data...");
        const res = await doctor.cleanupTempData();
        results.push(res.message);
    } catch (e) {
        results.push(`❌ Fout bij temp data cleanup: ${e.message}`);
    }

    // 2. Prune PNPM Store
    try {
        console.log("⏳ Pruning pnpm store (global space recovery)...");
        const res = doctor.prunePnpmStore();
        results.push(res.message);
    } catch (e) {
        results.push(`❌ Fout bij pnpm prune: ${e.message}`);
    }

    // 3. Process Check & Cleanup
    try {
        console.log("⏳ Controleren op dode processen...");
        const active = pm.listActive();
        let cleanedProcesses = 0;
        // The process manager usually handles dead processes on listActive()
        // but we can force a check.
        results.push(`ℹ️  ${Object.keys(active).length} actieve processen gecontroleerd.`);
    } catch (e) {
        results.push(`❌ Fout bij proces-check: ${e.message}`);
    }

    // 4. Port Registry Cleanup (Orphaned entries)
    try {
        console.log("⏳ Opschonen van poort-registraties...");
        const portsFile = path.join(root, 'factory/config/site-ports.json');
        if (fs.existsSync(portsFile)) {
            const ports = JSON.parse(fs.readFileSync(portsFile, 'utf8'));
            const sitesDir = path.join(root, 'sites');
            const initialCount = Object.keys(ports).length;
            
            for (const siteName in ports) {
                if (!fs.existsSync(path.join(sitesDir, siteName)) && 
                    !fs.existsSync(path.join(root, 'sites-external', siteName)) &&
                    siteName !== 'athena-hub' && siteName !== 'athena-pro' && !siteName.startsWith('demo-')) {
                    delete ports[siteName];
                }
            }
            
            const removedCount = initialCount - Object.keys(ports).length;
            if (removedCount > 0) {
                fs.writeFileSync(portsFile, JSON.stringify(ports, null, 2));
                results.push(`✅ ${removedCount} wees-poortregistraties verwijderd uit site-ports.json.`);
            } else {
                results.push("ℹ️  Geen wees-poorten gevonden.");
            }
        }
    } catch (e) {
        results.push(`❌ Fout bij poort-cleanup: ${e.message}`);
    }

    console.log("\nCLEANUP RESULTATEN:");
    results.forEach(r => console.log(`- ${r}`));
    console.log("======================================");
    console.log("✨ Cleanup voltooid.");
}

runCleanup().catch(err => {
    console.error("🔥 Fatale fout tijdens cleanup:", err);
    process.exit(1);
});
