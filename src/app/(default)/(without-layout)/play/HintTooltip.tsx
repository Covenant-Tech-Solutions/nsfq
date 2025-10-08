"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import { LightbulbIcon } from "@phosphor-icons/react";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function HintTooltip({ hint }: { hint: string }) {
  const { tran } = useTranslations();
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="flex items-center gap-1 rounded-sm py-2.5 font-medium text-yellow-600 sm:px-8">
            <LightbulbIcon />
            {tran("Hint")}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="shadow-lg" sideOffset={5}>
            <div className="border-primary/20 max-h-[250px] w-[250px] overflow-y-auto rounded-md border bg-white p-3 text-center">
              <p className="pb-3">{hint}</p>
            </div>

            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
