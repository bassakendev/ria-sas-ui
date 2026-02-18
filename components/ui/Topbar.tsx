'use client';

export function Topbar() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-64 right-0 z-40 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        <div className="text-sm text-gray-600">
          Welcome back!
        </div>
      </div>
    </header>
  );
}
