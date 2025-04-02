import React, { useState, useEffect } from "react";
import "./categorie.css";
import "boxicons/css/boxicons.min.css";
import SideBar from "../../SideBar/SideBar";
import Header from "../../Header/header";
import { useNavigate } from "react-router-dom";
import { get, getImg } from "../../../api/api.service";
import Cookies from "js-cookie";
function Categorie() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const handleCategories = async () => {
    const response = await get("/categories", Cookies.get("jwt"));
    const categoriesWithImages = await Promise.all(
      response.map(async (category) => {
        const img = await getImg(
          `/categories/categoryImage/${category.categoryImg}`
        );
        return { ...category, image: img };
      })
    );
    setCategories(categoriesWithImages);
  };

  useEffect(() => {
    handleCategories();
  }, []);

  const handleClickAnnuler = () => {
    navigate(-1);
  };

  const handleClickCategorie = (id) => {
    navigate(`/composants/${id}`);
  };

  return (
    <div className="table__page__container">
      <div className='sidebar__container'>
        <SideBar />
      </div>
      <div className="table__page__content__container">
        <div>
          <Header />
        </div>
        <div className="categories__container">
          <div className="header">Nouveau Demande</div>
          {categories.map((category) => (
            <div
              className="cardCategorie"
              key={category.id}
              onClick={() => handleClickCategorie(category.id)}
            >
              <div className="cardCategorieimg">
                <img src={category.image} />
              </div>
              <div className="cardCategorietextContent">
                <p className="cardCategorieh1">{category.name}</p>
              </div>
            </div>
          ))}
          <button className="annulerBtn" onClick={handleClickAnnuler} type='button'>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
export default Categorie;
