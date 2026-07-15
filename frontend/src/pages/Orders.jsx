import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify";

const Orders = () => {

    const { backendUrl, token, currency } = useContext(ShopContext);

    const [orders, setOrders] = useState([]);

    const loadOrders = async () => {

        try {

            if (!token) return;

            const response = await axios.post(
                backendUrl + "/api/order/userorders",
                {},
                {
                    headers: {
                        token,
                    },
                }
            );

            if (response.data.success) {
                setOrders(response.data.orders.reverse());
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [token]);

    return (
        <div className="border-t pt-16">

            <div className="text-2xl">
                <Title text1={"MY"} text2={"ORDERS"} />
            </div>

            <div>

                {orders.length === 0 ? (
                    <p className="text-gray-500 mt-10">
                        No Orders Found
                    </p>
                ) : (

                    orders.map((order, index) => (

                        order.items.map((item, i) => (

                            <div
                                key={index + "-" + i}
                                className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >

                                <div className="flex items-start gap-6 text-sm">

                                    <img
                                        className="w-16 sm:w-20"
                                        src={item.image[0]}
                                        alt=""
                                    />

                                    <div>

                                        <p className="sm:text-base font-medium">
                                            {item.name}
                                        </p>

                                        <div className="flex items-center gap-3 mt-2 text-base">

                                            <p>
                                                {currency}
                                                {item.price}
                                            </p>

                                            <p>
                                                Quantity : {item.quantity}
                                            </p>

                                            <p>
                                                Size : {item.size}
                                            </p>

                                        </div>

                                        <p className="mt-2">
                                            Date :
                                            <span className="text-gray-400">
                                                {" "}
                                                {new Date(order.date).toDateString()}
                                            </span>
                                        </p>

                                        <p className="mt-2">
                                            Payment :
                                            <span className="text-gray-500">
                                                {" "}
                                                {order.payment ? "Paid" : "Pending"}
                                            </span>
                                        </p>

                                        <p className="mt-2">
                                            Method :
                                            <span className="text-gray-500">
                                                {" "}
                                                {order.paymentMethod}
                                            </span>
                                        </p>

                                    </div>

                                </div>

                                <div className="md:w-1/2 flex justify-between items-center">

                                    <div className="flex items-center gap-2">

                                        <p className="min-w-2 h-2 rounded-full bg-green-500"></p>

                                        <p className="text-sm md:text-base">
                                            {order.status}
                                        </p>

                                    </div>

                                    <button
                                        onClick={loadOrders}
                                        className="border px-4 py-2 text-sm font-medium rounded-sm"
                                    >
                                        Refresh Status
                                    </button>

                                </div>

                            </div>

                        ))

                    ))

                )}

            </div>

        </div>
    );
};

export default Orders;