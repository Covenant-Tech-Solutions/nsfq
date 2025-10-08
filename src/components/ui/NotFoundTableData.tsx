import { useTranslations } from "@/providers/TranslationProviders";
import { IconProps } from "@phosphor-icons/react";

type Props = {
  icon: React.ComponentType<IconProps>;
  text: string;
};

const NotFoundTableData = ({ icon: Icon, text }: Props) => {
  const { tran } = useTranslations();
  return (
    <div className="mt-5 w-full px-4 py-3 text-sm text-slate-600">
      <div className="flex flex-col items-center justify-center text-center">
        <Icon className="text-muted-foreground mb-2 h-8 w-8" />
        <p className="text-lg font-medium">{tran(text)}</p>
      </div>
    </div>
  );
};

export default NotFoundTableData;
