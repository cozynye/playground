'use client';

interface LocationButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function LocationButton({ onClick, loading = false, disabled = false }: LocationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <>
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>위치 확인 중...</span>
        </>
      ) : (
        <>
          <span className="text-xl">📍</span>
          <span>내 위치 날씨 보기</span>
        </>
      )}
    </button>
  );
}
