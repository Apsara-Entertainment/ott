import { NextResponse } from 'next/server';
import prisma from '@prisma/prismaClient';

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        genre: true,
      },
      orderBy: { id: 'desc' },
    });
    const moviesCorrected = movies.map((movie) => ({
      ...movie,
      releaseDate: movie.releaseDate.toISOString().substring(0, 10),
    }));
    return NextResponse.json(moviesCorrected);
  } catch (error) {
    console.error("Error fetching movies", error);
    return NextResponse.json({ error: 'Error fetching movies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("data", data);
    const movie = await prisma.movie.create({
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
    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error("Error creating movie", error);
    return NextResponse.json({ error: 'Error creating movie' }, { status: 500 });
  }
}
