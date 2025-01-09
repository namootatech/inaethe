import moment from 'moment';
import React, { useState } from 'react';

const Modal = ({ showModal, setShowModal, transaction }) => {
  return (
    <>
      {showModal ? (
        <>

          <div
            id='crud-modal'
            tabindex='-1'
            aria-hidden='true'
            class={`${showModal ? "flex" : "hidden"}   backdrop-blur-md	 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
          >
            <div class='relative p-4 w-full max-w-md max-h-full'>
              <div class='relative bg-white rounded-lg shadow dark:bg-gray-700'>
                <div class='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
                  <h3 class='text-lg font-semibold text-gray-900 dark:text-white'>
                    Create New Product
                  </h3>
                  <button
                    type='button'
                    class='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                    data-modal-toggle='crud-modal'
                    onClick={() => setShowModal(!showModal)}
                  >
                    <svg
                      class='w-3 h-3'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 14 14'
                    >
                      <path
                        stroke='currentColor'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='2'
                        d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                      />
                    </svg>
                    <span class='sr-only'>Close modal</span>
                  </button>
                </div>
                <form class='p-4 md:p-5'>
                  <div class='grid gap-4 mb-4 grid-cols-2'>
                    <div class='col-span-2'>
                      <label
                        for='name'
                        class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Email
                      </label>
                      <input
                        type='text'
                        name='name'
                        id='name'
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='Type product name'
                        required=''
                        readOnly
                        value={transaction?.email_address}
                      />
                    </div>
                    <div class='col-span-2'>
                      <label
                        for='name'
                        class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Helpem Payment Id
                      </label>
                      <input
                        type='text'
                        name='name'
                        id='name'
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='Type product name'
                        required=''
                        readOnly
                        value={transaction?.m_payment_id}
                      />
                    </div>
                    <div class='col-span-2'>
                      <label
                        for='name'
                        class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Payfast Payment Id
                      </label>
                      <input
                        type='text'
                        name='name'
                        id='name'
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='Type product name'
                        required=''
                        readOnly
                        value={transaction?.pf_payment_id}
                      />
                    </div>
                    <div class='col-span-2 sm:col-span-1'>
                      <label
                        for='price'
                        class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Gross Amount
                      </label>
                      <input
                        type='text'
                        name='price'
                        id='price'
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='$2999'
                        required=''
                        readOnly
                        value={`R${transaction?.amount_gross}`}
                      />
                    </div>
                    <div class='col-span-2 sm:col-span-1'>
                      <label
                        for='price'
                        class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Fee
                      </label>
                      <input
                        type='text'
                        name='price'
                        id='price'
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='$2999'
                        required=''
                        readOnly
                        value={`R${transaction?.amount_fee}`}
                      />
                    </div>
                    <div class='col-span-2 sm:col-span-1'>
                      <label
                        for='price'
                        class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Net Amount
                      </label>
                      <input
                        type='text'
                        name='price'
                        id='price'
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='$2999'
                        required=''
                        readOnly
                        value={`R${transaction?.amount_net}`}
                      />
                    </div>
                    <div class='col-span-2 sm:col-span-1'>
                      <label
                        for='price'
                        class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Payment Status
                      </label>
                      <input
                        type='text'
                        name='price'
                        id='price'
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='$2999'
                        required=''
                        readOnly
                        value={transaction?.payment_status}
                      />
                    </div>
                    <div class='col-span-2'>
                      <label
                        for='name'
                        class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Date
                      </label>
                      <input
                        type='text'
                        name='name'
                        id='name'
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='Type product name'
                        required=''
                        readOnly
                        value={`${moment(transaction?.billing_date, 'YYYY-MM-DD').format('DD MMMM YYYY')}`}
                      />
                    </div>
                  </div>
                  <button
                    type='submit'
                    onClick={()=> setShowModal(!showModal)}
                    class='text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                  >
                    
                    Close
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
