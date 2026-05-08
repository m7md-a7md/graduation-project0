import { Suspense } from 'react';
import DashboardContent from './DashboardContent';

function DashboardSkeleton() {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "var(--black)" }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(217,119,6,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-sm flex-col items-center gap-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-xl border animate-pulse" style={{ borderColor: "var(--border)", background: "var(--surface)" }} />
          <div className="text-center space-y-3">
            <div className="h-8 bg-gray-700 rounded animate-pulse w-48" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
