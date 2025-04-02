import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
function DeskInfo (){
    return (
        <div className='table__page__container'>
            <div className='sidebar__container'><SideBar/></div>
            <div className='table__page__content__container'>
                <div><Header/></div>
                <div className="contactCard">
                    <p className="cookieHeading">Je contact le service desk</p>
                        <div className="contact__info__container">
                            <div className="contact__info"><i className='bx bxs-phone icon'></i><p>33 145 123</p></div>
                            <div className="contact__info"><i className='bx bxs-envelope icon'></i><p>support-technique@gmail.com</p></div>
                            <p>Le service Desk est ouvert de 7h à 21h , du lundi au vendredi</p>
                        </div>
                </div>
                
            </div>
        </div>
    );
}
export default DeskInfo ;