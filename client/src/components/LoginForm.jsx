import { useState,useContext } from "react";
import { Link } from "react-router-dom";
import Formbtn from "./Btn";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import {UserContext } from "../context/userContext";


function LoginForm() {
  const {updateUser} = useContext(UserContext)
   const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
 
  const validateForm = async (e) => {
    e.preventDefault();
    const newErrors = {};
   
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
  

    setErrors(newErrors);

try {
 if (Object.keys(newErrors).length === 0) {
      // submit form
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email : formData.email,
        password: formData.password
      })
      console.log("Form submitted:", formData);

      const {token,role} = response.data
      setFormData({ email: "", password: "" });

     console.log(role,token)
      if (token){
        localStorage.setItem("token",token)
        updateUser(response.data)

        //redirect based on role
        if(role === "admin"){
          navigate("/admin/dashboard")
        }else{
          navigate("/user/dashboard")

        }
      }
     
    }
}catch(error){
 console.log(error)
} 
   
  };
  return (
    <div className="bg-white rounded-lg p-8 max-w-md w-full relative z-50 animate-[fadeInDown_0.6s_ease-out_forwards]">
      <h2 className="text-xl font-bold mb-6 font-display">
        Let's get you in
      </h2>

      <form className="space-y-4" onSubmit={validateForm}>
    
       

      
        <div>
          <label htmlFor="email" className="block text-sm mb-1">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-1.5 bg-gray-100 rounded-md border border-gray-200"
            placeholder="name@email.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-3 py-1.5 bg-gray-100 rounded-md border border-gray-200"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </div>
     
       

       <Formbtn text={"Log in"}/>
      </form>

      <div className="text-center mt-6 text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="text-indigo-600 font-medium">
          Create account
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
