import { React, useEffect, useState } from "react";
import "../../css/form.css";
import "boxicons/css/boxicons.min.css";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { consultFile, downloadFile, getOne, getOriginalNames } from "../../api/api.service";
import { useParams } from "react-router-dom";
import { format } from "date-fns";


function TicketConsulte() {
    const navigate = useNavigate();
    const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [filesNames, setFilesNames] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        titre: "",
        description: "",
        urgence: "",
        status: "",
        benificerTicket: "",
        emailBenificer: "",
        technicien: "",
        emailTechnicien: "",
        localisation: "",
        feedback: "",
        cmtTech: "",
        dateCreation: "",
        dateResolution: "",
        piecesJointes: []
    });

    const { id } = useParams();
    const formattedDateCreation = formData.dateCreation
        ? format(new Date(formData.dateCreation), 'yyyy-MM-dd\'T\'HH:mm')
        : '';
    const formattedDateResolution = formData.dateResolution
        ? format(new Date(formData.dateResolution), 'yyyy-MM-dd\'T\'HH:mm')
        : '';

    const handleTicketConsulte = async () => {
        const ticketToConsulte = await getOne(
            `/ticket/ticketById/${id}`,
            Cookies.get("jwt")
        );
        setFormData({
            titre: ticketToConsulte.titre,
            description: ticketToConsulte.description,
            urgence: ticketToConsulte.urgence,
            status: ticketToConsulte.status,
            benificerTicket: ticketToConsulte.BenificierTicket,
            emailBenificer: ticketToConsulte.emailBenificierTicket,
            contactManager: ticketToConsulte.contactManager,
            technicien: ticketToConsulte.technicienAssocie,
            emailTechnicien: ticketToConsulte.emailTechnicienAssocie,
            localisation: ticketToConsulte.localisation,
            feedback: ticketToConsulte.feedBack,
            cmtTech: ticketToConsulte.cmtTech,
            dateCreation: ticketToConsulte.dateCreation,
            dateResolution: ticketToConsulte.dateResolution,
            piecesJointes: ticketToConsulte.piecesJointes,

        });

        if (ticketToConsulte.piecesJointes && ticketToConsulte.piecesJointes.length > 0) {
            const originalNames = await getOriginalNames(ticketToConsulte.piecesJointes, Cookies.get('jwt'));
            const originalNamesValues = Object.values(originalNames);
            setFilesNames(originalNamesValues);
            setSelectedPieceIndex(0);
            setSelectedPiece(originalNamesValues[0]);
        }


    };

    const handledownloadFile = async () => {
        const filename = formData.piecesJointes[selectedPieceIndex];
        await downloadFile(selectedPiece, `/ticket/download/${filename}`, Cookies.get('jwt'));
    }

    const handleConsulteFile = async () => {
        const filename = formData.piecesJointes[selectedPieceIndex];
        await consultFile(`/ticket/consult/${filename}`, Cookies.get('jwt'));
    }

    useEffect(() => {
        handleTicketConsulte();
    }, []);



    const handleClickRetour = () => {
        navigate(-1);
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
                <div className="ticketForm__content">
                    <header>Consulter ticket</header>
                    <form>
                        <div className="form first">
                            <div className="details personal">
                                <span className="title">Ticket Details</span>
                                <div className="fields">
                                    <div className="input-field">
                                        <label>titre</label>
                                        <textarea
                                            value={formData.titre}
                                            name="titre"
                                            disabled
                                        ></textarea>
                                    </div>
                                    <div className="input-field-description">
                                        <label>description</label>
                                        <textarea
                                            value={formData.description}
                                            name="description"
                                            disabled
                                        ></textarea>
                                    </div>
                                    <div className="input-field-Urgence">
                                        <label>Urgence</label>
                                        <select name="urgence" disabled>
                                            <option selected={formData.urgence === "faible"}>
                                                faible
                                            </option>
                                            <option selected={formData.urgence === "moyen"}>
                                                Moyen
                                            </option>
                                            <option selected={formData.urgence === "elevé"}>
                                                Elevé
                                            </option>
                                            <option selected={formData.urgence === "critique"}>
                                                critique
                                            </option>
                                        </select>
                                    </div>
                                    <div className="input-field-date">
                                        <label>Date de Création</label>
                                        <input
                                            type="datetime-local"
                                            value={formattedDateCreation}
                                            name="dateCreation"
                                            disabled
                                        />
                                    </div>
                                    <div className="input-field-date">
                                        <label>Date de Résolution</label>
                                        <input
                                            type="datetime-local"
                                            value={formattedDateResolution}
                                            name="dateResolution"
                                            disabled
                                        />
                                    </div>
                                    <div className="input-field-localisation">
                                        <label>Localisation</label>
                                        <input
                                            type="text"
                                            placeholder="Ville,Pays"
                                            name="localisation"
                                            value={formData.localisation}
                                            disabled
                                        />
                                    </div>
                                </div>
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
                                                disabled
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
                                                disabled
                                            />
                                            <div className="btn-status">
                                                <span className="span">En Cours</span>
                                            </div>{" "}
                                        </div>
                                        <div className="option-status">
                                            <input
                                                className="input"
                                                type="radio"
                                                name="status"
                                                value="résolu"
                                                checked={formData.status === "résolu"}
                                                disabled
                                            />
                                            <div className="btn-status">
                                                <span className="span">Resolu</span>
                                            </div>
                                        </div>
                                        <div className="option-status">
                                            <input
                                                className="input"
                                                type="radio"
                                                value="clôturé"
                                                checked={formData.status === "clôturé"}
                                                disabled
                                            />
                                            <div className="btn-status">
                                                <span className="span">Clôturé</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {formData.piecesJointes && formData.piecesJointes.length > 0 && (
                                    <div className="input-field-piécejoint">
                                        <label>Pièce jointe</label>
                                        <div className="file-select_option">
                                            <select
                                                onChange={(e) => {
                                                    const index = e.target.selectedIndex;
                                                    setSelectedPieceIndex(index);
                                                    setSelectedPiece(e.target.value);
                                                }}
                                            >
                                                {filesNames.map((fileName, index) => (
                                                    <option key={index} value={fileName}>
                                                        {fileName}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="piece_joint_icons">
                                            <i
                                                className='bx bx-show manage__icon'
                                                disabled={!selectedPiece}
                                                onClick={() => handleConsulteFile()}
                                            ></i>
                                            <i
                                                className='bx bxs-download manage__icon'
                                                disabled={!selectedPiece}
                                                onClick={() => handledownloadFile()}
                                            ></i>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="details ID">
                                <span className="title">Benificier Details</span>
                                <div className="fields">
                                    <div className="input-field-benif">
                                        <label>benificier</label>
                                        <input
                                            type="text"
                                            placeholder="nom et prenom"
                                            value={formData.benificerTicket}
                                            disabled
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>contact</label>
                                        <input
                                            type="text"
                                            placeholder="mail"
                                            value={formData.emailBenificer}
                                            disabled
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Manager Contact</label>
                                        <input
                                            type="text"
                                            placeholder="mail"
                                            require
                                            value={formData.contactManager}
                                            disabled
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Feed back</label>
                                        <textarea
                                            type="text"
                                            placeholder="feedback benificier"
                                            value={formData.feedback}
                                            disabled
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="details ID">
                                    <span className="title">Technicien Details</span>
                                    <div className="fields">
                                        <div className="input-field-benif">
                                            <label>Technicien</label>
                                            <input
                                                type="text"
                                                placeholder="nom et prenom"
                                                value={formData.technicien}
                                                disabled
                                            />
                                        </div>
                                        <div className="input-field-benif">
                                            <label>contact</label>
                                            <input
                                                type="text"
                                                placeholder="mail"
                                                value={formData.emailTechnicien}
                                                disabled
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Commantaire</label>
                                            <textarea
                                                type="text"
                                                placeholder="cmt technicien"
                                                value={formData.cmtTech}
                                                disabled
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="buttons">
                                        <button className="annulerBtn" onClick={handleClickRetour} type="button">
                                            <span className="btnText" >
                                                Retour
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TicketConsulte;
