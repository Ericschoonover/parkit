import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface LinkButtonProps extends React.ComponentProps<typeof Link> {
  variant?: NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
  size?: NonNullable<VariantProps<typeof buttonVariants>["size"]>;
}

export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
