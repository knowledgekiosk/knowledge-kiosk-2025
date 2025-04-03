import React, { useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../ContextProvider/AuthProvider';
import NavBar from '../Navbar/Navbar';

export const SlideShow = () => {
    const { needsRegistration, setNeedsRegistration } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        console.log('Needs Registration:', needsRegistration);  // Debugging line

        if (needsRegistration) {
            Swal.fire({
                title: 'Registration Required',
                text: 'Please register your card.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Register',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect to the registration page
                    console.log('navigating to registration page')
                    navigate('/register',{state:{from : location}});
                } else {
                    // Reset the needsRegistration flag
                    setNeedsRegistration(false);
                }
            });
        }
    }, [needsRegistration, setNeedsRegistration, navigate]); // Run when needsRegistration changes

    return (
        <div>
            
            <h1 className="pb-2 rubik">Welcome to home page</h1>
        </div>
    );
};
