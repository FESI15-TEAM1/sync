import { type ReactNode } from 'react';

export default function Section({
  headline,
  list,
}: {
  headline: string;
  list: ReactNode;
}) {
  return (
    <>
      <section>
        <h2 className="text-text-primary mb-4 text-xl font-bold">{headline}</h2>
        {list}
      </section>
    </>
  );
}
