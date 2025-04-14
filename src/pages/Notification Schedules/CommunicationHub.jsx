import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Paperclip, Send } from 'lucide-react';
import React, { useState } from 'react'

export const CommunicationHub = () => {
    const [sendNow, setSendNow] = useState(true);
    const [sendLaterClander, setSendLaterClander] = useState({
        message: '',
        'date-time': '',
    });
    const [sendVia, setSendVia] = useState({ app: false, email: false });
    const [showPreview, setShowPreview] = useState(false);
    const handlePreview = () => {
        setShowPreview(!showPreview);
    };

    const handleSendClander = (e) => {
        const { name, value } = e.target;
        setSendLaterClander((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    return (
        <div className="w-full p-3 px-4 bg-white rounded-xl shadow-md border space-y-6">
            <p className="text-sm text-gray-700 font-medium">
                All fields marked <span className="text-red-600">*</span> are compulsory.
            </p>
            <div className="w-full">
                <label className="font-semibold text-gray-800">Send To</label>
                <select className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select</option>
                    <option value="students">Students</option>
                    <option value="teachers">Teachers</option>
                </select>
            </div>

            <div className="w-full">
                <label className="font-semibold text-gray-800">Message</label>
                <div className="relative">
                    <textarea
                        value={sendLaterClander.message}
                        name="message"
                        onChange={handleSendClander}
                        className="w-full mt-1 p-2 border rounded-md h-32 resize-none"
                        placeholder="Type your message here..."
                    />
                    <Dialog>
                        <DialogTrigger asChild>
                            <button
                                onClick={handlePreview}
                                className="absolute top-2 right-2 text-blue-700 font-medium hover:underline flex items-center">
                                <Eye />
                                Preview
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <DialogTitle>Message Preview</DialogTitle>
                            </DialogHeader>
                            <div className='bg-blue-50 p-4 rounded-lg'>
                                    <p>{sendLaterClander.message}</p>
                            </div>
                           
                        </DialogContent>
                    </Dialog>

                </div>
            </div>
            <div className="flex items-center justify-between w-full">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="file" className="hidden" />
                    <div className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                        <Paperclip />
                        Attach File
                    </div>
                </label>
            </div>

            <div className="flex items-center space-x-6 w-full">
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name="schedule"
                        checked={sendNow}
                        onChange={() => setSendNow(true)}
                        className="form-radio text-blue-700"
                    />
                    <span>Send Now</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name="schedule"
                        checked={!sendNow}
                        onChange={() => setSendNow(false)}
                        className="form-radio text-blue-700"
                    />
                    <span>Send Later</span>
                </label>
                {
                    !sendNow && (
                        <div className="">
                            <input
                                type="datetime-local"
                                name="date-time"
                                onChange={handleSendClander}
                                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700"
                            />
                        </div>
                    )
                }
            </div>

            <div className="w-full flex items-end justify-between flex-row">
                <div className="flex flex-row items-center space-x-6">
                    <p className="font-semibold text-gray-800">Send via</p>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={sendVia.app}
                            onChange={() => setSendVia({ ...sendVia, app: !sendVia.app })}
                            className="form-checkbox text-purple-600"
                        />
                        <span>App</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={sendVia.email}
                            onChange={() => setSendVia({ ...sendVia, email: !sendVia.email })}
                            className="form-checkbox text-purple-600"
                        />
                        <span>Email</span>
                    </label>
                </div>
                <button className='flex gap-2 mt-4 text-white py-2 px-5 outline-none rounded-sm font-semibold cursor-pointer text-[14px] text-left bg-green-500'>
                    <Send /> Send
                </button>
            </div>
        </div>
    );
}
