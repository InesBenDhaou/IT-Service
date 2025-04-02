import React, { useState, useEffect } from 'react';
import '../../css/table.css';
import 'boxicons/css/boxicons.min.css';
import searchimg from '../../images/search.png';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/header';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { get, getImg } from '../../api/api.service';
import ConfirmDelete from '../Popups/delete/ConfirmDelete';

function Categories() {

    const navigate = useNavigate();
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [categories, setCategories] = useState([]);

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        filterCategories(event.target.value.toLowerCase());
    };

    const filterCategories = (searchQuery) => {
        if (searchQuery.trim() === '') {
            setCategories(filteredCategories);
        } else {
            const filteredItems = categories.filter(item =>
                item.name.toLowerCase().includes(searchQuery)
            );
            setCategories(filteredItems);
        }
    };

    const handleCategories = async () => {
        const response = await get("/categories", Cookies.get("jwt"));
        const categoriesWithImages = await Promise.all(
            response.map(async (category) => {
                const img = await getImg(
                    `/categories/categoryImage/${category.categoryImg}`
                );
                return { ...category, image: img };
            })
        );
        setCategories(categoriesWithImages);
        setFilteredCategories(categoriesWithImages);
    };

    useEffect(() => {
        handleCategories();
    }, []);

    const handleClickConsulte = (id) => {
        navigate(`/category/${id}/menager/composants`);
    }

    const handleClickDelete = (id) => {
        setDeleteId(id);
        setShowConfirmDelete(true);
    };

    const handleClickCancel = () => {
        setShowConfirmDelete(false);
        setDeleteId(null);
        handleCategories();
    };

    const handleClickAdd = () => {
        navigate('/menager/categories/nouveau');
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
                                <h1>Categories</h1>
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
                                        {categories.map((row) => (
                                            <tr>
                                                <td> {row.id} </td>
                                                <td> <img src={row.image} alt="" /> </td>
                                                <td> {row.name} </td>
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
                <ConfirmDelete id={deleteId} elementType="category" onCancel={handleClickCancel} />
            )}
        </div>
    )
}
export default Categories;