import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export type BodyProps = HTMLAttributes<HTMLBodyElement>;

export function Body({ children, className, ...props }: BodyProps) {
  return (
    <body
      {...props}
      className={twMerge(
        className,
        'min-h-[100vh] w-[100vw] overflow-x-hidden bg-background-light-gray dark:bg-background-dark-gray text-lg text-text-dark-gray dark:text-text-white',
      )}
    >
      {children}
    </body>
  );
}
