import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import Cookies from "js-cookie";
import { get, uploadProfileImg, postComponent } from "../../api/api.service";
import { Editor } from "@tinymce/tinymce-react";

function ComponentCreate() {
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentErrorMessage, setCurrentErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    componentImg: "",
    Categoryname: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formDataImg = new FormData();
    formDataImg.append("file", file);
    try {
      const imgName = await uploadProfileImg(
        "/components/uploadComponentImg",
        formDataImg,
        Cookies.get("jwt")
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        componentImg: imgName.filename,
      }));
    } catch (error) {
      console.error("Error uploading category image", error);
    }
  };

  const handleCategoryName = async () => {
    try {
      const categoryName = await get(
        `/categories/${id}/categoryName`,
        Cookies.get("jwt")
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        Categoryname: categoryName,
      }));
    } catch (error) {
      console.error("Error fetching category name", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    let content = "";
    if (editorRef.current) {
      content = editorRef.current.getContent();
    }
    const updatedFormData = { ...formData, description: content };
    try {
      await postComponent("/components", updatedFormData, Cookies.get("jwt"));
      navigate("/valide");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setCurrentErrorMessage(Object.values(error.response.data.errors)[0]);
      } else {
        navigate("/nonvalide");
      }
    }
  };

  const handleClickAnnuler = () => {
    navigate(-1);
  };

  useEffect(() => {
    handleCategoryName();
  }, []); // Empty dependency array to run only on mount

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
          <header>Créer Composant</header>
          <form onSubmit={handleCreate}>
            <div className="form first">
              <div className="fields">
                <div className="input-field">
                  <label>Nom</label>
                  <input
                    type="text"
                    placeholder="nom composant"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-field">
                  <label>Image</label>
                  <input type="file" onChange={handleImageUpload} />
                </div>
              </div>
              <div className="fields">
                <div className="input-field">
                  <label>Description</label>
                  <Editor
                    className="editor"
                    apiKey="fy8hyyo86tx3wnmsefakv4002yxtxhvvln3zoag7613n2hgb"
                    onInit={(_evt, editor) => (editorRef.current = editor)}
                    initialValue="<p>Ajouter les carcteristiques de composant ici.</p>"
                    init={{
                      width: 700,
                      height: 300,
                      menubar: true,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "wordcount",
                        "fontfamily",
                      ],
                      toolbar:
                        "undo redo | fontselect fontsizeselect | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      font_family_formats:
                        "Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; Times New Roman=times new roman,times,serif;",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="buttons">
              <button className="nextBtn" type="submit">
                <span className="btnText">Créer</span>
                <i className="bx bx-send"></i>
              </button>
              <button
                className="annulerBtn"
                type="button"
                onClick={handleClickAnnuler}
              >
                <span className="btnText">annuler</span>
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default ComponentCreate;
