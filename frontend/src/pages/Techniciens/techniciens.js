import React, { useState,useEffect } from 'react';
import '../../css/table.css';
import 'boxicons/css/boxicons.min.css';
import searchimg from '../../images/search.png';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { get ,getUserImg } from '../../api/api.service';

function Techniciens() {

    const navigate = useNavigate();
    const [techniciens , setTechniciens] = useState([]);
    const [filteredTechniciens, setFilteredKnowledgeBase] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const getStatusClassName = (status) => {
        switch (status.toLowerCase()) {
            case 'accepter':
                return 'status delivered';
            case 'en attente':
                return 'status pending';
            case 'en cours':
                return 'status shipped';
            case 'refuser':
                return 'status cancelled';
            default:
                return 'status';
        }
    };

    const handleTechnicien = async () => {
        const allTechniciens = await get ('/user/techniciens',Cookies.get('jwt'));
        let techniciensWithImages = [];
        try {
            techniciensWithImages = await Promise.all(
                allTechniciens.map(async (technicien) => {
                    const img = await getUserImg(`/profile/profileImage/${technicien.profileImg}`,Cookies.get('jwt'));
                    return { ...technicien, image: img };
                })
            );
        } catch(e) {
            techniciensWithImages = allTechniciens;
        }
        
        setTechniciens(techniciensWithImages);
        setFilteredKnowledgeBase(techniciensWithImages);
    }

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        filterTechniciens(event.target.value.toLowerCase());
        };
    
    const filterTechniciens = (searchQuery) => {
        if (searchQuery.trim() === '') {
            setTechniciens(filteredTechniciens); 
        } else {
            const filteredItems = techniciens.filter(item =>
                    item.poste.toLowerCase().includes(searchQuery) ||
                    item.department.toLowerCase().includes(searchQuery) ||
                    item.userName.toLowerCase().includes(searchQuery)||
                    item.userLastName.toLowerCase().includes(searchQuery)||
                    item.email.toLowerCase().includes(searchQuery)
                );
                setTechniciens(filteredItems);
            }
        };

    useEffect(() => {
        handleTechnicien();
    }, []);

    const handleClickConsulte = (id) => {
        navigate(`/technicien/${id}`);
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
                    <h1>Techniciens</h1>
                    <div className="input-group-search">
                        <input type="search" placeholder="Search Data..." value={searchInput} onChange={handleSearchInputChange}/>
                        <img src={searchimg} alt=""/>
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
                        {techniciens.map((row) => (
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
    </div> 
    )}
export default Techniciens;