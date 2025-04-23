import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { ticketService } from '../../services/ticketService';
import { getPriorty,getStatus } from '../../utils/commonFunction';
import { LoadingOverlay } from '@mantine/core';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';

const UserTicket = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState<any[]>([]);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail])

    const GetTickets = async () => {
        try {
            setLoader(true);
            const response = await ticketService.getCustomerTickets();
            setItems(response.CustomerTickets);
            setInitialRecords(response.CustomerTickets);
            // console.log(response.CustomerTickets);
            setLoader(false);
        } catch (error) {
            setLoader(false);
            return ('Something Went Wrong');
        }
    }

    useEffect(() => {
        dispatch(setPageTitle('Ticket List'));
        GetTickets();
    },[]);  

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(items, 'sr_id'));
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
        setInitialRecords(() => {
            return items.filter((item) => {
                return (
                    item.sr_desc.toLowerCase().includes(search.toLowerCase()) ||
                    item.machine.toLowerCase().includes(search.toLowerCase())  
                );
            });
        });
    }, [items,search]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);

    

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    {/* <div className="flex items-center gap-2">
                       
                        <Link to="/addticket" className="btn btn-primary gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Create Ticket
                        </Link>
                    </div> */}
                    <h3 className="flex text-xl w-full font-semibold justify-center">Service Requests</h3>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    {loader &&
                        <LoadingOverlay visible={loader} loaderProps={{ children: 'Loading...' }} />
                    }
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
                                textAlign: 'center',
                                render: ({ sr_id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                         <NavLink to={`/src/solution/${sr_id}`} className="flex hover:text-info">
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
        </NavLink>
                                        
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Ticket ID',
                                title:'SR ID',
                                sortable: true,
                                render: ({ sr_id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{sr_id}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Date',
                                title:'SR Date',
                                sortable: true,
                                render: ({ srf_date }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{srf_date}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Service Request',
                                sortable: true,
                                render: ({ sr_desc }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{sr_desc}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Priority',
                                sortable: true,
                                render: ({ priority }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{getPriorty(priority)}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Status',
                                sortable: true,
                                render: ({ sr_status }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{getStatus(sr_status)}</div>
                                    </div>
                                ),
                            },
                           
                            {
                                accessor: 'Assigned To',
                                sortable: true,
                                render: ({ assigned_to_name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{assigned_to_name}</div>
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

export default UserTicket;
