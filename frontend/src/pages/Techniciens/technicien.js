import {React , useState ,useEffect } from 'react';
import '../../css/form.css';
import './technicien.css';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { getOne , getUserImg} from '../../api/api.service';
import Cookies from 'js-cookie';
import { useNavigate ,useParams } from 'react-router-dom';


function Technicien() {

    const {id} = useParams();
    const [technicien,setTechnicien] = useState('');
    const [urlImg , setUrlImg] = useState ('');
    const [name , setName] = useState('');
    const navigate = useNavigate();

    const handleTechnicien = async () => {
        const tec = await getOne (`/user/${id}/detailsUser`,Cookies.get('jwt'))
        setTechnicien(tec);
        const imgUrl = await getUserImg(`/profile/profileImage/${tec.profileImg}`, Cookies.get('jwt'));
        setUrlImg(imgUrl);
        const name = tec.userName+" "+tec.userLastName;
        setName(name)
    }

    const handleClickAnnuler = () => {
        navigate(-1)
    }

    useEffect(() => {
        handleTechnicien();
    }, []);

return (
<div className='table__page__container'>
        <div className='sidebar__container'><SideBar/></div>
        <div className='table__page__content__container'>
            <div><Header /></div>
            <div className='ticketForm__content'>
                <header>Technicien</header>
                <form >
                    <div className="form first">
                        <div className="details personal">
                            <span className="title">Technicien Details</span>
                            <div className="fields">
                                <div className='details__conatiner'>
                                    <div className="input-field-id">
                                        <img src={urlImg} alt="" />
                                    </div>
                                    <div className='part__details'>
                                        <div className='part1__details'>
                                            <div className="input-field-benif">
                                                <label>Nom et Prénom</label>
                                                <input type="text" placeholder="name" value={name} disabled />
                                            </div>
                                            <div className="input-field-benif">
                                                <label>Localisation</label>
                                                <input type="text" placeholder="name" value={technicien.localisation}  disabled />
                                            </div>
                                        </div>
                                        <div className='part2__details'>
                                            <div className="input-field">
                                                <label>Depatement</label>
                                                <input type="text" placeholder="lastname" value={technicien.department} disabled/>
                                            </div>
                                            <div className="input-field-benif">
                                                <label>Poste</label>
                                                <input type="text" placeholder="lastname" value={technicien.poste} disabled/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>    
                        </div>  
                        <div className="details ID">
                            <span className="title">Contact Details</span>
                            <div className="fields">
                                <div className="input-field">
                                    <label>Email</label>
                                    <input type="text" placeholder="nom et prenom" value={technicien.email}  disabled/>
                                </div>
                                <div className="input-field-benif">
                                    <label>NumTel</label>
                                    <input type="text" placeholder="mail" value={technicien.numTel}  disabled />
                                </div>
                                <div className="input-field">
                                    <label>Contact Manager</label>
                                    <input type="text" placeholder="mail" value={technicien.contactManager}  disabled />
                                </div>
                            </div>
                        </div>
                
                        <div className="buttons">
                            <button className="annulerBtn" onClick={handleClickAnnuler} type="button">
                                <span className="btnText">annuler</span>
                            </button>
                        </div>
                    </div> 
                </form>
            </div>
        </div>
    </div>
)}
export default Technicien ;