import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import { useLocation ,useNavigate } from 'react-router-dom';


function Demo() {
    const location = useLocation();
    const videoSrc = location.state?.videoSrc; 
    console.log("videoSrc :",videoSrc);
    const navigate = useNavigate();
    const handleClickRetour = () => {
        navigate(-1);
    }
    return (
        <div className='table__page__container'>
            <div className='sidebar__container'><SideBar/></div>
            <div className='table__page__content__container'>
                <div><Header /></div>
                <div className="vedio__container">
                    <video controls className="vedio"  >
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                </div>
                
                <button className="annulerBtn">
                    <span className="btnText" onClick={handleClickRetour}>retour</span>
                </button>
            </div>
        </div>
    );
}

export default Demo;
