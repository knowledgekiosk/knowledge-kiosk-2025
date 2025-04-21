import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";
import { AuthContext } from "../../../ContextProvider/AuthProvider";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { LuRefreshCcw } from "react-icons/lu";
import { GoArrowUpRight } from "react-icons/go";
import { BsPencilSquare } from "react-icons/bs";
import { IoTrashBinSharp } from "react-icons/io5";
import { IoMdCloudUpload } from "react-icons/io";

async function fetchPdfCollection() {
  const res = await axios.get("http://localhost:5000/pdfCollection", {
    withCredentials: true,
  });
  return res.data;
}

export const AllFiles = () => {
  const { cardData } = useContext(AuthContext);
  const userEmail = cardData?.userEmail || cardData?.email;

  const {
    data: files = [],
    
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pdfCollection"],
    queryFn: fetchPdfCollection,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div>Loading PDFs…</div>;
  if (error) return <div>Error loading PDFs</div>;

  const now = new Date();
  const latest = files.filter(
    (f) => !f.expirationDate || new Date(f.expirationDate) >= now
  );
  const expired = files.filter(
    (f) => f.expirationDate && new Date(f.expirationDate) < now
  );

  latest.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  expired.sort(
    (a, b) => new Date(b.expirationDate) - new Date(a.expirationDate)
  );

  const renderGrid = (list) => (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-blue-50 overflow-x-auto h-[385px] rounded-md p-2 lg:grid-cols-3  gap-2"> 
      {list.map((file) => {
        const uploadedAt = new Date(file.uploadDate);
        const expiresAt = file.expirationDate
          ? new Date(file.expirationDate)
          : null;
        const daysLeft = expiresAt
          ? Math.ceil(
              (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )
          : null;

        return (
          <div
            key={file._id}
            className=" justify-between h-[180px] bg-white p-4 flex flex-col  rounded-lg  shadow hover:shadow-lg transition"
          >
            
            <div>
            <h3 className="text-lg text-blue-500 font-semibold ">{file.title}</h3>
            </div>
            
            <div className="flex gap-2 items-center">
                <BsFileEarmarkPdfFill className="text-red-700"></BsFileEarmarkPdfFill>
                <span className="text-[14px]">{file.originalName}</span>
            </div>
            <div  className="text-sm flex items-center gap-2 justify-center text-green-500 bg-green-50  rounded-full text-center p-1 mt-1 mb-1">
                <IoMdCloudUpload></IoMdCloudUpload>
            <p>
               {dateFormat(uploadedAt,  "dddd, mmmm dS, yyyy")}
            </p>
            </div>
           
            
            <div>
            {expiresAt && daysLeft >= 0 && daysLeft < 10 && (
              <p className="text-sm text-orange-500 font-medium">
                Expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
              </p>
            )}
            </div>
            <div className="mt-2 flex items-center justify-left gap-2">
              <Link
                to={`/pdf/${file._id}`}
                className=" flex items-center pl-2 pr-2 py-1 justify-center gap-2 rounded-full w-[100px] bg-blue-500 text-white  hover:underline"
              >
                <GoArrowUpRight></GoArrowUpRight>
                <span>View</span>
              </Link>
              {userEmail === file.userEmail && (
                <Link
                  to={`/dashboard/upload?edit=${file._id}`}
                  className="text-blue-500 bg-blue-50 rounded-full shadow-md border border-blue-500 p-2 hover:underline"
                >
                  <BsPencilSquare></BsPencilSquare>

                </Link>
              )}
              {userEmail === file.userEmail && (
                <button
                  
                  className="text-red-500 bg-red-50 shadow-md rounded-full p-2 border border-red-500"
                >
                  <IoTrashBinSharp ></IoTrashBinSharp>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className=" flex flex-col h-full gap-1 mt-4 rounded-md">
      <div className="flex justify-between items-center gap-3 pl-2 pr-2 bg-white border-2 border-blue-300 shadow  p-2 rounded-full max-w-[300px] text-blue-800">
       <div className="flex items-center gap-2">
       <BsFileEarmarkPdfFill className="text-red-500"></BsFileEarmarkPdfFill>
        <span className="font-semibold">All Files</span>
        <span className="px-2 text-sm bg-blue-100 rounded-full">
          {files?.length}
        </span>
       </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center space-x-2 text-lg hover:bg-gray-300 text-blue-700 px-3 py-1 rounded"
        >
        <LuRefreshCcw className="text-blue-700"> </LuRefreshCcw>
        </button>
      </div>

      <Tabs>
        <TabList className="flex mb-4">
          <Tab
            className="px-4 py-2 cursor-pointer"
            selectedClassName="border-b-2 border-blue-600 text-blue-600"
          >
            Latest
          </Tab>
          <Tab
            className="px-4 py-2 cursor-pointer"
            selectedClassName="border-b-2 border-blue-600 text-blue-600"
          >
            Expired
          </Tab>
        </TabList>

        <TabPanel>
          {latest.length > 0 ? (
            renderGrid(latest)
          ) : (
            <p>No latest PDFs available.</p>
          )}
        </TabPanel>
        <TabPanel>
          {expired.length > 0 ? renderGrid(expired) : <p>No expired PDFs.</p>}
        </TabPanel>
      </Tabs>
    </div>
  );
};
