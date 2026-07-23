declare module '*.svg' {
  import { type FC, type SVGProps } from 'react';

  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}
