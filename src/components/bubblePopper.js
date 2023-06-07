import React, { useState, useEffect, useRef } from "react";

const BubblePopper = (props) => {
  const { score, setScore } = props;

  const scoreRef = useRef(score); // Create a reference to the score
  const canvasRef = useRef(null);
  const bubbles = useRef([]);
  const requestRef = useRef(null);

  const addBubble = () => {
    const radius = Math.floor(Math.random() * 50) + 20;
    const x = Math.floor(Math.random() * (canvasRef.current.width - radius * 2)) + radius;
    const y = canvasRef.current.height - radius;
    bubbles.current.push({ x, y, radius, dy: Math.random() * 3 });
  };

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbles.current.forEach((bubble, i) => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = "#3498db";
      ctx.fill();

      bubble.y -= bubble.dy;

      if (bubble.y + bubble.radius < 0) {
        bubbles.current.splice(i, 1);
        addBubble();
      }
    });

    // Draw the score
    ctx.font = "48px serif";
    ctx.fillStyle = "#000000";
    // ctx.fillText(`Score: ${scoreRef.current}`, 10, 50); // Use scoreRef.current to get the current score
    if (scoreRef.current < 1) {
      ctx.fillText("Click two fucking bloons", 10, 50); // This will position the text at (10, 50)
    } else {
      ctx.fillText("YES JUST ONE FUCKING MORE PLEASE", 10, 50); // This will position the text at (10, 50)
    }

    requestRef.current = requestAnimationFrame(updateCanvas);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const numBubbles = Math.floor(Math.random() * 21) + 20;
    for (let i = 0; i < numBubbles; i++) {
      addBubble();
    }

    requestRef.current = requestAnimationFrame(updateCanvas);

    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      for (let i = 0; i < bubbles.current.length; i++) {
        const bubble = bubbles.current[i];
        if (Math.hypot(bubble.x - x, bubble.y - y) < bubble.radius) {
          bubbles.current.splice(i, 1);
          setScore((score) => {
            scoreRef.current = score + 1; // Update scoreRef.current whenever the score changes
            return scoreRef.current;
          });
          addBubble();
          break;
        }
      }
    });

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
};

export default BubblePopper;
