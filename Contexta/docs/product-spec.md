# Contexta: Music Session Continuity

**Status:** MVP implementation specification  
**Platform:** macOS desktop, single user  
**Product promise:** A musician can return to a project after time away and understand where the work was going in under two minutes.

## 1. Product decision

Contexta is a session workspace with a conversational assistant, not a chat application and not a virtual character. Chat is one input surface; the primary experience is a persistent project timeline that shows evidence, decisions, ideas, and unresolved threads. The assistant should feel like a quiet studio collaborator: present when asked, concise, and attributable to captured material.

The attached concept deck is background context only. This document defines the executable MVP requirements.

## 2. Target user and job

### Primary persona

An independent musician, songwriter, or producer who works across multiple sessions in a DAW and accumulates recordings, lyrics, references, and creative decisions.

### Secondary persona

A producer collaborating with an artist who needs to remember why choices were made and what should happen in the next session.

### Jobs to be done

- When I finish a creative session, capture what changed and what I intended to do next without making me write formal notes.
- When I return days later, restore the relevant creative state quickly and accurately.
- When I ask why a direction changed, show the supporting session evidence instead of inventing an answer.
- When Contexta remembers something incorrectly or sensitively, let me correct or remove it completely.

## 3. MVP scope

### Required

- Local project creation and project switching.
- Explicit start, pause/resume, and stop controls for each session.
- Microphone capture after macOS permission and clear in-product consent.
- User-selected window or screen capture after macOS permission; no hidden/background screen capture.
- Audio transcription with timestamps and processing status.
- Manual voice notes and typed notes.
- Import of audio, text, PDF, and common image files into a project.
- Session timeline combining notes, transcript segments, captures, imported artifacts, and extracted memories.
- Structured extraction of decisions, ideas, rejected directions, references, open questions, and next actions.
- End-of-session recap that the user can edit before accepting.
- Resume briefing with a concise summary, unresolved items, next actions, and citations back to source events.
- Assistant panel that answers project questions using only project context and labels unsupported answers.
- Memory inspection, editing, deletion, export, and “useful / not useful” feedback.
- Local SQLite source of truth; cloud AI may process selected content only under the privacy rules below.

### Should fit if core scope is stable

- Watched project folder with opt-in, visible path, and per-file inclusion controls.
- Keyboard shortcut for a timestamped voice marker such as “keep this” or “try a darker chorus.”
- Lightweight global search across projects.

## 4. Experience principles

1. **Session-first:** every capture belongs to an explicit project and session.
2. **Visible recording state:** persistent indicator, elapsed time, active inputs, and one-click stop.
3. **Evidence over confidence:** every inferred memory links to the event or artifact that supports it.
4. **User owns the canon:** inferred memories remain proposed until accepted automatically by a documented low-risk rule or confirmed by the user.
5. **Quiet by default:** no unsolicited voice, avatar animation, or interruptions during creation.
6. **Progressive detail:** return briefing first; transcript and raw evidence remain available on demand.

## 5. Core flows

### A. First run

1. User sees a plain-language explanation of what is stored locally and what may be sent to cloud AI.
2. User chooses a display name and creates the first project.
3. Contexta requests microphone permission only when microphone capture is enabled.
4. Contexta requests screen-recording permission only when the user selects a window or screen.
5. A capture check confirms active inputs; denial leaves the app usable for typed notes and file imports.

### B. Start and run a session

1. User opens a project and sees the previous resume briefing.
2. User selects capture inputs and presses **Start session**.
3. The app displays the active session bar at all times.
4. Transcript segments and manual markers appear chronologically.
5. The user may add a voice or typed note, pause capture, or inspect captured evidence.
6. The assistant does not interrupt unless directly invoked.

### C. End a session

1. User presses **End session** and capture stops immediately.
2. Contexta finishes queued transcription/extraction and shows progress without blocking navigation.
3. A draft recap presents: what changed, key decisions, ideas/references, rejected directions, open questions, and next actions.
4. User edits, accepts, or dismisses each proposed memory and saves the recap.

### D. Resume later

1. Opening a project shows **Where you left off** above older activity.
2. The briefing contains a short state summary, three or fewer priority next actions by default, unresolved questions, and recent references.
3. Selecting a statement reveals its source event, timestamp, transcript excerpt, or artifact.
4. User starts a new session from the briefing.

### E. Ask Contexta

1. User opens the assistant rail and asks a project-specific question.
2. Retrieval considers accepted memories first, then recent relevant evidence.
3. The answer cites evidence. If evidence is insufficient, the assistant says so and may suggest where to look.
4. Conversation messages are stored in the project only when project chat history is enabled.

### F. Correct or delete memory

1. User opens a memory from a briefing, timeline, search, or assistant citation.
2. User edits the statement, changes its type/status, or deletes it.
3. The correction is used immediately in subsequent retrieval.
4. Delete removes the record and its derived index entries; source media deletion is a separate explicit choice.

## 6. Information architecture and screens

### App shell

- **Project sidebar:** projects, search, settings.
- **Main workspace:** Resume, Session, Timeline, and Library tabs.
- **Assistant rail:** collapsible conversation and cited answers; secondary to the workspace.
- **Session bar:** globally persistent while recording, with inputs, timer, pause, and stop.

### Screens

1. **Welcome & privacy** — local/cloud explanation, permission setup, create/import project.
2. **Project home / Resume** — last-session briefing, next actions, start-session button, recent artifacts.
3. **Capture setup** — microphone selector, window/screen picker, visible exclusions, capture test.
4. **Live session** — timeline, markers/notes, compact transcript status, assistant rail.
5. **Session recap** — editable sections and proposed-memory accept/dismiss controls.
6. **Timeline** — filterable evidence and memories grouped by session.
7. **Library** — imported assets, capture files, processing status, inclusion controls.
8. **Memory detail** — canonical statement, type, confidence/status, source citations, edit/delete.
9. **Settings & privacy** — storage location, cloud processing, retention, permissions, export/delete.

## 7. Memory model

SQLite is authoritative. Embeddings are disposable derived indexes and never the only representation of a memory.

### Core entities

| Entity | Required fields |
|---|---|
| `Project` | `id`, `name`, `created_at`, `updated_at`, `archived_at?` |
| `Session` | `id`, `project_id`, `title`, `started_at`, `ended_at?`, `status`, `capture_config`, `recap_status` |
| `Event` | `id`, `session_id`, `kind`, `occurred_at`, `payload`, `source_artifact_id?` |
| `Artifact` | `id`, `project_id`, `session_id?`, `kind`, `local_uri`, `mime_type`, `sha256`, `created_at`, `deleted_at?` |
| `TranscriptSegment` | `id`, `artifact_id`, `start_ms`, `end_ms`, `text`, `speaker?`, `confidence?` |
| `Memory` | `id`, `project_id`, `session_id?`, `type`, `statement`, `status`, `confidence?`, `created_at`, `updated_at` |
| `MemorySource` | `memory_id`, `event_id?`, `artifact_id?`, `transcript_segment_id?`, `source_excerpt?` |
| `Feedback` | `id`, `target_type`, `target_id`, `rating`, `reason?`, `created_at` |

### Memory types

- `decision`: an adopted creative or production choice.
- `idea`: a candidate direction not yet adopted.
- `rejection`: a direction intentionally ruled out, including the reason when known.
- `reference`: a song, artist, sound, file, or external inspiration.
- `open_question`: something unresolved.
- `next_action`: an intended follow-up task.
- `preference`: a recurring user preference supported across sessions.

### Memory lifecycle

`proposed -> accepted -> superseded | deleted`; a proposal may also become `dismissed`.

- Extraction creates `proposed` memories with one or more sources.
- User edits create an accepted canonical version and preserve an audit event.
- New contradictory evidence does not silently overwrite accepted memory; it proposes a superseding memory.
- Retrieval excludes dismissed, superseded, and deleted memories.
- A project preference requires explicit confirmation in MVP; no cross-project inference.

## 8. Processing pipeline

1. Capture writes media locally in bounded chunks and records events.
2. A resumable job queue transcribes eligible audio and extracts structured candidates.
3. Validation rejects malformed results and any memory without a source reference.
4. Accepted text is embedded and indexed for semantic retrieval.
5. Recap generation uses session evidence plus accepted project memories.
6. Assistant retrieval ranks accepted memory, recency, semantic relevance, and source quality, then generates a cited response.

Jobs must be idempotent. App restart must resume incomplete jobs without duplicating memories.

## 9. Privacy, permissions, and security

- Capture is off by default and begins only after an explicit user action.
- Contexta must never bypass the macOS lock screen, simulate user presence, or record while the Mac is locked. “Access when locked” is not an MVP requirement and should not be accepted as blanket consent.
- Recording automatically pauses when the user session locks, the machine sleeps, or capture permission is revoked; the UI explains why on return.
- The capture indicator remains visible whenever any input is active.
- Window capture is preferred over whole-screen capture. The user sees the selected source before recording.
- Raw media and the SQLite database remain local by default.
- Before enabling cloud transcription or reasoning, the user sees the provider, data categories, purpose, and retention behavior, and can disable cloud processing later.
- Cloud requests contain the minimum required excerpts, not the entire project by default.
- Secrets are stored in macOS Keychain, never SQLite or logs.
- Logs omit transcript text, prompts, filenames, and tokens by default.
- Export produces a human-readable JSON/Markdown bundle. Project deletion removes database records, local media, thumbnails, and derived indexes after explicit confirmation.
- MVP sync, remote access, and unattended/background operation are out of scope.

## 10. Acceptance criteria

### Project and session

- A user can create, rename, archive, and reopen a local project.
- Start is disabled until at least one valid input or note-only mode is selected.
- While recording, the app always shows project, session timer, active inputs, and stop control.
- Pause produces no new audio/screen data; resume continues in the same session.
- Stop closes active capture streams within two seconds and leaves a recoverable session record.
- Force-quitting and reopening preserves all completed capture chunks and offers to recover the interrupted session.

### Capture and permissions

- Denying microphone or screen permission does not crash or block note-only use.
- Permission revocation stops the affected stream and creates a visible timeline event.
- Locking or sleeping the Mac pauses capture and records no media until the user returns and explicitly resumes.
- The selected window/screen and microphone are visible before and during capture.

### Recap and memory

- A completed five-minute test session produces a draft recap once processing finishes.
- Every generated factual claim in a recap or answer links to at least one local source.
- The user can accept, edit, dismiss, and delete a proposed memory.
- Edited memory is reflected in the next retrieval without restarting the app.
- Contradictory accepted memory is flagged for resolution rather than silently overwritten.
- Deleting a memory removes it from keyword and semantic results.

### Resume and assistant

- A project with a completed session opens to a briefing containing current state, open questions, and next actions.
- Clicking a briefing citation navigates to the correct timestamp or artifact.
- When no supporting evidence exists, the assistant states that it cannot find the answer and does not fabricate a citation.
- Assistant answers remain scoped to the current project unless the user explicitly changes scope.

### Reliability and privacy

- Incomplete processing jobs resume once after restart and do not create duplicate records.
- No secrets or transcript content appear in default application logs.
- Exported project data can be inspected without Contexta.
- Project deletion removes local raw and derived project data and reports any file it could not remove.

## 11. Success metrics

### Primary

- **Resume success:** at least 70% of pilot users agree that a briefing restored enough context to continue within two minutes.
- **Weekly return:** at least 50% of activated pilot users complete sessions in two separate weeks during a four-week study.

### Supporting

- At least 60% of generated recap memories are accepted without substantive edits.
- Fewer than 5% of cited statements lead to a “wrong evidence” report.
- Median time from pressing End to a usable recap is under two minutes for a 30-minute session on the supported test machine/network.
- At least 40% of returning sessions begin from a resume-briefing action.
- Fewer than 1% of sessions lose a completed media chunk due to crash or restart in testing.

Metrics are opt-in for the pilot and contain event metadata, not creative content.

## 12. Non-goals for MVP

- Autonomous composition, lyric writing, mixing, mastering, or DAW control.
- A human-like avatar, mascot-led conversation, emotional dependency mechanics, or synthetic personality voice.
- Continuous ambient surveillance or recording without a visible active session.
- Identifying people by voice or face.
- Camera capture.
- Collaboration, teams, comments, or shared cloud projects.
- Windows, iOS, Android, or web clients.
- Cross-project personal profiling.
- Real-time musical analysis, stem separation, chord detection, or beat alignment.
- Plugin formats such as AU, VST, or AAX.
- Encrypted cloud sync or remote access.

## 13. Phased roadmap

### Phase 0 — Walking skeleton (1–2 weeks)

App shell, local projects, SQLite migrations, start/stop note-only sessions, typed notes, timeline, crash-safe state, and seeded demo data.

### Phase 1 — Capture loop (2–4 weeks)

Microphone capture, selected-window capture, permissions, chunked local storage, voice notes, transcription queue, and interruption recovery.

### Phase 2 — Continuity loop (2–3 weeks)

Structured extraction, recap review, memory editing/deletion, cited resume briefing, and project-scoped assistant.

### Phase 3 — Pilot hardening (2–3 weeks)

Import/library, export/delete, onboarding/privacy controls, performance, error handling, accessibility pass, analytics opt-in, and signed/notarized pilot build.

### Later, only with evidence

DAW-aware metadata, local model options, watched folders, collaboration, encrypted sync, Windows, and constrained suggestions during sessions.

## 14. Implementation assumptions and decisions

- Electron + React + TypeScript, packaged for macOS first.
- Native capture is behind a narrow adapter so ScreenCaptureKit/Swift can replace Electron capture if system-audio quality requires it.
- SQLite is the source of truth; schema migrations are versioned from the first commit.
- Media is stored as files beneath an application-managed project directory; only metadata and references live in SQLite.
- A provider interface isolates transcription, embeddings, and generation from any single cloud vendor.
- The initial pilot supports Apple silicon and the two latest major macOS versions available at development start.
- MVP interface language is English; transcript language may be selected per session when supported by the provider.
- Chat is project-scoped and secondary. There is no character/avatar; tone comes from restrained copy, pacing, and transparent memory behavior.

## 15. Inputs needed from the founder

These do not block the walking skeleton, but must be resolved before pilot distribution:

- Five to ten pilot musicians/producers and the DAWs they use.
- Whether system audio is essential for the first pilot or microphone + notes is acceptable initially.
- Cloud-processing policy: allowed providers, preferred data residency, and acceptable retention.
- Brand basics: final product name, wordmark/logo status, colors, and desired tone.
- A representative, non-sensitive sample session for evaluation.
- Apple Developer account access before signing/notarization; never share account passwords in chat.
- Written pilot consent language and jurisdiction-specific privacy review before recording real collaborators.

