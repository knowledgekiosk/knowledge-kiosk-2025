import { useEffect, useState } from "react";
import { PiFiles } from "react-icons/pi";
import { PublicFileCard } from "./PublicFileCard";
import useAxiosPublic from "../Custom/useAxiosPublic";
import { PublicFilesSlider } from "./PublicFilesSlider";
import { FaInfoCircle } from "react-icons/fa";

export const AllPublicFiles = () => {
  const [data, setData] = useState([]);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    // Fetch data from /pdfCollection endpoint
    const fetchData = async () => {
      try {
        const response = await axiosPublic.get("/pdfPublicCollection");
        const docs= response.data;
        console.log("Fetched data =>", docs);
        setData(docs);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData();
  }, [axiosPublic]);

  return (
    <div className="flex flex-col gap-2 p-5">
      {/* Header area */}
      <div className="flex items-center gap-2 bg-blue-50 p-2 justify-center rounded-full w-[300px]">
        <PiFiles className="text-blue-500 text-2xl" />
        <span className="text-blue-500 text-xl font-semibold">
          All Public Slideshows
        </span>
        <span className="flex bg-white font-semibold text-blue-500 text-lg h-[30px] w-[30px] rounded-full items-center text-center justify-center">
          {data?.length ? data.length : "0"}
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 overflow-x-auto h-[450px] border-1 rounded-md shadow border-gray-200 p-4  md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {data?.map((file) => (
          
          <PublicFileCard key={file._id} file={file} ></PublicFileCard>
        ))}
      </div>
      <div className="flex items-center text-center justify-center text-[15px]  gap-2  text-red-500 p-1 rounded-md ">
        <FaInfoCircle></FaInfoCircle>
        <span>Please scroll inside the container to view all files.</span>
      </div>
    </div>
  );
};
