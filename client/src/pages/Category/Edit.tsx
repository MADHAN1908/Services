import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../utils/commonFunction';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
interface FormData {
    category_id: number | '',
    name: string,
}
const Edit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id  } = useParams();
    // const userAuthDetail = JSON.parse(sessionStorage.getItem('user'));
    const userAuthDetail = sessionStorage.getItem('user')
  ? JSON.parse(sessionStorage.getItem('user') as string)
  : null;
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail]);
    
     
    const [formData, setFormData] = useState<FormData>({
        category_id:  '',
        name: '',

    });
    const GetCategory = async () => {
        try {
            const response = await categoryService.getCategory(id);
            const category = response.Category;
            setFormData({
                category_id:category.category_id,
                name: category.name,
            });
            
        } catch (error) {
            return ('Something Went Wrong');
        }
    }
    useEffect(() => {
        dispatch(setPageTitle('Edit Category'));
        GetCategory();
    }, []);

    const [loader, setLoader] = useState(false);
   
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoader(true);
        try {
            
            const response = await categoryService.updateCategory(formData,Number(id));

            if (response.response == 'Success') {
                
                showToast('Category Updated Successfully','success');
                setFormData({
                    category_id:  '',
                    name: '',
                });
                navigate('/category');
            } else {
                // Form submission failed
                showToast(response.data.message,'error');
            }
        } catch (error: any) {
            
            showToast(error.message,'error');
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
                    <span>Update</span>
                </li>
            </ul>

            <div className="pt-5 grid  grid-cols-1 gap-6">



                {/* Grid */}
                <div className="panel" id="forms_grid">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Edit Category</h5>
                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                    <label htmlFor="category_id">Category ID </label>
                                    <input name="category_id" type="number"  className="form-input" readOnly
                                        value={formData.category_id}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name">Category name *</label>
                                    <input name="name" type="text" placeholder="Enter Category name *" className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

export default Edit;
