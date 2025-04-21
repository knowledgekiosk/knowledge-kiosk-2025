// src/pages/dashboard/AllUsers.jsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Swal from "sweetalert2";
import { FaUsers, FaUserShield } from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";
import { MdVerifiedUser } from "react-icons/md";
import useAxiosPublic from "../../../Custom/useAxiosPublic";

/* ---------- constant column definitions ---------- */
const COLUMNS = [
  { key: "name",      title: "Name",   className: "text-left" },
  { key: "userEmail", title: "Email" },
  { key: "userStatus",title: "Status" },
  { key: "role",      title: "Role" },
  { key: "cardId",    title: "Card ID" },
  { key: "actions",   title: "Actions" },
];

export const AllUsers = () => {
  const axiosPublic  = useAxiosPublic();
  const queryClient  = useQueryClient();

  /* ───── fetch users ───── */
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey : ["users"],
    queryFn  : () => axiosPublic.get("/users").then(r => r.data),
    refetchInterval: 30_000,
    staleTime      : 30_000,
  });

  /* ───── mutate helpers ───── */
  const approveUser = async (id) => {
    try {
      await axiosPublic.patch(`/users/${id}/approve`);
      queryClient.invalidateQueries(["users"]);
      Swal.fire("Approved!", "User has been approved.", "success");
    } catch (e) {
      Swal.fire("Error", e.response?.data?.message || e.message, "error");
    }
  };

  const makeAdmin = async (id, name) => {
    const { isConfirmed } = await Swal.fire({
      title: `Promote ${name}?`,
      text: "They will gain full admin privileges.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, make admin",
    });
    if (!isConfirmed) return;

    try {
      await axiosPublic.patch(`/users/${id}/make-admin`);
      queryClient.invalidateQueries(["users"]);
      Swal.fire("Success", `${name} is now an admin.`, "success");
    } catch (e) {
      Swal.fire("Error", e.response?.data?.message || e.message, "error");
    }
  };

  /* ───── badge colours ───── */
  const statusClass = {
    approved: "bg-emerald-100 text-emerald-600",
    pending : "bg-amber-100  text-amber-600",
    rejected: "bg-red-100    text-red-600",
  };

  const roleClass = {
    admin: "text-fuchsia-600",
    user : "text-blue-600",
  };

  const pending  = users.filter(u => u.userStatus === "pending");
  const approved = users.filter(u => u.userStatus === "approved");

  /* ───── render helpers ───── */
  const renderRows = (rows) =>
    rows.map((u) => {
      const isAdmin = u.role === "admin";
      return (
        <tr key={u._id} className=" hover:bg-gray-50">
          {/* NAME + AVATAR */}
          <td className="p-3 flex items-center gap-2">
            {u.avatarUrl ? (
              <img src={u.avatarUrl} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="h-8 w-8 rounded-full bg-blue-200 grid place-items-center text-xs font-semibold text-blue-700">
                {u.userName?.[0] ?? "U"}
              </span>
            )}
            <span>{u.userName}</span>
          </td>

          {/* EMAIL (truncate with tooltip) */}
          <td className="p-3 max-w-[160px] truncate" title={u.userEmail}>
            {u.userEmail}
          </td>

          {/* STATUS */}
          <td className="p-3 text-center">
            <span
              className={`inline-flex p-2 text-center  rounded-full text-xs font-medium ${
                statusClass[u.userStatus] || "bg-gray-100 text-gray-600"
              }`}
            >
              {u.userStatus}
            </span>
          </td>

          {/* ROLE */}
          <td className="p-3 font-medium text-center">
            <span className={roleClass[u.role] || "text-gray-600"}>
              {u.role}
            </span>
          </td>

          {/* CARD ID */}
          <td className="p-3 text-center text-blue-500 font-semibold">{u.cardId}</td>

          {/* ACTIONS */}
          <td className="p-3">
            <div className="flex gap-2 justify-center">
              {/* Approve */}
              <button
                onClick={() => approveUser(u._id)}
                disabled={isAdmin || u.userStatus === "approved"}
                className={`p-2 rounded-full text-lg ${
                  isAdmin || u.userStatus === "approved"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                }`}
              >
                <MdVerifiedUser />
              </button>
              {/* Promote */}
              <button
                onClick={() => makeAdmin(u._id, u.userName)}
                disabled={isAdmin}
                className={`p-2 rounded-full text-lg ${
                  isAdmin
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-200"
                }`}
              >
                <FaUserShield />
              </button>
            </div>
          </td>
        </tr>
      );
    });

    const renderTable = (data) => (
        <div
          /* horizontal scroll if columns overflow + vertical scroll after 32 rem */
          className="overflow-x-auto max-h-[32rem] overflow-y-auto
                     rounded-lg border border-gray-200 bg-white"
        >
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    /* sticky so headings stay visible while scrolling */
                    className={`p-3 font-medium sticky top-0 z-10
                                ${c.className ?? "text-center"}`}
                  >
                    {c.title}
                  </th>
                ))}
              </tr>
            </thead>
      
            <tbody>{renderRows(data)}</tbody>
          </table>
        </div>
      );
      

  /* ───── loading / error ───── */
  if (isLoading) return <p className="p-4">Loading…</p>;
  if (error)   return <p className="p-4 text-red-600">Error fetching users</p>;

  /* ───── UI ───── */
  return (
    <div className="h-full bg-blue-50 p-4 mt-4 rounded-md flex flex-col gap-4">
      {/* header */}
      <header className="flex items-center justify-between bg-white px-4 py-2 border-2 border-blue-300 rounded-full  max-w-xs">
        <div className="flex items-center gap-3 text-blue-800">
          <FaUsers className="text-lg" />
          <span className="font-semibold">All Users</span>
          <span className="px-2 text-sm bg-blue-100 rounded-full">
            {users.length}
          </span>
        </div>
        <button
          onClick={refetch}
          title="Refresh"
          className="text-xl  transition-transform hover:rotate-180"
        >
          <LuRefreshCcw />
        </button>
      </header>

      {/* tabs */}
      <Tabs>
        <TabList>
          <Tab>
            Approved <span className="ml-1 px-1 bg-emerald-100 rounded">{approved.length}</span>
          </Tab>
          <Tab>
            Pending <span className="ml-1 px-1 bg-amber-100 rounded">{pending.length}</span>
          </Tab>
        </TabList>

        <TabPanel>{renderTable(approved)}</TabPanel>
        <TabPanel>{renderTable(pending)}</TabPanel>
      </Tabs>
    </div>
  );
};
