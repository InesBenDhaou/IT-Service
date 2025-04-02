import {Navigate, Outlet, useRoutes} from "react-router-dom";
import {lazy} from "react";
import LogIn from "../pages/LogInPage/LogIn";
import HomePage from "../pages/HomePage/homepage";
import Ticket from "../pages/Ticket/ticket";
import Request from "../pages/Request/request";
import TicketCreate from "../pages/Ticket/ticketCreate";
import Categorie from "../pages/Request/Category/categorie";
import KnowledgeBase from "../pages/knowledgebase/knowledgebase";
import TicketEdit from "../pages/Ticket/ticketEdit";
import TicketConsulte from "../pages/Ticket/ticketConsulte";
import Valide from "../pages/Popups/valid/valide";
import NotValide from "../pages/Popups/valid/notvalide";
import Composant from "../pages/Request/Composant/composant";
import RequestCreate from "../pages/Request/requestCreate";
import Help from "../pages/Help/help";
import RequestConsulte from "../pages/Request/requestConsulte";
import RequestEdit from "../pages/Request/requestEdit";
import KnowledgeBaseAdd from "../pages/knowledgebase/KnowledgebaseAdd";
import Techniciens from "../pages/Techniciens/techniciens";
import Technicien from "../pages/Techniciens/technicien";
import Employes from "../pages/Employes/employes";
import Employe from "../pages/Employes/employe";
import EmployeCreate from "../pages/Employes/employeCreate";
import EmployeEdit from "../pages/Employes/employeEdit";
import KnowledgeConsulte from "../pages/knowledgebase/KnowledgebaseConsulte";
import KnowledgeEdit from "../pages/knowledgebase/KnowledgebaseEdit";
import DeskInfo from "../pages/Help/desk";
import Demo from "../pages/Help/demo";
import Submission from "../pages/Popups/submission/submission";
import Profile from "../pages/Profile/profile";
import Departments from "../pages/Depatments/department";
import Postes from "../pages/Depatments/poste";
import DepartementCreate from "../pages/Depatments/departmentCreate";
import PosteCreate from "../pages/Depatments/posteCreate";
import Categories from "../pages/CategoriesManagement/categories";
import Components from "../pages/CategoriesManagement/components";
import CategoryCreate from "../pages/CategoriesManagement/categoryCreate";
import ComponentCreate from "../pages/CategoriesManagement/componentCreate";
import ComponentEdit from "../pages/CategoriesManagement/componentEdit";

export default function Router() {
    return useRoutes([
        {
            path: 'login',
            element: <LogIn />,
        },
        {
            path: 'accueil',
            element: <HomePage />,
        }, 
        {
            path:'profile',
            element : <Profile />
        },
        {
            path:'techniciens',
            element : <Techniciens />
        },
        {
            path:'technicien/:id',
            element : <Technicien />
        },
        {
            path:'departements',
            element : <Departments />
        },
        {
            path:'departements',
            element : <Departments />
        },
        {
            path:'/departement/nouveau',
            element : <DepartementCreate />
        },
        {
            path:'/departement/:id/postes',
            element : <Postes />
        },
        {
            path:'/departement/:id/nouveau/poste',
            element : <PosteCreate />
        },
        {
            path:'employes',
            element : <Employes />
        },
        {
            path:'employe/:id',
            element : <Employe />
        },
        {
            path:'employes/nouveau',
            element : <EmployeCreate />
        },
        {
            path:'employe/:id/modifier',
            element : <EmployeEdit/>
        },
        {
            path:'tickets',
            element : <Ticket />
        },
        {
            path:'tickets/nouveau',
            element : <TicketCreate />
        },
        {
            path:'tickets/:benificierTicket/:id/modifier',
            element : <TicketEdit />
        },
        {
            path:'ticket/:id',
            element : <TicketConsulte />
        },
        {
            path:'valide',
            element : <Valide />
        },
        {
            path:'submission',
            element : <Submission />
        },
        {
            path:'nonvalide',
            element : <NotValide />
        },
        {
            path:'categories',
            element : <Categorie />
        },
        {
            path:'menager/categories',
            element : <Categories />
        },
        {
            path:'menager/categories/nouveau',
            element : <CategoryCreate />
        },
        {
            path:'composants/:id',
            element : <Composant />
        },
        {
            path:'category/:id/nouveau/composant',
            element : <ComponentCreate />
        },
        {
            path:'category/:id/editer/composant/:idComponent',
            element : <ComponentEdit />
        },
       
        {
            path:'category/:id/menager/composants',
            element : <Components />
        },
        {
            path:'demandes',
            element : <Request />
        },
        {
            path:'demande/nouveau/category/:id/composant/:idComponent',
            element : <RequestCreate />
        },
        {
            path:'demande/:id',
            element : <RequestConsulte />
        },
        {
            path:'demande/:id/modifier',
            element : <RequestEdit />
        },
        {
            path:'basedeconnaissance',
            element : <KnowledgeBase />
        },
        {
            path:'basedeconnaissance/nouveau',
            element : <KnowledgeBaseAdd />
        },
        {
            path:'basedeconnaissance/:id',
            element : <KnowledgeConsulte />
        },
        {
            path:'basedeconnaissance/:id/modifier',
            element : <KnowledgeEdit />
        },
        {
            path:'aide',
            element : <Help />
        },
        {
            path:'aide/deskservice',
            element : <DeskInfo />
        },
        {
            path:'aide/ticketdemo',
            element : <Demo />
        },
        {
            path:'aide/demandedemo',
            element : <Demo />
        },
        {
            path: '/',
            element: <Navigate to="/login" replace/>
        },
    ])
}




