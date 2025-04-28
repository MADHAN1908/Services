import { Link, NavLink, useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { ticketService } from '../../services/ticketService';
import { userService } from '../../services/userService';
import { getServiceType,getPriorty,getStatus } from '../../utils/commonFunction';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Button, MultiSelect, Stack, ActionIcon, TextInput,LoadingOverlay, NumberInput,Box,Checkbox,Text } from '@mantine/core';
import { DatePicker, type DatesRangeValue } from '@mantine/dates';

import dayjs from 'dayjs';

const TicketList = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState<any[]>([]);
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loader, setLoader] = useState(false);
    const [minSR_ID, setMinSR_ID] = useState<number | null>(null);
    const [maxSR_ID, setMaxSR_ID] = useState<number | null>(null);

    const [visibleColumns, setVisibleColumns] = useState({
        sr_id: true,
        sr_date: true,
        requested_by:true,
        service_request:true,
        machine : true,
        priority: true,
        status: true,
        service_type: true,
        assigned_to : true,
        assigned_by : false,
        rating : true,
        
      });
    
    const navigate = useNavigate();
    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail]);

    const GetUsers = async () => {
        try {
            const response = await userService.getAdmins();
            const Customers = response.UserDetails.filter((user : any) => user.role === 'Customer').map((user: any) => user.username);
            const Employees = response.UserDetails.filter((user : any) => user.role === 'Employee').map((user: any) => user.username);
            const Managers = response.UserDetails.filter((user : any) => (user.role === 'Manager' || user.role === 'Admin')).map((user: any) => user.username);
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
                    const response = await ticketService.getTickets();
                    setItems(response.TicketDetails);
                    setInitialRecords(response.TicketDetails);
                    // console.log(response.TicketDetails);
                    setLoader(false);
                } catch (error) {
                    setLoader(false);
                    return ('Something Went Wrong');
                }
            }

            useEffect(() => {
                dispatch(setPageTitle('Ticket List'));
                GetUsers();
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
    const [selectedPriority,setSelectedPriority] = useState<string[]>([]);
    const [selectedStatus,setSelectedStatus] = useState<string[]>([]);
    const [selectedCustomer,setSelectedCustomer] = useState<string[]>([]);
    const [selectedEmployee,setSelectedEmployee] = useState<string[]>([]);
    const [selectedManager,setSelectedManager] = useState<string[]>([]);
    const [selectedServiceType,setSelectedServiceType] = useState<string[]>([]);
    const [srDateRange, setSRDateRange] = useState<DatesRangeValue>();
    const [srQuery, setSRQuery] = useState('');
    const [machineQuery, setMachineQuery] = useState('');
    const [sr_idQuery, setSR_IDQuery] = useState('');


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
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);

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
                if (selectedServiceType.length && !selectedServiceType.some((d) => d === getServiceType(ticket.service_type || ''))) {
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
    }, [sr_idQuery,srQuery,machineQuery,selectedPriority,selectedCustomer,selectedEmployee,selectedManager,selectedServiceType,selectedStatus,srDateRange,minSR_ID,maxSR_ID]);


    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 px-5 w-full flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex  items-center w-72 gap-2">
                       
                        <Link to="/sr/add" className="btn btn-primary  gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Create SR
                        </Link>
                    </div>
                    <h3 className="flex text-xl w-full font-semibold justify-center">Service Request Lists</h3>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    {loader &&
                            <LoadingOverlay visible={loader} loaderProps={{ children: 'Loading...' }} />
                        }
                    <DataTable
                        className="whitespace-nowrap "
                        withColumnBorders
                        withTableBorder
                        // pinFirstColumn
                        // noHeader
                        // height={450}
                        // borderColor="#d0d4da"
                        // rowBorderColor="#d0d4da"
                        records={records}
                        columns={
                            [
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlign: 'center',
                                // width:80,
                                render: ({ sr_id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <NavLink to={`/sr/solution/view/${sr_id}`} className="flex hover:text-info">
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
                                filter :(<Box mb={16}>
                                    <Text fw={700} mb={8}>Visible Columns</Text>
                                  
                                    {Object.keys(visibleColumns).map((columnKey) => (<div className="flex gap-2">
                                      <Checkbox
                                        key={columnKey}
                                        className="flex"
                                        checked={visibleColumns[columnKey]}
                                        onChange={(e) =>
                                          setVisibleColumns({
                                            ...visibleColumns,
                                            [columnKey]: e.currentTarget.checked,
                                          })
                                        }
                                        mb={8}
                                      />
                                    <Text className="">{columnKey.toUpperCase()}</Text></div>
                                    ))}
                                  </Box>),
                                  filtering: true,
                            },
                           visibleColumns.sr_id && {
                                accessor: 'ticketID',
                                title:'SR ID',
                                sortable: true,
                                render: ({ sr_id }) => (
                                    <div className="flex items-center justify-center font-semibold">
                                        <div>{sr_id}</div>
                                    </div>
                                ),
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
                                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
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
                                                stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
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
                                                stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
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
                           visibleColumns.sr_date && {
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
                                        }}
                                      >
                                        Clear
                                      </Button>
                                    </Stack>
                                  ),
                                  filtering: Boolean(srDateRange),
                            },
                           visibleColumns.requested_by && {
                                accessor: 'Requested By',
                                title:'Requested By',
                                sortable: false,
                                render: ({ contact_person_name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{contact_person_name}</div>
                                    </div>
                                ),
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
                            visibleColumns.service_request && {
                                accessor: 'Service Request',
                                sortable: false,
                                render: ({ sr_desc }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{ sr_desc }</div>
                                    </div>
                                ),
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
                                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
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
                           visibleColumns.machine && {
                                accessor: 'Machine',
                                sortable: false,
                                render: ({ machine }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{ machine }</div>
                                    </div>
                                ),
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
                                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
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
                            visibleColumns.priority && {
                                accessor: 'Priority',
                                sortable: false,
                                render: ({ priority}) => (
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
                            visibleColumns.status && {
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
                            
                           visibleColumns.service_type && {
                                accessor: 'Service Type',
                                sortable: false,
                                render: ({ service_type }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{getServiceType(service_type)}</div>
                                    </div>
                                ),
                                filter: (
                                    <MultiSelect
                                        label="Filter by Status"
                                        placeholder="Select Status..."
                                        data={['Warranty','BreakDown','Maintenance']}
                                        value={selectedServiceType}
                                        onChange={setSelectedServiceType}
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
                                filtering: selectedServiceType.length > 0,
                            },
                            visibleColumns.assigned_to && {
                                accessor: 'Assigned To',
                                sortable: false,
                                render: ({ assigned_to_name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{assigned_to_name?assigned_to_name:'Not Assigned'}</div>
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
                            visibleColumns.assigned_by && {
                                accessor: 'Assigned By',
                                sortable: false,
                                render: ({ assigned_by_name }) => (
                                    <div className="flex items-center font-semibold">
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
                            visibleColumns.rating && {
                                accessor: 'Rating',
                                sortable: false,
                                render: ({ customer_rating }) => (
                                    <div className="flex items-center justify-center font-semibold">
                                        <div>{customer_rating}</div>
                                    </div>
                                ),
                            },
                            
                        ].filter(Boolean)}
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

export default TicketList;
