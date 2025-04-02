import { React, useState, useEffect } from 'react';
import '../../css/form.css';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { useNavigate, useParams } from 'react-router-dom';
import { getOne ,getOriginalNames,downloadFile,consultFile } from '../../api/api.service';
import Cookies from 'js-cookie';
import { format } from "date-fns";

function RequestConsulte() {

    const navigate = useNavigate();

    const { id } = useParams();
    const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [filesNames , setFilesNames] = useState ([]);
    const [formData, setFormData] = useState({
        composant: '',
        categorie: '',
        BenificierDemande: '',
        localisation: '',
        statusDemande: 'en attente',
        emailBenificierDemande: '',
        technicienAssocie: '',
        emailTechnicienAssocie: '',
        contactManager: '',
        urgence: 'faible',
        dateReponse: '',
        dateDemande: '',
        cmtTech: '',
        piecesJointes: [],
    });
    const handleRequest = async () => {
        const requestToConsulte = await getOne(`/demande/findRequestById/${id}`, Cookies.get('jwt'));
        console.log("requestToConsulte :",requestToConsulte);
        setFormData({
            composant: requestToConsulte.composant,
            categorie: requestToConsulte.categorie,
            urgence: requestToConsulte.urgence,
            BenificierDemande: requestToConsulte.BenificierDemande,
            localisation: requestToConsulte.localisation,
            statusDemande: requestToConsulte.statusDemande,
            emailBenificierDemande: requestToConsulte.emailBenificierDemande,
            technicienAssocie: requestToConsulte.technicienAssocie,
            emailTechnicienAssocie: requestToConsulte.emailTechnicienAssocie,
            contactManager: requestToConsulte.contactManager,
            dateDemande: requestToConsulte.dateDemande,
            dateReponse: requestToConsulte.dateReponse,
            cmtTech: requestToConsulte.cmtTech,
            piecesJointes: requestToConsulte.piecesJointes,
            commentaire:requestToConsulte.commentaire
        }
        );
        if (requestToConsulte.piecesJointes && requestToConsulte.piecesJointes.length > 0) {
            const originalNames = await getOriginalNames( requestToConsulte.piecesJointes, Cookies.get('jwt'));
            const originalNamesValues = Object.values(originalNames);
            setFilesNames(originalNamesValues);
            setSelectedPieceIndex(0);
            setSelectedPiece(originalNamesValues[0]);
        }
    };
    const formattedDateDemande = formData.dateDemande
    ? format(new Date(formData.dateDemande), 'yyyy-MM-dd\'T\'HH:mm')
    : '';
    const formattedDateReponse = formData.dateReponse
    ? format(new Date(formData.dateReponse), 'yyyy-MM-dd\'T\'HH:mm')
    : '';

    const handledownloadFile = async () => {
        const filename = formData.piecesJointes[selectedPieceIndex] ;
        await downloadFile (selectedPiece,`/demande/download/${filename}`,Cookies.get('jwt'));
    }

    const handleConsulteFile = async () => {
        const filename = formData.piecesJointes[selectedPieceIndex];
        await consultFile(`/demande/consult/${filename}`, Cookies.get('jwt'));
    }

    const handleClickAnnuler = () => {
        navigate(-1)
    }

    useEffect(() => {
        handleRequest();
    }, []);

    return (
        <div className='table__page__container'>
            <div className='sidebar__container'><SideBar /></div>
            <div className='table__page__content__container'>
                <div><Header /></div>
                <div className='ticketForm__content'>
                    <header>Consulter Demande</header>
                    <form >
                        <div className="form first">
                            <div className="details personal">
                                <span className="title">Demande Details</span>
                                <div className="fields">
                                    <div className="input-field">
                                        <label>Categorie</label>
                                        <input type="text" placeholder="categorie" value={formData.categorie} disabled />
                                    </div>
                                    <div className="input-field">
                                        <label>Composant</label>
                                        <input type="text" placeholder="composant" value={formData.composant} disabled />
                                    </div>
                                    <div className="input-field-Urgence">
                                        <label>Urgence</label>
                                        <select required name='urgence' disabled>
                                            <option selected={formData.urgence === 'faible'}>faible</option>
                                            <option selected={formData.urgence === 'moyen'}>Moyen</option>
                                            <option selected={formData.urgence === 'eleve'}>Elevé</option>
                                            <option selected={formData.urgence === 'critique'}>critique</option>
                                        </select>
                                    </div>
                                    <div className="input-field-date">
                                        <label>Date de Creation</label>
                                        <input  type="datetime-local" disabled value={formattedDateDemande} />
                                    </div>
                                    <div className="input-field-date">
                                        <label>Date de Resolution</label>
                                        <input  type="datetime-local" disabled value={formattedDateReponse} />
                                    </div>
                                    <div className="input-field-localisation">
                                        <label>Localisation</label>
                                        <input type="text" placeholder="Ville,Pays" name='localisation' value={formData.localisation} disabled />
                                    </div>
                                    <div className="input-field">
                                        <label>Commentaire</label>
                                        <textarea
                                            placeholder="Commentaire"
                                            disabled
                                            name='commentaire'
                                            value={formData.commentaire}
                                        />
                                </div>
                                </div>
                                <div className="input-field-Urgence">
                                    <label>Status</label>
                                    <div className="wrapper">
                                        <div className="option-status" >
                                            <input className="input" type="radio" name="status" value="en attente" checked={formData.statusDemande === 'en attente'} disabled />
                                            <div className="btn-status">
                                                <span className="span">En Attente</span>
                                            </div>
                                        </div>
                                        <div className="option-status">
                                            <input className="input" type="radio" name="status" value="en cours" checked={formData.statusDemande === 'en cours'} disabled />
                                            <div className="btn-status">
                                                <span className="span">En Cours</span>
                                            </div>
                                        </div>
                                        <div className="option-status">
                                            <input className="input" type="radio" name="status" value="accepter" checked={formData.statusDemande === 'accepter'} disabled />
                                            <div className="btn-status">
                                                <span className="span">Accepter</span>
                                            </div>
                                        </div>
                                        <div className="option-status">
                                            <input className="input" type="radio" name="status" value="refuser" checked={formData.statusDemande === 'refuser'} disabled />
                                            <div className="btn-status">
                                                <span className="span">Refuser</span>
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
                                                    setSelectedPieceIndex(e.target.selectedIndex);
                                                    setSelectedPiece(e.target.value);
                                                }}
                                            >
                                            {filesNames.map((fileName, index) => (
                                            <option key={index} value={fileName}>
                                                {fileName}
                                            </option>
                                            ))}
                                            </select>
                                            <div className = "piece_joint_icons">
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
                                        <input type="text"  value={formData.BenificierDemande} disabled />
                                    </div>
                                    <div className="input-field">
                                        <label>contact</label>
                                        <input type="text" value={formData.emailBenificierDemande} disabled />
                                    </div>
                                    <div className="input-field">
                                        <label>Manager Contact</label>
                                        <input type="text" value={formData.contactManager} disabled ></input >
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
                                            <input type="text" placeholder="nom et prenom" value={formData.technicienAssocie} disabled />
                                        </div>
                                        <div className="input-field">
                                            <label>contact</label>
                                            <input type="text" placeholder="mail" value={formData.emailTechnicienAssocie} disabled />
                                        </div>
                                        <div className="input-field">
                                            <label>Commantaire</label>
                                            <textarea type="text" placeholder="cmt technicien" value={formData.cmtTech} disabled></textarea>
                                        </div>
                                    </div>
                                    <div className="buttons">
                                        <button className="annulerBtn" onClick={handleClickAnnuler} type='button'>
                                            <span className="btnText" >annuler</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RequestConsulte;