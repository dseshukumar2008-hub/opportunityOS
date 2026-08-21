
import { Target, Code, BrainCircuit, Briefcase, Map } from 'lucide-react';
import SharedHowItWorksModal from '../ui/HowItWorksModal';

const STEPS = [
  { id: 1, title: 'Select Your Target Role', desc: 'Choose the career role you are preparing for.', icon: Briefcase },
  { id: 2, title: 'Share Your Current Skills', desc: 'Add your existing technical skills, knowledge, and experience.', icon: Code },
  { id: 3, title: 'AI Analyzes Requirements', desc: 'AI compares your current skills with the skills required for your target role.', icon: BrainCircuit },
  { id: 4, title: 'Identify Skill Gaps', desc: 'Discover missing skills and areas that need improvement.', icon: Target },
  { id: 5, title: 'Get Your Learning Path', desc: 'Receive personalized recommendations on what to learn next.', icon: Map },
];

export default function SkillGapHowItWorksModal({ isOpen, onClose }) {
  return (
    <SharedHowItWorksModal
      isOpen={isOpen}
      onClose={onClose}
      title="How Skill Gap Analysis Works"
      subtitle="Discover what you know, what you're missing, and what to learn next."
      steps={STEPS}
    />
  );
}
