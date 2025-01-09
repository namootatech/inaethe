import moment from 'moment';
import Image from 'next/image';
import { connect } from 'react-redux';
import Modal from '../modal';
import { useState } from 'react';

const TableTwo = ({ transactions }) => {
  const [showModal, setShowModal] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const viewTransAction = (transaction) => {
    console.log('viewing transaction', transaction);
    setTransaction(transaction);
    setShowModal(true);
  };
  console.log('transactions', transactions);
  console.log('showModal', showModal);
  return (
    <div className='rounded-sm md:border md:border-stroke bg-white px-2 md:px-5  pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
      <h4 className='mb-6 text-xl font-semibold text-black dark:text-gray-900'>
        Your recent transactions
      </h4>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        transaction={transaction}
      />

      <table class=' hidden md:grid grid-cols-1 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead class=' rounded rounded-lg gap-4 grid grid-cols-5 text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
          <th scope='col' class='px-6 py-3'>
            <h5 className='text-sm font-medium uppercase xsm:text-base'>
              Date
            </h5>
          </th>
          <th scope='col' class='px-6 py-3'>
            <h5 className='text-sm font-medium uppercase xsm:text-base'>
              Amount
            </h5>
          </th>
          <th scope='col' class='px-6 py-3'>
            <h5 className='text-sm font-medium uppercase xsm:text-base'>
              Status
            </h5>
          </th>
          <th scope='col' class='px-6 py-3'>
            <h5 className='text-sm font-medium uppercase xsm:text-base'>
              Payment ID
            </h5>
          </th>
          <th></th>
        </thead>
        <tbody>
          {transactions?.map((transaction, key) => (
            <tr
              class='bg-white  dark:bg-gray-800 dark:border-gray-700 grid gap-4 grid-cols-5 '
              key={key}
            >
              <td scope='col' class='px-6 py-3'>
                <p className='hidden text-black dark:text-gray-900 sm:block'>
                  {moment(transaction.billing_date, 'YYYY-MM-DD').format(
                    'DD MMM YYYY'
                  )}
                </p>
              </td>

              <td scope='col' class='px-6 py-3'>
                <p className='text-black dark:text-gray-900'>
                  R{transaction.amount_gross}
                </p>
              </td>

              <td scope='col' class='px-6 py-3'>
                <p className='text-meta-3'>{transaction.payment_status}</p>
              </td>

              <td scope='col' class='px-6 py-3'>
                <p className='text-black dark:text-gray-900'>
                  {transaction.pf_payment_id}
                </p>
              </td>
              <td scope='col' class='px-6 py-3'>
                <button
                  className='text-xs text-white bg-red-800 rounded-lg px-3 py-1'
                  onClick={() => viewTransAction(transaction)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className='bg-gray-50 white-text rounded rounded-lg'>
          <tr class='text-gray-900 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 grid gap-4 grid-cols-5 '>
            <th scope='row' class=' px-6 py-3 text-base'>
              Total
            </th>
            <td class=' px-6 py-3'>
              R
              {transactions?.reduce(
                (acc, curr) => acc + parseFloat(curr.amount_gross),
                0
              )}
            </td>
            <td></td>
            <td class=' px-6 py-3'></td>
          </tr>
        </tfoot>
      </table>

      <table className='md:hidden rounded rounded-lg  overflow-hidden bg-gray-2 dark:bg-meta-4 grid grid grid-cols-1 w-full'>
        <tbody className='w-full grid grid-cols-1 rounded rounded-lg overflow-hidden'>
          {transactions?.map((transaction, key) => (
            <div
              className={` w-full grid grid-cols-1 my-4 rounded shadow-lg  rounded-lg overflow-hidden${
                key === transactions.length - 1
                  ? ''
                  : 'border-b border-stroke dark:border-strokedark'
              }`}
              key={key}
            >
              <tr className='grid grid-cols-2 w-full  '>
                <th scope='col' class='px-6 py-3 p-4 rounde bg-gray-50'>
                  <h5 className='text-sm font-medium uppercase xsm:text-base'>
                    Date
                  </h5>
                </th>
                <td scope='col' class='px-6 py-3 p-4  '>
                  <p className='text-xs text-black dark:text-gray-900 sm:block'>
                    {transaction?.billing_date}
                  </p>
                </td>
              </tr>
              <tr className='grid grid-cols-2 w-full '>
                <th scope='col' class='px-6 py-3 p-4 bg-gray-50'>
                  <h5 className='text-sm font-medium uppercase xsm:text-base'>
                    Amount
                  </h5>
                </th>
                <td scope='col' class='px-6 py-3 p-4  '>
                  <p className='text-xs text-black dark:text-gray-900'>
                    R{transaction.amount_gross}
                  </p>
                </td>
              </tr>
              <tr className='grid grid-cols-2 w-full '>
                <th scope='col' class='px-6 py-3 p-4 bg-gray-50'>
                  <h5 className='text-sm font-medium uppercase xsm:text-base'>
                    Status
                  </h5>
                </th>
                <td className='p-4 '>
                  <p className='text-xs text-meta-3'>
                    {transaction.payment_status}
                  </p>
                </td>
              </tr>
              <tr className='grid grid-cols-2 w-full '>
                <th className='p-4 bg-gray-50'>
                  <h5 className='text-sm font-medium uppercase xsm:text-base'>
                    Payment ID
                  </h5>
                </th>
                <td className='p-4 '>
                  <p className='text-xs text-black dark:text-gray-900'>
                    {transaction.pf_payment_id}
                  </p>
                </td>
              </tr>
              <tr>
                <td scope='col' colSpan={2} class='px-6 py-3 flex items-center justify-center'>
                  <button
                    className='text-xs text-white bg-red-800 rounded-lg px-12 py-4'
                    onClick={() => viewTransAction(transaction)}
                  >
                    View
                  </button>
                </td>
              </tr>
            </div>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    transactions: state?.auth?.transactions,
  };
};

export default connect(mapStateToProps)(TableTwo);
