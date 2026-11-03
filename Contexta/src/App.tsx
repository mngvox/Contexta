import { useEffect, useMemo, useState } from "react";
import {
  Archive, ArrowUp, AudioLines, BookOpen, Check, ChevronDown, ChevronLeft,
  CircleHelp, Clock3, Command, FileAudio, FolderPlus, Headphones, Lightbulb,
  ListMusic, Mic2, MoreHorizontal, Pause, Play, Plus, Radio, Search, Settings,
  ShieldCheck, Sparkles, Square, Waves, X,
} from "lucide-react";
import { projects as initialProjects } from "./data";
import type { Memory, MemoryKind, Project, Session } from "./types";

const kindMeta: Record<MemoryKind, { label: string; icon: typeof Check; className: string }> = {
  decision: { label: "Decision", icon: Check, className: "sage" },
  idea: { label: "Idea", icon: Lightbulb, className: "violet" },
  reference: { label: "Reference", icon: Headphones, className: "blue" },
  question: { label: "Open question", icon: CircleHelp, className: "amber" },
};

function MemoryCard({ memory }: { memory: Memory }) {
  const meta = kindMeta[memory.kind];
  const Icon = meta.icon;
  return (
    <article className="memory-card">
      <div className={`memory-icon ${meta.className}`}><Icon size={14} strokeWidth={2.2} /></div>
      <div className="memory-copy">
        <div className="memory-meta"><span>{meta.label}</span><span>{memory.timestamp}</span></div>
        <h4>{memory.title}</h4>
        <p>{memory.detail}</p>
      </div>
      <button className="icon-btn subtle" aria-label="Memory actions"><MoreHorizontal size={17} /></button>
    </article>
  );
}

function Sidebar({ projects, selectedId, onSelect, onSettings }: { projects: Project[]; selectedId: string; onSelect: (id: string) => void; onSettings: () => void }) {
  return (
    <aside className="sidebar">
      <div className="traffic-space" />
      <div className="brand"><span className="brand-mark"><Waves size={17} /></span><span>contexta</span></div>
      <button className="new-project"><Plus size={16} /> New project</button>
      <div className="sidebar-label">Projects</div>
      <nav className="project-nav">
        {projects.map(project => (
          <button className={`project-item ${selectedId === project.id ? "selected" : ""}`} onClick={() => onSelect(project.id)} key={project.id}>
            <span className="project-glyph" style={{ "--project-color": project.color } as React.CSSProperties}><AudioLines size={15} /></span>
            <span className="project-name"><strong>{project.title}</strong><small>{project.updatedAt}</small></span>
            {selectedId === project.id && <span className="active-dot" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="storage-card">
        <div><ShieldCheck size={15} /><span>Private by default</span></div>
        <p>Your session memory stays on this Mac unless you choose to sync it.</p>
      </div>
      <button className="sidebar-action"><Archive size={16} /> Archive</button>
      <button className="sidebar-action" onClick={onSettings}><Settings size={16} /> Settings</button>
      <div className="profile"><div className="avatar">AK</div><div><strong>Ahmed</strong><small>Local workspace</small></div><ChevronDown size={14} /></div>
    </aside>
  );
}

function ChatDrawer({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: "I’m caught up on Afterglow. What would you like to revisit?" }]);
  const [input, setInput] = useState("");
  const send = () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    setMessages(current => [...current, { role: "user", text: prompt }, { role: "assistant", text: "The strongest thread is the contrast you chose: an intimate bridge followed by a wider final chorus. I’d start by cleaning the high harmony before adding another layer." }]);
    setInput("");
  };
  return (
    <aside className="chat-drawer">
      <header><div><Sparkles size={17} /><strong>Ask Contexta</strong></div><button className="icon-btn" onClick={onClose}><X size={18} /></button></header>
      <div className="context-pill"><span className="pulse-dot" /> Using 3 sessions · 7 memories</div>
      <div className="messages">
        {messages.map((message, i) => <div className={`message ${message.role}`} key={i}>{message.text}</div>)}
        {messages.length === 1 && <div className="suggestions">
          <button onClick={() => setInput("What should I work on next?")}>What should I work on next?</button>
          <button onClick={() => setInput("Why did I remove the half-time outro?")}>Why did I remove the half-time outro?</button>
        </div>}
      </div>
      <div className="composer"><textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}} placeholder="Ask about this project…" /><button onClick={send}><ArrowUp size={16} /></button><small>Contexta can make mistakes. Your memory remains editable.</small></div>
    </aside>
  );
}

function SettingsSheet({ onClose }: { onClose: () => void }) {
  const [cloud, setCloud] = useState(false);
  const [mic, setMic] = useState(true);
  return <div className="overlay" onMouseDown={onClose}><section className="sheet" onMouseDown={e => e.stopPropagation()}>
    <header><div><p className="eyebrow">PRIVACY & CAPTURE</p><h2>You decide what Contexta remembers.</h2></div><button className="icon-btn" onClick={onClose}><X /></button></header>
    <div className="setting-row"><div><strong>Microphone</strong><p>Capture spoken notes and room audio during a session.</p></div><button className={`toggle ${mic ? "on" : ""}`} onClick={() => setMic(!mic)}><span /></button></div>
    <div className="setting-row"><div><strong>Selected app audio</strong><p>Only capture audio from the app you choose when starting.</p></div><button className="toggle on"><span /></button></div>
    <div className="setting-row"><div><strong>Cloud sync</strong><p>Encrypted sync between your trusted devices.</p></div><button className={`toggle ${cloud ? "on" : ""}`} onClick={() => setCloud(!cloud)}><span /></button></div>
    <div className="privacy-note"><ShieldCheck size={19} /><div><strong>Local memory is on</strong><p>Raw recordings and extracted memories stay on this Mac. You can remove any item from its menu.</p></div></div>
    <button className="done-btn" onClick={onClose}>Done</button>
  </section></div>;
}

function SessionRecorder({ elapsed, onStop }: { elapsed: number; onStop: () => void }) {
  const mins = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const secs = (elapsed % 60).toString().padStart(2, "0");
  return <div className="recorder">
    <div className="record-status"><span /><strong>Listening</strong><time>{mins}:{secs}</time></div>
    <div className="waveform">{Array.from({ length: 56 }).map((_, i) => <i style={{ height: `${12 + ((i * 19) % 30)}px`, animationDelay: `${i * -27}ms` }} key={i} />)}</div>
    <div className="recorder-controls"><button className="round-control"><Pause size={17} fill="currentColor" /></button><button className="stop-btn" onClick={onStop}><Square size={14} fill="currentColor" /> End session</button></div>
    <div className="capture-badges"><span><Mic2 size={13} /> Studio microphone</span><span><Radio size={13} /> Logic Pro</span><span className="local"><ShieldCheck size={13} /> Saving locally</span></div>
  </div>;
}

export default function App() {
  const [projects] = useState<Project[]>(initialProjects);
  const [projectId, setProjectId] = useState(() => localStorage.getItem("contexta.project") || "afterglow");
  const [sessionId, setSessionId] = useState("s3");
  const [filter, setFilter] = useState<MemoryKind | "all">("all");
  const [chatOpen, setChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [query, setQuery] = useState("");

  const project = projects.find(p => p.id === projectId) || projects[0];
  const session = project.sessions.find(s => s.id === sessionId) || project.sessions[0];
  useEffect(() => { localStorage.setItem("contexta.project", projectId); setSessionId(project.sessions[0]?.id || ""); }, [projectId, project.sessions]);
  useEffect(() => { if (!recording) return; const timer = window.setInterval(() => setElapsed(v => v + 1), 1000); return () => clearInterval(timer); }, [recording]);
  const memories = useMemo(() => (session?.memories || []).filter(m => (filter === "all" || m.kind === filter) && (`${m.title} ${m.detail}`.toLowerCase().includes(query.toLowerCase()))), [session, filter, query]);

  return <div className={`app-shell ${chatOpen ? "chat-is-open" : ""}`}>
    <Sidebar projects={projects} selectedId={project.id} onSelect={setProjectId} onSettings={() => setSettingsOpen(true)} />
    <main className="main">
      <header className="topbar">
        <div className="breadcrumbs"><button className="icon-btn"><ChevronLeft size={18} /></button><div><span>Project</span><strong>{project.title}</strong></div></div>
        <div className="top-actions"><button className="search-trigger"><Search size={15} /> Search memories <kbd>⌘ K</kbd></button><button className={`ask-btn ${chatOpen ? "active" : ""}`} onClick={() => setChatOpen(v => !v)}><Sparkles size={15} /> Ask Contexta</button><button className="icon-btn"><MoreHorizontal size={19} /></button></div>
      </header>
      <div className="content">
        <section className="project-header">
          <div><div className="eyebrow"><span style={{ background: project.color }} /> MUSIC PROJECT</div><h1>{project.title}</h1><p>{project.subtitle}</p></div>
          {!recording && <button className="start-btn" onClick={() => { setRecording(true); setElapsed(0); }}><span><Play size={15} fill="currentColor" /></span> Start a session</button>}
        </section>
        {recording && <SessionRecorder elapsed={elapsed} onStop={() => setRecording(false)} />}
        {!project.sessions.length ? <section className="empty"><span><ListMusic /></span><h2>A clear place for the next idea.</h2><p>Start a session and Contexta will remember the creative trail as it takes shape.</p><button className="start-btn" onClick={() => setRecording(true)}><Play size={15} fill="currentColor" /> Start first session</button></section> : <>
          <section className="resume-card">
            <div className="resume-orb"><Waves size={23} /></div>
            <div className="resume-copy"><p className="eyebrow">WHERE YOU LEFT OFF</p><h2>The bridge found its voice. The final chorus needs clarity.</h2><p>You chose a close, almost whispered lead for the bridge. Next, clean up the high harmony in the last chorus before adding another layer.</p><div className="resume-links"><button><Play size={13} fill="currentColor" /> Play last take</button><span>·</span><button>Open in Logic Pro <ArrowUp size={12} /></button></div></div>
            <time>12 hours ago</time>
          </section>
          <div className="workspace-grid">
            <aside className="sessions-panel">
              <div className="section-title"><span>Sessions</span><button className="icon-btn subtle"><Plus size={16} /></button></div>
              {project.sessions.map((item, index) => <button key={item.id} onClick={() => setSessionId(item.id)} className={`session-row ${session?.id === item.id ? "active" : ""}`}>
                <span className="timeline"><i />{index !== project.sessions.length - 1 && <b />}</span><span className="session-label"><strong>{item.title}</strong><small>{item.date} · {item.duration}</small></span><ChevronLeft size={15} className="row-arrow" />
              </button>)}
            </aside>
            {session && <section className="session-detail">
              <header className="session-heading"><div><p className="eyebrow">SESSION · {session.date.toUpperCase()}</p><h2>{session.title}</h2><span><Clock3 size={13} /> {session.duration}<i /> <Check size={13} /> Processed</span></div><button className="icon-btn"><MoreHorizontal /></button></header>
              <div className="summary"><Sparkles size={16} /><div><strong>Session summary</strong><p>{session.summary}</p></div></div>
              <div className="memory-toolbar"><div>{(["all", "decision", "idea", "reference", "question"] as const).map(item => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item === "all" ? "All memory" : kindMeta[item].label}</button>)}</div><label><Search size={14} /><input aria-label="Search session" value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter" /></label></div>
              <div className="memory-list">{memories.map(memory => <MemoryCard memory={memory} key={memory.id} />)}{!memories.length && <p className="no-results">No memories match this filter.</p>}</div>
              <button className="add-memory"><Plus size={15} /> Add memory</button>
            </section>}
          </div>
        </>}
      </div>
    </main>
    {chatOpen && <ChatDrawer onClose={() => setChatOpen(false)} />}
    {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}
  </div>;
}
