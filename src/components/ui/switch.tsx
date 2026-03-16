"use client";

import type * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { tv, type VariantProps } from "tailwind-variants";

const switchVariants = tv({
	slots: {
		root: "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 bg-bg-surface data-[checked]:bg-accent-green",
		thumb: "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out data-[checked]:translate-x-4 translate-x-0",
	},
});

export interface SwitchProps
	extends React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>,
		VariantProps<typeof switchVariants> {}

const Switch = ({ className, ...props }: SwitchProps) => {
	const { root, thumb } = switchVariants();
	return (
		<BaseSwitch.Root className={root({ className }) as string} {...props}>
			<BaseSwitch.Thumb className={thumb() as string} />
		</BaseSwitch.Root>
	);
};

Switch.displayName = "Switch";

export { Switch };
