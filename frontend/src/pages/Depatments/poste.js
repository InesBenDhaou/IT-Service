import React, { useState,useEffect } from 'react';
import '../../css/table.css';
import 'boxicons/css/boxicons.min.css';
import searchimg from '../../images/search.png';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { useNavigate ,useParams} from 'react-router-dom';
import Cookies from 'js-cookie';
import { get } from '../../api/api.service';
import ConfirmDelete from '../Popups/delete/ConfirmDelete';

function Postes() {

    const navigate = useNavigate();
    const {id} = useParams();
    const [postes, setPostes] = useState([]);
    const [filteredPostes, setFilteredPostes] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleallPostes = async () => {
        const allPostes = await get (`/departments/${id}/postes`,Cookies.get('jwt'));
        setPostes(allPostes);
        setFilteredPostes(allPostes);
    }

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        filterPostes(event.target.value.toLowerCase());
        };
    
    const filterPostes = (searchQuery) => {
        if (searchQuery.trim() === '') {
            setPostes(filteredPostes); 
        } else {
        const filteredItems = postes.filter(item =>
                item.nom.toLowerCase().includes(searchQuery)
            );
            setPostes(filteredItems);
        }
        };

    useEffect(() => {
        handleallPostes();
    }, []);

    
    const handleClickDelete = (id) => {
        setDeleteId(id);
        setShowConfirmDelete(true);
    };

    const handleClickCancel = () => {
        setShowConfirmDelete(false);
        setDeleteId(null);
        handleallPostes();
    };

    const handleClickAdd = () => {
        navigate(`/departement/${id}/nouveau/poste`);
    }
   
    const handleClickAnnuler = () => {
        navigate(-1);
    }
    return (
    <div className='table__page__container'>
        <div className='sidebar__container'><SideBar/></div>
        <div className='table__page__content__container'>
            <div><Header /></div>
            <div className='requests__container'>
            <div className='requests__container'>
                <div className="table" id="customers_table">
                <section className="table__header">
                    <h1>Postes</h1>
                    <div className="input-group-search">
                        <input type="search" placeholder="Search Data..." value={searchInput} onChange={handleSearchInputChange}/>
                        <img src={searchimg} alt=""/>
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
                                <th> Nom </th>
                                <th> Ménager </th>
                            </tr>
                        </thead>
                        <tbody>
                        {postes.map((row) => (
                            <tr>
                                <td> {row.id} </td>
                                <td> {row.nom} </td>
                                <td>
                                    <div className='manage__icons__container'>
                                        <i class='bx bx-trash manage__icon' onClick={() => handleClickDelete(row.id)}></i>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
             </div>
             </div>
             <button className="annulerBtn" onClick={handleClickAnnuler} type='button'>
                        <span className="btnText" >Retour</span>
            </button>
        </div>
    </div>  
    {showConfirmDelete && (
        <ConfirmDelete id={deleteId} elementType="poste" onCancel={handleClickCancel} />
    )}
    </div> 
    )}
export default Postes;