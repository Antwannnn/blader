export const isMacOS = () => {
  if (typeof window === 'undefined') return false;
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
};

export const getModifierKey = () => {
  if (typeof window === 'undefined') return 'Alt'; // Rendu côté serveur
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌥' : 'Alt';
}; 