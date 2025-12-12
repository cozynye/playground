'use client';

interface RunningCharacterProps {
  progress: number;
}

export function RunningCharacter({ progress }: RunningCharacterProps) {
  return (
    <div
      className="absolute -top-8 z-10 transition-all duration-300 ease-out pointer-events-none"
      style={{ left: `calc(${progress}% - 16px)` }}
    >
      <div className="runner-container">
        {/* 달리는 사람 SVG 애니메이션 */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 100 100"
          className="runner-svg"
        >
          {/* 머리 */}
          <circle cx="50" cy="20" r="12" fill="#FFD93D" className="head" />
          {/* 몸통 */}
          <rect x="42" y="32" width="16" height="24" rx="4" fill="#6C63FF" className="body" />
          {/* 왼쪽 팔 */}
          <rect x="32" y="34" width="10" height="6" rx="3" fill="#FFD93D" className="left-arm" />
          {/* 오른쪽 팔 */}
          <rect x="58" y="34" width="10" height="6" rx="3" fill="#FFD93D" className="right-arm" />
          {/* 왼쪽 다리 */}
          <rect x="42" y="56" width="7" height="20" rx="3" fill="#4A4A4A" className="left-leg" />
          {/* 오른쪽 다리 */}
          <rect x="51" y="56" width="7" height="20" rx="3" fill="#4A4A4A" className="right-leg" />
        </svg>
      </div>
      <style jsx>{`
        .runner-container {
          animation: bounce 0.3s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .runner-svg .left-arm {
          animation: armSwingLeft 0.3s ease-in-out infinite;
          transform-origin: 42px 37px;
        }

        .runner-svg .right-arm {
          animation: armSwingRight 0.3s ease-in-out infinite;
          transform-origin: 58px 37px;
        }

        .runner-svg .left-leg {
          animation: legSwingLeft 0.3s ease-in-out infinite;
          transform-origin: 45px 56px;
        }

        .runner-svg .right-leg {
          animation: legSwingRight 0.3s ease-in-out infinite;
          transform-origin: 54px 56px;
        }

        @keyframes armSwingLeft {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(30deg); }
        }

        @keyframes armSwingRight {
          0%, 100% { transform: rotate(30deg); }
          50% { transform: rotate(-30deg); }
        }

        @keyframes legSwingLeft {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(-25deg); }
        }

        @keyframes legSwingRight {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(25deg); }
        }
      `}</style>
    </div>
  );
}
