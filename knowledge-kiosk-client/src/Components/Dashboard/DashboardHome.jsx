import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../ContextProvider/AuthProvider";
import dateFormat, { masks } from "dateformat";
import { GoClockFill } from "react-icons/go";
import { IoAdd } from "react-icons/io5";
import { FaRegQuestionCircle } from "react-icons/fa";
import "./dashboard.css";
export const DashboardHome = () => {
  const { cardData, loading } = useContext(AuthContext);
  const currentDate = new Date();
  const currentTime = dateFormat(currentDate, "h:MM TT");
  const currentDay = dateFormat(currentDate, "dddd, mmmm dS, yyyy");

  const greetingUser = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Night";
    } else if (currentHour < 17) {
      return "Good Afternoon";
    } else if (currentHour < 21) {
      return "Good Evening";
    } 
    else if(currentHour > 6){
      return "Good Morning"
    }
    else {
      return "Good Night";
    }
  };

  const greetingText = greetingUser();

  return (
    <div className="flex flex-col h-full mt-4 w-full">
     
      <div className="bg-blue-50 p-4 flex gap-4 flex-col w-full justify-evenly h-full rounded-xl">
        <div className="grid grid-cols-12  gap-2">
          <div className=" col-span-3 flex flex-col gap-2  h-[210px] bg-green-500 rounded-md shadow">
            <div
              className="tooltip flex justify-end pt-2 pr-2 text-white "
              data-tip="this card displays total number of uploaded files by this user"
            >
              <FaRegQuestionCircle ></FaRegQuestionCircle>
            </div>
          </div>
          <div className=" col-span-6 h-[210px] bg-blue-500 rounded-md shadow">
          <div
              className="tooltip flex justify-end pt-2 pr-2 text-white "
              data-tip="this provides an overview of registered users, notifications and number of expiring files"
            >
              <FaRegQuestionCircle></FaRegQuestionCircle>
            </div>
          </div>
          <div className=" col-span-3 h-[210px] bg-red-500 rounded-md shadow">
          <div
              className="tooltip flex justify-end pt-2 pr-2 text-white "
              data-tip="this provides an overview of the number of expiring files"
            >
              <FaRegQuestionCircle ></FaRegQuestionCircle>
            </div>
          </div>
        </div>
        <div className=" border-blue-300 border-b-1 pb-2">
          <span className=" text-2xl font-semibold text-blue-950 ">
            Latest slideshows
          </span>
        </div>
        <div>
          <div className="grid grid-cols-12  gap-2">
            <div className=" col-span-3  flex text-center items-center justify-center  h-[210px] bg-blue-500 rounded-md shadow">
              <IoAdd className="text-8xl text-white"></IoAdd>
            </div>

            <div className=" col-span-9 h-[210px] bg-orange-500 rounded-md shadow">
            <div
              className="tooltip flex justify-end pt-2 pr-2 text-white "
              data-tip="this provides an overview of the latest uploaded files"
            >
              <FaRegQuestionCircle ></FaRegQuestionCircle>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
