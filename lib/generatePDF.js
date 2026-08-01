import jsPDF from "jspdf";

export function generateInterviewPDF(interview) {
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(22);
  doc.text("PrepAI Interview Report", 20, y);

  y += 15;

  doc.setFontSize(12);

  doc.text(`Role: ${interview.role}`, 20, y);
  y += 8;

  doc.text(`Difficulty: ${interview.difficulty}`, 20, y);
  y += 8;

  doc.text(`Score: ${interview.feedback.score}/100`, 20, y);
  y += 8;

  doc.text(
    `Recommendation: ${interview.feedback.recommendation}`,
    20,
    y
  );

  doc.save("PrepAI_Report.pdf");
}