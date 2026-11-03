import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "afterglow",
    title: "Afterglow",
    subtitle: "Dream pop single · 112 BPM",
    color: "#c6a7ff",
    updatedAt: "Today, 1:42 AM",
    sessions: [
      {
        id: "s3", title: "Vocal textures", date: "Today, 12:18 AM", duration: "1h 24m", status: "complete",
        summary: "Found the emotional center of the bridge and committed to the close, doubled vocal. The wide chorus stack still needs a cleaner high harmony.",
        memories: [
          { id: "m1", kind: "decision", title: "Keep the bridge intimate", detail: "Close lead vocal, almost whispered. No octave double until the last line.", timestamp: "00:31:08" },
          { id: "m2", kind: "reference", title: "Vocal texture", detail: "The soft, compressed closeness of Billie Eilish — without the stacked whisper effect.", timestamp: "00:36:42" },
          { id: "m3", kind: "idea", title: "Try a high harmony", detail: "Bring it in only on ‘we were made of light’ during the final chorus.", timestamp: "01:02:17" },
          { id: "m4", kind: "question", title: "Chorus stack feels cloudy", detail: "Revisit the third harmony and reduce the 300–500 Hz buildup.", timestamp: "01:17:55" },
        ],
      },
      {
        id: "s2", title: "Arrangement pass", date: "Sep 5", duration: "2h 06m", status: "complete",
        summary: "Simplified the second verse and introduced the synth pulse after eight bars. Removed the half-time outro.",
        memories: [
          { id: "m5", kind: "decision", title: "Synth enters late", detail: "Hold the pulse until bar 9 so the second verse has room to breathe.", timestamp: "00:48:21" },
          { id: "m6", kind: "idea", title: "Half-time outro", detail: "Rejected — made the ending feel too resolved and heavy.", timestamp: "01:44:10" },
        ],
      },
      {
        id: "s1", title: "First sketch", date: "Sep 2", duration: "46m", status: "complete",
        summary: "Captured the main progression, tempo and first-pass chorus melody.",
        memories: [
          { id: "m7", kind: "decision", title: "Tempo: 112 BPM", detail: "Fast enough to move, slow enough to leave air around the vocal.", timestamp: "00:12:43" },
        ],
      },
    ],
  },
  { id: "blue-hour", title: "Blue Hour", subtitle: "EP opener · Writing", color: "#76b8e8", updatedAt: "Sep 4", sessions: [] },
  { id: "polaroid", title: "Polaroid Weather", subtitle: "Collaboration · Mix", color: "#efaa78", updatedAt: "Aug 29", sessions: [] },
];
