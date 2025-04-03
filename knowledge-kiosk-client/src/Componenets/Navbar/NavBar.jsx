import { useContext } from "react";
import { AuthContext } from "../../ContextProvider/AuthProvider";
import { Link } from "react-router-dom";
import { BsGlobe } from "react-icons/bs";
import { TbGridDots } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { BsFiles } from "react-icons/bs";
import { LuMap } from "react-icons/lu";
import { PiSlideshow } from "react-icons/pi";
import { IoChatbubbleOutline } from "react-icons/io5";
import { RiInboxArchiveLine } from "react-icons/ri";
const NavBar = () => {
  const {} = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 fixed bottom-0 left-1">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className=" bg-blue-100 p-2  rounded-full shadow"
          >
            <TbGridDots></TbGridDots>
          </div>
          <ul
            tabIndex={0}
            className="menu w-[170px] menu-sm text-left shadow dropdown-content text-xs bg-green-50 flex flex-col gap-2 rounded-box z-100 -mt-60 ml-2  p-2 "
          >
            <Link className="flex gap-2 justify-between shadow pl-2 pr-2 pt-1 pb-1 rounded-full bg-white items-center">
              {" "}
             <div className="flex items-center gap-2"><BsGlobe></BsGlobe> <span>websites</span> </div><IoIosArrowForward></IoIosArrowForward>
            </Link>

            <Link className="flex gap-2 justify-between shadow pl-2 pr-2 pt-1 pb-1 rounded-full bg-white items-center"> <div className="flex items-center gap-2"><LuMap></LuMap><span>kiosk channel </span></div><IoIosArrowForward></IoIosArrowForward></Link>

            <Link className="flex gap-2 justify-between shadow pl-2 pr-2 pt-1 pb-1 rounded-full bg-white items-center"><div className="flex items-center gap-2"><BsFiles></BsFiles> <span>all files</span> </div><IoIosArrowForward></IoIosArrowForward></Link>

            <Link className="flex gap-2 justify-between shadow pl-2 pr-2 pt-1 pb-1 rounded-full bg-white items-center"> <div className="flex items-center gap-2"><PiSlideshow> </PiSlideshow><span>slideshow </span></div><IoIosArrowForward></IoIosArrowForward></Link>

            <Link className="flex gap-2 justify-between shadow pl-2 pr-2 pt-1 pb-1 rounded-full bg-white items-center"><div className="flex items-center gap-2"><IoChatbubbleOutline></IoChatbubbleOutline> <span>provide feedback </span></div><IoIosArrowForward></IoIosArrowForward></Link>

            <Link className="flex gap-2 justify-between shadow pl-2 pr-2 pt-1 pb-1 rounded-full bg-white items-center"><div className="flex items-center gap-2"><RiInboxArchiveLine></RiInboxArchiveLine><span>inbox</span></div> <IoIosArrowForward></IoIosArrowForward></Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
