// components/PhosphorIcon.tsx
import * as PhosphorIcons from "@phosphor-icons/react";
import { IconProps } from "@phosphor-icons/react";
import React from "react";

// Define weight mapping once
const weightMap = {
  fill: "fill",
  bold: "bold",
  light: "light",
  thin: "thin",
  duotone: "duotone",
} as const;

type WeightType = keyof typeof weightMap;

interface PhosphorIconProps extends Omit<IconProps, "weight"> {
  iconName: string;
  size?: number;
  color?: string;
  className?: string;
  weight?: WeightType;
}

// Helper: convert kebab-case / spaced names to PascalCase
const toPascalCase = (str: string) =>
  str
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

const PhosphorIcon: React.FC<PhosphorIconProps> = ({
  iconName,
  size = 24,
  color,
  className,
  weight: propWeight,
  ...props
}) => {
  if (!iconName || typeof iconName !== "string") {
    iconName = "Question";
  }

  // Split and detect weight
  const parts = iconName
    .toLowerCase()
    .trim()
    .split(/[\s-]+/);

  const detectedWeight =
    (parts.find((part) => part in weightMap) as WeightType) || "regular";

  // Remove known prefixes and weight indicators
  const cleanName = toPascalCase(
    parts.filter((part) => !(part in weightMap) && part !== "ph").join("-"),
  );

  const finalWeight = propWeight || detectedWeight;
  const IconComponent =
    (PhosphorIcons as any)[cleanName] || (PhosphorIcons as any)["Question"];

  return (
    <IconComponent
      size={size}
      color={color}
      className={className}
      weight={finalWeight}
      {...props}
    />
  );
};

export default PhosphorIcon;
