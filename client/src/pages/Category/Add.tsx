import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { showToast } from '../../utils/commonFunction';

const Add = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const userAuthDetail = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail])

    useEffect(() => {
        dispatch(setPageTitle('Create Categroy'));
    });

    const [loader, setLoader] = useState(false);
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoader(true);
        try {
            const response = await categoryService.addCategory({'name':category});
            if (response.response == 'Success') {
                 showToast('Category Added Successfully','success'); 
                navigate('/category');
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
                    <Link to="/category" className="text-primary hover:underline">
                        Categories
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Create</span>
                </li>
            </ul>

            <div className="pt-5 grid  grid-cols-1 gap-6">



                {/* Grid */}
                <div className="panel" id="forms_grid">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Create Category</h5>
                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                <div>
                                    <label htmlFor="name">Category Name *</label>
                                    <input name="name" type="text" placeholder="Enter Category Name *" className="form-input"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value )}
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

export default Add;
