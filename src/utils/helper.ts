/** @format */

import { MenuItem } from "@/types/menu";
import DOMPurify from "dompurify";
import { RemotePattern } from "next/dist/shared/lib/image-config";
/**
 * Parses a server URL and returns an object containing its components.
 *
 * @format
 * @param {string} serverBaseUrl - The server URL to parse.
 * @returns {Object} An object with the following properties: - protocol: The protocol of the URL (e.g., "http"). - hostname: The hostname of the URL (e.g., "127.0.0.1"). - port: The port of the URL, or an empty string if not specified. - prefix: A constant prefix "/**". If the URL is invalid, defaults to an object with protocol "http", hostname "127.0.0.1", port "8000", and prefix "/**".
 */

export const parseServerUrl = (serverBaseUrl: string) => {
  // Fallback if missing
  if (!serverBaseUrl) {
    console.warn(
      "[parseServerUrl] SERVER_URL is missing, using fallback defaults.",
    );
    return {
      protocol: "https",
      hostname: "localhost",
      port: "",
      prefix: "/**",
    };
  }

  try {
    const normalizedUrl = serverBaseUrl.endsWith("/")
      ? serverBaseUrl
      : `${serverBaseUrl}/`;
    const url = new URL(normalizedUrl);

    const protocol = url.protocol.replace(":", "");
    const hostname = url.hostname;
    const port = url.port || "";

    if (!["http", "https"].includes(protocol)) {
      throw new Error(`Invalid protocol '${protocol}'`);
    }

    if (port && (port.length > 5 || isNaN(Number(port)))) {
      throw new Error(`Invalid port '${port}'`);
    }

    return {
      protocol,
      hostname,
      port,
      prefix: "/**",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `[parseServerUrl] Failed to parse "${serverBaseUrl}": ${message}`,
    );
    throw new Error(`Invalid URL provided: ${serverBaseUrl}`);
  }
};

export const buildRemotePatterns = (urls: string[]): RemotePattern[] => {
  return urls.map((url) => {
    const { protocol, hostname, port, prefix } = parseServerUrl(url);

    return {
      protocol,
      hostname,
      port: port || undefined,
      pathname: prefix || "/**",
    } as RemotePattern;
  });
};

/**
 * Sanitizes the given text string by removing any malicious code
 * and replacing it with a harmless string.
 * @param {string} text - The text to sanitize.
 * @returns {string} The sanitized string.
 */
export const sanitizeText = (text: string | undefined | null) => {
  if (text && typeof text === "string" && DOMPurify.sanitize !== undefined) {
    return DOMPurify.sanitize(text);
  }
  return "";
};
export const textTrim = (str: string, n: number = 65) => {
  if (!str) return "";
  return str.length > n ? str.slice(0, n - 1) + "..." : str;
};

export const stringToJson = (str: string) => {
  try {
    // Split the concatenated JSON strings
    const splitJsonStrings = str.split(/(?=\{)/); // Splits at each `{`

    // Parse each part into a JSON object
    const parsedJsonObjects = splitJsonStrings.map((jsonStr) =>
      JSON.parse(jsonStr),
    );

    return parsedJsonObjects;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
};

export const capitalizeFirstLetter = (str: string | undefined | null) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeUnderscore = (str: string | undefined | null) => {
  if (!str) return "";
  return str.replace(/_/g, " ");
};

export const convertToTitleCase = (str: string | undefined | null) => {
  if (!str || typeof str !== "string") return str;
  if (!str.includes("_")) return capitalizeFirstLetter(str);
  return removeUnderscore(str);
};

/**
 * Get string from key like "hero-title" to "HeroTitle"
 * @param {string} str - The string to convert.
 * @returns {string} The converted string.
 */
export const convertToCamelCase = (
  str: string | undefined | null,
  separator: string = "",
) => {
  if (!str || typeof str !== "string") return str;
  return str
    .split("-")
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(separator);
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
/**
 * Returns the value of the given key in the given object, or the defaultText if not found.
 * If the key contains dots, it will be interpreted as a nested property.
 * @param {Object} object - The object to search the key in.
 * @param {string} key - The key to search for like "key1.key2.
 * @param {*} [defaultText] - The value to return if the key is not found.
 */
export const placeDynamicText = (
  object: any,
  key: string,
  defaultText: any = "",
) => {
  if (object && key) {
    let value = "";
    try {
      value = getNestedProperty(object, key);
    } catch (error) {
      console.error(`Error evaluating key '${key}':`, error);
      return defaultText;
    }

    if (value) {
      return value;
    }
  }

  return defaultText;
};
export const getNestedProperty = (obj: any, path: string): any => {
  if (typeof path !== "string" || !path.trim()) return undefined;

  const segments = path.replace(/\[(\w+)\]/g, ".$1").split(".");

  return segments.reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj);
};

export const replaceValueByKeyOnObject = (
  object: any,
  key: string,
  value: any,
) => {
  try {
    const parts = key.split(".");
    let current = object;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  } catch (error) {
    console.error(`Error evaluating key '${key}':`, error);
  }
};

export const secondToTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const frontendValidation = (form: any) => {
  if (typeof form !== "object" || form === null) {
    return { isValid: false, errors: { form: "Invalid form data" } };
  }

  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [key, value] of Object.entries(form)) {
    if (value === null || value === undefined) {
      errors[key] = `${convertToCamelCase(key, " ")} field is required`;
      isValid = false;
      continue;
    }

    if (key === "fields" && typeof value === "object") {
      for (const [fieldKey, fieldValue] of Object.entries(value)) {
        if (
          fieldValue === null ||
          fieldValue === undefined ||
          fieldValue === ""
        ) {
          errors[`fields.${fieldKey}`] =
            `${convertToCamelCase(fieldKey, " ")} field is required`;
          isValid = false;
        }
      }
    } else if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean" &&
      typeof value !== "object"
    ) {
      errors[key] = `${convertToCamelCase(key, " ")} field is invalid`;
      isValid = false;
    }
  }

  return { isValid, errors };
};

export const getPageUrl = (menu: MenuItem) => {
  if (menu?.url) {
    return menu.url;
  }

  if (menu?.page?.slug) {
    return `/${menu.page.slug}`;
  }

  return "#";
};

export const isImage = (url: string): boolean => {
  const cleaned = url.split("?")[0];
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(cleaned);
};
