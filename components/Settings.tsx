import { useSettings } from '@/contexts/SettingsContext';
import { IoSettingsOutline } from 'react-icons/io5';
import SettingsModal from './modals/SettingsModal';

const Settings = () => {
  const { openSettings } = useSettings();

  return (
    <>
      <button
        onClick={openSettings}
        className="fixed top-4 right-4 p-2 rounded-lg bg-secondary hover:bg-text/10 transition-colors"
      >
        <IoSettingsOutline className="w-6 h-6 text-text" />
      </button>
      <SettingsModal />
    </>
  );
};

export default Settings;