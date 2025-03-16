import { Link } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import moment from 'moment';

const Index = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([
        {
          "title": '',
          "type": "",
          "contact_type": "",
          "actionstatus": "",
          "actiondate": "",
          
        }
  ]);

    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    },[]);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Index;
