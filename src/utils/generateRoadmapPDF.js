import { jsPDF } from 'jspdf';

export const generateRoadmapPDF = (roadmap, profile, progressData) => {
  const doc = new jsPDF();
  let y = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const usableWidth = pageWidth - margin * 2;
  
  // Helper to handle auto-pagination
  const checkPageBreak = (neededSpace) => {
    if (y + neededSpace > doc.internal.pageSize.height - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Color Palette
  const primaryColor = [108, 76, 241]; // #6C4CF1
  const textColor = [51, 65, 85]; // slate-700
  const lightText = [100, 116, 139]; // slate-500
  
  // ── HEADER & BRANDING ──
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('OpportunityOS', margin, y);
  
  y += 10;
  doc.setFontSize(14);
  doc.setTextColor(...textColor);
  doc.text('Personalized Career Roadmap', margin, y);
  
  y += 15;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;
  
  // ── STUDENT PROFILE ──
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Student Profile', margin, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  
  const targetCareer = profile?.targetCareer || roadmap?.header?.careerTitle || 'Career';
  const profileDetails = [
    `Name: ${profile?.firstName || 'Student'} ${profile?.lastName || ''}`.trim(),
    `Course: ${profile?.course || 'Not specified'}`,
    `Branch: ${profile?.branch || 'Not specified'}`,
    `Current Year: ${profile?.currentYear || 'Not specified'}`,
    `Target Role: ${targetCareer}`
  ];
  
  profileDetails.forEach(detail => {
    doc.text(detail, margin, y);
    y += 6;
  });
  
  y += 10;
  
  // ── ROADMAP STATS ──
  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Progress Overview', margin, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  
  const stats = [
    `Overall Completion: ${progressData.overallProgress}%`,
    `Tasks Completed: ${progressData.doneTasks} / ${progressData.totalTasks}`,
    `Current Phase: ${progressData.currentPhaseTitle}`,
    `Estimated Timeline: ${roadmap?.header?.estimatedDuration || '12 Months'}`
  ];
  
  stats.forEach(stat => {
    doc.text(stat, margin, y);
    y += 6;
  });
  
  y += 15;
  
  // ── PHASES LOOP ──
  const phases = roadmap?.phases || [];
  
  phases.forEach((phase, index) => {
    checkPageBreak(50);
    
    // Phase Divider
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.line(margin, y, margin, y + 8);
    
    // Phase Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(`Phase ${index + 1}: ${phase.title}`, margin + 4, y + 6);
    y += 16;
    
    // Phase Description
    if (phase.description) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...lightText);
      const descLines = doc.splitTextToSize(phase.description, usableWidth);
      doc.text(descLines, margin, y);
      y += (descLines.length * 5) + 8;
    }
    
    // Phase Overview
    if (phase.overview) {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text('Overview', margin, y);
      y += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const overviewLines = doc.splitTextToSize(phase.overview, usableWidth);
      doc.text(overviewLines, margin, y);
      y += (overviewLines.length * 5) + 8;
    }
    
    // Tasks
    if (phase.tasks && phase.tasks.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text('Action Items (Tasks)', margin, y);
      y += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      phase.tasks.forEach(task => {
        checkPageBreak(12);
        const isDone = progressData.completedTasks.includes(task.id) ? '[x]' : '[ ]';
        const taskText = `${isDone} ${task.title}`;
        const lines = doc.splitTextToSize(taskText, usableWidth - 5);
        doc.text(lines, margin + 5, y);
        y += (lines.length * 5) + 2;
      });
      y += 6;
    }
    
    // Resources
    if (phase.resources && phase.resources.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text('Recommended Resources', margin, y);
      y += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      phase.resources.forEach(res => {
        checkPageBreak(15);
        const urlText = res.url && res.url.length > 5 ? ` \n    URL: ${res.url}` : '';
        const provText = res.provider ? `(${res.provider})` : '';
        const resText = `• [${res.type}] ${res.title} ${provText}${urlText}`;
        const lines = doc.splitTextToSize(resText, usableWidth - 5);
        doc.text(lines, margin + 5, y);
        y += (lines.length * 5) + 3;
      });
      y += 6;
    }
    
    // Projects
    if (phase.projects && phase.projects.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text('Projects', margin, y);
      y += 6;
      
      doc.setFontSize(10);
      phase.projects.forEach(proj => {
        checkPageBreak(25);
        const diffText = proj.difficulty ? `[${proj.difficulty}] ` : '';
        doc.setFont('helvetica', 'bold');
        const projTitle = `• ${diffText}${proj.title}`;
        doc.text(projTitle, margin + 5, y);
        y += 5;
        
        if (proj.description) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...lightText);
          const lines = doc.splitTextToSize(proj.description, usableWidth - 10);
          doc.text(lines, margin + 10, y);
          y += (lines.length * 5) + 3;
          doc.setTextColor(...textColor);
        }
      });
      y += 6;
    }
    
    // Milestones
    if (phase.milestones && phase.milestones.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text('Milestones', margin, y);
      y += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      phase.milestones.forEach(m => {
        checkPageBreak(12);
        const lines = doc.splitTextToSize(`• ${m}`, usableWidth - 5);
        doc.text(lines, margin + 5, y);
        y += (lines.length * 5) + 2;
      });
      y += 8;
    }
    
    y += 10;
  });
  
  // Download the PDF
  const safeTitle = targetCareer.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  doc.save(`roadmap-${safeTitle}.pdf`);
};
