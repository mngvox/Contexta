import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

process.on("uncaughtException", (error) => {
  console.error("SHORT_ERROR:", error?.message ?? String(error));
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.error("SHORT_REJECTION:", error?.message ?? String(error));
  process.exit(1);
});

const ROOT = "/Users/ahmed/Documents/Contexta";
const SKILL_DIR = "/Users/ahmed/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations";
const TMP_DIR = path.join(ROOT, "tmp/pitch-deck-build");
const FINAL_PPTX = path.join(ROOT, "output/pptx/Contexta_Music_Session_Continuity_Decision_Deck.pptx");
const SOURCE_PPTX = "/Users/ahmed/Downloads/Contexta_Creative_Continuity_Core_Deck.pptx";
const RUNTIME_PYTHON = "/Users/ahmed/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";

const { finalizePresentation } = await import(
  pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href,
);

const W = 1280;
const H = 720;
const C = {
  navy: "#0E1729",
  navy2: "#111F36",
  ink: "#111827",
  slate: "#5B667A",
  mist: "#F5F7FB",
  white: "#FFFFFF",
  line: "#D8E0EB",
  cyan: "#12BFE5",
  blue: "#2867E8",
  violet: "#7B3FF2",
  green: "#13B981",
  amber: "#F4A62A",
  paleBlue: "#EAF2FF",
  paleCyan: "#E8FAFE",
  paleViolet: "#F2EBFF",
  paleGreen: "#E8F8F2",
};
const FONT = "Aptos";
const DISPLAY = "Aptos Display";

await fs.mkdir(TMP_DIR, { recursive: true });
await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

const presentation = Presentation.create({ slideSize: { width: W, height: H } });

function shape(slide, geometry, x, y, w, h, fill, lineFill = "none", radius = undefined) {
  return slide.shapes.add({
    geometry,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { fill: lineFill, width: lineFill === "none" ? 0 : 1 },
    ...(radius ? { borderRadius: radius } : {}),
  });
}

function text(slide, value, x, y, w, h, opts = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  box.text = value;
  box.text.style = {
    typeface: opts.typeface ?? FONT,
    fontSize: opts.size ?? 22,
    bold: opts.bold ?? false,
    color: opts.color ?? C.ink,
    autoFit: opts.autoFit ?? "shrinkText",
    horizontalAlignment: opts.align ?? "left",
    verticalAlignment: opts.valign ?? "middle",
    ...opts.style,
  };
  return box;
}

function line(slide, x1, y1, x2, y2, color = C.line, width = 2) {
  return slide.shapes.add({
    geometry: "line",
    position: { left: Math.min(x1, x2), top: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) },
    fill: "none",
    line: { fill: color, width },
  });
}

function pill(slide, label, x, y, w, fill, color = C.ink) {
  shape(slide, "roundRect", x, y, w, 28, fill, "none", 14);
  text(slide, label, x, y + 1, w, 26, { size: 12, bold: true, color, align: "center" });
}

function base(slide, title, kicker, dark = false, page = "") {
  slide.background.fill = dark ? C.navy : C.mist;
  text(slide, kicker.toUpperCase(), 62, 34, 760, 22, {
    size: 12, bold: true, color: dark ? C.cyan : C.blue,
  });
  text(slide, title, 62, 58, 1130, 58, {
    typeface: DISPLAY, size: 34, bold: true, color: dark ? C.white : C.ink,
  });
  text(slide, "Contexta  |  Music Session Continuity", 62, 684, 400, 16, {
    size: 9, color: dark ? "#91A0BA" : "#8B96A8",
  });
  text(slide, page, 1175, 684, 42, 16, {
    size: 9, color: dark ? "#91A0BA" : "#8B96A8", align: "right",
  });
}

function addImage(slide, filePath, x, y, w, h, alt, fit = "cover") {
  return fs.readFile(filePath).then((bytes) => slide.images.add({
    blob: bytes,
    contentType: "image/png",
    alt,
    fit,
    geometry: "roundRect",
    borderRadius: "rounded-xl",
    position: { left: x, top: y, width: w, height: h },
  }));
}

// 1. Cover
{
  const slide = presentation.slides.add();
  slide.background.fill = C.navy;
  shape(slide, "ellipse", 790, 78, 390, 390, "#121F35", "#2B3952");
  shape(slide, "ellipse", 880, 168, 210, 210, C.cyan, "none");
  shape(slide, "ellipse", 930, 218, 110, 110, C.navy, "none");
  text(slide, "contexta", 62, 66, 380, 72, { typeface: DISPLAY, size: 47, bold: true, color: C.white });
  pill(slide, "PARTNER DECISION DECK", 62, 166, 190, C.cyan, C.navy);
  text(slide, "Music Session\nContinuity", 62, 218, 650, 156, {
    typeface: DISPLAY, size: 60, bold: true, color: C.white,
  });
  text(slide, "From promising concept to a focused 90-day proof", 64, 397, 610, 42, {
    size: 23, color: "#C7D1E0",
  });
  line(slide, 64, 482, 610, 482, "#30405A", 1);
  text(slide, "Decision required", 64, 510, 220, 25, { size: 13, bold: true, color: C.cyan });
  text(slide, "Approve the product route, MVP boundary and validation gates", 64, 540, 610, 50, { size: 20, color: C.white });
  text(slide, "September 2026", 64, 665, 220, 18, { size: 10, color: "#91A0BA" });
  slide.speakerNotes.textFrame.setText("This deck updates the original Contexta concept for a partner decision. It narrows the first use case to Music Session Continuity and proposes a staged route with explicit validation gates.");
}

// 2. The wedge
{
  const slide = presentation.slides.add();
  base(slide, "The first wedge is brutally specific", "Brief recap", false, "02");
  text(slide, "Contexta preserves the decisions, experiments and intent that disappear between music sessions.", 62, 128, 1110, 48, { size: 24, color: C.slate });
  const cards = [
    ["Before", "A project reopens with files, but no usable memory of why choices were made.", C.paleViolet, C.violet],
    ["During", "Contexta captures selected evidence and structures moments without interrupting flow.", C.paleCyan, C.cyan],
    ["Next session", "A cited briefing returns the creator to the exact creative edge in under two minutes.", C.paleGreen, C.green],
  ];
  cards.forEach(([head, body, fill, accent], i) => {
    const x = 62 + i * 389;
    shape(slide, "roundRect", x, 215, 350, 255, fill, "none", 18);
    shape(slide, "roundRect", x + 22, 238, 54, 54, accent, "none", 14);
    text(slide, String(i + 1).padStart(2, "0"), x + 22, 239, 54, 52, { size: 17, bold: true, color: C.white, align: "center" });
    text(slide, head, x + 22, 312, 300, 32, { size: 23, bold: true });
    text(slide, body, x + 22, 358, 302, 78, { size: 17, color: C.slate });
  });
  shape(slide, "roundRect", 62, 512, 1116, 112, C.navy, "none", 16);
  text(slide, "THE TEST", 86, 531, 120, 24, { size: 12, bold: true, color: C.cyan });
  text(slide, "Can a musician reopen one representative project and recover the last session’s state, reasoning and next moves in under two minutes?", 86, 558, 1046, 48, { size: 22, bold: true, color: C.white });
  slide.speakerNotes.textFrame.setText("The product is still a continuity layer, not another chatbot. The wedge is one repeatable job: reopen a music project and recover what matters quickly. The under-two-minute target is the central MVP success criterion.");
}

// 3. UX principle
{
  const slide = presentation.slides.add();
  base(slide, "A workspace first, chat in support", "Product experience", false, "03");
  text(slide, "The interface should feel like a session desk, not a character and not a blank prompt box.", 62, 118, 1120, 34, { size: 20, color: C.slate });
  await addImage(slide, path.join(ROOT, "design/contexta-music-session-ui-concept.png"), 62, 174, 805, 450, "Contexta music session workspace showing projects, timeline, briefing and assistant rail");
  const points = [
    ["Timeline is primary", "Evidence, decisions and changes remain inspectable."],
    ["Briefing is actionable", "Resume state, unresolved questions and next moves."],
    ["Chat is contextual", "A compact rail to query or correct the active memory."],
    ["Presence is quiet", "An abstract signal shows status without becoming a mascot."],
  ];
  points.forEach(([h, b], i) => {
    const y = 178 + i * 103;
    shape(slide, "ellipse", 900, y + 4, 28, 28, i === 3 ? C.violet : C.cyan, "none");
    text(slide, String(i + 1), 900, y + 4, 28, 28, { size: 12, bold: true, color: C.white, align: "center" });
    text(slide, h, 944, y, 258, 28, { size: 17, bold: true });
    text(slide, b, 944, y + 32, 258, 48, { size: 14, color: C.slate });
  });
  slide.speakerNotes.textFrame.setText("First impression: Contexta should not imitate ChatGPT or present a character. The core object is the project session and its evidence timeline. Chat is valuable as a secondary control surface for asking, correcting and retrieving.");
}

// 4. Workflow
{
  const slide = presentation.slides.add();
  base(slide, "The continuity loop is the product", "How it works", false, "04");
  text(slide, "Every stage must preserve provenance and give the creator control over what leaves the device.", 62, 118, 1120, 34, { size: 20, color: C.slate });
  const stages = [
    ["1", "Capture", "Selected audio, transport, markers and notes", C.cyan],
    ["2", "Process locally", "Transcribe, index, classify and redact", C.green],
    ["3", "Privacy gate", "Apply policy and ask before cloud use", C.amber],
    ["4", "Reason", "Use local or paid AI based on task need", C.violet],
    ["5", "Write memory", "Store decisions with source and confidence", C.blue],
    ["6", "Resume", "Brief the next session and cite the evidence", C.cyan],
  ];
  stages.forEach(([n, h, b, accent], i) => {
    const x = 62 + (i % 3) * 389;
    const y = 194 + Math.floor(i / 3) * 205;
    shape(slide, "roundRect", x, y, 350, 154, C.white, C.line, 16);
    shape(slide, "ellipse", x + 20, y + 20, 40, 40, accent, "none");
    text(slide, n, x + 20, y + 20, 40, 40, { size: 15, bold: true, color: C.white, align: "center" });
    text(slide, h, x + 76, y + 16, 245, 36, { size: 21, bold: true });
    text(slide, b, x + 22, y + 76, 300, 56, { size: 15, color: C.slate });
    if (i % 3 !== 2) line(slide, x + 350, y + 77, x + 389, y + 77, C.blue, 3);
  });
  line(slide, 1120, 348, 1120, 399, C.blue, 3);
  line(slide, 1120, 399, 1060, 399, C.blue, 3);
  line(slide, 62, 553, 1178, 553, C.line, 1);
  text(slide, "Design rule", 62, 574, 120, 24, { size: 12, bold: true, color: C.blue });
  text(slide, "No summary without sources. No cloud task without a visible policy decision.", 190, 566, 900, 42, { size: 22, bold: true });
  slide.speakerNotes.textFrame.setText("This workflow is the system boundary. Capture is selective, local preprocessing happens first, the privacy gate decides whether any external model is needed, and every stored memory retains its evidence. Local capability references: https://developer.apple.com/documentation/CoreML and https://developer.apple.com/documentation/FoundationModels");
}

// 5. Privacy and routing UI
{
  const slide = presentation.slides.add();
  base(slide, "Local by default, cloud by exception", "Privacy and AI routing", true, "05");
  text(slide, "Complexity, sensitivity, urgency and user preference determine the route.", 62, 118, 1120, 34, { size: 20, color: "#B9C4D5" });
  await addImage(slide, path.join(ROOT, "design/deck/contexta-privacy-routing-ui.png"), 62, 170, 820, 462, "Contexta privacy and AI routing UI with on-device, private cloud and approval stages");
  const split = [
    ["On device", "Capture controls\nTranscription and indexing\nRedaction and search\nShort summaries", C.cyan],
    ["Cloud, when approved", "Long-context synthesis\nHard reasoning\nOptional multimodal analysis\nProvider selected by policy", C.violet],
  ];
  split.forEach(([h, b, accent], i) => {
    const y = 180 + i * 208;
    shape(slide, "roundRect", 920, y, 290, 176, C.navy2, "#31425E", 16);
    shape(slide, "roundRect", 940, y + 20, 8, 54, accent, "none", 4);
    text(slide, h, 966, y + 18, 218, 34, { size: 20, bold: true, color: C.white });
    text(slide, b, 966, y + 62, 220, 94, { size: 15, color: "#C6D0DE" });
  });
  pill(slide, "RAW AUDIO STAYS LOCAL", 928, 596, 244, "#143545", C.cyan);
  slide.speakerNotes.textFrame.setText("The MVP should not depend on one AI provider. It should route tasks, not consumer subscriptions. User subscriptions do not automatically grant API access, so provider connections should be explicit BYOK integrations later. Core ML and Apple Foundation Models support on-device execution for suitable tasks: https://developer.apple.com/documentation/CoreML and https://developer.apple.com/documentation/FoundationModels");
}

// 6. Ableton integration
{
  const slide = presentation.slides.add();
  base(slide, "Desktop memory, Link timing, thin plugin bridge", "Ableton and Endlesss", false, "06");
  text(slide, "Do not make the plugin carry the whole product. Keep memory and privacy in the companion app.", 62, 118, 1120, 34, { size: 20, color: C.slate });
  await addImage(slide, path.join(ROOT, "design/deck/contexta-ableton-bridge-ui.png"), 62, 170, 780, 438, "Contexta Bridge plugin synchronized to a companion session timeline");
  const layers = [
    ["Desktop core", "Owns encrypted memory, search, routing and session briefings", C.blue],
    ["Ableton Link", "Shares tempo, beat, phase and optional start or stop state", C.cyan],
    ["VST3 or AU bridge", "Adds host transport anchors and a manual mark-moment control", C.violet],
  ];
  layers.forEach(([h, b, accent], i) => {
    const y = 178 + i * 132;
    shape(slide, "roundRect", 878, y, 332, 112, C.white, C.line, 14);
    shape(slide, "roundRect", 878, y, 10, 112, accent, "none", 5);
    text(slide, h, 908, y + 14, 270, 28, { size: 19, bold: true });
    text(slide, b, 908, y + 46, 270, 52, { size: 14, color: C.slate });
  });
  text(slide, "Recommended order", 878, 593, 150, 18, { size: 11, bold: true, color: C.blue });
  text(slide, "Core + Link first. Plugin after the workflow proves useful.", 878, 613, 332, 42, { size: 17, bold: true });
  slide.speakerNotes.textFrame.setText("Ableton Link synchronizes tempo, beat, phase and start or stop state across peers, but it does not transmit project memory: https://ableton.github.io/link/. Ableton Live supports VST3 and Audio Unit plug-ins: https://www.ableton.com/en/manual/working-with-instruments-and-effects/. Endlesss Studio supports Link in standalone mode and follows host transport in plug-in mode: https://static.endlesss.fm/assets/docs/Endlesss%20Studio%20User%20Guide%201.3.0.pdf");
}

// 7. Route options table
{
  const slide = presentation.slides.add();
  base(slide, "Three possible routes, one recommended", "Decision routes", false, "07");
  text(slide, "Choose the smallest route that proves continuity before expanding integration surface area.", 62, 118, 1120, 34, { size: 20, color: C.slate });
  const table = slide.tables.add({
    rows: 4,
    columns: 6,
    left: 62,
    top: 178,
    width: 1156,
    height: 330,
    columnWidths: [208, 255, 120, 150, 145, 278],
    values: [
      ["Route", "What ships", "Time", "Cost shape", "Risk", "Best use"],
      ["A  Desktop only", "Session capture, memory, briefing", "6 to 8 wks", "Lowest", "Medium", "Fastest workflow test"],
      ["B  Core + Link", "Desktop route plus beat and tempo sync", "10 to 12 wks", "Controlled", "Lowest", "Recommended MVP"],
      ["C  Full platform", "Desktop, plugin, mobile, multi-provider", "6 to 12 mos", "Highest", "Highest", "Only after product proof"],
    ],
  });
  table.styleOptions = { headerRow: true, bandedRows: false };
  table.borders.assign({ style: "solid", fill: C.line, width: 1 });
  for (let c = 0; c < 6; c++) {
    const cell = table.getCell(0, c);
    cell.fill = C.navy;
    cell.text.style = "Body";
    cell.text.style = { typeface: FONT, fontSize: 14, bold: true, color: C.white };
  }
  for (let r = 1; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      const cell = table.getCell(r, c);
      cell.fill = r === 2 ? C.paleBlue : C.white;
      cell.text.style = { typeface: FONT, fontSize: 14, bold: c === 0 || (r === 2 && c === 5), color: c === 0 ? C.ink : C.slate };
    }
  }
  table.getCell(2, 0).fill = C.blue;
  table.getCell(2, 0).text.style = { typeface: FONT, fontSize: 14, bold: true, color: C.white };
  shape(slide, "roundRect", 62, 548, 1156, 90, C.navy, "none", 16);
  text(slide, "RECOMMENDATION", 86, 563, 170, 22, { size: 12, bold: true, color: C.cyan });
  text(slide, "Fund Route B with two hard gates: continuity value at week 6 and reliable Link sync at week 10.", 86, 588, 1072, 34, { size: 21, bold: true, color: C.white });
  slide.speakerNotes.textFrame.setText("Route B creates a meaningful musical advantage without taking on the cost and compatibility burden of a full plug-in ecosystem. The durations are planning ranges for a focused founder-led proof and should be converted into a budget only after team capacity is agreed.");
}

// 8. 90-day plan
{
  const slide = presentation.slides.add();
  base(slide, "A 90-day proof with decision gates", "Milestones", false, "08");
  text(slide, "Ship one end-to-end loop, test it in a representative project, then earn the right to broaden scope.", 62, 118, 1120, 34, { size: 20, color: C.slate });
  const phases = [
    ["Weeks 1–2", "Instrument", "Define memory schema\nWire capture controls\nSet lock and sleep behavior", C.cyan],
    ["Weeks 3–6", "Prove continuity", "Local transcript and events\nEvidence timeline\nResume briefing", C.green],
    ["Weeks 7–10", "Add musical sync", "Ableton Link peer\nBeat-aware anchors\nEndlesss compatibility test", C.blue],
    ["Weeks 11–13", "Validate", "Five repeat users\nMeasure resume time\nDecide plugin investment", C.violet],
  ];
  phases.forEach(([when, h, b, accent], i) => {
    const x = 62 + i * 289;
    shape(slide, "roundRect", x, 196, 260, 300, C.white, C.line, 16);
    shape(slide, "roundRect", x, 196, 260, 10, accent, "none", 5);
    pill(slide, when, x + 20, 224, 110, accent, C.white);
    text(slide, h, x + 20, 272, 220, 34, { size: 22, bold: true });
    text(slide, b, x + 20, 322, 220, 120, { size: 16, color: C.slate });
    if (i < 3) line(slide, x + 260, 348, x + 289, 348, C.blue, 3);
  });
  const metrics = [
    ["< 2 min", "median time to useful resume"],
    ["> 70%", "briefings accepted with minor edits"],
    ["5 users", "repeat across three sessions each"],
    ["0 leaks", "cloud sends without approval"],
  ];
  metrics.forEach(([v, l], i) => {
    const x = 62 + i * 289;
    text(slide, v, x, 546, 118, 32, { size: 24, bold: true, color: i === 3 ? C.violet : C.blue });
    text(slide, l, x + 126, 543, 134, 42, { size: 13, color: C.slate });
  });
  shape(slide, "roundRect", 62, 608, 1156, 42, C.paleBlue, "none", 12);
  text(slide, "Gate at day 90: continue only if repeat use and resume-time targets are met.", 82, 611, 1116, 34, { size: 18, bold: true, color: C.blue, align: "center" });
  slide.speakerNotes.textFrame.setText("The milestone plan prioritizes observable user value. A representative session means one real Ableton or Endlesss project that is used repeatedly across at least three sessions, with enough changes and decisions to test whether Contexta can reconstruct the state accurately.");
}

// 9. Decision
{
  const slide = presentation.slides.add();
  base(slide, "The decision to make today", "Partner commitment", true, "09");
  text(slide, "Approve the proof, define the boundary and name the owners.", 62, 118, 1120, 34, { size: 21, color: "#B9C4D5" });
  const decisions = [
    ["01", "Product route", "Desktop core + Ableton Link. Defer the plugin until the continuity loop is validated."],
    ["02", "MVP boundary", "One Mac, one representative project, selected-window capture, local-first processing."],
    ["03", "Operating model", "Name product and engineering owners, agree a budget ceiling, review demos weekly."],
    ["04", "Go or stop gate", "Day 90 decision based on repeat use, resume time, briefing acceptance and privacy."],
  ];
  decisions.forEach(([n, h, b], i) => {
    const y = 182 + i * 100;
    shape(slide, "ellipse", 64, y + 4, 42, 42, i === 0 ? C.cyan : C.blue, "none");
    text(slide, n, 64, y + 4, 42, 42, { size: 13, bold: true, color: C.white, align: "center" });
    text(slide, h, 128, y, 230, 30, { size: 20, bold: true, color: C.white });
    text(slide, b, 372, y - 3, 780, 54, { size: 17, color: "#C5CFDD" });
    if (i < 3) line(slide, 128, y + 67, 1150, y + 67, "#2B3952", 1);
  });
  shape(slide, "roundRect", 62, 602, 1116, 62, C.blue, "none", 14);
  text(slide, "Recommended motion: approve Route B and begin the 90-day proof with weekly partner reviews.", 86, 611, 1068, 42, { size: 22, bold: true, color: C.white, align: "center" });
  slide.speakerNotes.textFrame.setText("The meeting should end with named owners, an agreed budget ceiling and access to one representative project. Do not broaden into mobile, enterprise, a multi-provider marketplace or a full plug-in ecosystem during the proof.");
}

const stagingDir = path.join(TMP_DIR, ".codex-finalizer");
await fs.mkdir(stagingDir, { recursive: true });
const candidatePath = path.join(stagingDir, "candidate.pptx");
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const sourceBytes = await fs.readFile(SOURCE_PPTX);
const sourceSha256 = crypto.createHash("sha256").update(sourceBytes).digest("hex");
const requirements = {
  explicitTotalSlideCount: 9,
  requiredNativeTableOwnerSlides: [7],
  requiredNativeChartOwnerSlides: [],
};
const result = await finalizePresentation({
  ...requirements,
  workspaceDir: ROOT,
  candidatePath,
  finalPath: FINAL_PPTX,
  pythonExecutable: RUNTIME_PYTHON,
  integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "12192000,6858000",
    "--validate-bullet-geometry",
    "--validate-heading-fit",
    "--require-native-table-slide", "7",
  ],
  requiredNativeTableOwnerSlides: [7],
  fontPolicy: {
    basis: "reference",
    families: ["Aptos", "Aptos Display"],
    referencePath: SOURCE_PPTX,
    referenceSha256: sourceSha256,
  },
  verifyArtifactToolImport: true,
  receiptPath: path.join(ROOT, "output/validation/Contexta_Music_Session_Continuity_Decision_Deck.validation.json"),
});

console.log(JSON.stringify({ final: FINAL_PPTX, result }, null, 2));
