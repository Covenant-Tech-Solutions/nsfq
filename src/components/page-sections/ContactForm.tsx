import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { usePageComponent } from "@/hooks/usePageComponent";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { InputGroup } from "../ui/InputGroup";

const ContactForm = ({ slug }: { slug: string }) => {
  const { tran, getData } = usePageComponent({
    slug,
    sectionSlug: "contact-form",
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const {
    mutate,
    isLoading,
    backendErrors: errors,
  } = useQueryMutation({
    isPublic: true,
    url: `contact-us`,
  });

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(contactForm, {
      onSuccess: (response: any) => {
        toast.success(tran(response?.data?.message));
      },
    });
  };
  return (
    <section className="stp-30 custom-container">
      <div className="bg-dark4 border-dark5 rounded-md border p-6 md:p-10">
        <form
          onSubmit={handleSendMessage}
          className="grid w-full grid-cols-12 gap-4 sm:gap-6"
        >
          <div className="col-span-6">
            <InputGroup
              label={tran("Your Name")}
              type="text"
              name="name"
              value={contactForm.name}
              errors={errors}
              onChange={(e) =>
                setContactForm((prev) => ({
                  ...prev,
                  name: e,
                }))
              }
              placeholder={tran("Enter your name")}
            />
          </div>
          <div className="col-span-6">
            <InputGroup
              label={tran("Email Address")}
              type="email"
              name="email"
              value={contactForm.email}
              errors={errors}
              onChange={(e) =>
                setContactForm((prev) => ({
                  ...prev,
                  email: e,
                }))
              }
              placeholder={tran("Enter your email")}
            />
          </div>

          <div className="col-span-12 flex flex-col items-start justify-start gap-3">
            <p className="text-sm font-medium">
              {tran("Describe your message")}
            </p>
            <textarea
              placeholder={tran("Your message")}
              value={contactForm.message}
              onChange={(e) =>
                setContactForm({
                  ...contactForm,
                  message: e.target.value,
                })
              }
              className="border-primary/30 min-h-40 w-full rounded-md border bg-white px-3 py-2 outline-none max-sm:text-sm sm:px-4 sm:py-3"
            ></textarea>
          </div>
          <div className="col-span-12 flex w-full justify-end pt-6">
            <Button type="submit" loading={isLoading}>
              {tran(getData("button_text"))}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
