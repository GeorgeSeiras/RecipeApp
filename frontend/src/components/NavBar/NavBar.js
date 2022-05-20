import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/authContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import NAV_LOGO from '../../static/nav_logo.png';
import NO_AVATAR from '../../static/no_avatar.svg';

import Notifications from '../Notifications/Notifications';

import './NavBar.css'
const Navigation = () => {
    const userData = useContext(UserContext);
    const [avatar, setAvatar] = useState(null);
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

    useEffect(() => {
        if (userData?.user?.user?.image) {
            setAvatar(MEDIA_URL + userData.user.user.image)
        } else {
            setAvatar(NO_AVATAR)
        }
    }, [userData?.user?.user?.image])

    return (
        <Navbar sticky='top' collapseOnSelect fixed='top' expand='sm' bg='primary' variant='light' style={{paddingLeft:'25px'}}>
            <Navbar.Brand id="Brand" href="/">
                <img src={NAV_LOGO} width="50px" height="auto" alt="logo" className="img-responsive" />
                {' RecipeApp'}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse id='responsive-navbar-nav'>
                <Nav className="container-fluid ml-auto">
                    {(userData?.user?.token && userData?.user?.user) &&
                        <>
                            <Nav.Link href='/recipe/new' style={{ fontSize: '30px', paddingTop: '5px' }}>+</Nav.Link>
                            <div className='ms-auto' style={{ paddingTop: '15px' }}>
                                <Notifications userData={userData} />
                            </div >
                        </>
                    }
                    {(!userData?.user?.token || !userData?.user?.user) &&
                        < Nav className="ms-auto" style={{paddingRight:'25px'}}>
                            <Nav.Link href='/login'>Login</Nav.Link>
                            <Nav.Link href='/register'>Register</Nav.Link>
                        </Nav>
                    }
                </Nav>
                {(userData?.user?.token && userData?.user?.user) &&
                    <Nav className="ms-auto" style={{paddingRight:'25px'}}>
                        <NavDropdown id="dropdown-basic-button" drop="start"
                            title={<img className="avatar" src={avatar} alt="avatar" width="40px" height="auto" />}>
                            <NavDropdown.ItemText>{userData.user.user.username}</NavDropdown.ItemText>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href={'/user/' + userData.user.user.username}>Profile</NavDropdown.Item>
                            {userData.user.user.is_staff === true &&
                                <NavDropdown.Item href={'/reports'}>Handle Reports</NavDropdown.Item>
                            }
                            <NavDropdown.Item href={'/user/' + userData.user.user.id + '/edit'}>Edit Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {
                                userData.logout();
                            }}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                }
            </Navbar.Collapse>
        </Navbar>
    )
};

export default Navigation;