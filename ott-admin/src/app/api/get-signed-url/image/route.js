import { NextResponse } from "next/server";
import s3 from "@s3/s3Client";

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "Missing fileName or fileType" },
        { status: 400 }
      );
    }

    const filePath = `images/${Date.now()}-${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filePath,
      Expires: 300, // URL expires in 5 minutes
      ContentType: fileType,
      ACL: "public-read", // Adjust permissions as needed
    };

    const signedUrl = await s3.getSignedUrlPromise("putObject", s3Params);

    return NextResponse.json({ filePath: filePath, url: signedUrl }, { status: 200 });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
