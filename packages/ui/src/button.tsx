import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

export const buttonVariants = {
  variants: {
    variant: {
      default:
        'bg-primary-light-purple dark:bg-primary-dark-purple text-text-dark-gray dark:text-text-white shadow-interactive-light dark:shadow-interactive-dark hover:bg-primary-light-purple/90 dark:hover:bg-primary-dark-purple/90',
      secondary:
        'bg-secondary-light-purple dark:bg-secondary-dark-purple text-text-dark-gray dark:text-text-white shadow-interactive-light dark:shadow-interactive-dark hover:bg-secondary-light-purple/80 dark:hover:bg-secondary-dark-purple/80',
      tertiary: 'text-text-dark-gray dark:text-text-white shadow-interactive-light dark:shadow-interactive-dark',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
} as const;

const getVariant = cva(
  'hover:scale-[1.02] active:scale-100 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  buttonVariants,
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof getVariant> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={clsx(getVariant({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';
