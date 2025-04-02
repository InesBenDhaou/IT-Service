import "./ConfirmDelete.css";
import { del } from "../../../api/api.service";
import Cookies from "js-cookie";
import { useState } from "react";

function ConfirmDelete({ id, elementType, onCancel }) {
  const [error, setError] = useState(null);
   
  const handleDelete = async () => {
    try {
      switch (elementType) {
        case "employé":
          await del(`/user/${id}`, Cookies.get("jwt"));
          onCancel();
          break;
        case "knowledge":
          await del(`/knowledgebase/delete/${id}`, Cookies.get("jwt"));
          onCancel();
          break;
        case "ticket":
          await del(`/ticket/${id}`, Cookies.get("jwt"));
          onCancel();
          break;
        case "demande":
          await del(`/demande/deleteDemande/${id}`, Cookies.get("jwt"));
          onCancel();
          break;
        case "category":
          try {
          await del(`/categories/categoryById/${id}`, Cookies.get("jwt"));
          onCancel();
          } catch (error) {
          if (error.response && error.response.status === 400) {
            setError("Des composants sont attachés à cette catégorie !");
          }
        }
          break;
        case "component" :
          await del(`/components/componentById/${id}`, Cookies.get("jwt"));
          onCancel();
          break;
        case "departement": 
          try {
          await del(`/departments/${id}`, Cookies.get("jwt"));
          onCancel();
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setError("Des postes sont attachés à ce departement !");
          }}
          break;
        case "poste":
          await del(`/postes/${id}`, Cookies.get("jwt"));
          onCancel();
          break;
        default:
          throw new Error("Unknown element type");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError("Vous n'êtes pas autorisé à supprimer cet élément !");
      } else {
        console.error(`Failed to delete ${elementType} with id: ${id}.`, error);
      }
    }
  };
  return (
    <div class="confirmdelete-card">
       <div className="confirmdelete-card-content">
        {error ? (
          <p className="confirmdelete-card-heading">{error}</p>
        ) : (
          <>
            <p className="confirmdelete-card-heading">Supprimer {elementType} ?</p>
            <p className="confirmdelete-card-description">
              voulez-vous vraiment supprimer cette ligne ?
            </p>
          </>
        )}
      </div>
      <div class="confirmdelete-card-button-wrapper">
        <button class="confirmdelete-card-button secondary" onClick={onCancel}>
          Annuler
        </button>
        <button
          class="confirmdelete-card-button primary"
          onClick={handleDelete}
        >
          Supprimer
        </button>
      </div>
      <button class="exit-button" onClick={onCancel}>
        <svg height="20px" viewBox="0 0 384 512">
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
        </svg>
      </button>
    </div>
  );
}

export default ConfirmDelete;
