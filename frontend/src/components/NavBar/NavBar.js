import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/authContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import NAV_LOGO from '../../static/nav_logo.png';
import NO_AVATAR from '../../static/no_avatar.svg';

import './NavBar.css'
const Navigation = () => {
    const userData = useContext(UserContext);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        if(userData?.user?.user?.image?.image ){
            setAvatar('http://localhost:8000/media/'+userData?.user?.user?.image?.image )
        }else{
            setAvatar(NO_AVATAR)
        }
    }, [userData?.user?.user?.image?.image])

    return (
        <>
            <Navbar sticky='top' collapseOnSelect fixed='top' expand='sm' bg='secondary' variant='dark'>
                <Navbar.Brand id="Brand" href="/">
                    <img src={NAV_LOGO} width="50px" height="auto" alt="logo" className="img-responsive" />
                    RecipeApp
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav className="container-fluid ml-auto">
                        <Nav.Link href='/recipes'>Recipes</Nav.Link>
                        {(!userData.user.token || !userData.user.user) &&
                            < Nav className="ms-auto">
                                <Nav.Link href='/login'>Login</Nav.Link>
                                <Nav.Link href='/register'>Register</Nav.Link>
                            </Nav>
                        }
                    </Nav>
                    {(userData.user.token && userData.user.user) &&
                        <Nav className="ms-auto">
                            <NavDropdown id="dropdown-basic-button" drop="start"
                                title={<img className="avatar" src={avatar} alt="avatar" width="40px" height="auto" />}>
                                <NavDropdown.Item href={'/user/' + userData.user.user.username}>Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={()=>{
                                    userData.logout();
                                }}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    }
                </Navbar.Collapse>
            </Navbar>
        </>
    )
};

export default Navigation;