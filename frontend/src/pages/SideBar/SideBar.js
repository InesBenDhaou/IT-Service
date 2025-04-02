import React, { useEffect, useState } from 'react';
import './SideBar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getUserImg, get, postLogout } from '../../api/api.service';

function SideBar() {
    const [isClosed, setIsClosed] = useState(false);
    const [username, setUsername] = useState("");
    const [userposte, setUserpst] = useState("");
    const [userImgUrl, setUserImgUrl] = useState('');
    const [isPlanificateur , setIsPlanificateur] = useState(false);
    const [isAdminRh ,setIsAdminRh] = useState (false)
    const navigate = useNavigate();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);
    const userId = Cookies.get('userId');
    const toggleSidebar = () => {
        setIsClosed(!isClosed);
    };

    const handleUserinfo = async () => {
        try {
            const userplusinfo = await get(
                `/user/${userId}/detailsUser`,
                Cookies.get("jwt")
            );
            setUsername(userplusinfo.userLastName + " " + userplusinfo.userName);
            setUserpst(userplusinfo.poste);
            const imgUrl = await getUserImg(`/profile/profileImage/${userplusinfo.profileImg}`, Cookies.get('jwt'));
            setUserImgUrl(imgUrl);
        } catch (error) {
            console.error('Error getting user information', error);
        }
    };

    useEffect(() => {
        handleUserinfo();
        const userRole = Cookies.get('userRole');
        const userPoste = Cookies.get('userPoste')
        if (userRole === 'planificateur'){
             setIsPlanificateur(true);
        } 
        if ((userRole === 'admin') && (userPoste =="Responsable RH")){
            setIsAdminRh(true);
       }
    }, []);

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    const handleNavigation = (path) => {
        navigate(path);
        setIsClosed(false);
        setActiveLink(path);
    };

    const handleClickLogout = async () => {
        try {
            const status = await postLogout('/auth/logout', {}, Cookies.get('jwt'));
            if (status === 201) {
                navigate('/LogIn');
                Cookies.remove('jwt');
            }
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

   
    return (
        
        <div className={`sidebar ${isClosed ? 'closeSideBar' : ''}`}>
            <header>
                <div className="image-text">
                    <span className="image">
                        <img src={userImgUrl} alt="Profile" />
                    </span>
                    <div className="text logo-text">
                        <span className="name">{username}</span>
                        <span className="profession">{userposte}</span>
                    </div>
                </div>
                <i className='bx bx-chevron-right toggle' onClick={toggleSidebar}></i>
            </header>
            <div className="menu-side-bar">
                <div className="menu">
                    <ul className="menu-links">
                        <li className={`nav-link ${activeLink === '/accueil' ? 'active' : ''}`} onClick={() => handleNavigation('/accueil')}>
                            <a href="#">
                                <i className='bx bx-home icon'></i>
                                <span className="text nav-text">Acceuil</span>
                            </a>
                        </li>
                        <li className={`nav-link ${activeLink === '/profile' ? 'active' : ''}`} onClick={() => handleNavigation('/profile')}>
                            <a href="#">
                                <i className='bx bx-user-circle icon'></i>
                                <span className="text nav-text">Profile</span>
                            </a>
                        </li>
                        {isPlanificateur && (
                            <li className={`nav-link ${activeLink === '/techniciens' ? 'active' : ''}`} onClick={() => handleNavigation('/techniciens')}>
                                <a href="#">
                                    <i class='bx bx-group icon'></i>
                                    <span className="text nav-text">Techniciens</span>
                                </a>
                            </li>
                        )}
                        {isAdminRh && (
                            <li className={`nav-link ${activeLink === '/departements' ? 'active' : ''}`} onClick={() => handleNavigation('/departements')}>
                                <a href="#">
                                    <i class='bx bx-buildings icon'></i>
                                    <span className="text nav-text">Departements</span>
                                </a>
                            </li>
                        )}
                        {isAdminRh && (
                            <li className={`nav-link ${activeLink === '/employes' ? 'active' : ''}`} onClick={() => handleNavigation('/employes')}>
                                <a href="#">
                                    <i class='bx bx-group icon'></i>
                                    <span className="text nav-text">Employés</span>
                                </a>
                            </li>
                        )}
                        <li className={`nav-link ${activeLink === '/tickets' ? 'active' : ''}`} onClick={() => handleNavigation('/tickets')} >
                            <a href="#">
                                <i className='bx bxs-coupon bx-flip-vertical icon'></i>
                                <span className="text nav-text">Tickets</span>
                            </a>
                        </li>
                        {isPlanificateur && (
                            <li className={`nav-link ${activeLink === '/menager/categories' ? 'active' : ''}`} onClick={() => handleNavigation('/menager/categories')}>
                                <a href="#">
                                    <i class='bx bx-objects-horizontal-left icon'></i>
                                    <span className="text nav-text">Demandes Categories</span>
                                </a>
                            </li>
                        )}
                        <li className={`nav-link ${activeLink === '/demandes' ? 'active' : ''}`} onClick={() => handleNavigation('/demandes')}>
                            <a href="#">
                                <i className='bx bx-purchase-tag-alt icon'></i>
                                <span className="text nav-text">Demandes</span>
                            </a>
                        </li>
                        <li className={`nav-link ${activeLink === '/basedeconnaissance' ? 'active' : ''}`} onClick={() => handleNavigation('/basedeconnaissance')}>
                            <a href="#">
                                <i className='bx bx-book-bookmark icon'></i>
                                <span className="text nav-text">Base de Connaisance</span>
                            </a>
                        </li>
                        <li className={`nav-link ${activeLink === '/aide' ? 'active' : ''}`} onClick={() => handleNavigation('/aide')}>
                            <a href="#">
                                <i className='bx bx-help-circle icon'></i>
                                <span className="text nav-text">Aide</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="bottom-content">
                    <li onClick={handleClickLogout}>
                        <a href="#">
                            <i className='bx bx-log-out icon'></i>
                            <span className="text nav-text">Logout</span>
                        </a>
                    </li>
                </div>
            </div>
        </div>
    );
}
export default SideBar;
