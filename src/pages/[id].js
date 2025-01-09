import Layout from "@/components/layout";
import { connect } from "react-redux";
import Artifacts from '@/components/content/generator';
import { getThemeConfig } from "@/themes";

export async function getStaticProps({ params }) {
    const id = params.id;
    return { props: { id } };
}

export async function getStaticPaths() {
   const theme = await getThemeConfig();
   console.log("Theme", theme.themeName)
   let paths = theme?.pages?.map(p => ({params: {id :p.id}}))
    return {
      paths,
      fallback: false,
    };
  }

function Page(props) {
    let pageId = props.id;
    if (pageId === "") {
        pageId = "homepage";
    }
    const page = props.theme?.pages?.find(page => page.id === pageId);
    return (
        <Layout>
            <div className="container md:mt-4 md:px-16 px-4">
                {page && <Artifacts items={page?.artifacts} />}
            </div>
        </Layout>
    )
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
    };
};

export default connect(mapStateToProps)(Page);

