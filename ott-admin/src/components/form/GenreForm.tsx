'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { useState } from 'react';
import Spinner from '../utils/spinner';
import ChangeMark from '../utils/changeMark';

type GenreFormData = {
  name: string;
};

interface GenreFormProps {
  genre?: GenreFormData & { id: number };
}

export default function GenreForm({ genre }: GenreFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<GenreFormData>({
    defaultValues: genre || {
      name: '',
    },
  });

  const onSubmit = async (data: GenreFormData) => {
    setLoading(true);
    try {
      const method = genre ? 'PUT' : 'POST';
      const url = genre ? `/api/genres/${genre.id}` : '/api/genres';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        if (genre) {
          toast.success('Genre updated successfully');
        } else {
          toast.success('Genre added successfully');
        }
        router.push('/genres');
      }
    } catch (error) {
      toast.error("Failed to submit genre: " + error);
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/genres/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Genre deleted successfully');
        router.push('/genres');
      }
      else {
        let errorMessage = await response.json();
        toast.error("Failed to delete genre: " + errorMessage.error);
        console.error('Error deleting genre:', errorMessage.error);
      }
    } catch (error) {
      toast.error("Failed to delete genre: " + error);
      console.error('Error deleting genre:', error);
    } finally {
      setLoading(false);
    }
  }

  const watchIsChanged = (field: any) => (
    // if edit mode, check if watched value is different from genre's field value
    // otherwise check if watched value is not empty
    watch(field) !== (genre?.[field as keyof GenreFormData] || "") && <ChangeMark />
  );

  return (
    <>
      {loading && <Spinner />}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className='flex w-full items-center justify-between space-x-2'>
          <div className='flex items-center justify-center'>
            <h1 className="text-2xl font-bold">
              {genre ? 'Edit Genre' : 'Add New Genre'}
            </h1>
          </div>
          <div className='flex space-x-2'>
            <Button type="submit" className='bg-slate-800 cursor-pointer'>
              {genre ? 'Update Genre' : 'Create Genre'}
            </Button>
            <Button type='button' onClick={() => router.push('/genres')} className='bg-slate-800 cursor-pointer'>
              Cancel
            </Button>
            {genre && (
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
                        onClick={() => handleDelete(genre.id)}
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

        <div className="flex flex-wrap justify-start gap-8">
          <div className="flex flex-col w-1/2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name*{watchIsChanged('name')}
              </Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                className={errors.name ? 'border-red-500' : ''}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
