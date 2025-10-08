/** @format */
// "use client";
import { InputValidationMessage } from "@/components/ui/InputValidationMessage";
import { countryCodes } from "@/constants/country-codes";
import useClickOutside from "@/hooks/useClickOutside";
import { useTranslations } from "@/providers/TranslationProviders";
import {
  CaretDownIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useMemo, useState } from "react";
export default function InputPhone({
  setCountryCode,
  setDialCode,
  setPhoneNumber,
  phone,
  dialCode,
  errors,
  name,
}: {
  phone: string;
  dialCode: string;
  setCountryCode: (code: string) => void;
  setDialCode: (code: string) => void;
  setPhoneNumber: (number: string) => void;
  errors: any;
  name: string;
}) {
  const { modal, setModal, modalRef } = useClickOutside();
  const [search, setSearch] = useState("");
  const { tran } = useTranslations();
  const filteredCountries = useMemo(
    () =>
      countryCodes.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <div className="">
      <label htmlFor="phone" className="text-sm font-medium">
        {tran("Phone Number")}
      </label>
      <div className="flex items-center justify-start gap-2">
        <div className="relative" ref={modalRef}>
          <p
            onClick={() => setModal((prev) => !prev)}
            className="text-light4 border-primary/20 flex cursor-pointer items-center justify-center gap-1 rounded-xl border bg-white px-4 py-2 text-sm outline-none sm:py-[11px]"
          >
            <span className="text-sm font-medium">{dialCode}</span>
            <CaretDownIcon />
          </p>
          <div
            className={`border-primary/20 absolute top-12 left-0 z-10 max-h-[250px] w-[250px] overflow-auto rounded-xl border bg-white py-4 shadow ${modal ? "visible -translate-y-2 opacity-100" : "invisible translate-y-0 opacity-0"} duration-300`}
          >
            <div className="px-2">
              <div className="border-primary/20 flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-2 py-2 text-sm">
                <input
                  type="text"
                  placeholder="Search"
                  className="outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <MagnifyingGlassIcon />
              </div>
            </div>
            <ul className="text-light4 flex flex-col gap-2 pt-3 text-sm">
              {filteredCountries.map((country, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setModal(false);
                    setPhoneNumber(`${phone}`);
                    setCountryCode(country.code);
                    setDialCode(country.dial_code);
                  }}
                  className="hover:text-primary flex cursor-pointer items-center justify-between gap-3 px-4 duration-300"
                >
                  <span>{country.name}</span>
                  <span>{country.dial_code}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder={tran("Enter Your Phone Number")}
          className="border-primary/20 w-full rounded-xl border bg-white px-5 py-2 text-sm outline-none sm:py-3"
          value={phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPhoneNumber(e.target.value)
          }
        />
      </div>
      <InputValidationMessage message={errors?.[name]} />
    </div>
  );
}
