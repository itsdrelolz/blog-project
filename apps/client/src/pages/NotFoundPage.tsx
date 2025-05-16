import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link 
                    to="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    Back to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;

