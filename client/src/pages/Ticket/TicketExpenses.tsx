import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { ticketService } from '../../services/ticketService';
import { LoadingOverlay } from '@mantine/core';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';


const TicketExpenses = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState<any[]>([]);
    const [ticket,setTicket] = useState<any>({});
    const [loader, setLoader] = useState(false);
    const { id  } =useParams();

    const navigate = useNavigate();
    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = userAuthDetail?.role ? userAuthDetail.role : 'Manage';

    const [previewImage, setPreviewImage] = useState('');
      const [isPreviewVisible, setIsPreviewVisible] = useState(false);

    useEffect(() => {
        if (!userAuthDetail?.token || role === 'Manage') {
            navigate('/auth/login');
        }
    }, [userAuthDetail]);
    const GetTicket = async () => {
              try {
                setLoader(true);
                  const response = await ticketService.getTicket(Number(id));
                  setTicket(response.TicketDetails);
                setLoader(false);
              } catch (error) {
                setLoader(false);
                  return ('Something Went Wrong');
              }
          }

     const GetTicketExpenses = async () => {
            try {
                setLoader(true);
                const response = await expenseService.getExpenses(id);
                setItems(response.Expenses);
                setInitialRecords(response.Expenses);
                setLoader(false);
                } catch (error) {
                    setLoader(false);
                return ('Something Went Wrong');
            }
        }
        
        useEffect(() => {
            dispatch(setPageTitle('Ticket Expenses'));
            GetTicket();
            GetTicketExpenses();
        },[]); 

        const handleDeleteRow = async (expense_id : any ) => {
            if (window.confirm('Are you sure want to delete selected row ?')) {
            try {
                setLoader(true);
              if(expense_id){
              const response = await expenseService.deleteExpense(expense_id);
              if(response.response == "Success"){
                GetTicketExpenses();
              }
            }
            setLoader(false);
            } catch (error) {
                setLoader(false);
              return ('Something Went Wrong');
          } 
        }
          };
        
          const handlePreview = (attachment: any) => {
            const fileURl =`http://localhost:3700/api/v1${attachment}`;
            setPreviewImage(fileURl);
            setIsPreviewVisible(true);
          };

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
                    { ticket.sr_status !== 'Z' &&
                       <Link to={`/sr/expenses/add/${id}`} className="btn btn-primary  gap-2">
                           <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                               <line x1="12" y1="5" x2="12" y2="19"></line>
                               <line x1="5" y1="12" x2="19" y2="12"></line>
                           </svg>
                           Add Expenses
                       </Link>
}
                   </div>
                   <div className="flex  items-center w-72 gap-2">
                <h3 className="flex text-xl w-full font-semibold justify-center"> Service Request Expenses </h3>
                </div>
                    {/* <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div> */}
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
                                render: ({ expense_id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <button type="button" disabled={ticket.sr_status === "Z"}  className="flex hover:text-danger" onClick={(e) => handleDeleteRow(expense_id)}>
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
                                    </div>
                                ),
                            },
                            {
                                accessor: 'expenses_id',
                                title:'Expenses Type',
                                sortable: true,
                                render: ({ category_name }) => <div className="flex  justify-center font-semibold">{category_name}</div>,
                            },
                            {
                                accessor: 'expenses_date',
                                title:'Expenses Date',
                                sortable: true,
                                render: ({ formatted_expense_date }) => <div className="flex  justify-center font-semibold">{formatted_expense_date}</div>,
                            },
                            {
                                accessor: 'Description',
                                sortable: true,
                                render: ({ description }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{description}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Amount',
                                title: 'Amount',
                                // sortable: true,
                                render: ({ amount }) => <div className="font-semibold">{amount}</div>,
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

export default TicketExpenses;
