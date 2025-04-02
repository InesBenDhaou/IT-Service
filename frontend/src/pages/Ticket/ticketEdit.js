import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Select from "react-select";
import "boxicons/css/boxicons.min.css";
import "../../css/form.css";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import {
  getOne,
  updateFormData,
  get,
  getUserEmail,
  getOriginalNames,
  getConnectedUser,
} from "../../api/api.service";

const customStyles = {
  menu: (provided) => ({
    ...provided,
    maxHeight: 400, // Set the maximum height for the dropdown menu
    overflowY: "auto", // Enable vertical scrolling
    zIndex: 9999, // Ensure the dropdown menu appears above other elements
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure the portal has a high z-index
};

function TicketEdit() {
  const navigate = useNavigate();
  const { id ,benificierTicket} = useParams();
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState("");
  const [files, setFiles] = useState([]);
  const [newfilesuploaded, setNewfilesuploaded] = useState([]);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    urgence: "",
    status: "",
    BenificierTicket: "",
    emailBenificierTicket: "",
    technicienAssocie: "",
    emailTechnicienAssocie: "",
    localisation: "",
    feedBack: "",
    cmtTech: "",
    piecesJointes: [],
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [technicianemail, setTechnicienEmail] = useState("");
  const [isPlanificateur, setIsPlanificateur] = useState(false);
  const [isTechnicien, setIsTechnicien] = useState(false);
  const [isEmploye, setIsEmploye] = useState(false);
  const [techniciens, setTechniciens] = useState([]);
  const [selectedTechnicien, setSelectedTechnicien] = useState("");
  const [technicienInfo, setTechnicienInfo] = useState("");
  const handleTechniciens = async () => {
    try {
      const allTechniciens = await get("/user/techniciens", Cookies.get("jwt"));
      setTechniciens(allTechniciens);
    } catch (error) {
      console.error("Error getting Techniciens", error);
    }
  };
  const optionsTechniciens = techniciens.map((technicien) => ({
    value: technicien.id,
    label: `${technicien.userLastName} ${technicien.userName}`,
  }));

  // getting the Technicien email auto
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

  //dealing with the technicien change
  const handleSelectTechnicienChange = (selectedOption) => {
    setSelectedTechnicien(selectedOption);
    if (selectedOption) {
      handleTechnicienEmail(selectedOption.value); // Passer directement la valeur de l'employé sélectionné
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      technicienAssocie: selectedOption,
    }));
  };
  const handleTicketEdit = async (isPlanificateur) => {
    try {
      const ticketToEdit = await getOne(
        `/ticket/ticketById/${id}`,
        Cookies.get("jwt")
      );
      setTechnicienInfo(ticketToEdit.technicienAssocie);
      setTechnicienEmail(ticketToEdit.emailTechnicienAssocie);
      let technicien = null;
      if (ticketToEdit.technicienAssocie) {
        technicien = optionsTechniciens.find(
          (option) => option.label === ticketToEdit.technicienAssocie
        );
        setSelectedTechnicien(technicien);
      }
      const commonFormData = {
        titre: ticketToEdit.titre,
        description: ticketToEdit.description,
        urgence: ticketToEdit.urgence,
        status: ticketToEdit.status,
        BenificierTicket: ticketToEdit.BenificierTicket,
        emailBenificierTicket: ticketToEdit.emailBenificierTicket,
        localisation: ticketToEdit.localisation,
        feedBack: ticketToEdit.feedBack,
        cmtTech: ticketToEdit.cmtTech,
        piecesJointes: ticketToEdit.piecesJointes,
      };
      if (ticketToEdit.piecesJointes && ticketToEdit.piecesJointes.length > 0) {
        const originalNames = await getOriginalNames(
          ticketToEdit.piecesJointes,
          Cookies.get("jwt")
        );
        setFiles(Object.values(originalNames));
      }
      if (isPlanificateur) {
        setFormData({
          ...commonFormData,
          technicienAssocie: technicien ? technicien.label : "",
          emailTechnicienAssocie: technicien
            ? ticketToEdit.emailTechnicienAssocie
            : "",
        });
      } else {
        setFormData({
          ...commonFormData,
          technicienAssocie: ticketToEdit.technicienAssocie,
          emailTechnicienAssocie: ticketToEdit.emailTechnicienAssocie,
        });
      }
    } catch (error) {
      console.error("Error getting ticket details", error);
    }
  };

  const handleInputFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles((prevState) => [...prevState, file.name]);
      const newFiles = Array.from(event.target.files);
      setNewfilesuploaded((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemove = () => {
    if (selectedPiece) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        piecesJointes: prevFormData.piecesJointes.filter(
          (_, index) => index !== selectedPieceIndex
        ),
      }));
      setFiles((prevState) => {
        const updatedFilesNames = prevState.filter(
          (piece) => piece !== selectedPiece
        );
        if (updatedFilesNames.length === 0) {
          setSelectedPiece(null);
        }
        return updatedFilesNames;
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newformData = new FormData();
    newformData.append("titre", formData.titre);
    newformData.append("description", formData.description);
    newformData.append("urgence", formData.urgence);
    newformData.append("status", formData.status);
    newformData.append("localisation", formData.localisation);
    newformData.append("BenificierTicket", formData.BenificierTicket);
    newformData.append("emailBenificierTicket", formData.emailBenificierTicket);
    newformData.append("feedBack", formData.feedBack);
    newformData.append("cmtTech", formData.cmtTech);
    formData.piecesJointes.forEach((item) => {
      newformData.append("piecesJointes[]", item); // Use "piecesJointes[]" as the key
    });
    Array.from(newfilesuploaded).forEach((file) => {
      newformData.append("files", file);
    });

    if (isPlanificateur) {
      newformData.append("technicienAssocie", selectedTechnicien.label);
      newformData.append("emailTechnicienAssocie", technicianemail);
    }
    try {
      await updateFormData(
        `/ticket/updateTicket/${id}`,
        newformData,
        Cookies.get("jwt")
      );
      navigate("/valide");
    } catch (error) {
      console.error("Error updating ticket:", error);
      navigate("/nonvalide");
    }
  };

  const handleClickAnnuler = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRole = Cookies.get("userRole");
        const userinfo = await getConnectedUser("/auth/userConnected", Cookies.get("jwt"));
        if (userRole === "admin" || userRole === "employe") {
          setIsEmploye(true);
          handleTicketEdit(false);
        } else if (userRole === "technicien" && benificierTicket === userinfo.email) {
          setIsEmploye(true);
          handleTicketEdit(false);
        } else if (userRole === "technicien" && benificierTicket !== userinfo.email) {
          setIsTechnicien(true);
          handleTicketEdit(false);
        } else if (userRole === "planificateur") {
          setIsPlanificateur(true);
          handleTechniciens();
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchData();
  }, []);
  

  useEffect(() => {
    if ((isPlanificateur || isTechnicien) && techniciens.length > 0) {
      handleTicketEdit(true);
    }
  }, [isPlanificateur, techniciens]);

  useEffect(() => {
    if (files.length > 0) {
      setSelectedPiece(files[0]);
      setSelectedPieceIndex(0);
    }
  }, [files]);
  return (
    <div className="table__page__container">
      <div className='sidebar__container'>
        <SideBar />
      </div>
      <div className="table__page__content__container">
        <div>
          <Header />
        </div>
        <div className="ticketForm__content">
          <header>Editer ticket</header>
          <form>
            <div className="form first">
              <div className="details personal">
                <span className="title">Ticket Details</span>
                <div className="fields">
                  <div className="input-field">
                    <label>titre</label>
                    <textarea
                      value={formData.titre}
                      onChange={handleInputChange}
                      name="titre"
                    />
                  </div>
                  <div className="input-field-description">
                    <label>description</label>
                    <textarea
                      value={formData.description}
                      onChange={handleInputChange}
                      name="description"
                    ></textarea>
                  </div>
                  <div className="input-field-Urgence">
                    <label>Urgence</label>
                    <select
                      required
                      onChange={handleInputChange}
                      name="urgence"
                      value={formData.urgence}
                    >
                      <option
                        value="faible"
                        selected={formData.urgence === "faible"}
                      >
                        faible
                      </option>
                      <option
                        value="moyen"
                        selected={formData.urgence === "moyen"}
                      >
                        moyen
                      </option>
                      <option
                        value="elevé"
                        selected={formData.urgence === "eleve"}
                      >
                        elevé
                      </option>
                      <option
                        value="critique"
                        selected={formData.urgence === "critique"}
                      >
                        critique
                      </option>
                    </select>
                  </div>
                  <div className="input-field-localisation">
                    <label>Localisation</label>
                    <input
                      type="text"
                      name="localisation"
                      value={formData.localisation}
                      disabled
                    />
                  </div>
                 
                      <div className="input-field-piécejoint-edit">
                        <label>Pièce jointe</label>
                        <div className="file-select-option">
                          <select
                            value={selectedPiece}
                            onChange={(e) => {
                              setSelectedPieceIndex(e.target.selectedIndex);
                              setSelectedPiece(e.target.value);
                            }}
                          >
                            {files.map((fileName, index) => (
                              <option key={index} value={fileName}>
                                {fileName}
                              </option>
                            ))}
                          </select>
                          <i
                            className="bx bxs-folder-minus manage__icon"
                            onClick={handleRemove}
                            disabled={!selectedPiece}
                          ></i>
                          <i
                            className="bx bxs-folder-plus manage__icon"
                            onClick={() =>
                              document.getElementById("file-upload").click()
                            }
                            disabled={!selectedPiece}
                          ></i>
                          <input
                            id="file-upload"
                            type="file"
                            style={{ display: "none" }}
                            name="file"
                            onChange={handleInputFile}
                          />
                        </div>
                      </div>
                    
                </div>
                {!isEmploye && (
                  <div className="input-field-Urgence">
                    <label>Status</label>
                    <div className="wrapper">
                      <div className="option-status">
                        <input
                          className="input"
                          type="radio"
                          name="status"
                          value="en attente"
                          checked={formData.status === "en attente"}
                          onChange={handleInputChange}
                          disabled={isEmploye}
                        />
                        <div className="btn-status">
                          <span className="span">En Attente</span>
                        </div>
                      </div>
                      <div className="option-status">
                        <input
                          className="input"
                          type="radio"
                          name="status"
                          value="en cours"
                          checked={formData.status === "en cours"}
                          onChange={handleInputChange}
                          disabled={isEmploye}
                        />
                        <div className="btn-status">
                          <span className="span">En Cours</span>
                        </div>
                      </div>
                      <div className="option-status">
                        <input
                          className="input"
                          type="radio"
                          name="status"
                          value="résolu"
                          checked={formData.status === "résolu"}
                          onChange={handleInputChange}
                          disabled={isEmploye}
                        />
                        <div className="btn-status">
                          <span className="span">Résolu</span>
                        </div>
                      </div>
                      <div className="option-status">
                        <input
                          className="input"
                          type="radio"
                          name="status"
                          value="clôturé"
                          checked={formData.status === "clôturé"}
                          onChange={handleInputChange}
                          disabled={isEmploye}
                        />
                        <div className="btn-status">
                          <span className="span">Clôturé</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {isEmploye && (
                <div className="details ID">
                  <span className="title">Benificier Details</span>
                  <div className="fields">
                    <div className="input-field">
                      <label>Laisser Feed back</label>
                      <textarea
                        type="text"
                        placeholder="feedback benificier"
                        name="feedBack"
                        value={formData.feedBack}
                        disabled={!isEmploye}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}
              {!isEmploye && (
                <div className="details ID">
                  <span className="title">Technicien Details</span>
                  <div className="fields">
                    {isPlanificateur ? (
                       <>
                      <div className="input-field-select">
                        <label>Technicien</label>
                        <Select
                          value={selectedTechnicien}
                          onChange={handleSelectTechnicienChange}
                          options={optionsTechniciens}
                          placeholder="Select a technician"
                          isClearable
                          styles={customStyles}
                          menuPortalTarget={document.body}
                        />
                        </div>
                       <div className="input-field-benif">
                       <label>Contact</label>
                       <input
                         type="text"
                         placeholder="mail"
                         value={technicianemail}
                         disabled
                       />
                     </div>
                     </> 
                    ) : (
                      <>
                        {isTechnicien && (
                          <>
                            <div className="input-field-benif">
                              <label>Technicien</label>
                              <input
                                type="text"
                                placeholder="Technicien"
                                value={technicienInfo}
                                disabled
                              />
                            </div>
                            <div className="input-field-benif">
                              <label>Contact</label>
                              <input
                                type="text"
                                placeholder="mail"
                                value={technicianemail}
                                disabled
                              />
                            </div>
                            <div className="input-field">
                              <label>Laisser Commentaire</label>
                              <textarea
                                type="text"
                                placeholder="cmt technicien"
                                name="cmtTech"
                                value={formData.cmtTech}
                                disabled={!isTechnicien}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              <div className="buttons">
                <button className="nextBtn" onClick={handleFormSubmit} type="button">
                  <span className="btnText">Editer</span>
                  <i className="bx bx-send"></i>
                </button>
                <button className="annulerBtn" onClick={handleClickAnnuler} type="button">
                  <span className="btnText">annuler</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TicketEdit;
