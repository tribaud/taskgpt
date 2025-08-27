// ====== ÉTAT ======
const LS_RECENTS_KEY = 'task_editor_recent_snapshots_v1';

// Define types for our data structures
interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    done: boolean;
    dependencies: string[];
    tags: string[];
}

interface State {
    schema: string;
    data: { tasks: Task[] };
}

let state: State = {
    schema: 'v1',
    data: { tasks: [] },
};

// Declare the electronAPI globally
declare const electronAPI: {
    saveApiKey: (apiKey: string) => Promise<any>;
    getApiKey: () => Promise<any>;
    saveFile: (data: any, defaultPath?: string) => Promise<any>;
    openFile: () => Promise<any>;
};

// ====== UTILITAIRES ======
const $ = (sel: string): HTMLElement | null => document.querySelector(sel);
function uid(): string { const n = state.data.tasks.length + 1; return 'T' + String(n).padStart(3, '0'); }
function toMD(data: State['data']): string {
    const lines: string[] = ['# Tasks', ''];
    for (const t of data.tasks) {
        const check = t.done ? 'x' : ' ';
        const prio = t.priority || 'n/a';
        const deps = (t.dependencies || []).join(', ');
        const tags = (t.tags || []).join(', ');
        lines.push(`- [${check}] **${t.id}** ${t.title || ''} (prio: ${prio})`);
        if (t.description) lines.push(`  - ${t.description}`);
        if (deps) lines.push(`  - deps: ${deps}`);
        if (tags) lines.push(`  - tags: ${tags}`);
    }
    return lines.join('\n');
}

// ====== RENDU TABLE ======
function renderTable() {
    const tbody = $('#tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.data.tasks.forEach((t, idx) => {
        const tr = document.createElement('tr');

        // done
        const tdDone = document.createElement('td'); tdDone.className = 'checkbox';
        const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!t.done; cb.onchange = () => { t.done = cb.checked; saveSnapshot('auto'); };
        tdDone.appendChild(cb);

        // id (readonly, mais éditable via double-clic si besoin)
        const tdId = document.createElement('td'); tdId.textContent = t.id || ''; tdId.title = 'Double-clic pour éditer';
        tdId.ondblclick = () => { const val = prompt('Modifier ID', t.id || ''); if (val) { t.id = val; renderTable(); saveSnapshot('auto'); } };

        // title
        const tdTitle = document.createElement('td'); tdTitle.contentEditable = 'true' as 'true'; tdTitle.textContent = t.title || '';
        tdTitle.oninput = () => { t.title = tdTitle.textContent || ''; };

        // description
        const tdDesc = document.createElement('td'); tdDesc.contentEditable = 'true' as 'true'; tdDesc.textContent = t.description || '';
        tdDesc.oninput = () => { t.description = tdDesc.textContent || ''; };

        // priority
        const tdPrio = document.createElement('td'); tdPrio.contentEditable = 'true' as 'true'; tdPrio.textContent = t.priority || '';
        tdPrio.oninput = () => { t.priority = tdPrio.textContent || ''; };

        // dependencies
        const tdDeps = document.createElement('td'); tdDeps.contentEditable = 'true' as 'true'; tdDeps.textContent = (t.dependencies || []).join(', ');
        tdDeps.oninput = () => { t.dependencies = tdDeps.textContent.split(',').map(s => s.trim()).filter(Boolean); };

        // tags
        const tdTags = document.createElement('td'); tdTags.contentEditable = 'true' as 'true'; tdTags.textContent = (t.tags || []).join(', ');
        tdTags.oninput = () => { t.tags = tdTags.textContent.split(',').map(s => s.trim()).filter(Boolean); };

        // actions
        const tdActions = document.createElement('td');
        const bUp = document.createElement('button'); bUp.textContent = '↑'; bUp.onclick = () => { if (idx > 0) { const tmp = state.data.tasks[idx - 1]; state.data.tasks[idx - 1] = state.data.tasks[idx]; state.data.tasks[idx] = tmp; renderTable(); saveSnapshot('auto'); } };
        const bDown = document.createElement('button'); bDown.textContent = '↓'; bDown.onclick = () => { if (idx < state.data.tasks.length - 1) { const tmp = state.data.tasks[idx + 1]; state.data.tasks[idx + 1] = state.data.tasks[idx]; state.data.tasks[idx] = tmp; renderTable(); saveSnapshot('auto'); } };
        const bDel = document.createElement('button'); bDel.textContent = '🗑️'; bDel.onclick = () => { if (confirm('Supprimer cette tâche ?')) { state.data.tasks.splice(idx, 1); renderTable(); saveSnapshot('auto'); } };
        tdActions.append(bUp, bDown, bDel);

        tr.append(tdDone, tdId, tdTitle, tdDesc, tdPrio, tdDeps, tdTags, tdActions);
        tbody.appendChild(tr);
    });
}

// ====== NOUVEAU / AJOUT ======
function newFile() {
    state.data = { tasks: [{ id: 'T001', title: 'Nouvelle tâche', description: 'Décris ici…', priority: 'medium', done: false, dependencies: [], tags: [] }] };
    renderTable(); saveSnapshot('new');
}
function addTask() {
    state.data.tasks.push({ id: uid(), title: '', description: '', priority: 'low', done: false, dependencies: [], tags: [] });
    renderTable(); saveSnapshot('add');
}

// ====== IMPORT / EXPORT ======
const btnOpen = document.getElementById('btnOpen');
if (btnOpen) {
    btnOpen.onclick = async () => {
        try {
            const result = await electronAPI.openFile();
            if (!result.canceled && result.success) {
                state.data = Array.isArray(result.data) ? { tasks: result.data } : (result.data.tasks ? result.data : { tasks: [] });
                renderTable(); saveSnapshot('open', result.filePath);
            } else if (!result.canceled && !result.success) {
                alert('Erreur lors de l\'ouverture du fichier: ' + result.error);
            }
        } catch (err: any) {
            alert('Erreur: ' + err.message);
        }
    };
}

const btnSave = document.getElementById('btnSave');
if (btnSave) {
    btnSave.onclick = async () => {
        try {
            const result = await electronAPI.saveFile(state.data, 'tasks.json');
            if (!result.canceled && result.success) {
                saveSnapshot('save', result.filePath);
                alert('Fichier sauvegardé avec succès!');
            } else if (!result.canceled && !result.success) {
                alert('Erreur lors de la sauvegarde: ' + result.error);
            }
        } catch (err: any) {
            alert('Erreur: ' + err.message);
        }
    };
}

const btnExportMD = document.getElementById('btnExportMD');
if (btnExportMD) {
    btnExportMD.onclick = async () => {
        try {
            const mdContent = toMD(state.data);
            const result = await electronAPI.saveFile(mdContent, 'tasks.md');
            if (!result.canceled && result.success) {
                alert('Fichier Markdown exporté avec succès!');
            } else if (!result.canceled && !result.success) {
                alert('Erreur lors de l\'export: ' + result.error);
            }
        } catch (err: any) {
            alert('Erreur: ' + err.message);
        }
    };
}

const btnNew = document.getElementById('btnNew');
if (btnNew) {
    btnNew.onclick = newFile;
}

const btnAdd = document.getElementById('btnAdd');
if (btnAdd) {
    btnAdd.onclick = addTask;
}

const btnSort = document.getElementById('btnSort');
if (btnSort) {
    btnSort.onclick = () => { state.data.tasks.sort((a, b) => (a.id || '').localeCompare(b.id || '')); renderTable(); saveSnapshot('sort'); };
}

const btnCopyPrompt = document.getElementById('btnCopyPrompt');
if (btnCopyPrompt) {
    btnCopyPrompt.onclick = () => {
        const p = `Tu es un assistant qui crée et met à jour un fichier tasks.json.\nRéponds UNIQUEMENT en JSON strict conforme au schéma v1 :\n{\n  "tasks": [\n    {"id":"T001","title":"...","description":"...","priority":"high|medium|low","done":false,"dependencies":[],"tags":[]}\n  ]\n}\nRègles :\n- Conserve les IDs existants.\n- Ajoute des sous-tâches si demandé (IDs T###).\n- Pas de texte hors JSON.`;
        navigator.clipboard.writeText(p).then(() => alert('Prompt copié dans le presse-papiers.'));
    };
}

// ====== API KEY MANAGEMENT ======
async function loadApiKey() {
    try {
        const result = await electronAPI.getApiKey();
        const apiKeyElement = document.getElementById('apiKey') as HTMLInputElement | null;
        if (result.apiKey && apiKeyElement) {
            apiKeyElement.value = result.apiKey;
        }
    } catch (err: any) {
        console.error('Erreur lors du chargement de la clé API:', err);
    }
}

const apiKeyElement = document.getElementById('apiKey');
if (apiKeyElement) {
    apiKeyElement.addEventListener('change', async () => {
        const apiKey = (apiKeyElement as HTMLInputElement).value.trim() || '';
        if (apiKey) {
            try {
                await electronAPI.saveApiKey(apiKey);
            } catch (err: any) {
                console.error('Erreur lors de la sauvegarde de la clé API:', err);
            }
        }
    });
}

// ====== SNAPSHOTS (instantanés) ======
function loadRecents() {
    // Note: In a full implementation, this would be handled by the main process
    // For now, we'll keep the localStorage implementation for simplicity
    // Implementation would be updated to work with Electron's file system
}

function saveSnapshot(source = 'manual', name = 'tasks.json') {
    // Note: In a full implementation, this would be handled by the main process
    // For now, we'll keep the localStorage implementation for simplicity
    const arr = JSON.parse(localStorage.getItem(LS_RECENTS_KEY) || '[]');
    arr.unshift({ ts: Date.now(), source, name, data: state.data });
    // dédupliquer par contenu + garder 10 derniers
    const seen = new Set();
    const out: any[] = [];
    for (const x of arr) {
        const k = JSON.stringify(x.data);
        if (seen.has(k)) continue;
        seen.add(k); out.push(x);
        if (out.length >= 10) break;
    }
    localStorage.setItem(LS_RECENTS_KEY, JSON.stringify(out));
    loadRecents();
}

// ====== CHAT IA ======
function addMsg(role: string, text: string) {
    const box = document.getElementById('chatBox') as HTMLElement | null;
    if (!box) return;
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

const btnSend = document.getElementById('btnSend');
if (btnSend) {
    btnSend.onclick = async () => {
        const apiKeyElement = document.getElementById('apiKey') as HTMLInputElement | null;
        const modelElement = document.getElementById('model') as HTMLSelectElement | null;
        const sysElement = document.getElementById('systemPrompt') as HTMLTextAreaElement | null;
        const userMsgElement = document.getElementById('userMsg') as HTMLTextAreaElement | null;

        const apiKey = apiKeyElement?.value.trim() || '';
        const model = modelElement?.value || '';
        const sys = sysElement?.value || '';
        const user = userMsgElement?.value.trim() || '';

        if (!user) return;
        addMsg('user', user);
        if (userMsgElement) userMsgElement.value = '';

        const messages = [{ role: 'system', content: sys }];

        const btnInject = document.getElementById('btnInject');
        if (btnInject && btnInject.textContent?.includes('✅')) {
            messages.push({ role: 'user', content: 'JSON actuel:\n' + JSON.stringify(state.data, null, 2) });
        }
        messages.push({ role: 'user', content: user });

        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + apiKey
                },
                body: JSON.stringify({ model, messages, temperature: 0 })
            });
            const data = await res.json();
            const text = data?.choices?.[0]?.message?.content || '[Réponse vide]';
            addMsg('ai', text);

            const jsonText = extractJSON(text);
            if (jsonText) {
                const parsed = JSON.parse(jsonText);
                state.data = Array.isArray(parsed) ? { tasks: parsed } : (parsed.tasks ? parsed : { tasks: [] });
                renderTable(); saveSnapshot('ai');
            }
        } catch (err: any) {
            addMsg('ai', 'Erreur: ' + err.message);
        }
    };
}

const btnInject = document.getElementById('btnInject');
if (btnInject) {
    btnInject.onclick = (e) => {
        const target = e.currentTarget as HTMLElement | null;
        if (!target) return;
        const on = target.textContent?.includes('✅') || false;
        target.textContent = on ? '💉 Inclure JSON actuel' : '✅ Inclure JSON actuel';
    };
}

function extractJSON(txt: string): string | null {
    const fenced = txt.match(/```json\s*([\s\S]*?)\s*```/i);
    if (fenced) return fenced[1];
    const arrMatch = txt.match(/\[[\s\S]*\]$/m);
    const objMatch = txt.match(/\{[\s\S]*\}$/m);
    if (arrMatch) return arrMatch[0];
    if (objMatch) return objMatch[0];
    return null;
}

// ====== INIT ======
loadRecents();
loadApiKey();
newFile();
