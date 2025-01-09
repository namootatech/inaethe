 import Image from 'next/image';
 import Link from "next/link";
 import { connect } from "react-redux"; 

const GetInvolved = ({theme}) => {
  return (
    <div className="container">
      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="h-full px-8 py-8 text-center md:text-left ">
          <h2 className={theme?.section?.header?.class}>
           {theme?.section3?.article1?.title}
          </h2>
          <p className=" text-base/loose text-2xl md:text-2xl lg:text-2xl dark:text-gray-900 mb-4">
            {theme?.section3?.article1?.text}
          </p>
          <h2 className={theme?.section?.header?.class}>
           {theme?.section3?.article2?.title}
          </h2>
          <p className="text-base/loose text-2xl md:text-2xl lg:text-2xl dark:text-gray-900 mb-4">
           {theme?.section3?.article2?.text}
          </p>
          <Link
            href="/subscribe"
            className={theme?.colors?.button?.primary?.class}
          >
            Subscribe
          </Link>
        </div>
        <div className={`bg-[url('/images/${theme?.themeName}/getinvolved.jpg')] bg-cover h-96 section-image`}></div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    theme: state.theme,
  };
};

export default connect(mapStateToProps)(GetInvolved);