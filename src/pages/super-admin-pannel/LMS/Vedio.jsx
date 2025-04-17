import React from 'react';

export const Vedio = () => {
    const [videoData, setVideoData] = React.useState({
        name: '',
        class: '',
        author: '',
        description: '',
        thumbnail: null,
        category: '',
        subCategory: '',
        vedioLink: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'thumbnail') {
            setVideoData((prevData) => ({
                ...prevData,
                thumbnail: files[0] || null
            }));
        } else {
            setVideoData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(videoData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        console.log('Submitting video data:', videoData);
    };

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-sky-500 mb-6">Add Video Information</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                        Name<span className="text-red-500">*</span>
                    </label>                    <input
                        name="name"
                        onChange={handleChange}
                        value={videoData.name}
                        type="text"
                        className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                        Class <span className="text-red-500">*</span>
                    </label>                    <select
                        name="class"
                        onChange={handleChange}
                        value={videoData.class}
                        className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                        required
                    >
                        <option value="">Select Class</option>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        {/* Add more as needed */}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                        Author <span className="text-red-500">*</span>
                    </label>                    <input
                        name="author"
                        onChange={handleChange}
                        value={videoData.author}
                        type="text"
                        className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                        Description<span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        onChange={handleChange}
                        value={videoData.description}
                        className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                        rows={4}
                        required
                    />
                </div>


                <div>
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                        Category<span className="text-red-500">*</span>
                    </label>                    <select
                        name="category"
                        onChange={handleChange}
                        value={videoData.category}
                        className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Math">Math</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="History">History</option>
                        {/* Add more categories as needed */}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                        Sub Category  <span className="text-red-500">*</span>
                    </label>                    <select
                        name="subCategory"
                        onChange={handleChange}
                        value={videoData.subCategory}
                        className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                        required
                    >
                        <option value="">Select subCategory</option>
                        <option value="Math">Numreacy</option>
                        <option value="Science">Language</option>
                        <option value="English">English</option>
                        <option value="History">History</option>
                        {/* Add more categories as needed */}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                        Thumbnail <span className="text-red-500">*</span>
                    </label>                    <input
                        name="thumbnail"
                        onChange={handleChange}
                        type="file"
                        accept="image/*"
                        className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                        Vedio Link <span className="text-red-500">*</span>
                    </label>                    <input
                        name="vedioLink"
                        onChange={handleChange}
                        value={videoData.vedioLink}
                        type="text"
                        className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                        required
                    />
                </div>


                <div className="md:col-span-2 mt-12 space-x-2 text-right">
                    <button
                        onClick={() => window.history.back()}
                        type="submit"
                        className="bg-slate-100 font-semibold cursor-pointer text-black border-2 px-6 py-2 rounded hover:bg-slate-300"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="bg-sky-500 text-white font-semibold cursor-pointer px-6 py-2 rounded hover:bg-sky-600"
                    >
                        Add Video
                    </button>
                </div>

            </form>
        </div>
    );
};
