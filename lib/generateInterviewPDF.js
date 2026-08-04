import jsPDF from "jspdf";

const PAGE_W = 210;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2; // 170

const INK = [17, 24, 39];
const BODY = [75, 85, 99];
const MUTED = [107, 114, 128];
const BORDER = [229, 231, 235];
const CARD_BG = [249, 250, 251];

const VIOLET = [124, 58, 237];
const VIOLET_DARK = [76, 29, 149];
const VIOLET_TINT = [237, 233, 254];

const GREEN = [16, 185, 129];
const GREEN_TINT = [209, 250, 229];
const AMBER = [245, 158, 11];
const AMBER_TINT = [254, 243, 199];
const RED = [239, 68, 68];
const RED_TINT = [254, 226, 226];
const BLUE = [59, 130, 246];
const BLUE_TINT = [219, 234, 254];

const REC_STYLE = {
  "Excellent": { fg: [6, 95, 70], bg: GREEN_TINT },
  "Strong": { fg: [21, 128, 61], bg: GREEN_TINT },
  "Interview Ready": { fg: [30, 64, 175], bg: BLUE_TINT },
  "Developing": { fg: [146, 64, 14], bg: AMBER_TINT },
  "Needs Improvement": { fg: [153, 27, 27], bg: RED_TINT },
};

const scoreColor = (score, max = 10) => {
  const pct = score / max;
  if (pct >= 0.75) return GREEN;
  if (pct >= 0.5) return AMBER;
  return RED;
};

const scoreTint = (score, max = 10) => {
  const pct = score / max;
  if (pct >= 0.75) return GREEN_TINT;
  if (pct >= 0.5) return AMBER_TINT;
  return RED_TINT;
};

export const generateInterviewPDF = (interview) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 0;

  const setColor = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const setFill = (c) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c) => doc.setDrawColor(c[0], c[1], c[2]);

  const continuationHeader = () => {
    setFill(VIOLET_DARK);
    doc.rect(0, 0, PAGE_W, 16, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor([255, 255, 255]);
    doc.text("PrepAI — Interview Assessment Report", MARGIN, 10.5);
    y = 28;
  };

  const checkPageBreak = (spaceNeeded = 20) => {
    if (y + spaceNeeded > pageHeight - 26) {
      doc.addPage();
      continuationHeader();
    }
  };

  const sectionTitle = (title, accent = VIOLET) => {
    checkPageBreak(18);
    setFill(accent);
    doc.rect(MARGIN, y - 4.2, 1.4, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    setColor(INK);
    doc.text(title, MARGIN + 5, y);
    y += 9;
  };

  const badge = (text, x, yPos, style, fontSize = 9, align = "left") => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    const textW = doc.getTextWidth(text);
    const padX = 3.2;
    const w = textW + padX * 2;
    const h = fontSize * 0.5 + 3.2;
    const boxX = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    setFill(style.bg);
    doc.roundedRect(boxX, yPos - h + 1.2, w, h, h / 2, h / 2, "F");
    setColor(style.fg);
    doc.text(text, boxX + w / 2, yPos, { align: "center" });
    return w;
  };

  // ============ HEADER BANNER ============
  setFill(VIOLET);
  doc.rect(0, 0, PAGE_W, 2, "F");
  setFill(VIOLET_DARK);
  doc.rect(0, 2, PAGE_W, 40, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  setColor([255, 255, 255]);
  doc.text("PrepAI", MARGIN, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  setColor([216, 197, 255]);
  doc.text("AI Interview Assessment Report", MARGIN, 28);

  doc.setFontSize(8.5);
  setColor([200, 180, 250]);
  const generatedLabel = `Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`;
  doc.text(generatedLabel, PAGE_W - MARGIN, 15, { align: "right" });

  const contextLabel = [interview.role, interview.difficulty].filter(Boolean).join("  ·  ");
  if (contextLabel) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor([255, 255, 255]);
    doc.text(contextLabel, PAGE_W - MARGIN, 26, { align: "right" });
  }

  y = 56;

  // ============ HERO: SCORE + RECOMMENDATION ============
  const feedback = interview.feedback || {};
  const finalScore = feedback.score ?? 0;
  const tierColor = finalScore >= 80 ? GREEN : finalScore >= 60 ? AMBER : RED;
  const recStyle = REC_STYLE[feedback.recommendation] || { fg: VIOLET_DARK, bg: VIOLET_TINT };

  const circleCx = PAGE_W - MARGIN - 16;
  const circleCy = y + 14;
  setFill(tierColor);
  doc.circle(circleCx, circleCy, 16, "F");
  setFill([255, 255, 255]);
  doc.circle(circleCx, circleCy, 11.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  setColor(tierColor);
  doc.text(`${finalScore}`, circleCx, circleCy + 1.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  setColor(MUTED);
  doc.text("/ 100", circleCx, circleCy + 6, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  setColor(INK);
  doc.text(interview.role || "Interview Report", MARGIN, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setColor(MUTED);
  const completedLabel = interview.completedAt
    ? new Date(interview.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "In progress";
  doc.text(`${interview.difficulty || "—"}  ·  ${interview.experience || "—"}  ·  completed ${completedLabel}`, MARGIN, y + 12.5);

  badge(feedback.recommendation || "Pending", MARGIN, y + 23, recStyle, 9.5);

  y += 34;

  if (feedback.summary) {
    const summary = doc.splitTextToSize(feedback.summary, CONTENT_W);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setColor(BODY);
    doc.text(summary, MARGIN, y);
    y += summary.length * 5.2 + 6;
  }

  y += 4;

  // ============ INTERVIEW INFORMATION CARD ============
  sectionTitle("Interview Information");

  const durationLabel = (() => {
    if (!interview.completedAt || !interview.createdAt) return "—";
    const ms = new Date(interview.completedAt) - new Date(interview.createdAt);
    if (ms <= 0) return "—";
    const mins = Math.floor(ms / 60000);
    const secs = Math.round((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  })();

  const infoRows = [
    ["Role", interview.role || "—", "Difficulty", interview.difficulty || "—"],
    ["Experience", interview.experience || "—", "Company", interview.company || "General"],
    ["Questions asked", `${feedback.questionFeedback?.length ?? interview.questions?.length ?? 0}`, "Duration", durationLabel],
  ];

  const ROW_H = 12.5;
  const skillsLines = interview.skills ? doc.splitTextToSize(interview.skills, CONTENT_W - 12) : [];
  const skillsBlockH = interview.skills ? 7 + skillsLines.length * 5 : 0;
  const infoCardH = 8 + infoRows.length * ROW_H + skillsBlockH + 6;

  checkPageBreak(infoCardH + 6);
  setFill(CARD_BG);
  setDraw(BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, infoCardH, 2.5, 2.5, "FD");

  let rowY = y + 8;
  infoRows.forEach(([l1, v1, l2, v2]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setColor(MUTED);
    doc.text(l1.toUpperCase(), MARGIN + 6, rowY);
    doc.text(l2.toUpperCase(), MARGIN + 92, rowY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setColor(INK);
    doc.text(String(v1), MARGIN + 6, rowY + 5);
    doc.text(String(v2), MARGIN + 92, rowY + 5);
    rowY += ROW_H;
  });

  if (interview.skills) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setColor(MUTED);
    doc.text("CORE SKILLS", MARGIN + 6, rowY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setColor(INK);
    doc.text(skillsLines, MARGIN + 6, rowY + 5);
  }

  y += infoCardH + 12;

  // ============ SKILL BREAKDOWN ============
  const metrics = feedback.metrics || {};
  const metricKeys = [
    { label: "Communication", score: metrics.communication?.score ?? 0 },
    { label: "Technical Knowledge", score: metrics.technicalKnowledge?.score ?? 0 },
    { label: "Confidence", score: metrics.confidence?.score ?? 0 },
    { label: "Problem Solving", score: metrics.problemSolving?.score ?? 0 },
  ];

  checkPageBreak(metricKeys.length * 9 + 22);
  sectionTitle("Competency Breakdown");

  metricKeys.forEach((metric) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setColor(BODY);
    doc.text(metric.label, MARGIN, y);

    const barColor = scoreColor(metric.score, 10);
    setFill(BORDER);
    doc.roundedRect(MARGIN + 62, y - 3.6, 92, 3.2, 1.6, 1.6, "F");
    const progressWidth = Math.max(2, (metric.score / 10) * 92);
    setFill(barColor);
    doc.roundedRect(MARGIN + 62, y - 3.6, progressWidth, 3.2, 1.6, 1.6, "F");

    doc.setFont("helvetica", "bold");
    setColor(barColor);
    doc.text(`${metric.score}/10`, PAGE_W - MARGIN, y, { align: "right" });
    y += 9.5;
  });

  y += 6;

  // ============ STRENGTHS + IMPROVEMENTS (two columns) ============
  const strengths = feedback.strengths || [];
  const weaknesses = feedback.weaknesses || [];
  const colW = (CONTENT_W - 6) / 2;

  const wrapList = (items, width) => {
    let lines = 0;
    const wrapped = items.map((item) => {
      const l = doc.splitTextToSize(item, width - 8);
      lines += l.length;
      return l;
    });
    return { wrapped, lines };
  };

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const sWrap = wrapList(strengths.length ? strengths : ["No strengths identified."], colW);
  const wWrap = wrapList(weaknesses.length ? weaknesses : ["No weaknesses identified."], colW);
  const twoColH = Math.max(sWrap.lines, wWrap.lines) * 5 + 18;

  checkPageBreak(twoColH + 8);
  const colTopY = y;

  const drawListCard = (x, title, accent, tint, wrap) => {
    setFill(tint);
    setDraw(accent);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, colTopY, colW, twoColH, 2.5, 2.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    setColor(accent);
    doc.text(title, x + 6, colTopY + 8);

    let ly = colTopY + 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(BODY);
    wrap.wrapped.forEach((lines) => {
      setFill(accent);
      doc.circle(x + 7, ly - 1.3, 0.8, "F");
      doc.text(lines, x + 10, ly);
      ly += lines.length * 5;
    });
  };

  drawListCard(MARGIN, "Key Strengths", GREEN, [240, 253, 244], sWrap);
  drawListCard(MARGIN + colW + 6, "Areas for Improvement", VIOLET, VIOLET_TINT, wWrap);

  y = colTopY + twoColH + 12;

  // ============ 2-WEEK ROADMAP ============
  const roadmap = feedback.roadmap || [];
  if (roadmap.length > 0) {
    const roadCols = 2;
    const roadColW = (CONTENT_W - 6) / roadCols;
    const roadWraps = roadmap.map((r) => doc.splitTextToSize(r.goal || "", roadColW - 10));
    const rowHeights = [];
    for (let i = 0; i < roadmap.length; i += roadCols) {
      const rowItems = roadWraps.slice(i, i + roadCols);
      rowHeights.push(Math.max(...rowItems.map((w) => w.length)) * 4.6 + 20);
    }
    const roadmapH = rowHeights.reduce((a, b) => a + b + 4, 0);

    checkPageBreak(Math.min(roadmapH + 16, pageHeight - 50));
    sectionTitle("2-Week Improvement Roadmap");

    let rIdx = 0;
    for (let row = 0; row < rowHeights.length; row++) {
      checkPageBreak(rowHeights[row] + 6);
      const rowTop = y;
      for (let c = 0; c < roadCols && rIdx < roadmap.length; c++, rIdx++) {
        const item = roadmap[rIdx];
        const x = MARGIN + c * (roadColW + 6);
        setFill(CARD_BG);
        setDraw(BORDER);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, rowTop, roadColW, rowHeights[row], 2.5, 2.5, "FD");

        setFill(VIOLET);
        doc.circle(x + 8, rowTop + 8, 3.2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        setColor([255, 255, 255]);
        doc.text(`${rIdx + 1}`, x + 8, rowTop + 9.3, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        setColor(VIOLET);
        doc.text((item.day || "").toUpperCase(), x + 14, rowTop + 6.5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        setColor(INK);
        doc.text(item.topic || "", x + 14, rowTop + 11.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setColor(BODY);
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
    sectionTitle("Detailed Question Analysis");

    questionFeedback.forEach((item, index) => {
      const question = doc.splitTextToSize(item.question || "Question unavailable.", CONTENT_W - 14);
      const answer = doc.splitTextToSize(item.candidateAnswer || "No answer available.", CONTENT_W - 12);
      const ideal = doc.splitTextToSize(item.idealAnswer || "Not available.", CONTENT_W - 12);

      const qBlockHeight = 10 + question.length * 5;
      checkPageBreak(qBlockHeight + 20);

      const qColor = scoreColor(item.score ?? 0, 10);

      setFill(qColor);
      doc.rect(MARGIN, y - 5.5, 1.4, qBlockHeight + 2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setColor(INK);
      doc.text(`Question ${index + 1}`, MARGIN + 5, y);

      badge(`${item.score ?? 0}/10`, PAGE_W - MARGIN, y, { fg: qColor, bg: scoreTint(item.score ?? 0, 10) }, 9, "right");

      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      setColor(BODY);
      doc.text(question, MARGIN + 5, y);
      y += question.length * 5 + 5;

      const answerBoxHeight = answer.length * 4.6 + 10;
      checkPageBreak(answerBoxHeight + 16);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      setColor(MUTED);
      doc.text("YOUR ANSWER", MARGIN, y);
      y += 4;

      setFill(CARD_BG);
      setDraw(BORDER);
      doc.setLineWidth(0.3);
      doc.roundedRect(MARGIN, y, CONTENT_W, answerBoxHeight, 2, 2, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor([55, 65, 81]);
      doc.text(answer, MARGIN + 5, y + 6);
      y += answerBoxHeight + 6;

      const idealBoxHeight = ideal.length * 4.6 + 10;
      checkPageBreak(idealBoxHeight + 16);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      setColor(GREEN);
      doc.text("IDEAL ANSWER", MARGIN, y);
      y += 4;

      setFill(GREEN_TINT);
      setDraw([167, 243, 208]);
      doc.roundedRect(MARGIN, y, CONTENT_W, idealBoxHeight, 2, 2, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor([6, 95, 70]);
      doc.text(ideal, MARGIN + 5, y + 6);
      y += idealBoxHeight + 10;

      if (index < questionFeedback.length - 1) {
        setDraw(BORDER);
        doc.setLineWidth(0.4);
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
    doc.line(MARGIN, 282, PAGE_W - MARGIN, 282);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setColor(MUTED);
    doc.text("Powered by PrepAI", MARGIN, 288);
    doc.text(`Page ${i} of ${totalPages}`, PAGE_W - MARGIN, 288, { align: "right" });
  }

  const fileRole = (interview.role || "report").replace(/[^a-z0-9]+/gi, "_");
  doc.save(`PrepAI_${fileRole}_Report.pdf`);
};
