
async function getGenres() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/genres`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function Home() {
  const genres = await getGenres();

  return (
    <div className="flex">

    </div>
  );
}
