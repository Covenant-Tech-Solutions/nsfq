import { useCallback, useState } from "react";

export function useOAuthPopup() {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [provider, setProvider] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openGlobalPopup = useCallback((url: string) => {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    setError(null);
    setProvider(null);
    setAuthCode(null);

    const popup = window.open(
      url,
      "openGlobalPopup",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    if (!popup) {
      setError("Failed to open popup. Please allow popups for this website.");
      return;
    }

    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const { code, error, provider } = event.data;
      if (code && provider) {
        setAuthCode(code);
        setProvider(provider);
        popup.close();
      } else if (error) {
        setError(error);
        setProvider(false);
      }
    };

    window.addEventListener("message", receiveMessage);

    // Set a timeout to stop the authentication process if it takes too long
    const timeoutId = setTimeout(() => {
      setError("Authentication timed out");
      popup.close();
    }, 120000); // 2 minutes timeout

    return () => {
      window.removeEventListener("message", receiveMessage);
      clearTimeout(timeoutId);
    };
  }, []);

  return { openGlobalPopup, authCode, error, provider };
}
