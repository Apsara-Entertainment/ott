import ErrorPage from '@/components/error/ErrorPage';
import { Button } from '@/components/ui/button';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

async function getGenres() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/genres`, {
    cache: 'no-store',
  });
  return res.json();
}

interface Genre {
  id: number;
  name: string;
  moviesCount: number;
}

export default async function GenresPage() {
  const genres = await getGenres();

  // if genres object contains error key
  if (genres.error) {
    return (
      <ErrorPage />
    );
  }

  console.log("genres", genres);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Genres</h1>
        <Button asChild variant="default" className='bg-slate-800 cursor-pointer'>
          <Link href="/genres/new"><PlusCircle />Add New Genre</Link>
        </Button>
      </div>

      <div>
        <Table>
          <TableCaption>List of Genres</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Movies Count</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {genres.map((genre: Genre) => (
              <TableRow key={genre.id}>
                <TableCell className="font-medium">{genre.id}</TableCell>
                <TableCell>{genre.name}</TableCell>
                <TableCell className='text-center'>{genre.moviesCount}</TableCell>
                <TableCell className="space-x-2 text-center">
                  <Button variant="default" asChild className='bg-slate-800 cursor-pointer'>
                    <Link href={`/genres/${genre.id}`}>Edit</Link>
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
