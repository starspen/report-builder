// app/main/page.tsx

import FormView from "../form/page-view";
import ImagePlan from "./image-plan/page";
import { HomeScreen } from "./page-view";

export default function Page() {
  return (
    <>
      <ImagePlan />
      <HomeScreen />
    </>
  );
}
