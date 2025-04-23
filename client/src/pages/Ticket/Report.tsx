import { useEffect, useState,useRef } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { useReactToPrint } from 'react-to-print';
import { DatePickerInput, type DatesRangeValue } from '@mantine/dates';
import { LoadingOverlay } from "@mantine/core";
import { getServiceType,getStatus } from '../../utils/commonFunction';
import ServiceReport from './ServiceReport';
import dayjs from 'dayjs';


const Report = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    const contentRef = useRef<HTMLDivElement| null>(null);
    const [srDateRange, setSRDateRange] = useState<DatesRangeValue>([
        dayjs().subtract(1, 'month').toDate(), // One month back
        dayjs().toDate(), 
      ]);

    const [ticket,setTicket]=useState([])
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail])
   
    useEffect(() => {
        dispatch(setPageTitle('Report Form'));
    },[]);

    const handleSubmit = async () => {
        try {
          setLoader(true);
            const response = await ticketService.getTicketsReport({from_date : srDateRange[0],to_date : srDateRange[1]});
            setTicket(response.TicketsReport);
            setLoader(false);
            } catch (error) {
              setLoader(false);
            return ('Something Went Wrong');
        }
    }

    const handlePrint = useReactToPrint ({ contentRef });

    
    return (
        <div>
     
            <div className="pt-5 grid  grid-cols-1 gap-6">

                <div className="panel" id="forms_grid">
                    <div className="flex items-center justify-center mb-5 print:hidden">
                        <h5 className="font-semibold text-lg dark:text-white-light">Report Form</h5>
                    </div>
                    <div className="mb-5 print:hidden">
                        <form className="space-y-5" >
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                        <div>
                                    <label htmlFor="table">Table *</label>
                                    <select name="table"
                                        className="form-select">
                                        {/* <option value=" ">Choose Table Name</option> */}
                                        {/* <option value="1">Users</option> */}
                                        <option value="service_report">Service Report</option>
                                    </select>
                                </div>
                                {/* <div>
                                    <label htmlFor="filter">Filter (Optional)</label>
                                    <input name="filter" type="text" placeholder="Enter SQL filter Query " className="form-input" />
                                </div> */}
                                <div>
                                <DatePickerInput
                                  type="range"
                                  label="Pick dates range"
                                  placeholder="Pick dates range"
                                  value={srDateRange}
                                  onChange={setSRDateRange}
                                  dropdownType="modal"
                                  valueFormat='DD-MMM-YYYY'
                                  maxDate={new Date()}
                                 />
                                </div>
                            
                                {/* <div>
                                    <label htmlFor="filetype">File Type *</label>
                                    <select name="filetype"
                                        className="form-select">
                                        <option value=" ">Choose File Type</option>
                                        <option value="Excel">Excel</option>
                                        <option value="CSV">CSV</option>
                                        <option value="PDF">PDF</option>
                                    </select>
                                </div> */}
                            </div>

                            <button type='button'  onClick={() => handleSubmit()} className="btn btn-primary !mt-6">
                                Submit
                            </button>
                            {ticket && 
                             <div>Records : {ticket.length}</div>}
                            {ticket && ticket.length > 0 &&
                            <button type='button'  onClick={() => handlePrint()} className="btn btn-primary !mt-6">
                                Print
                            </button>
}
                        </form>
                        {loader &&
                        <LoadingOverlay visible={loader} loaderProps={{ children: 'Loading...' }} />
                        }
                    </div>
                    {ticket && <ServiceReport ref={contentRef} ticket={ticket} /> }
                
<div  className="print-container hidden print:block">
  {/* Print Header (Repeats on every page) */}
  

  {/* Main Report Content */}
  <div className="print-content">
  <div className="">
    <h2 className="text-center text-lg font-bold">
      VAMTEC MACHINES & AUTOMATION PRIVATE LIMITED
    </h2>
    <p className="text-center text-sm">
      270/4, Galaxy Company Road, Ayanambakkam, Chennai - 600 095.
    </p>
    <p className="text-center text-sm">
      Phone: 9171177915, Email: engg@vamtec.net
    </p>
    <div className="bg-green-500 text-white p-2 mt-4 text-center font-semibold">
      SERVICE REPORT
    </div>
  </div>
    {ticket &&
      ticket.map((ticket, index) => (
        <div
          key={index}
          className={`max-w-4xl mx-auto  border p-6 ${
            index !== 0 ? "page-break" : ""
          }`}
        >
          {/* Ticket-specific details */}
          <table className="w-full border mt-4">
            <tbody>
              <tr>
                <td className="border p-2 font-semibold">
                  Customer: {ticket.company_name}
                </td>
                <td className="border p-2 font-semibold">
                  Date: {ticket.srf_date}
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">
                  Engineer Name: {ticket.assigned_to_name}
                </td>
                <td className="border p-2 font-semibold">
                  Machine: {ticket.machine}
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">
                  Service Type: {getServiceType(ticket.service_type)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Solutions Table */}
          <table className="w-full border mt-4">
            <thead className="table-header  ">
              <tr className="bg-gray-200 first-header pt-52">
                <th className="border p-2">Sl. No.</th>
                <th className="border p-2">Problem</th>
                <th className="border p-2">Actions</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Completion Date</th>
                <th className="border p-2">Status Remark</th>
                <th className="border p-2">Customer Remark</th>
              </tr>
            </thead>
            <tbody>
              {ticket.solutions && ticket.solutions.length > 0 ? (
                ticket.solutions.map((solution, i) => (<>
                
                  <tr key={solution.solution_id} className=''>
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{solution.problem}</td>
                    <td className="border p-2">{solution.actions}</td>
                    <td className="border p-2">{getStatus(solution.status)}</td>
                    <td className="border p-2">{solution.completion_date}</td>
                    <td className="border p-2">{solution.status_remark}</td>
                    <td className="border p-2">{solution.customer_remark}</td>
                  </tr>
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border p-2 text-center">
                    No solutions recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-4 border p-4">
            <p className="font-semibold">Customer's Comment:</p>
            <p>{ticket.customer_comment}.</p>
        </div>
        
        <div className="mt-4">
            <table className="w-full border">
                <tr>
                    <th className="border p-2">Contact Person Name</th>
                    <th className="border p-2">Reporting</th>
                    <th className="border p-2">Reported Time</th>
                    <th className="border p-2">Customer's Report Time</th>
                    <th rowSpan={3} className="border p-2 w-52 align-top "> <p className=" font-semibold">For VAMTEC Machines & Automation Pvt. Ltd</p></th>
                </tr>
                <tr>
                    <td rowSpan={2} className="border p-2 ">{ticket.contact_person_name}</td>
                    <td className="border p-2">In</td>
                    <td className="border p-2">{ticket.actf_in_time}</td>
                    <td className="border p-2">{ticket.customerf_in_time}</td>
                </tr>
                <tr>
                    <td className="border p-2">Out</td>
                    <td className="border p-2">{ticket.actf_out_time}</td>
                    <td className="border p-2">{ticket.customerf_out_time}</td>
                </tr>
            </table>
        </div>
        </div>
      ))}
  </div>
</div>

                </div>
            </div>
        </div>
    );
};

export default Report;
