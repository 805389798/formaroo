import PricingClient from "./pricing-client";
import { getServerDictionary } from "@/lib/locale";

export default async function PricingPage() {
  const t = await getServerDictionary();
  return <PricingClient dict={t.pricing} />;
}
