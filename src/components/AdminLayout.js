import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const navItem = [
    { name: "Home", link: "/admin" },
    { name: "Manage Exams", link: "/admin/exam" },
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
        <Outlet key={location.pathname} />
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
