import LoadingSpinner from '@/components/LoadingSpiner';

export default function LoadingFallback() {
  return (
    <div className="flex min-h-[var(--main-content-full-height)] flex-col items-center justify-center gap-5">
      <LoadingSpinner />
      <span className="text-text-primary">Loading...</span>
    </div>
  );
}
