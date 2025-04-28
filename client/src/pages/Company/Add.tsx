import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingOverlay } from "@mantine/core";
import { companyService } from '../../services/companyService';
import { showToast } from '../../utils/commonFunction';

interface FormData {
    company_name: string;
    address: string;
    city:string;
    state:string;
    country:string,
    postal_code:number| '';
    email: string;
    phone_no: number | '';
}

const CreateCompany = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail])
    useEffect(() => {
        dispatch(setPageTitle('Create Company'));
        
    });
    const [formData, setFormData] = useState<FormData>({
        company_name: '',
        address: '',
        city:'',
        state:'',
        country:'',
        postal_code:'',
        email: '',
        phone_no: '',
    });
    const [loader, setLoader] = useState(false);


    const validateForm = () => {
        if (!formData.company_name.trim()) return "Company Name is required.";
        if (!formData.email.trim()) return "Email is required.";
        if (!formData.phone_no) return "Phone Number is required.";
        if (!formData.address.trim()) return "Address is required.";
        if (!formData.city.trim()) return "City is required.";
        if (!formData.state.trim()) return "State is required.";
        if (!formData.country.trim()) return "Country is required.";
        if (!formData.postal_code) return "Postal_code is required.";
        
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
            const response = await companyService.addCompany(formData);
            if (response.response == 'Success') {
                 showToast('Company Added Successfully','success'); 
                navigate('/company');
                setFormData({
                    company_name: '',
                    address: '',
                    city:'',
                    state:'',
                    country:'',
                    postal_code:'',
                    email: '',
                    phone_no: '',
                });
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
                    <Link to="/company" className="text-primary hover:underline">
                        Companies
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
                        <h5 className="font-semibold text-lg  dark:text-white-light">Create Customer Company</h5>
                    </div>
                    <div className="mb-5">
                    {loader &&
                        <LoadingOverlay visible={loader} loaderProps={{ children: 'Loading...' }} />
                    }
                        <form className="space-y-5" onSubmit={handleSubmit}>
                          
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name">Company Name *</label>
                                    <input name="name" type="text" placeholder="Enter Company Name *" className="form-input"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email">Email *</label>
                                    <input name="email" type="email" placeholder="Enter Email *" className="form-input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone_no">Phone No *</label>
                                    <input name="phone_no" type="number" placeholder="Enter Phone No *" className="form-input"
                                        value={formData.phone_no}
                                        onChange={(e) => setFormData({ ...formData, phone_no: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="Address">Address *</label>
                                    <textarea name="Address"  placeholder="Enter Address *" className="form-input"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                <div>
                                    <label htmlFor="city">City *</label>
                                    <input name="city" type="text" placeholder="Enter City Name *" className="form-input"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="state">State *</label>
                                    <input name="state" type="text" placeholder="Enter State Name *" className="form-input"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="country">Country *</label>
                                    <input name="country" type="text" placeholder="Enter Country Name *" className="form-input"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="pin">Postal Code *</label>
                                    <input name="pin" type="number" placeholder="Enter Postal Code *" className="form-input"
                                        value={formData.postal_code}
                                        onChange={(e) => setFormData({ ...formData, postal_code: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary !mt-6">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCompany;
