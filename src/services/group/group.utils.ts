const GROUP_GRADIENT_CLASS_NAMES = [
  'from-[#6366f1] to-[#c084fc]',
  'from-[#38bdf8] to-[#4f46e5]',
  'from-[#34d399] to-[#a3e635]',
  'from-[#d946ef] to-[#6366f1]',
];

// 그룹 카드 배경은 API가 내려주지 않으므로 id 기반으로 고정 배정합니다.
export function getGroupGradientClassName(id: number) {
  return GROUP_GRADIENT_CLASS_NAMES[id % GROUP_GRADIENT_CLASS_NAMES.length];
}
