import { useCookies } from "react-cookie";

export function useCookieManagement() {
  const [cookies, setCookie, removeCookie] = useCookies(["room", "accountName", "password", "displayName"]);

  // Function to update cookies
  const updateCookie = (name, value, options = { path: "/", sameSite: "Strict" }) => {
    setCookie(name, value, options);
  };

  // Function to get a cookie value
  const getCookie = (name) => cookies[name];

  // Optionally, a function to remove a cookie
  const deleteCookie = (name) => {
    removeCookie(name, { path: "/" });
  };

  return {
    updateCookie,
    getCookie,
    deleteCookie,
  };
}
