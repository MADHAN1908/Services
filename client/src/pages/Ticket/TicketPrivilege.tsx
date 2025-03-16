import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Checkbox } from '@mantine/core';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';

const TicketPrivilege = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([
        {
            id: 1,
            userid: 'U12345',
            username: 'Madhan',
            ticketid:'12',
            title: 'Login Issue',
            priority: 'High',
            status: 'Open',
            date: '25-JAN-2025',
            support:'Aravind',
        },
        {
            id: 2,
            userid: 'U67890',
            username: 'Kumar',
            ticketid:'14',
            title: 'Bug in Feature',
            priority: 'Medium',
            status: 'Closed',
            date: '24-JAN-2025',
            support:'Arun',
        },
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
                    <h3 className="flex text-xl w-full font-semibold justify-center">Ticket Privileges</h3>
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
                                accessor: 'Username',
                                sortable: true,
                                render: ({ username, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{username}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Creation',
                                sortable: true,
                                render: (row) => (
                                                <Checkbox />
                                              ),
                            },
                            {
                                accessor: 'Modification',
                                sortable: true,
                                render: (row) => (
                                                <Checkbox />
                                              ),
                            },
                            {
                                accessor: 'Deletion',
                                sortable: true,
                                render: (row) => (
                                                <Checkbox />
                                              ),
                            },
                            {
                                accessor: 'Allocation',
                                sortable: true,
                                render: (row) => (
                                                <Checkbox />
                                              ),
                            },
                            {
                                accessor: 'Approval',
                                sortable: true,
                                render: (row) => (
                                                <Checkbox />
                                              ),
                            },
                            {
                                accessor: 'Closure',
                                sortable: true,
                                render: (row) => (
                                                <Checkbox />
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

export default TicketPrivilege;
