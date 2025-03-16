import { useEffect, useState, useRef } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate ,useParams} from 'react-router-dom';
import { expenseService } from '../../services/expenseService';
import { Button,LoadingOverlay } from "@mantine/core";
import { showToast } from '../../utils/commonFunction';

interface FormData {
    sr_id:number | '',
    expense_type:string,
    amount:number,
    attachments: File[],
}
const AddExpense = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id  } =useParams();
    const [formData, setFormData] = useState<FormData>({
        sr_id:Number(id),
        expense_type:'',
        amount: 0,
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

    useEffect(() => {
        dispatch(setPageTitle('Add Expense'));
        
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
        return;
    }

    if (file.size > maxSize) {
        showToast("File size must be less than 2MB.", "error");
        return;
    } 
        setFormData((prev) => ({ ...prev, attachments: [...(prev.attachments || []), file] }) 
        );
    };

    const handlePreview = (attachment: any) => {
        const fileURL = URL.createObjectURL(attachment);
        setPreviewImage(fileURL);
        setIsPreviewVisible(true);
      };
    
    const validateForm = () => {
        if (!formData.sr_id) return "ticket ID is required.";
        if (!formData.expense_type) return "Expense Type is required.";
        if (formData.amount <= 0 ) return "Amount is required.";
        
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
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                        <div>
                                    <label htmlFor="expense_type">Expense Type *</label>
                                    <select name="expense_type"
                                    value = {formData.expense_type}
                                    onChange={(e) => {setFormData({ ...formData,expense_type: e.target.value });
                                }}
                                        className={`form-select `}>
                                            <option value="">Choose Expense Type</option>
                                            <option value="T">Travel Expense</option>
                                            <option value="F">Food Expense</option>
                                            <option value="P">Spare Part Expense</option>
                                         
                                    </select>
                                </div>
                        <div>
                                    <label htmlFor="amount">Amount *</label>
                                    <input type='number' name="amount"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData,amount:Number( e.target.value) })}
                                        className="form-input"
                                        />
                                </div>
                                <div>
                                    <label htmlFor="attachment">Attachment *</label>
                                    <input name="attachment" type="file"  className="form-input"
                                        onChange={(e) => handleFileUpload(e)}
                                    />
                                    {/* <ul>
                                                                              {formData.attachments && formData.attachments.length > 0 ? (
                                                                                formData.attachments.map((attachment, index) => (
                                                                                  <li><a className="text-blue-500 cursor-pointer " onClick={() => handlePreview(attachment)}>Attachment {index + 1}</a></li>
                                                                                ))
                                                                              ) : (
                                                                                <span>No Attachments</span>
                                                                              )}
                                                                              </ul> */}
                                </div>
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
