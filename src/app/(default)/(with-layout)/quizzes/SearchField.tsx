/** @format */
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef } from "react";

type Props = {
  searchText: string;
  setSearchText: (searchText: string) => void;
};

const SearchField = ({ searchText, setSearchText }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchText]);

  return (
    <div className="border-primary/20 bg-primary/5 flex items-center justify-start gap-3 rounded-lg border px-5 py-2 text-sm sm:py-3">
      <MagnifyingGlassIcon className="text-lg" />
      <input
        ref={inputRef}
        type="text"
        name="search"
        placeholder="Search quiz..."
        className="w-full bg-transparent outline-none placeholder:text-sm"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchField;
