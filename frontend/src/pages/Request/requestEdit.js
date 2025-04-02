import { React, useState, useEffect } from 'react';
import '../../css/form.css';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { useNavigate, useParams } from 'react-router-dom';
import { get, getUserEmail, getOne, updateFormData, getOriginalNames } from '../../api/api.service';
import Cookies from 'js-cookie';
import Select from 'react-select';

const customStyles = {
    menu: (provided) => ({
        ...provided,
        maxHeight: 400,
        overflowY: "auto",
        zIndex: 9999,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

function RequestEdit() {

    const navigate = useNavigate();

    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [components, setComponents] = useState([]);
    const [techniciens, setTechniciens] = useState([]);
    const [technicianemail, setTechnicienEmail] = useState('');
    const [selectedTechnicien, setSelectedTechnicien] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedComponent, setSelectedComponent] = useState('');
    const [files, setFiles] = useState([]);
    const [newfilesuploaded, setNewfilesuploaded] = useState([]);
    const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        composant: '',
        categorie: '',
        localisation: '',
        statusDemande: 'en attente',
        technicienAssocie: '',
        emailTechnicienAssocie: '',
        contactManager: '',
        urgence: 'faible',
        cmtTech: '',
        piecesJointes: [],
    });

    const [selectedPiece, setSelectedPiece] = useState(null);
    const [isPlanificateur, setIsPlanificateur] = useState(false);
    const [isEmploye, setIsEmploye] = useState(false);
    const [isTechnicien, setIsTechnicien] = useState(false);


    const handleCategories = async () => {
        try {
            const allCategoris = await get('/categories', Cookies.get('jwt'));
            setCategories(allCategoris);
        } catch (error) {
            console.error('Error getting Employe mail', error);
        }
    };

    const handleComponents = async () => {
        try {
            const allComponents = await get('/components', Cookies.get('jwt'));
            setComponents(allComponents);
        } catch (error) {
            console.error('Error getting Employe mail', error);
        }
    };

    const optionsCategories = categories.map(category => ({
        value: category.id,
        label: `${category.name}`,
    }));

    const handleCategoryComponents = async (categoryId) => {
        try {
            const allComponents = await get(`/categories/${categoryId}/components`, Cookies.get('jwt'));
            setComponents(allComponents);
        } catch (error) {
            console.error('Error getting Employe mail', error);
        }
    };

    const handleSelectCategoryChange = (option) => {
        setSelectedCategory(option);
        if (option) {
            handleCategoryComponents(option.value); // Passer directement la valeur de l'employé sélectionné
        }
        setFormData(prevFormData => ({
            ...prevFormData,
            categorie: option,
        }));
    };


    const handleSelectComponentChange = (option) => {
        setSelectedComponent(option);
    };

    const optionsComponents = components.map(component => ({
        value: component.id,
        label: component.name,
    }));


    const handleTechniciens = async () => {
        try {
            const allTechniciens = await get('/user/techniciens', Cookies.get('jwt'));
            setTechniciens(allTechniciens);
        } catch (error) {
            console.error('Error getting Techniciens', error);
        }
    };

    const handleTechnicienEmail = async (employeId) => {
        try {
            const email = await getUserEmail(`/user/email/${employeId}`, Cookies.get('jwt'));
            setTechnicienEmail(email);
        } catch (error) {
            console.error('Error getting Techniciens', error);
        }
    };

    const handleTechnicienChange = selectedOption => {
        setSelectedTechnicien(selectedOption);
        if (selectedOption) {
            handleTechnicienEmail(selectedOption.value); // Passer directement la valeur de l'employé sélectionné
        }
        setFormData(prevFormData => ({
            ...prevFormData,
            technicienAssocie: selectedOption,
        }));
    };


    const optionsTechniciens = techniciens.map(technicien => ({
        value: technicien.id,
        label: `${technicien.userLastName} ${technicien.userName}`,
    }));


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDemande = async () => {
        try {
            const requestToEdit = await getOne(`/demande/findRequestById/${id}`, Cookies.get('jwt'));
            const category = optionsCategories.find(option => option.label === requestToEdit.categorie);
            const component = optionsComponents.find(option => option.label === requestToEdit.composant);
            const formData = {
                composant: component ? component.label : '',
                categorie: category.label,
                localisation: requestToEdit.localisation,
                urgence: requestToEdit.urgence,
                statusDemande: requestToEdit.statusDemande,
                contactManager: requestToEdit.contactManager,
                cmtTech: requestToEdit.cmtTech,
                piecesJointes: requestToEdit.piecesJointes,
            };
            if (requestToEdit.piecesJointes && requestToEdit.piecesJointes.length > 0) {
                const originalNames = await getOriginalNames(
                    requestToEdit.piecesJointes,
                    Cookies.get("jwt")
                );
                setFiles(Object.values(originalNames));
            }
            if (isPlanificateur) {
                const technicien = optionsTechniciens.find(option => option.label === requestToEdit.technicienAssocie);
                formData.technicienAssocie = technicien ? technicien.label : '';
                setSelectedTechnicien(technicien);
            }
            setTechnicienEmail(requestToEdit.emailTechnicienAssocie);
            setFormData(formData);
            setSelectedCategory(category);
            setSelectedComponent(component);

        } catch (error) {
            console.error('Error handling request', error);
        }
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newformData = new FormData();
        newformData.append("categorie", selectedCategory.label);
        newformData.append("composant", selectedComponent.label);
        newformData.append("urgence", formData.urgence);
        newformData.append("statusDemande", formData.statusDemande);
        newformData.append("feedBack", formData.feedBack);
        newformData.append("cmtTech", formData.cmtTech);
        formData.piecesJointes.forEach((item) => {
            newformData.append("piecesJointes[]", item); // Use "piecesJointes[]" as the key
        });
        Array.from(newfilesuploaded).forEach((file) => {
            newformData.append("files", file);
        });
        if (isPlanificateur) {
            newformData.append("technicienAssocie", selectedTechnicien ? selectedTechnicien.label : '');
            newformData.append("emailTechnicienAssocie", technicianemail);
        }
        try {
            await updateFormData(`/demande/updateDemande/${id}`, newformData, Cookies.get('jwt'));
            navigate('/valide');
        } catch (error) {
            console.error('Error updating demande:', error);
            navigate('/nonvalide');
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

    const handleClickAnnuler = () => {
        navigate(-1)
    }

    useEffect(() => {
        const userRole = Cookies.get('userRole');
        if (userRole === 'admin' || userRole === 'employe') {
            setIsEmploye(true);
        }
        else if (userRole === 'technicien') {
            setIsTechnicien(true);
        } else if (userRole === 'planificateur') {
            setIsPlanificateur(true);
            handleTechniciens();
        }
        handleCategories();
        handleComponents();
    }, []);

    useEffect(() => {
        if (isPlanificateur && techniciens.length > 0 && categories.length > 0 && components.length > 0) {
            handleDemande();
        }
    }, [isPlanificateur, techniciens, categories, components]);

    useEffect(() => {
        if ((isTechnicien || isEmploye) && categories.length > 0 && components.length > 0) {
            handleDemande();
        }
    }, [isTechnicien, categories, isEmploye]);

    useEffect(() => {
        if (files.length > 0) {
            setSelectedPiece(files[0]);
            setSelectedPieceIndex(0);
        }
    }, [files]);

    return (
        <div className='table__page__container'>
            <div className='sidebar__container'><SideBar /></div>
            <div className='table__page__content__container'>
                <div><Header /></div>
                <div className='ticketForm__content'>
                    <header>Editer Demande</header>
                    <form >
                        <div className="form first">
                            <div className="details personal">
                                <span className="title">Demande Details</span>
                                <div className="fields">
                                    <div className="input-field-select">
                                        <label>Category</label>
                                        <Select
                                            value={selectedCategory}
                                            onChange={handleSelectCategoryChange}
                                            options={optionsCategories}
                                            placeholder="Select a category"
                                            isClearable
                                        />
                                    </div>
                                    <div className="input-field-select">
                                        <label>Composant</label>
                                        <Select
                                            value={selectedComponent}
                                            onChange={handleSelectComponentChange}
                                            options={optionsComponents}
                                            placeholder="Select a category"
                                            isClearable
                                        />
                                    </div>
                                    <div className="input-field-Urgence">
                                        <label>Urgence</label>
                                        <select onChange={handleChange} name='urgence' value={formData.urgence}>
                                            <option value="faible" selected={formData.urgence === 'faible'}>faible</option>
                                            <option value="moyen" selected={formData.urgence === 'moyen'}>moyen</option>
                                            <option value="elevé" selected={formData.urgence === 'eleve'}>elevé</option>
                                            <option value="critique" selected={formData.urgence === 'critique'}>critique</option>
                                        </select>
                                    </div>
                                    <div className="input-field-localisation">
                                        <label>Localisation</label>
                                        <input type="text" name='localisation' value={formData.localisation} disabled />
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

                                    {!isEmploye &&
                                        <div className="input-field-Urgence">
                                            <label>Status</label>
                                            <div className="wrapper">
                                                <div className="option-status">
                                                    <input className="input" type="radio" name="statusDemande" value="en attente" checked={formData.statusDemande === "en attente"} onChange={handleChange} />
                                                    <div className="btn-status">
                                                        <span className="span">En Attente</span>
                                                    </div>
                                                </div>
                                                <div className="option-status">
                                                    <input className="input" type="radio" name="statusDemande" value="en cours" checked={formData.statusDemande === "en cours"} onChange={handleChange} />
                                                    <div className="btn-status">
                                                        <span className="span">En Cours</span>
                                                    </div>
                                                </div>
                                                <div className="option-status">
                                                    <input className="input" type="radio" name="statusDemande" value="accepter" checked={formData.statusDemande === "accepter"} onChange={handleChange} />
                                                    <div className="btn-status">
                                                        <span className="span">Accepter</span>
                                                    </div>
                                                </div>
                                                <div className="option-status">
                                                    <input className="input" type="radio" name="statusDemande" value="refuser" checked={formData.statusDemande === "refuser"} onChange={handleChange} />
                                                    <div className="btn-status">
                                                        <span className="span">Refuser</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>
                                {isEmploye && (
                                    <div className="details ID">
                                        <span className="title">Benificier Details</span>
                                        <div className="fields">

                                            <div className="input-field">
                                                <label>Laisser Feed Back</label>
                                                <textarea type="text" placeholder="Feek Back"></textarea>
                                            </div>

                                        </div>
                                    </div>
                                )}
                                {!isEmploye &&
                                    <div className="details ID">
                                        <span className="title">Technicien Details</span>
                                        <div className="fields">
                                            {isPlanificateur ? (
                                                <div className="input-field-select">
                                                    <label>Technicien</label>
                                                    <Select
                                                        value={selectedTechnicien}
                                                        onChange={handleTechnicienChange}
                                                        options={optionsTechniciens}
                                                        placeholder="Select a Technicien"
                                                        isClearable
                                                        styles={customStyles}
                                                        menuPortalTarget={document.body}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="input-field-benif">
                                                    <label>Technicien</label>
                                                    <input type="text" placeholder="nom et prenom" value={formData.technicienAssocie} disabled />
                                                </div>
                                            )}
                                            <div className="input-field">
                                                <label>contact</label>
                                                <input type="text" placeholder="mail" value={technicianemail} disabled />
                                            </div>
                                            {isTechnicien && (
                                                <div className="input-field">
                                                    <label>Commantaire</label>
                                                    <textarea type="text" placeholder="cmt technicien" value={formData.cmtTech} onChange={handleChange} name='cmtTech'></textarea>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                }
                                <div className="buttons">
                                    <button className="nextBtn" type="button" onClick={handleFormSubmit}>
                                        <span className="btnText">Editer Demande</span>
                                        <i className="bx bx-send"></i>
                                    </button>
                                    <button className="annulerBtn" type="button" onClick={handleClickAnnuler}>
                                        <span className="btnText">annuler</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div >
        </div >
    )
}
export default RequestEdit;