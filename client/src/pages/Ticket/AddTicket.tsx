import { useEffect, useState, useRef } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { solutionService } from '../../services/solutionService';
import { ticketService } from '../../services/ticketService';
import { DataTable } from 'mantine-datatable';
import { Button,LoadingOverlay } from "@mantine/core";
import { showToast } from '../../utils/commonFunction';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/airbnb.css";
import 'flatpickr/dist/flatpickr.css';
import { format } from 'date-fns'; 
import Swal from 'sweetalert2';
import 'tippy.js/dist/tippy.css';
import e from 'express';
interface FormData {
    company_id:number | '',
    contact_person:number | '',
    MOC:string,
    sr_desc: string;
    sr_status: string;
    machine: string;
    priority: string;
    service_type: string,
    reported_date:Date | '',
    expected_date:Date | '',
}
const AddTicket = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>({});
    const [customers, setCustomers] = useState<any[]>([]);
    const [contactPerson, setContactPerson] = useState<any[]>([]);
    const now = new Date();
    const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    // const [formData, setFormData] = useState<FormData>();
    const [formData, setFormData] = useState<FormData>({
        company_id: '',
        contact_person: '',
        MOC:'',
        sr_desc: '',
        sr_status: 'X',
        machine: '',
        priority: '',
        service_type: '',
        reported_date: new Date(),
        expected_date: '',
    });
    // const userAuthDetail = JSON.parse(sessionStorage.getItem('user'))  ;
    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    console.log(role);
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail])
    
    const GetCustomers = async () => {
            try {
                if(role == "Customer"){
                    const response = await userService.getUser();
                    console.log(response.UserDetails);
                    setUser(response.UserDetails);
                    handleContactPerson(response.UserDetails.company_id);
                    setFormData({
                        company_id: response.UserDetails.company_id ,
                        contact_person: response.UserDetails.userid,
                        MOC: 'P' ,
                        sr_desc: '',
                        sr_status: 'X',
                        machine: '',
                        priority: '',
                        service_type: '',
                        reported_date: new Date(),
                        expected_date:'',
                    })
                }
                const response = await userService.getCustomers();
                setCustomers(response.CustomerDetails);
            } catch (error) {
                return ('Something Went Wrong');
            }
        }

        const handleContactPerson = async (id:number) => {
            try {
                const response = await userService.getContactPerson(id);
                console.log("Received Customer Contacts:", response.CustomerContacts);
                console.log(response.CustomerContacts);
                setContactPerson(response.CustomerContacts);
            } catch (error) {
                alert('Something Went Wrong');
            }
        }

    useEffect(() => {
        dispatch(setPageTitle('Create Ticket'));
        GetCustomers();
    },[]);
  
    const [loader, setLoader] = useState(false);
    const [tableData, setTableData] = useState<
    {
        id: number;
        problem: string;
        attachments: File[];
    }[]
>([
    {
        id: 1,
        problem: "",
        attachments: [],
    },
]);
      const [newRow, setNewRow] = useState({ problem: "", solved: false, status: "" });
      const [previewImage, setPreviewImage] = useState<any>(null);
      const [isPreviewVisible, setIsPreviewVisible] = useState(false);

      const handleAddRow = () => {
        if (newRow.problem.trim() == "") {
            const newRowId = tableData.length + 1; 
            const newRowData = {
              id: newRowId,
              problem:"",
              attachments:[],
            };
        
            setTableData(prevData => [...prevData, newRowData]);
            setNewRow({ problem: "", solved: false, status: "" });
          }
        
      };
    
    const handleEditRow = (id :any, key:any, value:any) => {
        setTableData((prev) =>
          prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
        );
      };
    
      const handleDeleteRow = (id:any) => {
        setTableData((prev) => prev.filter((row) => row.id !== id));
      };

    const handleFileUpload = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; 
    
        if (!file) return;
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 2 * 1024 * 1024; 

    if (!allowedTypes.includes(file.type)) {
        showToast("Only JPG, PNG, GIF, and WEBP images are allowed.", "error");
        return;
    }

    if (file.size > maxSize) {
        showToast("File size must be less than 2MB.", "error");
        return;
    } 
        setTableData((prev) => prev.map((row) =>
                row.id === id ? { ...row, attachments: [...(row.attachments || []), file] } : row
            )
        );
    };

    const handleFileDelete = (id: number, i : number) => {
        
        setTableData((prev) => prev.map((row) =>
        row.id === id ? { ...row, attachments: row.attachments.filter((_, j) => j !== i) } : row
    )
);
    };

    const handlePreview = (attachment: any) => {
        const fileURL = URL.createObjectURL(attachment);
        setPreviewImage(fileURL);
        setIsPreviewVisible(true);
      };
    
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
        
    
        for (const data of tableData) {
            if (!data.problem.trim()) return "Problem description is required.";
            // if (data.attachments.length === 0) return "At least one attachment is required for each entry.";
        }
        
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

             const response = await ticketService.createTicket(formData);
             if (response.response == 'Success') {  
                    await Promise.all(
                        tableData.map(async (data:any) => {
                            const form = new FormData();
                            for (const key in data) {
                            console.log(3);
                            if(key == "attachments"){
                                data.attachments.forEach((file:any) =>{
                                    form.append(key, file);
                                })
                            }else{
                                form.append(key, data[key]);
                            } 
                            }
                            return solutionService.createSolution(response.Ticket.sr_id,form);
                        })
                    );
                            showToast(`Ticket No : ${response.Ticket.sr_id} Added Successfully`,'success');
                            if(role === "Customer"){
                                setFormData({
                                    company_id: user.company_id ,
                                    contact_person: user.userid,
                                    MOC: 'P' ,
                                    sr_desc: '',
                                    sr_status: 'X',
                                    machine: '',
                                    priority: '',
                                    service_type: '',
                                    reported_date: new Date(),
                                    expected_date:'',
                                })
                            }else{
                            setFormData({
                                company_id:'',
                                contact_person:'',
                                MOC:'',
                                sr_desc: '',
                                sr_status: 'P',
                                machine: '',
                                priority: '',
                                service_type: '',
                                reported_date:new Date(),
                                expected_date:'',
                            });
                        }
                            setTableData([
                                {
                                    id: 1,
                                    problem: "",
                                    attachments: [],
                                },
                            ]);
                            // navigate(-1);
                        } else {
                            showToast(response.data.message,'error');
                        }
                
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
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to={role === 'Customer' ? '/src':'/sr/list'} className="text-primary hover:underline">
                        Service Requests
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Create</span>
                </li>
            </ul>

            <div className="pt-5 grid  grid-cols-1 gap-6">



                {/* Grid */}
                <div className="panel" id="forms_grid">
                    <div className="flex items-center justify-center mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Create Service Request</h5>
                    </div>
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
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                                    <label htmlFor="customer">Company *</label>
                                    <select name="customer"
                                    value={role == "Customer"? user.company_id : formData.company_id}
                                    onChange={(e) => {setFormData({ ...formData,company_id: Number(e.target.value) });
                                     handleContactPerson(Number(e.target.value));
                                }}
                                        className={`form-select `}
                                        disabled={role === "Customer"}>
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
                                        className="form-select">
                                        {contactPerson ? (
                                            <> <option value="">Choose Contact Person</option>
                                            {contactPerson.map((customer) => (
                                                <option key={customer.userid} value={customer.userid}>
                                                    {customer.username}
                                                </option>
                                            ))}</>
                                        ) : (
                                        <option disabled>No contacts found</option>
                                        )}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="MOC">Mode of Communication *</label>
                                    <select name="MOC"
                                        value={role == "Customer"? 'P': formData.MOC}
                                        onChange={(e) => setFormData({ ...formData, MOC: e.target.value })}
                                        className="form-select"
                                        disabled={role === "Customer"}>
                                        <option value="">Choose Communication Type</option>
                                        <option value="E">Email</option>
                                        <option value="S">SMS</option>
                                        <option value="W">WhatsApp</option>
                                        <option value="C">Phone Call</option>
                                        {role == "Customer" && 
                                         <option value="P" >Portal</option>
                                        }
                                    </select>
                                </div>
                                    
                                    <div>
                                <label htmlFor="Date">Reported Date *</label>
                                
                                    <Flatpickr
                                        value={role === "Customer"? new Date() : formData.reported_date}
                                        options={{
                                            dateFormat: 'd-M-Y',
                                            position: 'auto left',
                                            minDate: minDate, // 1 week before today
                                            maxDate: new Date().setMonth(new Date().getMonth() + 1), // 1 month after today
                                            }}
                                        className="form-input"
                                        disabled={role === 'Customer'}
                                        onChange={(date) =>{
                                            // const selectedDate = date[0];  // Local time
                                            // const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000); // Convert to UTC
                                        
                                            // setFormData({...formData, reported_date: utcDate.toISOString()}); // Save as ISO string
                                            // console.log("Selected:", selectedDate, "Stored (UTC):", utcDate.toISOString()); 
                                            setFormData({...formData,reported_date:date[0]});
                                        console.log(date[0],formData.reported_date)
                                          }}
                                    />
                                    </div>
                                    <div>
                                    <label htmlFor="Date">Expected Date *</label>
                                
                                <Flatpickr
                                    value={formData.expected_date}
                                    options={{
                                        dateFormat: 'd-M-Y',
                                        position: 'auto left',
                                        minDate: formData.reported_date,
                                        maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                                        }}
                                    className="form-input"
                                    onChange={(date) => setFormData({...formData,expected_date:date[0]})}
                                />
                                </div>
                                

                                <div>
                                    <label htmlFor="title">Service Request *</label>
                                    <input name="title" type="text" placeholder="Enter Service Request *" className="form-input"
                                        value={formData.sr_desc}
                                        onChange={(e) => setFormData({ ...formData, sr_desc: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="machine">Machine *</label>
                                    <input name="machine" type="text" placeholder="Enter Machine Name *" className="form-input"
                                        value={formData.machine}
                                        onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="priority">Priority *</label>
                                    <select name="priority"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="form-select">
                                        <option value="">Choose Priority</option>
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
                                        className="form-select">
                                        <option value="">Choose Service Type</option>
                                        <option value="W">Warranty Call</option>
                                        <option value="B">Breakdown Call</option>
                                        <option value="M">Maintenance Call</option>
                                    </select>
                                </div>
                            </div>
                            <Button className="btn btn-primary gap-2" onClick={handleAddRow}>
                               <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                               <line x1="12" y1="5" x2="12" y2="19"></line>
                               <line x1="5" y1="12" x2="19" y2="12"></line>
                               </svg>
                               Add Row
                            </Button>
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
                                                                        width:60,
                                                                        render: (row) => (
                                                                            <div  className="flex justify-center " >
                                                                            <button type="button" className="flex hover:text-danger" onClick={() => handleDeleteRow(row.id)}>
                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                                            <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                            <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" ></path>
                                                                            <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                            <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                            <path opacity="0.5" d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="currentColor" strokeWidth="1.5" ></path>
                                                                            </svg>
                                                                            </button>
                                                                          </div>
                                                                        ),
                                                                      },
                                                                    {
                                                                      accessor: "problem",
                                                                      title: "Problem",
                                                                      render: (row) => (
                                                                        <textarea
                                                                          value={row.problem}
                                                                          onChange={(e) => handleEditRow(row.id, "problem", e.target.value)}
                                                                          className="form-input w-full  border-0 focus:outline-none resize-none"
                                                                          onInput={(e) => {
                                                                            const target = e.target as HTMLTextAreaElement; 
                                                                            target.style.height = "auto"; 
                                                                            target.style.height = `${target.scrollHeight}px`; }}
                                                                          style={{ width: "100%", minWidth: "200px",  minHeight: "40px",  maxHeight: "200px", whiteSpace: "pre-wrap",  wordBreak: "break-word", overflow: "hidden",  }}
                                                                        />
                                                                      ),
                                                                    },
                                                                    {
                                                                        accessor: "upload",
                                                                        title: "Upload",
                                                                        textAlign:"center",
                                                                        width:100,
                                                                        render: (row) => (
                                                                  
                                                                  <label className="flex cursor-pointer justify-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                       <rect x="4" y="3" width="16" height="18" rx="2" ry="2" fill="none" stroke="blue" stroke-width="2"/>
                                                                       <path d="M12 15V8" stroke="blue" stroke-width="2" stroke-linecap="round"/>
                                                                       <path d="M9 11l3-3 3 3" stroke="blue" stroke-width="2" stroke-linecap="round"/>
                                                                   </svg>
                                                                   <input name="attachment" type="file" className="hidden"onChange={(e) =>handleFileUpload(row.id,e)}/>
                                                                  </label>
                                                                        ),
                                                                      }, 
                                                                      {
                                                                          accessor: "attachments",
                                                                          title: "Attachments",
                                                                          render: (row) => (
                                                                            <div className="flex space-x-2"><ul>
                                                                              {row.attachments && row.attachments.length > 0 ? (
                                                                                row.attachments.map((attachment, index) => (
                                                                                  <li className='flex'><a className="text-blue-500 cursor-pointer " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a> 
                                                                                  <button type="button" className="flex ml-4 hover:text-danger" onClick={() => handleFileDelete(row.id,index)}>
                                                                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                                                  <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                                  <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" ></path>
                                                                                  <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                                  <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                                  <path opacity="0.5" d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="currentColor" strokeWidth="1.5" ></path>
                                                                                  </svg>
                                                                                  </button></li>
                                                                                ))
                                                                              ) : (
                                                                                <span>No Attachments</span>
                                                                              )}
                                                                              </ul>
                                                                            </div>
                                                                          ),
                                                                        },                                      
                                                                  ]}
                                                                  withTableBorder
                                                                  withColumnBorders
                                                                  className="bg-white shadow-lg rounded-lg"
                                                                />
                                                    
                                                                                      
                        

                            <button type="submit" disabled={loader} className="btn btn-primary !mt-6">
                            {loader && (
                                            <span className="animate-ping w-3 h-3 ltr:mr-4 rtl:ml-4 inline-block rounded-full bg-white"></span>
                                        )}
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTicket;
