import React, { useContext } from 'react';
import { UserContext } from '../Context/authContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NAV_LOGO from '../../static/nav_logo.png';
const Navigation = () => {
    const user = useContext(UserContext);
    return (
        <>
            <Navbar sticky='top' collapseOnSelect fixed='top' expand='sm' bg='dark' variant='dark'>
                <Navbar.Brand id="Brand" href="/">
                    <img src={NAV_LOGO} width="70px" height="auto" className="img-responsive" />
                    RecipeApp
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav className="container-fluid ml-auto">
                        <Nav.Link href='/recipes'>Recipes</Nav.Link>
                        {(!user.user.token || !user.user.user) &&
                            < Nav className="ms-auto">
                                <Nav.Link href='/login'>Login</Nav.Link>
                                <Nav.Link href='/register'>Register</Nav.Link>
                            </Nav>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
};

export default Navigation;