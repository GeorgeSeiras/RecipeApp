import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { UserContext } from '../Context/authContext';

const Navigation = () => {
    const user = useContext(UserContext);
    console.log(user)
    return (
        <>
            <Navbar className='nav' sticky='top' collapseOnSelect fixed='top' expand='sm' bg='dark' variant='dark'>
                <Container>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        <Nav>
                            <Nav.Link href='/'>Home</Nav.Link>
                            <Nav.Link href='/recipes'>Recipes</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Navigation;