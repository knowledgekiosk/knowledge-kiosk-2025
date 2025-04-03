import { createContext, useState, useEffect } from 'react';
import { io } from "socket.io-client";

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
    const [needsRegistration, setNeedsRegistration] = useState(false); // Initially false
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const newSocket = io("http://localhost:5000");

        newSocket.on("connect", () => {
            console.log("WebSocket Connected to Server!");
        });

        newSocket.on("disconnect", () => {
            console.warn("WebSocket Disconnected!");
        });

        newSocket.on("error", (error) => {
            console.error("WebSocket Error:", error);
        });

        setSocket(newSocket);

        // Listen for 'card_scanned' event from backend
        newSocket.on("card_scanned", (data) => {
            console.log("Data Received from Server:", data);

            if (data.needsRegistration) {
                console.log("New user detected. Needs registration:", data);
                setNeedsRegistration(true);  // Update context state
                setCardData({ cardId: data.cardId });  // Store cardId for consistency
            } else {
                console.log("Authenticated User:", data);
                localStorage.setItem("cardData", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                setCardData(data.user);
                setToken(data.token);
            }
        });

        return () => {
            console.log("🔌 Closing WebSocket connection...");
            newSocket.disconnect();
        };
    }, []); // Empty dependency array means this useEffect runs only once

    const isAuthenticated = () => !!token;

    const logout = () => {
        localStorage.removeItem("cardData");
        localStorage.removeItem("token");
        setCardData(null);
        setToken(null);
        setLoading(true)
    };

    const authInfo = {
        cardData,
        needsRegistration,
        isAuthenticated,
        logout,
        loading,
        setNeedsRegistration, // Make this available to other components if needed
    };

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};
