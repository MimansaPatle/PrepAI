import jsPDF from "jspdf";

export const generateInterviewPDF = (interview) => {
    const doc = new jsPDF();

    let y = 20;
    const pageHeight = doc.internal.pageSize.getHeight();

    const checkPageBreak = (spaceNeeded = 20) => {
        if (y + spaceNeeded > pageHeight - 20) {
            doc.addPage();
            y = 25; 

            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(99, 102, 241); 
            doc.text("PrepAI Interview Report", 20, y);

            doc.setDrawColor(230, 235, 245);
            doc.setLineWidth(0.5);
            doc.line(20, y + 4, 190, y + 4);

            y += 16;
        }
    };

    // Helper to get color arrays based on scores
    const getScoreColor = (score, max = 10) => {
        const percentage = score / max;
        if (percentage >= 0.75) return [16, 185, 129];  // Green
        if (percentage >= 0.5) return [245, 158, 11];   // Orange/Amber
        return [239, 68, 68];                           // Red
    };

    // ===== Header Banner =====
    checkPageBreak(40);
    doc.setFillColor(99, 102, 241); 
    doc.rect(0, 0, 210, 38, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("PrepAI", 20, 16);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(224, 231, 255); 
    doc.text("AI Interview Assessment Report", 20, 26);

    doc.setFontSize(9);
    doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        190,
        26,
        { align: "right" }
    );

    doc.setTextColor(31, 41, 55); 
    y = 52;

    // ===== Interview Info Section (With Added Metadata) =====
    checkPageBreak(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(17, 24, 39);
    doc.text("Interview Information", 20, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99); 

    // Left Column
    doc.setFont("helvetica", "bold"); doc.text("Role:", 20, y);
    doc.setFont("helvetica", "normal"); doc.text(`${interview.role || "N/A"}`, 48, y);
    
    // Right Column
    doc.setFont("helvetica", "bold"); doc.text("Interview Date:", 115, y);
    doc.setFont("helvetica", "normal"); doc.text(`${interview.date || new Date().toLocaleDateString()}`, 150, y);
    y += 7;

    doc.setFont("helvetica", "bold"); doc.text("Difficulty:", 20, y);
    doc.setFont("helvetica", "normal"); doc.text(`${interview.difficulty || "N/A"}`, 48, y);
    
    doc.setFont("helvetica", "bold"); doc.text("Questions Asked:", 115, y);
    doc.setFont("helvetica", "normal"); doc.text(`${interview.feedback?.questionFeedback?.length || 0}`, 150, y);
    y += 7;

    doc.setFont("helvetica", "bold"); doc.text("Experience:", 20, y);
    doc.setFont("helvetica", "normal"); doc.text(`${interview.experience || "N/A"}`, 48, y);
    
    doc.setFont("helvetica", "bold"); doc.text("Duration:", 115, y);
    doc.setFont("helvetica", "normal"); doc.text(`${interview.duration || "N/A"}`, 150, y);
    y += 7;

    const skills = doc.splitTextToSize(`Skills: ${interview.skills || "N/A"}`, 170);
    doc.setFont("helvetica", "bold"); doc.text("Skills:", 20, y);
    doc.setFont("helvetica", "normal"); doc.text(skills, 48, y);
    y += skills.length * 6;

    y += 10;

    // ===== Overall Assessment Section =====
    checkPageBreak(45);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(17, 24, 39);
    doc.text("Overall Assessment", 20, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text("Overall Score", 20, y);

    // Score Accent Circle (Uses Dynamic Color Map Logic)
    const finalScore = interview.feedback.score;
    doc.setFillColor(...getScoreColor(finalScore, 100)); 
    doc.circle(175, y + 2, 13, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${finalScore}`, 175, y + 5.5, { align: "center" });

    const recommendation = interview.feedback.recommendation;
    let recColor = [239, 68, 68]; 
    if (recommendation === "Hire") recColor = [16, 185, 129];      
    if (recommendation === "Consider") recColor = [245, 158, 11];  

    doc.setTextColor(...recColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Recommendation: ${recommendation}`, 20, y + 12);

    doc.setTextColor(31, 41, 55);
    y += 24;

    const summary = doc.splitTextToSize(interview.feedback.summary, 170);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Executive Summary", 20, y);
    
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text(summary, 20, y);
    y += summary.length * 6.5;

    y += 12;

    // ===== Skill Breakdown Section (Visual Progress Bars) =====
    checkPageBreak(65);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(17, 24, 39);
    doc.text("Skill Breakdown", 20, y);

    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const metrics = interview.feedback.metrics;
    const metricKeys = [
        { label: "Communication", score: metrics.communication.score },
        { label: "Technical Knowledge", score: metrics.technicalKnowledge.score },
        { label: "Confidence", score: metrics.confidence.score },
        { label: "Problem Solving", score: metrics.problemSolving.score }
    ];

    metricKeys.forEach((metric) => {
        doc.setTextColor(75, 85, 99);
        doc.setFont("helvetica", "normal");
        doc.text(metric.label, 20, y);

        // Draw track bar background (light grey fill)
        doc.setFillColor(243, 244, 246);
        doc.rect(75, y - 3.5, 80, 4, "F");

        // Draw progress filling metric value dynamically colored
        const barColor = getScoreColor(metric.score, 10);
        doc.setFillColor(...barColor);
        const progressWidth = (metric.score / 10) * 80;
        doc.rect(75, y - 3.5, progressWidth, 4, "F");

        // Metric literal text
        doc.setTextColor(...barColor);
        doc.setFont("helvetica", "bold");
        doc.text(`${metric.score} / 10`, 190, y, { align: "right" });
        y += 8;
    });

    y += 8;

    // ===== Strengths Section =====
    checkPageBreak(35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(16, 185, 129); 
    doc.text("Key Strengths", 20, y);
    y += 7;

    doc.setTextColor(75, 85, 99);
    doc.setFont("helvetica", "normal");

    interview.feedback.strengths.forEach((item) => {
        checkPageBreak(15);
        const lines = doc.splitTextToSize(`•  ${item}`, 170);
        doc.text(lines, 20, y);
        y += lines.length * 6;
    });

    y += 8;

    // ===== Weaknesses Section =====
    checkPageBreak(35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(239, 68, 68); 
    doc.text("Areas for Improvement", 20, y);
    y += 7;

    doc.setTextColor(75, 85, 99);
    doc.setFont("helvetica", "normal");

    interview.feedback.weaknesses.forEach((item) => {
        checkPageBreak(15);
        const lines = doc.splitTextToSize(`•  ${item}`, 170);
        doc.text(lines, 20, y);
        y += lines.length * 6;
    });

    y += 14;

    // ===== Question Analysis Section =====
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(17, 24, 39);
    doc.text("Detailed Question Analysis", 20, y);
    y += 12;

    interview.feedback.questionFeedback.forEach((item, index) => {
        const question = doc.splitTextToSize(`${item.question || "Question unavailable."}`, 164);
        
        doc.setFont("courier", "normal");
        const answer = doc.splitTextToSize(`${item.candidateAnswer || "No answer available."}`, 158);
        const ideal = doc.splitTextToSize(`${item.idealAnswer || "Not available."}`, 158);
        doc.setFont("helvetica", "normal");

        // FIX: Only look ahead enough to fit the Header + Question text comfortably (around 40-50 units max)
        // This stops it from prematurely creating a new blank page!
        const questionHeaderHeight = 8 + (question.length * 5.5) + 15;
        checkPageBreak(Math.min(questionHeaderHeight, 45));

        // Header Label Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(99, 102, 241); 
        doc.text(`Question ${index + 1}`, 20, y);

        // Colored Dynamic Badge Score
        const scoreColor = getScoreColor(item.score, 10);
        doc.setTextColor(...scoreColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(`Score: ${item.score}/10`, 190, y, { align: "right" });
        y += 8;

        // --- Question Label & Render ---
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold"); doc.setTextColor(31, 41, 55);
        doc.text("Question", 20, y);
        y += 5;
        doc.setFont("helvetica", "normal"); doc.setTextColor(75, 85, 99);
        doc.text(question, 20, y);
        y += question.length * 5.5 + 5;

        // --- Your Answer Codeblock Container ---
        const answerBoxHeight = (answer.length * 5) + 6;
        // Check page break explicitly before creating the Answer box canvas
        checkPageBreak(answerBoxHeight + 15);

        doc.setFont("helvetica", "bold"); doc.setTextColor(31, 41, 55);
        doc.text("Your Answer", 20, y);
        y += 4;
        
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.3);
        doc.rect(20, y, 170, answerBoxHeight, "DF");
        
        doc.setFont("courier", "normal"); 
        doc.setFontSize(9.5);
        doc.setTextColor(55, 65, 81);
        doc.text(answer, 24, y + 4.5);
        y += answerBoxHeight + 6;

        // --- Ideal Answer Codeblock Container ---
        const idealBoxHeight = (ideal.length * 5) + 6;
        // Check page break explicitly before creating the Ideal Answer box canvas
        checkPageBreak(idealBoxHeight + 15);

        doc.setFont("helvetica", "bold"); doc.setTextColor(16, 185, 129); 
        doc.text("Ideal Answer", 20, y);
        y += 4;

        doc.setFillColor(240, 253, 244); 
        doc.setDrawColor(187, 247, 208); 
        doc.rect(20, y, 170, idealBoxHeight, "DF");

        doc.setFont("courier", "normal"); 
        doc.setFontSize(9.5);
        doc.setTextColor(21, 128, 61); 
        doc.text(ideal, 24, y + 4.5);
        y += idealBoxHeight + 8;

        // Visual divider line between item records
        doc.setDrawColor(243, 244, 246);
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;
    });

    // ===== Global Footer Application Pass =====
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.5);
        doc.line(20, 282, 190, 282);

        doc.setFontSize(9);
        doc.setTextColor(156, 163, 175); 

        doc.text("Powered by PrepAI", 20, 288);
        doc.text(`Page ${i} of ${totalPages}`, 190, 288, { align: "right" });
    }

    doc.save("PrepAI_Report.pdf");
};