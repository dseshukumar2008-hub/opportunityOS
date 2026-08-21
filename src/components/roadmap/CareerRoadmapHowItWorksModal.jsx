
import { Target, User, Flag, Map, Compass } from 'lucide-react';
import SharedHowItWorksModal from '../ui/HowItWorksModal';

const STEPS = [
  { id: 1, title: 'Choose Your Career Goal', desc: 'Select the role or career path you want to achieve.', icon: Target },
  { id: 2, title: 'Analyze Your Current Profile', desc: 'Your skills, education, experience, and interests are considered.', icon: User },
  { id: 3, title: 'Define Your Milestones', desc: 'AI breaks your journey into clear and achievable stages.', icon: Flag },
  { id: 4, title: 'Build Your Personalized Roadmap', desc: 'Get a structured path with skills, projects, and learning goals.', icon: Map },
  { id: 5, title: 'Track Your Progress', desc: 'Follow your roadmap and move step by step toward your career goal.', icon: Compass },
];

export default function CareerRoadmapHowItWorksModal({ isOpen, onClose }) {
  return (
    <SharedHowItWorksModal
      isOpen={isOpen}
      onClose={onClose}
      title="How Career Roadmap Works"
      subtitle="Get a clear, personalized path from where you are to where you want to be."
      steps={STEPS}
    />
  );
}
