import React from "react";
import "./help.css";
import "boxicons/css/boxicons.min.css";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import desk from "../../images/help_icons/desk.svg";
import chatbot from "../../images/help_icons/chatbot.svg";
import demande from "../../images/help_icons/demande.svg";
import ticket from "../../images/help_icons/ticket.svg";
import { useNavigate } from 'react-router-dom';


function Help() {
  const navigate = useNavigate();
  const handleClickNavigationtoDeskInfo = () => {
    navigate('/aide/deskservice');
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
        <div className="categories__container">
          <div className="header">Questions toujours posées</div>
            <div className="cardCategorie">
              <div className="cardCategorieimg">
                <img src={desk} />
              </div>
              <div className="cardCategorietextContent" onClick={handleClickNavigationtoDeskInfo}>
                <p className="cardCategorieh1">Comment contacter le service desk ?</p>
              </div>
            </div>
            <div className="cardCategorie" >
              <div className="cardCategorieimg">
                <img src={ticket} />
              </div>
              <div className="cardCategorietextContent">
                <a href="https://youtu.be/3TTI58EPncA">
                <p className="cardCategorieh1">Comment créer un ticket ?</p>
                </a>
              </div>
            </div>
            <div className="cardCategorie">
              <div className="cardCategorieimg">
                <img src={demande} />
              </div>
              <div className="cardCategorietextContent">
                <a href="https://youtu.be/IkP_D8qbIGQ">
                <p className="cardCategorieh1">Comment créer une demande ?</p>
                </a>
              </div>
            </div>
            <div className="cardCategorie">
              <div className="cardCategorieimg">
                <img src={chatbot} />
              </div>
             <div className="cardCategorietextContent">
                <a href="#">
                <p className="cardCategorieh1">Comment utiliser le chatbot ?</p>
                </a>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
