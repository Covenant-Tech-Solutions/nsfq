/** @format */

import DataNotFound from "@/components/ui/DataNotFound";
import ImageLoader from "@/components/ui/ImageLoader";
import Loader from "@/components/ui/Loader";
import { DepositFormType, PaymentMethodType } from "@/types/payment";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import React from "react";

type MethodsProps = {
  depositForm: DepositFormType | null;
  handleSelectDepositForm: (depositForm: DepositFormType) => void;
  paymentGateways: PaymentMethodType[];
  isLoading: boolean;
};

const Methods: React.FC<MethodsProps> = ({
  handleSelectDepositForm,
  depositForm,
  paymentGateways,
  isLoading,
}) => {
  if (isLoading) return <Loader />;

  return paymentGateways?.length ? (
    <div className="grid grid-cols-1 items-center justify-start gap-3 overflow-auto max-lg:max-h-[250px] min-[1500px]:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
      {paymentGateways?.map((item) => (
        <span
          key={item.id}
          onClick={() => handleSelectDepositForm(item as DepositFormType)}
          className={`${depositForm?.slug === item.slug ? "border-primary" : "border-light2/30"} relative flex cursor-pointer items-center justify-start gap-2 rounded-md border px-3 py-4`}
        >
          <ImageLoader
            src={item?.image}
            alt={item?.name}
            height={32}
            width={32}
            className="size-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium">{item.name}</span>
          <span
            className={`absolute top-2 right-2 flex size-4.5 items-center justify-center rounded-full border ${depositForm?.slug === item.slug ? "border-primary bg-primary text-white" : "border-light2/30 text-transparent"}`}
          >
            <CheckIcon size={12} />
          </span>
        </span>
      ))}
    </div>
  ) : (
    <DataNotFound />
  );
};

export default Methods;
