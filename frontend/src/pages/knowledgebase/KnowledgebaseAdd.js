import { React, useState } from "react";
import "boxicons/css/boxicons.min.css";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import { useNavigate } from "react-router-dom";
import { postData } from "../../api/api.service";
import Cookies from "js-cookie";

function KnowledgeBaseAdd() {
  const [currentErrorMessage, setCurrentErrorMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "article",
    title: "",
    lien: "",
    categorie: "Installation",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClickAjouter = async (e) => {
    e.preventDefault();
    const userRole = Cookies.get("userRole");
    const userId = Cookies.get("userId");
    formData.createrId = Number(userId);

    const endpoint =
      userRole === "planificateur"
        ? "/knowledgebase/create"
        : "/knowledgebase/createByTechnicien";
    console.log("formData :", formData);
    try {
      // Make the API request
      await postData(endpoint, formData, Cookies.get("jwt"));
      // Navigate based on user role
      const navigateTo =
        userRole === "planificateur" ? "/valide" : "/submission";
      navigate(navigateTo);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setCurrentErrorMessage(Object.values(error.response.data.errors)[0]);
      } else {
        navigate("/nonvalide");
      }
    }
  };

  const handleClickAnnuler = () => {
    navigate("/basedeconnaissance");
  };

  return (
    <div className="table__page__container">
      <div className="sidebar__container">
        <SideBar />
      </div>
      <div className="table__page__content__container">
        <div>
          <Header />
        </div>
        <div className="ticketForm__content">
          <header>Nouveau Article/Tuto</header>
          <form className="form__knowledgeAdd">
            <div>
              <div className="form first">
                <div className="details personal">
                  <span className="title">Details</span>
                  <div className="fields">
                    <div className="input-field">
                      <label>titre</label>
                      <input
                        type="text"
                        placeholder="titre"
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-field">
                      <label>lien</label>
                      <textarea
                        placeholder="lien"
                        required
                        name="lien"
                        value={formData.lien}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="input-field-Urgence">
                      <label>Type</label>
                      <select
                        required
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option
                          value="article"
                          selected={formData.type === "article"}
                        >
                          Article
                        </option>
                        <option
                          value="tuto"
                          selected={formData.type === "tuto"}
                        >
                          Tuto
                        </option>
                      </select>
                    </div>
                    <div className="input-field-Categorie">
                      <label>Categorie</label>
                      <select
                        required
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleChange}
                      >
                        <option selected value="Installation">
                          Installation
                        </option>
                        <option value="Dépannage">Dépannage</option>
                        <option value="Sécurité">Sécurité</option>
                        <option value="Fonctionnalité">Fonctionnalité</option>
                      </select>
                    </div>
                  </div>
                  <div className="knowledgeadd__buttons">
                    <button
                      className="nextBtn"
                      type="button"
                      onClick={handleClickAjouter}
                    >
                      <span className="btnText">Ajouter</span>
                      <i className="bx bx-send"></i>
                    </button>

                    <button className="annulerBtn">
                      <span className="btnText" onClick={handleClickAnnuler}>
                        annuler
                      </span>
                    </button>
                  </div>
                  {currentErrorMessage && (
                    <div className="error">
                      <div className="error__icon">
                        <svg
                          fill="none"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"
                            fill="#393a37"
                          ></path>
                        </svg>
                      </div>
                      <div className="error__title">
                        Erreur : {currentErrorMessage}
                      </div>
                      <div
                        className="error__close"
                        onClick={() => setCurrentErrorMessage("")}
                      >
                        <svg
                          height="20"
                          viewBox="0 0 20 20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"
                            fill="#393a37"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeBaseAdd;
