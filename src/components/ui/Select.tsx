/** @format */

import useClickOutside from "@/hooks/useClickOutside";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import React from "react";

interface SelectProps {
  name: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  name,
  value,
  options,
  onChange,
  placeholder = "Select option",
  className,
}) => {
  const { modal, setModal, modalRef } = useClickOutside();
  const handleSelect = (val: string) => {
    onChange(val);
    setModal(false);
  };

  return (
    <div ref={modalRef} className={clsx("relative w-full", className)}>
      <button
        type="button"
        id={name}
        name={name}
        onClick={() => setModal((prev) => !prev)}
        className={clsx(
          "border-primary/30 flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-5 py-2 text-sm outline-none sm:py-3",
          "transition-all",
        )}
      >
        <span className={clsx("capitalize", !value && "text-gray-400")}>
          {value || placeholder}
        </span>
        <CaretDownIcon />
      </button>

      <div
        className={clsx(
          "absolute top-11 right-0 left-0 z-20 transition-all",
          modal
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-4 opacity-0",
        )}
      >
        <ul className="border-primary/20 flex max-h-[150px] flex-col gap-3 overflow-auto rounded-md border bg-white p-4 text-sm font-medium shadow">
          {options.map((option) => (
            <li
              key={option?.value}
              className="hover:text-primary cursor-pointer capitalize duration-300"
              onClick={() => handleSelect(option.value)}
            >
              {option?.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
