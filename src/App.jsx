// App.js
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./Components/Register/RegisterPage";
import LoginPage from "./Components/Login/LoginPage";
import AdList from "./Components/AdList/AdList";
import FavoriteAdsList from "./Components/FavoriteAdsList/FavoriteAdsList";
import MyAds from "./Components/UserAds/UserAdsList";
import CreateAd from "./Components/AdAdd/CreateAdd";
import CreateCategory from "./Components/CategoryAdd/CreateCategory";
import BlockAdPage from "./Components/Admin/BlockAdPage";
import BlockUserPage from "./Components/Admin/BlockUserPage";
import Layout from "./Layouts/Layout";

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <Router>
      <Layout
        user={user}
        setUser={setUser}
        onCategorySelect={handleCategorySelect}
      >
        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/createAd" element={<CreateAd />} />
          <Route path="/createCategory" element={<CreateCategory />} />
          <Route
            path="/blockAdPage"
            element={<BlockAdPage selectedCategory={selectedCategory} />}
          />
          <Route path="/blockUserPage" element={<BlockUserPage />} />
          <Route
            path="/favoriteAds"
            element={<FavoriteAdsList selectedCategory={selectedCategory} />}
          />
          <Route
            path="/myAds"
            element={<MyAds selectedCategory={selectedCategory} />}
          />
          <Route
            path="*"
            element={<AdList selectedCategory={selectedCategory} />}
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
