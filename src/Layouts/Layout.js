// Layout.js
import React from "react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";

const Layout = ({ user, setUser, onCategorySelect, children }) => {
  return (
    <>
      <Header
        user={user}
        setUser={setUser}
        onCategorySelect={onCategorySelect}
      />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
