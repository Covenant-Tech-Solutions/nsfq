/** @format */
"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import { cn } from "@/utils/cn";
import { SpinnerIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React, { useMemo } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "primary-outline"
  | "secondary-outline"
  | "danger"
  | "danger-outline";
export type ButtonSize = "sm" | "md" | "lg" | "xl";
export type ButtonRounded = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children?: React.ReactNode;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  target?: string;
}

const BASE_STYLE =
  "inline-flex relative items-center max-sm:px-3 max-sm:py-2 justify-center gap-2 font-medium  transition-colors  disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white border border-primary hover:bg-white hover:text-primary",
  secondary:
    "bg-secondary text-white border border-secondary hover:bg-white hover:text-secondary",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-white",
  "primary-outline":
    "border border-primary text-primary hover:bg-primary hover:text-white",
  "secondary-outline":
    "border border-secondary text-secondary hover:bg-secondary hover:text-white",
  danger:
    "bg-danger text-white border border-danger hover:bg-white hover:text-danger",
  "danger-outline":
    "border border-danger text-danger hover:bg-danger hover:text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-base rounded-lg",
  lg: "px-6 py-3 text-lg rounded-xl",
  xl: "px-8 py-4 text-xl rounded-2xl",
};

const roundedStyles: Record<ButtonRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      href,
      type = "button",
      children,
      className,
      onClick,
      disabled = false,
      loading = false,
      target,
      variant = "primary",
      size = "md",
      rounded = "full",
      ...props
    },
    ref,
  ) => {
    const { tran } = useTranslations();

    const buttonClasses = useMemo(
      () =>
        cn(
          BASE_STYLE,
          variantStyles[variant],
          sizeStyles[size],
          rounded !== "full" && roundedStyles[rounded], // Only apply if not default
          className,
        ),
      [variant, size, rounded, className],
    );

    const content = loading ? (
      <>
        <SpinnerIcon className="animate-spin" />
        {tran("Loading...")}
      </>
    ) : (
      children
    );

    if (href) {
      return (
        <Link
          href={href || "#"}
          target={target}
          className={buttonClasses}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          aria-disabled={disabled || loading}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={buttonClasses}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...props}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";
