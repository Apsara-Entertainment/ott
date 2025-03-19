import MovieForm from '@/components/form/MovieForm';
import ErrorPage from '@/components/error/ErrorPage';

async function getMovie(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/${id}`);
  return res.json();
}

export default async function EditMoviePage({ params }: { params: { id: string } }) {
  params = await params;
  const movie = await getMovie(params.id);

  // if movie object contains error key
  if (movie.error) {
    return (
      <ErrorPage />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <MovieForm movie={movie} />
    </div>
  );
}
