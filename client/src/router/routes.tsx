import { lazy } from 'react';
import Salutations from '../pages/Users/Salutations';
import MailService from '../pages/Users/MailService';
import RegisterCover from '../pages/Authentication/RegisterCover';

const UserList = lazy(() => import('../pages/Users/List'));
const UserAdd = lazy(() => import('../pages/Users/Add'));
const UserEdit = lazy(() => import('../pages/Users/Edit'));
const ContactList = lazy(() => import('../pages/Contacts/List'));
const ContactAdd = lazy(() => import('../pages/Contacts/Add'));
const ContactEdit = lazy(() => import('../pages/Contacts/Edit'));
const ContactLog = lazy(() => import('../pages/Contacts/Logs'));

const CustomerCompany = lazy(() => import('../pages/Customers/CustomerCompany'));
const CompanyList = lazy(() => import('../pages/Customers/CompanyList'));

const TicketList = lazy(() => import('../pages/Ticket/TicketList'));
const AddTicket = lazy(() => import('../pages/Ticket/AddTicket'));
const TicketCloseForm = lazy(() => import('../pages/Ticket/TicketCloseForm'));
const UserTicket = lazy(() => import('../pages/Ticket/UserTicket'));
const CustomerTicketDetails = lazy(() => import('../pages/Ticket/CustomerTicketDetails'));
const AssignTicket = lazy(() => import('../pages/Ticket/AssignTicket'));
const AssignedTickets = lazy(() => import('../pages/Ticket/AssignedTickets'));
const TicketDetails = lazy(() => import('../pages/Ticket/TicketDetails'));
const ViewTicketDetails = lazy(() => import('../pages/Ticket/ViewTicketDetails'));
const TicketPrivilege = lazy(() => import('../pages/Ticket/TicketPrivilege'));
const Report = lazy(() => import('../pages/Ticket/Report'));

const TicketExpenses = lazy(() => import('../pages/Ticket/TicketExpenses'));
const AddExpense = lazy(() => import('../pages/Ticket/AddExpense'));

const Index = lazy(() => import('../pages/Index'));
const ERROR404 = lazy(() => import('../pages/Pages/Error404'));
const ERROR500 = lazy(() => import('../pages/Pages/Error500'));
const ERROR503 = lazy(() => import('../pages/Pages/Error503'));
const Maintenence = lazy(() => import('../pages/Pages/Maintenence'));
const Unlock = lazy(() => import('../pages/Authentication/Unlock'));
const RecoverIdBoxed = lazy(() => import('../pages/Authentication/RecoverIdBox'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const Error = lazy(() => import('../components/Error'));
const routes = [
     //Authentication
    {
        path: '/auth/login',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: '/auth/register',
        element: <RegisterCover />,
        layout: 'blank',
    },
    {
        path: '/auth/password-reset',
        element: <RecoverIdBoxed />,
        layout: 'blank',
    },
    {
        path: '/auth/unlock',
        element: <Unlock />,
        layout: 'blank',
    },
    // dashboard
    {
        path: '/',
        element: <Index />,
    },  
    // User
    {
        path: '/users',
        element: <UserList />,
    },
    {
        path: '/users/add',
        element: <UserAdd />,
    },
    {

        path: '/users/edit/:id',
        element: <UserEdit />,
    },
    //Customer Company
    {
        path: '/customers',
        element: <CompanyList />,
    },
    {
        path: '/customers/add',
        element: <CustomerCompany />,
    },

    // Ticket
    {
        path: '/src',
        element: <UserTicket />,
    },
    {
        path: '/src/solution/:id',
        element: <CustomerTicketDetails />,
    },
    {
        path: '/sr/list',
        element: <TicketList />,
    },
    {
        path: '/sr/assign',
        element: <AssignTicket />,
    },
    {
        path: '/sr/assigned',
        element: <AssignedTickets />,
    },
    {
        path: '/sr/add',
        element: <AddTicket />,
    },
    {
        path: '/sr/closeform',
        element:<TicketCloseForm />,
    },
    {
        path: '/sr/solution/:id',
        element: <TicketDetails />,
    },
    {
        path: '/sr/solution/view/:id',
        element: <ViewTicketDetails />,
    },
    {
        path: '/sr/privilege',
        element: <TicketPrivilege />,
    },
    {
        path: '/sr/report',
        element: <Report />,
    },
    {
        path: '/sr/expenses/:id',
        element: <TicketExpenses />,
    },
    {
        path: '/sr/expenses/add/:id',
        element: <AddExpense />,
    },
    {

        path: '/salutations',
        element: <Salutations />,
    },
    {

        path: '/mail-service',
        element: <MailService />,
    },
    // Contacts
    {
        path: '/contacts',
        element: <ContactList />,
    },
    {
        path: '/contacts/add',
        element: <ContactAdd />,
    },
    {
        path: '/contacts/edit/:id',
        element: <ContactEdit />,
    },
    {
        path: '/contacts/logs',
        element: <ContactLog />,
    },
    
    // error
    {
        path: '/pages/error404',
        element: <ERROR404 />,
        layout: 'blank',
    },
    {
        path: '/pages/error500',
        element: <ERROR500 />,
        layout: 'blank',
    },
    {
        path: '/pages/error503',
        element: <ERROR503 />,
        layout: 'blank',
    },
    {
        path: '/pages/maintenence',
        element: <Maintenence />,
        layout: 'blank',
    },
   
    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
