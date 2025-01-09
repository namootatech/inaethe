import { getSortedPostsData } from "../../lib/posts";
import Layout from "@/components/layout";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Blog({ allPostsData }) {
  console.log(allPostsData);
  return (
    <Layout>
      <div className="container md:mt-4 md:px-16 py-20 h-screen">
        <section>
          <ul className="grid grid-cols-4">
            {allPostsData.map(({ id, date, title, excerpt }) => (
              <li key={id} className="mx-auto">
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-900">
                      {title}
                    </h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {excerpt}
                  </p>
                  <a
                    href={`/blog/${id}`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-900 bg-blackrounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Read more
                    <svg
                      className="w-3.5 h-3.5 ml-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
