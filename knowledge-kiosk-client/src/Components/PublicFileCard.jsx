import React from "react";
import { Link } from "react-router-dom";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { MdOutlineDateRange } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";
import { RiUploadCloud2Fill } from "react-icons/ri";
import dateFormat from "dateformat";

export const PublicFileCard = ({ file }) => {
  const { _id, title, originalName, expirationDate, uploadDate } = file;

  const formatUploadDate = dateFormat(uploadDate, "dddd, mmmm dS, yyyy");
  // Format the expiration date
  const formatExpirationDate = dateFormat(expirationDate, "dddd, mmmm dS, yyyy");

  const now = new Date();            
  const expDateObj = new Date(expirationDate);
  const isExpired = expDateObj < now;

  const daysUntilExpiration = Math.ceil(
    (expDateObj - now) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className=" border-1 border-blue-200 bg-blue-50 flex flex-col gap-2 justify-between h-[200px] p-4 rounded-lg">
    <h2 className="text-lg font-semibold ">
      {title || "Untitled PDF"}
    </h2>

    {/* File info */}
    <div className="flex items-center text-[10px] -500 gap-2 ">
      <BsFileEarmarkPdfFill className="text-red-500"/>
      <span className="text-gray-700">{originalName}</span>
    </div>

    {/* Upload date */}
    <div className="text-blue-500 bg-white p-1 max-w-[200px] justify-center text-xs rounded-full flex gap-2 items-center mb-2">
      <RiUploadCloud2Fill />
      <span>{formatUploadDate}</span>
    </div>

    {/* Expiration info */}
    <div className="text-xs flex items-center text-center justify-center gap-1 bg-red-50 text-red-500 p-1 rounded-full">
      <MdOutlineDateRange />
      {isExpired ? (
        <span className="font-medium">
          Expired (was {formatExpirationDate})
        </span>
      ) : (
        <span className="font-medium">
          {daysUntilExpiration} days left (expires {formatExpirationDate})
        </span>
      )}
    </div>

    {/* "View" link to the PDF viewer route */}
    <Link
      to={`/pdf/${_id}`}
      className="flex items-center gap-1 justify-center bg-blue-600 text-white px-3 text-center py-1 rounded-full max-w-[100px] mt-auto"
    >
      <GoArrowUpRight />
      View
    </Link>
  </div>
  );
};
