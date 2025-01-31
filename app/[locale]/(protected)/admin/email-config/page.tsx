import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Form from "./form";

const InputLayout = () => {
  return (
    <div>
      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Form />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InputLayout;
