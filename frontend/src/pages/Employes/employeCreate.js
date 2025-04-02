import { React, useState, useEffect } from "react";
import "../../css/form.css";
import "boxicons/css/boxicons.min.css";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import { get, postData, getEmailsByDepart } from "../../api/api.service";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function EmployeCreate() {
  const navigate = useNavigate();
  const [currentErrorMessage, setCurrentErrorMessage] = useState("");
  const [localisations, setLocalisations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [postes, setPostes] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPoste, setSelectedPoste] = useState("");
  const [selectedLocalisation, setSelectedLocalisation] = useState("");
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    userLastName: "",
    department: "",
    password: "",
    role: "admin",
    numTel: "",
    email: "",
    localisation: "",
    poste: "",
    contactManager: "",
  });

  const handleClickAnnuler = () => {
    navigate(-1);
  };
  const handleLocalisations = async () => {
    const allLocalisations = await get("/localisations", Cookies.get("jwt"));
    setLocalisations(allLocalisations);
  };

  const optionsLocalisations = localisations.map((Localisation) => ({
    value: Localisation.id,
    label: `${Localisation.placeName}`,
  }));

  const handleDepartments = async () => {
    const allDepartments = await get("/departments", Cookies.get("jwt"));
    setDepartments(allDepartments);
  };

  const optionsDepartments = departments.map((department) => ({
    value: department.id,
    label: `${department.nom}`,
  }));

  const handlePostes = async () => {
    const allPostes = await get("/postes", Cookies.get("jwt"));
    setPostes(allPostes);
  };

  const optionsPostes = postes.map((poste) => ({
    value: poste.id,
    label: `${poste.nom}`,
  }));

  const handleDepartmentPostes = async (departmentId) => {
    try {
      const allPostes = await get(
        `/departments/${departmentId}/postes`,
        Cookies.get("jwt")
      );
      setPostes(allPostes);
    } catch (error) {
      console.error("Error getting Employe mail", error);
    }
  };

  const handleContactManager = async (option) => {
    const department = option;
    const allManagers = await getEmailsByDepart(
      "/user/emailsByDepartment",
      department,
      Cookies.get("jwt")
    );
    setManagers(allManagers);
  };

  const optionsContactManager = managers.map((manager) => ({
    value: manager.id,
    label: `${manager.email}`,
  }));

  const handleSelectLocalisationChange = (option) => {
    setSelectedLocalisation(option);
  };

  const handleSelectedDepartmentChange = (option) => {
    setSelectedDepartment(option);
    if (option) {
      handleDepartmentPostes(option.value);
      handleContactManager(option.label);
    }
  };

  const handleSelectPosteChange = (option) => {
    setSelectedPoste(option);
  };

  const handleSelectManagerChange = (option) => {
    setSelectedManager(option);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formDataToSend = {
      userName: formData.userName,
      userLastName: formData.userLastName,
      department: selectedDepartment.label,
      password: formData.password,
      role: formData.role,
      numTel: formData.numTel,
      email: formData.email,
      localisation: selectedLocalisation.label,
      poste: selectedPoste.label,
      contactManager: selectedManager ? selectedManager.label : "",
    };
    try {
      await postData("/user", formDataToSend, Cookies.get("jwt"));
      navigate("/valide");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setCurrentErrorMessage("A user with this email already exists.");
      } else if (error.response && error.response.data.errors) {
        setCurrentErrorMessage(Object.values(error.response.data.errors)[0]);
      } else {
        navigate("/nonvalide");
      }
    }
  };

  useEffect(() => {
    handleLocalisations();
    handleDepartments();
    handlePostes();
  }, []);

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
          <header>Employe</header>
          <form>
            <div className="form first">
              <div className="details personal">
                <span className="title">Employe Details</span>
                <div className="fields">
                  <div className="input-field">
                    <label>Prénom</label>
                    <input
                      type="text"
                      placeholder="Prénom"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-field">
                    <label>Nom</label>
                    <input
                      type="text"
                      placeholder="Nom"
                      name="userLastName"
                      value={formData.userLastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-field-select">
                    <label>Depatement</label>
                    <Select
                      value={selectedDepartment}
                      onChange={handleSelectedDepartmentChange}
                      options={optionsDepartments}
                      placeholder="Select a department"
                      isClearable
                    />
                  </div>
                  <div className="input-field-select">
                    <label>Poste</label>
                    <Select
                      value={selectedPoste}
                      onChange={handleSelectPosteChange}
                      options={optionsPostes}
                      placeholder="Select a poste"
                      isClearable
                    />
                  </div>
                  <div className="input-field-select">
                    <label>Localisation</label>
                    <Select
                      value={selectedLocalisation}
                      onChange={handleSelectLocalisationChange}
                      options={optionsLocalisations}
                      placeholder="Select a Location"
                      isClearable
                    />
                  </div>
                </div>
              </div>
              <div className="details ID">
                <span className="title">Contact Details</span>
                <div className="fields">
                  <div className="input-field">
                    <label>Email</label>
                    <input
                      type="text"
                      placeholder="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-field">
                    <label>NumTel</label>
                    <input
                      type="text"
                      placeholder="num telephone"
                      name="numTel"
                      value={formData.numTel}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-field-select">
                    <label>Contact Manage</label>
                    <Select
                      value={selectedManager}
                      onChange={handleSelectManagerChange}
                      options={optionsContactManager}
                      placeholder="Select a Manager"
                      isClearable
                    />
                  </div>
                </div>
              </div>
              <div className="details ID">
                <span className="title">Accés Details</span>
                <div className="fields">
                  <div className="input-field">
                    <label>Mot de passe</label>
                    <input
                      type="password"
                      placeholder="Mot de passe"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-field-Urgence">
                    <label>Rôle</label>
                    <select
                      required
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="admin">admin</option>
                      <option value="employe">employe</option>
                      <option value="technicien">technicien</option>
                      <option value="planificateur">planificateur</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="buttons">
                <button
                  className="nextBtn"
                  onClick={handleCreate}
                  type="button"
                >
                  <span className="btnText">Créer</span>
                  <i className="bx bx-send"></i>
                </button>
                <button
                  className="annulerBtn"
                  onClick={handleClickAnnuler}
                  type="button"
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default EmployeCreate;
