import React, { useState } from "react";

export const Invoice = () => {
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  return (
    <div className="p-6 bg-yellow-50 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Invoice Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Select Student *</label>
          <select className="w-full p-2 border rounded">
            <option>Select</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Academic Year for Invoice *</label>
          <select className="w-full p-2 border rounded">
            <option>AY 2024 - 2025</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Class Name for Invoice *</label>
          <select className="w-full p-2 border rounded">
            <option>Select Class</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Invoice Date *</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Invoice Due Date *</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Invoice Name</label>
          <input type="text" className="w-full p-2 border rounded" defaultValue="Invoice" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Created Date</label>
          <input type="text" className="w-full p-2 border rounded" value="10/04/2025" disabled />
        </div>

        <div>
          <label className="block mb-1 font-medium">Template Name</label>
          <select className="w-full p-2 border rounded">
            <option>Select Template</option>
          </select>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold mb-2">Item Entry</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="p-2 border rounded" placeholder="Search Items" />
          <input className="p-2 border rounded" placeholder="Search Sub Items" />
          <input className="p-2 border rounded" placeholder="Qty" type="number" />
          <input className="p-2 border rounded" placeholder="Amount" type="number" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <select className="p-2 border rounded">
            <option>Select Discount & Rate/Amount</option>
          </select>
          <div className="flex gap-2">
            <input className="p-2 border rounded w-full" placeholder="Valid From" type="date" />
            <input className="p-2 border rounded w-full" placeholder="Valid To" type="date" />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded self-end">Add Discount</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <select className="p-2 border rounded">
            <option>Select Tax & Rate/Amount</option>
          </select>
          <input className="p-2 border rounded" placeholder="Amount" type="number" />
          <select className="p-2 border rounded">
            <option>Select Royalty</option>
          </select>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold mb-2">Item Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>Sub Total: <span className="font-bold">0.00</span></div>
          <div>Total Discount: <span className="font-bold">0.00</span></div>
          <div>Total Tax: <span className="font-bold">0.00</span></div>
          <div>Total Royalty: <span className="font-bold">0.00</span></div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <label>Select Tax</label>
          <select className="p-2 border rounded">
            <option>Select</option>
          </select>
          <input className="p-2 border rounded" placeholder="Amount" type="number" />
          <button className="bg-green-500 text-white px-4 py-1 rounded">Add Tax</button>
        </div>
        <div className="mt-2 text-right font-semibold">Invoice Total Amount: 0.00</div>
      </div>

      <div className="mt-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="form-checkbox" /> Convert into installments
        </label>
      </div>

      <div className="mt-4">
        <label className="block mb-1 font-medium">General Comment</label>
        <textarea className="w-full p-2 border rounded" rows="3"></textarea>
      </div>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Additional Comment Only</label>
        <textarea className="w-full p-2 border rounded" rows="3"></textarea>
      </div>

      <div className="mt-4">
        <label className="font-medium block mb-2">Paid Today or proceed to generate Invoice receipt?</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="paynow" className="form-radio" /> Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="paynow" className="form-radio" /> No
          </label>
        </div>
      </div>

      <div className="mt-6 bg-blue-100 p-4 rounded">
        <label className="font-medium block mb-2">Want to add any Deposit Amount?</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="deposit" className="form-radio" /> Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="deposit" className="form-radio" /> No
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button className="bg-gray-200 text-black px-4 py-2 rounded">Back</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Save As Draft</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Confirm & Email</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">Confirm & Save</button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">Confirm & Print</button>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Confirm & Export</button>
      </div>
    </div>
  );
};

