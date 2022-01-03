import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/authContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import NAV_LOGO from '../../static/nav_logo.png';
import './NavBar.css'
const Navigation = () => {
    const userData = useContext(UserContext);
    const [avatar,setAvatar] = useState(null);

    useEffect(()=>{
        setAvatar(userData?.user?.user?.avatar||NAV_LOGO)
    },[])
    
    return (
        <>
            <Navbar sticky='top' collapseOnSelect fixed='top' expand='sm' bg='secondary' variant='dark'>
                <Navbar.Brand id="Brand" href="/">
                    <img src={NAV_LOGO} width="70px" height="auto" className="img-responsive" />
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
                        {(userData.user.token && userData.user.user) &&
                            <Nav className="ms-auto">
                                <Dropdown id="dropdown-basic-button" drop="start">
                                    <Dropdown.Toggle  variant="info" id="dropdown-basic">
                                        
                                        <img  src={avatar} width="20px" height="auto"></img>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href={'/user/' + userData.user.user.username}>Profile</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
};

export default Navigation;