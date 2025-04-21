import React, { useContext } from "react";
import axios from "axios";
import useAxiosPublic from "../../../Custom/useAxiosPublic";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../ContextProvider/AuthProvider";
import { MdOutlineDownloading } from "react-icons/md";
import dateFormat, { masks } from "dateformat";
import { FaFileLines } from "react-icons/fa6";

import Swal from "sweetalert2";
export const Upload = () => {
  const currentDate = new Date();
  const currentTime = dateFormat(currentDate, "h:MM TT");
  const currentDay = dateFormat(currentDate, "dddd, mmmm dS, yyyy");
  const axiosPublic = useAxiosPublic();
  const { cardData } = useContext(AuthContext);
  const userEmail = cardData?.userEmail
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const formattableDate = currentDate.toISOString();

  const onSubmit = async (data) => {
    try {
      // Creating FormData from the react-hook-form data
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("date", data.date);
      formData.append("visibility", data.visibility);
      formData.append("publish", data.publish);
      formData.append("userEmail",userEmail)

      // Check that a file has been selected. File inputs are returned as a FileList.
      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]);
      } else {
        console.error("No file selected");
        return;
      }

      // Post the form data to api upload endpoint
      const response = await axiosPublic.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);
      if(response?.data?.insertedId){
        reset();
        Swal.fire({
            title: "File Uploaded!",
            text: "Your file has been uploaded successfully.",
            icon: "success",
            confirmButtonText: "Great!"
          });
      }
      
    } catch (error) {
      console.error("Error uploading file:", error);
       if (error?.response?.data?.message === "File already exists") {
              Swal.fire({
                title: "File already exist",
                text: "Please select a different file.",
                icon: "warning",
              });
            } else {
              Swal.fire({
                title: "Error",
                text:
                  error.response?.data?.message ||
                  "An error occurred. Please try again.",
                icon: "error",
              });
            }
    }
  };

  return (
    <div className="flex flex-col justify-center w-full h-full items-center ">
      <div className=" rounded-b-md w-full">
        <div className="flex items-center gap-4 text-xl w-[200px] border-2 border-blue-200 text-center justify-center bg-whit shadow p-2 rounded-full text-blue-500 font-semibold mb-5">
          <MdOutlineDownloading className="rotate-180"></MdOutlineDownloading>
          <span>Upload a file </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex rounded-md justify-between  bg-blue-50 p-5 w-full gap-4"
        >
          <div>
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-xl font-semibold mt-2 mb-4 text-gray-800"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="Add a proper pdf/pptx title"
                className="block w-[400px] text-lg p-3 mt-2 text-gray-700 bg-white rounded-full focus:border-blue-400 focus:ring-blue-300"
              />
              {errors.title && (
                <span className="text-red-500 mt-2">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Expiration Date Input */}
            <div>
              <label
                htmlFor="date"
                className="block text-xl font-semibold mt-4 mb-4 text-gray-800"
              >
                Add Expiration Date
              </label>
              <input
                type="date"
                id="date"
                {...register("date")}
                className="block w-[400px] text-lg p-3 mt-2 text-gray-700 bg-white rounded-full focus:border-blue-400 focus:ring-blue-300"
              />
              
            </div>

            {/* Visibility Input */}
            <div>
              <label
                htmlFor="visibility"
                className="block text-xl font-semibold mt-4 mb-4 text-gray-800"
              >
                Select Visibility
              </label>
              <select
                id="visibility"
                {...register("visibility", {
                  required: "Visibility is required",
                })}
                className="block w-[400px] text-lg p-3 mt-2 text-gray-700 bg-white rounded-full focus:border-blue-400 focus:ring-blue-300"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              {errors.visibility && (
                <span className="text-red-500 mt-2">
                  {errors.visibility.message}
                </span>
              )}
            </div>
          </div>

          <div>
            {/* Publish Input */}
            <div>
              <label
                htmlFor="publish"
                className="block text-xl font-semibold mt-2 mb-4 text-gray-800"
              >
                Would you like to publish it?
              </label>
              <select
                id="publish"
                {...register("publish", {
                  required: "Publish selection is required",
                })}
                className="block w-[400px] text-lg p-3 mt-2 text-gray-700 bg-white rounded-full focus:border-blue-400 focus:ring-blue-300"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.publish && (
                <span className="text-red-500 mt-2">
                  {errors.publish.message}
                </span>
              )}
            </div>

            {/* File Input */}
            <div>
              <div className="flex gap-2 pt-2 pb-2 items-center">
              <FaFileLines className="text-red-600"></FaFileLines>
              <label
                htmlFor="file"
                className="block text-xl font-semibold text-gray-800"
              >
                Select a file
              </label>
              
              
              </div>
              <input
                type="file"
                id="file"
                // Allow PDF and PowerPoint files:
                accept=".pdf, .ppt, .pptx, application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
                {...register("file", { required: "File is required" })}
                className="block w-full h-[104px] text-lg pt-9 pl-9 text-center text-gray-700 bg-white rounded-md border-2 border-dashed border-blue-400 focus:border-blue-400 focus:ring-blue-300"
              />
              {errors.file && (
                <span className="text-red-500 mt-2">{errors.file.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white p-4 text-lg font-semibold rounded-full"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
};
