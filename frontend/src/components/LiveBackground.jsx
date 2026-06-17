import React, { useEffect, useRef } from "react";

const LiveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 40;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 1.5 + 0.8,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background ambient color orbs
      const gradient = ctx.createRadialGradient(
        width * 0.2,
        height * 0.2,
        10,
        width * 0.2,
        height * 0.2,
        width * 0.6
      );
      gradient.addColorStop(0, "rgba(20, 184, 166, 0.03)"); // teal
      gradient.addColorStop(1, "rgba(3, 7, 18, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const gradient2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.8,
        10,
        width * 0.8,
        height * 0.8,
        width * 0.6
      );
      gradient2.addColorStop(0, "rgba(99, 102, 241, 0.03)"); // indigo
      gradient2.addColorStop(1, "rgba(3, 7, 18, 0)");
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Draw particles & lines
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Wrap around boundaries
        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(20, 184, 166, 0.25)"; // teal
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          // Draw connection lines if close enough
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = (1 - dist / 150) * 0.07;
            ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-20 bg-[#030712] pointer-events-none"
    />
  );
};

export default LiveBackground;
