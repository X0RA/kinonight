import { useNavigate } from "react-router-dom";

export const logOut = () => {
  const Navigate = useNavigate();
  document.cookie = "room=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  Navigate("/");
};
