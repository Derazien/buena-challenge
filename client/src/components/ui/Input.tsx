import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <div className="relative w-full inline-flex items-center flex-nowrap h-12">
        <input
          type={type}
          className={cn(
            "stepper-arrow-hide dark:[color-scheme:dark] peer absolute top-0 left-0 w-full h-full",
            "px-4 text-just16 leading-6 outline-none text-left appearance-none rounded-12",
            "border border-stone-200 dark:border-neutral-700 text-stone-950 dark:text-neutral-50",
            "disabled:text-stone-400 shadow-level1 dark:shadow-none",
            "disabled:text-stone-300 dark:disabled:text-neutral-700",
            "placeholder:text-stone-400 dark:placeholder:text-neutral-400",
            "bg-white dark:bg-neutral-700 disabled:bg-white",
            "focus:border-stone-300 hover:border-stone-300",
            "dark:focus:border-neutral-500 dark:hover:border-neutral-500", 
            "dark:bg-neutral-800 dark:text-gray-300",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="flex flex-row items-center"></div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 