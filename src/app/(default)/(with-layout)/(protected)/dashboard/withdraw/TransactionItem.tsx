import { useTranslations } from "@/providers/TranslationProviders";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

interface Props {
  type: string;
  title: string;
  time: string;
  amount: string;
}

export default function TransactionItem({ title, time, amount }: Props) {
  const { tran } = useTranslations();

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-white p-4">
      <div className="flex items-center justify-start gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-xl">
          <PlusIcon />
        </div>
        <div>
          <p className="font-medium">{tran(title)}</p>
          <p className="text-light4 text-sm">{tran(time)}</p>
        </div>
      </div>
      <p className="text-primary font-medium">{tran(amount)}</p>
    </div>
  );
}
