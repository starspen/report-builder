import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import PrintPageView from "./page-view";
const DownloadPage = ({ params }: { params: { slug: string[] } }) => {
  console.log(params.slug);
  return <PrintPageView entity_cd={params.slug[0]} reg_id={params.slug[1]} />;
};

export default DownloadPage;
