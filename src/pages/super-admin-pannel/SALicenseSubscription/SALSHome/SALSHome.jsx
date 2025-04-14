import React from "react";
import {
  BadgeCheck,
  UserCheck,
  AlertTriangle,
  IdCard,
  BellRing,
  Pencil,
} from "lucide-react";
import DataTable from "@/components/DataTable/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stats = [
  {
    title: "Total Licenses & Subscribers",
    value: "3.2K",
    icon: <IdCard className="text-sky-600" size={30} />,
    bgColor: "bg-sky-50",
  },
  {
    title: "Active Licenses",
    value: "3.2K",
    icon: <BadgeCheck className="text-fuchsia-600" size={30} />,
    bgColor: "bg-fuchsia-100",
  },
  {
    title: "Subscribers",
    value: "12.7K",
    icon: <UserCheck className="text-orange-600" size={30} />,
    bgColor: "bg-orange-50",
  },
  {
    title: "Pending Renewals",
    value: "450",
    icon: <AlertTriangle className="text-red-500" size={30} />,
    bgColor: "bg-red-50",
  },
];

const columns = [
  { key: "user", label: "User" },
  { key: "subscriptionId", label: "Subscription ID" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "expiresOn", label: "Expires On" },
];

const data = [
  {
    subscriptionId: "SUB10239",
    user: "Alice Johnson",
    plan: "Pro",
    status: "Pending",
    expiresOn: "2025-05-12",
  },
  {
    subscriptionId: "SUB10285",
    user: "Michael Smith",
    plan: "Standard",
    status: "Pending",
    expiresOn: "2025-04-30",
  },
  {
    subscriptionId: "SUB10244",
    user: "Priya Mehta",
    plan: "Enterprise",
    status: "Pending",
    expiresOn: "2025-05-05",
  },
];

const actionButtons = [
  {
    label: "notify",
    icon: BellRing,
    onClick: () => console.log("notify"),
    className: "text-red-500 bg-red-50",
  },
  {
    label: "edit",
    icon: Pencil,
    onClick: () => alert("edit"),
    className: "text-sky-500 bg-sky-50",
  },
];

export const SALSHome = () => {
  // SALS = Super Admin License Subscription
  return (
    <div className="flex flex-col gap-4">
      <div className="p-6  border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-4 py-6 rounded-lg  ${stat.bgColor}`}
            >
              <div>
                <p className="text-gray-600 text-md font-semibold ">
                  {stat.title}
                </p>
                <h3 className="text-2xl text-gray-700 font-bold">
                  {stat.value}
                </h3>
              </div>
              <div className="p-3  rounded-full ">{stat.icon}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6  border rounded-lg">
        <Tabs defaultValue="licence" className="w-full">
          <TabsList>
            <TabsTrigger value="licence">Licence</TabsTrigger>
            <TabsTrigger value="Subscription">Subscription</TabsTrigger>
            <TabsTrigger value="billing">Billing Management</TabsTrigger>
            <TabsTrigger value="setting">Setting</TabsTrigger>
          </TabsList>
          <TabsContent value="licence">
            <DataTable
              columns={columns}
              data={data}
              title="Pending licence"
              actionButtons={actionButtons}
            />
          </TabsContent>
          <TabsContent value="Subscription">
            <DataTable
              columns={columns}
              data={data}
              title="Pending Subscription"
              actionButtons={actionButtons}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
