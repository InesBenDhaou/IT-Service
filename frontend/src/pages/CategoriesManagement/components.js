import React, { useState, useEffect } from 'react';
import '../../css/table.css';
import 'boxicons/css/boxicons.min.css';
import searchimg from '../../images/search.png';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { get, getComponentImg } from '../../api/api.service';
import ConfirmDelete from '../Popups/delete/ConfirmDelete';

function Components() {

    const navigate = useNavigate();
    const {id} = useParams();
    const [filteredComponents, setFilteredComponents] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    
    const [components ,setComponents] = useState([])

    const handleComponents = async () => {
        const allcomponents = await get (`/categories/${id}/components`,Cookies.get('jwt'));
        const componentsWithImages = await Promise.all(
            allcomponents.map(async (component) => {
                const img = await getComponentImg(`/components/componentImage/${component.componentImg}`);
                return { ...component, image: img };
            })
        );
        setComponents(componentsWithImages);
        setFilteredComponents(componentsWithImages);
    }

    useEffect(() => {
        handleComponents();
    }, []);


    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        filterComponents(event.target.value.toLowerCase());
    };

    const filterComponents = (searchQuery) => {
        if (searchQuery.trim() === '') {
            setComponents(filteredComponents);
        } else {
            const filteredItems = components.filter(item =>
                item.name.toLowerCase().includes(searchQuery)
            );
            setComponents(filteredItems);
        }
    };

    const handleClickDelete = (id) => {
        setDeleteId(id);
        setShowConfirmDelete(true);
    };

    const handleClickCancel = () => {
        setShowConfirmDelete(false);
        setDeleteId(null);
        handleComponents();
    };

    const handleClickAdd = () => {
        navigate(`/category/${id}/nouveau/composant`);
    }

    const handleClickEdit = (idComponent) => {
        navigate(`/category/${id}/editer/composant/${idComponent}`);
    }

    const handleClickAnnuler = () => {
        navigate(-1);
    }

    return (
        <div className='table__page__container'>
            <div className='sidebar__container'><SideBar /></div>
            <div className='table__page__content__container'>
                <div><Header /></div>
                <div className='requests__container'>
                    <div className='requests__container'>
                        <div className="table" id="customers_table">
                            <section className="table__header">
                                <h1>Components</h1>
                                <div className="input-group-search">
                                    <input type="search" placeholder="Search Data..." value={searchInput} onChange={handleSearchInputChange} />
                                    <img src={searchimg} alt="" />
                                </div>
                                <div >
                                    <button title="Add" class="cssbuttons-io-button" onClick={handleClickAdd}>
                                        <svg height="25" width="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor"></path></svg>
                                        <span>Nouveau</span>
                                    </button>
                                </div>
                            </section>
                            <section className="table__body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th> Id </th>
                                            <th></th>
                                            <th> Nom </th>
                                            <th> Ménager </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {components.map((row) => (
                                            <tr>
                                                <td> {row.id} </td>
                                                <td> <img src={row.image} alt="" /> </td>
                                                <td> {row.name} </td>
                                                <td>
                                                    <div className='manage__icons__container'>
                                                        <i class='bx bx-trash manage__icon' onClick={() => handleClickDelete(row.id)}></i>
                                                        <i className='bx bxs-edit-alt manage__icon' onClick={() => handleClickEdit(row.id)} ></i>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        </div>
                    </div>
                </div>
                <button className="annulerBtn" onClick={handleClickAnnuler} type='button'>
                    <span className="btnText" >Retour</span>
            </button>
            </div>
            {showConfirmDelete && (
                <ConfirmDelete id={deleteId} elementType="component" onCancel={handleClickCancel} />
            )}
        </div>
    )
}
export default Components;