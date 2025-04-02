import {React , useEffect ,useState}from 'react';
import './homepage.css';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getUserProfile } from '../../api/api.service';

function HomePage() {

    const navigate = useNavigate();
    const [userlastname, setUserlastname] = useState("");

    const handleUserlastname = async () => {
        const userinfo = await getUserProfile('/profile',Cookies.get('jwt'));
        setUserlastname (userinfo.userLastName);
    }

    const handleClickNavigation = (heading) => {
        if (heading === "Ticket") {
            navigate('/tickets');
        } else if (heading === "Demande") {
            navigate('/demandes');
        } else if (heading === "Base de connaissances") {
            navigate('/basedeconnaissance');
        }
    };

    const cardsData = [
        {
          heading: "Ticket",
          description: "Soumettre et gérer les demandes de support et les problèmes",
        },
        {
          heading: "Demande",
          description: "Initier de nouvelles demandes de service ou d'assistance",
        },
        {
          heading: "Base de connaissances",
          description: "Accéder à un répertoire d'articles utiles et d'informations",
        },
      ];

   
    useEffect(() => {
        handleUserlastname();
      }, []);
    


    return (
    <div className='table__page__container'>
        <div className ='sidebar__container'><SideBar/></div>
        <div className='table__page__content__container'>
        <div><Header/></div>
        <div className='welcome-user-container'>
            <div className = "text__container">
                <p className="text__animated">Bienvenue <em>{userlastname}</em> , </p>
                <p className="text">Comment pouvons-nous vous aider aujourd'hui?</p>
                <p className="text">Consultez vos <em>tickets</em> ou créez une nouvelle <em>demande</em> ,  ou vous pouvez consulter notre <em>base de connaissances</em> !</p>
            </div>
            <div className ="cards__container">
                {cardsData.map((card) => (
                    <div className="cookieCard">
                    <p className="cookieHeading">{card.heading}</p>
                    <p className="cookieDescription">{card.description}</p>
                    <button className="learn-more" onClick={() => handleClickNavigation(card.heading)}>
                        <span className="circle" aria-hidden="true">
                            <span className="icon arrow"></span>
                        </span>
                        <span className="button-text">savoir plus</span>
                    </button>
                    </div>
                ))}
                </div>
             </div>
       </div>
    </div>
    );
}

export default HomePage;
