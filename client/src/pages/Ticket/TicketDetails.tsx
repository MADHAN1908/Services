
import React, { useState,useEffect,useRef } from "react";
import { useNavigate,useParams,useLocation,unstable_Blocker as useBlocker } from "react-router-dom";
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
  responsibility: number | '',
  status_date:Date | '',
  customer_acceptance:Boolean,
  customer_feedback:string,
}
const TicketDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstRender = useRef(true);
  const { id  } =useParams();
  const [ticket,setTicket] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [solutions,setSolutions] = useState<SolutionData[]>([]);
  const [tableData,setTableData] = useState<SolutionData[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
   

  useEffect(() => {
    console.log("Table data updated:", tableData);
  }, [tableData]);
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
                  responsibility: solution.responsibility,
                  service_type: solution.service_type,
                  status_date:solution.status_date,
                  customer_acceptance:solution.customer_acceptance,
                  customer_feedback:solution.customer_feedback,
                }))
              );
              setTableData(
                response.TicketSolutions.map((solution:any) => ({
                  solution_id: solution.solution_id,
                  sr_id:solution.sr_id,
                  problem:solution.problem,
                  before_attachments:solution.before_attachments,
                  after_attachments:solution.after_attachments,
                  actions:solution.actions,
                  service_status: solution.service_status,
                  status_remark: solution.status_remark,
                  responsibility: solution.responsibility,
                  service_type: solution.service_type,
                  status_date:solution.status_date,
                  customer_acceptance:solution.customer_acceptance,
                  customer_feedback:solution.customer_feedback,
                }))
              );
            } 
        } catch (error) {
            return ('Something Went Wrong');
        }
    }
    const GetUsers = async () => {
            try {
                const response = await userService.getAssignUsers();
                setUsers(response.AssignUsers);
                // setInitialRecords(response.AssignTickets);
                console.log(response.AssignUsers);
                } catch (error) {
                return ('Something Went Wrong');
            }
        }
    useEffect(() => {
      GetTicket();
      GetSolutions();
      GetUsers();
    }, []);
    
    const hasUnsavedChangesRef = useRef(hasUnsavedChanges);

useEffect(() => {
  hasUnsavedChangesRef.current = hasUnsavedChanges;
}, [hasUnsavedChanges]);

    useEffect(() => {
      const handleBeforeUnload =async (event: BeforeUnloadEvent) => {
        const confirmLeave = window.confirm("Do you want to save before leaving?");
        if (!confirmLeave) {
          event.preventDefault();
        }else{
         await handleUpdateRow();
        }
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, []);

    useEffect(() => {
      console.log("Table Data before updating:", tableData);
      const handleNavigation = async () => {
        console.log("Check :",hasUnsavedChangesRef.current);
        console.log("Table Data before updating:", tableData);
        if (hasUnsavedChangesRef.current) {
          const confirmLeave = window.confirm("Do you want to save before leaving?");
          if (!confirmLeave) {
            navigate(location.pathname, { replace: true }); // Stay on the same page
          } else {
            await handleUpdateRow(); // Ensure save completes before navigation
          }
        }
      };
    
      // handleNavigation(); // Runs before route changes
      return () => {handleNavigation();};
    }, [location.pathname, navigate]);

    useEffect(() => {
      const changed = isRowsChanged();
      // console.log("State Updated - Changes Detected:", changed); // ✅ Now logs when state updates
      setHasUnsavedChanges(changed);
    }, [tableData]);

// ✅ Function to check if any row has changed
const isRowsChanged = (): boolean => {
  return tableData.some((row) => {
    const originalRow = solutions.find((solution) => solution.solution_id === row.solution_id);
    if (!originalRow) return true;

    return Object.keys(originalRow).some(
      (key) => JSON.stringify(originalRow[key as keyof typeof originalRow]) !== JSON.stringify(row[key as keyof typeof row])
    );
  });
};

useEffect(() => {
  sessionStorage.setItem("tableData", JSON.stringify(tableData));
}, [tableData]);
useEffect(() => {
  sessionStorage.setItem("solutions", JSON.stringify(solutions));
}, [solutions]);

useEffect(() => {
  const savedData = sessionStorage.getItem("tableData");
  console.log("localStorage",savedData)
  if (savedData) {
    setTableData(JSON.parse(savedData));
  }
}, []);


const handleUpdateRow = async () => {
  setLoading(true);
  const savedData = sessionStorage.getItem("tableData");
  const savedSolution  = sessionStorage.getItem("solutions");
  console.log("localStorage", savedData);

  if (!savedData) {
    console.log("No saved data found.");
    setLoading(false);
    return;
  }

  const updatedData = JSON.parse(savedData);
  const solutionData = JSON.parse(savedSolution);
  setTableData(updatedData); // Update state, but don’t await it
  setSolutions(solutionData);
  console.log("Table Data before updating:", updatedData);

  try {
    await Promise.all(
      updatedData.map(async (row :any) => {
        console.log(1);
        if (row.solution_id) {
          console.log(2);
          const originalRow = solutionData.find((solution : any) => solution.solution_id === row.solution_id);
    const isChanged = Object.keys(originalRow).some(key => 
        JSON.stringify(originalRow[key as keyof SolutionData]) !== JSON.stringify(row[key as keyof SolutionData])
    );
          if (isChanged) {
            console.log(3);
            await updateRow(row);
          }
        } else if (row.problem.trim() !== "") {
          console.log(4);
          await addRow(row);
        }
      })
    );

    console.log("Changes saved successfully!");
  } catch (error) {
    console.error("Something Went Wrong:", error);
  } finally{
    setLoading(false);
  }
};




  const [previewImage, setPreviewImage] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);


  const handleAddRow = async () => {
    try {
      setLoading(true);
        let updatedTableData = [...tableData];
        let newRowAdd = false;
        const hasEmptyRow = updatedTableData.some(row => row.solution_id === '' && row.problem.trim() === '');
        await Promise.all(
            updatedTableData.map(async (row) => {
                if (row.solution_id) {
                  if(isRowChanged(row)){
                    await updateRow(row);
                  }
                } else {
                    if (row.problem.trim() !== "") { 
                       await addRow(row);
                       newRowAdd = true;
                    }
                }
            })
            
        );
        if(!hasEmptyRow || newRowAdd){
        setTableData((prevData) => [...prevData,
          {
            solution_id: '',
            sr_id: ticket.sr_id,
            problem: "",
            before_attachments: [],
            after_attachments: [],
            actions: "",
            service_status: "P",
            status_remark: "",  
            responsibility: '',
            status_date: '', 
            customer_acceptance: false, 
            customer_feedback: "",
        }
        ]);
      }
    } catch (error) {
        console.error("Something Went Wrong:", error);
    }finally{
      setLoading(false);
    }
};



  const updateRow =async (row:any) => {
    try {
      // console.log(row);
      setLoading(true);
      const response = await solutionService.updateSolution(row,row.solution_id);
      if(response.response == "Success"){
        console.log('solution',response.solution);
        const updatedRow = {
          solution_id: response.solution.solution_id || row.solution_id,
          sr_id: response.solution.sr_id || row.sr_id,
          problem: response.solution.problem || row.problem,
          before_attachments: response.solution.before_attachments || row.before_attachments,
          after_attachments: response.solution.after_attachments || row.after_attachments,
          actions: response.solution.actions || row.actions,
          service_status: response.solution.service_status || row.service_status,
          status_remark: response.solution.status_remark || row.status_remark,
          responsibility: response.solution.responsibility || row.responsibility,
          status_date: response.solution.status_date || row.status_date,
          customer_acceptance: response.solution.customer_acceptance || row.customer_acceptance,
          customer_feedback: response.solution.customer_feedback || row.customer_feedback,
      };

      if (!updatedRow.solution_id) {
        console.log("Error: Solution ID is missing in the response.");
        return;
    }
      
      setSolutions((prev) => 
          prev.map((r) => (r.solution_id === updatedRow.solution_id ? updatedRow : r))
      );

    
      setTableData((prev) => 
          prev.map((r) => (r.solution_id === updatedRow.solution_id ? updatedRow : r))
      );
        console.log(solutions);
        console.log(tableData);
      }
      } catch (error) {
      return ('Something Went Wrong');
  }finally{
    setLoading(false);
  }
    
  };

  const addRow =async (row:any) => {
    try {
      setLoading(true);
      console.log(row);
      if (row.problem.trim() !== "") { 
      const response = await solutionService.addSolution(row);
      if(response.response == "Success"){
        console.log(response.solution);
        const newRow = {
          solution_id: response.solution.solution_id,
          sr_id: response.solution.sr_id,
          problem: response.solution.problem,
          before_attachments: response.solution.before_attachments,
          after_attachments: response.solution.after_attachments,
          actions: response.solution.actions,
          service_status: response.solution.service_status,
          status_remark: response.solution.status_remark,
          responsibility: response.solution.responsibility,
          status_date: response.solution.status_date,
          customer_acceptance: response.solution.customer_acceptance,
          customer_feedback: response.solution.customer_feedback,
      };

      setSolutions((prev) => [...prev, newRow]);

      setTableData((prev) =>prev.map((r) => (r === row ? newRow : r)));

      console.log("Row Added Successfully");
          console.log(solutions);
          console.log(tableData);
      }
      return true;
    }else{
      showToast("Problem Description is required ", "error");
      return false;
    }
      } catch (error) {
      return false;
  } finally{
    setLoading(false);
  }
    
  };

  const isRowChanged = (row: SolutionData): boolean => {
    const originalRow = solutions.find(solution => solution.solution_id === row.solution_id);
    if (!originalRow) return false; 
    return Object.keys(originalRow).some(key => 
        JSON.stringify(originalRow[key as keyof SolutionData]) !== JSON.stringify(row[key as keyof SolutionData])
    );
};





const handleRowChange = (id:any, field: string, value: any,index: number) => {
  setTableData((prev) =>
      prev.map((row,i) =>
           row.solution_id === id ? { ...row, [field]: value } : row
      ));
  
};


  const handleArriveDate =async (id :any,key: any) => {
    try {
      var data :any ={};
      if (key == "act_in_time"){
        data.act_in_time = new Date();
        data.status = 'W';
      }else if(key === "act_out_time"){
        data.act_out_time = new Date();
        data.status = 'C';
      }

      const response = await ticketService.updateTicket(data,id);
      if(response.response == "Success"){
          GetTicket();
      }
      } catch (error) {
      return ('Something Went Wrong');
  }
  };

  const handleDeleteRow = async (row:any,rowIndex:number) => {
    try {
      setLoading(true);
      console.log(rowIndex);
      if(row.solution_id){
      const response = await solutionService.deleteSolution(row.solution_id);
      if(response.response == "Success"){
        console.log(response.DeleteSolution);
    setSolutions((prev) => prev.filter((r) => r.solution_id !== row.solution_id));
    setTableData((prev) => prev.filter((r) => r.solution_id !== row.solution_id));
      }
    }else{
      setTableData((prev) => prev.filter((_, index) => index !== rowIndex));
    }
    } catch (error) {
      return ('Something Went Wrong');
  } finally{
    setLoading(false);
  }
  };

  const handlePreview = (attachment: any) => {
    const fileURl =`http://localhost:3700/api/v1${attachment}`;
    setPreviewImage(fileURl);
    setIsPreviewVisible(true);
  };

  const handleFileUpload = async (row: any,field:string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 
    if (!file) return; 
    setLoading(true);
    if(!row.solution_id){
      const result = await addRow(row);
      if(result){
        showToast("Row is updated ,Try now to upload Image", "error");
        setLoading(false);
      }
      return;
    } 
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 2 * 1024 * 1024; 

    if (!allowedTypes.includes(file.type)) {
        showToast("Only JPG, PNG, GIF, and WEBP images are allowed.", "error");
        setLoading(false);
        return;
    }
    if (file.size > maxSize) {
        showToast("File size must be less than 2MB.", "error");
        setLoading(false);
        return;
    }
    
    try {
      const form = new FormData();
      form.append('solution_id', row.solution_id);
      if (field === "before_attachments" ) {
        if (Array.isArray(row.before_attachments)) {
        row.before_attachments.forEach((photo: any) => {
            if (typeof photo === "string") { // Ensure it's a valid string
                form.append("before_attachments", photo);
            }
        });
      }else{
        form.append("after_attachment", '');
      }
        form.append("before_attachment_upload", "attachment");
    }

    if (field === "after_attachments" ) {
      if (Array.isArray(row.after_attachments)) {
        row.after_attachments.forEach((photo: any) => {
            if (typeof photo === "string") {
                form.append("after_attachments", photo);
            }
        });
      }else{
      form.append("after_attachment", '');
      }
        form.append("after_attachment_upload", "attachment");
    }

      form.append('image', file);
      const response = await solutionService.uploadAttachment(form,row.solution_id);
      console.log(response.solution);
      if(response.response === "Success"){
        console.log(response.solution);
          if(field == 'before_attachments'){
            setTableData((prev) => prev.map((row) =>
              row.solution_id === response.solution.solution_id ? { ...row, before_attachments: response.solution.before_attachments } : row
          )
      );
      setSolutions((prev) => prev.map((row) =>
        row.solution_id === response.solution.solution_id ? { ...row, before_attachments: response.solution.before_attachments } : row
    )
);
          }
          if(field == 'after_attachments'){
            setTableData((prev) => prev.map((row) =>
              row.solution_id === response.solution.solution_id ? { ...row, after_attachments: response.solution.after_attachments } : row
          )
      );
      setSolutions((prev) => prev.map((row) =>
        row.solution_id === response.solution.solution_id ? { ...row, after_attachments: response.solution.after_attachments } : row
    )
);
          }
      }
      } catch (error) {
      return('Something Went Wrong');
  } finally{
    setLoading(false);
  }

};

const handleFileDelete = async (id : number,image_path : any,attachments : any,field :any) => {
  
  const isConfirmed = window.confirm("Are you sure you want to delete this attachment?");
  if (!isConfirmed) return;
  setLoading(true);
  try {
    const updatedAttachments = attachments.filter((attachment:any) => attachment !== image_path);
   console.log(updatedAttachments);
    const response = await solutionService.deleteAttachment({updatedAttachments, field, image_path},id);
    console.log(response.solution);
    if(response.response === "Success"){
      console.log(response.solution);
        if(field == 'before_attachments'){
          setTableData((prev) => prev.map((row) =>
            row.solution_id === response.solution.solution_id ? { ...row, before_attachments: response.solution.before_attachments } : row
        )
    );
    setSolutions((prev) => prev.map((row) =>
      row.solution_id === response.solution.solution_id ? { ...row, before_attachments: response.solution.before_attachments } : row
  )
);
        }
        if(field == 'after_attachments'){
          setTableData((prev) => prev.map((row) =>
            row.solution_id === response.solution.solution_id ? { ...row, after_attachments: response.solution.after_attachments } : row
        )
    );
    setSolutions((prev) => prev.map((row) =>
      row.solution_id === response.solution.solution_id ? { ...row, after_attachments: response.solution.after_attachments } : row
  )
);
        }
    }
    } catch (error) {
    return('Something Went Wrong');
} finally{
  setLoading(false);
}

};

const allCompleted = solutions.length > 0 && solutions.every(row => row.service_status === 'C');

  return (
    <div>
                {/* <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                    <button
        onClick={() => navigate(-1)}
        // onClick={(e) => handleLinkClick(e)}
        className="flex w-20 space-x-2 px-2 my-2 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
      ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    //   className="icon-left-arrow"
    >
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
        <span className="font-medium">Back</span>
      </button>
                    </li>
                    
                </ul> */}
    
    <div className=" p-6   panel px-0 border-white-light dark:border-[#1b2e4b]" style={{ maxHeight: "900px" }}>
      <div className="ticket-info p-2 mb-2 ml-2">
        <h2 className="text-2xl font-bold mb-2">{ticket.sr_desc}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <p className="text-gray-700">Status: <span className="text-blue-800">{ticket.sr_status? getStatus(ticket.sr_status): ''}</span></p>
                    <p className="text-gray-700">Machine: <span className="text-blue-800">{ticket.machine}</span></p>
                    {ticket.plan_in_date && 
                    <p className="text-gray-700">Arrive Date: <span className="text-blue-800">{ticket.plan_in_date}</span></p>}
                    {ticket.act_in_date && 
                    <p className="text-gray-700">IN Time: <span className="text-blue-800">{ticket.act_in_date}</span></p>}
                    {ticket.act_out_date && 
                    <p className="text-gray-700">OUT Time: <span className="text-blue-800">{ticket.act_out_date}</span></p>}
          <div className="space-x-4 my-2 ">
        {/* {(ticket.act_in_time==null &&  ticket.plan_in_date && ticket.sr_status !== 'X' ) &&
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={(e)=>handleArriveDate(ticket.sr_id,'act_in_time')}
          >
            Arrived
          </button>
} */}
 {( !ticket.act_in_time && ticket.plan_in_date && ticket.sr_status !== 'X' ) &&
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={(e)=>handleArriveDate(ticket.sr_id,'act_in_time')}
          >
            Start
          </button>
}
{(allCompleted && ticket.act_out_time==null)  &&
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={(e)=>handleArriveDate(ticket.sr_id,'act_out_time')}
          >
            Completed
          </button>
}
          {/* {(ticket.act_in_time && ticket.act_out_time==null) &&
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={(e)=>handleArriveDate(ticket.sr_id,'act_out_time')}
          >
            Depart
          </button>
} */}
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

{/* <Loader size={30} /> */}
{loading &&
<LoadingOverlay visible={loading} loaderProps={{ children: 'Loading...' }} />
}
        {/* <h3 className="flex text-xl font-semibold pl-4 justify-center mb-4">Issue Resolutions</h3> */}
      <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                          {/* <div className="flex items-center gap-2"> */}
        <div className="grid grid-cols-1  sm:grid-cols-3 gap-4">
{(ticket.sr_status !=='X' && ticket.sr_status !=='P' && ticket.sr_status !=='Z') && <>
        <button className="btn btn-primary" disabled={loading}
                    onClick={handleUpdateRow}>
                     Update
                    </button>
                              <Button disabled={loading} className="btn btn-primary gap-2" onClick={handleAddRow}>
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="12" y1="5" x2="12" y2="19"></line>
                                      <line x1="5" y1="12" x2="19" y2="12"></line>
                                  </svg>
                                  Add Row
                              </Button>
                              </>  }
                              <h3 className="flex text-xl font-semibold pl-4 item-center justify-center ">Issue Resolutions</h3>
                          </div>
                      </div>
      <div>
      <DataTable
          key={tableData.length}
          records={tableData}
          columns={[
            {
                accessor: "actions",
                title: "",
                render: (row,index) => (
                    <div className="flex gap-4 items-center w-max mx-auto">
                  <button type="button" disabled={loading || ['X', 'P', 'Z'].includes(ticket.sr_status)} className="flex hover:text-danger" onClick={(e) => handleDeleteRow(row,index)}>
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
                                        { (isRowChanged(row) || !row.solution_id) &&
                                        <button type="button" className="flex text-green-500 hover:text-green-900" onClick={() => row.solution_id ? updateRow(row): addRow(row)}>
                                       <svg  xmlns="http://www.w3.org/2000/svg"   fill="none"   viewBox="0 0 24 24"   stroke="currentColor"   className="w-6 h-6 text-green-500">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                       </svg>

                                      </button>
                 }
                  </div>
                ),
              },
            {
              accessor: "problem",
              title: "Problem",
              render: (row,index) => (
                <textarea
                  defaultValue={row.problem}
                  onChange={(e) => handleRowChange(row.solution_id, "problem", e.target.value,index)}
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
                accessor: "attachments",
                title: "Attachments",
                textAlign : "center",
                width:160,
                render: (row) => (
                  <div className="flex space-x-2">
                    <ul>
                    <label className=" flex cursor-pointer justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="3" width="16" height="18" rx="2" ry="2" fill="none" stroke="blue" stroke-width="2"/>
                      <path d="M12 15V8" stroke="blue" stroke-width="2" stroke-linecap="round"/>
                      <path d="M9 11l3-3 3 3" stroke="blue" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <input name="attachment" disabled={loading || ['X', 'P', 'Z'].includes(ticket.sr_status)} type="file" className="hidden"onChange={(e) =>handleFileUpload(row,'before_attachments',e)}/>
                    </label>
                    {row.before_attachments && row.before_attachments.length > 0 ? (
                      row.before_attachments.map((attachment : any, index : number) => (
                        <li className="flex"><a className="text-blue-500 cursor-pointer " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a> 
                        {ticket.sr_status !== 'Z' &&                                                                                 
                        <button type="button" className="flex ml-4 hover:text-danger" onClick={() => handleFileDelete(Number(row.solution_id),attachment,row.before_attachments,'before_attachments')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                        <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" ></path>
                        <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        <path opacity="0.5" d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="currentColor" strokeWidth="1.5" ></path>
                        </svg>
                        </button>
            }</li>
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
                render: (row,index) => (
<textarea
value={row.actions}
onChange={(e) => handleRowChange(row.solution_id, "actions", e.target.value,index)}

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
                  accessor: "attachments",
                  title: "Solved Attachments",
                  textAlign : "center",
                  // width:160,
                  render: (row) => (
                    <div className="flex space-x-2"><ul>
                      <label className=" flex cursor-pointer justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="3" width="16" height="18" rx="2" ry="2" fill="none" stroke="blue" stroke-width="2"/>
                      <path d="M12 15V8" stroke="blue" stroke-width="2" stroke-linecap="round"/>
                      <path d="M9 11l3-3 3 3" stroke="blue" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <input name="attachment" disabled={loading || ['X', 'P', 'Z'].includes(ticket.sr_status)} type="file" className="hidden"onChange={(e) =>handleFileUpload(row,'after_attachments',e)}/>
                    </label>
                      {row.after_attachments && row.after_attachments.length > 0 ? (
                        row.after_attachments.map((attachment : any, index : number) => (
                          <li className="flex"><a className="text-blue-500 cursor-pointer " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a>
                          {ticket.sr_status !== 'Z' &&
                            <button type="button" className="flex ml-4 hover:text-danger" onClick={() => handleFileDelete(Number(row.solution_id),attachment,row.after_attachments,'after_attachments')}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                              <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                              <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" ></path>
                              <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                              <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                              <path opacity="0.5" d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="currentColor" strokeWidth="1.5" ></path>
                              </svg>
                            </button>
                }</li>
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
              render: (row,index) => (
                <select name="Status" className="p-1 border-0 rounded " 
                disabled={loading || ['X', 'P', 'Z'].includes(ticket.sr_status)}
                defaultValue={row.service_status} 
                // onChange={(e) => handleRowChange(solution_id, "service_status", e.target.value,row.index)}
                onChange={(e) => {
                  console.log("Changing status:", row.solution_id, e.target.value, index); // Debugging
                  handleRowChange(row.solution_id, "service_status", e.target.value,index);
              }}
                >
                                        <option value="P">Pending</option>
                                        <option value="W">In Progress</option>
                                        <option value="C">Completed</option>
                                    </select>
              ),
            },
            {
              accessor: "Solvedate",
              title: "Target/completion Date",
              textAlign : "center",
              render: (row,index) => (
              <Flatpickr
                              value={row.status_date}
                              disabled={loading || ['X', 'P', 'Z'].includes(ticket.sr_status)}
                              options={{
                                  dateFormat: 'd-M-Y', 
                                  minDate: new Date(
                                    new Date(ticket.act_in_time).getFullYear(),
                                    new Date(ticket.act_in_time).getMonth(),
                                    new Date(ticket.act_in_time).getDate()
                                  ),
                              }}
                              className={`form-input w-full border-0 opacity-80`}
                              onChange={(date) => handleRowChange(row.solution_id,'status_date',date[0],index)}
                          />
              ),
            },
            {
                accessor: "Status Remark",
                title: "Status Remark",
                render: (row,index) => (
<textarea
defaultValue={row.status_remark}
disabled={loading || ['X', 'P', 'Z'].includes(ticket.sr_status)}
onChange={(e) => handleRowChange(row.solution_id, "status_remark", e.target.value,index)}
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
                accessor: "Responsible",
                title: "Responsiblity",
                render: (row,index) => (
                   <select name="Agent" className="p-1 border-0 rounded"
                  disabled={loading || ['X', 'P', 'Z'].includes(ticket.sr_status)}
                    defaultValue={row.responsibility}  onChange={(e) => handleRowChange(row.solution_id, "responsibility", e.target.value,index)}>
                      <option value=" ">Assign</option>
                      {users.map((user) =>
                      <option value={user.userid}>{user.username}</option>
                      )}
                    </select>
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

export default TicketDetails;
