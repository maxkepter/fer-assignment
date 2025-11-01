import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
export const StudentLayout = () => {
  const location = useLocation();

  const navItem = [
    { name: "Home", link: "/" },
    { name: "Test", link: "/exam" },
    { name: "Result", link: "/history" },
  ];
  function getCurrentIndex() {
    const path = location.pathname;
    const matchedItem = navItem
      .filter((item) => path.startsWith(item.link))
      .sort((a, b) => b.link.length - a.link.length)[0];

    return matchedItem ? navItem.indexOf(matchedItem) : 0;
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
