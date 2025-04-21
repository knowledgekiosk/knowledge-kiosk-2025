/*
-- Knowledge Kiosk 2025
-- Developed by Sayem Ibne Taher
*/

import { Outlet } from "react-router-dom"
import NavBar from "../../Navbar/Navbar"



export const Root = () => {
    return (
        <div className="font-rubik ">
            <div>
                <NavBar></NavBar>
            </div>
            <div >
                <Outlet/>

            
            </div>
          
        </div>
    )
}