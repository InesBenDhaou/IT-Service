import { React, useState, useEffect, useRef } from "react";
import "../../css/form.css";
import "boxicons/css/boxicons.min.css";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import { useNavigate } from "react-router-dom";
import {
  get,
  getConnectedUser,
  getUserEmail,
  postFormData,
} from "../../api/api.service";
import Cookies from "js-cookie";
import Select from "react-select";

const customStyles = {
  menu: (provided) => ({
    ...provided,
    maxHeight: 400, // Set the maximum height for the dropdown menu
    overflowY: "auto", // Enable vertical scrolling
    zIndex: 9999, // Ensure the dropdown menu appears above other elements
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure the portal has a high z-index
};

function TicketCreate() {
  const navigate = useNavigate();
  const [currentErrorMessage, setCurrentErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPlanificateur, setIsPlanificateur] = useState(false);
  const [isEmploye, setIsEmploye] = useState(false);
  const [isTechnicien, setIsTechnicien] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    Urgence: "faible",
    Status: "en attente",
    localisation: "",
    BenificierTicket: "",
    emailBenificierTicket: "",
    technicienAssocie: "",
    emailTechnicienAssocie: "",
  });

  const [userName, setUsername] = useState("");
  const [userLastName, setUserlastname] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [technicianemail, setTechnicienEmail] = useState("");
  const [employeemail, setEmployeEmail] = useState("");
  const [techniciens, setTechniciens] = useState([]);
  const [localisations, setLocalisations] = useState([]);
  const [contactManager, setContactManager] = useState("");
  const optionsTechniciens = techniciens.map((technicien) => ({
    value: technicien.id,
    label: `${technicien.userLastName} ${technicien.userName}`,
  }));

  const [employes, setEmployes] = useState([]);

  const optionsEmployes = employes.map((employes) => ({
    value: employes.id,
    label: `${employes.userLastName} ${employes.userName}`,
  }));

  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [selectedTechnicien, setSelectedTechnicien] = useState(null);
  const [selectedLocalisation, setSelectedLocalisation] = useState("");

  const handleSelectTechnicienChange = (option) => {
    setSelectedTechnicien(option);
    if (option) {
      handleTechnicienEmail(option.value);
    }
  };

  const handleSelectEmployeChange = (option) => {
    setSelectedEmploye(option);
    if (option) {
      handleEmployeEmail(option.value);
      handleEmployeLocalisation(option.value);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const [selectedFileToRemove, setSelectedFileToRemove] = useState(null);
  const fileOptions = selectedFiles.map((file) => ({
    value: file.name,
    label: file.name,
  }));
  const defaultFile = fileOptions.length > 0 ? fileOptions[0] : null;

  const fileInputRef = useRef(null);

  const handleRemoveFile = () => {
    const fileNameToRemove =
      selectedFileToRemove ||
      (fileOptions.length > 0 ? fileOptions[0].label : null);
    if (fileNameToRemove) {
      setSelectedFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== fileNameToRemove)
      );
      setSelectedFileToRemove(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  };

  const handleTechniciens = async () => {
    try {
      const allTechniciens = await get("/user/techniciens", Cookies.get("jwt"));
      setTechniciens(allTechniciens);
    } catch (error) {
      console.error("Error getting Techniciens", error);
    }
  };

  const handleEmployes = async () => {
    try {
      const allEmployes = await get("/user", Cookies.get("jwt"));
      setEmployes(allEmployes);
    } catch (error) {
      console.error("Error getting Employes", error);
    }
  };

  const handleEmployeEmail = async (employeId) => {
    try {
      const email = await getUserEmail(
        `/user/email/${employeId}`,
        Cookies.get("jwt")
      );
      setEmployeEmail(email);
      const manageremail = await getUserEmail(
        `/user/manageremail/${employeId}`,
        Cookies.get("jwt")
      );
      setContactManager(manageremail);
    } catch (error) {
      console.error("Error getting Techniciens", error);
    }
  };

  const handleEmployeLocalisation = async (employeId) => {
    try {
      const localisation = await get(
        `/user/${employeId}/localisation`,
        Cookies.get("jwt")
      );
      const loc = optionsLocalisations.find(
        (option) => option.label === localisation.localisation
      );
      setSelectedLocalisation(loc);
    } catch (error) {
      console.error("Error getting Techniciens", error);
    }
  };

  const handleTechnicienEmail = async (employeId) => {
    try {
      const email = await getUserEmail(
        `/user/email/${employeId}`,
        Cookies.get("jwt")
      );
      setTechnicienEmail(email);
    } catch (error) {
      console.error("Error getting Techniciens", error);
    }
  };

  const handleLocalisations = async () => {
    const allLocalisations = await get("/localisations", Cookies.get("jwt"));
    setLocalisations(allLocalisations);
  };

  const optionsLocalisations = localisations.map((Localisation) => ({
    value: Localisation.id,
    label: `${Localisation.placeName}`,
  }));

  const handleSelectLocalisationChange = (option) => {
    setSelectedLocalisation(option);
  };

  const handleUserinfo = async () => {
    try {
      const userinfo = await getConnectedUser(
        "/auth/userConnected",
        Cookies.get("jwt")
      );
      const userDetails = await get(
        `/user/${userinfo.id}/detailsUser`,
        Cookies.get("jwt")
      );
      setUsername(userDetails.userName);
      setUserlastname(userDetails.userLastName);
      setUserEmail(userDetails.email);
      setContactManager(userDetails.contactManager);
      const loc = optionsLocalisations.find(
        (option) => option.label === userDetails.localisation
      );
      setSelectedLocalisation(loc);
    } catch (error) {
      console.error("Error getting user information", error);
    }
  };

  const handleClickAnnuler = () => {
    navigate(-1);
  };

  const handleCreationTicket = async (e) => {
    e.preventDefault();
    const newformData = new FormData();
    newformData.append("titre", formData.titre);
    newformData.append("description", formData.description);
    newformData.append("urgence", formData.Urgence);
    newformData.append("status", formData.Status);
    newformData.append("localisation", selectedLocalisation.label);
    newformData.append("contactManager", contactManager);
    Array.from(files).forEach((file) => {
      newformData.append("files", file);
    });

    if (isPlanificateur) {
      newformData.append(
        "technicienAssocie",
        selectedTechnicien ? selectedTechnicien.label : ""
      );
      newformData.append("emailTechnicienAssocie", technicianemail);
      newformData.append(
        "BenificierTicket",
        selectedEmploye ? selectedEmploye.label : ""
      );
      newformData.append("emailBenificierTicket", employeemail);
    }
    try {
      const url = isPlanificateur
        ? "/ticket/createTicketByPlanificateur"
        : "/ticket/createTicket";
      await postFormData(url, newformData, Cookies.get("jwt"));
      navigate("/valide");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setCurrentErrorMessage(Object.values(error.response.data.errors)[0]);
      } else {
        navigate("/nonvalide");
      }
    }
  };

  useEffect(() => {
    const userRole = Cookies.get("userRole");
    if (userRole === "admin") {
      setIsAdmin(true);
    }
    if (userRole === "employe") {
      setIsEmploye(true);
    }
    if (userRole === "planificateur") {
      setIsPlanificateur(true);
      handleEmployes();
      handleTechniciens();
    }
    if (userRole === "technicien") {
      setIsTechnicien(true);
    }
    handleLocalisations();
  }, []);

  useEffect(() => {
    if ((isAdmin || isEmploye || isTechnicien) && localisations.length > 0) {
      handleUserinfo();
    }
  }, [localisations]);

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
          <header>Nouveau ticket</header>
          <form>
            <div className="form first">
              <div className="details personal">
                <span className="title">Ticket Details</span>
                <div className="fields">
                  <div className="input-field">
                    <label>titre</label>
                    <input
                      type="text"
                      placeholder="ticket title"
                      required
                      name="titre"
                      value={formData.titre}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-field">
                    <label>description</label>
                    <textarea
                      placeholder="ticket description"
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="input-field-select">
                    <label>Localisation</label>
                    <Select
                      value={selectedLocalisation}
                      onChange={handleSelectLocalisationChange}
                      options={optionsLocalisations}
                      placeholder="Select a Location"
                      isClearable
                      isDisabled={!isPlanificateur}
                    />
                  </div>
                  <div className="input-field-Urgence">
                    <label>Urgence</label>
                    <select
                      required
                      name="Urgence"
                      value={formData.Urgence}
                      onChange={handleChange}
                    >
                      <option selected value="faible">
                        faible
                      </option>
                      <option value="moyen">moyen</option>
                      <option value="elevé">elevé</option>
                      <option value="critique">critique</option>
                    </select>
                  </div>

                  <div className="input-file-field">
                    <label>Piéces Jointes</label>
                    <input
                      type="file"
                      placeholder="ticket document"
                      name="files"
                      multiple
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="input-field-piécejoint-edit">
                      <label>Pièce jointe Ajoutés</label>
                      <div className="file-select_option">
                        <Select
                          value={
                            fileOptions.find(
                              (option) => option.value === selectedFileToRemove
                            ) || defaultFile
                          }
                          options={fileOptions}
                          onChange={(option) =>
                            setSelectedFileToRemove(option?.value)
                          }
                          placeholder="Select a file to remove"
                          isClearable
                        />
                        <i
                          className="bx bxs-folder-minus manage__icon"
                          onClick={handleRemoveFile}
                          disabled={!selectedFileToRemove}
                        ></i>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="details ID">
                <span className="title">Benificier Details</span>
                <div className="fields">
                  {isPlanificateur ? (
                    <div className="input-field-select">
                      <label>Benificier</label>
                      <Select
                        value={selectedEmploye}
                        onChange={handleSelectEmployeChange}
                        options={optionsEmployes}
                        placeholder="Select an Employe"
                        disabled={!isPlanificateur}
                        isClearable
                        styles={customStyles}
                        menuPortalTarget={document.body}
                      />
                    </div>
                  ) : (
                    <div className="input-field">
                      <label>benificier</label>
                      <input
                        type="text"
                        placeholder="nom et prenom"
                        required
                        name="BenificierTicket"
                        value={userName + " " + userLastName}
                        onChange={handleChange}
                        disabled={!isPlanificateur}
                      />
                    </div>
                  )}
                  <div className="input-field">
                    <label>contact</label>
                    <input
                      type="text"
                      placeholder="mail"
                      required
                      name="emailBenificierTicket"
                      value={isPlanificateur ? employeemail : useremail}
                      onChange={handleChange}
                      disabled={!isPlanificateur}
                    />
                  </div>
                  <div className="input-field">
                    <label>Manager Contact</label>
                    <input
                      type="text"
                      placeholder="maanger mail"
                      name="emailTechnicienAssocie"
                      disabled={!isPlanificateur}
                      value={contactManager}
                    />
                  </div>
                </div>

                {isPlanificateur && (
                  <div className="details ID">
                    <span className="title">Technicien Details</span>
                    <div className="fields">
                      <div className="input-field-select">
                        <label>Technicien</label>
                        <Select
                          value={selectedTechnicien}
                          onChange={handleSelectTechnicienChange}
                          options={optionsTechniciens}
                          placeholder="Select a technician"
                          disabled={!isPlanificateur}
                          isClearable
                          styles={customStyles}
                          menuPortalTarget={document.body}
                        />
                      </div>
                      <div className="input-field">
                        <label>contact</label>
                        <input
                          type="text"
                          placeholder="mail"
                          required
                          name="emailTechnicienAssocie"
                          value={technicianemail}
                          onChange={handleChange}
                          disabled={!isPlanificateur}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="buttons">
                  <button
                    className="nextBtn"
                    type="button"
                    onClick={handleCreationTicket}
                  >
                    <span className="btnText">Ouvrir Un ticket</span>
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TicketCreate;
