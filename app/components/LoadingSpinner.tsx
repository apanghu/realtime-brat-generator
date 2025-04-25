export default function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20"></div>
        <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <div className="absolute left-0 top-0 h-16 w-16 animate-pulse rounded-full bg-primary/10"></div>
      </div>
      <span className="ml-4 text-lg font-medium text-primary animate-pulse">Loading...</span>
    </div>
  );
} 