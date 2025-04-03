import { Outlet } from "react-router-dom"
import NavBar from "../../Navbar/Navbar"



export const Root = () => {
    return (
        <div>
            <div>
                <NavBar></NavBar>
            </div>
            <div className="max-h-screen">
                <Outlet/>

            
            </div>
          
        </div>
    )
}