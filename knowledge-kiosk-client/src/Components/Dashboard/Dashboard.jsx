import { useContext } from "react";
import { AuthContext } from "../../ContextProvider/AuthProvider";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { LuFileSliders } from "react-icons/lu";
import { FaUsers } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { FaRegIdCard } from "react-icons/fa6";
import { MdOutlineVerified } from "react-icons/md";

import Swal from "sweetalert2";
import { DashBoardHeader } from "./DashboardHeader";

export const Dashboard = () => {
  const { cardData, logout, isAuthenticated, loading } =
    useContext(AuthContext);
  const isAdmin = cardData?.role === "admin";

  const navigate = useNavigate();
  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log Out",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Logged Out!",
          text: "Successfully logged out.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      }
    });
  };

  return (
    <div className="flex lg:flex-row overflow-hidden h-screen overflow-x-hidden p-4 gap-4 overflow-y-hidden bg-blue-50 max-w-screen w-screen">
      <div className="w-64 flex flex-col gap-4 h-full justify-between rounded-md   ">
        <div className="flex h-[150px] justify-center  gap-4 p-2 bg-white rounded-md items-center">
          <div className="bg-linear-to-r from-green-500 to-blue-500 w-[70px] h-[70px] flex flex-col gap-2 items-center justify-center rounded-full ">
            <FaUser className="text-4xl text-white"></FaUser>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-blue-600 text-lg">
              {cardData?.userName}
            </h1>
            <h3 className="text-[12px]">{cardData?.cardId}</h3>
            <div className="bg-blue-500 p-1 flex items-center gap-2 justify-center  text-white text-xs text-center rounded-full">
              <MdOutlineVerified></MdOutlineVerified>
              <span >
              {" "}
              Verified {cardData?.role === "admin" ? "Admin" : "User" }
            </span>
            </div>
            
          </div>
        </div>
        <div>
          <ul className="flex flex-col bg-white gap-4 p-4   rounded-md justify-between items-center ">
            <li>
              <NavLink
                to="/dashboard/overview"
                className={({ isActive }) =>
                    "flex gap-4 pl-15 items-center w-[240px]  p-2  rounded-full " +
                    (isActive ? "active-link" : "inactive-link")
                  }
              >
                <BiSolidDashboard className="text-xl"></BiSolidDashboard>
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/upload"
                className={({ isActive }) =>
                    "flex gap-4 pl-15 items-center w-[240px]  p-2  rounded-full " +
                    (isActive ? "active-link" : "inactive-link")
                  }
              >
                <IoMdCloudUpload className="text-xl"></IoMdCloudUpload>
                Upload
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/allFiles"
                className={({ isActive }) =>
                    "flex gap-4 pl-15 items-center w-[240px]  p-2  rounded-full " +
                    (isActive ? "active-link" : "inactive-link")
                  }
              >
                <LuFileSliders className="text-xl"></LuFileSliders>
                All Files
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink
                  to="/dashboard/allUsers"
                  className={({ isActive }) =>
                    "flex gap-4 pl-15 items-center w-[240px]  p-2  rounded-full " +
                    (isActive ? "active-link" : "inactive-link")
                  }
                >
                  <FaUsers className="text-xl"></FaUsers>
                  All Users
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/dashboard/askQuestions"
                className={({ isActive }) =>
                    "flex gap-4 pl-15 items-center w-[240px]  p-2  rounded-full " +
                    (isActive ? "active-link" : "inactive-link")
                  }
              >
                <FaQuestionCircle className="text-xl"></FaQuestionCircle>
                Ask a question
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/feedback"
                className={({ isActive }) =>
                    "flex gap-4 pl-15 items-center w-[240px]  p-2  rounded-full " +
                    (isActive ? "active-link" : "inactive-link")
                  }
              >
                <MdFeedback className="text-xl"></MdFeedback>
                Feedback
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) =>
                    "flex gap-4 pl-15 items-center w-[240px]  p-2  rounded-full " +
                    (isActive ? "active-link" : "inactive-link")
                  }
              >
                <FaRegIdCard className="text-xl"></FaRegIdCard>
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                    "flex gap-4 pl-15 items-center w-[240px]  p-2  rounded-full " +
                    (isActive ? "active-link" : "inactive-link")
                  }
              >
                <GoHomeFill className="text-xl"></GoHomeFill>
                Home
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="bg-white shadow rounded-full p-2 flex gap-2 items-center justify-between">
          <div className="h-[30px] w-[30px] rounded-full p-2 bg-blue-100 text-blue-600 flex items-center justify-center ">
            <FaUser className="text-2xl"></FaUser>
          </div>
          <span className="text-[15px] font-semibold text-blue-950">
            {cardData?.userName}
          </span>
          <button
            onClick={handleLogOut}
            className="p-1 bg-red-500 text-white text-[15px] flex items-center justify-center font-semibold rounded-full w-[70px] text-center"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex max-h-full flex-col justify-between p-4 rounded-md  flex-1 bg-white">
        <DashBoardHeader></DashBoardHeader>
        <Outlet>

        </Outlet>
      </div>
    </div>
  );
};
