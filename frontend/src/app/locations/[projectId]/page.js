import { LocationDetailPage } from "../../../components/LocationDetailPage";

export default function Page({ params }) {
  return <LocationDetailPage projectId={Number(params.projectId)} />;
}
