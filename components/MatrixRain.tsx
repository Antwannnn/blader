'use client';

import { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const dropsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 14;
    const chars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');

    const initDrops = () => {
      const columns = Math.ceil(window.innerWidth / fontSize);
      dropsRef.current = new Array(columns).fill(1);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDrops(); // Réinitialiser les drops lors du redimensionnement
      
      // Réinitialiser le style du contexte car il est perdu après le redimensionnement
      if (ctx) {
        ctx.font = `${fontSize}px monospace`;
      }
    };

    const draw = () => {
      // Fond semi-transparent pour créer l'effet de fade
      ctx.fillStyle = 'rgba(22, 25, 28, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Style des caractères
      ctx.fillStyle = '#19E219'; // Couleur verte "hacker"
      ctx.font = `${fontSize}px monospace`;

      // Dessiner les caractères
      for (let i = 0; i < dropsRef.current.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = dropsRef.current[i] * fontSize;

        ctx.fillText(text, x, y);

        // Réinitialiser la position quand le caractère atteint le bas
        if (y > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }

        dropsRef.current[i]++;
      }

      // Boucle d'animation
      animationRef.current = requestAnimationFrame(draw);
    };

    // Configuration initiale
    resizeCanvas();
    initDrops();
    draw();

    // Gestionnaire de redimensionnement
    window.addEventListener('resize', resizeCanvas);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-10"
    />
  );
};

export default MatrixRain; 