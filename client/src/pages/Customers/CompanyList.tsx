import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';

const CompanyList = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([
        {
            id: 1,
            name: 'NovaTech',
            address: '123, 12th street',
            city:'Chennai',
            state:'Tamil Nadu',
            country:'India',
            postal_code:'600047',
            email: 'mkmadhan1908@gmail.com',
            phone_no: '9876543210',
        },
        // {
        //     id: 2,
        //     userid: 'U67890',
        //     username: 'Kumar',
        //     ticketid:'14',
        //     title: 'Bug in Feature',
        //     priority: 'Medium',
        //     status: 'Closed',
        //     date: '24-JAN-2025',
        //     support:'Arun',
        // },
    ]);
    const navigate = useNavigate();
    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail])

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(items, 'id'));
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'username',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        // setInitialRecords(() => {
        //     return items.filter((item) => {
        //         return (
        //             // item.username.toLowerCase().includes(search.toLowerCase()) ||
        //             // item.email.toLowerCase().includes(search.toLowerCase()) ||
        //             // item.mobile.toLowerCase().includes(search.toLowerCase()) ||
        //             // item.role.toLowerCase().includes(search.toLowerCase()) 
        //         );
        //     });
        // });
    }, [items,search]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 px-5 w-full flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex  items-center w-72 gap-2">
                       
                        <Link to="/customers/add" className="btn btn-primary  gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Create Customers
                        </Link>
                    </div>
                    <h3 className="flex text-xl w-full font-semibold justify-center">Company Lists</h3>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className="whitespace-nowrap table-hover"
                        withColumnBorders
                        borderColor="#d0d4da"
                        rowBorderColor="#d0d4da"
                        records={records}
                        columns={[
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlignment: 'center',
                                render: ({ id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        {/* <NavLink to={'/ticketdetails'} className="flex hover:text-info">
                                        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-6 h-6 `}
        >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
        </NavLink> */}
                                        <NavLink to={`/users/edit/${ id }`} className="flex hover:text-info">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5">
                                                <path
                                                    opacity="0.5"
                                                    d="M22 10.5V12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2H13.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                ></path>
                                                <path
                                                    d="M17.3009 2.80624L16.652 3.45506L10.6872 9.41993C10.2832 9.82394 10.0812 10.0259 9.90743 10.2487C9.70249 10.5114 9.52679 10.7957 9.38344 11.0965C9.26191 11.3515 9.17157 11.6225 8.99089 12.1646L8.41242 13.9L8.03811 15.0229C7.9492 15.2897 8.01862 15.5837 8.21744 15.7826C8.41626 15.9814 8.71035 16.0508 8.97709 15.9619L10.1 15.5876L11.8354 15.0091C12.3775 14.8284 12.6485 14.7381 12.9035 14.6166C13.2043 14.4732 13.4886 14.2975 13.7513 14.0926C13.9741 13.9188 14.1761 13.7168 14.5801 13.3128L20.5449 7.34795L21.1938 6.69914C22.2687 5.62415 22.2687 3.88124 21.1938 2.80624C20.1188 1.73125 18.3759 1.73125 17.3009 2.80624Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                ></path>
                                                <path
                                                    opacity="0.5"
                                                    d="M16.6522 3.45508C16.6522 3.45508 16.7333 4.83381 17.9499 6.05034C19.1664 7.26687 20.5451 7.34797 20.5451 7.34797M10.1002 15.5876L8.4126 13.9"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                ></path>
                                            </svg>
                                        </NavLink>
                                    
                                        <button type="button" className="flex hover:text-danger" >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path
                                                    d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                ></path>
                                                <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path
                                                    opacity="0.5"
                                                    d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                ></path>
                                            </svg>
                                        </button>
                                        {/* </NavLink> */}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Company_Id',
                                title:'Company ID',
                                sortable: true,
                                render: ({  id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{id}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Company_Name',
                                title:'Company Name',
                                sortable: true,
                                render: ({ name, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{name}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Email',
                                sortable: true,
                                render: ({ email, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{email}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Phone No',
                                sortable: true,
                                render: ({ phone_no, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{phone_no}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Address',
                                sortable: true,
                                render: ({ address, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{address}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'City',
                                sortable: true,
                                render: ({ city, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{city}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'State',
                                sortable: true,
                                render: ({ state, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{state}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Country',
                                sortable: true,
                                render: ({ country, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{country}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Postal Code',
                                title: 'Postal Code',
                                sortable: true,
                                render: ({ postal_code, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{postal_code}</div>
                                    </div>
                                ),
                            },
                            
                        ]}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default CompanyList;
