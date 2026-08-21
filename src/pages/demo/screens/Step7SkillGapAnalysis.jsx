import Step4Dashboard from '../../../components/skill-gap/Step4Dashboard';

export default function Step7SkillGapAnalysis() {
  const dummyData = {
    targetRole: "Senior Software Engineer",
    readinessScore: 75,
    skillGapPercentage: 25,
    currentSkills: ["React", "JavaScript", "Node.js", "Git"],
    skillBreakdown: { strong: 4, moderate: 2, missing: 3 },
    nextSkill: {
      name: "System Design",
      priority: "High",
      time: "2 Weeks",
      impact: "High",
      reason: "System design is a critical skill for senior engineering roles."
    },
    missingSkills: {
      high: ["System Design", "AWS"],
      medium: ["GraphQL"],
      low: ["Docker"]
    },
    learningPath: [
      { title: "System Design Architecture", time: "Week 1-2" },
      { title: "AWS Solutions Architect", time: "Week 3-4" },
      { title: "GraphQL Apollo Server", time: "Week 5" }
    ],
    aiAdvice: "You are very close to your goal. Focus heavily on system architecture and cloud deployments to close the remaining gap.",
    consistencyTip: "Learn for at least 1-2 hours daily to stay consistent and build strong fundamentals."
  };

  return (
    <div className="h-[700px] overflow-y-auto max-w-5xl mx-auto w-full p-4 lg:p-8 animate-in fade-in duration-500 custom-scrollbar bg-[#F8FAFC]">
      <Step4Dashboard data={dummyData} onReset={() => {}} />
    </div>
  );
}
