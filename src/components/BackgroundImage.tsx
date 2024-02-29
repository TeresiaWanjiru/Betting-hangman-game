import { useEffect, useRef, useState } from 'react';
import style from './Keyboard.module.css';

//images
import city1 from '/images/city1.png';
import city2 from '/images/city2.png';
import city3 from '/images/city3.png';
import city4 from '/images/city4.png';
import city5 from '/images/city5.png';
import city6 from '/images/city6.png';
import city7 from '/images/city7.png';
import city8 from '/images/city8.png';

const IMAGES = [city1, city2, city3, city4, city5, city6, city7, city8];

const BackgroundImage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const lastTimestamp = useRef(0);
  const fadeInDuration = 5000;
  const fadeOutDuration = 3000;
  const stayDuration = 3000;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      console.error('Canvas or context is not available');
      return;
    }

    const images = IMAGES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const img = images[imageIndex];

    const canvasWidth = 800;
    const canvasHeight = 600;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.imageSmoothingEnabled = false;

    const drawImage = (alpha: number) => {
      context.globalAlpha = alpha;

      const imageWidth = img.width;
      const imageHeight = img.height;

      const x = (canvasWidth - imageWidth) / 2;
      const y = (canvasHeight - imageHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, imageWidth, imageHeight);
      context.globalAlpha = 1;
    };

    const fadeTransition = (timestamp: DOMHighResTimeStamp) => {
      const elapsed = timestamp - lastTimestamp.current;

      if (elapsed < fadeInDuration) {
        // Fade in
        const alpha = elapsed / fadeInDuration;
        drawImage(alpha);
        requestAnimationFrame(fadeTransition);
      } else if (elapsed < fadeInDuration + stayDuration) {
        // Stay on screen
        drawImage(1);
        requestAnimationFrame(fadeTransition);
      } else if (elapsed < fadeInDuration + stayDuration + fadeOutDuration) {
        // Fade out
        const alpha =
          1 - (elapsed - fadeInDuration - stayDuration) / fadeOutDuration;
        drawImage(alpha);
        requestAnimationFrame(fadeTransition);
      } else {
        // Switch to the next image after the entire sequence
        lastTimestamp.current = timestamp;
        setImageIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
        fadeTransition(timestamp);
      }
    };

    fadeTransition(0);

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [imageIndex]);

  return <canvas ref={canvasRef} className={style.fadeInImage} />;
};

export default BackgroundImage;
