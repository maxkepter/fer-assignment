import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
export const StudentLayout = () => {
  const location = useLocation();

  const navItem = [
    { name: "Home", link: "/" },
    { name: "Test", link: "/exam" },
    { name: "Result", link: "/" },
    { name: "Profile", link: "/" },
  ];
  function getCurrentIndex() {
    const path = location.pathname;
    const index = navItem.findIndex((item) => item.link === path);
    return index !== -1 ? index : 0;
  }

  return (
    <div>
      <Header {...{ index: getCurrentIndex(), navItem: navItem }} />
      <div className="container py-4">
        <Outlet key={location.path} />
      </div>
      <Footer />
    </div>
  );
};
