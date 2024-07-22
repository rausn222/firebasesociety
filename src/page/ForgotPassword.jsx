import React, { useState } from 'react';
import Text from '../components/elements/Text';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import { Formik, Field, Form } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);

    const initialValues = {
        email: "",
    }

    const validateForm = (values) => {
        const errors = {};

        if (!values.email) {
            errors.email = "Email is required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
            errors.email = "Invalid email address";
        }

        return errors;
    }

    const onLogin = (values) => {
        setLoading(true);
        sendPasswordResetEmail(auth, values.email)
            .then(() => {
                setLoading(false);
                toast("Reset password link shared on your mail")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false);
                console.log(errorCode, errorMessage)
            });

    }

    return (
        <>
            <main >
                <section>
                    <div className="md:grid grid-cols-2 h-screen ">
                        <div className='flex flex-col justify-center h-screen'>
                            <div className=" px-10 ">
                                <div>
                                    <Text className="text-2xl text-white text-center font-bold mb-2">
                                    Bhartiye<span className="text-tertiary">Society</span>
                                    </Text>

                                    <h2 className="text-white text-center md:text-sm text-xs tracking-tight text-gray-900">
                                        Forgot Password
                                    </h2>
                                </div>
                                
                                <div>
                                    <Formik
                                        initialValues={initialValues}
                                        validate={validateForm}
                                        onSubmit={(values) => onLogin(values)}
                                    >
                                        {
                                            ({
                                                values,
                                                errors,
                                                touched,
                                                handleChange,
                                                handleBlur,
                                                handleSubmit,
                                                isSubmitting
                                            }) => (
                                                <Form className="mt-8 space-y-6" >
                                                    <div className=" space-y-6 rounded-md shadow-sm">


                                                        <div>
                                                            <label htmlFor="email-address" className="sr-only">
                                                                Email address
                                                            </label>
                                                            <Field
                                                                type="email"
                                                                id="email"
                                                                name="email"
                                                                value={values.email}
                                                                onChange={handleChange}
                                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                placeholder="Email address"
                                                            />

                                                            <p className='text-xs' style={{ color: 'red' }}>
                                                                {errors.email && touched.email && errors.email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            <span>
                                                                {loading ? "Processing ..." : " Reset Password "}
                                                            </span>
                                                        </button>
                                                    </div>

                                                </Form>
                                            )
                                        }
                                    </Formik>
                                </div>

                            </div>

                            <p className="text-sm mt-10 text-white text-center">
                                No account yet?{' '}
                                <NavLink to="/signup" className="underline text-tertiary">
                                    Sign up
                                </NavLink>
                            </p>
                        </div>


                        <div className='bg-sidebar md:block hidden text-secondary h-screen'>
                            <div className='flex items-center justify-center bg-no-repeat bg-center bg-cover h-screen' style={{backgroundImage: "url('/bg-login.jpg')" }}>                                
                            </div>
                        </div>
                    </div>
                </section>
                <ToastContainer />
            </main>
        </>
    )
}

export default ForgotPassword