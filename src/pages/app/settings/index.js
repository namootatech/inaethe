import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Image from 'next/image';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { omit, set } from 'ramda';
import { ToastContainer, toast } from 'react-toastify';
import {useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';


export const metadata = {
  title: 'Next.js Settings | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};
const capitalizeNames = (user) => {
  return {
    ...user,
    firstName: user?.firstName
      ? user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1)
      : user?.firstName,
    lastName: user?.lastName
      ? user?.lastName?.charAt(0).toUpperCase() + user?.lastName?.slice(1)
      : user?.lastName,
  };
};

const Settings = ({ user }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(user);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData(capitalizeNames(user));
      if(user?.image){
        const imagePreview = document.getElementById('image-preview');
      imagePreview.innerHTML = `<img src="${user.image}" class="max-h-48 rounded-lg mx-auto" alt="Image preview" />`;
      imagePreview.classList.remove(
          'border-dashed',
          'border-2',
          'border-gray-400'
        );
      }
    }
  }, [user]);

  useEffect(() => {
    if (
      formData?.email &&
      !formData.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    ) {
      console.log('We have email', formData.email);
      console.log('Email is invalid');
      setErrors(['Email is not valid']);
    } else if (
      formData?.cellphoneNumber &&
      !formData.cellphoneNumber.match(/^0[0-9]{9}$/)
    ) {
      console.log('We have cellphone number', formData.cellphoneNumber);
      console.log('Cellphone number is invalid');
      setErrors(['Cellphone number is not valid']);
    } else if (formData?.firstName === '' || formData?.lastName === '') {
      console.log(
        'We dont have first name or last name',
        formData.firstName,
        formData.lastName
      );
      setErrors(['First Name and Last Name are required']);
    } else if (
      !formData?.email ||
      !formData?.cellphoneNumber ||
      !formData?.firstName ||
      !formData?.lastName
    ) {
      console.log('We have a missing field');
      setErrors([
        'First Name, Last Name, Email and Cellphone number are required',
      ]);
    } else {
      setErrors([]);
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(omit(["password", "confirmPassword", "hash"], formData)),
    })
      .then((res) =>{
        toast.success('Your profile has been updated! Please refresh this page.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: 'light',
        })
        const emailChanged = formData.email !== user.email;
        if (emailChanged) {
          toast.warning('Your recently changed your email please login again.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            theme: 'light',
          })
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      }
      )
      .then((data) => {
        console.log('Updated', data);
      });
  };

  const selectImage = () => {
    const uploadInput = document.getElementById('upload');
    uploadInput.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const uploadInput = document.getElementById('upload');
    const filenameLabel = document.getElementById('filename');
    const imagePreview = document.getElementById('image-preview');

    let isEventListenerAdded = false;
    if (file) {
      filenameLabel.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" class="max-h-48 rounded-lg mx-auto" alt="Image preview" />`;
        imagePreview.classList.remove(
          'border-dashed',
          'border-2',
          'border-gray-400'
        );
        if (!isEventListenerAdded) {
          imagePreview.addEventListener('click', () => {
            uploadInput.click();
          });

          isEventListenerAdded = true;
        }
      };
      reader.readAsDataURL(file);
    } else {
      filenameLabel.textContent = '';
      imagePreview.innerHTML = `<div class="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">No image preview</div>`;
      imagePreview.classList.add(
        'border-dashed',
        'border-2',
        'border-gray-400'
      );

      // Remove the event listener when there's no image
      imagePreview.removeEventListener('click', () => {
        uploadInput.click();
      });

      isEventListenerAdded = false;
    }

    if (file) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'v2f3pxl6'); // Replace 'your_cloudinary_upload_preset' with your actual Cloudinary upload preset

      // Upload image to Cloudinary
      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dhrndsuey/raw/upload',
          {
            method: 'POST',
            body: data,
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFormData({ ...formData, image: data.secure_url });
        } else {
          throw new Error('Failed to upload image to Cloudinary', response);
        }
      } catch (error) {
        throw new Error('Error uploading image to Cloudinary:', error);
      }
    }
  };
  console.log('errors', errors);
  return (
    <DefaultLayout>
      <ToastContainer />
      <div className='mx-auto max-w-270'>
        <Breadcrumb pageName='Settings' />

        <div className='grid grid-cols-5 gap-8'>
          <div className='col-span-5 xl:col-span-3'>
            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
              <div className='border-b border-stroke px-7 py-4 dark:border-strokedark'>
                <h3 className='font-medium text-black dark:text-gray-900'>
                  Personal Information
                </h3>
              </div>
              <div className='p-7'>
                <form onSubmit={handleSubmit}>
                  <div className='mb-5.5 flex flex-col gap-5 sm:flex-row'>
                    <div className='w-full sm:w-1/2 mr-2'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-gray-900'
                        htmlFor='fullName'
                      >
                        First Name
                      </label>
                      <div className='relative'>
                        <span className='absolute left-4.5 top-4 px-4'>
                          <svg
                            className='fill-current'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <g opacity='0.8'>
                              <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z'
                                fill=''
                              />
                              <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z'
                                fill=''
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className='w-full px-12 rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-900 dark:focus:border-primary'
                          type='text'
                          name='firstName'
                          id='firstName'
                          placeholder='Enter first name'
                          value={formData?.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className='w-full sm:w-1/2'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-gray-900'
                        htmlFor='lastName'
                      >
                        Last Name
                      </label>
                      <input
                        className='w-full px-12 rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-900 dark:focus:border-primary'
                        type='text'
                        name='lastName'
                        id='lastName'
                        value={formData?.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder='Enter last name'
                      />
                    </div>
                  </div>

                  <div className='mb-5.5'>
                    <label
                      className='mb-3 block text-sm font-medium text-black dark:text-gray-900'
                      htmlFor='emailAddress'
                    >
                      Email Address
                    </label>
                    <div className='relative'>
                      <span className='absolute left-4.5 top-4 px-4 '>
                        <svg
                          className='fill-current'
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <g opacity='0.8'>
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z'
                              fill=''
                            />
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z'
                              fill=''
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className='w-full rounded border px-12 border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-900 dark:focus:border-primary'
                        type='email'
                        name='emailAddress'
                        id='emailAddress'
                        value={formData?.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder='Enter email address'
                      />
                    </div>
                  </div>

                  <div className='mb-5.5'>
                    <label
                      className='mb-3 block text-sm font-medium  text-black dark:text-gray-900'
                      htmlFor='cellphoneNumber'
                    >
                      Cellphone Number
                    </label>
                    <input
                      className='w-full rounded border px-12 border-stroke bg-gray  py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-900 dark:focus:border-primary'
                      type='text'
                      name='cellphoneNumber'
                      id='cellphoneNumber'
                      value={formData?.cellphoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cellphoneNumber: e.target.value,
                        })
                      }
                      placeholder='Enter cellphone number'
                    />
                  </div>

                  <div className='mb-5.5'>
                    <label
                      className='mb-3 block text-sm font-medium text-black dark:text-gray-900'
                      htmlFor='bio'
                    >
                      BIO
                    </label>
                    <div className='relative'>
                      <span className='absolute left-4.5 top-4 px-4'>
                        <svg
                          className='fill-current'
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <g opacity='0.8' clipPath='url(#clip0_88_10224)'>
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z'
                              fill=''
                            />
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z'
                              fill=''
                            />
                          </g>
                          <defs>
                            <clipPath id='clip0_88_10224'>
                              <rect width='20' height='20' fill='white' />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>

                      <textarea
                        className='w-full rounded px-10 border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-900 dark:focus:border-primary'
                        name='bio'
                        id='bio'
                        rows={6}
                        value={formData?.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder='Write your bio here'
                      ></textarea>
                    </div>
                  </div>

                  <div className='flex justify-end gap-4.5 py-4'>
                    <div className='text-red-500'>
                      {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className='col-span-5 xl:col-span-2'>
            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
              <div className='border-b border-stroke px-7 py-4 dark:border-strokedark'>
                <h3 className='font-medium text-black dark:text-gray-900'>
                  Your Photo
                </h3>
              </div>
              <div className='p-7'>
                <form action='#'>
                  <section class='container w-full mx-auto items-center py-8'>
                    <div class='max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center'>
                      <div class='px-4 py-6'>
                        <div
                          id='image-preview'
                          class='max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer'
                        >
                          <input
                            id='upload'
                            type='file'
                            class='hidden'
                            accept='image/*'
                            onChange={handleImageChange}
                          />
                          <label for='upload' class='cursor-pointer'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke-width='1.5'
                              stroke='currentColor'
                              class='w-8 h-8 text-gray-700 mx-auto mb-4'
                            >
                              <path
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                              />
                            </svg>
                            <h5 class='mb-2 text-xl font-bold tracking-tight text-gray-700'>
                              Upload picture
                            </h5>
                            <p class='font-normal text-sm text-gray-400 md:px-6'>
                              Choose photo size should be less than{' '}
                              <b class='text-gray-600'>2mb</b>
                            </p>
                            <p class='font-normal text-sm text-gray-400 md:px-6'>
                              and should be in{' '}
                              <b class='text-gray-600'>JPG, PNG, or GIF</b>{' '}
                              format.
                            </p>
                          </label>
                        </div>
                        <div class=' grid grid-cols-1'>
                          <span
                            id='filename'
                            class='text-gray-500 bg-gray-200 z-50'
                          ></span>
                          <span
                            onClick={selectImage}
                            class='mt-4 w-full text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center mr-2 mb-2 cursor-pointer'
                          >
                            <span class='text-center ml-2'>Upload</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                  <div className='flex justify-end gap-4.5'>
                    <button
                      className={`${
                        errors.length > 0 ? 'bg-gray-200' : ''
                      } flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-gray-900`}
                      type='button'
                      onClick={handleSubmit}
                      disabled={errors.length > 0}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state?.auth?.user,
  };
};
export default connect(mapStateToProps)(Settings);
