import { LocationDetailPage } from "../../../components/LocationDetailPage";
import { notFound, redirect } from "next/navigation";

const projectIds = {
  goa: 101,
  manali: 102,
  jaipur: 103,
  rishikesh: 104,
  andaman: 105,
  kashmir: 106,
};

export default function Page({ params }) {
  const projectId = projectIds[params.slug.toLowerCase()];
  if (!projectId) notFound();
  redirect(`/locations/${projectId}`);
}
