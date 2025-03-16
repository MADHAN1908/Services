
import React, { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { DataTable } from 'mantine-datatable';
import { Button, Checkbox } from "@mantine/core";
import { ticketService } from "../../services/ticketService";
import { solutionService } from "../../services/solutionService";
import { getPriorty,getStatus } from '../../utils/commonFunction';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/airbnb.css";
import 'flatpickr/dist/flatpickr.css';

const TicketDetails = () => {
  const navigate = useNavigate();

  const { id  } =useParams();
  const [ticket,setTicket] = useState<any>({});
  const [solutions,setSolutions] = useState<any[]>([]);
  const [date,setDate] = useState<any>('');

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
            setSolutions(response.TicketSolutions);
        } catch (error) {
            return ('Something Went Wrong');
        }
    }
    useEffect(() => {
      GetTicket();
      GetSolutions();
    }, []);

  const [customerRating, setCustomerRating] = useState(0);
  const [customerComment, setCustomerComment] = useState("");
  const [previewImage, setPreviewImage] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);


  const handleEditRow =async (id :any, field:any, value:any) => {
    try {
      const response = await solutionService.updateSolution({[field] :value,'solution_id':id},id);
      if(response.response == "Success"){
          GetSolutions();
      }
      } catch (error) {
      return ('Something Went Wrong');
  }
    
  };

  const handleUpdateTime =async (id :any, field:any) => {
    try {
      if(date){
        const updatedDate = new Date(date);
        updatedDate.setHours(updatedDate.getHours() + 1);
      const response = await ticketService.updateTicket({[field] :date},id);
      if(response.response == "Success"){
          GetTicket();
          if(field ==="customer_in_time"){
            setDate(updatedDate);
          }
      }
    }
      } catch (error) {
      return ('Something Went Wrong');
  }    
  };

  const handleSubmitReview =async () => {
    try {
      // console.log(1);
      // console.log(customerComment,customerRating);
      if(customerRating > 0 && customerComment.trim() !== ''){
        // console.log(2);
      const response = await ticketService.updateTicket({'customer_rating':customerRating,'customer_comment':customerComment,'status':'Y'},Number(id));
      if(response.response == "Success"){
          GetTicket();
          // console.log(3);
      }
    }
      } catch (error) {
      return ('Something Went Wrong');
  }
    
  };


  const handlePreview = (attachment: any) => {
    const fileURl =`http://localhost:3700/api/v1${attachment}`;
    setPreviewImage(fileURl);
    setIsPreviewVisible(true);
  };




  return (
    <div>
    
    <div className=" p-6   panel px-0 border-white-light dark:border-[#1b2e4b]" style={{ maxHeight: "900px" }}>
      <div className="ticket-info p-2 mb-6">
        <h2 className="text-2xl font-bold mb-2">{ticket?.sr_desc}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p className="text-gray-700">Status: {getStatus(ticket.sr_status)}</p>
          <p className="text-gray-700">Machine: {ticket?.machine}</p>
          <p className="text-gray-700">Arrive Date: {ticket?.plan_in_date}</p>
          
          <div className="space-x-4 my-6 ">
          {ticket.assigned_to && ticket.plan_in_time && <>
          {(!ticket.customer_out_time || !ticket.customer_in_time) &&  
          <Flatpickr 
              value={date} 
              options={{ dateFormat: 'd-M-Y H:i',
              position: 'auto left', 
              minDate: ticket.plan_in_time, 
              maxDate: ticket.expected_date, 
              enableTime: true,
              time_24hr:true }} 
              className="form-input w-52"  
              onChange={(date) => setDate(date[0])}
              />
}
              {!ticket.customer_in_time && 
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={()=>handleUpdateTime(ticket.sr_id,"customer_in_time")}
          >
            Submit In Time
          </button>
          }{!ticket.customer_out_time && ticket.customer_in_time && 
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={()=>handleUpdateTime(ticket.sr_id,"customer_out_time")}
          >
            Submit Out Time
          </button>
}
</> } 
          </div>
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


        <h3 className="flex text-xl font-semibold pl-4 justify-center mb-4">Issue Resolutions</h3>
      
      <div>
      <DataTable
          key={solutions.length}
          records={solutions}
          columns={[
            
            {
              accessor: "status",
              title: "Acceptance",
              render: (row) => (
                <div className="flex space-x-2">
                  {row.service_status=='C' && <>
                  <button
                    onClick={() => handleEditRow(row.solution_id, "customer_acceptance", true)}
                    className={`px-2 py-1 rounded ${
                      row.customer_acceptance == true ? "bg-green-500 text-white" : "bg-gray-200"
                    }`}
                  >
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
                  <button
                    onClick={() => handleEditRow(row.solution_id, "customer_acceptance", false)}
                    className={`px-2 py-1 rounded ${
                      row.customer_acceptance == false ? "bg-red-500 text-white" : "bg-gray-200"
                    }`}
                  >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  </button>
                  </>
            }
                </div>
              ),
            },
            {
                accessor: "remark",
                title: "Feedback",
                render: (row) => (
                  <textarea
                    value={row.customer_feedback}
                    onBlur={(e) => handleEditRow(row.solution_id, "customer_feedback", e.target.value)}
                    className="form-input w-full bg-transparent border-0 focus:outline-none resize-none"
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement; 
        target.style.height = "auto"; 
        target.style.height = `${target.scrollHeight}px`; 
      }}
      style={{
        width: "100%", 
        minWidth: "200px", 
        minHeight: "40px", 
        maxHeight: "200px",
        whiteSpace: "pre-wrap", 
        wordBreak: "break-word",
        overflow: "hidden", 
      }}
                  />
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
                render: (row) => (
                  <div className="flex space-x-2">
                    <ul>
                    {row.before_attachments && row.before_attachments.length > 0 ? (
                      row.before_attachments.map((attachment:any, index:number) => (
                        <li><a className="cursor-pointer text-blue-500 " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a></li>
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
                render: ({actions}) => (
                  <div className="flex items-center font-semibold">
                      <div>{actions}</div>
                  </div>
                ),
              },
              {
                accessor: "attachments",
                title: "Solved Attachments",
                render: (row) => (
                  <div className="flex space-x-2">
                    <ul>
                    {row.after_attachments && row.after_attachments.length > 0 ? (
                      row.after_attachments.map((attachment:any, index:number) => (
                        <li><a className="cursor-pointer text-blue-500 " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a></li>
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
              title: "Service Status",
              render: ({service_status}) => (
                <div className="flex items-center font-semibold">
                    <div>{getStatus(service_status)}</div>
                </div>
              ),
            },
            {
                accessor: "s_remark",
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
                render: ({responsibility_name}) => (
                    <div className="flex items-center font-semibold">
                    <div>{responsibility_name}</div>
                </div>
                ),
              },
              {
                accessor: "Solvedate",
                title: "Solve/Completion Date",
                render: ({formated_date}) => (
                    <div className="flex items-center font-semibold">
                    <div>{formated_date}</div>
                </div>
                ),
              },
            
            
          ]}
          withTableBorder
          withColumnBorders
          className="bg-white shadow-lg rounded-lg"
        />
      </div>
{!(ticket.customer_rating && ticket.customer_comment) && ticket.sr_status=== 'C' &&
      <div className="space-y-6 my-4">
         <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
           <h3 className="text-xl font-semibold mb-4">Review</h3>
           <div className="space-y-4">
           <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Rating:</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={`text-2xl ${
                value <= customerRating ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => setCustomerRating(value)}
            >
              {value <= customerRating ? (
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
        <p className="text-gray-600 mt-2">
          Selected Rating: {customerRating > 0 ? customerRating : "None"}
        </p>
      </div>
             <div>
               <label className="block text-gray-700 font-medium">Customer Comment:</label>
               <textarea
                 value={customerComment}
                 onChange={(e) => setCustomerComment(e.target.value)}
                 className="w-full p-2 border rounded"
                 placeholder="Add a Comment"
               />
             </div>
             <button
               className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
               onClick={() => handleSubmitReview()}
             >
               Add Review
             </button>
           </div>
         </div>
       </div>
}
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

export default TicketDetails;
