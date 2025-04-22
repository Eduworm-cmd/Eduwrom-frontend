import DataTable from '@/components/DataTable/DataTable'
import { BellRing, Pencil, Trash } from 'lucide-react';
import React from 'react'

export const SP_ScheduleList = () => {

    const columns = [
        { key: "title", label: "Title" },
        { key: "assignedclasses", label: "Assigned Classes" },
        { key: "assignedstudent", label: "Assigned Student" },
        { key: "assignee", label: "Assignee" },
        { key: "createddate", label: "Created Date" },
        { key: "activitycount", label: "Activity Count" },
        { key: "delete", label: "Delete" },
    ];

    const data = [
        { title: "Demo Playlist", assignedclasses: "UKG", assignedstudent: "4 Assigned", assignee: "Sales Demo Branch", createddate: "15/4/2014" , activitycount: 5, delete: "Delete"},
        { id: "PRE43174", name: "Diana Plenty", marks: 1165, percent: "91%", year: 2014 },
        { id: "PRE43187", name: "John Millar", marks: 1175, percent: "92%", year: 2014 },
    ];


    const actionButtons = [
        {
            label: "edit",
            icon: Trash,
            onClick: () => alert("edit"),
            className: "text-sky-500 bg-sky-50",
        },
    ];
    return (
        <div>
            <DataTable columns={columns} data={data} title="Schedule List" actionButtons={actionButtons} />

        </div>
    )
}
