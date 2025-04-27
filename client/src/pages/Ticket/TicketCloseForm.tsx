import { useEffect, useState, useRef } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate ,useLocation} from 'react-router-dom';
import { userService } from '../../services/userService';
import { solutionService } from '../../services/solutionService';
import { ticketService } from '../../services/ticketService';
import { showToast } from '../../utils/commonFunction';
import { DataTable } from 'mantine-datatable';
import { format } from 'date-fns';
import { Button, LoadingOverlay } from "@mantine/core";
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/airbnb.css";
import 'flatpickr/dist/flatpickr.css'; 
import 'tippy.js/dist/tippy.css';
import e from 'express';
interface FormData {
    company_id:number | '',
    contact_person:number | '',
    MOC:string,
    sr_id:number | '',
    sr_desc: string,
    sr_status: string,
    machine: string,
    priority: string,
    service_type: string,
    expected_date:Date|'',
    reported_date:Date | '',
    assigned_to:number |'',
    assigned_by:number |'',
    assigned_date:Date|'',
    in_time :Date|'',
    out_time:Date|'',
}
interface SolutionData {
    solution_id:number | '',
    sr_id:number |'',
    problem:string,
    before_attachments: string[],
    after_attachments:string[],
    actions:string,
    service_status: string,
    status_remark: string,
    responsibility: number | '',
    status_date:Date | '',
    customer_acceptance:Boolean | '',
    customer_feedback:string,
  }
const TicketCloseForm = () => {
    const dispatch = useDispatch();
        const navigate = useNavigate();
        const location = useLocation();
        const [assignedByUsers, setAssignedByUsers] = useState<any[]>([]);
        const [users, setUsers] = useState<any[]>([]);
        const [customers, setCustomers] = useState<any[]>([]);
        const [contactPerson, setContactPerson] = useState<any[]>([]);
        const [solutions,setSolutions] = useState<SolutionData[]>([]);
        const [tableData,setTableData] = useState<SolutionData[]>([]);
        const [previewImage, setPreviewImage] = useState('');
        const [isPreviewVisible, setIsPreviewVisible] = useState(false);
        const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
        const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
        const [customerRating, setCustomerRating] = useState(0);
        const [customerComment, setCustomerComment] = useState("");
        const [editSR, setEditSR] = useState(true);
        const [loader, setLoader] = useState(false);
        const isFirstRender = useRef(true);
        let userID;

        useEffect(() => {
          hasUnsavedChangesRef.current = hasUnsavedChanges;
        }, [hasUnsavedChanges]);

        useEffect(() => {
              const handleBeforeUnload =async (event: BeforeUnloadEvent) => {
                const confirmLeave = window.confirm("Do you want to save before leaving?");
                if (!confirmLeave) {
                  event.preventDefault();
                }
              };
          
              window.addEventListener("beforeunload", handleBeforeUnload);
          
              return () => {
                window.removeEventListener("beforeunload", handleBeforeUnload);
              };
            }, []);

            useEffect(() => {
            const handleNavigation = () => {
              if (isFirstRender.current) {
                isFirstRender.current = false; // Skip first render
                return;
            }
                  const confirmLeave = window.confirm("You have unsaved changes. Leave anyway?");
                  if (!confirmLeave) {
                    navigate(location.pathname, { replace: true }); 
                  }
              };
            
              return () =>{ handleNavigation();};
        
            }, [location.pathname]);
        
        const isRowsChanged = (): boolean => {
            return tableData.some((row) => {
              const originalRow = solutions.find((solution) => solution.solution_id === row.solution_id);
              if (!originalRow) return true;
          
              return Object.keys(originalRow).some(
                (key) => JSON.stringify(originalRow[key as keyof typeof originalRow]) !== JSON.stringify(row[key as keyof typeof row])
              );
            });
          };
        const [formData, setFormData] = useState<FormData>({
            company_id: '',
            contact_person: '',
            MOC:'',
            sr_desc: '',
            sr_id:'',
            sr_status: 'I',
            machine: '',
            priority: '',
            service_type: '',
            reported_date: new Date(),
            expected_date:'',
            assigned_to:'',
            assigned_by:'',
            assigned_date:'',
            in_time :'',
            out_time:'',
        });
        const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
        const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
        console.log(role);
        useEffect(() => {
            if(!userAuthDetail.token || role =='Manage'){
                navigate('/auth/login');
            }
        }, [userAuthDetail])
        
        useEffect(() => {
            console.log("Table data updated:", tableData);
          }, [tableData]);
         
    
        const GetCustomers = async () => {
                try {
                    const response = await userService.getCustomers();
                    console.log(response.CustomerDetails);
                    setCustomers(response.CustomerDetails);
                } catch (error) {
                    return ('Something Went Wrong');
                }
            }
    
            const handleContactPerson = async (id:number) => {
                try {
                    // console.log(id);
                    const response = await userService.getContactPerson(id);
                    console.log("Received Customer Contacts:", response.CustomerContacts);
                    console.log(response.CustomerContacts);
                    setContactPerson(response.CustomerContacts);
                } catch (error) {
                    alert('Something Went Wrong');
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

                    const GetAssignedByUsers = async () => {
                        try {
                            const response = await userService.getAssignedByUsers();
                            setAssignedByUsers(response.AssignedByUsers);
                            userID = response.user;
                            // setInitialRecords(response.AssignTickets);
                            console.log('ID',userID);
                            } catch (error) {
                            return ('Something Went Wrong');
                        }
                    }
    
        useEffect(() => {
            dispatch(setPageTitle('Close SR'));
            GetCustomers();
            GetUsers();
            GetAssignedByUsers();
        },[]);
        


        const handleUpdateRow = async () => {
            try {
              setLoader(true);
                let updatedTableData = [...tableData];
                await Promise.all(
                    updatedTableData.map(async (row) => {
                        if (row.solution_id) {
                          if(isRowChanged(row)){
                            await updateRow(row);
                          }
                        } else {
                            if (row.problem.trim() !== "") { 
                               await addRow(row);
                            }
                        }
                    })
                    
                );
            } catch (error) {
                console.error("Something Went Wrong:", error);
            }
            finally{
              setLoader(false);
            }
        };

          const handleAddRow = async () => {
            try {
              setLoader(true);
                let updatedTableData = [...tableData];
                let newRowAdd = false;
                // let hasValidRows = updatedTableData.some(row => row.solution_id);
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
                    sr_id: formData.sr_id,
                    problem: "",
                    before_attachments: [],
                    after_attachments: [],
                    actions: "",
                    service_status: "P",
                    status_remark: "",  
                    responsibility: '',
                    status_date: '', 
                    customer_acceptance: '', 
                    customer_feedback: "",
                }
                ]);
              }
            } catch (error) {
                console.error("Something Went Wrong:", error);
            }finally{
              setLoader(false);
            }
        };
        
        
        
          const updateRow =async (row:any) => {
            try {
              setLoader(true);
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
            setLoader(false);
          }
            
          };
        
          const addRow =async (row:any) => {
            try {
              setLoader(true);
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
                  return true;
              }
            }else{
                showToast("Problem Description is required ", "error");
                return false;
              }
              } catch (error) {
                // showToast(error.message, "error");
              return false;
          }finally{
            setLoader(false);
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
          // console.log(1);
          setTableData((prev) =>
              prev.map((row,i) =>
                   row.solution_id === id ? { ...row, [field]: value } : row
              )
          );
          // console.log(tableData);
        };
       
        const handleDeleteRow = async (row:any,rowIndex:number) => {
            try {
              setLoader(true);
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
          }finally{
            setLoader(false);
          }
          };
        
          const handlePreview = (attachment: any) => {
            const fileURl =`http://localhost:3700/api/v1${attachment}`;
            setPreviewImage(fileURl);
            setIsPreviewVisible(true);
          };
        
          const handleFileUpload = async (row: any,field:string, event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]; // Optional chaining prevents null error
            if (!file) return; 
            setLoader(true);
            if(!row.solution_id){
                const result = await addRow(row);
                if(result){
                  showToast("Row is updated ,Try now to upload Image", "error");
                }setLoader(false);
                return;
              } 
              const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
              const maxSize = 2 * 1024 * 1024; // 2MB in bytes
          
              if (!allowedTypes.includes(file.type)) {
                  showToast("Only JPG, PNG, GIF, and WEBP images are allowed.", "error");
                  setLoader(false);
                  return;
              }
              if (file.size > maxSize) {
                  showToast("File size must be less than 2MB.", "error");
                  setLoader(false);
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
              alert('Something Went Wrong');
          }finally{
            setLoader(false);
          }
        
        };
            
        const handleSubmitReview = async () => {
            try{
              setLoader(true);
                if(customerRating >0 && customerComment.trim() !== ''){
                    const response = await ticketService.updateTicket({'customer_rating':customerRating,'customer_comment':customerComment,'status':'C'},Number(formData.sr_id));
                    if(response.response == "Success"){
                        // console.log(response.ticket);
                        // console.log(response.ticket[0].customer_rating);
                        // console.log(response.ticket[0].customer_comment);
                         setCustomerRating(Number(response.ticket[0].customer_rating));
                         setCustomerComment(response.ticket[0].customer_comment);
                     }
                }
            }catch (error) {
                alert('Something Went Wrong');
            }finally{
              setLoader(false);
            }
        }

        const validateForm = () => {
          if (!formData.company_id) return "Company ID is required.";
          if (!formData.contact_person) return "Contact person is required.";
          if (!formData.MOC) return "Mode of Communication is required.";
          if (!formData.reported_date) return "Reported date is required.";
          if (!formData.expected_date) return "Expected date is required.";
          if (!formData.sr_desc.trim()) return "Service request description is required.";
          if (!formData.machine.trim()) return "Machine field is required.";
          if (!formData.priority) return "Priority must be selected.";
          if (!formData.service_type) return "Service type is required.";
          if (!formData.assigned_by) return "Assigned By Whom is required.";
          if (!formData.assigned_to) return "Assigned To Whom is required.";
          if (!formData.assigned_date) return "Assigned date is required.";
          if (!formData.in_time) return "In Time is required.";
          if (!formData.out_time) return "Out Time is required.";
          
          return null; 
      };
    
    
        const handleSubmit = async (e: any) => {
            e.preventDefault();
            setLoader(true);
            const validationError = validateForm();
            if (validationError) {
              showToast(validationError, 'error');
              setLoader(false);
              return;
            }
            try {
                // console.log(formData);
                 const response = await ticketService.addTicket(formData);
                 if (response.response == 'Success') { 
                        // console.log(5);
                                showToast(`Ticket No : ${response.Ticket.sr_id} Added Successfully`,'success');
                                
                                setFormData({
                                    company_id:response.Ticket.company_id,
                                    contact_person:response.Ticket.contact_person,
                                    MOC:response.Ticket.mode_of_communication,
                                    sr_id:response.Ticket.sr_id,
                                    sr_desc: response.Ticket.sr_desc,
                                    sr_status: response.Ticket.sr_status,
                                    machine: response.Ticket.machine,
                                    priority: response.Ticket.priority,
                                    service_type: response.Ticket.service_type,
                                    reported_date:response.Ticket.sr_date,
                                    expected_date:response.Ticket.expected_date,
                                    assigned_to:response.Ticket.assigned_to,
                                    assigned_by:response.Ticket.assigned_by,
                                    assigned_date:response.Ticket.assigned_date,
                                    in_time :response.Ticket.act_in_time,
                                    out_time:response.Ticket.act_in_time,
                                });
                                setEditSR(false);
                            } else {
                              showToast(response.data.message,'error');
                            }
                console.log(formData);
                console.log(tableData);
                
                    
            } catch (error: any) {
                
                let message ;
                if (error.response.data.errors) {
                    message = error?.response?.data?.errors[0]?.msg;
                }
                if(!message){
                    message  = error.response.data.message
                }
                showToast(message,'error');
            } finally {
                setLoader(false);
            }
        };

    return (
        <div>

            <div className="pt-5 grid  grid-cols-1 gap-6">
                {/* Grid */}
                <div className="panel" id="forms_grid">
                    <div className="flex items-center justify-center mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">SR Close Form</h5>
                    </div>
                    {isPreviewVisible && previewImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-96" />
            <button type='button'
              className="mt-2 bg-red-500 p-2 text-white rounded hover:bg-red-700"
              onClick={() => setIsPreviewVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
                    <div className="mb-5">
                        <form className="space-y-5" >
                        <div className="grid grid-cols-1 p-2 border-1 rounded bg-gray-100 sm:grid-cols-2 gap-4">
                        <div>
                                    <label htmlFor="customer">Company *</label>
                                    <select name="customer"
                                    value={formData.company_id}
                                    onChange={(e) => {setFormData({ ...formData,company_id: Number(e.target.value) });
                                     handleContactPerson(Number(e.target.value));}}
                                    className={`form-select `}
                                    disabled={editSR === false}>
                                            <option value="">Choose Company</option>
                                         { customers.map((customer) => 
                                        <option key={customer.company_id} value={customer.company_id}>{customer.company_name}</option>
                                    )}
                                    </select>
                                </div>
                        <div>
                                    <label htmlFor="customer">Contact Customer *</label>
                                    <select name="customer"
                                        value={formData.contact_person}
                                        onChange={(e) => setFormData({ ...formData, contact_person:Number( e.target.value) })}
                                        className="form-select"
                                        disabled={editSR === false}>
                                {contactPerson ? (
        <>
            <option value="">Choose Contact Person</option>
            {contactPerson.map((customer) => (
                <option key={customer.userid} value={customer.userid}>
                    {customer.username}
                </option>
            ))}
        </>
    ) : (
        <option disabled>No contacts found</option>
    )}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="MOC">Mode of Communication *</label>
                                    <select name="MOC"
                                        value={formData.MOC}
                                        onChange={(e) => setFormData({ ...formData, MOC: e.target.value })}
                                        className="form-select"
                                        disabled={editSR === false}>
                                        <option value="">Choose Communication Type</option>
                                        <option value="E">Email</option>
                                        <option value="S">SMS</option>
                                        <option value="W">WhatsApp</option>
                                        <option value="C">Phone Call</option>
                                    </select>
                                </div>
                                <div>
                                <label htmlFor="Date">Reported Date *</label>
                                <Flatpickr 
                                value={formData.reported_date} 
                                options={{ dateFormat: 'd-M-Y',
                                     position: 'auto left', 
                                     minDate: new Date(new Date().setDate(new Date().getDate() - 7)), 
                                     maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), 
                                     enableTime: false }} 
                                className="form-input"  
                                onChange={(date) => setFormData({ ...formData, reported_date: date[0] })}
                                // onChange={handleDateChange}
                                disabled={editSR === false}
                                />
                                </div>
                                <div>
                                <label htmlFor="Date">Expected Date *</label>
                                <Flatpickr 
                                value={formData.expected_date} 
                                options={{ dateFormat: 'd-M-Y',
                                     position: 'auto left', 
                                     minDate: formData.reported_date, 
                                     maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), 
                                     enableTime: false }} 
                                className="form-input"  
                                onChange={(date) => setFormData({ ...formData, expected_date: date[0] })}
                                disabled={editSR === false} />
                                </div>
                            
                                <div>
                                    <label htmlFor="title">Service Request *</label>
                                    <input name="title" type="text" placeholder="Enter Service Request *" className="form-input"
                                        value={formData.sr_desc}
                                        onChange={(e) => setFormData({ ...formData, sr_desc: e.target.value })}
                                        disabled={editSR === false}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="machine">Machine *</label>
                                    <input name="machine" type="text" placeholder="Enter Machine Name *" className="form-input"
                                        value={formData.machine}
                                        onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                                        disabled={editSR === false}
                                    />
                                </div>
                            
                                
                                <div>
                                    <label htmlFor="priority">Priority *</label>
                                    <select name="priorty"
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="form-select"
                                        disabled={editSR === false}
                                        >
                                        <option value=" ">Choose Priority</option>
                                        <option value="L">Low</option>
                                        <option value="M">Medium</option>
                                        <option value="H">High</option>
                                        <option value="C">Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="service_type">Service Type *</label>
                                    <select name="service_type"
                                        value={formData.service_type}
                                        onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                        className="form-select" disabled={editSR === false}>
                                        <option value="">Choose Service Type</option>
                                        <option value="W">Warranty Call</option>
                                        <option value="B">Breakdown Call</option>
                                        <option value="M">Maintance Call</option>
                                    </select>
                                </div>
                            
                        <div>
                                    <label htmlFor="assigned_by">Assigned By *</label>
                                    <select name="Agent" 
                                    // className="p-1 border-0 rounded"
                                        className="form-select"
                                        value={formData.assigned_by}
                                    onChange={(e) => setFormData({...formData,assigned_by:Number(e.target.value) })}
                                    disabled={editSR === false} >
                                        <option value="">Choose Assigned By</option>
                                        {assignedByUsers.map((user) =>
                                                 <option value={user.userid}>{user.username} ({user.role})</option>
                                                 )}
                                    </select>
                                </div>
                        <div>
                                    <label htmlFor="assigned_to">Assigned To *</label>
                                    <select name="Agent" 
                                    value={formData.assigned_to}
                                    onChange={(e) => setFormData({...formData,assigned_to:Number(e.target.value) })}
                                    // className="p-1 border-0 rounded"
                                        className="form-select"
                                        disabled={editSR === false} >
                                        <option value="">Choose Assigned To</option>
                                        {users.map((user) =>
                                                 <option value={user.userid}>{user.username}</option>
                                                 )}
                                    </select>
                                </div>
                                <div>
                                <label htmlFor="Date">Assigned Date *</label>
                                <Flatpickr 
                                value={formData.assigned_date} 
                                options={{ dateFormat: 'd-M-Y H:i',
                                     position: 'auto left', 
                                     minDate:formData.reported_date, 
                                     maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), 
                                     time_24hr: true,
                                     enableTime: true
                                      }} 
                                className="form-input"  
                                onChange={(date) => setFormData({ ...formData, assigned_date: date[0] })}
                                disabled={editSR === false} 
                                />
                                </div>
                               
                            <div>
                                <label htmlFor="Date">In Time *</label>

                                <Flatpickr 
                                value={formData.in_time} 
                                options={{ dateFormat: 'd-M-Y H:i',
                                     position: 'auto left', 
                                     minDate:formData.assigned_date, 
                                     maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                                     time_24hr: true, 
                                     enableTime: true }} 
                                className="form-input" 
                                onChange={(date) => setFormData({ ...formData, in_time: date[0] })}
                                disabled={editSR === false}
                                 />


                                </div> 
                                <div>
                                <label htmlFor="ArrivedTime">Out Time *</label>
                                <Flatpickr 
                                value={formData.out_time} 
                                options={{ dateFormat: 'd-M-Y H:i',
                                     position: 'auto left', 
                                     minDate:formData.in_time, 
                                     maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), 
                                     time_24hr: true,
                                     enableTime: true }} 
                                className="form-input"  
                                onChange={(date) => setFormData({ ...formData, out_time: date[0] })}
                                disabled={editSR === false}
                                 />

                                </div>
                                <div>
                                    {!formData.sr_id && <button className="btn btn-primary !mt-6" onClick={handleSubmit}>Save</button>}
                                    {(formData.sr_id && editSR===false) && <button className="btn btn-primary !mt-6" onClick={() => setEditSR(true)}>Edit</button>}
                                    {(formData.sr_id && editSR===true) && <button className="btn btn-primary !mt-6" onClick={() => setEditSR(false)}>Update</button>}
                                    </div>
                            </div>

                            <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                                                      {/* <div className="flex items-center gap-2"> */}
                                    <div className="grid grid-cols-1  sm:grid-cols-3 gap-4">
                            { formData.sr_id && <>
                                                          <button type='button' className="btn btn-primary gap-2" onClick={handleUpdateRow}>
                                                              Update
                                                          </button>
                                                          <Button className="btn btn-primary gap-2" onClick={handleAddRow}>
                                                              <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                  <line x1="12" y1="5" x2="12" y2="19"></line>
                                                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                                              </svg>
                                                              Add Row
                                                          </Button>
                                                          </>}
                                                          <h3 className="flex text-xl font-semibold pl-4 item-center justify-center ">Issue Resolutions</h3>
                                                      </div>
                                                  </div>
{loader &&
<LoadingOverlay visible={loader} loaderProps={{ children: 'Loading...' }} />
}
                           <DataTable
                                     key={tableData.length}
                                     records={tableData}
                                     columns={[
                                       {
                                           accessor: "actions",
                                           title: "",
                                           render: (row,index) => (
                                               <div className="flex gap-4 items-center w-max mx-auto">
                           
                                             <button type="button" className="flex hover:text-danger" onClick={(e) => handleDeleteRow(row,index)}>
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
                                                                   {/* <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor"  viewBox="0 0 24 24"  stroke="currentColor"  className="w-6 h-6 text-green" >
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                                  </svg> */}
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
                                           render: (row) => (
                                             <div className="flex space-x-2">
                                               <ul>
                                               <label className=" flex cursor-pointer justify-center">
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                 <rect x="4" y="3" width="16" height="18" rx="2" ry="2" fill="none" stroke="blue" stroke-width="2"/>
                                                 <path d="M12 15V8" stroke="blue" stroke-width="2" stroke-linecap="round"/>
                                                 <path d="M9 11l3-3 3 3" stroke="blue" stroke-width="2" stroke-linecap="round"/>
                                                 </svg>
                                                 <input name="attachment" type="file" className="hidden"onChange={(e) =>handleFileUpload(row,'before_attachments',e)}/>
                                               </label>
                                               {row.before_attachments && row.before_attachments.length > 0 ? (
                                                 row.before_attachments.map((attachment : any, index : number) => (
                                                   <li><a className="text-blue-500 cursor-pointer " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a></li>
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
                                             render: (row) => (
                                               <div className="flex space-x-2"><ul>
                                                 <label className=" flex cursor-pointer justify-center">
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                 <rect x="4" y="3" width="16" height="18" rx="2" ry="2" fill="none" stroke="blue" stroke-width="2"/>
                                                 <path d="M12 15V8" stroke="blue" stroke-width="2" stroke-linecap="round"/>
                                                 <path d="M9 11l3-3 3 3" stroke="blue" stroke-width="2" stroke-linecap="round"/>
                                                 </svg>
                                                 <input name="attachment" type="file" className="hidden"onChange={(e) =>handleFileUpload(row,'after_attachments',e)}/>
                                               </label>
                                                 {row.after_attachments && row.after_attachments.length > 0 ? (
                                                   row.after_attachments.map((attachment : any, index : number) => (
                                                     <li><a className="text-blue-500 cursor-pointer " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a></li>
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
                                         render: (row,index) => (
                                           <select name="Status" className="p-1 border-0 rounded " defaultValue={row.service_status} 
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
                                         render: (row,index) => (
                                         <Flatpickr
                                                         value={row.status_date}
                                                         options={{
                                                             dateFormat: 'd-M-Y', 
                                                             minDate:new Date(new Date(formData.in_time).setHours(0, 0, 0, 0)),
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
                           onChange={(e) => handleRowChange(row.solution_id, "status_remark", e.target.value,index)}
                           // onBlur={(e) => {
                           //   if (status_remark !== e.target.value.trim()) {
                           //     handleEditRow(solution_id, "status_remark", e.target.value);
                           //   }
                           // }}
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
                                              <select name="Agent" className="p-1 border-0 rounded" defaultValue={row.responsibility}  onChange={(e) => handleRowChange(row.solution_id, "responsibility", e.target.value,index)}>
                                                 <option value=" ">Assign</option>
                                                 {users.map((user) =>
                                                 <option value={user.userid}>{user.username}</option>
                                                 )}
                                               </select>
                                           ),
                                         },
                                         
                           
                                         {
                                            accessor: "status",
                                            title: "Acceptance",
                                            render: (row,index) => (
                                              <div className="flex space-x-2">
                                        
                                                <button type='button'
                                                  onClick={() =>  handleRowChange(row.solution_id, "customer_acceptance",true,index)}
                                                  className={`px-2 py-1 rounded ${
                                                    row.customer_acceptance === true ? "bg-green-500 text-white" : "bg-gray-200"
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
                                                <button type='button'
                                                  onClick={() => handleRowChange(row.solution_id,"customer_acceptance", false,index)}
                                                  className={`px-2 py-1 rounded ${
                                                    row.customer_acceptance === false ? "bg-red-500 text-white" : "bg-gray-200"
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
                                          
                                              </div>
                                            ),
                                          },
                                          {
                                              accessor: "remark",
                                              title: "Feedback",
                                              render: (row,index) => (
                                                <textarea
                                                  defaultValue={row.customer_feedback}
                                                  onChange={(e) => handleRowChange(row.solution_id, "customer_feedback", e.target.value,index)}
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
                                       
                                     ]}
                                     withTableBorder
                                     withColumnBorders
                                     className="bg-white shadow-lg rounded-lg"
                                   />
{formData.sr_id &&
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
             <button type='button'
               className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
               onClick={() => handleSubmitReview()}
             >
               Add Review
             </button>
           </div>
         </div>
       </div>

}
                        

                            <button type="button" className="btn btn-primary !mt-6" onClick={() => {navigate(-1);}}>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketCloseForm;
