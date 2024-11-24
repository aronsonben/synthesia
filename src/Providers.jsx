import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext.jsx";

const Providers = () => {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  );
};

export default Providers;