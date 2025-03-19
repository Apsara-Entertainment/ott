import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "../ui/drawer";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "sonner";

type VideoFormData = {
  videoFile: FileList;
}

export default function VideoUploader({ setVideoUrlFunc }: { setVideoUrlFunc: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<VideoFormData>();

  useEffect(() => {
    if (!isDrawerOpen) {
      reset(); // Reset form when drawer is closed
      setUploadProgress(0);
      setUploading(false);
    }
  }, [isDrawerOpen, reset]);

  const uploadVideo = async (videoFile: File) => {
    setUploading(true);
    setUploadProgress(0);
    const response = await fetch('/api/get-signed-url/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: videoFile.name,
        fileType: videoFile.type,
      }),
    });
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    const data = await response.json();
    const s3Response = await axios.put(data.url, videoFile, {
      headers: {
        'Content-Type': videoFile.type, // Set the correct MIME type for S3
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
      setVideoUrlFunc(data.filePath);
      toast.success("Video uploaded successfully");
      setTimeout(() => {
        setIsDrawerOpen(false);
      }, 500);
    }
    else {
      console.log("Error uploading video");
      toast.error("Failed to upload video");
    }
  }

  const onSubmit = async (data: VideoFormData) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      await uploadVideo(data.videoFile[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  }

  const watchVideoFileAndProgress = () => {
    const videoFile = watch('videoFile');
    if (videoFile && videoFile.length > 0) {
      return (
        <div className="flex flex-col items-center">
          <div className="text-muted-foreground">
            File: {videoFile[0]?.name}
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
            <DrawerTitle>Upload Video</DrawerTitle>
            {/* <DrawerDescription>
            Upload a video
          </DrawerDescription> */}
          </DrawerHeader>
          <form className="flex flex-col gap-4 items-center" id="video-upload-form">
            <input type="file" accept="video/*"
              id="videoFile"
              className="hidden"
              {...register('videoFile', { required: "Video is required", })}
            />
            <label htmlFor="videoFile"
              className={
                "border-dashed border-2 w-64 h-64 flex flex-col items-center justify-center cursor-pointer"
                + (errors.videoFile ? " border-red-500" : "")
              }
            >
              <Upload className="size-20" />
            </label>
            {watchVideoFileAndProgress()}
            {/* {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="w-64" />
          )}
          <Progress value={80} className="w-64 border" /> */}
            <Button type="button" form="video-upload-form"
              onClick={handleSubmit(onSubmit)}
              className="bg-sky-800 hover:bg-sky-700 cursor-pointer w-64"
            >
              Upload
            </Button>
          </form>
          <DrawerFooter className="flex w-full items-center">
            <DrawerClose asChild>
              <Button variant="outline" className="cursor-pointer w-64">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer >
  )
}
