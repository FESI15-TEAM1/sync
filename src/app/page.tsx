import { HomePage } from '@/components/pages/home-page';

export default function Home() {
  return (
    <>
      <div className="flex h-screen w-20 flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Hello World!!</h1>
      </div>

      <HomePage />
    </>
  );
}
