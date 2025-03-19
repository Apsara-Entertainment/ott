'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Genre } from '@prisma/client';
import Spinner from '../utils/spinner';
import ChangeMark from '../utils/changeMark';
import VideoUploader from '../utils/videoUploader';
import ImageUploader from '../utils/imageUploader';

type MovieFormData = {
  title: string;
  description: string;
  releaseDate: string;
  posterUrl: string;
  videoUrl: string;
  genreId: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
};

interface MovieFormProps {
  movie?: MovieFormData & { id: number };
}

export default function MovieForm({ movie }: MovieFormProps) {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    let genreId = genres.find((g) => g.name === value)?.id || 0;
    setValue("genreId", genreId, { shouldValidate: true });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MovieFormData>({
    defaultValues: movie || {
      title: '',
      description: '',
      releaseDate: '',
      posterUrl: '',
    },
  });

  // Fetch genres for dropdown
  useEffect(() => {
    setLoading(true);
    fetch('/api/genres')
      .then((res) => res.json())
      .then((genreData: Genre[]) => {
        setGenres(genreData);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (movie) {
      let genreName = genres.find((g) => g.id === movie.genreId)?.name || '';
      handleGenreChange(genreName);
    }
  }, [genres]);

  const onSubmit = async (data: MovieFormData) => {
    setLoading(true);
    try {
      const method = movie ? 'PUT' : 'POST';
      const url = movie ? `/api/movies/${movie.id}` : '/api/movies';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        if (movie) {
          toast.success('Movie updated successfully');
        } else {
          toast.success('Movie added successfully');
        }
        router.push('/movies');
      }
    } catch (error) {
      toast.error("Failed to submit movie: " + error);
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Movie deleted successfully');
        router.push('/movies');
      }
      else {
        let errorMessage = await response.json();
        toast.error("Failed to delete movie: " + errorMessage.error);
        console.error('Error deleting movie:', errorMessage.error);
      }
    } catch (error) {
      toast.error("Failed to delete movie: " + error);
      console.error('Error deleting movie:', error);
    } finally {
      setLoading(false);
    }
  }

  const watchIsChanged = (field: any) => (
    // if edit mode, check if watched value is different from movie's field value
    // otherwise check if watched value is not empty
    watch(field) !== (movie?.[field as keyof MovieFormData] || "") && <ChangeMark />
  );

  const videoUploaderSetVideoUrl = (url: string) => {
    setValue('videoUrl', url);
  }

  const imageUploaderSetImageUrl = (url: string) => {
    setValue('posterUrl', url);
  }

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_CDN_URL + watch('posterUrl'))
  }, [watch('posterUrl')])

  return (
    <>
      {loading && <Spinner />}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 items-center" id="movie-form">
        <div className='flex w-full items-center justify-between space-x-2'>
          <div className='flex items-center justify-center'>
            <h1 className="text-2xl font-bold">
              {movie ? 'Edit Movie' : 'Add New Movie'}
            </h1>
          </div>
          <div className='flex space-x-2'>
            <Button type="submit" form="movie-form" className='bg-slate-800 cursor-pointer'>
              {movie ? 'Update Movie' : 'Create Movie'}
            </Button>
            <Button type='button' onClick={() => router.push('/movies')} className='bg-slate-800 cursor-pointer'>
              Cancel
            </Button>
            {movie && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type='button' variant="destructive" className='cursor-pointer'>Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction asChild>
                      <Button
                        type='button'
                        variant="destructive"
                        onClick={() => handleDelete(movie.id)}
                        className='cursor-pointer bg-red-600 hover:bg-red-500'>
                        Confirm Delete
                      </Button>
                    </AlertDialogAction>
                    <AlertDialogCancel asChild>
                      <Button type='button' variant="outline" className='cursor-pointer'>Cancel</Button>
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-start w-full gap-8">
          {/* TODO: Find a fix for Textarea width */}
          <div className="flex flex-col flex-grow gap-8 max-w-md">
            <h3 className="text-xl font-medium border-b pb-2">Basic</h3>
            <div className="space-y-4">
              <Label htmlFor="title">Title*{watchIsChanged('title')}</Label>
              <Input id="title" width={2} {...register('title', { required: 'Title is required' })}
                className={errors.title ? 'border-red-500' : ''}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="description">Description*{watchIsChanged('description')}</Label>
              <div className="w-full">
                <Textarea id="description"  {...register('description', { required: 'Description is required' })}
                  className={errors.description ? 'border-red-500' : ''}
                  style={{ width: '100%', maxWidth: '100%' }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="releaseDate">Release Date*{watchIsChanged('releaseDate')}</Label>
              <Input type="date" id="releaseDate" {...register('releaseDate', { required: 'Release date is required' })}
                className={errors.releaseDate ? 'border-red-500' : ''}
                style={{ width: 'fit-content' }}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="genreId">Genre*{watchIsChanged('genreId')}</Label>
              <Select onValueChange={handleGenreChange} value={selectedGenre}>
                <SelectTrigger className={errors.genreId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent id="genreId">
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.name}>{genre.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("genreId", { required: "Genre is required" })}
                value={selectedGenre}
              />
            </div>

            <h3 className="text-xl font-medium border-b pb-2">Thumbnail</h3>
            <div className="space-y-4">
              <div className="w-44 h-44 mx-auto">
                {watch('posterUrl') && (
                  <Image src={process.env.NEXT_PUBLIC_CDN_URL + watch('posterUrl')} alt="Thumbnail" width={100} height={100} />
                ) || (
                    <div className="w-44 h-44 bg-slate-200"></div>
                  )}
              </div>
              <Label htmlFor="posterUrl">Thumbnail URL*{watchIsChanged('posterUrl')}</Label>
              <div className="flex items-center gap-2">
                <ImageUploader setimageUrlFunc={imageUploaderSetImageUrl} />
                <span>&rarr;</span>
                <Input
                  id="posterUrl"
                  disabled
                  placeholder='Upload image to generate URL'
                  {...register('posterUrl', { required: 'Thumbnail URL is required', value: imageUrl })}
                  className={errors.posterUrl ? 'border-red-500' : ''}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-grow gap-8 max-w-md">
            <h3 className="text-xl font-medium border-b pb-2">Video</h3>
            <div className="space-y-4">
              <div className="w-44 mx-auto">
                {watch('videoUrl') && (
                  <video src={process.env.NEXT_PUBLIC_CDN_URL + watch('videoUrl')} />
                ) || (
                    <div className="w-44 h-44 bg-slate-200"></div>
                  )}
              </div>
              <Label htmlFor="videoUrl">Video URL*{watchIsChanged('videoUrl')}</Label>
              <div className="flex items-center gap-2">
                <VideoUploader setVideoUrlFunc={videoUploaderSetVideoUrl} />
                <span>&rarr;</span>
                <Input
                  id="videoUrl"
                  disabled
                  placeholder='Upload video to generate URL'
                  {...register('videoUrl', { required: 'Video URL is required', value: videoUrl })}
                  className={errors.videoUrl ? 'border-red-500' : ''}
                />
              </div>
            </div>

            <h3 className="text-xl font-medium border-b pb-2">Meta</h3>
            <div className="space-y-4">
              <Label htmlFor="metaTitle">Meta Title*{watchIsChanged('metaTitle')}</Label>
              <Input id="metaTitle" {...register('metaTitle')} />
            </div>

            <div className="space-y-4">
              <Label htmlFor="metaDescription">Meta Description*{watchIsChanged('metaDescription')}</Label>
              <Textarea id="metaDescription" {...register('metaDescription')} />
            </div>

            <div className="space-y-4">
              <Label htmlFor="metaKeywords">Meta Keywords*{watchIsChanged('metaKeywords')}</Label>
              <Input id="metaKeywords" {...register('metaKeywords')} />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
