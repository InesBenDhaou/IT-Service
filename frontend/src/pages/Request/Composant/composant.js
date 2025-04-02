import React, { useState,useEffect } from 'react';
import './composant.css';
import 'boxicons/css/boxicons.min.css';
import SideBar from '../../SideBar/SideBar';
import Header from '../../Header/header';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { get, getComponentImg } from  '../../../api/api.service';
import Cookies from 'js-cookie';

function Composant() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [components ,setComponents] = useState([])

    const handleComponents = async () => {
        try {
            const allcomponents = await get(`/categories/${id}/components`, Cookies.get('jwt'));
            const componentsWithImages = await Promise.all(
                allcomponents.map(async (component) => {
                    console.log('Component Description:', component.description); // Log the description
                    
                    const img = await getComponentImg(`/components/componentImage/${component.componentImg}`);
                    return { ...component, image: img };
                })
            );
            setComponents(componentsWithImages);
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    };
    useEffect(() => {
        handleComponents();
    }, []);


    const handleClickAnnuler =() => {
        navigate(-1)
    }

    const handleClickPasserDemande =(id,idComponent) => {
        navigate(`/demande/nouveau/category/${id}/composant/${idComponent}`)
    }


    return (
    
    <div className='table__page__container'>
        <div className='sidebar__container'><SideBar/></div>
        <div className='table__page__content__container'>
            <div><Header /></div>
            <div className='composants__container'>
                <div className='header'>Nouveau Demande</div>
                <div className='card__composant__container'>
                {components.map((component) => (
                    <div className="card__composant">
                        <div className="card-border-top"></div>
                        <div className="img"><img src={component.image} /></div>
                        <span> {component.name} </span>
                        <div className="description" dangerouslySetInnerHTML={{ __html: component.description }} />
                        <button onClick={() => handleClickPasserDemande(id,component.id)}>Passer Demande</button>
                    </div>
            ))}
                </div>
                <button className="annulerBtn" onClick={handleClickAnnuler} type='button'>Annuler</button>
            </div>
        </div>
    </div>
    )}
export default  Composant ;   