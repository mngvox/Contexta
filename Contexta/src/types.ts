export type MemoryKind = "decision" | "idea" | "reference" | "question";

export type Memory = {
  id: string;
  kind: MemoryKind;
  title: string;
  detail: string;
  timestamp: string;
};

export type Session = {
  id: string;
  title: string;
  date: string;
  duration: string;
  summary: string;
  status?: "complete" | "active";
  memories: Memory[];
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  updatedAt: string;
  sessions: Session[];
};
