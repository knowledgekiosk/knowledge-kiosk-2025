import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Custom/useAxiosPublic";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../ContextProvider/AuthProvider";
import Swal from "sweetalert2";
import { BsInfoSquare } from "react-icons/bs";

export const Login = () => {
  const axiosPublic = useAxiosPublic();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data.email)

    try {
      // Send login request with email
      const res = await axiosPublic.post("/login", {
        email: data.email,
      });

      if (res.data.token) {
        // If the user is authenticated, login them and store the token
        login(res.data.user, res.data.token);
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Successfully Logged in as ${res.data.user.userName}`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/");
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        icon: "error",
      });
      reset()
    }
  };

  return (
    <div className="flex lg:flex-row  bg-white flex-col gap-2 items-center h-screen rounded-md p-5  justify-center">
      <div className="flex flex-col justify-center gap-6">
        <div className="flex gap-2 items-center justify-center mb-6 text-4xl font-semibold">
            <span className=" border-blue-500 text-blue-500 border-b-4 border-t-4 border-l-4 p-3 rounded-l-2xl ">
                Knowledge
            Kiosk</span>
            <span> | Login </span>
        </div>
        <div className="bg-yellow-100 text-xl w-full flex gap-2 items-center text-yellow-600 p-3 rounded-md">
          <BsInfoSquare></BsInfoSquare>
          <span>
            Please note that you can only login if your registration is
            approved. Scan your card to know your registration status.
          </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mt-5"
        >
          <div>
            <label htmlFor="email" className="block text-2xl  text-gray-800">
              Enter Your Company Email Address
            </label>
            <input
              type="email"
              name="email"
              {...register("email", { required: true })}
              placeholder="Type your email here"
              className="block w-full  text-lg p-4 mt-4 text-blue-600 bg-white border border-blue-500 rounded-full focus:border-blue-500 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.email && (
              <span className="text-red-500 mt-2">This field is required</span>
            )}
          </div>
          <div className="mt-2 mb-2">
            <span>Don't have an account ? <Link to='/register'> <span className="text-blue-600 font-semibold">Register</span> </Link></span>
          </div>

          <div>
            <input
              type="submit"
              value={isSubmitting ? "Submitting..." : "Login"}
              disabled={isSubmitting}
              className="block w-[300px] text-lg font-semibold p-4 mt-2 text-white bg-blue-600 rounded-full focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
