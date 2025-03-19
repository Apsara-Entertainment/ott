import { NextResponse } from 'next/server';
import prisma from '@prisma/prismaClient';

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        movies: {
          select: {
            id: true,
          },
          orderBy: {
            title: 'asc',
          },
        },
      },
    });
    const genresWithCount = genres.map((genre) => ({
      ...genre,
      moviesCount: genre.movies.length,
    }));
    return NextResponse.json(genresWithCount);
  } catch (error) {
    console.error("Error fetching genres", error);
    return NextResponse.json({ error: 'Error fetching genres' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const genre = await prisma.genre.create({
      data: {
        name: data.name,
      },
    });
    return NextResponse.json(genre, { status: 201 });
  } catch (error) {
    console.error("Error creating genre", error);
    return NextResponse.json({ error: 'Error creating genre' }, { status: 500 });
  }
}
