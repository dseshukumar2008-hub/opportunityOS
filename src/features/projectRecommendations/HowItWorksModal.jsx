import { Target, Briefcase, BrainCircuit, Lightbulb, Bookmark } from 'lucide-react';
import SharedHowItWorksModal from '../../components/ui/HowItWorksModal';

const STEPS = [
  { id: 1, title: 'Select Specialization', desc: 'Choose your technical domain or area of expertise.', icon: Target },
  { id: 2, title: 'Select Target Role', desc: 'Specify the job or role you are aiming for.', icon: Briefcase },
  { id: 3, title: 'AI Analysis', desc: 'Our AI analyzes the selected path and industry trends.', icon: BrainCircuit },
  { id: 4, title: 'Generate Ideas', desc: 'Get personalized, high-impact project recommendations.', icon: Lightbulb },
  { id: 5, title: 'Save & Build', desc: 'Save projects to your portfolio and start building.', icon: Bookmark },
];

export default function HowItWorksModal({ isOpen, onClose }) {
  return (
    <SharedHowItWorksModal
      isOpen={isOpen}
      onClose={onClose}
      title="How Project Engine Works"
      subtitle="Your journey to building a standout portfolio."
      steps={STEPS}
    />
  );
}
