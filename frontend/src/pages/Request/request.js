import React, { useState, useEffect } from "react";
import "../../css/table.css";
import "boxicons/css/boxicons.min.css";
import searchimg from "../../images/search.png";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import { useNavigate } from "react-router-dom";
import {  get } from "../../api/api.service";
import Cookies from "js-cookie";
import { format } from "date-fns";
import ConfirmDelete from "../Popups/delete/ConfirmDelete";

function Request() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isTechnicien, setIsTechnicien] = useState(false);
  const [isPlanificateur, setIsPlanificateur] = useState(false);
  const [isEmploye, setIsEmploye] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const handleCheckboxChange = async () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      await handleMyRequests();
    } else {
      await handleTechnicienRequests();
    }
  };

  const getStatusClassName = (status) => {
    switch (status.toLowerCase()) {
      case "accepter":
        return "status delivered";
      case "en attente":
        return "status pending";
      case "en cours":
        return "status shipped";
      case "refuser":
        return "status cancelled";
      default:
        return "status";
    }
  };

  const handleRequests = async () => {
    const allRequests = await get("/demande", Cookies.get("jwt"));
    setRequests(allRequests);
    setFilteredRequests(allRequests);
  };

  const handleMyRequests = async () => {
    const allRequests = await get("/demande/mesDemandes", Cookies.get("jwt"));
    setRequests(allRequests);
    setFilteredRequests(allRequests);
  };

  const handleTechnicienRequests = async () => {
    const allRequestsAssigned = await get("/demande/mesDemandesAssigner",Cookies.get("jwt"));
    const allMyRequests = await get("/demande/mesDemandes",Cookies.get("jwt"));
    const combinedRequests = [...allRequestsAssigned, ...allMyRequests];
    setRequests(combinedRequests);
    setFilteredRequests(combinedRequests);
  };

  const handleClickEdit = async (id) => {
    navigate(`/demande/${id}/modifier`);
  };

  const handleClickDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleClickCancel = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
    handleRequests();

  };
  const handleClickConsulte = (id) => {
    navigate(`/demande/${id}`);
  };

  const handleClickCategorie = () => {
    navigate("/categories");
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    filterRequests(event.target.value.toLowerCase());
  };

  const filterRequests = (searchQuery) => {
    if (searchQuery.trim() === '') {
        setRequests(filteredRequests); 
    } else {
    const filteredItems = requests.filter(item =>
            item.composant.toLowerCase().includes(searchQuery) ||
            item.categorie.toLowerCase().includes(searchQuery) ||
            item.BenificierDemande.toLowerCase().includes(searchQuery)||
            item.statusDemande.toLowerCase().includes(searchQuery)
        );
        setRequests(filteredItems);
    }
    };

  useEffect(() => {
    const userRole = Cookies.get("userRole"); // Example: Get user role from cookie
    if (userRole === "admin" || userRole == "employe") {
      setIsEmploye(true);
      handleMyRequests();
    }
    if (userRole === "technicien") {
      setIsTechnicien(true);
      handleTechnicienRequests();
    }
    if (userRole === "planificateur") {
      setIsPlanificateur(true);
      handleRequests();
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
        <div className="requests__container">
          <div className="table" id="customers_table">
            <section className="table__header">
              <div className="table__title">
                <h1>Demandes</h1>
                {isTechnicien && (
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <span className="checkmark"></span>
                  </label>
                )}
              </div>
              <div className="input-group-search">
                <input type="search" placeholder="Search Data..." value={searchInput} onChange={handleSearchInputChange} />
                <img src={searchimg} alt="" />
              </div>
              <div>
                <button
                  title="Add"
                  class="cssbuttons-io-button"
                  onClick={handleClickCategorie}
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
            </section>
            <section className="table__body">
              <table>
                <thead>
                  <tr>
                    <th> Id </th>
                    <th> Composant </th>
                    <th> Category </th>
                    <th> Benificer Demande </th>
                    <th> Créer le </th>
                    <th> Status </th>
                    <th> Manage </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((row) => (
                    <tr>
                      <td> {row.id} </td>
                      <td> {row.composant} </td>
                      <td> {row.categorie}</td>
                      <td> {row.BenificierDemande} </td>
                      <td>
                        {" "}
                        {format(
                          new Date(row.dateDemande),
                          "dd MMMM yyyy à HH:mm:ss"
                        )}{" "}
                      </td>
                      <td>
                        <p className={getStatusClassName(row.statusDemande)}>
                          {row.statusDemande}
                        </p>
                      </td>
                      <td>
                        <div className="manage__icons__container">
                          <i
                            class='bx bx-show manage__icon'
                            onClick={() => handleClickConsulte(row.id)}
                          ></i>
                          <i
                            className="bx bxs-edit-alt manage__icon"
                            onClick={() => handleClickEdit(row.id)}
                          ></i>
                          <i
                            class='bx bx-trash manage__icon'
                            onClick={() => handleClickDelete(row.id)}
                          ></i>
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
      {showConfirmDelete && (
        <ConfirmDelete
          id={deleteId}
          elementType="demande"
          onCancel={handleClickCancel}
        />
      )}
    </div>
  );
}

export default Request;
