// src/components/Register.jsx

import useAxiosPublic from "../../Custom/useAxiosPublic";
import { Link, useNavigate } from "react-router-dom";


import Swal from "sweetalert2";
import { BsInfoSquare } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../ContextProvider/AuthProvider";
import { useForm } from "react-hook-form";

export const Register = () => {
  const axiosPublic = useAxiosPublic();
  const { cardData, setNeedsRegistration, needsRegistration } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // console.log("Register component rendered, cardData:", cardData);
  
  

  // 1) react-hook-form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (cardData?.cardId) {
      // console.log("filling form.cardId with", cardData.cardId);
      setValue("cardId", cardData.cardId);
    }
  }, [cardData?.cardId, setValue]);

  const currentDate = new Date().toISOString();

  // 3) onSubmit handler with extra logging & error paths
  const onSubmit = async(data) => {
    setIsSubmitting(true);

    const payload = {
      cardId: data.cardId,
      userName: data.name,
      userEmail: data.email,
      role: "user",
      cardStatus: "active",
      userStatus: "pending",
      createdAt: currentDate,
    };

    try {
      await axiosPublic.post('/register', payload).then((res) => {
        const insertedId =
          res.data?.insertedId != null ? res.data.insertedId : res.insertedId;

        if (insertedId) {
          // console.log("insertedId:", insertedId);
          reset();
          Swal.fire({
            title: "Success!",
            text: "Your registration is under review. You can log in once approved.",
            icon: "success",
          });
          setNeedsRegistration(false);
          navigate("/registration-status");
        } else {
          console.warn("No insertedId in response:", res);
          Swal.fire({
            title: "Registration Failed",
            text: "Server did not return an insertedId. Please try again.",
            icon: "error",
          });
        }
      });

      // depending on axiosPublic, the insertedId may live on `res.data` or directly on `res`
    } catch (err) {
      console.error("Error during /register:", err, err.response);
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.message ||
          err.message ||
          "An unknown error occurred.",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-white h-screen items-center justify-center">
      {/* Header & Info */}
      <div className="text-4xl font-semibold mb-4">
        <span className="text-blue-500 border-blue-500 border-b-4 border-t-4 border-l-4  p-2 rounded-l-md ">
          Knowledge Kiosk 
        </span>{" "}
        | Registration
      </div>
      <div className="bg-yellow-100 text-yellow-600 p-3 mt-4 rounded-md mb-6 flex items-center gap-2">
        <BsInfoSquare />
        <span>
          Please note that you can only register if you have a valid ID. Provide
          your real name and email.
        </span>
      </div>

      {/* The Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[600px] gap-4"
      >
        {/* CardId (disabled) */}
        <label htmlFor="cardId" className="text-xl">
          Card Data
        </label>
        <input
          id="cardId"
          type="text"
          disabled
          {...register("cardId")}
          placeholder="Please scan your card"
          className="w-full p-3 bg-blue-50 rounded-full focus:outline-none"
        />

        {/* Name */}
        <label htmlFor="name" className="text-xl">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your name"
          {...register("name", { required: true })}
          className="w-full p-3 border border-blue-500 rounded-full focus:outline-none"
        />
        {errors.name && <span className="text-red-500">Name is required</span>}

        {/* Email */}
        <label htmlFor="email" className="text-xl">
          Company Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@company.com"
          {...register("email", { required: true })}
          className="w-full p-3 border border-blue-500 rounded-full focus:outline-none"
        />
        {errors.email && (
          <span className="text-red-500">Email is required</span>
        )}

        <div className="mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </div>

        <input
          type="submit"
          
          className="w-1/2 mx-auto p-3 bg-blue-600 text-white rounded-full disabled:opacity-50"
          value={isSubmitting ? "Submitting..." : "Register"}
              disabled={isSubmitting}
          
        />
          
        
      </form>
    </div>
  );
};
