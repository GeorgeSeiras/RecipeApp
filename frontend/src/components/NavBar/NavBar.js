import React, { useContext } from 'react';
import { UserContext } from '../Context/authContext';

const Navigation = () => {
    const user = useContext(UserContext);
    return (
        <h1></h1>
        // <>
        //     <Navbar className='nav' sticky='top' collapseOnSelect fixed='top' expand='sm' bg='dark' variant='dark'>
        //         <Container>
        //             <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        //             <Navbar.Collapse id='responsive-navbar-nav'>
        //                 <Nav className="container-fluid">
        //                     <Nav.Link className="ms-auto" href='/'>Home</Nav.Link>
        //                     <Nav.Link className="ms-auto" href='/recipes'>Recipes</Nav.Link>
        //                     <Nav.Link className="me-auto" href='/login'>Login</Nav.Link>
        //                 </Nav>
        //             </Navbar.Collapse>
        //         </Container>
        //     </Navbar>
        // </>
    )
};

export default Navigation;