import { Link } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div 
        style={{
          maxWidth: '896px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          alignItems: 'center',
          padding: '48px',
          borderRadius: '2rem',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ color: '#0B3D91', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '14px', marginBottom: '16px', display: 'block' }}>Error 404</span>
          <h1 style={{ fontSize: '64px', fontWeight: 800, color: '#0B3D91', marginBottom: '24px', lineHeight: 1.1 }}>
            Lost at <br /> Sea?
          </h1>
          <p style={{ fontSize: '18px', color: '#4B5563', marginBottom: '40px', lineHeight: 1.6, maxWidth: '384px' }}>
            The page you're looking for has drifted off the radar. Let's get you back to the command center.
          </p>
          
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              backgroundColor: '#0B3D91',
              color: 'white',
              borderRadius: '16px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 15px -3px rgba(11, 61, 145, 0.3)',
              fontWeight: 600,
              fontSize: '18px'
            }}
          >
            <MoveLeft size={20} />
            <span>Return to Base</span>
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <div 
              style={{
                position: 'absolute',
                inset: '-16px',
                background: 'rgba(11, 61, 145, 0.05)',
                borderRadius: '9999px',
                filter: 'blur(48px)',
                mixBlendMode: 'multiply'
              }}
            ></div>
            <img 
              src="/premium_404_illustration.png" 
              alt="404 Illustration" 
              style={{
                position: 'relative',
                width: '100%',
                height: 'auto',
                filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))',
                animation: 'float 6s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
