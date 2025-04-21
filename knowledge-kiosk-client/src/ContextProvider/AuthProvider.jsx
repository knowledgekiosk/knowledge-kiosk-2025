import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("cardData");

      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        localStorage.removeItem("cardData");
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem("cardData");
      return null;
    }
  };

  const [cardData, setCardData] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Helper to check auth
  const isAuthenticated = () => {
    return !!token && !!cardData && cardData?.userStatus === "approved";
  };

  useEffect(() => {
    const resetInactivityTimer = () => setLastActivityTime(Date.now());
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [token, cardData]);

  // Session timeout logic
  useEffect(() => {
    if (!isAuthenticated() || isLoggedOut) return;
    const handleInactivity = () => {
      const inactivityTime = Date.now() - lastActivityTime;
      if (inactivityTime > 1 * 60 * 1000 && !isLoggedOut) {
        let autoLogoutTimeout;
        Swal.fire({
          title: "Session Timeout",
          text: "You have been inactive for a while. Are you still using the system?",
          icon: "warning",
          confirmButtonText: "Yes, I am",
        }).then((result) => {
          if (result.isConfirmed) {
            setLastActivityTime(Date.now());
            clearTimeout(autoLogoutTimeout);
          } else {
            logout();
          }
        });
        autoLogoutTimeout = setTimeout(() => {
          if (!isLoggedOut) logout();
        }, 5000);
      }
    };
    const inactivityInterval = setInterval(handleInactivity, 10000);
    return () => clearInterval(inactivityInterval);
  }, [lastActivityTime, isLoggedOut]);

  // WebSocket logic
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    newSocket.on("card_scanned", (data) => {
      if (data.needsRegistration) {
        setNeedsRegistration(true);
        setCardData({ cardId: data.cardNumber });
        showStatusNotification("new");
      } else if (data.user.userStatus === "approved") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Successfully Logged in as ${data.user.userName}`,
          showConfirmButton: false,
          timer: 2500,
        }).then(() => {
          localStorage.setItem("cardData", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          setCardData(data.user);
          setToken(data.token);
        });
      } else {
        showStatusNotification(data.user.userStatus);
      }
    });
    return () => newSocket.disconnect();
  }, []);

  // Notifications
  const showStatusNotification = (status) => {
    const messages = {
      new: {
        title: "Registration Required!",
        text: "This card isn’t in the system yet. Please register.",
        icon: "info",
      },
      pending: {
        title: "Registration Under Review",
        text: "Please wait for approval.",
        icon: "info",
      },
      approved: {
        title: "Successfully Logged In",
        text: `Logged in as ${cardData?.userName}`,
        icon: "success",
      },
      rejected: {
        title: "Registration Rejected",
        text: "Contact support.",
        icon: "error",
      },
    };
    const msg = messages[status];
    if (msg) Swal.fire(msg);
  };

  // Login function with duplicate detection
  const login = (userData, userToken) => {
    // If already logged in
    if (isAuthenticated()) {
      Swal.fire({
        title: "Already Logged In",
        text: "You are already logged in. Do you want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Logout",
        cancelButtonText: "Stay Logged In",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        }
      });
      return;
    }
    if (userData.userStatus !== "approved") {
      Swal.fire({
        title: "Registration Pending",
        text: "Your account is under review.",
        icon: "warning",
      });
      return;
    }
    // Successful login
    localStorage.setItem("cardData", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    setCardData(userData);
    setToken(userToken);
    setLoading(false);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("cardData");
    localStorage.removeItem("token");
    setCardData(null);
    setToken(null);
    setLoading(true);
    setIsLoggedOut(true);
    Swal.fire({
      title: "Logged Out",
      text: "You have been logged out.",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const authInfo = {
    cardData,
    needsRegistration,
    isAuthenticated,
    login,
    logout,
    loading,
    token,
    socket,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};