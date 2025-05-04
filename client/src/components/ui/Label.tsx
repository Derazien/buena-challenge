import React, { LabelHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    className?: string;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => {
        return (
            <label
                className={cn(
                    "text-sm font-medium block mb-2 text-stone-950 dark:text-white",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Label.displayName = 'Label';

export default Label;