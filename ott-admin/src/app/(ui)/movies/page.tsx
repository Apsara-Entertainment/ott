import { Button } from '@/components/ui/button';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

async function getMovies() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`, {
    cache: 'no-store',
  });
  return res.json();
}

interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  genre: {
    name: string
  }
}

export default async function MoviesPage() {
  const movies = await getMovies();
  // console.log("movies", movies);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Movies</h1>
        <Button asChild variant="default" className='bg-slate-800 cursor-pointer'>
          <Link href="/movies/new"><PlusCircle />Add New Movie</Link>
        </Button>
      </div>

      <div>
        <Table>
          <TableCaption>List of Movies</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie: Movie) => (
              <TableRow key={movie.id}>
                <TableCell className="font-medium">{movie.id}</TableCell>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.description.slice(0, 50) + '...'}</TableCell>
                <TableCell>{movie.releaseDate.slice(0, 10)}</TableCell>
                <TableCell>{movie.genre.name}</TableCell>
                <TableCell className="text-center">
                  <Button variant="default" asChild className='bg-slate-800 cursor-pointer'>
                    <Link href={`/movies/${movie.id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
