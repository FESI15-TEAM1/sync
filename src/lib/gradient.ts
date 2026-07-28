export const GRADIENT_CLASS_NAMES = [
  'from-[#6366f1] to-[#c084fc]',
  'from-[#38bdf8] to-[#4f46e5]',
  'from-[#34d399] to-[#a3e635]',
  'from-[#d946ef] to-[#6366f1]',
] as const;

export function getRandomGradientClassName(): string {
  const randomIndex = Math.floor(Math.random() * GRADIENT_CLASS_NAMES.length);
  return GRADIENT_CLASS_NAMES[randomIndex];
}
