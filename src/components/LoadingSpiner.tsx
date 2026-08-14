const VIEW_WIDTH = 404;
const VIEW_HEIGHT = 301;
const DISPLAY_WIDTH = 120;
const DISPLAY_HEIGHT = 90;
const BAR_WIDTH = 10;
const BAR_RADIUS = 7 * (DISPLAY_WIDTH / VIEW_WIDTH);
// 초기 렌더 직후 main thread가 바쁜 구간(하이드레이션 등)에 애니메이션이 끊겨 보이는 걸 피하려고
// 실제 재생 시작을 뒤로 미루는 base delay.
// const START_DELAY = 0.4;

export default function LoadingSpinner() {
  const bars = [
    { x: 87, y: 190, h: 80, delay: 0 },
    { x: 123, y: 160, h: 140, delay: 0.12 },
    { x: 159, y: 120, h: 220, delay: 0.24 },
    { x: 195, y: 90, h: 220, delay: 0.36 },
    { x: 231, y: 145, h: 170, delay: 0.48 },
    { x: 267, y: 110, h: 210, delay: 0.6 },
    { x: 303, y: 180, h: 100, delay: 0.72 },
  ];

  return (
    <div
      className="relative"
      style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }}
    >
      <svg
        width={DISPLAY_WIDTH}
        height={DISPLAY_HEIGHT}
        viewBox="0 0 404 301"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 202C0 190.954 8.9543 182 20 182H27V282H20C8.95431 282 0 273.046 0 262V202Z"
          fill="#FFFFFF"
        />
        <path
          d="M404 261C404 272.046 395.046 281 384 281H377V181H384C395.046 181 404 189.954 404 201V261Z"
          fill="#FFFFFF"
        />
        <rect x="35" y="163" width="41" height="138" rx="10" fill="#FFFFFF" />
        <rect x="328" y="163" width="41" height="138" rx="10" fill="#FFFFFF" />
        <path
          d="M202 0C294.232 0 369 77.4547 369 173C369 192.137 365.998 210.547 360.459 227.756C361 222.247 361.277 216.657 361.277 211C361.277 120.425 290.182 33.5 202.482 33.5C114.783 33.5002 43.6875 120.425 43.6875 211C43.6875 218.134 44.1298 225.162 44.9854 232.056C38.5252 213.627 35 193.74 35 173C35 77.4547 109.768 0 202 0Z"
          fill="#FFFFFF"
        />
      </svg>

      {bars.map((bar, i) => (
        <div
          key={i}
          className="animate-wave absolute bg-white"
          style={{
            left: `${(bar.x / VIEW_WIDTH) * 100}%`,
            top: `${(bar.y / VIEW_HEIGHT) * 100}%`,
            width: `${(BAR_WIDTH / VIEW_WIDTH) * 100}%`,
            height: `${(bar.h / VIEW_HEIGHT) * 100}%`,
            borderRadius: `${BAR_RADIUS}px`,
            // animationDelay: `${START_DELAY + bar.delay}s`,
            animationFillMode: 'backwards',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
