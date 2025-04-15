import React, { useEffect, useRef } from 'react';
import './Index.css';

const BubbleBackground = () => {
  const canvasRef = useRef(null);
  const bubbles = useRef([]);
  const animationFrameId = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const startTime = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bubbleCount = 80;

    class Bubble {
      constructor(canvas, index) {
        this.canvas = canvas;
        this.index = index;
        this.reset(true);
      }

      reset(isInitial = false) {
        if (isInitial) {
          // 初始化时所有气泡都在底部，横向分散
          this.x = Math.random() * this.canvas.width;
          this.y = this.canvas.height + Math.random() * 50; // 稍微错开起始位置
          
          // 保存初始位置
          this.initialX = this.x;
          this.initialY = this.y;
        } else {
          this.x = Math.random() * this.canvas.width;
          this.y = Math.random() * this.canvas.height;
        }

        this.size = Math.random() * 6 + 4;
        this.opacity = Math.random() * 0.35 + 0.25;
        
        // 设置目标位置（在页面下半部分均匀分布）
        this.targetX = Math.random() * this.canvas.width;
        // 目标高度在画布高度的50%-90%之间随机
        this.targetY = this.canvas.height * (0.5 + Math.random() * 0.4);
        
        // 延迟和动画参数
        this.delay = isInitial ? this.index * 80 : 0; // 增加间隔使气泡更错落有致
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.001 + 0.0005; // 降低波动速度
        
        // 颜色设置
        this.isOrangeColor = Math.random() > 0.5;
        this.baseColor = this.isOrangeColor
          ? [255, 159, 28]
          : [255, 111, 97];
      }

      update() {
        const currentTime = Date.now();
        const timePassed = currentTime - startTime.current;

        if (timePassed < this.delay) {
          return;
        }

        // 入场动画只保留上升阶段
        const riseDuration = 4000;    // 延长上升时间，使动画更平滑
        const animationTime = timePassed - this.delay;
        
        if (animationTime < riseDuration) {
          // 上升阶段：缓慢向上移动
          const progress = animationTime / riseDuration;
          const easeProgress = 1 - Math.pow(1 - progress, 3); // 使用三次方缓动使上升更自然
          
          // 计算当前位置，减小横向摆动
          const wobbleAmount = Math.sin(animationTime * 0.0005 + this.wobbleOffset) * 10;
          this.x = this.initialX + wobbleAmount * progress;
          this.y = this.initialY - (this.initialY - this.targetY) * easeProgress;
        } else {
          // 稳定浮动阶段 - 只有非常轻微的垂直波动，几乎没有水平移动
          const dx = mousePos.current.x - this.x;
          const dy = mousePos.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            // 鼠标靠近时轻微躲避
            this.x -= (dx / distance) * 0.2;
            this.y -= (dy / distance) * 0.2;
          }

          // 只保留极轻微的垂直波动，几乎不移动
          const verticalWobble = Math.sin(currentTime * this.wobbleSpeed + this.wobbleOffset) * 0.1;
          
          // 只应用垂直波动效果，完全移除水平移动
          this.y += verticalWobble;

          // 边界检查，防止气泡跑出屏幕
          if (this.x < this.size) this.x = this.size;
          if (this.x > this.canvas.width - this.size) this.x = this.canvas.width - this.size;
          if (this.y < this.size) this.y = this.size;
          if (this.y > this.canvas.height - this.size) this.y = this.canvas.height - this.size;
        }
      }

      draw() {
        const currentTime = Date.now();
        const timePassed = currentTime - startTime.current;
        
        if (timePassed < this.delay) {
          return;
        }

        let currentOpacity = this.opacity;
        if (timePassed < this.delay + 1500) {
          currentOpacity *= (timePassed - this.delay) / 1500;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const [r, g, b] = this.baseColor;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;
        ctx.fill();
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      startTime.current = Date.now();
      bubbles.current = Array(bubbleCount)
        .fill()
        .map((_, index) => new Bubble(canvas, index));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.current.forEach(bubble => {
        bubble.update();
        bubble.draw();
      });
      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      mousePos.current.x = event.clientX;
      mousePos.current.y = event.clientY;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="bubble-background" />;
};

export default BubbleBackground; 