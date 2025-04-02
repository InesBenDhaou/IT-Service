import { React, useState, useEffect } from 'react';
import '../../css/form.css';
import '../Techniciens/technicien.css';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { getOne, getUserImg, get, update, getEmailsByDepart } from '../../api/api.service';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

const customStyles = {
    menu: (provided) => ({
        ...provided,
        maxHeight: 400, // Set the maximum height for the dropdown menu
        overflowY: "auto", // Enable vertical scrolling
        zIndex: 9999, // Ensure the dropdown menu appears above other elements
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure the portal has a high z-index
};

function EmployeEdit() {

    const { id } = useParams();
    const [urlImg, setUrlImg] = useState('');
    const [localisations, setLocalisations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [postes, setPostes] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedPoste, setSelectedPoste] = useState('');
    const [selectedLocalisation, setSelectedLocalisation] = useState('');
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState('');

    const [formData, setFormData] = useState({
        userName: '',
        userLastName: '',
        department: '',
        role: '',
        numTel: '',
        email: '',
        localisation: '',
        contactManager: '',
        poste: '',
    });

    const navigate = useNavigate();

    const handleEmploye = async () => {
        const emp = await getOne(`/user/${id}/detailsUser`, Cookies.get('jwt'))

        const dept = optionsDepartments.find(
            option => option.label === emp.department
        );
        const loc = optionsLocalisations.find(
            option => option.label === emp.localisation
        );
        const poste = optionsPostes.find(
            option => option.label === emp.poste
        );

        const manager = optionsManagers.find(
            option => option.label === emp.contactManager
        );
        setSelectedDepartment(dept)
        setSelectedLocalisation(loc)
        setSelectedPoste(poste)
        setSelectedManager(manager)
        setFormData({
            userName: emp.userName,
            userLastName: emp.userLastName,
            role: emp.role,
            numTel: emp.numTel,
            email: emp.email,
        })
        const imgUrl = await getUserImg(`/profile/profileImage/${emp.profileImg}`, Cookies.get('jwt'));
        setUrlImg(imgUrl);
    }

    const handleLocalisations = async () => {
        const allLocalisations = await get('/localisations', Cookies.get('jwt'));
        setLocalisations(allLocalisations);
    }

    const optionsLocalisations = localisations.map(Localisation => ({
        value: Localisation.id,
        label: `${Localisation.placeName}`,
    }));

    const handleManagers = async () => {
        const allManagers = await get('/user/emails', Cookies.get('jwt'));;
        setManagers(allManagers);
    }

    const optionsManagers = managers.map(manager => ({
        value: manager.id,
        label: `${manager.email}`,
    }));

    const handleDepartments = async () => {
        const allDepartments = await get('/departments', Cookies.get('jwt'));
        setDepartments(allDepartments);
    }

    const optionsDepartments = departments.map(department => ({
        value: department.id,
        label: `${department.nom}`,
    }));

    const handlePostes = async () => {
        const allPostes = await get('/postes', Cookies.get('jwt'));
        setPostes(allPostes);
    }

    const optionsPostes = postes.map(poste => ({
        value: poste.id,
        label: `${poste.nom}`,
    }));

    const handleDepartmentPostes = async (departmentId) => {
        try {
            const allPostes = await get(`/departments/${departmentId}/postes`, Cookies.get('jwt'));
            setPostes(allPostes);
        } catch (error) {
            console.error('Error getting Employe mail', error);
        }
    };

    const handleSelectLocalisationChange = (option) => {
        setSelectedLocalisation(option);
    };

    const handleContactManager = async (option) => {
        const department = option;
        const allManagers = await getEmailsByDepart('/user/emailsByDepartment', department, Cookies.get('jwt'));
        setManagers(allManagers);
    }

    const handleSelectedDepartmentChange = (option) => {
        setSelectedDepartment(option);
        if (option) {
            handleDepartmentPostes(option.value);
            handleContactManager(option.label);
        }
    };

    const handleSelectManagerChange = (option) => {
        setSelectedManager(option);
    };

    const handleSelectPosteChange = (option) => {
        setSelectedPoste(option);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const formDataToSend = {
            userName: formData.userName,
            userLastName: formData.userLastName,
            department: selectedDepartment.label, // Assuming selectedDepartment is an object with a 'value' property
            role: formData.role,
            numTel: formData.numTel,
            email: formData.email,
            localisation: selectedLocalisation.label, // Assuming selectedLocalisation is an object with a 'value' property
            poste: selectedPoste.label,
            contactManager: selectedManager ? selectedManager.label : ''// Assuming selectedPoste is an object with a 'value' property
        };
        try {
            await update(`/user/${id}`, formDataToSend, Cookies.get('jwt'));
            navigate('/valide');
        } catch (error) {
            navigate('/nonvalide');
        }
    };


    const handleClickAnnuler = () => {
        navigate(-1)
    }

    useEffect(() => {
        handleLocalisations();
        handleDepartments();
        handlePostes();
        handleManagers();
    }, []);

    useEffect(() => {
        if (departments.length > 0 && postes.length > 0 && localisations.length > 0) {
            handleEmploye();
        }
    }, [localisations]);

    return (
        <div className='table__page__container'>
            <div className='sidebar__container'><SideBar /></div>
            <div className='table__page__content__container'>
                <div><Header /></div>
                <div className='ticketForm__content'>
                    <header>Employe</header>
                    <form >
                        <div className="form first">
                            <div className="details personal">
                                <span className="title">Employe Details</span>
                                <div className="fields">
                                    <div className='details__conatiner'>
                                        <div className="input-field-id">
                                            <img src={urlImg} alt="" />
                                        </div>
                                        <div className='part__details'>
                                            <div className='part1__details'>
                                                <div className="input-field-benif">
                                                    <label>Prénom</label>
                                                    <input type="text" placeholder="name" name='userName' value={formData.userName} onChange={handleChange} />
                                                </div>
                                                <div className="input-field-benif">
                                                    <label>Nom</label>
                                                    <input type="text" placeholder="name" name='userLastName' value={formData.userLastName} onChange={handleChange} />
                                                </div>
                                                <div className="input-field-Urgence">
                                                    <label>Rôle</label>
                                                    <select required name="role" value={formData.role} onChange={handleChange}>
                                                        <option value="admin" selected={formData.role === "admin"}>admin</option>
                                                        <option value="employe" selected={formData.role === "employe"}>employe</option>
                                                        <option value="technicien" selected={formData.role === "technicien"}>technicien</option>
                                                        <option value="planificateur" selected={formData.role === "planificateur"}>planificateur</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='part2__details'>
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
                                    </div>
                                </div>
                            </div>
                            <div className="details ID">
                                <span className="title">Poste Details</span>
                                <div className="fields">
                                    <div className="input-field-select">
                                        <label>Depatement</label>
                                        <Select
                                            value={selectedDepartment}
                                            onChange={handleSelectedDepartmentChange}
                                            options={optionsDepartments}
                                            placeholder="Select a department"
                                            isClearable
                                            styles={customStyles}
                                            menuPortalTarget={document.body}
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
                                            styles={customStyles}
                                            menuPortalTarget={document.body}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="details ID">
                                <span className="title">Contact Details</span>
                                <div className="fields">
                                    <div className="input-field-benif">
                                        <label>Email</label>
                                        <input type="text" placeholder="nom et prenom" name="email" value={formData.email} onChange={handleChange} />
                                    </div>
                                    <div className="input-field-benif">
                                        <label>NumTel</label>
                                        <input type="text" placeholder="mail" name="numTel" value={formData.numTel} onChange={handleChange} />
                                    </div>
                                    <div className="input-field-select">
                                        <label>Contact Manage</label>
                                        <Select
                                            value={selectedManager}
                                            onChange={handleSelectManagerChange}
                                            options={optionsManagers}
                                            placeholder="Select a Manager"
                                            isClearable
                                            styles={customStyles}
                                            menuPortalTarget={document.body}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="buttons">
                                <button className="nextBtn" onClick={handleEdit} type='button'>
                                    <span className="btnText">Editer</span>
                                    <i className='bx bx-send'></i>
                                </button>
                                <button className="annulerBtn" onClick={handleClickAnnuler} type='button'>
                                    <span className="btnText" >annuler</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default EmployeEdit;