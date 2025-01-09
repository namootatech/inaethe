import Image from "next/image";
import Link from "next/link";
import { connect } from "react-redux";

const Header = ({theme}) => {
  return (
    <div className={`container h-full bg-[url('/images/${theme?.themeName}/home-page-header.jpg')] home-page-header flex flex-col justify-center items-center`}>
      <div className="grid md:grid-cols-2 grid-cols-1 flex flex-col justify-center items-center">
        <div className="h-full px-8 py-8 text-center md:text-left">
          <h1 className="white-text text-red-700 text-4xl mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-900">
            {theme?.heroHeader}
          </h1>
          {theme?.heroSubHeader && (
            <h2 className="white-text text-2xl mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-900">
            {theme?.heroSubHeader}
          </h2>
          )}
          <p className="text-gray-900 text-base/loose text-2xl md:text-2xl lg:text-2xl dark:text-gray-900 mb-6">
            {theme?.heroParagraph}
          </p>
          <Link
            href="/subscribe"
            className={theme?.heroButton?.class}
          >
            {theme?.heroButton?.cta}
          </Link>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    theme: state.theme,
  };
};

export default connect(mapStateToProps)(Header);
