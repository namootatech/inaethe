import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableOne from '@/components/Tables/TableOne';
import TableThree from '@/components/Tables/TableThree';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { set } from 'ramda';
import moment from 'moment';

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const metadata = {
  title: 'Next.js Tables | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const AffiliatesPage = ({ user }) => {
  const [copyText, setCopyText] = useState('Copy');
  const [affiliates, setAffiliates] = useState([]);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const shortenUrl = async (url) => {
    try {
      const tinryUrlApi = `https://api.tinyurl.com/create?api_token=pAJWzjvbpKjMAPYqCtecRRx40SLFBiSNc1841AxjEBqfil21M1dzwyGPHKu0`;
      const response = await fetch(tinryUrlApi, {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Shortened', data);
      setShortenedUrl(data.data.tiny_url);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    console.log('User', user?._id);
    if (user) {
      console.log(
        'Fetching affiliates from',
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/affiliates?id=${user?._id}`
      );
      shortenUrl(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/subscribe?parent=${user?._id}`
      );
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/affiliates?id=${user?._id}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log('Affiliates', data);
          setAffiliates(data);
        });
    }
  }, [user]);

  useEffect(() => {}, [user]);
  const userLink = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/subscribe?parent=${user?._id}`;

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Affiliates' />
      <div className='flex flex-col gap-10 py-4 px-4'>
        <TableOne />
        <div className='rounded-sm md:border md:border-stroke bg-white px-1 md:px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
        <h1 className="text-2xl py-2 font-bold">Affiliates</h1>
          <h1>Your affiliate link</h1>

          <p className='text-base my-2'>
            <a href={shortenedUrl}>{`${shortenedUrl}`}</a>
          </p>
          <button
            onClick={() => {
              setCopyText('Copied!');
              navigator.clipboard.writeText(shortenedUrl);
            }}
            type='button'
            className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-10 my-6 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
          >
            {copyText}
          </button>
          <table className='md:hidden sm:grid rounded rounded-lg shdow-md overflow-hidden bg-gray-2 dark:bg-meta-4 grid grid grid-cols-1 w-full'>
            <tbody className='w-full grid grid-cols-1 shadow-md rounded rounded-lg overflow-hidden'>
              {affiliates.map((affiliate, key) => (
                <div
                  className={` w-full grid grid-cols-1 my-4 rounded  shadow-lg rounded-lg overflow-hidden${
                    key === affiliates.length - 1
                      ? ''
                      : 'border-b border-stroke dark:border-strokedark'
                  }`}
                  key={key}
                >
                  <tr className='grid grid-cols-2 w-full  '>
                    <th
                      scope='col'
                      class='px-6 py-3 p-4 rounded bg-gray-50'
                    >
                      <h5 className='text-sm font-medium uppercase xsm:text-base'>
                        Name
                      </h5>
                    </th>
                    <td
                      scope='col'
                      class='px-6 py-3 p-4 text-wrap break-words '
                    >
                      <p className='text-xs text-black dark:text-gray-900 sm:block text-wrap break-words'>
                        {affiliate?.firstName} {affiliate?.lastName}
                      </p>
                    </td>
                  </tr>
                  <tr className='grid grid-cols-2 w-full '>
                    <th scope='col' class='px-6 py-3 p-4 bg-gray-50'>
                      <h5 className='text-sm font-medium uppercase xsm:text-base'>
                        Email
                      </h5>
                    </th>
                    <td
                      scope='col'
                      class='px-6 py-3 p-4 text-wrap break-words text-xs text-black '
                    >
                      {affiliate.email}
                    </td>
                  </tr>
                  <tr className='grid grid-cols-2 w-full '>
                    <th scope='col' class='px-6 py-3 p-4 bg-gray-50'>
                      <h5 className='text-sm font-medium uppercase xsm:text-base'>
                        Latest Transaction
                      </h5>
                    </th>
                    <td className='py-4'>
                      <p className='text-xs text-meta-3'>
                        {affiliate.transaction && (
                          <table className='table-auto w-full'>
                            <tbody>
                              <tr className=''>
                                <td className='py-2 px-2 '>
                                  Date
                                </td>
                                <td className='py-2 px-2 '>
                                  {moment(affiliate?.transaction?.billing_date).format("DD MMM YYYY")}
                                </td>
                              </tr>
                              <tr className=''>
                                <td className='py-2 px-2 '>
                                  Amount
                                </td>
                                <td className='py-2 px-2 '>
                                  {affiliate?.transaction?.amount_gross}
                                </td>
                              </tr>
                              <tr className=''>
                                <td className='py-2 px-2 '>
                                  status
                                </td>
                                <td className='py-2 px-2 '>
                                  {affiliate?.transaction?.payment_status}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                        {!affiliate.transaction && <p class="px-6 py-3 p-4 text-wrap break-words text-xs text-black ">No transaction</p>}
                      </p>
                    </td>
                  </tr>
                </div>
              ))}
            </tbody>
          </table>
          <table className='hidden sm:hidden md:grid grid-cols-1 w-full table-auto w-full py-2 mt-2 mb-4'>
            <thead className='grid grid-cols-4 w-full rounded rounded-lg bg-gray-50'>
              <th className='py-2 px-2 text-left col-span-1' colSpan={1}>Name</th>
              <th className='py-2 px-2 text-left col-span-1'colSpan={1}>Email</th>
              <th className='py-2 px-2 text-left col-span-2' colSpan={2}>Latest Transaction</th>
            </thead>
            <tbody className='grid grid-cols-1 w-full'>
              {affiliates.map((affiliate) => (
                <tr key={affiliate._id} className='grid grid-cols-4 w-full' >
                  <td className='py-2 px-2 col-span-1 break-words text-wrap' colSpan={1}>
                    {capitalize(affiliate.firstName)}{' '}
                    {capitalize(affiliate.lastName)}
                  </td>
                  <td className='py-2 px-2 col-span-1 break-words text-wrap' colSpan={1}>{affiliate.email}</td>
                  <td className='py-2 px-2 border border-gray-100 col-span-2' colSpan={2}>
                    {affiliate.transaction && (
                      <table className='table-auto w-full'>
                        <tbody>
                          <tr>
                            <td className='py-2 px-2 font-bold'>Date</td>
                            <td className='py-2 px-2 font-bold'>Amount</td>
                            <td className='py-2 px-2 font-bold'>status</td>
                          </tr>
                          <tr>
                            <td className='py-2 px-2'>
                              {affiliate?.transaction?.billing_date}
                            </td>
                            <td className='py-2 px-2'>
                              {affiliate?.transaction?.amount_gross}
                            </td>
                            <td className='py-2 px-2'>
                              {affiliate?.transaction?.payment_status}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {!affiliate.transaction && 'No transaction'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

const mapStateToProps = (state) => ({
  user: state?.auth?.user,
});

export default connect(mapStateToProps)(AffiliatesPage);
