/** @format */
"use client";

import { useTranslations } from "@/providers/TranslationProviders";
import React from "react";
type Props = {
  title?: string;
  children?: React.ReactNode;
  openModal: boolean;

  modalRef: React.RefObject<HTMLDivElement | null>;
};

const Modal: React.FC<Props> = ({ title, children, openModal, modalRef }) => {
  const { tran } = useTranslations();

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center bg-black/20 ${openModal ? "visible opacity-100" : "invisible opacity-0"} duration-500`}
    >
      <div
        ref={modalRef}
        className={`flex w-full max-w-[400px] flex-col gap-6 rounded-md bg-white p-8 text-center ${openModal ? "translate-y-0" : "translate-y-4"} duration-500`}
      >
        {title && (
          <p className="border-b border-slate-200 pb-6 text-xl font-semibold">
            {tran(title)}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
