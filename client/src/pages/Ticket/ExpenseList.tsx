import { Link, NavLink, useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { categoryService } from '../../services/categoryService';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Button, MultiSelect, Stack, ActionIcon,TextInput,LoadingOverlay , Box, NumberInput } from '@mantine/core';
import { DatePicker, type DatesRangeValue } from '@mantine/dates';
import dayjs from 'dayjs';

const ExpenseList = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState<any[]>([]);
    const [category, setCategory] = useState([]);
    const [loader, setLoader] = useState(false);
    const [minSR_ID, setMinSR_ID] = useState<number | null>(null);
    const [maxSR_ID, setMaxSR_ID] = useState<number | null>(null);
    const [minExpense_id, setMinExpense_id] = useState<number | null>(null);
    const [maxExpense_id, setMaxExpense_id] = useState<number | null>(null);
    const [minAmount, setMinAmount] = useState<number | null>(null);
    const [maxAmount, setMaxAmount] = useState<number | null>(null);
    const navigate = useNavigate();
    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail])

    const GetExpenses = async () => {
                try {
                    setLoader(true);
                    const response = await expenseService.getAllExpenses();
                    setItems(response.Expenses);
                    setInitialRecords(response.Expenses);
                    // console.log(response.Expenses);
                    setLoader(false);
                } catch (error) {
                    setLoader(false);
                    return ('Something Went Wrong');
                }
            }

    const GetCategory = async () => {
        try {
                        const response = await categoryService.getCategories();
                        // console.log(response.CategoryList);
                        const Categories = response.CategoryList.map((Category: any) => Category.name);
                        setCategory(Categories);
                } catch (error) {
                    return ('Something Went Wrong');
                }
        }

            useEffect(() => {
                dispatch(setPageTitle('Expense List'));
                GetExpenses();
                GetCategory();
            },[]);   

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(items, 'sr_id'));
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'sr_id',
        direction: 'desc',
    });
    const [selectedExpenseType,setSelectedExpenseType] = useState<string[]>([]);
    // const [selectedStatus,setSelectedStatus] = useState<string[]>([]);
    // const [selectedServiceType,setSelectedServiceType] = useState<string[]>([]);
    const [expenseDateRange, setExpenseDateRange] = useState<DatesRangeValue>();
    const [descriptionQuery, setDescriptionQuery] = useState('');
    const [expense_idQuery, setExpense_idQuery] = useState('');
    const [sr_idQuery, setSR_IDQuery] = useState('');
    const [amountQuery, setAmountQuery] = useState('');

    const [previewImage, setPreviewImage] = useState('');
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    
    const handlePreview = (attachment: any) => {
        const fileURl =`http://localhost:3700/api/v1${attachment}`;
        setPreviewImage(fileURl);
        setIsPreviewVisible(true);
      };


    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    // useEffect(() => {
    //     setInitialRecords(() => {
    //         return items.filter((item) => {
    //             return (
    //                 // item.sr_desc.toLowerCase().includes(search.toLowerCase()) ||
    //                 // item.machine.toLowerCase().includes(search.toLowerCase())  
    //             );
    //         });
    //     });
    // }, [items,search]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);

      useEffect(() => {
        setInitialRecords(
            items.filter((expense) => {
                if (selectedExpenseType.length && !selectedExpenseType.some((d) => d === expense.category_name)) {
                    return false;
                }
                if (
                    expenseDateRange &&
                    expenseDateRange[0] &&
                    expenseDateRange[1] &&
                    (dayjs(expenseDateRange[0]).isAfter(expense.formatted_expense_date, 'day') ||
                      dayjs(expenseDateRange[1]).isBefore(expense.formatted_expense_date, 'day'))
                  )
                    return false;
                if (descriptionQuery !== '' && !expense.description.toLowerCase().includes(descriptionQuery.trim().toLowerCase()))
                        return false;
                if (expense_idQuery !== '' && !expense.expense_id.toString().includes(expense_idQuery.toString()))
                        return false;
                if (sr_idQuery !== '' && !expense.sr_id.toString().includes(sr_idQuery.toString()))
                        return false;
                if (amountQuery !== '' && !expense.amount.toString().includes(amountQuery.toString()))
                    return false;
                if (minSR_ID !== null && maxSR_ID !== '' && expense.sr_id < minSR_ID) return false;
                if (maxSR_ID !== null && maxSR_ID !== '' && expense.sr_id > maxSR_ID) return false;
                if (minExpense_id !== null && maxExpense_id !== '' && expense.expense_id < minExpense_id) return false;
                if (maxExpense_id !== null && maxExpense_id !== '' && expense.expense_id > maxExpense_id) return false;
                if (minAmount !== null && maxAmount  !== '' && expense.amount < minAmount ) return false;
                if (maxAmount  !== null && maxAmount  !== '' && expense.amount > maxAmount ) return false;
                
                return true;
            })
        );
    }, [expense_idQuery, sr_idQuery,descriptionQuery,amountQuery,selectedExpenseType,expenseDateRange,minSR_ID,maxSR_ID,minExpense_id,maxExpense_id,minAmount,maxAmount]);

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 px-5 w-full flex md:items-center md:flex-row flex-col gap-5">
                    {/* <div className="flex  items-center w-72 gap-2">
                       
                        <Link to="/sr/add" className="btn btn-primary  gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Create SR
                        </Link>
                    </div> */}
                    <h3 className="flex text-xl w-full font-semibold justify-center">Expense List</h3>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                {isPreviewVisible && previewImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-96" />
            <button
              className="mt-2 bg-red-500 p-2 text-white rounded hover:bg-red-700"
              onClick={() => setIsPreviewVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {loader &&
        <LoadingOverlay visible={loader} loaderProps={{ children: 'Loading...' }} />
    }
                    <DataTable
                        className="whitespace-nowrap "
                        withColumnBorders
                        withTableBorder 
                        records={records}
                        columns={[                     
                            {
                                accessor: 'ExpenseID',
                                title:"Expense ID",
                                sortable: true,
                                render: ({ expense_id }) => (
                                    <div className="flex items-center justify-center font-semibold">
                                        <div>{expense_id}</div>
                                    </div>
                                ),
                                filter: (
                                  <Box>
                                    <TextInput
                                      label="Expense ID"
                                      description="Show ID's whose Expense ID include the specified Number"
                                      placeholder="Search Expense ID's..."
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
                                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setExpense_idQuery('')}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                                          <line x1="18" y1="6" x2="6" y2="18" />
                                          <line x1="6" y1="6" x2="18" y2="18" />
                                          </svg>
                                        </ActionIcon>
                                      }
                                      value={expense_idQuery}
                                      onChange={(e) => setExpense_idQuery(e.currentTarget.value)}
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
                                            <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setMinExpense_id('')}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                                stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                                              <line x1="18" y1="6" x2="6" y2="18" />
                                              <line x1="6" y1="6" x2="18" y2="18" />
                                              </svg>
                                            </ActionIcon>
                                            </Box>
                                          }
                                        value={minExpense_id}
                                        onChange={setMinExpense_id}
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
                                            <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setMaxExpense_id('')}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                                stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                                              <line x1="18" y1="6" x2="6" y2="18" />
                                              <line x1="6" y1="6" x2="18" y2="18" />
                                              </svg>
                                            </ActionIcon>
                                            </Box>
                                          }
                                        value={maxExpense_id}
                                        onChange={setMaxExpense_id}
                                        style={{ flex: 1 }}
                                        // styles={{ input: { width: 60 } }}
                                      />
                                    </Box>
                                  </Box>
                                  ),
                                  filtering: expense_idQuery !== '' || (minExpense_id !== '' && minExpense_id !== null) || (maxExpense_id !== '' && maxExpense_id !== null),
                            },
                            {
                                accessor: 'SR ID',
                                title:"SR ID",
                                sortable: true,
                                render: ({ sr_id }) => (
                                    <div className="flex items-center justify-center font-semibold">
                                        <div>{sr_id}</div>
                                    </div>
                                ),
                                filter: (
                                  <Box>
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
                            {
                                accessor: 'expenses_type',
                                title:'Expenses Type',
                                sortable: true,
                                render: ({ category_name }) => <div className="flex  justify-center font-semibold">{category_name}</div>,
                                filter: (
                                    <MultiSelect
                                        label="Filter by Expense Type"
                                        placeholder="Select Expense Type..."
                                        data={category}
                                        value={selectedExpenseType}
                                        onChange={setSelectedExpenseType}
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
                                filtering: selectedExpenseType.length > 0,
                            },
                            {
                                accessor: 'Date',
                                title:'Expense Date',
                                sortable: true,
                                render: ({ formatted_expense_date }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{formatted_expense_date}</div>
                                    </div>
                                ),
                                filter: ({ close }) => (
                                    <Stack>
                                      <DatePicker
                                        maxDate={new Date()}
                                        type="range"
                                        value={expenseDateRange}
                                        onChange={setExpenseDateRange}
                                        w="300px"
                                      />
                                      <Button
                                        disabled={!expenseDateRange}
                                        variant="light"
                                        onClick={() => {
                                          setExpenseDateRange(undefined);
                                          close();
                                        }}
                                      >
                                        Clear
                                      </Button>
                                    </Stack>
                                  ),
                                  filtering: Boolean(expenseDateRange),
                            },

                            {
                                accessor: 'Description',
                                sortable: false,
                                render: ({ description }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{description}</div>
                                    </div>
                                ),
                                filter: (
                                    <TextInput
                                      label="Description"
                                      description="Show Descriptions whose Description include the specified Text"
                                      placeholder="Search Descriptions..."
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
                                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setDescriptionQuery('')}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                                          <line x1="18" y1="6" x2="6" y2="18" />
                                          <line x1="6" y1="6" x2="18" y2="18" />
                                          </svg>
                                        </ActionIcon>
                                      }
                                      value={descriptionQuery}
                                      onChange={(e) => setDescriptionQuery(e.currentTarget.value)}
                                    />
                                  ),
                                  filtering: descriptionQuery !== '',
                            },
                            {
                                accessor: 'Amount',
                                title: 'Amount',
                                // sortable: true,
                                render: ({ amount }) => <div className="font-semibold">{amount}</div>,
                                filter: (<Box>
                                    <TextInput
                                      label="Amount"
                                      description="Show Amounts which Amount include the specified Number"
                                      placeholder="Search Amounts..."
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
                                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setAmountQuery('')}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                                          <line x1="18" y1="6" x2="6" y2="18" />
                                          <line x1="6" y1="6" x2="18" y2="18" />
                                          </svg>
                                        </ActionIcon>
                                      }
                                      value={amountQuery}
                                      onChange={(e) => setAmountQuery(e.currentTarget.value)}
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
                                            <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setMinAmount('')}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                                stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                                              <line x1="18" y1="6" x2="6" y2="18" />
                                              <line x1="6" y1="6" x2="18" y2="18" />
                                              </svg>
                                            </ActionIcon>
                                            </Box>
                                          }
                                        value={minAmount}
                                        onChange={setMinAmount}
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
                                            <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setMaxAmount('')}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                                                stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                                              <line x1="18" y1="6" x2="6" y2="18" />
                                              <line x1="6" y1="6" x2="18" y2="18" />
                                              </svg>
                                            </ActionIcon>
                                            </Box>
                                          }
                                        value={maxAmount}
                                        onChange={setMaxAmount}
                                        style={{ flex: 1 }}
                                        // styles={{ input: { width: 60 } }}
                                      />
                                    </Box>
                                  </Box>
                                  ),
                                  filtering: amountQuery !== '' || (minAmount !== '' && minAmount !== null) || (maxAmount !== '' && maxAmount !== null),
                            },
                            {
                                accessor: 'Attachments',
                                title:'Attachments',
                                sortable: true,
                                render: ({ attachments }) => (<div className="font-semibold"> <ul>
                                {attachments && attachments.length > 0 ? (
                                  attachments.map((attachment, index) => (
                                    <li><a className="text-blue-500 cursor-pointer " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a></li>
                                  ))
                                ) : (
                                  <span>No Attachments</span>
                                )}
                                </ul></div> ),
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

export default ExpenseList;
