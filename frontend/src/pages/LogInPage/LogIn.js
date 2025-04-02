import './LogIn.css';
import {React,useState ,useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { post } from '../../api/api.service';
import logo from '../../images/logo.png';

function LogIn() {

    const navigate = useNavigate();
    const [currentErrorMessage, setCurrentErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        useremail: '',
        userpassword: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    function formatTime(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
      }

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginTime = formatTime(new Date());
        const user = {
            email: formData.useremail,
            password: formData.userpassword,
        };

        try {
            const LoggedUser = await post('/auth/login', user); 
            console.log(LoggedUser);
            if (LoggedUser.token) {
              Cookies.set('jwt', LoggedUser.token);
              Cookies.set('userRole',LoggedUser.IsValiduser.role);
              Cookies.set('userPoste',LoggedUser.IsValiduser.poste);
              Cookies.set('userId',LoggedUser.IsValiduser.id);
              Cookies.set('loginTime', loginTime);
              navigate('/accueil')
            }
            
        } catch (error) {
            if (error.response && error.response.data.errors) {
                    setCurrentErrorMessage(Object.values(error.response.data.errors)[0]);
            } else {
                   setCurrentErrorMessage("Informations d'identification invalides !");
            }     
        }
    };

    return (
        <div className="login__container">
            <form  onSubmit={handleSubmit} className="form_main">
                <div className='logo' >
                     <img src={logo} />
                     <p>connexion</p>
                 </div>
                <div>
                <div className="inputContainer">
                    <svg className="inputIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2e2e2e" viewBox="0 0 16 16">
                    <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
                    </svg>
                <input type="text" className="inputField" name="useremail" value={formData.useremail} onChange={handleInputChange} placeholder="Email" />
                </div>
        
                <div className="inputContainer">
                    <svg className="inputIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2e2e2e" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                    </svg>
                    <input type="password" className="inputField" name="userpassword" value={formData.userpassword} onChange={handleInputChange} placeholder="Password" />
                </div>        
                <button id="button" type='submit'>Se connecter</button>
                </div>
            </form>
            {currentErrorMessage && (
                <div className="error">
                    <div className="error__icon">
                        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z" fill="#393a37"></path>
                        </svg>
                    </div>
                    <div className="error__title">Erreur : {currentErrorMessage}</div>
                    <div className="error__close" onClick={() => setCurrentErrorMessage('')}>
                        <svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" fill="#393a37"></path>
                        </svg>
                    </div>
                </div>
            )}
        </div> 
    );
  }

  export default LogIn;
