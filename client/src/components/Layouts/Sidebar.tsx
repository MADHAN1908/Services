import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';

import { parse } from 'cookie';
const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    // const cookies = parse(document.cookie);
    // const user = JSON.parse(sessionStorage.getItem('user'));
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    const role = user?.role?user.role:'Manage';
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ml-[5px] flex-none" src="/assets/images/logo.png" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('Service Report')}</span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 m-auto">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            <li className="nav-item">
                                <NavLink to="/" className="group">
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Dashboard')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <svg className="w-4 h-5 flex-none hidden" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>{t('apps')}</span>
                            </h2>
                            { (role=='Admin') && <>
                            <li className="nav-item">
                                <NavLink to="/users" className="group">
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="15" cy="6" r="3" fill="currentColor" />
                                            <ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="currentColor" />
                                            <circle cx="9.00098" cy="6" r="4" fill="currentColor" />
                                            <ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="currentColor" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('users')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/company" className="group">
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="15" cy="6" r="3" fill="currentColor" />
                                            <ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="currentColor" />
                                            <circle cx="9.00098" cy="6" r="4" fill="currentColor" />
                                            <ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="currentColor" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Company')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            </>}
                            {role === "Admin" &&
                        <li className="menu nav-item">
                            <button type="button" className={`${currentMenu === 'category' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('category')}>
                                <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <rect x="3" y="4" width="18" height="16" rx="2" ry="2" stroke="gray" stroke-width="2" fill="none"/>
  <path d="M3 8h18" stroke="gray" stroke-width="2"/>
  <circle cx="7" cy="12" r="1.5" fill="gray"/>
  <circle cx="12" cy="12" r="1.5" fill="gray"/>
  <circle cx="17" cy="12" r="1.5" fill="gray"/>
</svg>

                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Category')}</span>
                                </div>

                                <div className={currentMenu === 'category' ? 'rotate-90' : 'rtl:rotate-180'}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>

                            <AnimateHeight duration={300} height={currentMenu === 'category' ? 'auto' : 0}>
                                <ul className="sub-menu text-gray-500">
                                { (role=='Admin' ) &&
                                    <li><NavLink to="/category/add" onClick={() => dispatch(toggleSidebar())}>{t('Add')}</NavLink></li>
                                    }
                                { (role=='Admin' ) &&
                                    <li><NavLink to="/category"  onClick={() => dispatch(toggleSidebar())}>{t('List')}</NavLink></li>
                                }
                                </ul>
                            </AnimateHeight>
                        </li>
}
                            <li className="menu nav-item">
                            <button type="button" className={`${currentMenu === 'service_request' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('contacts')}>
                                <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    >
                                   <rect
                                    x="1"
                                    y="3"
                                    width="22"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                    stroke="gray"
                                    strokeWidth="1"
                                    fill="none"
                                    />
                                   <path
                                   d="M2 9a1 1 0 0 1 1-1h1.586a2 2 0 0 0 1.414-.586l2.828-2.828a2 2 0 0 1 1.414-.586h5.516a2 2 0 0 1 1.414.586l2.828 2.828a2 2 0 0 0 1.414.586H21a1 1 0 0 1 1 1v1.586a2 2 0 0 0 .586 1.414l.828.828-.828.828a2 2 0 0 0-.586 1.414V15a1 1 0 0 1-1 1h-1.586a2 2 0 0 0-1.414.586l-2.828 2.828a2 2 0 0 1-1.414.586h-5.516a2 2 0 0 1-1.414-.586l-2.828-2.828A2 2 0 0 0 4.586 16H3a1 1 0 0 1-1-1v-1.586a2 2 0 0 0-.586-1.414L.586 12l.828-.828A2 2 0 0 0 2 9.758V9z"
                                   fill="currentColor"
                                   />
                                   <circle cx="8" cy="12" r="1" fill="white" />
                                   <circle cx="12" cy="12" r="1" fill="white" />
                                   <circle cx="16" cy="12" r="1" fill="white" />
                                   </svg>
                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Service Request')}</span>
                                </div>

                                <div className={currentMenu === 'service_request' ? 'rotate-90' : 'rtl:rotate-180'}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>

                            <AnimateHeight duration={300} height={currentMenu === 'contacts' ? 'auto' : 0}>
                                <ul className="sub-menu text-gray-500">
                                { (role=='Admin'|| role=='Manager' || role=='Employee' || role == 'Customer' ) &&
                                    <li><NavLink to="/sr/add" onClick={() => dispatch(toggleSidebar())}>{t('Create SR')}</NavLink></li>
                                    }
                                { (role=='Admin'|| role=='Manager' || role=='Employee' ) &&
                                    <li><NavLink to="/sr/closeform" onClick={() => dispatch(toggleSidebar())}>{t('Create Self SR')}</NavLink></li>
                                    }
                                { (role=='Admin'|| role=='Manager' ) &&
                                    <li><NavLink to="/sr/assign"  onClick={() => dispatch(toggleSidebar())}>{t('Assign')}</NavLink></li>
                                }
                                { (role=='Admin'|| role=='Manager' || role=='Employee' ) && <>
                                    <li><NavLink to="/sr/assigned" onClick={() => dispatch(toggleSidebar())}>{t('Close')}</NavLink></li>
                                    <li><NavLink to="/sr/list" onClick={() => dispatch(toggleSidebar())}>{t('View SR')}</NavLink></li>
                                    </>}
                                    { (role=='Admin' || role=='Manager' || role=='Employee' ) && <>
                                    <li><NavLink to="/sr/expenses/list" onClick={() => dispatch(toggleSidebar())}>{t('View Expense')}</NavLink></li>
                                    </>}
                                { (role=='Customer') && <>
                                    <li><NavLink to="/src" onClick={() => dispatch(toggleSidebar())}>{t('View')}</NavLink></li>
                                    </>}    
                                    {/* <li>
                                        <NavLink to="/contacts/logs">{t('Import Failures')}</NavLink>
                                    </li> */}
                                </ul>
                            </AnimateHeight>
                        </li>

                           
                            
                            
                            
                            {/* { role=='Customer' && (
                                <>
                            <li className="nav-item">
                                <NavLink to="/sr/add" className="group">
                                    <div className="flex items-center">
                                    <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="24"
  height="24"
  fill="black"
>
  <path
    d="M2 9a1 1 0 0 1 1-1h1.586a2 2 0 0 0 1.414-.586l2.828-2.828a2 2 0 0 1 1.414-.586h5.516a2 2 0 0 1 1.414.586l2.828 2.828a2 2 0 0 0 1.414.586H21a1 1 0 0 1 1 1v1.586a2 2 0 0 0 .586 1.414l.828.828-.828.828a2 2 0 0 0-.586 1.414V15a1 1 0 0 1-1 1h-1.586a2 2 0 0 0-1.414.586l-2.828 2.828a2 2 0 0 1-1.414.586h-5.516a2 2 0 0 1-1.414-.586l-2.828-2.828A2 2 0 0 0 4.586 16H3a1 1 0 0 1-1-1v-1.586a2 2 0 0 0-.586-1.414L.586 12l.828-.828A2 2 0 0 0 2 9.758V9z"
    fill="currentColor"
  />
  <circle cx="8" cy="12" r="1" fill="white" />
  <circle cx="12" cy="12" r="1" fill="white" />
  <circle cx="16" cy="12" r="1" fill="white" />
</svg>

                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Create SR')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/src" className="group">
                                    <div className="flex items-center">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    >
                                   <rect
                                    x="1"
                                    y="3"
                                    width="22"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                    stroke="gray"
                                    strokeWidth="1"
                                    fill="none"
                                    />
                                   <path
                                   d="M2 9a1 1 0 0 1 1-1h1.586a2 2 0 0 0 1.414-.586l2.828-2.828a2 2 0 0 1 1.414-.586h5.516a2 2 0 0 1 1.414.586l2.828 2.828a2 2 0 0 0 1.414.586H21a1 1 0 0 1 1 1v1.586a2 2 0 0 0 .586 1.414l.828.828-.828.828a2 2 0 0 0-.586 1.414V15a1 1 0 0 1-1 1h-1.586a2 2 0 0 0-1.414.586l-2.828 2.828a2 2 0 0 1-1.414.586h-5.516a2 2 0 0 1-1.414-.586l-2.828-2.828A2 2 0 0 0 4.586 16H3a1 1 0 0 1-1-1v-1.586a2 2 0 0 0-.586-1.414L.586 12l.828-.828A2 2 0 0 0 2 9.758V9z"
                                   fill="currentColor"
                                   />
                                   <circle cx="8" cy="12" r="1" fill="white" />
                                   <circle cx="12" cy="12" r="1" fill="white" />
                                   <circle cx="16" cy="12" r="1" fill="white" />
                                   </svg>

                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('View SR')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            </>
                            )}
                            { (
                                // role=='Admin' || 
                            role ==  'Manager') && (
                                
                            <li className="nav-item">
                                <NavLink to="/sr/list" className="group">
                                    <div className="flex items-center">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    >
                                   <rect
                                    x="1"
                                    y="3"
                                    width="22"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                    stroke="gray"
                                    strokeWidth="1"
                                    fill="none"
                                    />
                                   <path
                                   d="M2 9a1 1 0 0 1 1-1h1.586a2 2 0 0 0 1.414-.586l2.828-2.828a2 2 0 0 1 1.414-.586h5.516a2 2 0 0 1 1.414.586l2.828 2.828a2 2 0 0 0 1.414.586H21a1 1 0 0 1 1 1v1.586a2 2 0 0 0 .586 1.414l.828.828-.828.828a2 2 0 0 0-.586 1.414V15a1 1 0 0 1-1 1h-1.586a2 2 0 0 0-1.414.586l-2.828 2.828a2 2 0 0 1-1.414.586h-5.516a2 2 0 0 1-1.414-.586l-2.828-2.828A2 2 0 0 0 4.586 16H3a1 1 0 0 1-1-1v-1.586a2 2 0 0 0-.586-1.414L.586 12l.828-.828A2 2 0 0 0 2 9.758V9z"
                                   fill="currentColor"
                                   />
                                   <circle cx="8" cy="12" r="1" fill="white" />
                                   <circle cx="12" cy="12" r="1" fill="white" />
                                   <circle cx="16" cy="12" r="1" fill="white" />
                                   </svg>

                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('View SRs')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            )}
                            { (
                                // role=='Admin' || 
                            role ==  'Manager') && (
                            <li className="nav-item">
                                <NavLink to="/sr/closeform" className="group">
                                    <div className="flex items-center">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    >
                                   <rect
                                    x="1"
                                    y="3"
                                    width="22"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                    stroke="gray"
                                    strokeWidth="1"
                                    fill="none"
                                    />
                                   <path
                                   d="M2 9a1 1 0 0 1 1-1h1.586a2 2 0 0 0 1.414-.586l2.828-2.828a2 2 0 0 1 1.414-.586h5.516a2 2 0 0 1 1.414.586l2.828 2.828a2 2 0 0 0 1.414.586H21a1 1 0 0 1 1 1v1.586a2 2 0 0 0 .586 1.414l.828.828-.828.828a2 2 0 0 0-.586 1.414V15a1 1 0 0 1-1 1h-1.586a2 2 0 0 0-1.414.586l-2.828 2.828a2 2 0 0 1-1.414.586h-5.516a2 2 0 0 1-1.414-.586l-2.828-2.828A2 2 0 0 0 4.586 16H3a1 1 0 0 1-1-1v-1.586a2 2 0 0 0-.586-1.414L.586 12l.828-.828A2 2 0 0 0 2 9.758V9z"
                                   fill="currentColor"
                                   />
                                   <circle cx="8" cy="12" r="1" fill="white" />
                                   <circle cx="12" cy="12" r="1" fill="white" />
                                   <circle cx="16" cy="12" r="1" fill="white" />
                                   </svg>

                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('SR Closure ')}</span>
                                    </div>
                                </NavLink>
                                </li>
                            )}
                            {  role ==  'Manager' && (
                            <li className="nav-item">
                                <NavLink to="/sr/assign" className="group">
                                    <div className="flex items-center">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    >
                                   <rect
                                    x="1"
                                    y="3"
                                    width="22"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                    stroke="gray"
                                    strokeWidth="1"
                                    fill="none"
                                    />
                                   <path
                                   d="M2 9a1 1 0 0 1 1-1h1.586a2 2 0 0 0 1.414-.586l2.828-2.828a2 2 0 0 1 1.414-.586h5.516a2 2 0 0 1 1.414.586l2.828 2.828a2 2 0 0 0 1.414.586H21a1 1 0 0 1 1 1v1.586a2 2 0 0 0 .586 1.414l.828.828-.828.828a2 2 0 0 0-.586 1.414V15a1 1 0 0 1-1 1h-1.586a2 2 0 0 0-1.414.586l-2.828 2.828a2 2 0 0 1-1.414.586h-5.516a2 2 0 0 1-1.414-.586l-2.828-2.828A2 2 0 0 0 4.586 16H3a1 1 0 0 1-1-1v-1.586a2 2 0 0 0-.586-1.414L.586 12l.828-.828A2 2 0 0 0 2 9.758V9z"
                                   fill="currentColor"
                                   />
                                   <circle cx="8" cy="12" r="1" fill="white" />
                                   <circle cx="12" cy="12" r="1" fill="white" />
                                   <circle cx="16" cy="12" r="1" fill="white" />
                                   </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Assign SRs')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            )}
                            {  role ==  'Employee' && (
                            <li className="nav-item">
                                <NavLink to="/sr/assigned" className="group">
                                    <div className="flex items-center">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    >
                                   <rect
                                    x="1"
                                    y="3"
                                    width="22"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                    stroke="gray"
                                    strokeWidth="1"
                                    fill="none"
                                    />
                                   <path
                                   d="M2 9a1 1 0 0 1 1-1h1.586a2 2 0 0 0 1.414-.586l2.828-2.828a2 2 0 0 1 1.414-.586h5.516a2 2 0 0 1 1.414.586l2.828 2.828a2 2 0 0 0 1.414.586H21a1 1 0 0 1 1 1v1.586a2 2 0 0 0 .586 1.414l.828.828-.828.828a2 2 0 0 0-.586 1.414V15a1 1 0 0 1-1 1h-1.586a2 2 0 0 0-1.414.586l-2.828 2.828a2 2 0 0 1-1.414.586h-5.516a2 2 0 0 1-1.414-.586l-2.828-2.828A2 2 0 0 0 4.586 16H3a1 1 0 0 1-1-1v-1.586a2 2 0 0 0-.586-1.414L.586 12l.828-.828A2 2 0 0 0 2 9.758V9z"
                                   fill="currentColor"
                                   />
                                   <circle cx="8" cy="12" r="1" fill="white" />
                                   <circle cx="12" cy="12" r="1" fill="white" />
                                   <circle cx="16" cy="12" r="1" fill="white" />
                                   </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('View SRs')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            )} */}
                            { (role=='Admin'|| role=='Manager' || role=='Employee')  && (
                            <li className="nav-item">
                                <NavLink to="/sr/report" className="group">
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="15" cy="6" r="3" fill="currentColor" />
                                            <ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="currentColor" />
                                            <circle cx="9.00098" cy="6" r="4" fill="currentColor" />
                                            <ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="currentColor" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Report')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            )}
                              {/* <li className="nav-item">
                                <NavLink to="/salutations" className="group">
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="15" cy="6" r="3" fill="currentColor" />
                                            <ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="currentColor" />
                                            <circle cx="9.00098" cy="6" r="4" fill="currentColor" />
                                            <ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="currentColor" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Salutations')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                        <NavLink to="/mail-service" className="group">
                                            <div className="flex items-center">
                                                <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24 5C24 6.65685 22.6569 8 21 8C19.3431 8 18 6.65685 18 5C18 3.34315 19.3431 2 21 2C22.6569 2 24 3.34315 24 5Z" fill="currentColor" />
                                                    <path
                                                        d="M17.2339 7.46394L15.6973 8.74444C14.671 9.59966 13.9585 10.1915 13.357 10.5784C12.7747 10.9529 12.3798 11.0786 12.0002 11.0786C11.6206 11.0786 11.2258 10.9529 10.6435 10.5784C10.0419 10.1915 9.32941 9.59966 8.30315 8.74444L5.92837 6.76546C5.57834 6.47377 5.05812 6.52106 4.76643 6.87109C4.47474 7.22112 4.52204 7.74133 4.87206 8.03302L7.28821 10.0465C8.2632 10.859 9.05344 11.5176 9.75091 11.9661C10.4775 12.4334 11.185 12.7286 12.0002 12.7286C12.8154 12.7286 13.523 12.4334 14.2495 11.9661C14.947 11.5176 15.7372 10.859 16.7122 10.0465L18.3785 8.65795C17.9274 8.33414 17.5388 7.92898 17.2339 7.46394Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M18.4538 6.58719C18.7362 6.53653 19.0372 6.63487 19.234 6.87109C19.3965 7.06614 19.4538 7.31403 19.4121 7.54579C19.0244 7.30344 18.696 6.97499 18.4538 6.58719Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M16.9576 3.02099C16.156 3 15.2437 3 14.2 3H9.8C5.65164 3 3.57746 3 2.28873 4.31802C1 5.63604 1 7.75736 1 12C1 16.2426 1 18.364 2.28873 19.682C3.57746 21 5.65164 21 9.8 21H14.2C18.3484 21 20.4225 21 21.7113 19.682C23 18.364 23 16.2426 23 12C23 10.9326 23 9.99953 22.9795 9.1797C22.3821 9.47943 21.7103 9.64773 21 9.64773C18.5147 9.64773 16.5 7.58722 16.5 5.04545C16.5 4.31904 16.6646 3.63193 16.9576 3.02099Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Mail Configuration')}</span>
                                            </div>
                                        </NavLink>
                                    </li> 
                          

                             <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'contacts' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('contacts')}>
                                    <div className="flex items-center">
                                    <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M19.7165 20.3624C21.143 19.5846 22 18.5873 22 17.5C22 16.3475 21.0372 15.2961 19.4537 14.5C17.6226 13.5794 14.9617 13 12 13C9.03833 13 6.37738 13.5794 4.54631 14.5C2.96285 15.2961 2 16.3475 2 17.5C2 18.6525 2.96285 19.7039 4.54631 20.5C6.37738 21.4206 9.03833 22 12 22C15.1066 22 17.8823 21.3625 19.7165 20.3624Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M5 8.51464C5 4.9167 8.13401 2 12 2C15.866 2 19 4.9167 19 8.51464C19 12.0844 16.7658 16.2499 13.2801 17.7396C12.4675 18.0868 11.5325 18.0868 10.7199 17.7396C7.23416 16.2499 5 12.0844 5 8.51464ZM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('contacts')}</span>
                                    </div>

                                    <div className={currentMenu === 'contacts' ? 'rotate-90' : 'rtl:rotate-180'}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'contacts' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/contacts">{t('List')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/contacts/logs">{t('Import Failures')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li> */}
                        </ul> 
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
