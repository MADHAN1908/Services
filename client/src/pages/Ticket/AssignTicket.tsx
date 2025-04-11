import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { ticketService } from '../../services/ticketService';
import { userService } from '../../services/userService';
import { getPriorty,getStatus } from '../../utils/commonFunction';
import { Button, MultiSelect, Stack } from '@mantine/core';
import { DatePicker, type DatesRangeValue } from '@mantine/dates';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';

const AssignTicket = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedPriority,setSelectedPriority] = useState<string[]>([]);
    const [selectedStatus,setSelectedStatus] = useState<string[]>([]);
    const [selectedServiceType,setSelectedServiceType] = useState<string[]>([]);
    const [srDateRange, setSRDateRange] = useState<DatesRangeValue>();
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
            const response = await ticketService.getAssignTickets();
            setItems(response.AssignTickets);
            setInitialRecords(response.AssignTickets);
            // console.log(response.AssignTickets);
            } catch (error) {
            return ('Something Went Wrong');
        }
    }
    const GetUsers = async () => {
        try {
            const response = await userService.getAssignUsers();
            setUsers(response.AssignUsers);
            } catch (error) {
            return ('Something Went Wrong');
        }
    }

    const [changedRows, setChangedRows] = useState<{ sr_id: number; assign: number }[]>([]);

    const handleAssignChange = (sr_id: number, assign: number) => {
        setInitialRecords((prev) =>
            prev.map((row) => (row.sr_id === sr_id ? { ...row, assigned_to : assign } : row))
          );
          console.log(items);
        setChangedRows((prev) => {
            const existingRow = prev.find((row) => row.sr_id === sr_id);
            if (existingRow) {
                return prev.map((row) => (row.sr_id === sr_id ? { ...row, assign } : row));
            } else {
                return [...prev, { sr_id, assign }];
            }
        });
    };
    
    const handleUpdateRows = async () => {
        try {
            await Promise.all(
                changedRows.map(async (row) => {
                    await ticketService.updateTicket({ assign: row.assign, status: "P" }, row.sr_id);
                })
            );
            setChangedRows([]); // Clear updated rows after successful update
            GetTickets(); // Refresh table data
        } catch (error) {
            console.error("Something Went Wrong:", error);
        }
    };

    const handleAssign = async (id:number,assign:number) => {
        try {
            const response = await ticketService.updateTicket({assign,status:'P'},id);
            if(response.response == "Success"){
                setChangedRows((prev) => prev.filter(row => row.sr_id !== id)); 
            }
            
            } catch (error) {
            return ('Something Went Wrong');
        }
    }
    
    useEffect(() => {
        dispatch(setPageTitle('Ticket List'));
        GetTickets();
        GetUsers();
    },[]); 

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(items, 'sr_id'));
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'ticketid',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
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
            setInitialRecords(
                items.filter((ticket) => {
                    if (selectedPriority.length && !selectedPriority.some((d) => d === getPriorty(ticket.priority || ''))) {
                        return false;
                    }
                    if (selectedStatus.length && !selectedStatus.some((d) => d === getStatus(ticket.sr_status || ''))) {
                        return false;
                    }
                    if (
                        srDateRange &&
                        srDateRange[0] &&
                        srDateRange[1] &&
                        (dayjs(srDateRange[0]).isAfter(ticket.srf_date, 'day') ||
                          dayjs(srDateRange[1]).isBefore(ticket.srf_date, 'day'))
                      )
                        return false;
                    return true;
                })
            );
        }, [selectedPriority,selectedStatus,srDateRange]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex items-center gap-2">
                    <button className="btn btn-primary  gap-2"
                    onClick={handleUpdateRows}>
                     Update
                    </button>
                    </div>
                    <h3 className="flex text-xl w-full font-semibold justify-center">Assign Service Request</h3>
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
                                textAlign: 'center',
                                render: ({ sr_id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <NavLink to={`/sr/solution/view/${sr_id}`} className="flex hover:text-info">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-6 h-6 `} >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        </NavLink>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Assign',
                                sortable: true,
                                render: ({ sr_id,assigned_to }) => (
                                    <div className="flex items-center gap-2">
                                        <select name="Agent" className="p-1 bg-transparent border-0 rounded"
                                        value={assigned_to}
                                        onChange={(e)=>handleAssignChange(sr_id,Number(e.target.value))}
                                        // className="form-select"
                                        >
                                        <option value="">Assign</option>
                                        {users.map((user) => 
                                        <option key={user.userid} value={user.userid}>{user.username}</option>
                                        )}

                                    </select>
                                    {changedRows.some((row) => row.sr_id === sr_id) && (
                <button 
                onClick={() => {
                    const changedRow = changedRows.find((row) => row.sr_id === sr_id);
                    if (changedRow) {
                        handleAssign(changedRow.sr_id, changedRow.assign);
                    }
                }} 
                className="text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                </button>
            )}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'ticketID',
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
                                sortable: false,
                                render: ({ srf_date }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{srf_date}</div>
                                    </div>
                                ),
                                filter: ({ close }) => (
                                    <Stack>
                                        <DatePicker
                                        maxDate={new Date()}
                                        type="range"
                                        value={srDateRange}
                                        onChange={setSRDateRange}
                                        w="300px"
                                    />
                                    <Button
                                        disabled={!srDateRange}
                                        variant="light"
                                        onClick={() => {
                                            setSRDateRange(undefined);
                                            close();
                                        }}>Clear
                                    </Button>
                                    </Stack>
                                ),
                                filtering: Boolean(srDateRange),
                            },
                            {
                                accessor: 'Request By',
                                title:'Request By',
                                sortable: true,
                                render: ({ contact_person_name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{contact_person_name}</div>
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
                                accessor: 'Machine',
                                sortable: true,
                                render: ({ machine }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{machine}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Priority',
                                sortable: false,
                                render: ({ priority }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{getPriorty(priority)}</div>
                                    </div>
                                ),
                                filter: (
                                    <MultiSelect
                                        label="Filter by Priority"
                                        placeholder="Select priority..."
                                        data={['Low', 'Medium', 'High', 'Critical']}
                                        value={selectedPriority}
                                        onChange={setSelectedPriority}
                                        searchable
                                        clearable
                                        comboboxProps={{ withinPortal: false }}
                                        leftSection={
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                        }
                                    />
                                ),
                                filtering: selectedPriority.length > 0,
                            },
                            {
                                accessor: 'Status',
                                sortable: false,
                                render: ({ sr_status }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{getStatus(sr_status)}</div>
                                    </div>
                                ),
                                filter: (
                                    <MultiSelect
                                        label="Filter by Status"
                                        placeholder="Select Status..."
                                        data={['Unassigned','Pending','In Progress','Completed','Customer Approved','All Completed','Closed']}
                                        value={selectedStatus}
                                        onChange={setSelectedStatus}
                                        searchable
                                        clearable
                                        comboboxProps={{ withinPortal: false }}
                                        leftSection={
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                        }
                                    />
                                ),
                                filtering: selectedStatus.length > 0,
                            },
                          
                            // {
                            //     accessor: 'Assigned To',
                            //     sortable: true,
                            //     render: ({ assigned_to}) => (
                            //         <div className="flex items-center font-semibold">
                            //             <div>{assigned_to}</div>
                            //         </div>
                            //     ),
                            // },

                            
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

export default AssignTicket;
