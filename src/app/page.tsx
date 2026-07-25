import AppLoader from "@/components/AppLoader";
import HomeContent from "@/components/HomeContent";

interface SearchParams {
  to?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const guestName = params.to || "tamu undangan";

  return (
    <AppLoader guestName={guestName}>
      <HomeContent />
    </AppLoader>
  );
}


