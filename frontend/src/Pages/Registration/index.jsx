import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import { signUp } from "../../api/auth";
import { useNavigate } from "react-router-dom";


function Registration() {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      let res = await signUp(formData);
      console.log('======= API RESPONSE =======',res)
      if(res.data.message === 'success') navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
    setIsLoading(false);
  };

  return (
    <div className="w-[100%] min  h-[100vh] bg-[#000a18] flex justify-center items-center">
      <ToastContainer autoClose={10000} type={"error"} />
      {isLoading ? (
        <ClipLoader
          color={"#fff"}
          loading={isLoading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          <div
            class="bg-white w-full mt-40  md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-content py-10 rounded-md mx-10  px-6 lg:px-16 xl:px-12
        flex flex-col items-center justify-center "
          >
            <span class="self-center text-2xl font-semibold whitespace-nowrap text-[#1178e2] ">
              Activora
            </span>
            <div class="w-full h-100">
              <h1 class="text-xl md:text-2xl font-bold leading-tight mt-12">
                Create an account
              </h1>

              <form class="mt-6">
                <div>
                  <label class="block text-gray-700">Name</label>
                  <input
                    type="text"
                    onChange={handleInputChange}
                    value={formData.name}
                    placeholder="Enter Your Name"
                    class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    autofocus
                    autocomplete
                    required
                    name="name"
                  />
                </div>
                <div>
                  <label class="block text-gray-700">Email Address</label>
                  <input
                    type="email"
                    onChange={handleInputChange}
                    value={formData.email}
                    placeholder="Enter Email Address"
                    class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    name="email"
                    autocomplete
                    required
                  />
                </div>

                <div class="mt-4">
                  <label class="block text-gray-700">Password</label>
                  <input
                    type="password"
                    onChange={handleInputChange}
                    value={formData.password}
                    placeholder="Enter Password"
                    minlength="6"
                    class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                focus:bg-white focus:outline-none"
                    required
                    name="password"
                  />
                </div>

                <div class="mt-4">
                  <label class="block text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    onChange={handleInputChange}
                    value={formData.confirmPassword}
                    placeholder="Re-type Password"
                    minlength="6"
                    class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                focus:bg-white focus:outline-none"
                    required
                    name="confirmPassword"
                  />
                </div>

                <button
                  type="submit"
                  class="w-full block bg-clr-primary hover:opacity-[80%] focus:opacity-[80%]  text-white font-semibold rounded-lg
              px-4 py-3 mt-6"
                  onClick={handleRegister}
                >
                  Sign Up
                </button>
              </form>

              <hr class="my-6 border-gray-300 w-full" />

              <button
                type="button"
                class="w-full block bg-white hover:opacity-[80%] focus:opacity-[80%]  text-clr-heading font-semibold rounded-lg px-4 py-3 border border-gray-300"
              >
                <div class="flex items-center justify-center">
                  <FaGoogle />
                  <span class="ml-4">Log in with Google</span>
                </div>
              </button>

              <p class="mt-8">
                Already have an account?{" "}
                <a
                  href="/login"
                  class="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Log In
                </a>
              </p>
            </div>
          </div>
          <div className="mt-20 pt-20">dsfdfsd</div>
        </>
      )}
    </div>
  );
}

export default Registration;
