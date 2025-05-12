


const Register = () => { 
    return (
        <div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
           <form className="w-full max-w-md bg-white p-8 rounded-md shadow-md">
           <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
                <div>
                <input type="email" placeholder="Email" className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500" required/>
                
                
              
                <input type="password" placeholder="Password"  className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500" required/>
                <input type="password" placeholder="Confirm Password"  className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500" required/>
                <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-md transition-colors mt-2">Signup</button>
                </div>
            </form>
        </div>
        </div>
    )
};


export default Register;