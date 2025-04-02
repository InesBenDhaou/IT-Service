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

function Employes() {

    const navigate = useNavigate();
    const [employes, setEmployes] = useState([]);
    const [filteredEmployes, setFilteredEmployes] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleEmployes = async () => {
        const allEmployes = await get ('/user',Cookies.get('jwt'));
        const employesWithImages = await Promise.all(
            allEmployes.map(async (employe) => {
                const img = await getUserImg(`/profile/profileImage/${employe.profileImg}`,Cookies.get('jwt'));
                return { ...employe, image: img };
            })
        );
        setEmployes(employesWithImages);
        setFilteredEmployes(employesWithImages);
    }

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        filterEmployes(event.target.value.toLowerCase());
        };
    
    const filterEmployes = (searchQuery) => {
        if (searchQuery.trim() === '') {
            setEmployes(filteredEmployes); 
        } else {
        const filteredItems = employes.filter(item =>
                item.poste.toLowerCase().includes(searchQuery) ||
                item.department.toLowerCase().includes(searchQuery) ||
                item.userName.toLowerCase().includes(searchQuery)||
                item.userLastName.toLowerCase().includes(searchQuery)||
                item.email.toLowerCase().includes(searchQuery)
            );
            setEmployes(filteredItems);
        }
        };

    useEffect(() => {
        handleEmployes();
    }, []);

    const handleClickConsulte = (id) => {
        navigate(`/employe/${id}`);
    }
    const handleClickEdit = (id) => {
        navigate(`/employe/${id}/modifier`);
    }
    
    const handleClickDelete = (id) => {
        setDeleteId(id);
        setShowConfirmDelete(true);
    };

    const handleClickCancel = () => {
        setShowConfirmDelete(false);
        setDeleteId(null);
        handleEmployes();
    };

    const handleClickAdd = () => {
        navigate('/employes/nouveau');
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
                    <h1>Employes</h1>
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
                                <th></th>
                                <th> name </th>
                                <th> poste </th>
                                <th> departement </th>
                                <th> email </th>
                                <th> Manage </th>
                            </tr>
                        </thead>
                        <tbody>
                        {employes.map((row) => (
                            <tr>
                                <td> {row.id} </td>
                                <td> <img src={row.image} alt="" /></td>
                                <td> {row.userName}{" "}{row.userLastName} </td>
                                <td> {row.poste}</td>
                                <td> {row.department} </td>
                                <td> {row.email} </td>
                                <td>
                                    <div className='manage__icons__container'>
                                        <i class='bx bx-show manage__icon' onClick={() => handleClickConsulte(row.id)}></i>
                                        <i className='bx bxs-edit-alt manage__icon' onClick={() => handleClickEdit(row.id)} ></i>
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
        <ConfirmDelete id={deleteId} elementType="employé" onCancel={handleClickCancel} />
    )}
    </div> 
    )}
export default Employes;