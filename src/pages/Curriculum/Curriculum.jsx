import DataTable from '@/components/DataTable/DataTable'
import { Ban, Download, FileText, Menu, Plus, PlusCircle } from 'lucide-react';
import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ExportButton } from '@/components/Buttons/ExportButton/ExportButton';
import DownloadButton from '@/components/Buttons/DownloadButton/DownloadButton';
export const Curriculum = () => {
    const [form, setForm] = useState();


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleCreate = () => {
        console.log(form);
    }

    const columns = [
        { key: "name", label: "Name" },
        { key: "id", label: "ID" },
        { key: "marks", label: "Marks" },
        { key: "percent", label: "Percent" },
        { key: "year", label: "Year" },
    ];

    const data = [
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },
        {
            id: "PRE43187",
            name: "John Millar",
            marks: 1175,
            percent: "92%",
            year: 2014,
        },
        {
            id: "PRE43178",
            name: "Evelyn Harper",
            marks: 1185,
            percent: "98%",
            year: 2014,
        },
        {
            id: "PRE43174",
            name: "Diana Plenty",
            marks: 1165,
            percent: "91%",
            year: 2014,
        },

    ];

    const dropdownData = {
        options: [
            [
                { value: 'ay-2024-2025', label: 'AY 2024 - 2025' },
                { value: 'ay-2025-2026', label: 'AY 2025 - 2026' },
                { value: 'ay-2026-2027', label: 'AY 2026 - 2027' },
                { value: 'ay-2027-2028', label: 'AY 2027 - 2028' },
            ],
            [
                { value: "P Nursery", label: "Math" },
                { value: "UKG", label: "UKG" },
                { value: "LKG", label: "LKG" },
                { value: "UKG", label: "UKG" },
            ],
            [
                { value: "Centre Head", label: "Center Head" },
                { value: "Admin", label: "Admin" },
                { value: "Teacher", label: "Teacher" },
            ],
        ],
        placeholders: ["Select a AY", "Select a Grade", "Select a Role"],
        dropdownNum: 3,
    };

    const handleSearchDropdown = (value) => {
        console.log("class value is :", value);
    };
    return (
        <div>
            <div className="flex w-full justify-end gap-2 mb-2">



                <Dialog>
                    <DialogTrigger asChild>
                        <button className='flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] text-left bg-sky-500'>
                            <PlusCircle /> Add Class
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px] h-80">
                        <DialogHeader>
                            <DialogTitle>Add class for Schools</DialogTitle>
                            <DialogDescription>
                                by selecting the unit and day, you can view the timetable
                            </DialogDescription>
                        </DialogHeader>
                        <div className='bg-blue-50 p-4 rounded-lg'>
                            <label htmlFor="ClassName" className="block text-sm font-medium text-gray-700 mb-3">ClassName</label>
                            <input
                                type="text"
                                id="ClassName"
                                name="ClassName"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="ClassName"
                                onChange={handleInputChange}
                            />
                        </div>
                        <DialogFooter>

                            <div className="bg-gray-50 ">
                                <DialogClose>
                                    <button
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-7 py-2 text-sm font-semibold cursor-pointer text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-200 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                </DialogClose>
                                <button
                                    onClick={handleCreate}
                                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-7 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 cursor-pointer sm:ml-3 sm:w-auto"
                                >
                                    Create
                                </button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DownloadButton />
                <ExportButton columns={columns} currentItems={data} />
                <button className='flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] text-left bg-red-500'>
                    <Ban /> Deactivate
                </button>
            </div>

            <DataTable
                title={""}
                data={data}
                columns={columns}
                isDropdown={true}
                dropdownData={dropdownData}
                handleSearchDropdown={handleSearchDropdown}
            />



        </div>
    )
}
