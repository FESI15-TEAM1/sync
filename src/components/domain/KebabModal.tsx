'use client';

import {
  type ElementType,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import MoreIcon from '@/assets/icons/more.svg';
import type { PolymorphicProps } from '@/components/Button';
import IconButton from '@/components/IconButton';

/**
 * KebabModal 컴포넌트의 Props
 *
 * children: 메뉴 안에 들어갈 KebabItem
 * trigger: 기본 더보기 버튼 대신 사용할 커스텀 트리거
 * triggerLabel: 커스텀 트리거의 접근성을 위한 aria-label
 */
type KebabModalProps = {
  children: ReactNode;
  trigger?: ReactNode;
  triggerLabel?: string;
};

/**
 * KebabItem 자체에서 사용하는 Props
 */
type KebabItemOwnProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
};

/**
 * 케밥 메뉴(더보기 메뉴)를 보여주는 컴포넌트
 *
 * 기본적으로 MoreIcon을 보여주며,
 * trigger Props를 전달하면 원하는 요소를 메뉴 열기 버튼으로 사용할 수 있습니다.
 */
function KebabModal({ children, trigger, triggerLabel }: KebabModalProps) {
  // 메뉴가 열려 있는지 여부를 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * 메뉴 영역을 참조하기 위한 ref
   *
   * 바깥 영역을 클릭했는지 판단할 때 사용합니다.
   */
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * 메뉴가 열려 있을 때 document의 mousedown 이벤트를 감지합니다.
   *
   * 메뉴 바깥을 클릭하면 메뉴를 닫습니다.
   */
  useEffect(() => {
    // 메뉴가 닫혀 있다면 이벤트 리스너를 등록할 필요가 없습니다.
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      /**
       * 클릭한 요소가 메뉴 영역 안에 포함되어 있지 않다면
       * 외부 클릭으로 판단하여 메뉴를 닫습니다.
       */
      if (!menuRef.current?.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // document에 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);

    /**
     * 메뉴가 닫히거나 컴포넌트가 언마운트될 때
     * 이벤트 리스너를 제거합니다.
     *
     * 이벤트 리스너를 제거하지 않으면 메모리 누수나
     * 불필요한 이벤트 실행이 발생할 수 있습니다.
     */
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    // relative를 기준으로 메뉴를 absolute로 배치하기 위해 사용
    <div className="relative shrink-0" ref={menuRef}>
      {trigger ? (
        /**
         * 커스텀 trigger가 전달된 경우
         * 전달받은 요소를 버튼으로 감싸서 메뉴를 열고 닫습니다.
         */
        <button
          type="button"
          aria-label={triggerLabel}
          className="cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {trigger}
        </button>
      ) : (
        /**
         * trigger가 없는 경우 기본 더보기 아이콘 버튼을 사용합니다.
         */
        <IconButton size="sm" onClick={() => setIsMenuOpen((prev) => !prev)}>
          <MoreIcon className="text-white" />
        </IconButton>
      )}

      {isMenuOpen && (
        /**
         * 메뉴가 열렸을 때만 DOM에 렌더링합니다.
         *
         * top-full: 트리거 버튼 바로 아래에 배치
         * right-0: 오른쪽 기준으로 정렬
         * z-10: 다른 요소보다 위에 표시
         */
        <div
          className="absolute top-full right-0 z-10 mt-2 flex w-max min-w-40 flex-col rounded-lg bg-zinc-800 p-2"
          /**
           * 메뉴 아이템을 클릭하면 메뉴를 닫습니다.
           */
          onClick={() => setIsMenuOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * KebabItem
 *
 * 케밥 메뉴 안에서 사용하는 개별 메뉴 아이템입니다.
 *
 * PolymorphicProps를 사용하기 때문에
 * 기본적으로 button으로 렌더링하면서 필요하면
 * Link 등의 다른 HTML 요소로 변경할 수 있습니다.
 *
 * 예:
 * <KebabModal.Item>삭제</KebabModal.Item>
 *
 * <KebabModal.Item as={Link} href="/edit">
 *   수정
 * </KebabModal.Item>
 */
function KebabItem<C extends ElementType = 'button'>({
  children,
  onClick,
  variant = 'default',
  as,
  ...props
}: PolymorphicProps<C> & KebabItemOwnProps) {
  /**
   * as가 전달되면 해당 컴포넌트를 사용하고,
   * 전달되지 않으면 기본적으로 button을 사용합니다.
   *
   * 이를 Polymorphic Component 패턴이라고 합니다.
   */
  const Comp = as || 'button';

  /**
   * 현재 렌더링되는 요소가 기본 button인지 확인합니다.
   */
  const isDefaultButton = Comp === 'button';

  /**
   * variant에 따라 텍스트 색상을 변경합니다.
   *
   * danger: 삭제와 같이 위험한 작업
   * default: 일반적인 메뉴
   */
  const textColor = variant === 'danger' ? 'text-red-500' : 'text-white';

  return (
    <Comp
      /**
       * button일 때만 type="button"을 설정합니다.
       *
       * button의 기본 type은 submit이기 때문에
       * form 내부에서 의도하지 않은 submit이 발생하는 것을 방지합니다.
       *
       * Link 등 button이 아닌 요소에는 type 속성을 전달하지 않습니다.
       */
      type={isDefaultButton ? 'button' : undefined}
      className={`w-full cursor-pointer px-4 py-3 text-left whitespace-nowrap ${textColor} hover:bg-zinc-700`}
      onClick={(e: ReactMouseEvent) => {
        /**
         * 기본 button이 아닌 경우에는
         * 별도의 기본 동작을 막지 않습니다.
         *
         * Link를 사용하는 경우 페이지 이동이 정상적으로 동작해야 하기 때문입니다.
         */
        if (isDefaultButton) {
          /**
           * button이 Link 등의 조상 요소 안에 포함된 경우
           * 클릭 이벤트가 조상 요소까지 버블링되면서
           * 조상의 기본 동작이 발생하는 상황을 방지합니다.
           */
          e.preventDefault();
        }

        // 전달받은 클릭 핸들러 실행
        onClick?.();
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

/**
 * Compound Component 패턴
 *
 * KebabModal.Item 형태로 사용할 수 있도록
 * KebabItem을 KebabModal의 정적 프로퍼티로 연결합니다.
 *
 * 사용 예:
 *
 * <KebabModal>
 *   <KebabModal.Item onClick={handleEdit}>
 *     수정
 *   </KebabModal.Item>
 *   <KebabModal.Item variant="danger" onClick={handleDelete}>
 *     삭제
 *   </KebabModal.Item>
 * </KebabModal>
 */
KebabModal.Item = KebabItem;

export default KebabModal;
