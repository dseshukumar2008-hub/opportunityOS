import { Target, Code, Flag, BrainCircuit, Map } from 'lucide-react';
import SharedHowItWorksModal from '../../../components/ui/HowItWorksModal';

const STEPS = [
  { id: 1, title: 'Choose Your Interests', desc: 'Select the fields and topics that genuinely interest you.', icon: Target },
  { id: 2, title: 'Share Your Skills', desc: 'Help us understand your current strengths and technical abilities.', icon: Code },
  { id: 3, title: 'Define Your Goals', desc: 'Tell us what you want to achieve in your career.', icon: Flag },
  { id: 4, title: 'AI Career Analysis', desc: 'Our AI analyzes your profile to discover suitable career paths.', icon: BrainCircuit },
  { id: 5, title: 'Explore Your Paths', desc: 'Get personalized career recommendations and discover your best next steps.', icon: Map },
];

export default function CareerExplorerHowItWorksModal({ isOpen, onClose }) {
  return (
    <SharedHowItWorksModal
      isOpen={isOpen}
      onClose={onClose}
      title="How Career Explorer Works"
      subtitle="Discover personalized career paths based on your interests, skills, and goals."
      steps={STEPS}
      zIndex={999}
    />
  );
}
