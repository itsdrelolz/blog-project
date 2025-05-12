import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <p className="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
            <Link 
                to="/"
                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
                Go back home
            </Link>
        </div>
    );
};

export default NotFoundPage;

