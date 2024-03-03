import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

export function H1({ className, ...props }: HeadingProps) {
  return (
    <h1 className={clsx('text-3xl md:text-5xl', className)} {...props}>
      {props.children}
    </h1>
  );
}

export function H2({ className, ...props }: HeadingProps) {
  return (
    <h2 className={clsx('text-2xl md:text-4xl', className)} {...props}>
      {props.children}
    </h2>
  );
}

export function H3({ className, ...props }: HeadingProps) {
  return (
    <h3 className={clsx('text-xl md:text-2xl', className)} {...props}>
      {props.children}
    </h3>
  );
}

export function H4({ className, ...props }: HeadingProps) {
  return (
    <h4 className={clsx('text-lg md:text-xl', className)} {...props}>
      {props.children}
    </h4>
  );
}
