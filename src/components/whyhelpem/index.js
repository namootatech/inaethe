 import Image from 'next/image';
import { GiFoodTruck } from 'react-icons/gi';
import { BsBook } from 'react-icons/bs';
import {HiUserGroup} from 'react-icons/hi';
import { connect } from "react-redux";

const WhyHelpEm = ({theme}) => {
  return (
    <div className={`h-full w-full px-10 py-10 px-10 text-center md:text-left ${theme?.spaSection?.bg} ${theme?.spaSection?.fg} text-center`}>
      <h2 className=" text-6xl mb-4 text-center mt-4 font-extrabold leading-none tracking-tight dark:text-gray-900">
        {theme?.spaSection?.title}
      </h2>
      <br />
      <div className="  grid md:grid-cols-3 grid-cols-1 flex flex-col justify-center items-center section-image ">
        <div className="py-4 flex flex-col justify-center items-center text-center">
          <div className="flex flex-col justify-center items-center">
            <GiFoodTruck size="5em" />
            <h2 className="text-4xl py-4 font-bold">{theme?.spaSection?.spa1?.title}</h2>
          </div>

          <p className="text-2xl text-base/loose md:text-4xl">
            {theme?.spaSection?.spa1?.text}
          </p>
        </div>
        <div className="py-2 flex flex-col justify-center items-center text-center">
          <div className="flex flex-col justify-center items-center">
            <BsBook size="5em" />
            <h2 className="text-4xl py-4 font-bold">{theme?.spaSection?.spa2?.title}</h2>
          </div>

          <p className="text-2xl text-base/loose w-4/5 md:text-4xl">
            {theme?.spaSection?.spa2?.text}
          </p>
        </div>
        <div className=" py-4 flex flex-col justify-center items-center text-center">
          <div className="flex flex-col justify-center items-center">
            <HiUserGroup size="5em" />
            <h2 className="text-4xl py-4 font-bold">{theme?.spaSection?.spa3?.title}</h2>
          </div>

          <p className="text-2xl text-base/loose md:text-4xl">
            {theme?.spaSection?.spa3?.text}
          </p>
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

export default connect(mapStateToProps)(WhyHelpEm);
