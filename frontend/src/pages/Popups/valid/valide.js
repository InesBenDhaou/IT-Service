import React from 'react';
import './valide.css';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../../SideBar/SideBar';
import Header from '../../Header/header';
import { useNavigate ,useLocation } from 'react-router-dom';

function Valide() {

    const navigate = useNavigate();
    const handleClickHomePage = () => {
        navigate('/accueil'); 
    }
    const handleClickConsulter = () => {
                navigate(-2); 
    }
    return (
    <div className='table__page__container'>
        <div className='sidebar__container'><SideBar/></div>
        <div className='table__page__content__container'>
            <div><Header /></div>
            <div className='Validpopup__container'>
            <div class="notificationCard">
            <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.9957 11.5C14.8197 10.912 11.9957 9 10.4957 9C8.9957 9 5.17825 11.7674 6 13C7 14.5 9.15134 11.7256 10.4957 12C11.8401 12.2744 13 13.5 13 14.5C13 15.5 11.8401 16.939 10.4957 16.5C9.15134 16.061 8.58665 14.3415 7.4957 14C6.21272 13.5984 5.05843 14.6168 5.5 15.5C5.94157 16.3832 7.10688 17.6006 8.4957 19C9.74229 20.2561 11.9957 21.5 14.9957 20C17.9957 18.5 18.5 16.2498 18.5 13C18.5 11.5 13.7332 5.36875 11.9957 4.5C10.9957 4 10 5 10.9957 6.5C11.614 7.43149 13.5 9.27705 14 10.3751M15.5 8C15.5 8 15.3707 7.5 14.9957 6C14.4957 4 15.9957 3.5 16.4957 4.5C17.1281 5.76491 18.2872 10.9147 18.4957 13" stroke="#83B4FF" stroke-width="1.2"></path> </g></svg>
                <p class="notificationPara">Operation terminée avec succés!</p>
                <div class="buttonContainer">
                    <button class="AllowBtn" onClick={handleClickConsulter}>consulter</button>
                    <button class="NotnowBtn" onClick={handleClickHomePage}>non merci</button>
                </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Valide ;