import Layout from '@/components/layout';
import { getAllPostIds, getPostData } from '@/lib/posts';
import markdownToHtml from '@/lib/markdownToHtml';
import styles from "@/styles/markdown.module.css"

export async function getStaticProps({ params }) {
  const postData = getPostData(params.id);
  const content = await markdownToHtml(postData.content || "");

  return {
    props: {
      postData:{...postData, content}
    },
  };
}
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  console.log(postData)
  return (
    <Layout>
       <div className="container mt-4 px-8 py-10">
      <div className={styles.blog}
        dangerouslySetInnerHTML={{ __html: postData.content }}
      />
      <br />
      <p><strong>{postData.date}</strong></p>
      </div>
    </Layout>
  );
}