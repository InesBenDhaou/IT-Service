import React, { useState, useEffect, useRef } from "react";
import "../../css/form.css";
import "boxicons/css/boxicons.min.css";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import { useNavigate, useParams } from "react-router-dom";
import {
    get,
    getUserEmail,
    postFormData,
    getConnectedUser,
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

function RequestCreate() {
    const navigate = useNavigate();
    const [currentErrorMessage, setCurrentErrorMessage] = useState("");
    const { id } = useParams();
    const { idComponent } = useParams();
    const [isPlanificateur, setIsPlanificateur] = useState(false);
    const [isEmploye, setIsEmploye] = useState(false);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        urgence: "faible",
        status: "en attente",
        localisation: "",
        commentaire: ""
    });
    const [component, setComponent] = useState("");
    const [category, setCategory] = useState("");
    const [techniciens, setTechniciens] = useState([]);
    const [technicienEmail, setTechnicienEmail] = useState("");
    const [employes, setEmployes] = useState([]);
    const [userName, setUserName] = useState([]);
    const [userLastName, setUserLastName] = useState([]);
    const [localisations, setLocalisations] = useState([]);
    const [emailBenificier, setEmailBenificier] = useState("");
    const [selectedEmploye, setSelectedEmploye] = useState(null);
    const [selectedTechnicien, setSelectedTechnicien] = useState(null);
    const [selectedLocalisation, setSelectedLocalisation] = useState("");
    const [contactManager, setContactManager] = useState("");

    const handleComposantAndCategorie = async () => {
        const response = await get(
            `/categories/${id}/component/${idComponent}`,
            Cookies.get("jwt")
        );
        setComponent(response.componentName);
        setCategory(response.categoryName);
    };

    const handleUserinfo = async () => {
        try {
            const connecteduser = await getConnectedUser(
                "/auth/userConnected",
                Cookies.get("jwt")
            );
            const userinfo = await get(
                `/user/${connecteduser.id}/detailsUser`,
                Cookies.get("jwt")
            );
            setUserName(userinfo.userName);
            setUserLastName(userinfo.userLastName);
            setEmailBenificier(userinfo.email);
            const loc = optionsLocalisations.find(
                (option) => option.label === userinfo.localisation
            );
            setSelectedLocalisation(loc);
            setContactManager(userinfo.contactManager);
        } catch (error) {
            console.error("Error getting user information", error);
        }
    };

    const handleEmployes = async () => {
        try {
            const allEmployes = await get("/user/employees", Cookies.get("jwt"));
            setEmployes(allEmployes);
        } catch (error) {
            console.error("Error getting Employe mail", error);
        }
    };

    const handleEmployeEmail = async (employeId) => {
        try {
            const email = await getUserEmail(
                `/user/email/${employeId}`,
                Cookies.get("jwt")
            );
            setEmailBenificier(email);
            const manageremail = await getUserEmail(
                `/user/manageremail/${employeId}`,
                Cookies.get("jwt")
            );
            setContactManager(manageremail);
        } catch (error) {
            console.error("Error getting Employe mail", error);
        }
    };

    const optionsEmployes = employes.map((employes) => ({
        value: employes.id,
        label: `${employes.userLastName} ${employes.userName}`,
    }));

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

    const handleSelectEmployeChange = (option) => {
        setSelectedEmploye(option);
        if (option) {
            handleEmployeEmail(option.value);
            handleEmployeLocalisation(option.value);
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

    const handleTechnicienEmail = async (employeId) => {
        try {
            const email = await getUserEmail(
                `/user/email/${employeId}`,
                Cookies.get("jwt")
            );
            setTechnicienEmail(email);
        } catch (error) {
            console.error("Error getting mail Technicien", error);
        }
    };

    const optionsTechniciens = techniciens.map((technicien) => ({
        value: technicien.id,
        label: `${technicien.userLastName} ${technicien.userName}`,
    }));

    const handleSelectTechnicienChange = (option) => {
        setSelectedTechnicien(option);
        if (option) {
            handleTechnicienEmail(option.value);
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
        const fileNameToRemove = selectedFileToRemove || (fileOptions.length > 0 ? fileOptions[0].label : null);
        if (fileNameToRemove) {
            setSelectedFiles((prevFiles) =>
                prevFiles.filter((file) => file.name !== fileNameToRemove)
            );
            setSelectedFileToRemove(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset file input
            }
        }
    }



    const handleCreationDemande = async (e) => {
        e.preventDefault();
        const newformData = new FormData();
        newformData.append("composant", component);
        newformData.append("categorie", category);
        newformData.append("urgence", formData.urgence);
        newformData.append(
            "BenificierDemande",
            selectedEmploye ? selectedEmploye.label : userName + " " + userLastName
        );
        newformData.append("localisation", selectedLocalisation.label);
        newformData.append("statusDemande", formData.status);
        newformData.append("emailBenificierDemande", emailBenificier);
        newformData.append(
            "technicienAssocie",
            selectedTechnicien ? selectedTechnicien.label : ""
        );
        newformData.append("emailTechnicienAssocie", technicienEmail);
        newformData.append("contactManager", contactManager);
        newformData.append("commentaire", formData.commentaire);
        Array.from(files).forEach((file) => {
            newformData.append("files", file);
        });
        try {
            await postFormData(
                "/demande/createDemande",
                newformData,
                Cookies.get("jwt")
            );
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
        const userRole = Cookies.get("userRole");
        if (
            userRole === "admin" ||
            userRole === "employe" ||
            userRole === "technicien"
        ) {
            setIsEmploye(true);
        }
        if (userRole === "planificateur") {
            setIsPlanificateur(true);
            handleEmployes();
            handleTechniciens();
        }
        handleComposantAndCategorie();
        handleLocalisations();
    }, []);

    useEffect(() => {
        if (isEmploye && localisations.length > 0) {
            handleUserinfo();
        }
    }, [localisations]);

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
                    <header>Nouvelle Demande</header>
                    <form>
                        <div className="form first">
                            <div className="details personal">
                                <span className="title">Demande Details</span>
                                <div className="fields">
                                    <div className="input-field">
                                        <label>Composant</label>
                                        <input
                                            type="text"
                                            placeholder="composant"
                                            value={component}
                                            disabled
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Categorie</label>
                                        <input
                                            type="text"
                                            placeholder="categorie"
                                            value={category}
                                            disabled
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
                                            isDisabled
                                        />
                                    </div>
                                    <div className="input-field-Urgence">
                                        <label>Urgence</label>
                                        <select
                                            required
                                            name="urgence"
                                            value={formData.urgence}
                                            onChange={handleChange}
                                        >
                                            <option selected>faible</option>
                                            <option>moyen</option>
                                            <option>elevé</option>
                                            <option>critique</option>
                                        </select>
                                    </div>
                                    <div className="input-file-field">
                                        <label>Piéces Jointes</label>
                                        <input
                                            type="file"
                                            placeholder="ticket document"
                                            name="files"
                                            multiple
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
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
                                    <div className="input-field">
                                        <label>Commmentaire</label>
                                        <textarea
                                            placeholder="ajouter un commentaire"
                                            name="commentaire"
                                            value={formData.commentaire}
                                            onChange={handleChange}
                                        />
                                    </div>
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
                                                value={userLastName + " " + userName}
                                                required
                                                disabled
                                            />
                                        </div>
                                    )}
                                    <div className="input-field">
                                        <label>contact</label>
                                        <input
                                            type="text"
                                            placeholder="mail"
                                            value={emailBenificier}
                                            disabled
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Manager</label>
                                        <input
                                            type="text"
                                            placeholder="mail manager"
                                            value={contactManager}
                                            disabled
                                        ></input>
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
                                                    placeholder="Select a Technicien"
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
                                                    value={technicienEmail}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="buttons">
                                    <button className="nextBtn" type="button" onClick={handleCreationDemande}>
                                        <span className="btnText">
                                            Passer Demande
                                        </span>
                                        <i className="bx bx-send"></i>
                                    </button>

                                    <button className="annulerBtn" type="button" onClick={handleClickAnnuler}>
                                        <span className="btnText">
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
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RequestCreate;
