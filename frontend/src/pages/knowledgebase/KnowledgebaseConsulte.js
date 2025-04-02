import { React, useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getOne } from '../../api/api.service';
import { format } from "date-fns";

function KnowledgeConsulte() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        lien: '',
        categorie: 'Installation',
        créele: '',
        type: ''
    });

    const handleClickAnnuler = () => {
        navigate(-1)
    }

    const handleKnowledgeBase = async (id) => {

        const data = await getOne(`/knowledgebase/knowledge/${id}`, Cookies.get('jwt'));
        setFormData({
            title: data.title,
            lien: data.lien,
            categorie: data.categorie,
            créele: data.added_at,
            type: data.type
        });
    }

    const formattedDate = formData.créele
        ? format(new Date(formData.créele), 'yyyy-MM-dd\'T\'HH:mm')
        : '';

    useEffect(() => {
        handleKnowledgeBase(id);
    }, []);

    return (
        <div className='table__page__container'>
            <div className='sidebar__container'><SideBar /></div>
            <div className='table__page__content__container'>
                <div><Header /></div>
                <div className='ticketForm__content'>
                    <header>Consulter Article/Tuto</header>
                    <form className='form__knowledgeAdd'>
                        <div>
                            <div className="form first">
                                <div className="details personal">
                                    <span className="title">Details</span>
                                    <div className="fields">
                                        <div className="input-field">
                                            <label>titre</label>
                                            <input type="text" placeholder="titre" required name="title" value={formData.title} disabled />
                                        </div>
                                        <div className="input-field">
                                            <label>lien</label>
                                            <textarea placeholder="lien" required name="lien" value={formData.lien} disabled></textarea>
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
                                            <select required name="categorie" value={formData.categorie} disabled>
                                                <option value="Installation" selected={formData.categorie === 'Installation'}>Installation</option>
                                                <option value="Dépannage" selected={formData.categorie === 'Dépannage'}>Dépannage</option>
                                                <option value="Sécurité" selected={formData.categorie === 'Sécurité'}>Sécurité</option>
                                                <option value="Fonctionnalité" selected={formData.categorie === 'Fonctionnalité'}>Fonctionnalité</option>
                                            </select>
                                        </div>
                                        <div className="input-field-benif">
                                            <label>Ajouter le</label>
                                            <input type="datetime-local" disabled value={formattedDate} />
                                        </div>
                                    </div>
                                    <div className="knowledgeadd__buttons">
                                        <button className="annulerBtn" onClick={handleClickAnnuler} type="button" >
                                            <span className="btnText">annuler</span>
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

export default KnowledgeConsulte;