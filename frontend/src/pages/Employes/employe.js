import {React , useState ,useEffect } from 'react';
import '../../css/form.css';
import '../Techniciens/technicien.css';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { getOne , getUserImg} from '../../api/api.service';
import Cookies from 'js-cookie';
import { useNavigate ,useParams } from 'react-router-dom';


function Employe() {

    const {id} = useParams();
    const [employe,setEmploye] = useState('');
    const [urlImg , setUrlImg] = useState ('');
    const [name , setName] = useState('');
    const navigate = useNavigate();

    const handleEmploye = async () => {
        const emp = await getOne (`/user/${id}/detailsUser`,Cookies.get('jwt'));
        console.log ("manager : ",emp.contactManager);
        setEmploye(emp);
        const imgUrl = await getUserImg(`/profile/profileImage/${emp.profileImg}`, Cookies.get('jwt'));
        setUrlImg(imgUrl);
        const name = emp.userName+" "+emp.userLastName;
        setName(name)
    }

    const handleClickAnnuler = () => {
        navigate(-1)
    }

    useEffect(() => {
        handleEmploye();
    }, []);

return (
<div className='table__page__container'>
        <div className='sidebar__container'><SideBar/></div>
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
                                                <label>Nom et Prénom</label>
                                                <input type="text" placeholder="name" value={name} disabled  />
                                            </div>
                                            <div className="input-field-benif">
                                                <label>Localisation</label>
                                                <input type="text" placeholder="name" value={employe.localisation}  disabled />
                                            </div>
                                        </div>
                                        <div className='part2__details'>
                                            <div className="input-field">
                                                <label>Depatement</label>
                                                <input type="text" placeholder="lastname" value={employe.department} disabled/>
                                            </div>
                                            <div className="input-field-benif">
                                                <label>Poste</label>
                                                <input type="text" placeholder="lastname" value={employe.poste} disabled/>
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
                                    <input type="text" placeholder="nom et prenom" value={employe.email}  disabled/>
                                </div>
                                <div className="input-field">
                                    <label>NumTel</label>
                                    <input type="text" placeholder="mail" value={employe.numTel}  disabled />
                                </div>
                                <div className="input-field">
                                    <label>Contact Manager</label>
                                    <input type="text" placeholder="mail" value={employe.contactManager}  disabled />
                                </div>
                            </div>
                        </div>
                
                        <div className="buttons">
                            <button className="annulerBtn" onClick={handleClickAnnuler} type='button'>
                                <span className="btnText" >annuler</span>
                            </button>
                        </div>
                    </div> 
                </form>
            </div>
        </div>
    </div>
)}
export default Employe ;