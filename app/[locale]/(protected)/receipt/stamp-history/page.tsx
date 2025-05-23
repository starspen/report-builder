"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentTable from "./content-table";
import StampPageHeader from "./page-header";
import { auth } from "@/lib/auth";

const ReactTablePage = () => {
  // const session = await auth()
  return (
    <div>
      <div className="space-y-6">
        {/* <Card>
          <CardHeader>
            <CardTitle>Receipt Stamp History</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentTable />
          </CardContent>
        </Card> */}
        <Card>
          <StampPageHeader/>
        </Card>
      </div>
    </div>
  );
};

export default ReactTablePage;
