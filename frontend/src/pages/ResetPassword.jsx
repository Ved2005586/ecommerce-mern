import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {

    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password/${token}`,
                { password }
            );

            if (response.data.success) {
                toast.success("Password changed successfully");
                navigate("/login");
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">

            <form
                onSubmit={submitHandler}
                className="flex flex-col gap-4 border p-8 rounded-lg w-96"
            >

                <h2 className="text-2xl font-semibold">
                    Reset Password
                </h2>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                <button
                    className="bg-black text-white py-2 rounded"
                    type="submit"
                >
                    Reset Password
                </button>

            </form>

        </div>
    );
};

export default ResetPassword;