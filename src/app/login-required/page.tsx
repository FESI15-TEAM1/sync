'use client';

import { useRouter } from 'next/navigation';

import Button from '@/components/Button';

export default function GroupLoginRequiredPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-5 py-6 text-center">
      <h1 className="text-text-primary text-lg font-bold">
        로그인이 필요합니다
      </h1>
      <p className="text-text-secondary text-sm">
        이용하려면 로그인이 필요합니다.
      </p>
      <Button
        type="button"
        size="md"
        variant="primary"
        onClick={() => router.push('/login')}
      >
        로그인하러 가기
      </Button>
    </div>
  );
}
