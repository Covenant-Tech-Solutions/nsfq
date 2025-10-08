import { TOKEN_NAME } from "@/configs";
import Cookies from "js-cookie";

export const getToken = () => {
  const token = Cookies.get(TOKEN_NAME);

  return token;
};
