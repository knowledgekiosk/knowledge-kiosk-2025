import { useContext } from "react";
import { AuthContext } from "../../ContextProvider/AuthProvider";
import dateFormat, { masks } from "dateformat";
import { GoClockFill } from "react-icons/go";
export const DashBoardHeader = () => {
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
    } else if (currentHour > 6) {
      return "Good Morning";
    } else {
      return "Good Night";
    }
  };

  const greetingText = greetingUser();
  return (
    <div className=" flex justify-between  p-8 bg-linear-to-r  from-blue-500 to-green-500 rounded-xl  items-center">
      <div className="flex flex-col text-white">
        <span className="text-md font-semibold">{greetingText}, </span>
        <span className="text-3xl font-semibold">{cardData?.userName}</span>
        <span className="pt-2">{currentDay}</span>
      </div>
      <div className="flex items-center bg-white font-semibold p-2 w-[150px] text-center justify-center rounded-4xl gap-2">
        <GoClockFill className="text-blue-500 text-xl"></GoClockFill>
        <span className="text-blue-500 text-xl">{currentTime}</span>
      </div>
    </div>
  );
};
