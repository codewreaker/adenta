import { type ButtonProps, buttonVariants } from "@/base/ui/button";
import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { cn } from "../utils";
import { Loader2 } from "lucide-react";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({
			className,
			variant,
			size,
			asChild = false,
			loading = false,
			children,
			...props
		},
		ref) => {
		const Comp = asChild ? Slot : "button";

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			>
        <>
        {(loading && !asChild) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				{children}
        </>
			</Comp>
		);
	},
);
Button.displayName = "Button";

export default Button;
