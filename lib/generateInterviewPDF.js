import jsPDF from "jspdf";

// Palette pulled directly from the app's "Robotic AI Design System"
// (see DESIGN.md) so the exported report matches the on-screen terminal
// aesthetic instead of the old light/violet SaaS-report look.
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

const BG_PAGE = [14, 14, 18]; // #0e0e12 surface-container-lowest
const BG_PANEL = [19, 19, 23]; // #131317 surface
const BG_PANEL_ALT = [22, 22, 30]; // #16161e field / inset boxes
const BG_PANEL_RAISED = [27, 27, 32]; // #1b1b20 header banner
const DOT_COLOR = [28, 28, 33];

const TEXT = [228, 225, 232]; // #e4e1e8 on-surface
const TEXT_MUTED = [203, 195, 215]; // #cbc3d7 on-surface-variant
const TEXT_DIM = [149, 142, 160]; // #958ea0 outline

const BORDER = [73, 68, 84]; // #494454 outline-variant ("ghost border")

const PURPLE = [208, 188, 255]; // #d0bcff primary
const ON_PURPLE = [60, 0, 145]; // #3c0091 on-primary (dark text on purple fill)
const BLUE = [163, 201, 255]; // #a3c9ff secondary
const GREEN = [52, 211, 153]; // #34d399 good / "Active"
const RED = [248, 113, 113]; // #f87171 error / "Error"

// LED legend from the design system: green = active, purple = processing, red = error.
const scoreColor = (score, max) => {
  const pct = max ? (score / max) * 100 : 0;
  if (pct >= 76) return GREEN;
  if (pct >= 41) return PURPLE;
  return RED;
};

const REC_TIER = {
  Excellent: GREEN,
  Strong: GREEN,
  "Interview Ready": PURPLE,
  Developing: PURPLE,
  "Needs Improvement": RED,
};

const track = (s) => String(s).split("").join(" ");

export const generateInterviewPDF = (interview) => {
  const doc = new jsPDF();
  let y = 0;

  const setColor = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const setFill = (c) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c) => doc.setDrawColor(c[0], c[1], c[2]);

  // jsPDF pages are white by default — every new page needs the dark
  // surface + dot-matrix texture repainted before anything is drawn on it.
  const paintPageBackground = () => {
    setFill(BG_PAGE);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");
    setFill(DOT_COLOR);
    for (let dx = 5; dx < PAGE_W; dx += 8) {
      for (let dy = 5; dy < PAGE_H; dy += 8) {
        doc.rect(dx, dy, 0.4, 0.4, "F");
      }
    }
  };

  const drawPanel = (x, py, w, h, fill = BG_PANEL, r = 1.6) => {
    setFill(fill);
    setDraw(BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, py, w, h, r, r, "FD");
  };

  const continuationHeader = () => {
    setFill(PURPLE);
    doc.rect(0, 0, PAGE_W, 1.2, "F");
    setFill(BG_PANEL_RAISED);
    doc.rect(0, 1.2, PAGE_W, 12, "F");
    setDraw(BORDER);
    doc.setLineWidth(0.25);
    doc.line(0, 13.2, PAGE_W, 13.2);
    doc.setFont("courier", "bold");
    doc.setFontSize(8.5);
    setColor(PURPLE);
    doc.text(track("PREP_AI // INTERVIEW ASSESSMENT REPORT"), MARGIN, 8.6);
    y = 26;
  };

  const checkPageBreak = (spaceNeeded = 20) => {
    if (y + spaceNeeded > PAGE_H - 24) {
      doc.addPage();
      paintPageBackground();
      continuationHeader();
    }
  };

  const sectionHeader = (title) => {
    checkPageBreak(16);
    setFill(PURPLE);
    doc.rect(MARGIN, y - 4, 1.2, 5.4, "F");
    doc.setFont("courier", "bold");
    doc.setFontSize(11.5);
    setColor(PURPLE);
    doc.text(`// ${title}`, MARGIN + 4.5, y);
    y += 8.5;
  };

  const squareBullet = (x, yPos, color, size = 1.3) => {
    setFill(color);
    doc.rect(x, yPos - size, size, size, "F");
  };

  const statusChip = (text, x, yBaseline, tierColor, { fontSize = 9, align = "left" } = {}) => {
    doc.setFont("courier", "bold");
    doc.setFontSize(fontSize);
    const label = text.toUpperCase();
    const textW = doc.getTextWidth(label);
    const ledR = fontSize * 0.1;
    const padX = 3.4;
    const gap = 2.4;
    const h = fontSize * 0.62 + 3;
    const w = padX * 2 + ledR * 2 + gap + textW;
    const boxX = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    const boxY = yBaseline - h + 1.8;

    drawPanel(boxX, boxY, w, h, BG_PANEL_ALT, 1);

    const ledCx = boxX + padX + ledR;
    const ledCy = boxY + h / 2;
    setFill(tierColor);
    doc.circle(ledCx, ledCy, ledR, "F");

    setColor(TEXT);
    doc.text(label, ledCx + ledR + gap, yBaseline);
    return w;
  };

  const segmentedBar = (x, yTop, w, segments, filledCount, color, h = 3.2) => {
    const gap = 1;
    const segW = (w - gap * (segments - 1)) / segments;
    for (let i = 0; i < segments; i++) {
      setFill(i < filledCount ? color : BORDER);
      doc.rect(x + i * (segW + gap), yTop, segW, h, "F");
    }
  };

  // ============ PAGE 1 BACKGROUND ============
  paintPageBackground();

  // ============ HEADER BANNER ============
  setFill(PURPLE);
  doc.rect(0, 0, PAGE_W, 1.4, "F");
  setFill(BG_PANEL_RAISED);
  doc.rect(0, 1.4, PAGE_W, 38, "F");
  setDraw(BORDER);
  doc.setLineWidth(0.3);
  doc.line(0, 39.4, PAGE_W, 39.4);

  setDraw(PURPLE);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, 8, 30, 9, 0.8, 0.8);
  doc.setFont("courier", "bold");
  doc.setFontSize(10.5);
  setColor(PURPLE);
  doc.text("PREP_AI", MARGIN + 15, 13.7, { align: "center" });

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  setColor(TEXT_DIM);
  doc.text(track("// AI INTERVIEW ASSESSMENT REPORT"), MARGIN, 25);

  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  setColor(TEXT_DIM);
  const generatedLabel = `GENERATED ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase()}`;
  doc.text(track(generatedLabel), PAGE_W - MARGIN, 12, { align: "right" });

  const contextLabel = [interview.role, interview.difficulty].filter(Boolean).join("  //  ");
  if (contextLabel) {
    doc.setFont("courier", "bold");
    doc.setFontSize(9.5);
    setColor(TEXT);
    doc.text(contextLabel.toUpperCase(), PAGE_W - MARGIN, 22, { align: "right" });
  }

  y = 54;

  // ============ HERO: SCORE + RECOMMENDATION ============
  const feedback = interview.feedback || {};
  const finalScore = feedback.score ?? 0;
  const tierColor = scoreColor(finalScore, 100);
  const recColor = REC_TIER[feedback.recommendation] || PURPLE;

  const circleCx = PAGE_W - MARGIN - 16;
  const circleCy = y + 12;
  setFill(tierColor);
  doc.circle(circleCx, circleCy, 16, "F");
  setFill(BG_PANEL);
  doc.circle(circleCx, circleCy, 12.2, "F");
  doc.setFont("courier", "bold");
  doc.setFontSize(15);
  setColor(tierColor);
  doc.text(`${finalScore}`, circleCx, circleCy + 1.5, { align: "center" });
  doc.setFont("courier", "normal");
  doc.setFontSize(6.5);
  setColor(TEXT_DIM);
  doc.text("/ 100", circleCx, circleCy + 6, { align: "center" });

  doc.setFont("courier", "bold");
  doc.setFontSize(17);
  setColor(TEXT);
  doc.text(interview.role || "Interview Report", MARGIN, y + 4);

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  setColor(TEXT_MUTED);
  const completedLabel = interview.completedAt
    ? new Date(interview.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "in progress";
  doc.text(`${interview.difficulty || "—"}  //  ${interview.experience || "—"}  //  completed ${completedLabel}`, MARGIN, y + 10.5);

  statusChip(feedback.recommendation || "Pending", MARGIN, y + 23, recColor, { fontSize: 9.5 });

  y += 33;

  if (feedback.summary) {
    const summary = doc.splitTextToSize(feedback.summary, CONTENT_W);
    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    setColor(TEXT_MUTED);
    doc.text(summary, MARGIN, y);
    y += summary.length * 5 + 6;
  }

  y += 4;

  // ============ INTERVIEW INFORMATION PANEL ============
  sectionHeader("interview_information");

  const durationLabel = (() => {
    if (!interview.completedAt || !interview.createdAt) return "—";
    const ms = new Date(interview.completedAt) - new Date(interview.createdAt);
    if (ms <= 0) return "—";
    const mins = Math.floor(ms / 60000);
    const secs = Math.round((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  })();

  const infoRows = [
    ["ROLE", interview.role || "—", "DIFFICULTY", interview.difficulty || "—"],
    ["EXPERIENCE", interview.experience || "—", "COMPANY", interview.company || "General"],
    ["QUESTIONS ASKED", `${feedback.questionFeedback?.length ?? interview.questions?.length ?? 0}`, "DURATION", durationLabel],
  ];

  const ROW_H = 12.5;
  const skillsLines = interview.skills ? doc.splitTextToSize(interview.skills, CONTENT_W - 12) : [];
  const skillsBlockH = interview.skills ? 7 + skillsLines.length * 5 : 0;
  const infoPanelH = 8 + infoRows.length * ROW_H + skillsBlockH + 4;

  checkPageBreak(infoPanelH + 6);
  drawPanel(MARGIN, y, CONTENT_W, infoPanelH);

  let rowY = y + 8;
  infoRows.forEach(([l1, v1, l2, v2], i) => {
    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    setColor(TEXT_DIM);
    doc.text(track(l1), MARGIN + 6, rowY);
    doc.text(track(l2), MARGIN + 92, rowY);

    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    setColor(TEXT);
    doc.text(String(v1), MARGIN + 6, rowY + 5.2);
    doc.text(String(v2), MARGIN + 92, rowY + 5.2);

    if (i < infoRows.length - 1) {
      setDraw(BORDER);
      doc.setLineWidth(0.2);
      doc.line(MARGIN + 4, rowY + 7.5, MARGIN + CONTENT_W - 4, rowY + 7.5);
    }
    rowY += ROW_H;
  });

  if (interview.skills) {
    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    setColor(TEXT_DIM);
    doc.text(track("CORE SKILLS"), MARGIN + 6, rowY);
    doc.setFont("courier", "normal");
    doc.setFontSize(9.5);
    setColor(TEXT);
    doc.text(skillsLines, MARGIN + 6, rowY + 5.2);
  }

  y += infoPanelH + 12;

  // ============ COMPETENCY BREAKDOWN ============
  const metrics = feedback.metrics || {};
  const METRIC_MAX = 5; // metrics come back scored /5, not /10 — matches FeedbackReport.jsx
  const metricKeys = [
    { label: "Communication", score: metrics.communication?.score ?? 0 },
    { label: "Technical Knowledge", score: metrics.technicalKnowledge?.score ?? 0 },
    { label: "Confidence", score: metrics.confidence?.score ?? 0 },
    { label: "Problem Solving", score: metrics.problemSolving?.score ?? 0 },
  ];

  checkPageBreak(metricKeys.length * 10 + 22);
  sectionHeader("competency_breakdown");

  metricKeys.forEach((metric) => {
    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    setColor(TEXT_MUTED);
    doc.text(metric.label, MARGIN, y);

    const barColor = scoreColor(metric.score, METRIC_MAX);
    segmentedBar(MARGIN + 62, y - 3.4, 78, METRIC_MAX, Math.round(metric.score), barColor);

    doc.setFont("courier", "bold");
    setColor(barColor);
    doc.text(`${metric.score}/${METRIC_MAX}`, PAGE_W - MARGIN, y, { align: "right" });
    y += 10.5;
  });

  y += 5;

  // ============ STRENGTHS + IMPROVEMENTS ============
  const strengths = feedback.strengths || [];
  const weaknesses = feedback.weaknesses || [];
  const colW = (CONTENT_W - 6) / 2;

  const wrapList = (items, width) => {
    let lines = 0;
    const wrapped = items.map((item) => {
      const l = doc.splitTextToSize(item, width - 10);
      lines += l.length;
      return l;
    });
    return { wrapped, lines };
  };

  doc.setFont("courier", "normal");
  doc.setFontSize(8.5);
  const sWrap = wrapList(strengths.length ? strengths : ["No strengths identified."], colW);
  const wWrap = wrapList(weaknesses.length ? weaknesses : ["No weaknesses identified."], colW);
  const twoColH = Math.max(sWrap.lines, wWrap.lines) * 5 + 18;

  checkPageBreak(twoColH + 8);
  const colTopY = y;

  const drawListPanel = (x, title, accent, wrap) => {
    drawPanel(x, colTopY, colW, twoColH);

    doc.setFont("courier", "bold");
    doc.setFontSize(9.5);
    setColor(accent);
    doc.text(`// ${title}`, x + 6, colTopY + 8);

    let ly = colTopY + 15;
    doc.setFont("courier", "normal");
    doc.setFontSize(8.5);
    setColor(TEXT_MUTED);
    wrap.wrapped.forEach((lines) => {
      squareBullet(x + 6.5, ly - 2, accent);
      doc.text(lines, x + 10, ly);
      ly += lines.length * 5;
    });
  };

  drawListPanel(MARGIN, "key_strengths", GREEN, sWrap);
  drawListPanel(MARGIN + colW + 6, "areas_to_improve", PURPLE, wWrap);

  y = colTopY + twoColH + 12;

  // ============ 2-WEEK ROADMAP ============
  const roadmap = feedback.roadmap || [];
  if (roadmap.length > 0) {
    const roadCols = 2;
    const roadColW = (CONTENT_W - 6) / roadCols;
    const roadWraps = roadmap.map((r) => doc.splitTextToSize(r.goal || "", roadColW - 12));
    const rowHeights = [];
    for (let i = 0; i < roadmap.length; i += roadCols) {
      const rowItems = roadWraps.slice(i, i + roadCols);
      rowHeights.push(Math.max(...rowItems.map((w) => w.length)) * 4.6 + 20);
    }
    const roadmapH = rowHeights.reduce((a, b) => a + b + 4, 0);

    checkPageBreak(Math.min(roadmapH + 16, PAGE_H - 50));
    sectionHeader("two_week_roadmap");

    let rIdx = 0;
    for (let row = 0; row < rowHeights.length; row++) {
      checkPageBreak(rowHeights[row] + 6);
      const rowTop = y;
      for (let c = 0; c < roadCols && rIdx < roadmap.length; c++, rIdx++) {
        const item = roadmap[rIdx];
        const x = MARGIN + c * (roadColW + 6);
        drawPanel(x, rowTop, roadColW, rowHeights[row]);

        setFill(PURPLE);
        doc.rect(x + 5, rowTop + 4.5, 6, 6, "F");
        doc.setFont("courier", "bold");
        doc.setFontSize(8);
        setColor(ON_PURPLE);
        doc.text(`${rIdx + 1}`, x + 8, rowTop + 9, { align: "center" });

        doc.setFont("courier", "bold");
        doc.setFontSize(7.5);
        setColor(PURPLE);
        doc.text(track((item.day || "").toUpperCase()), x + 14, rowTop + 6.5);

        doc.setFont("courier", "bold");
        doc.setFontSize(9.5);
        setColor(TEXT);
        doc.text(item.topic || "", x + 14, rowTop + 11.5);

        doc.setFont("courier", "normal");
        doc.setFontSize(8);
        setColor(TEXT_MUTED);
        doc.text(roadWraps[rIdx], x + 6, rowTop + 18);
      }
      y = rowTop + rowHeights[row] + 4;
    }
    y += 6;
  }

  // ============ DETAILED QUESTION ANALYSIS ============
  const questionFeedback = feedback.questionFeedback || [];
  if (questionFeedback.length > 0) {
    checkPageBreak(20);
    sectionHeader("question_analysis");

    questionFeedback.forEach((item, index) => {
      const question = doc.splitTextToSize(item.question || "Question unavailable.", CONTENT_W - 14);
      const answer = doc.splitTextToSize(item.candidateAnswer || "No answer available.", CONTENT_W - 12);
      const ideal = doc.splitTextToSize(item.idealAnswer || "Not available.", CONTENT_W - 12);

      const qBlockHeight = 10 + question.length * 5;
      checkPageBreak(qBlockHeight + 20);

      const qColor = scoreColor(item.score ?? 0, 10);

      setFill(qColor);
      doc.rect(MARGIN, y - 5.5, 1.2, qBlockHeight + 2, "F");

      doc.setFont("courier", "bold");
      doc.setFontSize(10.5);
      setColor(TEXT);
      doc.text(`QUESTION ${index + 1}`, MARGIN + 5, y);

      statusChip(`${item.score ?? 0}/10`, PAGE_W - MARGIN, y, qColor, { fontSize: 8.5, align: "right" });

      y += 7;
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      setColor(TEXT_MUTED);
      doc.text(question, MARGIN + 5, y);
      y += question.length * 5 + 5;

      const answerBoxHeight = answer.length * 4.6 + 10;
      checkPageBreak(answerBoxHeight + 16);

      doc.setFont("courier", "bold");
      doc.setFontSize(7.5);
      setColor(TEXT_DIM);
      doc.text(track("YOUR ANSWER"), MARGIN, y);
      y += 4;

      drawPanel(MARGIN, y, CONTENT_W, answerBoxHeight, BG_PANEL_ALT, 1.2);
      doc.setFont("courier", "normal");
      doc.setFontSize(8.5);
      setColor(TEXT_MUTED);
      doc.text(answer, MARGIN + 5, y + 6);
      y += answerBoxHeight + 6;

      const idealBoxHeight = ideal.length * 4.6 + 10;
      checkPageBreak(idealBoxHeight + 16);

      doc.setFont("courier", "bold");
      doc.setFontSize(7.5);
      setColor(GREEN);
      doc.text(track("IDEAL ANSWER"), MARGIN, y);
      y += 4;

      drawPanel(MARGIN, y, CONTENT_W, idealBoxHeight, BG_PANEL_ALT, 1.2);
      doc.setFont("courier", "normal");
      doc.setFontSize(8.5);
      setColor(TEXT_MUTED);
      doc.text(ideal, MARGIN + 5, y + 6);
      y += idealBoxHeight + 10;

      if (index < questionFeedback.length - 1) {
        setDraw(BORDER);
        doc.setLineWidth(0.3);
        doc.line(MARGIN, y - 4, PAGE_W - MARGIN, y - 4);
      }
    });
  }

  // ============ FOOTER (all pages) ============
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    setDraw(BORDER);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_H - 16, PAGE_W - MARGIN, PAGE_H - 16);

    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    setColor(TEXT_DIM);
    doc.text(track("POWERED BY PREP_AI"), MARGIN, PAGE_H - 10);
    doc.text(track(`PAGE ${i} OF ${totalPages}`), PAGE_W - MARGIN, PAGE_H - 10, { align: "right" });
  }

  const fileRole = (interview.role || "report").replace(/[^a-z0-9]+/gi, "_");
  doc.save(`PrepAI_${fileRole}_Report.pdf`);
};
