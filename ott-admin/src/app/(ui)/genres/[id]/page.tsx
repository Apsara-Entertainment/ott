import GenreForm from '@/components/form/GenreForm';
import ErrorPage from '@/components/error/ErrorPage';

async function getGenre(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/genres/${id}`);
  return res.json();
}

interface EditGenrePageProps {
  id: string
}

export default async function EditGenrePage({ params }: { params: Promise<EditGenrePageProps> }) {
  const { id } = await params;
  const genre = await getGenre(id);

  // if genre object contains error key
  if (genre.error) {
    return (
      <ErrorPage />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <GenreForm genre={genre} />
    </div>
  );
}
