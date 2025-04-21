import React, { useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../ContextProvider/AuthProvider';
import { Slides } from './Slides';


export const SlideShow = () => {
   
   

    return (
        <div >
            
            <Slides ></Slides>
        </div>
    );
};
