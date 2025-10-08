"use client";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useTranslations } from "@/providers/TranslationProviders";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
export default function Subscribe() {
  const { tran } = useTranslations();
  const [email, setEmail] = useState("");

  const { mutate, isLoading } = useQueryMutation({
    isPublic: true,
    url: "subscribe-newsletter",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { email },
      {
        onSuccess: (response: any) => {
          toast.success(tran(response?.data?.message));
          setEmail("");
        },
      },
    );
  };

  return (
    <div className="custom-container bg-primary relative z-[10] -mb-[100px] flex items-center justify-between gap-6 p-4 max-md:flex-col min-[400px]:p-8 lg:p-[60px] 2xl:gap-32">
      <div className="max-w-[450px]">
        <h2 className="heading-2 text-white">
          {tran("Subscribe For The Daily Updates")}
        </h2>
        <p className="pt-3 text-lg text-white/80 max-[450px]:text-base">
          {tran(
            "Discover why users love our quizzes. Fun, educational, and completely engaging",
          )}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-3 rounded-md bg-white py-2 pr-2 pl-5"
      >
        <input
          type="text"
          placeholder="Enter Your Email"
          className="w-full flex-1 bg-transparent outline-none sm:w-[150px] lg:min-w-[250px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          loading={isLoading}
          type="submit"
          className="bg-primary rounded-md p-2 font-medium text-white max-sm:text-sm sm:px-5 sm:py-3"
        >
          {tran("Subscribe")}
        </Button>
      </form>
    </div>
  );
}
