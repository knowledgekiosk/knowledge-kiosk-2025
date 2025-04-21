// src/components/NavBar.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../ContextProvider/AuthProvider";

/* ───── icons ───── */
import { TbGridDots } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { FaGlobe, FaUsers, FaUser, FaIdCard } from "react-icons/fa6";
import { RiSlideshow3Line } from "react-icons/ri";
import { IoFolder, IoChatboxOutline } from "react-icons/io5";
import { AiOutlineLogin } from "react-icons/ai";
import { SiBattledotnet } from "react-icons/si";
import { MdSpaceDashboard } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { cardData, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ───── close if user clicks outside ───── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
        requestAnimationFrame(() => document.activeElement?.blur());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  /* ───── helper ───── */
  const closeMenu = (cb) => () => {
    setOpen(false);
    requestAnimationFrame(() => document.activeElement?.blur());
    cb?.();
  };

  /* ───── auth actions ───── */
  const askLogin = closeMenu(() =>
    Swal.fire({
      title: "Please scan your card or login manually",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Login Manually",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((r) => r.isConfirmed && navigate("/login"))
  );

  const doLogout = closeMenu(() => {
    logout();
    Swal.fire({
      title: "Logged Out!",
      text: "Successfully logged out.",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    navigate("/");
  });

  /* ───── render ───── */
  return (
    <div className="navbar fixed bottom-0 z-50 max-w-[100px]" ref={wrapperRef}>
      <div className="navbar-start">
        <div className={`dropdown ${open ? "dropdown-open" : ""}`}>
          {/* toggle */}
          <button
            type="button"
            className="bg-linear-to-r from-green-500 to-blue-500 h-[80px] w-[80px] flex items-center justify-center ml-2 mb-2 p-2 rounded-full shadow focus:outline-none"
            onClick={() => {
              setOpen((v) => !v);
              if (open)
                requestAnimationFrame(() => document.activeElement?.blur());
            }}
          >
            <TbGridDots className="text-white text-4xl" />
          </button>

          {/* menu */}
          <ul
            className={`menu w-[700px] menu-sm shadow grid grid-cols-2 gap-4 dropdown-content bg-blue-100 rounded-box ml-8 p-2 ${
              isAuthenticated() ? "-mt-104" : "-mt-102"
            }`}
          >
            {/* Websites */}
            <Link
              to="/websites"
              onClick={closeMenu()}
              className="flex justify-between items-center gap-2 p-2 bg-white rounded-full shadow"
            >
              <span className="flex items-center gap-2">
                <span className="bg-blue-50 p-2 rounded-full">
                  <FaGlobe className="text-[30px] text-blue-500" />
                </span>
                <span>
                  <div className="text-[15px]">Websites</div>
                  <div className="text-[10px] text-blue-700">
                    view or add company websites
                  </div>
                </span>
              </span>
              <IoIosArrowForward className="text-[20px]" />
            </Link>

            {/* Kiosk Channel */}
            <Link
              to="/kiosk-channel"
              onClick={closeMenu()}
              className="flex justify-between items-center gap-2 p-2 bg-white rounded-full shadow"
            >
              <span className="flex items-center gap-2">
                <span className="bg-blue-50 p-2 rounded-full">
                  <SiBattledotnet className="text-[30px] text-blue-500" />
                </span>
                <span>
                  <div className="text-[15px]">Kiosk Channel</div>
                  <div className="text-[10px] text-blue-700">
                    add presentation categories
                  </div>
                </span>
              </span>
              <IoIosArrowForward className="text-[20px]" />
            </Link>

            {/* All Public Files */}
            <Link
              to="/all-files"
              onClick={closeMenu()}
              className="flex justify-between items-center gap-2 p-2 bg-white rounded-full shadow"
            >
              <span className="flex items-center gap-2">
                <span className="bg-blue-50 p-2 rounded-full">
                  <IoFolder className="text-[30px] text-blue-500" />
                </span>
                <span>
                  <div className="text-[15px]">All Public Files</div>
                  <div className="text-[10px] text-blue-700">
                    latest public presentations
                  </div>
                </span>
              </span>
              <IoIosArrowForward className="text-[20px]" />
            </Link>

            {/* Slideshow */}
            <Link
              to="/"
              onClick={closeMenu()}
              className="flex justify-between items-center gap-2 p-2 bg-white rounded-full shadow"
            >
              <span className="flex items-center gap-2">
                <span className="bg-blue-50 p-2 rounded-full">
                  <RiSlideshow3Line className="text-[30px] text-blue-500" />
                </span>
                <span>
                  <div className="text-[15px]">Slideshow</div>
                  <div className="text-[10px] text-blue-700">
                    stay updated with latest events
                  </div>
                </span>
              </span>
              <IoIosArrowForward className="text-[20px]" />
            </Link>

            {/* Help us improve */}
            <Link
              to="/feedback"
              onClick={closeMenu()}
              className="flex justify-between items-center gap-2 p-2 bg-white rounded-full shadow"
            >
              <span className="flex items-center gap-2">
                <span className="bg-blue-50 p-2 rounded-full">
                  <IoChatboxOutline className="text-[30px] text-blue-500" />
                </span>
                <span>
                  <div className="text-[15px]">Help us improve</div>
                  <div className="text-[10px] text-blue-700">
                    provide feedback on kiosk issues
                  </div>
                </span>
              </span>
              <IoIosArrowForward className="text-[20px]" />
            </Link>

            {/* Community thread */}
            <Link
              to="/thread"
              onClick={closeMenu()}
              className="flex justify-between items-center gap-2 p-2 bg-white rounded-full shadow"
            >
              <span className="flex items-center gap-2">
                <span className="bg-blue-50 p-2 rounded-full">
                  <FaUsers className="text-[30px] text-blue-500" />
                </span>
                <span>
                  <div className="text-[15px]">Community thread</div>
                  <div className="text-[10px] text-blue-700">
                    help others find an answer
                  </div>
                </span>
              </span>
              <IoIosArrowForward className="text-[20px]" />
            </Link>

            {/* Dashboard */}
            {isAuthenticated() && (
              <Link
                to="/dashboard/overview"
                onClick={closeMenu()}
                className="flex justify-between items-center gap-2 p-2 bg-white rounded-full shadow"
              >
                <span className="flex items-center gap-2">
                  <span className="bg-blue-50 p-2 rounded-full">
                    <MdSpaceDashboard className="text-[30px] text-blue-500" />
                  </span>
                  <span>
                    <div className="text-[15px]">Dashboard</div>
                    <div className="text-[10px] text-blue-700">
                      your information hub
                    </div>
                  </span>
                </span>
                <IoIosArrowForward className="text-[20px]" />
              </Link>
            )}

            {/* Auth */}
            {isAuthenticated() ? (
              <div className="bg-white flex shadow p-2 rounded-full items-center justify-between ">
                <FaUser className="bg-linear-to-r from-green-500 to-blue-500 text-white p-2 text-[40px] rounded-full" />
                <span className="text-lg font-semibold">
                  {cardData?.userName}
                </span>

                <button
                  type="button"
                  onClick={doLogout}
                  className="flex w-[100px] justify-center text-white items-center gap-2 p-2 bg-red-500 rounded-full shadow"
                >
                  <RiLogoutCircleRLine className="text-xl" />
                  <span className="text-md">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2 justify-center p-3 rounded-full bg-white">
                <Link
                  to="/register"
                  onClick={closeMenu()}
                  className="flex gap-2 bg-green-500 text-white px-4 py-2 rounded-full items-center"
                >
                  <FaIdCard className="text-xl" />
                  <span>Register</span>
                </Link>
                <button
                  type="button"
                  onClick={askLogin}
                  className="flex gap-2 bg-blue-500 text-white px-4 py-2 rounded-full items-center"
                >
                  <AiOutlineLogin className="text-[20px]" />
                  <span>Login</span>
                </button>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
