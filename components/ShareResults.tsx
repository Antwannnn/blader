import { GameResults } from '@app/types/GameResults';
import { FaXTwitter } from 'react-icons/fa6';

interface ShareResultsProps {
  gameResults: GameResults;
}

const ShareResults = ({ gameResults }: ShareResultsProps) => {

  // Partager sur X (Twitter)
  const shareOnX = () => {
        
        // Créer le texte du tweet
        const text = `I just typed at ${gameResults.finalWpm} WPM with ${gameResults.finalAccuracy?.toFixed(1)}% accuracy on blader! Test your typing speed at blader.app`;
        
        // Utiliser l'API Web Share si disponible
        if (navigator.share) {
          navigator.share({
            text,
            url: 'https://blader.app',
          }).catch(error => {
            console.error('Error sharing:', error);
            // Fallback à l'ouverture d'X avec paramètres
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://blader.app')}`, '_blank');
          });
        } else {
          // Fallback pour les navigateurs ne supportant pas Web Share API
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://blader.app')}`, '_blank');
        }
  };


  return (
        <button
          onClick={shareOnX}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-opacity-80 text-text rounded-lg transition-all"
        >
          <FaXTwitter size={18} />
          <span>{'Share on X'}</span>
        </button>
  );
};

export default ShareResults; 