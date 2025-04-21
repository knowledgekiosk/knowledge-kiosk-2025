import { Link } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { MdArrowBackIosNew } from "react-icons/md";
const RegistrationStatus = () => {
  return (
    <div className="flex flex-col font-rubik-black h-screen justify-center items-center ">
      <div className="flex flex-col gap-4 ">
        <h2 className=" font-semibold text-2xl w-[100px] text-green-500">
          Success!!!
        </h2>
        <h1 className="text-3xl font-semibold">
          Thank you for your registration with Knowledge Kiosk!{" "}
        </h1>
        <span className="text-2xl mt-2">
          Your registration will now go through admin review
        </span>
        <div className="bg-blue-50 flex items-center gap-2 mt-4 rounded-md p-2 text-xl text-blue-600 w-full">
          <FaInfoCircle></FaInfoCircle>
          <p className="text-lg">
            You can also check your registration status by scanning your card
          </p>
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center">
        <ul className="timeline">
          <li>
            <hr className="bg-blue-600" />
            <div className="timeline-start border-blue-500 text-xl timeline-box">
              Registration
            </div>
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="text-blue-600 h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <hr className="bg-blue-600" />
          </li>
          <li>
            <hr className="bg-blue-600" />
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className=" h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="timeline-end border-orange-500 text-xl border-dashed timeline-box">
              Awaiting Approval
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start border-green-500 text-xl  timeline-box">
              Decision
            </div>
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </li>
        </ul>
      </div>
      <div className="mt-10 flex items-left">
        <Link to="/">
          <button className="bg-blue-600 flex items-center text-center pl-2 gap-2 justify-center w-[300px] p-4 text-lg rounded-full text-white text-[10px]">
            <MdArrowBackIosNew className="text-xl"></MdArrowBackIosNew>
            <span className="text-xl">Take me home</span>
          </button>
        </Link>
      </div>
    </div>
  );
};
export default RegistrationStatus;
