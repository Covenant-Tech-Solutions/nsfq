interface ConfettiButtonProps {
  idx: number;
  item: string;
  isSelected: string | null;
  onSelect: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  loading: boolean;
  isCorrect: boolean | null;
  correctAnswer: string | null;
  value: string;
}

export default function ConfettiButton({
  idx,
  item,
  isSelected,
  onSelect,
  loading,
  isCorrect,
  correctAnswer,
  value,
}: ConfettiButtonProps) {
  return (
    <button
      className="block w-full"
      onClick={(e) => onSelect(value, e)}
      disabled={loading}
    >
      <span
        className={`hover:border-primary flex w-full items-start justify-start gap-3 rounded-md border px-4 py-3 duration-300 ${
          (isSelected === value && isCorrect === true) ||
          (correctAnswer === value && isCorrect == true) ||
          (correctAnswer === value && isCorrect === false)
            ? "border-primary"
            : isSelected === value && isCorrect === false
              ? "border-red-600"
              : "border-dark5"
        }`}
      >
        <span className="border-dark5 flex size-7 items-center justify-center rounded-sm border">
          {idx + 1}
        </span>
        {item}
      </span>
    </button>
  );
}
