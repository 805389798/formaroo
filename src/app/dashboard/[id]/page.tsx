import FormDetailClient from "./form-detail-client";
import { getServerDictionary } from "@/lib/locale";

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dict = await getServerDictionary();
  return <FormDetailClient formId={id} dict={dict.formDetail} />;
}
