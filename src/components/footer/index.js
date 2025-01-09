import Link from 'next/link'
import { connect } from "react-redux";

const Footer = ({theme}) => {
  return (
    <footer className={`${theme?.footer?.bg} ${theme?.footer?.fg} dark:bg-red-900 py-8`}>
      <div className="mx-auto w-full max-w-screen-xl px-4 py-12 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-gray-900">
               {theme?.partnerName}
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900-900 uppercase dark:text-gray-900">
                Resources
              </h2>
              <ul className="text-gray-900-500 dark:text-gray-900-400 font-medium">
                <li className="mb-4">
                  <Link href="/" className="hover:underline">
                  {theme?.partnerName}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900-900 uppercase dark:text-gray-900">
                Follow us
              </h2>
              <ul className="text-gray-900-500 dark:text-gray-900-400 font-medium">
                <li className="mb-4">
                  <Link
                    href="https://www.facebook.com/helpemza"
                    className="hover:underline "
                  >
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900-900 uppercase dark:text-gray-900">
                Legal
              </h2>
              <ul className="text-gray-900-500 dark:text-gray-900-400 font-medium">
                <li className="mb-4">
                  <Link href="/privacy-policy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-900-500 sm:text-center dark:text-gray-900-400">
            © 2023{" "}
            <Link href="https://helpem.co.za" className="hover:underline">
              Help'em™
            </Link>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
            <Link
              href="https://www.facebook.com/helpemza/"
              className="text-gray-900-500 hover:text-gray-900-900 dark:hover:text-gray-900"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 8 19"
              >
                <path
                  fillRule="evenodd"
                  d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Facebook page</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>

  );
};


const mapStateToProps = (state) => {
  return {
    theme: state.theme,
  };
};

export default connect(mapStateToProps)(Footer);
