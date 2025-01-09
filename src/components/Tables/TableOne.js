import moment from 'moment';
import Image from 'next/image';
import { connect } from 'react-redux';

const TableOne = ({ subscriptions }) => {
  return (
    <div className='rounded-sm md:border md:border-stroke md:px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
      <h4 className='mb-6 text-xl font-semibold text-black dark:text-gray-900'>
        Your subscriptions
      </h4>

      <div className='flex flex-col'>
        <table className='md:hidden md:shadow-lg rounded rounded-lg dark:bg-meta-4 grid grid grid-cols-1 w-full'>
          <tbody className='w-full grid grid-cols-1'>
            {subscriptions?.map((subscription, key) => (
              <div
                className={` shadow-lg my-4 w-full grid grid-cols-1${
                  key === subscriptions.length - 1
                    ? '' 
                    : 'border-b border-stroke dark:border-strokedark'
                }`}
                key={key}
              >
                <tr className='grid grid-cols-2 w-full'>
                  <th scope="col" class="px-6 py-3 p-4  bg-gray-100">
                    <h5 className='text-sm font-medium uppercase xsm:text-base'>
                      Organisation
                    </h5>
                  </th>
                  <td scope="col" class="px-6 py-3 p-4  ">
                    <p className='text-xs text-black dark:text-gray-900 sm:block'>
                      {subscription?.partner?.name}
                    </p>
                  </td>
                </tr>
                <tr className='grid grid-cols-2 w-full'>
                  <th scope="col" class="px-6 py-3 p-4  bg-gray-100">
                    <h5 className='text-sm font-medium uppercase xsm:text-base'>
                      Amount
                    </h5>
                  </th>
                  <td scope="col" class="px-6 py-3 p-4  ">
                    <p className='text-xs text-black dark:text-gray-900'>
                      R{subscription.amount}
                    </p>
                  </td>
                </tr>
                <tr className='grid grid-cols-2 w-full'>
                  <th scope="col" class="px-6 py-3 p-4  bg-gray-100">
                    <h5 className='text-sm font-medium uppercase xsm:text-base'>
                      Date Started
                    </h5>
                  </th>
                  <td className='p-4 '>
                    <p className='text-xs text-meta-3'>
                      {moment(subscription.date).format('DD MMM YYYY')}
                    </p>
                  </td>
                </tr>
                <tr className='grid grid-cols-2 w-full'>
                  <th className='p-4   bg-gray-100'>
                    <h5 className='text-sm font-medium uppercase xsm:text-base'>
                      Subscription Tier
                    </h5>
                  </th>
                  <td className='p-4 '>
                    <p className='text-xs text-black dark:text-gray-900'>
                      {subscription.subscriptionTier}
                    </p>
                  </td>
                </tr>
              </div>
            ))}
          </tbody>
        </table>
        <table class=" hidden md:grid grid-cols-1 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class=" rounded rounded-lg gap-4 grid grid-cols-4 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <th scope="col" class="px-6 py-3">
              <h5 className='text-sm font-medium uppercase xsm:text-base'>
                Organisation
              </h5>
            </th>
            <th scope="col" class="px-6 py-3">
              <h5 className='text-sm font-medium uppercase xsm:text-base'>
                Amount
              </h5>
            </th>
            <th scope="col" class="px-6 py-3">
              <h5 className='text-sm font-medium uppercase xsm:text-base'>
                Date Started
              </h5>
            </th>
            <th scope="col" class="px-6 py-3">
              <h5 className='text-sm font-medium uppercase xsm:text-base'>
                Subscription Tier
              </h5>
            </th>
          </thead>
          <tbody>
            {subscriptions?.map((subscription, key) => (
              <tr
               class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 grid gap-4 grid-cols-4 "
                key={key}
              >
                <td scope="col" class="px-6 py-3">
                  <div className='flex-shrink-0'>{/* data here */}</div>
                  <p className='hidden text-black dark:text-gray-900 sm:block'>
                    {subscription?.partner?.name}
                  </p>
                </td>
                <td scope="col" class="px-6 py-3">
                  <p className='text-black dark:text-gray-900'>
                    R{subscription.amount}
                  </p>
                </td>
                <td scope="col" class="px-6 py-3">
                  <p className='text-meta-3'>
                    {moment(subscription.date).format('DD MMM YYYY')}
                  </p>
                </td>
                <td scope="col" class="px-6 py-3">
                  <p className='text-black dark:text-gray-900'>
                    {subscription.subscriptionTier}
                  </p>
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
              {subscriptions?.reduce(
                (acc, curr) => acc + parseFloat(curr.amount),
                0
              )}
            </td>
            <td></td>
            <td class=' px-6 py-3'></td>
          </tr>
        </tfoot>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    subscriptions: state?.auth?.subscriptions,
  };
};

export default connect(mapStateToProps)(TableOne);
