import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-terracotta text-white shadow-warm hover:bg-terracotta-dark hover:shadow-warm-md hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md",
        outline:
          "border-2 border-terracotta/30 bg-transparent text-foreground hover:border-terracotta hover:bg-terracotta/5 hover:text-terracotta",
        secondary:
          "bg-sage/10 text-sage-dark border border-sage/20 hover:bg-sage/20 hover:border-sage/40",
        ghost: "hover:bg-terracotta/5 hover:text-terracotta",
        link: "text-terracotta underline-offset-4 hover:underline hover:text-terracotta-dark",
        // Brand variants
        terracotta: "bg-terracotta text-white shadow-warm hover:bg-terracotta-dark hover:shadow-warm-md hover:-translate-y-0.5",
        sage: "bg-sage text-white shadow-sm hover:bg-sage-dark hover:shadow-md hover:-translate-y-0.5",
        warm: "bg-gradient-to-r from-terracotta to-terracotta-dark text-white shadow-warm-lg hover:shadow-warm-xl hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
