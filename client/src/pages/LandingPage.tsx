import { Link } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import moment from 'moment';

const LandingPage = () => {
    const dispatch = useDispatch();
    

    useEffect(() => {
        dispatch(setPageTitle('Landing Page'));
    },[]);
    const managementSections = [
        { title: 'Campaign', link: '#', imgSrc: 'campaign.png' },
        { title: 'Service', link: '/', imgSrc: 'service.png' },
        { title: 'User/Contacts', link: '#', imgSrc: 'user_contact.png' },
        { title: 'Task', link: '#', imgSrc: 'task.jpeg' },
    ];

    return (

        <div className="flex justify-center items-center ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 place-items-center">
                {managementSections.map((section, index) => (
                    <div key={index} className="text-center">
                        <h3 className="text-lg font-semibold mb-2 dark:text-[#d0d2d6]">{section.title}</h3>
                        <Link to={section.link}>
                            <img 
                                src={section.imgSrc} 
                                alt={section.title} 
                                className="w-48 h-48 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform"
                            />
                        </Link>
                    </div>
                ))}
            </div>
        
        {/*  <div>
             <ul className="flex space-x-2 rtl:space-x-reverse">
                 <li>
                     <Link to="#" className="text-primary hover:underline">
                         Landing Page
                     </Link>
                 </li>
             </ul>
         </div> */}
        </div>
    );
};

export default LandingPage;
