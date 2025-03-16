import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'mantine-datatable';
import { Button, Checkbox } from "@mantine/core";
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/airbnb.css";
interface FormData {
    name: string;
    address: string;
    city:string;
    state:string;
    country:string,
    postal_code:number| '';
    email: string;
    phone_no: number | '';
    user_id: number,
}

const CreateCompany = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const userAuthDetail = JSON.parse(sessionStorage.getItem('user'))  ;
    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail])
    useEffect(() => {
        dispatch(setPageTitle('Create Ticket'));
        
    });
    const [formData, setFormData] = useState<FormData>({
        name: '',
        address: '',
        city:'',
        state:'',
        country:'',
        postal_code:'',
        email: '',
        phone_no: '',
        user_id: 1,

    });



    const handleSubmit = async (e: any) => {
        e.preventDefault();
            
                setFormData({
                    name: '',
                    address: '',
                    city:'',
                    state:'',
                    country:'',
                    postal_code:'',
                    email: '',
                    phone_no: '',
                    user_id: 1,

                });
        
    };
    return (
        <div>
            

            <div className="pt-5 grid  grid-cols-1 gap-6">



                {/* Grid */}
                <div className="panel" id="forms_grid">
                    <div className="flex items-center justify-center mb-5">
                        <h5 className="font-semibold text-lg  dark:text-white-light">Create Customer Company</h5>
                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                          
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name">Company Name *</label>
                                    <input name="name" type="text" placeholder="Enter Company Name *" className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
