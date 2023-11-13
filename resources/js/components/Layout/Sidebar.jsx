import avatar from '../../../images/admin.png';
import nasya_logo from '../../../images/logo.png'
import { useUser } from '../../hooks/useUser';
import { capitalize } from '@mui/material';
import { useState } from 'react';
import SideItem from '../LayoutComponents/SideItem';
import moment from 'moment/moment';
import { NavLink, useNavigate } from 'react-router-dom';
const sidebarItems = [{
	id: 1,
	text: 'Employees',
	icon: 'si si-users',
	children: [
		{
			href: '/hr/employees',
			text: 'List of Employees',
			icon: 'si si-user',
		},
		{
			href: '/hr/employees-benefits',
			text: 'List of Benefits',
			icon: 'si si-user',
		},
		{
			href: '/hr/employees-workdays',
			text: 'Set Workdays',
			icon: 'si si-user',
		}

	]
},
{
	id: 2,
	text: 'Applications',
	icon: 'fa fa-pencil-square-o',
	children: [
		{
			href: '/hr/applications',
			text: 'Request',
			icon: 'fa fa-cogs',
		},
		{
			href: '/hr/applications-list',
			text: 'List',
			icon: 'fa fa-cogs',
		}
	]
}
];

const payrollItems = [{
		id: 3,
		text: 'Payroll',
		icon: 'fa fa-money',
		children: [
			{
				href: '/hr/payroll-process',
				text: 'Process',
				icon: 'fa fa-cogs',
			},
			{
				href: `/hr/payroll-records?month=${moment().format('M')}&cutoff=${1}&year=${moment().year()}`,
				text: 'Records',
				icon: 'fa fa-cogs',
			}
		]
}]

const Sidebar = ({ children, closeMini }) => {
	const { user } = useUser();
	const navigate = useNavigate();
	const dayToday = moment().format('DD');
	const handleNavigate = (link) => {
		navigate(link);
	}

	return (
		<nav id="sidebar" style={{ zIndex: 1 }}>
			<div className="sidebar-content">
				<div className='content-header content-header-fullrow px-15'>
					<div className="content-header-section sidebar-mini-visible-b">
						<span className="content-header-item font-w700 font-size-xl float-left animated fadeIn">
							<span className="text-dual-primary-dark">c</span><span className="text-primary">b</span>
						</span>
					</div>
					<div className='content-header-section text-center align-parent sidebar-mini-hidden'>
						<button type="button" className="btn btn-circle btn-dual-secondary d-lg-none align-v-r" data-toggle="layout" data-action="sidebar_close" onClick={closeMini}>
							<i className="fa fa-times text-danger"></i>
						</button>
						<div className="content-header-item">
							<img src={nasya_logo} style={{ height: '40px', marginBottom: '20px' }} />
						</div>
					</div>
				</div>
				<div className="content-side content-side-full content-side-user px-10 align-parent" style={{ backgroundImage: 'linear-gradient(190deg, rgb(234, 28, 24,0.8), rgb(58, 181, 74,1))' }}>
					<div className="sidebar-mini-visible-b align-v animated fadeIn">
						<img className="img-avatar img-avatar32" src={avatar} alt="" />
					</div>
					<div className="sidebar-mini-hidden-b text-center" >
						<a className="img-link">
							<img className="img-avatar" src={"https://nasyaportal.ph/assets/media/upload/" + user.profile_pic} alt="" />
						</a>
						<ul className="list-inline mt-10">
							<li className="list-inline-item">
								<a className="link-effect text-white font-size-xs font-w600">{capitalize(user.fname)} {capitalize(user.lname)}</a>
							</li>
							{/* <li className="list-inline-item">
								<a className="link-effect text-white" data-toggle="layout" data-action="sidebar_style_inverse_toggle">
									<i className="si si-drop"></i>
								</a>
							</li>
							<li className="list-inline-item">
								<a className="link-effect text-white">
									<i className="si si-logout"></i>
								</a>
							</li> */}
						</ul>
					</div>
				</div>
				<div className="content-side content-side-full">
					<ul className="nav-main">
						<li className="nav-main-heading">
							<span className="sidebar-mini-hidden" style={{ color: '#3d3d3f' }}>ADMIN</span>
						</li>
						<NavLink
							to={`/?year=${moment().year()}`}
							// style={({ isActive }) =>
							// 	(isActive ? { backgroundColor: 'green', color: 'white' } : {})}
						>
							<i className="si si-grid" style={{ color: '#fc1414' }}></i><span className="sidebar-mini-hide">Dashboard</span>
						</NavLink>
						{/* <li className="{{ request()->is('examples/*') ? ' open' : '' }}">
							<a className="{{ request()->is('dashboard') ? ' active' : '' }}" href="/hr/position">
								<i className="fa fa-users" style={{ color: '#fc1414' }}></i><span className="sidebar-mini-hide">Positions</span>
							</a>
						</li> */}
						<li className="nav-main-heading">
							<span className="sidebar-mini-hidden text-dark">Management</span>
						</li>
						{sidebarItems.map((items, index) => {
							return <SideItem key={index} items={items} />
						})}
						<NavLink
							to={`/hr/attendance?month=${moment().format('MM')}&year=${moment().year()}`}
							// style={({ isActive }) =>
							// 	(isActive ? { backgroundColor: 'green', color: 'white' } : {})}
						>
							<i className="fa fa-calendar-check-o" style={{ color: '#fc1414' }} ></i><span className="sidebar-mini-hide">Attendance</span>
						</NavLink>
						{payrollItems.map((items, index) => {
							return <SideItem key={index} items={items} />
						})}
						<NavLink
							to={`/hr/payroll-summary?month=${moment().format('M')}&cutoff=${1}&year=${moment().year()}`}
							// style={({ isActive }) =>
							// 	(isActive ? { backgroundColor: 'green', color: 'white' } : {})}
						>
							<i className="fa fa-file-text-o" style={{ color: '#fc1414' }} ></i><span className="sidebar-mini-hide">Summary</span>
						</NavLink>
					</ul>
				</div>
			</div>
		</nav>
	)
}

export default Sidebar
