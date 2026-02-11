import React, { useState, useEffect, useRef } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Automatic Geometric Shapes & Stars Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // --- Geometric Shapes Configuration ---
    interface Shape {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rotation: number;
      vRotation: number;
      type: 'square' | 'triangle' | 'hexagon';
      opacity: number;
    }

    const shapes: Shape[] = [];
    const shapeCount = 30; // Increased density

    for (let i = 0; i < shapeCount; i++) {
        shapes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8, // Faster movement
            vy: (Math.random() - 0.5) * 0.8, // Faster movement
            size: Math.random() * 60 + 20,
            rotation: Math.random() * 360,
            vRotation: (Math.random() - 0.5) * 0.4, // Faster rotation
            type: ['square', 'triangle', 'hexagon'][Math.floor(Math.random() * 3)] as 'square' | 'triangle' | 'hexagon',
            opacity: Math.random() * 0.08 + 0.02
        });
    }

    // --- Stars Configuration ---
    interface Star {
        x: number;
        y: number;
        size: number;
        opacity: number;
        vOpacity: number;
    }

    const stars: Star[] = [];
    const starCount = 150; // Number of stars

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random(),
            vOpacity: (Math.random() - 0.5) * 0.03 // Twinkle speed
        });
    }

    const drawShape = (ctx: CanvasRenderingContext2D, size: number, type: string) => {
        ctx.beginPath();
        if (type === 'square') {
            ctx.rect(-size/2, -size/2, size, size);
        } else if (type === 'triangle') {
            const h = size * (Math.sqrt(3)/2);
            ctx.moveTo(0, -h/2);
            ctx.lineTo(size/2, h/2);
            ctx.lineTo(-size/2, h/2);
            ctx.closePath();
        } else if (type === 'hexagon') {
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const sx = (size/2) * Math.cos(angle);
                const sy = (size/2) * Math.sin(angle);
                if (i === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
            }
            ctx.closePath();
        }
        ctx.stroke();
        ctx.fill();
    };

    let animationId: number;
    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        // 1. Draw & Animate Stars
        stars.forEach(star => {
            star.opacity += star.vOpacity;
            // Reverse opacity change direction at limits to create twinkling
            if (star.opacity <= 0.1 || star.opacity >= 0.8) {
                star.vOpacity = -star.vOpacity;
            }
            // Clamp opacity
            if (star.opacity < 0) star.opacity = 0;
            if (star.opacity > 1) star.opacity = 1;

            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Draw & Animate Geometric Shapes
        shapes.forEach(shape => {
            // Move
            shape.x += shape.vx;
            shape.y += shape.vy;
            shape.rotation += shape.vRotation;

            // Wrap around screen
            if (shape.x < -100) shape.x = width + 100;
            if (shape.x > width + 100) shape.x = -100;
            if (shape.y < -100) shape.y = height + 100;
            if (shape.y > height + 100) shape.y = -100;

            // Draw
            ctx.save();
            ctx.translate(shape.x, shape.y);
            ctx.rotate((shape.rotation * Math.PI) / 180);
            
            // Style: Cyan/Blue tint matching the theme, very low opacity
            ctx.strokeStyle = `rgba(148, 163, 184, ${shape.opacity * 1.5})`; 
            ctx.fillStyle = `rgba(30, 58, 138, ${shape.opacity * 0.5})`; // Slight blue fill
            ctx.lineWidth = 1;
            
            drawShape(ctx, shape.size, shape.type);
            
            ctx.restore();
        });

        animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'user' && password === 'user') {
      onLogin();
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans" dir="rtl">
      {/* Dynamic Network Background - Deep Navy */}
      <div className="absolute inset-0 bg-[#0f172a] z-0">
         {/* Radial Gradient for depth */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0f172a] to-[#020617]"></div>
         
         {/* CSS Pattern to simulate the constellation/network nodes */}
         <div className="absolute inset-0 opacity-20" style={{
             backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, transparent 1px)`,
             backgroundSize: '50px 50px',
             backgroundPosition: '0 0, 25px 25px'
         }}></div>
         
         {/* Connecting lines simulation (subtle) */}
         <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
         </svg>

         {/* Animated Geometric Shapes & Stars Layer */}
         <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-5xl h-auto md:h-[600px] bg-[#1e293b]/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col md:flex-row overflow-hidden mx-4 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Right Side (Now First in RTL): Login Form */}
        <div className="w-full md:w-1/2 bg-[#0f172a] p-8 md:p-12 flex flex-col justify-center relative">
             <div className="absolute top-0 right-0 p-6">
                 {/* Optional: Language Toggle or Logo could go here */}
             </div>

             <div className="mb-10 text-center md:text-right">
                 <h2 className="text-3xl font-bold text-white mb-2">تسجيل الدخول</h2>
                 <p className="text-slate-400 text-sm">مرحباً بك مجدداً في لوحة التحكم</p>
             </div>

             <form onSubmit={handleLogin} className="flex flex-col gap-6">
                 {/* Username */}
                 <div className="flex flex-col gap-2 group">
                     <label className="text-xs font-bold text-slate-400 group-focus-within:text-blue-400 transition-colors">اسم المستخدم</label>
                     <div className="relative">
                         <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="أدخل اسم المستخدم"
                            className="w-full h-12 bg-[#1e293b] border border-slate-700 rounded-lg pr-11 pl-4 text-white text-sm placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                         />
                         <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">person</span>
                     </div>
                 </div>

                 {/* Password */}
                 <div className="flex flex-col gap-2 group">
                     <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400 group-focus-within:text-blue-400 transition-colors">كلمة المرور</label>
                        <a href="#" className="text-[10px] text-slate-500 hover:text-blue-400 transition-colors">نسيت كلمة المرور؟</a>
                     </div>
                     <div className="relative">
                         <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="أدخل كلمة المرور"
                            className="w-full h-12 bg-[#1e293b] border border-slate-700 rounded-lg pr-11 pl-4 text-white text-sm placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none font-sans"
                            style={{ fontFamily: 'sans-serif' }}
                         />
                         <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">lock</span>
                     </div>
                 </div>

                 {error && (
                     <div className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded border border-red-500/20 text-center animate-pulse">
                         {error}
                     </div>
                 )}

                 <button 
                    type="submit"
                    className="mt-2 h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-900/50 hover:shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                 >
                     <span>دخول للنظام</span>
                     <span className="material-symbols-outlined text-[20px] rtl:rotate-180">arrow_forward</span>
                 </button>
             </form>

             <div className="mt-12 text-center">
                 <p className="text-[10px] text-slate-600 font-english uppercase tracking-widest">
                     SAAHER SMART SERVICES SYSTEM © 2026
                 </p>
             </div>
        </div>

        {/* Left Side (Now Second in RTL): Information Panel (Visuals) */}
        <div className="w-full md:w-1/2 relative bg-gradient-to-br from-[#1e3a8a]/40 to-[#172554]/40 flex flex-col items-center justify-center p-8 text-center border-r border-white/5 overflow-hidden">
             
             {/* Islamic Geometric Pattern Overlay */}
             <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none" style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L60 20 L60 60 L40 80 L20 60 L20 20 Z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='40' r='10' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M20 20 L60 60 M60 20 L20 60' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
                 backgroundSize: '80px 80px'
             }}></div>

             {/* Decorative Elements */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none z-0">
                 <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,_rgba(59,130,246,0.2)_0%,_transparent_60%)]"></div>
             </div>

             {/* Content Wrapper */}
             <div className="relative z-10 flex flex-col items-center w-full">
                
                {/* Icon */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-amber-500 blur-[40px] opacity-20 rounded-full"></div>
                    <div className="size-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg flex items-center justify-center relative z-10 transform rotate-3 hover:rotate-6 transition-transform duration-500">
                        <span className="material-symbols-outlined text-white text-[56px]">memory</span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-1 mb-2">
                   <h1 className="text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-lg">
                       المنصة الرقمية المتكاملة
                   </h1>
                   <h2 className="text-2xl md:text-3xl font-bold text-amber-400 leading-tight drop-shadow-md">
                       لإدارة وتسجيل بيانات الموظفين
                   </h2>
                </div>
                
                <p className="text-blue-200 text-xs font-english font-medium tracking-wider uppercase mb-6 opacity-80">
                    Integrated Digital Platform <br/> for Employee Data Management
                </p>
                
                <div className="w-16 h-1 bg-amber-500 rounded-full mb-6"></div>

                <div className="flex flex-col items-center gap-1 mb-8">
                    <p className="text-white text-base font-bold">
                        إدارة الموارد البشرية
                    </p>
                    <p className="text-slate-300 text-sm font-medium">
                        قسم شؤون الموظفين
                    </p>
                    <div className="h-px w-12 bg-white/20 my-2"></div>
                    <p className="text-slate-400 text-xs font-english">
                        Human Resources Department
                    </p>
                    <p className="text-slate-400 text-[10px] font-english uppercase tracking-wide">
                        Personnel Affairs Section
                    </p>
                </div>

                <div className="mt-8 text-[10px] text-slate-500">
                    إعداد / صالح دحمان
                </div>
             </div>
        </div>

      </div>

      {/* Floating particles (Visual Polish) */}
      <div className="absolute top-20 left-20 size-2 bg-blue-500 rounded-full blur-[2px] animate-pulse"></div>
      <div className="absolute bottom-40 right-40 size-1 bg-amber-500 rounded-full blur-[1px] animate-bounce"></div>
    </div>
  );
};

export default LoginPage;