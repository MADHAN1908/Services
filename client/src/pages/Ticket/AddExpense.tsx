import { useEffect, useState, useRef } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate ,useParams} from 'react-router-dom';
import { expenseService } from '../../services/expenseService';
import { categoryService } from '../../services/categoryService';
import { Button,LoadingOverlay } from "@mantine/core";
import { showToast } from '../../utils/commonFunction';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/airbnb.css";
import 'flatpickr/dist/flatpickr.css';

interface FormData {
    sr_id:number | '',
    expense_type:number | '',
    description:string,
    expense_date:Date,
    amount:number |'',
    attachments: File[],
}
const AddExpense = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id  } =useParams();
    const fileInputRef = useRef(null);
    const now = new Date();
    const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const [category, setCategory] = useState<any[]>([]);
    const [formData, setFormData] = useState<FormData>({
        sr_id:Number(id),
        expense_type:'',
        description:'',
        expense_date:new Date(),
        amount: '',
        attachments: [],
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

    const GetCategory = async () => {
        try {
                const response = await categoryService.getCategories();
                // console.log(response.CategoryList);
                setCategory(response.CategoryList);
        } catch (error) {
            return ('Something Went Wrong');
        }
    }

    useEffect(() => {
        dispatch(setPageTitle('Add Expense'));
        GetCategory();
    },[]);
  
    const [loader, setLoader] = useState(false);
    
      const [previewImage, setPreviewImage] = useState<any>(null);
      const [isPreviewVisible, setIsPreviewVisible] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; 
    
        if (!file) return;
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 2 * 1024 * 1024; 

    if (!allowedTypes.includes(file.type)) {
        showToast("Only JPG, PNG, GIF, and WEBP images are allowed.", "error");
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        return;
    }

    if (file.size > maxSize) {
        showToast("File size must be less than 2MB.", "error");
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        return;
    } 
        setFormData((prev) => ({ ...prev, attachments: [...(prev.attachments || []), file] }) 
        );
        if (fileInputRef.current) fileInputRef.current.value = ""; 
    };

    const handleFileDelete = (index : number) => {
        setFormData((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index)}));
    };

    const handlePreview = (attachment: any) => {
        const fileURL = URL.createObjectURL(attachment);
        setPreviewImage(fileURL);
        setIsPreviewVisible(true);
      };
    
    const validateForm = () => {
        if (!formData.sr_id) return "ticket ID is required.";
        if (!formData.expense_type) return "Expense Type is required.";
        if (!formData.amount || formData.amount <= 0  ) return "Amount is required.";
        if (!formData.description) return "Description is required.";
        
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
            const form = new FormData();
            for (const key in formData) {
            console.log(3);
            if(key == "attachments"){
                formData.attachments.forEach((file:any) =>{
                    form.append(key, file);
                })
            }else{
                form.append(key, formData[key]);
            } 
            }

             const response = await expenseService.createExpense(form);
             if (response.response == 'Success') {  
                            showToast(`Expense Added Successfully`,'success');
                           
                            setFormData({
                                sr_id:Number(id),
                                expense_type:'',
                                description:'',
                                expense_date:new Date(),
                                amount: 0,
                                attachments: [],
                            });
                        
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
                    <Link to= {`/sr/expenses/${id}`} className="text-primary hover:underline">
                        SR Expenses
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Add</span>
                </li>
            </ul>

            <div className="pt-5 grid  grid-cols-1 gap-6">



                {/* Grid */}
                <div className="panel" id="forms_grid">
                    <div className="flex items-center justify-center mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Create SR Expense</h5>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                                    <label htmlFor="expense_type">Expense Type *</label>
                                    <select name="expense_type"
                                    value = {formData.expense_type}
                                    onChange={(e) => {setFormData({ ...formData,expense_type: Number(e.target.value) });
                                }}
                                        className={`form-select `}>
                                            <option value="">Choose Expense Type</option>
                                            { category.map((category) => 
                                        <option key={category.category_id} value={category.category_id}>{category.name}</option>
                                    )}
                                         
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="Date">Expense Date *</label>
                                                                
                                    <Flatpickr
                                        value={ formData.expense_date}
                                        options={{
                                            dateFormat: 'd-M-Y',
                                            position: 'auto left',
                                            minDate: minDate, // 1 week before today
                                            maxDate: new Date().setMonth(new Date().getMonth() + 1), // 1 month after today
                                        }}
                                        className="form-input"
                                        onChange={(date) =>{
                                            setFormData({...formData,expense_date:date[0]});
                                            console.log(date[0],formData.expense_date)
                                        }}
                                    />
                                </div>

                                <div>
               <label className="block text-gray-700 font-medium">Description :</label>
               <textarea
                 value={ formData.description}
                 onChange={(e) => setFormData({ ...formData,description: e.target.value })}
                 className="w-full p-2 border rounded"
                 placeholder="Add a description"
               />
             </div>

                                
                        <div>
                                    <label htmlFor="amount">Amount *</label>
                                    <input type='number' name="amount"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData,amount:Number( e.target.value) })}
                                        className="form-input"
                                        />
                                </div>
                                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
                                <div>
                                    <label htmlFor="attachment">Attachment *</label>
                                    <input name="attachment" type="file"  className="form-input"
                                        onChange={(e) => handleFileUpload(e)}
                                        ref={fileInputRef}
                                    />
                                   
                                        </div>
                                        <div> 
                                            <ul className='text-base m-2 w-full p-2 border border-gray-500 rounded text-left'>
                                            {formData.attachments && formData.attachments.length > 0 ? (
                                            formData.attachments.map((attachment, index) => (
                                            <li className='flex'><a className="text-blue-500 cursor-pointer " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a>
                                            <button type="button" className="flex ml-4 hover:text-danger" onClick={() => handleFileDelete(index)}>
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
                                        </ul></div>
                                {/* </div> */}
                                </div>
                                
{loader &&
<LoadingOverlay visible={loader} loaderProps={{ children: 'Loading...' }} />
}
                            
                                                    
                                                                                      
                        

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

export default AddExpense;
