import { NextResponse } from 'next/server';
import prisma from '@prisma/prismaClient';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  params = await params;
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(params.id) },
      include: { genre: true },
    });
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    let movieCorrected = {
      ...movie,
      releaseDate: movie.releaseDate.toISOString().substring(0, 10),
    }
    return NextResponse.json(movieCorrected);
  } catch (error) {
    console.error("Error fetching movie", error);
    return NextResponse.json({ error: 'Error fetching movie' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  params = await params;
  try {
    const data = await request.json();
    const movie = await prisma.movie.update({
      where: { id: parseInt(params.id) },
      data: {
        title: data.title,
        description: data.description,
        releaseDate: new Date(data.releaseDate),
        posterUrl: data.posterUrl,
        videoUrl: data.videoUrl,
        genreId: parseInt(data.genreId),
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
      },
    });
    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ error: 'Error updating movie' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  params = await params;
  try {
    const movie = await prisma.movie.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ error: 'Error deleting movie' }, { status: 500 });
  }
}
