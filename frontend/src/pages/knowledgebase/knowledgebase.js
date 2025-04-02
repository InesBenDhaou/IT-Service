import React, { useEffect, useState } from "react";
import "./knowledgebase.css";
import "../../css/table.css";
import "boxicons/css/boxicons.min.css";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import searchimg from "../../images/search.png";
import { get, patch } from "../../api/api.service";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "../Popups/delete/ConfirmDelete";

function KnowledgeBase() {
  const [filteredKnowledgeBase, setFilteredKnowledgeBase] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [elementType, setElementType] = useState("");
  const [isPlanificateur, setIsPlanificateur] = useState(false);
  const [isEmploye, setIsEmploye] = useState(false);
  const [isTechnicien, setIsTechnicien] = useState(false);


  const navigate = useNavigate();

  const getCategorieClassName = (categorie) => {
    switch (categorie.toLowerCase()) {
      case "installation":
        return "status cancelled";
      case "dépannage":
        return "status pending";
      case "sécurité":
        return "status shipped";
      case "fonctionnalité":
        return "status delivered";
      default:
        return "status";
    }
  };

  const getTypeClassName = (type) => {
    switch (type.toLowerCase()) {
      case "article":
        return "status delivered";
      case "tuto":
        return "status pending";
      default:
        return "status";
    }
  };

  const handleConfirmedKnowledgeBase = async () => {
    try {
      const knowledges = await get("/knowledgebase/confirmed", Cookies.get("jwt"));
      setKnowledgeBase(knowledges);
      setFilteredKnowledgeBase(knowledges);
    } catch (error) {
      console.error('Error fetching confirmed knowledge base:', error);
    }
  };

  const handleKnowledgeBase = async () => {
    try {
      const knowledges = await get("/knowledgebase", Cookies.get("jwt"));
      setKnowledgeBase(knowledges);
      console.log('knowledges :', knowledges);
      setFilteredKnowledgeBase(knowledges);
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    filterKnowledgeBase(event.target.value.toLowerCase());
  };

  const filterKnowledgeBase = (searchQuery) => {
    if (searchQuery.trim() === "") {
      setKnowledgeBase(filteredKnowledgeBase);
    } else {
      const filteredItems = knowledgeBase.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.categorie.toLowerCase().includes(searchQuery) ||
          item.type.toLowerCase().includes(searchQuery)
      );
      setKnowledgeBase(filteredItems);
    }
  };

  const handleClickDelete = (id) => {
    setDeleteId(id);
    setElementType('knowledge');
    setShowConfirmDelete(true);
  };

  const handleClickCancel = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
    handleKnowledgeBase();
  };

  const handleClickAdd = () => {
    navigate("/basedeconnaissance/nouveau");
  };

  const handleClickConsulte = (id) => {
    navigate(`/basedeconnaissance/${id}`);
  };

  const handleClickEdit = (id) => {
    navigate(`/basedeconnaissance/${id}/modifier`);
  };

  const handleClickAccept = async (id) => {
    try {
      await patch(`/knowledgebase/${id}/confirm`, { isConfirmed: true }, Cookies.get('jwt'));
      handleKnowledgeBase();
    } catch (error) {
      console.error('Error updating isConfirmed:', error);
    }
  };

  useEffect(() => {
    const userRole = Cookies.get("userRole");
    if (userRole === "planificateur") {
      setIsPlanificateur(true);
      handleKnowledgeBase();
    } else if (userRole === "technicien") {
      setIsTechnicien(true);
      handleConfirmedKnowledgeBase();
    } else {
      setIsEmploye(true);
      handleConfirmedKnowledgeBase();
    }
  }, []);


  return (
    <div className="table__page__container">
      <div className='sidebar__container'>
        <SideBar />
      </div>
      <div className="table__page__content__container">
        <div>
          <Header />
        </div>
        <div className="knowldgebase__container">
          <div className="table" id="customers_table">
            <section className="table__header">
              <h1>Base de connaissance</h1>
              <div className="input-group-search">
                <input
                  type="search"
                  placeholder="Search Data..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <img src={searchimg} alt="" />
              </div>
              {!isEmploye && (
                <div>
                  <button
                    title="Add"
                    className="cssbuttons-io-button"
                    onClick={handleClickAdd}
                  >
                    <svg
                      height="25"
                      width="25"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path
                        d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span>Nouveau</span>
                  </button>
                </div>
              )}
            </section>
            <section className="table__body">
              <table>
                <thead>
                  <tr>
                    <th> Id </th>
                    <th> Title </th>
                    <th> Category </th>
                    <th> Type </th>
                    {isPlanificateur &&
                      <th>Manage</th>}
                  </tr>
                </thead>
                <tbody>
                  {knowledgeBase.map((row) => (
                    <tr key={row.id}>
                      <td> {row.id} </td>
                      <td>
                        <a href={row.lien}>{row.title}</a>
                      </td>
                      <td>
                        <p className={getCategorieClassName(row.categorie)}>
                          {row.categorie}
                        </p>
                      </td>
                      <td>
                        <p className={getTypeClassName(row.type)}>{row.type}</p>
                      </td>
                      {isPlanificateur && row.isConfirmed === true && (
                        <td>
                          <div className="manage__icons__container">
                            <i
                              class='bx bx-show manage__icon'
                              onClick={() =>
                                handleClickConsulte(row.id)}

                            ></i>
                            <i
                              className="bx bxs-edit-alt manage__icon"
                              onClick={() =>
                                handleClickEdit(row.id)}
                            ></i>
                            <i
                              class='bx bx-trash manage__icon'
                              onClick={() =>
                                handleClickDelete(row.id)
                              }
                            ></i>
                          </div>
                        </td>
                      )}
                      {isPlanificateur && row.isConfirmed === false && (
                        <td>
                          <div className="manage__icons__container">
                            <i
                              class='bx bx-show manage__icon'
                              onClick={() =>
                                handleClickConsulte(row.id)}

                            ></i>
                            <i
                              className="bx bxs-check-circle accept__icon"
                              onClick={() =>
                                handleClickAccept(row.id)
                              }
                            ></i>
                            <i
                              className="bx bxs-no-entry refuse__icon"
                              onClick={() =>
                                handleClickDelete(row.id)
                              }
                            ></i>
                          </div>
                        </td>
                      )}




                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </div>
      {showConfirmDelete && (
        <ConfirmDelete
          id={deleteId}
          elementType={elementType}
          onCancel={handleClickCancel}
        />
      )}
    </div>
  );
}

export default KnowledgeBase;
