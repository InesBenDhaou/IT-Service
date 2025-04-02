import React, { useEffect, useState } from "react";
import "../../css/table.css";
import "boxicons/css/boxicons.min.css";
import searchimg from "../../images/search.png";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/header";
import { useNavigate } from "react-router-dom";
import { get } from "../../api/api.service";
import Cookies from "js-cookie";
import { format } from "date-fns";
import ConfirmDelete from "../Popups/delete/ConfirmDelete";

function Ticket() {
  const navigate = useNavigate();
  const [Tickets, setTickets] = useState([]);
  const [isPlanificateur, setIsPlanificateur] = useState(false);
  const [isEmploye, setIsEmploye] = useState(false);
  const [isTechnicien, setIsTechnicien] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const handleCheckboxChange = async () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      await handleTicketsEmploye();
    } else {
      await handleTechnicienTickets();
    }
  };

  const getStatusClassName = (status) => {
    switch (status.toLowerCase()) {
      case "résolu":
        return "status delivered";
      case "en attente":
        return "status pending";
      case "en cours":
        return "status shipped";
      case "clôturé":
        return "status cancelled";
      default:
        return "status";
    }
  };

  //returns the tickets based on the role of the user
  const handleTicketsPlanificateur = async () => {
    const getAllTickets = await get("/ticket", Cookies.get("jwt"));
    setTickets(getAllTickets);
    setFilteredTickets(getAllTickets);
  };

  const handleTicketsEmploye = async () => {
    const getAllTickets = await get("/ticket/mesTickets", Cookies.get("jwt"));
    setTickets(getAllTickets);
    setFilteredTickets(getAllTickets);
  };

  const handleTechnicienTickets = async () => {
    const allTicketsAssigned = await get("/ticket/mesTicketsAssigner",Cookies.get("jwt"));
    const allHisTickets = await get("/ticket/mesTickets",Cookies.get("jwt"));
    const combinedTickets = [...allTicketsAssigned, ...allHisTickets];
    setTickets(combinedTickets);
    setFilteredTickets(combinedTickets);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    filterTickets(event.target.value.toLowerCase());
  };

  const filterTickets = (searchQuery) => {
    if (searchQuery.trim() === '') {
        setTickets(filteredTickets); 
    } else {
    const filteredItems = Tickets.filter(item =>
            item.titre.toLowerCase().includes(searchQuery) ||
            item.BenificierTicket.toLowerCase().includes(searchQuery) ||
            item.status.toLowerCase().includes(searchQuery)
        );
        setTickets(filteredItems);
    }
    };

  useEffect(() => {
    const userRole = Cookies.get("userRole"); // Example: Get user role from cookie
    if (userRole === "admin" || userRole === "employe") {
      setIsEmploye(true);
      handleTicketsEmploye();
    }
    if (userRole === "planificateur") {
      setIsPlanificateur(true);
      handleTicketsPlanificateur();
    }
    if (userRole === "technicien") {
      setIsTechnicien(true);
      handleTechnicienTickets();
    }
  }, []);

  const handleClickNew = () => {
    navigate("/tickets/nouveau");
  };

  const handleClickEdit = (id,benificierTicket) => {
    navigate(`/tickets/${benificierTicket}/${id}/modifier`);
  };

  const handleClickConsulte = (id) => {
    navigate(`/ticket/${id}`);
  };

  const handleClickDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleClickCancel = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
    if (isEmploye) {
      handleTicketsEmploye();
    } else if (isTechnicien) {
      if (isChecked) {
        handleTicketsEmploye();
      } else {
        handleTechnicienTickets();
      }
    } else if (isPlanificateur) {
      handleTicketsPlanificateur();
    }
  };

  return (
    <div className="table__page__container">
      <div className='sidebar__container'>
        <SideBar />
      </div>
      <div className="table__page__content__container">
        <div>
          <Header />
        </div>
        <div className="tickets__container">
          <div className="table" id="customers_table">
            <section className="table__header">
              <div className="table__title">
                <h1>Tickets</h1>
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
                <input type="search" placeholder="Search Data..." value={searchInput} onChange={handleSearchInputChange}/>
                <img src={searchimg} alt="" />
              </div>
              <div>
                <button
                  title="Add"
                  class="cssbuttons-io-button"
                  onClick={handleClickNew}
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
                    <th> Titre </th>
                    <th> Benificier </th>
                    <th> Créer le </th>
                    <th> Status </th>
                    <th> Ménager </th>
                  </tr>
                </thead>
                <tbody>
                  {Tickets.map((row) => (
                    <tr>
                      <td> {row.id} </td>
                      <td> {row.titre}</td>
                      <td> {row.BenificierTicket} </td>
                      <td>
                        {" "}{format(new Date(row.dateCreation),"dd MMMM yyyy à HH:mm:ss")}{" "}
                      </td>
                      <td>
                        <p className={getStatusClassName(row.status)}>
                          {row.status}
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
                            onClick={() => handleClickEdit(row.id,row.emailBenificierTicket)}
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
          elementType="ticket"
          onCancel={handleClickCancel}
        />
      )}
    </div>
  );
}

export default Ticket;
