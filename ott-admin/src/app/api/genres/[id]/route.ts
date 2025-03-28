import { NextResponse } from 'next/server';
import prisma from '@prisma/prismaClient';

interface GenreApiProps {
  id: string
}

export async function GET(request: Request, { params }: { params: Promise<GenreApiProps> }) {
  const { id } = await params;
  try {
    const genre = await prisma.genre.findUnique({
      where: { id: parseInt(id) },
    });
    if (!genre) {
      return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
    }
    return NextResponse.json(genre);
  } catch (error) {
    console.error("Error fetching genre", error);
    return NextResponse.json({ error: 'Error fetching genre' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<GenreApiProps> }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const genre = await prisma.genre.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(genre, { status: 200 });
  } catch (error) {
    console.error("Error updating genre", error);
    return NextResponse.json({ error: 'Error updating genre' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<GenreApiProps> }) {
  const { id } = await params;
  const movie = await prisma.movie.findFirst({
    where: { genreId: parseInt(id) },
  });
  if (movie) {
    return NextResponse.json({ error: 'Genre is associated with movies' }, { status: 400 });
  }
  try {
    const genre = await prisma.genre.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(genre, { status: 200 });
  } catch (error) {
    console.error("Error deleting genre", error);
    return NextResponse.json({ error: 'Error deleting genre' }, { status: 500 });
  }
}
