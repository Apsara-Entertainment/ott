import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "../ui/drawer";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "sonner";

type ImageFormData = {
  imageFile: FileList;
}

export default function ImageUploader({ setimageUrlFunc }: { setimageUrlFunc: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ImageFormData>();

  useEffect(() => {
    if (!isDrawerOpen) {
      reset(); // Reset form when drawer is closed
      setUploadProgress(0);
      setUploading(false);
    }
  }, [isDrawerOpen, reset]);

  const uploadImage = async (imageFile: File) => {
    setUploading(true);
    setUploadProgress(0);
    const response = await fetch('/api/get-signed-url/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: imageFile.name,
        fileType: imageFile.type,
      }),
    });
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    const data = await response.json();
    const s3Response = await axios.put(data.url, imageFile, {
      headers: {
        'Content-Type': imageFile.type, // Set the correct MIME type for S3
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const total = progressEvent.total || 0;
          const percentComplete = Math.round((progressEvent.loaded / total) * 100);
          setUploadProgress(percentComplete); // Update the progress state
        }
      },
    });
    if (s3Response.status === 200) {
      setimageUrlFunc(data.filePath);
      toast.success("Image uploaded successfully");
      setTimeout(() => {
        setIsDrawerOpen(false);
      }, 500);
    }
    else {
      console.log("Error uploading image");
      toast.error("Failed to upload image");
    }
  }

  const onSubmit = async (data: ImageFormData) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      await uploadImage(data.imageFile[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  }

  const watchImageFileAndProgress = () => {
    const imageFile = watch('imageFile');
    if (imageFile && imageFile.length > 0) {
      return (
        <div className="flex flex-col items-center">
          <div className="text-muted-foreground">
            File: {imageFile[0]?.name}
          </div >
          <div className="text-muted-foreground">
            {uploading === true && (
              <>Uploading: {uploadProgress}%</>
            ) || (
                <>Ready to upload!</>
              )}
          </div>
        </div>
      )
    }
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-sky-800 hover:bg-sky-700 cursor-pointer">
          Upload
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col items-center">
        <div
          className="absolute top-0 left-0 h-full bg-green-100 z-10"
          style={{ width: uploadProgress >= 0 ? `${uploadProgress}%` : '0%' }}
        />
        <div className="z-20">
          <DrawerHeader>
            <DrawerTitle>Upload Image</DrawerTitle>
            {/* <DrawerDescription>
            Upload an image
          </DrawerDescription> */}
          </DrawerHeader>
          <form className="flex flex-col gap-4 items-center" id="image-upload-form">
            <input type="file" accept="image/*"
              id="imageFile"
              className="hidden"
              {...register('imageFile', { required: "Image is required", })}
            />
            <label htmlFor="imageFile"
              className={
                "border-dashed border-2 w-64 h-64 flex flex-col items-center justify-center cursor-pointer"
                + (errors.imageFile ? " border-red-500" : "")
              }
            >
              <Upload className="size-20" />
            </label>
            {watchImageFileAndProgress()}
            {/* {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="w-64" />
          )}
          <Progress value={80} className="w-64 border" /> */}
            <Button type="button" form="image-upload-form"
              onClick={handleSubmit(onSubmit)}
              className="bg-sky-800 hover:bg-sky-700 cursor-pointer w-64"
            >
              Upload
            </Button>
          </form>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="cursor-pointer w-64">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer >
  )
}
