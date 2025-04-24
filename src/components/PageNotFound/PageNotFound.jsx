import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="text-center">
                <h1 className="text-7xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-2xl font-semibold text-gray-600 mb-2">Page Not Found</p>
                <p className="text-gray-500 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                >
                    Go to Homepage
                </Link>
            </div>
        </div>
    )
}

export default PageNotFound
