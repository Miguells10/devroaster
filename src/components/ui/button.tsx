import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/lib/utils'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-jetbrains',
  variants: {
    variant: {
      primary: 'bg-accent-green text-[#0A0A0A] hover:bg-accent-green/90',
      secondary: 'bg-transparent text-foreground border border-border-primary hover:bg-secondary/20',
      outline: 'border border-border-primary bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'bg-transparent text-muted-foreground border border-border-primary hover:text-foreground',
      destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
    },
    size: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-6 py-[10px] text-[13px]',
      lg: 'h-12 px-8 text-base',
      primary: 'px-6 py-[10px] text-[13px]',
      secondary: 'px-4 py-2 text-xs',
      link: 'px-3 py-[6px] text-xs',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'primary',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
