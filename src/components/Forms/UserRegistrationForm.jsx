import React from "react";

export const UserRegistrationForm = () => {
  return (
    <div className="w-full max-w-2xl text-slate-700">
      {/* Step Info */}
      
      {/* Title */}
      <h1 className="text-2xl font-bold mb-1">Let's start with your name</h1>
      <p className="text-sm text-gray-400 mb-8">
        Please fill in the details below so that we can get in contact with you
        about our product.
      </p>

      {/* Form */}
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-1">First Name</label>
            <input
              type="text"
              placeholder="Tom"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Bekker"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        <div>
          <label className="text-sm block mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="+1 234 567 890"
            className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Password</label>
          <input
            type="password"
            placeholder="********"
            className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Role</label>
          <select className="w-full px-4 py-2 rounded-md bg-transparent border border-[#2F3B76] focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-700">
            <option className="text-black">Select a role</option>
            <option className="text-black">Student</option>
            <option className="text-black">Teacher</option>
            <option className="text-black">Admin</option>
          </select>
        </div>

        {/* Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-primary hover:bg-sky-500 text-white font-semibold rounded-full transition duration-300"
          >
            Save and Next
          </button>
        </div>
      </form>
    </div>
  );
};
