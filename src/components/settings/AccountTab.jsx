import { motion } from 'framer-motion';
import AccountInfoCard from './AccountInfoCard';
import PreferencesCard from './PreferencesCard';
import SecurityCard from './SecurityCard';
import AccountActionsCard from './AccountActionsCard';

export default function AccountTab({ settings, updateSetting, setIsEditModalOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <AccountInfoCard onEditClick={() => setIsEditModalOpen(true)} />

      <PreferencesCard settings={settings} updateSetting={updateSetting} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SecurityCard />
        <AccountActionsCard />
      </div>
    </motion.div>
  );
}



