import React, { useState,useEffect } from 'react';
import '../../css/table.css';
import 'boxicons/css/boxicons.min.css';
import searchimg from '../../images/search.png';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { get ,getUserImg} from '../../api/api.service';
import ConfirmDelete from '../Popups/delete/ConfirmDelete';

function Departments() {

    const navigate = useNavigate();
    const [departements, setDepartements] = useState([]);
    const [filteredDepartements, setFilteredDepartements] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleallDepartements = async () => {
        const allDepartements = await get ('/departments',Cookies.get('jwt'));
        setDepartements(allDepartements);
        setFilteredDepartements(allDepartements);
    }

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        filterDepartements(event.target.value.toLowerCase());
        };
    
    const filterDepartements = (searchQuery) => {
        if (searchQuery.trim() === '') {
            setDepartements(filteredDepartements); 
        } else {
        const filteredItems = departements.filter(item =>
                item.nom.toLowerCase().includes(searchQuery)
            );
            setDepartements(filteredItems);
        }
        };

    useEffect(() => {
        handleallDepartements();
    }, []);

    const handleClickConsulte = (id) => {
        navigate(`/departement/${id}/postes`);
    }
   
    const handleClickDelete = (id) => {
        setDeleteId(id);
        setShowConfirmDelete(true);
    };

    const handleClickCancel = () => {
        setShowConfirmDelete(false);
        setDeleteId(null);
        handleallDepartements();
    };

    const handleClickAdd = () => {
        navigate('/departement/nouveau');
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
                    <h1>Departements</h1>
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
                        {departements.map((row) => (
                            <tr>
                                <td> {row.id} </td>
                                <td> {row.nom} </td>
                                <td>
                                    <div className='manage__icons__container'>
                                        <i class='bx bx-show manage__icon' onClick={() => handleClickConsulte(row.id)}></i>
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
        </div>
    </div>  
    {showConfirmDelete && (
        <ConfirmDelete id={deleteId} elementType="departement" onCancel={handleClickCancel} />
    )}
    </div> 
    )}
export default Departments;