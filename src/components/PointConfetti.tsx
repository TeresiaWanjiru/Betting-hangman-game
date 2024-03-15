import { useCallback, useEffect, useRef } from 'react';
import style from './Keyboard.module.css';
class ConfettiParticle {
  private x: number;
  y: number;
  private rectx: number;
  recty: number;
  private color: string;
  private speedX: number;
  private speedY: number;
  private ctx: CanvasRenderingContext2D;
  private shape: ('circle' | 'square')[] = ['circle', 'square'];
  private rotation: number;

  constructor(
    x: number,
    y: number,
    color: string,
    canvas: HTMLCanvasElement,
    rectx: number,
    recty: number,
  ) {
    this.x = x;
    this.y = y;
    this.rectx = rectx;
    this.recty = recty;
    this.color = color;
    this.speedX = Math.random() * 1 - 1;
    this.speedY = Math.random() * 5 + 1;
    this.ctx = canvas.getContext('2d')!;
    this.shape = ['circle', 'square'];
    this.rotation = Math.random() * 360;
  }

  draw() {
    if (this.shape[0] === 'circle') {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.closePath();
    }
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.rectx + 7.5, this.recty + 3.5);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(-7.5, -3.5, 15, 7); // Adjust the rectangle position based on the new origin
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rectx += this.speedX;
    this.recty += this.speedY;
    this.rotation += 1.5;
  }
}
const Confetti = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiParticles = useRef<ConfettiParticle[]>([]);
  const lastTickTime = useRef(0);

  const randomColor = useCallback(() => {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas is not available');
      return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.error('Canvas is not available');
      return;
    }

    const animate: FrameRequestCallback = (timestamp) => {
      if (timestamp - lastTickTime.current < 10) {
        requestAnimationFrame(animate);
        return;
      }

      lastTickTime.current = timestamp;

      const ctx = canvas?.getContext('2d');
      if (!ctx) {
        console.error('Context is not available');
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new confetti particles 1 in 10 chances if 0.9...
      if (Math.random() > 0.7) {
        const randomX = Math.random() * canvas.width;
        const rectX = Math.random() * canvas.width;
        if (canvas) {
          const newConfetti = new ConfettiParticle(
            randomX,
            -10,
            randomColor(),
            canvas,
            rectX,
            -5,
          );
          confettiParticles.current.push(newConfetti);
        }
      }

      // Draw and update existing particles
      confettiParticles.current.forEach((particle) => {
        particle.draw();
        particle.update();
      });

      // Remove off-screen particles
      confettiParticles.current.forEach((particle, index) => {
        if (particle.y > canvas.height) {
          confettiParticles.current.splice(index, 1);
        }
      });
      requestAnimationFrame(animate);
    };
    const now = performance.now();
    lastTickTime.current = now;
    animate(now);
  }, [randomColor]);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        width: '60%',
        height: '98vh',
        top: 0,
        left: '20%',
        border: 'none',
        zIndex: 2,
      }}
      className={style.confetti}
    ></canvas>
  );
};

export default Confetti;
