import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import {  useNavigate } from "react-router-dom";
import { signIn } from "../../api/auth";


function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    setIsLoading(true);
    e.preventDefault();
   try {
     let res = await signIn(formData);
     console.log("======= API RESPONSE =======", res);
     if(res.data.message === 'success'){
      let token = res.data.token;
      localStorage.setItem("token",token);
      navigate('/')
     }
   } catch (error) {
     toast.error(error.message);
   }
    setIsLoading(false);
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#000a18] flex justify-center items-center">
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
        <div
          class="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-content py-10 rounded-md mx-10  px-6 lg:px-16 xl:px-12
        flex flex-col items-center justify-center"
        >
          <span class="self-center  text-2xl font-semibold whitespace-nowrap text-clr-primary ">
            Activora
          </span>
          <div class="w-full h-100">
            <h1 class="text-xl md:text-2xl font-bold leading-tight mt-12">
              Log in to your account
            </h1>

            <form class="mt-6" action="#" method="POST">
              <div>
                <label class="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email Address"
                  class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  autofocus
                  autocomplete
                  required
                />
              </div>

              <div class="mt-4">
                <label class="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  minlength="6"
                  class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div class="text-right mt-2">
                <a
                  href="#"
                  class="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                class="w-full block bg-clr-primary hover:opacity-[80%] focus:opacity-[80%] text-white font-semibold rounded-lg
              px-4 py-3 mt-6"
                onClick={handleSignIn}
              >
                Log In
              </button>
            </form>

            <hr class="my-6 border-gray-300 w-full" />

            <button
              type="button"
              class="w-full block bg-white hover:opacity-[80%] focus:opacity-[80%] text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
            >
              <div class="flex items-center justify-center ">
                <FaGoogle />
                <span class="ml-4">Log in with Google</span>
              </div>
            </button>

            <p class="mt-8">
              Need an account?{" "}
              <a
                href="/register"
                class="text-blue-500 hover:text-blue-700 font-semibold"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
