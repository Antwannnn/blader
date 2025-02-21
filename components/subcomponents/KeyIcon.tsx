
interface KeyIconProps {
  keyChar: string;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const KeyIcon = ({ keyChar, icon, size = 'md', className }: KeyIconProps) => {
  const sizeClasses = {
    sm: 'h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]}
        ${className}
        flex items-center justify-center
        w-fit
        px-2
        gap-1
        bg-background
        text-text
        rounded-md
        border border-text
        shadow-sm
        font-mono font-medium
        transition-all duration-100
        hover:shadow-md

      `}
    >
      {icon}
      {keyChar}
    </div>
  );
};

export default KeyIcon;