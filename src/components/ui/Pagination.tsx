/** @format */

import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
} from "@phosphor-icons/react/dist/ssr";

interface PaginationButtonsProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: Readonly<PaginationButtonsProps>) {
  const baseClass =
    "size-8 hover:bg-primary flex justify-center items-center border rounded-md duration-300 border-primary hover:border-primary hover:text-white";

  function renderButton(page: number, isActive: boolean = false) {
    return (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`${baseClass} ${isActive ? "!bg-primary !border-primary !text-white" : ""}`}
      >
        {page}
      </button>
    );
  }

  function renderEllipsis(key: string) {
    return (
      <span key={key} className={baseClass}>
        ...
      </span>
    );
  }

  function getButtons() {
    const buttons = [];
    if (lastPage > 5) {
      if (currentPage > 4) {
        buttons.push(renderButton(1));
        buttons.push(renderEllipsis("start-ellipsis"));
      }

      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(lastPage, currentPage + 1);
        i++
      ) {
        buttons.push(renderButton(i, currentPage === i));
      }

      if (currentPage < lastPage - 2) {
        buttons.push(renderEllipsis("end-ellipsis"));
        buttons.push(renderButton(lastPage));
      }
    } else {
      for (let i = 1; i <= lastPage; i++) {
        buttons.push(renderButton(i, currentPage === i));
      }
    }
    return buttons;
  }

  return lastPage > 1 ? (
    <div className="mt-8 flex items-center justify-center">
      <div className="flex items-center justify-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="hover:text-primary disabled:!text-light4 text-xl font-medium duration-300 disabled:!cursor-not-allowed disabled:!opacity-50"
        >
          <CaretDoubleLeftIcon />
        </button>
        <div className="flex items-center justify-start gap-2 font-medium">
          {getButtons()}
        </div>
        <button
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="hover:text-primary disabled:!text-light4 text-xl font-medium duration-300 disabled:!cursor-not-allowed disabled:!opacity-50"
        >
          <CaretDoubleRightIcon />
        </button>
      </div>
    </div>
  ) : null;
}
