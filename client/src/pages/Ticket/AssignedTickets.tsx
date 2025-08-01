import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { ticketService } from '../../services/ticketService';
import { userService }  from '../../services/userService'
import { getPriorty,getStatus } from '../../utils/commonFunction';
import sortBy from 'lodash/sortBy';
import { Button, MultiSelect, Stack, LoadingOverlay , Box,NumberInput,TextInput,ActionIcon } from '@mantine/core';
import { DatePicker, type DatesRangeValue } from '@mantine/dates';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { title } from 'process';

const AssignedTicket = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState<any[]>([]);
    const [loader, setLoader] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);
    const [minSR_ID, setMinSR_ID] = useState<number | null>(null);
    const [maxSR_ID, setMaxSR_ID] = useState<number | null>(null);

    const navigate = useNavigate();
    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = userAuthDetail?.role ? userAuthDetail.role : 'Manage';

    useEffect(() => {
        if (!userAuthDetail?.token || role === 'Manage') {
            navigate('/auth/login');
        }
    }, [userAuthDetail]);

    const GetUsers = async () => {
        try {
            const response = await userService.getAdmins();
            const Customers = response.UserDetails.filter((user : any) => user.role === 'Customer').map((user: any) => user.username);
            const Managers = response.UserDetails.filter((user : any) => (user.role === 'Manager' || user.role === 'Admin')).map((user: any) => user.username);
            const Employees = response.UserDetails.filter((user : any) => user.role === 'Employee').map((user: any) => user.username);
            setCustomers(Customers);
            setEmployees(Employees);
            setManagers(Managers);
        } catch (error) {
            return ('Something Went Wrong');
        }
    }

     const GetTickets = async () => {
            try {
                setLoader(true);
                const response = await ticketService.getAssignedTickets();
                setItems(response.AssignedTickets);
                setInitialRecords(response.AssignedTickets);
                setLoader(false);
                } catch (error) {
                setLoader(false);
                return ('Something Went Wrong');
            }
        }
    
        const handleDateChange = async (id:number,date:any) => {
            try {
                const response = await ticketService.updateTicket({date},id);
                if(response.response == "Success"){
                    GetTickets();
                }
                
                } catch (error) {
                return ('Something Went Wrong');
            }
        }

        const handleCloseSR = async (id:number) => {
            try {
                setLoader(true);
                const response = await ticketService.updateTicket({'status' : 'Z'},id);
                if(response.response == "Success"){
                    GetTickets();
                }
                setLoader(false);
                } catch (error) {
                    setLoader(false);
                return ('Something Went Wrong');
            }
        }
        
        useEffect(() => {
            dispatch(setPageTitle('Assigned Ticket'));
            GetUsers();
            GetTickets();
        },[]); 

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(items, 'sr_id'));
    const [records, setRecords] = useState(initialRecords);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'ticketid',
        direction: 'asc',
    });
    const [selectedPriority,setSelectedPriority] = useState<string[]>([]);
    const [selectedStatus,setSelectedStatus] = useState<string[]>([]);
    const [srDateRange, setSRDateRange] = useState<DatesRangeValue>();
    const [selectedCustomer,setSelectedCustomer] = useState<string[]>([]);
    const [selectedEmployee,setSelectedEmployee] = useState<string[]>([]);
    const [selectedManager,setSelectedManager] = useState<string[]>([]);
    const [srQuery, setSRQuery] = useState('');
    const [machineQuery, setMachineQuery] = useState('');
    const [sr_idQuery, setSR_IDQuery] = useState('');

    useEffect(() => {
        setInitialRecords(() => {
            return items.filter((item) => {
                return (
                    item.sr_desc.toLowerCase().includes(search.toLowerCase()) ||
                    item.machine.toLowerCase().includes(search.toLowerCase())  
                );
            });
        });
        // setInitialRecords(sortBy(filteredItems, sortStatus.columnAccessor));
    }, [search, items]);

    useEffect(() => {
                setInitialRecords(
                    items.filter((ticket) => {
                        if (selectedPriority.length && !selectedPriority.some((d) => d === getPriorty(ticket.priority || ''))) {
                            return false;
                        }
                        if (selectedStatus.length && !selectedStatus.some((d) => d === getStatus(ticket.sr_status || ''))) {
                            return false;
                        }
                        if (selectedCustomer.length && !selectedCustomer.some((d) => d === ticket.contact_person_name )) {
                            return false;
                        }
                        if (selectedEmployee.length && !selectedEmployee.some((d) => d === ticket.assigned_to_name )) {
                            return false;
                        }
                        if (selectedManager.length && !selectedManager.some((d) => d === ticket.assigned_by_name )) {
                            return false;
                        }
                        if (srQuery !== '' && !ticket.sr_desc.toLowerCase().includes(srQuery.trim().toLowerCase()))
                            return false;
                        if (machineQuery !== '' && !ticket.machine.toLowerCase().includes(machineQuery.trim().toLowerCase()))
                            return false;
                        if (sr_idQuery !== '' && !ticket.sr_id.toString().includes(sr_idQuery.toString()))
                            return false;
                        if (minSR_ID !== null && minSR_ID !== '' && ticket.sr_id < minSR_ID) return false;
                        if (maxSR_ID !== null && maxSR_ID !== '' && ticket.sr_id > maxSR_ID) return false;
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
            }, [selectedPriority,selectedStatus,selectedCustomer,selectedEmployee,selectedManager,srQuery,machineQuery,sr_idQuery,minSR_ID,maxSR_ID,srDateRange]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                <div className="flex  items-center w-72 gap-2">
                       
                       {/* <Link to="/sr/closeform" className="btn btn-primary  gap-2">
                           <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                               <line x1="12" y1="5" x2="12" y2="19"></line>
                               <line x1="5" y1="12" x2="19" y2="12"></line>
                           </svg>
                           Close SR Form
                       </Link> */}
                   </div>
                <h3 className="flex text-xl w-full font-semibold justify-center">{role === "Employee" ?'Assigned Service Requests' :'Active Service Requests'}</h3>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
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
                        highlightOnHover
                        records={records}
                        columns={[
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlign: 'center',
                                render: ({ sr_id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <NavLink to={role === "Employee" ? `/sr/solution/${sr_id}` : `/sr/solution/view/${sr_id}`} className="flex hover:text-info">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-6 h-6 `} >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                       </NavLink>
                                    </div>
                                ),
                            },
                            ...(role !== 'Employee' ? [{
                                accessor: '',
                                sortable: false,
                                textAlignment: 'center',
                                width:100,
                                render: ({ sr_id,sr_status }) => (
                                    <div className='flex justify-center font-semibold'>
                                   {sr_status !== 'Z' && ( sr_status === 'Y' || sr_status ==='C') &&
                                    <button type='button' onClick={()=>handleCloseSR(sr_id)} className="btn btn-primary">Close</button>
                                   }{sr_status === 'Z'  &&
                                    <div>Closed</div>
                                   }
                                    </div>
                                ),
                            },
                        ]:[]),
                            {
                                accessor: '',
                                title:'Expense',
                                textAlignment: 'center',
                                width:100,
                                render: ({ sr_id,sr_status }) => (
                                    <div className='flex justify-center px-2 font-semibold'>
                                   { (['P','W', 'C','Y','Z'].includes(sr_status)) &&
                                    <NavLink to={`/sr/expenses/${sr_id}`} className="btn btn-primary">
                                        Expense
                                       </NavLink>
                                   }
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Arrive by',
                                sortable: false,
                                width:200,
                                render: ({ sr_date,plan_in_time,sr_id,sr_status }) => (
                                    
                                    <Flatpickr
                                    disabled={(['A','Y','Z'].includes(sr_status)) || role != "Employee"}
                defaultValue={plan_in_time}
                options={{
                    enableTime: true,
                    dateFormat: 'd-M-Y H:i',  
                    time_24hr: true,  
                    minDate: sr_date, 
                }}
                className={`form-input w-full border-0 opacity-80 bg-transparent`}
                onChange={(date) => handleDateChange(sr_id,date[0])}
            />
                                ),
                            },
                            {
                                accessor: 'ticketID',
                                title:'SR ID',
                                sortable: true,
                                render: ({ sr_id }) => <div className="flex  justify-center font-semibold">{sr_id}</div>,
                                filter: (<Box>
                                    <TextInput
                                      label="SR ID"
                                      description="Show ID's whose SR ID include the specified Number"
                                      placeholder="Search SR ID's..."
                                      leftSection={ <svg
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
                                    </svg>}
                                      rightSection={
                                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSR_IDQuery('')}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                            stroke-linecap="round" stroke-linejoin="round" className="feather feather-x">
                                          <line x1="18" y1="6" x2="6" y2="18" />
                                          <line x1="6" y1="6" x2="18" y2="18" />
                                          </svg>
                                        </ActionIcon>
                                      }
                                      value={sr_idQuery}
                                      onChange={(e) => setSR_IDQuery(e.currentTarget.value)}
                                    />
                                    <Box mt={4} sx={{ display: 'flex', gap: 4 }}>
                                      <NumberInput
                                        size="xs"
                                        placeholder="Min"
                                        leftSection={ <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <polyline points="6 9 12 15 18 9" />
                                          </svg>}
                                        rightSection={
                                            <Box mr={12}>
                                            <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setMinSR_ID('')}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                                stroke-linecap="round" stroke-linejoin="round" className="feather feather-x">
                                              <line x1="18" y1="6" x2="6" y2="18" />
                                              <line x1="6" y1="6" x2="18" y2="18" />
                                              </svg>
                                            </ActionIcon>
                                            </Box>
                                          }
                                        value={minSR_ID}
                                        onChange={setMinSR_ID}
                                        style={{ flex: 1  }}
                                        // styles={{ input: { width: 60 } }}
                                      />
                                      </Box>
                                      <Box mt={4} sx={{ display: 'flex', gap: 4 }}>
                                      <NumberInput
                                        size="xs"
                                        placeholder="Max"
                                        leftSection={ <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <polyline points="6 15 12 9 18 15" />
                                          </svg>}
                                        rightSection={
                                            <Box mr={12}>
                                            <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setMaxSR_ID('')}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                                stroke-linecap="round" stroke-linejoin="round" className="feather feather-x">
                                              <line x1="18" y1="6" x2="6" y2="18" />
                                              <line x1="6" y1="6" x2="18" y2="18" />
                                              </svg>
                                            </ActionIcon>
                                            </Box>
                                          }
                                        value={maxSR_ID}
                                        onChange={setMaxSR_ID}
                                        style={{ flex: 1 }}
                                        // styles={{ input: { width: 60 } }}
                                      />
                                    </Box>
                                  </Box>
                                  ),
                                  filtering: sr_idQuery !== '' || (minSR_ID !== '' && minSR_ID !== null) || (maxSR_ID !== '' && maxSR_ID !== null),
                            },
                            {
                                accessor: 'Date',
                                title: 'SR Date',
                                sortable: true,
                                render: ({ srf_date }) => (
                                    <div className="flex items-center justify-center font-semibold">
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
                                title: 'Request By',
                                sortable: true,
                                render: ({ contact_person_name }) => <div className="font-semibold">{contact_person_name}</div>,
                                filter: (
                                    <MultiSelect
                                        label="Filter by Customers"
                                        placeholder="Select Customers..."
                                        data={customers}
                                        value={selectedCustomer}
                                        onChange={setSelectedCustomer}
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
                                filtering: selectedCustomer.length > 0,
                            },
                            {
                                accessor: 'Service Request',
                                title:'Service Request',
                                sortable: true,
                                render: ({ sr_desc }) => <div className="font-semibold">{sr_desc}</div>,
                                filter: (
                                    <TextInput
                                      label="Service Request"
                                      description="Show Service Request whose content include the specified text"
                                      placeholder="Search Service Request..."
                                      leftSection={ <svg
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
                                    </svg>}
                                      rightSection={
                                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSRQuery('')}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                            stroke-linecap="round" stroke-linejoin="round" className="feather feather-x">
                                          <line x1="18" y1="6" x2="6" y2="18" />
                                          <line x1="6" y1="6" x2="18" y2="18" />
                                          </svg>
                                        </ActionIcon>
                                      }
                                      value={srQuery}
                                      onChange={(e) => setSRQuery(e.currentTarget.value)}
                                    />
                                  ),
                                  filtering: srQuery !== '',
                            },
                            {
                                accessor: 'Machine',
                                title:'Machine',
                                sortable: true,
                                render: ({ machine }) => <div className="font-semibold">{machine}</div>,
                                filter: (
                                    <TextInput
                                      label="Machine"
                                      description="Show Machine whose name include the specified text"
                                      placeholder="Search Machines..."
                                      leftSection={ <svg
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
                                    </svg>}
                                      rightSection={
                                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setMachineQuery('')}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                            stroke-linecap="round" stroke-linejoin="round" className="feather feather-x">
                                          <line x1="18" y1="6" x2="6" y2="18" />
                                          <line x1="6" y1="6" x2="18" y2="18" />
                                          </svg>
                                        </ActionIcon>
                                      }
                                      value={machineQuery}
                                      onChange={(e) => setMachineQuery(e.currentTarget.value)}
                                    />
                                  ),
                                  filtering: machineQuery !== '',
                            },
                            {
                                accessor: 'Priority',
                                sortable: true,
                                render: ({ priority }) => <div className="font-semibold">{getPriorty(priority)}</div>,
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
                                sortable: true,
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
                            ...(role !== 'Employee' ? [{
                                accessor: 'Assigned To',
                                sortable: false,
                                render: ({ assigned_to_name }: {assigned_to_name : string}) => (
                                    <div className="flex items-center justify-center font-semibold">
                                        <div>{assigned_to_name}</div>
                                    </div>
                                ),
                                filter: (
                                    <MultiSelect
                                        label="Filter by User"
                                        placeholder="Select Users..."
                                        data={employees}
                                        value={selectedEmployee}
                                        onChange={setSelectedEmployee}
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
                                filtering: selectedEmployee.length > 0,
                            },
                        ]: []),
                            {
                                accessor: 'Assigned By',
                                sortable: false,
                                render: ({ assigned_by_name }) => (
                                    <div className="flex items-center justify-center font-semibold">
                                        <div>{assigned_by_name}</div>
                                    </div>
                                ),
                                filter: (
                                    <MultiSelect
                                        label="Filter by Managers"
                                        placeholder="Select managers..."
                                        data={managers}
                                        value={selectedManager}
                                        onChange={setSelectedManager}
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
                                filtering: selectedManager.length > 0,
                            },
                            {
                                accessor: 'Rating',
                                sortable: true,
                                render: ({ customer_rating }) => (
                                    <div className="flex items-center justify-center font-semibold">
                                        <div>{customer_rating}</div>
                                    </div>
                                ),
                            },

                        ]}
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={setPage}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        paginationText={({ from, to, totalRecords }) =>
                            `Showing ${from} to ${to} of ${totalRecords} entries`
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default AssignedTicket;
