
import React, { useState,useEffect,useRef } from "react";
import { useNavigate,useParams,useLocation,NavLink,unstable_Blocker as useBlocker } from "react-router-dom";
import { DataTable } from 'mantine-datatable';
import { Button,Loader,LoadingOverlay } from "@mantine/core";
import { ticketService } from "../../services/ticketService";
import { solutionService } from "../../services/solutionService";
import { userService } from "../../services/userService";
import { getPriorty,getStatus,showToast } from '../../utils/commonFunction';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

interface SolutionData {
  solution_id:number | '',
  sr_id:number,
  problem:string,
  before_attachments: string[],
  after_attachments:string[],
  actions:string,
  service_status: string,
  status_remark: string,
  responsibility: string,
  status_date: string,
  customer_acceptance:Boolean,
  customer_feedback:string,
}
const ViewTicketDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id  } =useParams();
  const [ticket,setTicket] = useState<any>({});
  const [solutions,setSolutions] = useState<SolutionData[]>([]);

   
  const GetTicket = async () => {
          try {
              const response = await ticketService.getTicket(Number(id));
              setTicket(response.TicketDetails);
          } catch (error) {
              return ('Something Went Wrong');
          }
      }

const GetSolutions = async () => {
        try {
            const response = await solutionService.getTicketSolution(Number(id));
            // setSolutions(response.TicketSolutions);
            if (Array.isArray(response.TicketSolutions) && response.TicketSolutions.length > 0) {
              setSolutions(
                response.TicketSolutions.map((solution:any) => ({
                  solution_id: solution.solution_id,
                  sr_id:solution.sr_id,
                  problem:solution.problem,
                  before_attachments:solution.before_attachments,
                  after_attachments:solution.after_attachments,
                  actions:solution.actions,
                  service_status: solution.service_status,
                  status_remark: solution.status_remark,
                  responsibility: solution.responsibility_name,
                  service_type: solution.service_type,
                  status_date:solution.formated_date,
                  customer_acceptance:solution.customer_acceptance,
                  customer_feedback:solution.customer_feedback,
                }))
              );
              
              
            } 
        } catch (error) {
            return ('Something Went Wrong');
        }
    }
    useEffect(() => {
      GetTicket();
      GetSolutions();
    }, []);
    
   

    

  const [previewImage, setPreviewImage] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);




  const handlePreview = (attachment: any) => {
    const fileURl =`http://localhost:3700/api/v1${attachment}`;
    setPreviewImage(fileURl);
    setIsPreviewVisible(true);
  };



  return (
    <div>
                
    
    <div className=" p-6   panel px-0 border-white-light dark:border-[#1b2e4b]" style={{ maxHeight: "900px" }}>
      <div className="ticket-info p-2 mb-2 ml-2">
        <h2 className="text-2xl font-bold mb-2">{ticket.sr_desc}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p className="text-gray-700">Status: {ticket.sr_status? getStatus(ticket.sr_status): ''}</p>
          <p className="text-gray-700">Machine: {ticket.machine}</p>
          <p className="text-gray-700">Arrive Date: {ticket.plan_in_date}</p>
          <div className="space-x-4 my-2 ">
     { ticket.sr_status === "Z" &&
            <NavLink to={`/sr/expenses/${ticket.sr_id}`} 
            // className="btn btn-primary"
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
                Expense
            </NavLink>
         }
          </div>
          {/* <p className="text-gray-700">Arrive Time: {ticket.time}</p> */}
        </div>
        
      </div>

      {/* Image Preview */}
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

        {/* <h3 className="flex text-xl font-semibold pl-4 justify-center mb-4">Issue Resolutions</h3> */}
      <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                          {/* <div className="flex items-center gap-2"> */}
        <div className="grid grid-cols-1  sm:grid-cols-3 gap-4">
                              <h3 className="flex text-xl font-semibold pl-4 item-center justify-center ">Issue Resolutions</h3>
                          </div>
                      </div>
      <div>
      <DataTable
          key={solutions.length}
          records={solutions}
          columns={[
            {
                accessor: "",
                title: "S.No",
                render: (row,index) => (
                    <div className="flex gap-4 items-center w-max mx-auto">
                      {index+1}            
                  </div>
                ),
              },
            {
              accessor: "problem",
              title: "Problem",
              render: ({problem}) => (
                <div className="flex items-center font-semibold">
                    <div>{problem}</div>
                </div>
              ),
            },
            {
                accessor: "attachments",
                title: "Attachments",
                textAlign : "center",
                width:160,
                render: (row) => (
                  <div className="flex space-x-2">
                    <ul>
                    {row.before_attachments && row.before_attachments.length > 0 ? (
                      row.before_attachments.map((attachment : any, index : number) => (
                        <li className="flex"><a className="text-blue-500 cursor-pointer " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a> 
                       </li>
                      ))
                    ) : (
                      <span>No Attachments</span>
                    )}
                    </ul>
                  </div>
                ),
              },
              {
                accessor: "action",
                title: "Action",
                textAlign : "center",
                render: ({actions}) => (
                <div className="flex items-center font-semibold">
                    <div>{actions}</div>
                </div>
                    ),
                },
                {
                  accessor: "attachments",
                  title: "Solved Attachments",
                  textAlign : "center",
                  // width:160,
                  render: (row) => (
                    <div className="flex space-x-2"><ul>
                      {row.after_attachments && row.after_attachments.length > 0 ? (
                        row.after_attachments.map((attachment : any, index : number) => (
                          <li className="flex"><a className="text-blue-500 cursor-pointer " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a>
                         </li>
                        ))
                      ) : (
                        <span>No Attachments</span>
                      )}
                      </ul>
                    </div>
                  ),
                },
            {
              accessor: "solved",
              title: "SR Status",
              textAlign : "center",
              render: ({service_status}) => (
                   <div className="flex items-center font-semibold">
                                      <div>{getStatus(service_status)}</div>
                    </div>
              ),
            },
            {
              accessor: "Solvedate",
              title: "Target/completion Date",
              textAlign : "center",
              render: ({status_date}) => (
                <div className="flex items-center font-semibold">
                <div>{status_date}</div>
            </div>
              ),
            },
            {
                accessor: "Status Remark",
                title: "Status Remark",
                render: ({status_remark}) => (
                    <div className="flex items-center font-semibold">
                        <div>{status_remark}</div>
                    </div>
                  ),
                },
            {
                accessor: "Responsible",
                title: "Responsiblity",
                render: ({responsibility}) => (
                    <div className="flex items-center font-semibold">
                    <div>{responsibility}</div>
                </div>
                ),
              },
            {
              accessor: "status",
              title: "Customer Acceptence",
              render: (row,index) => (
                <div className="flex space-x-2">
                  {row.customer_acceptance == true &&  
                  <button  className={`px-2 py-1 rounded bg-green-500 text-white`}>
                <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button> 
            }
            {row.customer_acceptance == false &&  
                  <button className={`px-2 py-1 rounded bg-red-500 text-white`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  </button>
            }
                </div>
              ),
            },
            {
                accessor: 'remark',
                title :'Customer Feedback',
                render: (row,index) => (
                    <div className="flex items-center font-semibold">
                        <div>{row.customer_feedback}</div>
                    </div>
                ),
            },
            
          ]}
          withTableBorder
          withColumnBorders
          className="bg-white shadow-lg rounded-lg"
        />
      </div>
      {(ticket.customer_rating && ticket.customer_comment) &&
<div className="space-y-6 my-4">

<div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
  <h3 className="text-xl font-semibold mb-4">Review</h3>
  <div className="space-y-4">
  <div className="mb-4">
<label className="block text-gray-700 font-medium mb-2">Rating:{ticket.customer_rating}</label>
<div className="flex space-x-2">
 {[1, 2, 3, 4, 5].map((value) => (
   <button
     key={value}
     type="button"
     className={`text-2xl ${
       value <= ticket.customer_rating ? "text-yellow-500" : "text-gray-400"
     }`}
   >
     {value <= ticket.customer_rating ? (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  width="48" height="48" fill="gold" stroke="black" stroke-width="1" >
       <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21 12,17.77 5.82,21 7,14.14 2,9.27 8.91,8.26" />
   </svg>
     ) : (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48"  height="48" fill="white" stroke="black" stroke-width="1">
       <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21 12,17.77 5.82,21 7,14.14 2,9.27 8.91,8.26" />
       </svg>
     )}
   </button>
 ))}
</div>
</div>
    <div>
      <label className="block text-gray-700 font-medium">Customer Comment:</label>
      <p className="w-full p-2 border-0 rounded">{ticket.customer_comment}</p>
    </div>
  </div>
</div>
</div>
}

      
    </div>
    </div>
  );
};

export default ViewTicketDetails;
