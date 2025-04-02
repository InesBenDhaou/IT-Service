import React from 'react';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../../SideBar/SideBar';
import Header from '../../Header/header';
import '../valid/valide.css';
import { useNavigate } from 'react-router-dom';

function Submission() {
    const navigate = useNavigate();
    const handleClickRetour = () => {
        navigate('/basedeconnaissance'); 
    }

    return (
        <div className='table__page__container'>
            <div className='sidebar__container'><SideBar /></div>
            <div className='table__page__content__container'>
                <div><Header /></div>
                <div className='Validpopup__container'>
                    <div className="notificationCard">
                        <svg fill="#83B4FF" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 334.5 334.5" xmlSpace="preserve">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M332.797,13.699c-1.489-1.306-3.608-1.609-5.404-0.776L2.893,163.695c-1.747,0.812-2.872,2.555-2.893,4.481 s1.067,3.693,2.797,4.542l91.833,45.068c1.684,0.827,3.692,0.64,5.196-0.484l89.287-66.734l-70.094,72.1 c-1,1.029-1.51,2.438-1.4,3.868l6.979,90.889c0.155,2.014,1.505,3.736,3.424,4.367c0.513,0.168,1.04,0.25,1.561,0.25 c1.429,0,2.819-0.613,3.786-1.733l48.742-56.482l60.255,28.79c1.308,0.625,2.822,0.651,4.151,0.073 c1.329-0.579,2.341-1.705,2.775-3.087L334.27,18.956C334.864,17.066,334.285,15.005,332.797,13.699z"></path>
                            </g>
                        </svg>
                        <p className="notificationPara">Votre soumission a été envoyée et attend la validation de l'administrateur!</p>
                        <div className="buttonContainer">
                            <button className="AllowBtn" onClick={handleClickRetour}>Retour</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Submission;
