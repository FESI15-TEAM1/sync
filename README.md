# SYNC

> **“내 플레이리스트를 다 같이”**

## 프로젝트 소개

유튜브에서 곡을 가져와 나만의 플레이리스트를 만들고 공유하세요!

비슷한 취향끼리 그룹을 맺을 수도 있고, 내 플레이리스트로 스트리밍 세션(플레이룸)을 열어
실시간으로 같은 곡을 함께 들으며 이야기를 나눌 수 있습니다.

## 배포 정보

- **개발 프리뷰 URL**: [https://sync151-dev.vercel.app/](https://sync151-dev.vercel.app/) (테스트 계정 로그인 정보 포함됨)
- **개발 기간** : 
  - 부트캠프 과정 도중 개발: 2026.7.3 ~ 2026.8.20
  - 과정 이후 개발: 2026.8.24~

## 주요 기능

### * 시연 영상
[시연 영상 Vimeo 링크](https://vimeo.com/1221410914?fl=ip&fe=ec) 입니다!

### 1. YouTube API를 사용한 음악 듣기

YouTube Data API로 곡을 검색하고, 플레이어를 통해 바로 재생합니다.

<img width="1901" height="915" alt="1" src="https://github.com/user-attachments/assets/0bf6a476-0452-4def-85f5-e92df8b34073" />

<!-- 이미지 영역: 곡 검색 및 재생 -->

### 2. 트랙을 추가해 나만의 플레이리스트 생성하기

검색한 트랙을 담아 플레이리스트를 만들고, 다른 사용자의 플레이리스트에 댓글과 좋아요를 남길 수 있습니다.

<img width="1894" height="919" alt="2" src="https://github.com/user-attachments/assets/39a5c9e5-fb90-4eee-af55-79d6665822aa" />

<!-- 이미지 영역(gif): 플레이리스트 생성 / 댓글 / 좋아요 -->

### 3. 생성된 플레이리스트로 비슷한 취향끼리 그룹 만들기

플레이리스트를 기준으로 그룹을 만들고, 취향이 맞는 사용자들과 함께 음악을 모아둘 수 있습니다.

<img width="1917" height="891" alt="image" src="https://github.com/user-attachments/assets/379f6f9a-70e7-4a6f-8a40-4e71bde24652" />


### 4. 생성된 플레이리스트로 스트리밍 세션 생성하여 공유

플레이룸을 열면 참여자 모두의 재생 위치가 실시간으로 동기화되고, 채팅으로 함께 이야기할 수 있습니다.

<img width="1918" height="922" alt="image" src="https://github.com/user-attachments/assets/26c1b173-6b0d-46db-9440-3cecd12c27b0" />


## 그 외 기능

1. **플레이리스트**: 댓글, 좋아요, 트랙 순서 수정, 좋아요한 플레이리스트 모아보기
2. **알림**: 좋아요, 댓글, 플레이룸 개설, 그룹 관련 요청, 팔로우
3. **로그인 및 회원가입**: 이메일 가입과 소셜 로그인 지원
4. **프로필**: 사용자 프로필 열람(모달/페이지) 및 팔로우·팔로잉

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Language | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) |
| Framework | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) |
| Style | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white) |
| State | ![Zustand](https://img.shields.io/badge/zustand-676355.svg?style=flat&logo=react) |
| Animation / Interaction | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-fad50b?style=flat&logo=framer&logoColor=black&=black) |
| Data Fetching | ![TanStack Query](https://img.shields.io/badge/TanStack_Query-181818?style=flat&logo=tanstack) |
| Real-time | ![STOMP over WebSocket (@stomp/stompjs)](https://img.shields.io/badge/stomp.js-51ceb7?style=flat&logo=javascript&logoColor=white) |
| Package Manager | ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=flat&logo=npm&logoColor=white) |
| Code Quality | ![ESLint](https://img.shields.io/badge/ESLint-%234B3263.svg?style=flat&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/prettier-%23192a32.svg?style=flat&logo=prettier&logoColor=dc524a) ![Husky](https://img.shields.io/badge/Husky-333?style=flat&logo=nodegui) |
| CI/CD | ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=flat&logo=githubactions&logoColor=white) ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=flat&logo=vercel&logoColor=white) |
| Collaboration | ![GitHub Projects](https://img.shields.io/badge/github_projects-6737ba?style=flat&logo=github) ![Notion](https://img.shields.io/badge/Notion-white.svg?style=flat&logo=notion&logoColor=black) ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=flat&logo=figma&logoColor=white) ![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=flat&logo=discord&logoColor=white) |
| Third-Party / Music API | ![react-youtube (Youtube API)](https://img.shields.io/badge/react_youtube-%23FF0000?style=flat&logo=youtubemusic) |

## R&R (담당자)

<table>
  <thead>
    <tr>
      <th width="70" align="center">이름</th>
      <th>작업</th>
      <th align="center">Github</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">박민규</td>
      <td>플레이룸 페이지(실시간 음악 재생 동기화, 실시간 채팅, 실시간 참여자 집계, 플레이룸 생성), 스테이지 페이지(플레이룸 목록), WebSocket 통신(STOMP.js)</td>
      <td align="center"><a href="https://github.com/minguru">minguru</a></td>
    </tr>
    <tr>
      <td align="center">고명한</td>
      <td>플레이리스트 페이지(좋아요, 댓글, 볼륨 컨트롤), 헤더 및 사이드바 추가, 그룹 수정, 검색 페이지, Button 컴포넌트, 인증 기능, SVGR 적용</td>
      <td align="center"><a href="https://github.com/Gomyeunghan">Gomyeunghan</a></td>
    </tr>
    <tr>
      <td align="center">김현주</td>
      <td>로그인·회원가입(소셜 로그인 포함) 페이지, 그룹 페이지, 프로필 페이지(팔로우/팔로잉), 알림 페이지, Kebab 메뉴, InputField 컴포넌트, 컴파운드 Modal</td>
      <td align="center"><a href="https://github.com/kkhhjjoo">kkhhjjoo</a></td>
    </tr>
  </tbody>
</table>

## 팀 그라운드 룰 및 컨벤션

### 그라운드 룰

- AI는 사용하되, 생성된 코드는 반드시 직접 파악하고 넘어가기
- 소프트웨어 개발 방법론 중 하나인 **애자일(Agile)** 기법으로 프로젝트 진행하기
  1. **피드백(Feedback)**: 팀원으로부터 자주 피드백을 받아 빠르게 개선한다
  2. **존중(Respect)**: 팀원들을 존중하며 협력한다
  3. **의사소통(Communication)**: 원활한 소통을 중요시한다
  4. **용기(Courage)**: 잘못된 코드는 과감하게 수정하고 필요한 변경을 두려워하지 않는다
  5. **단순성(Simplicity)**: 과설계하지 않고 필요한 기능만 구현한다
- 전문 용어를 적극적으로 사용하고 팀 내에 공유하기
- 팀장 말이 법이 아닙니다. 아닌 것 같은 건 바로 피드백 권장
- 백엔드 팀과는 급한 내용이 아닐 시 Discord 채팅으로만 협의 (급할 땐 보이스 미팅)

### 코딩 및 디렉토리 구조 컨벤션

- Husky를 사용한 pre-commit hook에서 ESLint 및 Prettier 통과 필수
- Github Actions 에서 빌드 검사 통과 필수
- 재사용되는 컴포넌트만 루트 경로 디렉토리로 분리하고, 특정 라우트에서만 사용되는 컴포넌트는 해당 라우트 안에 언더바(`_`)로 시작하는 **프라이빗 폴더**를 만들어 관리 (언더바 폴더는 라우팅에서 제외됨)
  - 예) 플레이리스트에서만 사용되는 버튼 → `/playlist/_components/Button.tsx`
- 라우트 그룹(Route Group) 을 사용해 URL에는 영향을 주지 않으면서 관련된 페이지를 그룹화하여 관리
  - 예) `/(auth)/login/page.tsx`, `/(auth)/signup/page.tsx`

### Git 브랜치 전략

| 브랜치 | 설명 |
| --- | --- |
| `main` | 배포용 실서비스 브랜치 (보호 브랜치) |
| `develop` | 개발 브랜치 (보호 브랜치) |
| `feature/라우트/기능명` | 기능 개발 브랜치 |
| `fix/라우트/버그명` | 버그 수정 브랜치 |
| `refactor/라우트/키워드` | 리팩토링 브랜치 |
| `style/라우트/키워드` | 스타일 수정 브랜치 |
| `chore/라우트/키워드` | 그 외 잡다한 작업 브랜치 (문서 수정, 라이브러리 설치 등) |

### 커밋 컨벤션

| 타입 | 용도 |
| --- | --- |
| `feat:` | 기능 구현 |
| `fix:` | 기능 수정 |
| `style:` | 스타일 수정 |
| `refactor:` | 리팩토링 (동작 변경 X) |
| `chore:` | 그 외 잡일 |

## 추후 개선 사항

### Refactoring

- 쿼리 키 관리 (쿼리 팩토리 패턴 적용)
- 공통 사용 영역 분리 및 재사용 적용
- 모달에 React Portal 사용 및 모달 재사용성 확장

### Enhancement

- 전체 디자인 통일화 및 개편
- 스트리밍 에러 처리 및 버그 수정 (중복 접속 처리 등)
- react-hook-form, zod를 적용하여 폼 처리 개선
- 사용자간의 실시간 메시지 기능 추가
- Jest를 사용한 테스트 코드 작성 (커버리지 60% 목표)

## 로컬 개발 환경

### 필요 환경 변수

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 채워주세요.

| 변수 | 설명 |
| --- | --- |
| `YOUTUBE_API_KEY` | YouTube Data API 키 (서버에서만 사용) |
| `NEXT_PUBLIC_WS_URL` | WebSocket 백엔드 서버 URL |
| `NEXT_PUBLIC_BE_API_URL` | API base URL |

### 실행 방법

```bash
npm install
npm run dev || npm run dev:https
```

감사합니다!
