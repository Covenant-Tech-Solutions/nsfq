/** @format */

import addCoinIcon from "@/../public/add-coin-icon.svg";
import { Button } from "@/components/ui/Button";
import ImageLoader from "@/components/ui/ImageLoader";
import { useTranslations } from "@/providers/TranslationProviders";

interface Props {
  coins?: number;
}

export default function DepositSummary({ coins = 0 }: Props) {
  const { tran } = useTranslations();

  return (
    <div className="flex items-center justify-between pt-6">
      <div className="flex w-full flex-wrap items-center justify-between rounded-lg bg-white p-3 sm:p-6">
        <div className="flex items-start justify-start gap-3">
          <p className="heading-3 text-slate-500">{tran("Total Coins")} :</p>
          <div className="flex items-center justify-start gap-2 text-3xl font-medium">
            <ImageLoader
              src={addCoinIcon}
              width={512}
              height={512}
              alt="Coin"
              className="size-10"
            />
            <span>{coins}</span>
          </div>
        </div>
        <div>
          <Button href="/payment" size="sm">
            {tran("Buy Coins")}
          </Button>
        </div>
      </div>
    </div>
  );
}
