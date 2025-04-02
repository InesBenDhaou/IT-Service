import { React, useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getOne, update } from '../../api/api.service';

function KnowledgeEdit() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        lien: '',
        categorie: 'Installation',
        type: 'article'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClickAnnuler = () => {
        navigate(-1)
    }

    const handleKnowledgeBase = async (id, type) => {

        const data = await getOne(`/knowledgebase/knowledge/${id}`, Cookies.get('jwt'));
        setFormData({
            title: data.title,
            lien: data.lien,
            categorie: data.categorie,
            type: data.type
        });
    }



    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const section = 'base';

        await update(`/knowledgebase/update/${id}`, formData, Cookies.get('jwt'));
        navigate('/valide');

    }

    useEffect(() => {
        handleKnowledgeBase(id);
    }, []);

    return (
        <div className='table__page__container'>
            <div className='sidebar__container'><SideBar /></div>
            <div className='table__page__content__container'>
                <div><Header /></div>
                <div className='ticketForm__content'>
                    <header>Editer Article/Tuto</header>
                    <form className='form__knowledgeAdd'>
                        <div>
                            <div className="form first">
                                <div className="details personal">
                                    <span className="title">Details</span>
                                    <div className="fields">
                                        <div className="input-field">
                                            <label>titre</label>
                                            <input type="text" placeholder="titre" required name="title" value={formData.title} onChange={handleChange} />
                                        </div>
                                        <div className="input-field">
                                            <label>lien</label>
                                            <textarea placeholder="lien" required name="lien" value={formData.lien} onChange={handleChange}></textarea>
                                        </div>
                                        <div className="input-field-Urgence">
                                            <label>Type</label>
                                            <select required name="type" value={formData.type} disabled>
                                                <option value="article" selected={formData.type === 'article'}>Article</option>
                                                <option value="tuto" selected={formData.type === 'tuto'}>Tuto</option>
                                            </select>
                                        </div>
                                        <div className="input-field-Categorie">
                                            <label>Categorie</label>
                                            <select required name="categorie" value={formData.categorie} onChange={handleChange}>
                                                <option value="Installation" selected={formData.categorie === 'Installation'}>Installation</option>
                                                <option value="Dépannage" selected={formData.categorie === 'Dépannage'}>Dépannage</option>
                                                <option value="Sécurité" selected={formData.categorie === 'Sécurité'}>Sécurité</option>
                                                <option value="Fonctionnalité" selected={formData.categorie === 'Fonctionnalité'}>Fonctionnalité</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="knowledgeadd__buttons">
                                        <button className="nextBtn" onClick={handleFormSubmit} type="button" >
                                            <span className="btnText" >Editer</span>
                                            <i className='bx bx-send'></i>
                                        </button>
                                        <button className="annulerBtn" onClick={handleClickAnnuler} type="button">
                                            <span className="btnText" >annuler</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default KnowledgeEdit;