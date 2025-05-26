import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Formbtn from "./Btn";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/userContext";
import uploadImage from "../utils/uploadImage";
import axiosInstance from "../utils/axiosInstance";

function SignupForm() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminCode: "",
    terms: false,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
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
    if (!formData.terms) newErrors.terms = "You must agree to the terms";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      let profileImageUrl = "";
      if (profileImage) {
        profileImageUrl = await uploadImage(profileImage);
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        email: formData.email,
        password: formData.password,
        adminInviteToken: formData.adminCode,
        name: formData.name,
        profileImageUrl : profileImageUrl.imageUrl,
      });

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      updateUser(response.data);

      setFormData({ name: "", email: "", password: "", adminCode: "", terms: false });
      setProfileImage(null);
      setPreviewUrl(null);

      // Redirect based on role
      navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to sign up. Please try again.";
      setSubmitError(errorMessage);
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 max-w-md w-full relative z-50 animate-[fadeInDown_0.6s_ease-out_forwards]">
      <h2 className="text-xl font-bold mb-6 font-display">Let's get you set up</h2>

      {submitError && (
        <p className="text-sm text-red-600 mb-4">{submitError}</p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-20 h-20 mb-2">
            <div className="w-full h-full rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1.5 cursor-pointer border-2 border-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </label>
            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageChange}
            />
          </div>
          <span className="text-xs text-gray-500">Add profile photo</span>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm mb-1">
            Your name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-1.5 bg-gray-100 rounded-md border border-gray-200"
            placeholder="First & Last Name"
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm mb-1">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-1.5 bg-gray-100 rounded-md border border-gray-200"
            placeholder="name@business.com"
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-1.5 bg-gray-100 rounded-md border border-gray-200"
            placeholder="Password"
            disabled={isSubmitting}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
        </div>

        <div>
          <input
            type="text"
            id="admin"
            value={formData.adminCode}
            onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
            className="w-full px-3 py-1.5 bg-gray-100 rounded-md border border-gray-200"
            placeholder="Enter 6-digit code (optional)"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-start gap-2 pt-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
            className="mt-1"
            disabled={isSubmitting}
          />
          <label htmlFor="terms" className="text-xs text-gray-600">
            I agree to{" "}
            <a href="#" className="text-indigo-600 underline">
              terms of use
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 underline">
              privacy statement
            </a>
          </label>
        </div>
        {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

        <Formbtn
          text={isSubmitting ? "Submitting..." : "Get Started"}
          disabled={isSubmitting}
        />
      </form>

      <div className="text-center mt-6 text-sm">
        Already a user?{" "}
        <Link to="/login" className="text-indigo-600 font-medium">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default SignupForm;
