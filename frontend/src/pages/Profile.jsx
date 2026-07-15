import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'

const Profile = () => {

    const { backendUrl, token, navigate } = useContext(ShopContext);
    const [user, setUser] = useState(null);

    const loadProfile = async () => {
        try {
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.post(
                backendUrl + '/api/user/profile',
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                setUser(response.data.user);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [token]);

    if (!user) {
        return (
            <div className='border-t pt-16'>
                <div className='text-2xl'>
                    <Title text1={'MY'} text2={'PROFILE'} />
                </div>
                <p className='text-gray-500 mt-10'>Loading...</p>
            </div>
        );
    }

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1={'MY'} text2={'PROFILE'} />
            </div>

            <div className='mt-10 flex flex-col gap-4 max-w-md text-gray-700'>
                <div className='flex justify-between border-b pb-3'>
                    <p className='font-medium'>Name</p>
                    <p>{user.name}</p>
                </div>
                <div className='flex justify-between border-b pb-3'>
                    <p className='font-medium'>Email</p>
                    <p>{user.email}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile