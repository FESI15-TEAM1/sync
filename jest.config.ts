import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // next.config.js 및 .env 파일을 테스트 환경에 로드하기 위해 Next.js 앱 경로를 제공합니다.
  dir: './',
});

// Jest에 전달할 사용자 정의 구성을 추가합니다.
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // 각 테스트가 실행되기 전에 추가 설정 옵션을 추가합니다.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // next/jest가 내부적으로 등록한 '^.+\\.(svg)$' 규칙과 동일한 키를 써야
    // 새로 추가하는 게 아니라 덮어써서 svgr 목(mock)이 우선 적용됩니다.
    '^.+\\.(svg)$': '<rootDir>/__mocks__/svg.tsx',
  },
};

// next/jest가 Next.js 구성을 로드할 수 있도록 createJestConfig가 이 방식으로 내보내집니다.
export default createJestConfig(config);
