/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import {
  client,
  hostedFields,
  dataCollector,
  HostedFields,
} from "braintree-web";
import { useTranslations } from "@/providers/TranslationProviders";

type BraintreeFormProps = {
  authorization: string;
  return_url: string;
};

export default function BraintreeForm({
  authorization,
  return_url,
}: BraintreeFormProps) {
  const { tran } = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const [hostedFieldsInstance, setHostedFieldsInstance] =
    useState<HostedFields | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const setupBraintree = async () => {
      try {
        const clientInstance = await client.create({ authorization });

        const hfInstance = await hostedFields.create({
          client: clientInstance,
          styles: {
            input: {
              fontSize: "16px",
              fontFamily: "roboto, verdana, sans-serif",
              fontWeight: "lighter",
              color: "black",
            },
            ":focus": { color: "black" },
            ".valid": { color: "black" },
            ".invalid": { color: "black" },
          },
          fields: {
            number: {
              selector: "#card-number",
              placeholder: "1111 1111 1111 1111",
            },
            cvv: {
              selector: "#cvv",
              placeholder: "111",
            },
            expirationDate: {
              selector: "#expiration-date",
              placeholder: "MM/YY",
            },
            postalCode: {
              selector: "#postal-code",
              placeholder: "11111",
            },
          },
        });

        setHostedFieldsInstance(hfInstance);
        setLoading(false);
      } catch (error: any) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    };

    setupBraintree();
  }, [authorization]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hostedFieldsInstance) return;

    try {
      const clientInstance = await client.create({ authorization });
      const deviceDataInstance = await dataCollector.create({
        client: clientInstance,
      });
      const tokenized = await hostedFieldsInstance.tokenize();

      const redirectUrl = `${return_url}&token=${tokenized.nonce}&deviceData=${deviceDataInstance.deviceData}`;
      window.location.href = redirectUrl;
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {loading && <p>{tran("Loading Braintree form...")}</p>}

      <div className="form-group">
        <label htmlFor="card-number">{tran("Card Number")}</label>
        <div id="card-number" className="hosted-field" />
      </div>

      <div className="form-group">
        <label htmlFor="cvv">{tran("CVV")}</label>
        <div id="cvv" className="hosted-field" />
      </div>

      <div className="form-group">
        <label htmlFor="expiration-date">{tran("Expiration Date")}</label>
        <div id="expiration-date" className="hosted-field" />
      </div>

      <div className="form-group">
        <label htmlFor="postal-code">{tran("Postal Code")}</label>
        <div id="postal-code" className="hosted-field" />
      </div>

      <button type="submit" className="btn-primary mt-4">
        {tran("Pay")}
      </button>
    </form>
  );
}
