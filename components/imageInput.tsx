"use client";
import { Fragment, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CloudUpload } from "lucide-react";
import { toast } from "sonner";

interface FileWithPreview extends File {
  preview: string;
}

interface ImageInputProps {
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  onChange?: (files: File[]) => void;
}

const ImageInput = ({ multiple = false, maxFiles = 5, maxSize = 10 * 1024 * 1024, onChange }: ImageInputProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      'image/*': [] // Hanya menerima file gambar
    },
    maxSize: maxSize, // Ukuran maksimal file (10MB)
    multiple: multiple,
    onDrop: (acceptedFiles) => {
      // Jika jumlah file yang ada + file baru melebihi maxFiles
      if (files.length + acceptedFiles.length > maxFiles) {
        // Tampilkan toast error
        toast.error(`Maksimal hanya ${maxFiles} gambar yang diizinkan`);
        
        // Jika masih ada slot tersisa, ambil hanya yang diizinkan
        if (files.length < maxFiles) {
          const remainingSlots = maxFiles - files.length;
          const allowedNewFiles = acceptedFiles.slice(0, remainingSlots);
          
          const newFiles = [...files, ...allowedNewFiles.map(file => 
            Object.assign(file, { preview: URL.createObjectURL(file) })
          )];
          
          setFiles(newFiles);
          if (onChange) onChange(newFiles);
          
          // Tampilkan toast informasi
          toast.info(`Only ${remainingSlots} images added, ${acceptedFiles.length - remainingSlots} images cancelled`);
        }
      } else {
        // Jika jumlah file masih dalam batas yang diizinkan
        const newFiles = [...files, ...acceptedFiles.map(file => 
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )];
        
        setFiles(newFiles);
        if (onChange) onChange(newFiles);
      }
    },
  });

  // Membersihkan URL objek saat komponen unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  const renderFilePreview = (file: FileWithPreview) => {
    return (
      <Image
        width={48}
        height={48}
        alt={file.name}
        src={file.preview}
        className="rounded border p-0.5 max-w-[48px] max-h-[48px]"
      />
    );
  };

  const handleRemoveFile = (file: FileWithPreview) => {
    const filtered = files.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
    if (onChange) onChange([...filtered]);
    
    // Membersihkan URL objek
    URL.revokeObjectURL(file.preview);
  };

  const fileList = files.map((file) => (
    <div
      key={file.name}
      className="flex justify-between border px-3.5 py-3 my-6 rounded-md"
    >
      <div className="flex gap-3 items-center">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <div className="text-sm text-card-foreground">{file.name}</div>
          <div className="text-xs font-light text-muted-foreground">
            {Math.round(file.size / 100) / 10 > 1000 ? (
              <>{(Math.round(file.size / 100) / 10000).toFixed(1)} MB</>
            ) : (
              <>{(Math.round(file.size / 100) / 10).toFixed(1)} KB</>
            )}
          </div>
        </div>
      </div>

      <Button
        size="icon"
        color="destructive"
        variant="outline"
        className="border-none rounded-full"
        onClick={() => handleRemoveFile(file)}
      >
        <Icon icon="tabler:x" className="h-5 w-5" />
      </Button>
    </div>
  ));

  const handleRemoveAllFiles = () => {
    // Membersihkan URL objek
    files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    
    setFiles([]);
    if (onChange) onChange([]);
    toast.success("Semua gambar telah dihapus");
  };

  return (
    <Fragment>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="w-full text-center border-dashed border border-default-200 dark:border-default-300 rounded-md py-[52px] flex items-center flex-col">
          <CloudUpload className="text-default-300 w-10 h-10" />
          <h4 className="text-2xl font-medium mb-1 mt-3 text-card-foreground/80">
            {multiple ? 'Drop image here or click to upload' : 'Drop image here or click to upload'}
          </h4>
          <div className="text-xs text-muted-foreground">
            (Only image files, max {maxFiles} files, {maxSize / (1024 * 1024)}MB per file)
          </div>
        </div>
      </div>
      
      {fileRejections.length > 0 && (
        <div className="text-destructive text-sm mt-2">
          {fileRejections.map(({ file, errors }) => {
            // Tampilkan toast untuk setiap file yang ditolak
            const errorMessages = errors.map(e => e.message).join(", ");
            toast.error(`File "${file.name}" ditolak: ${errorMessages}`);
            
            return (
              <div key={file.name}>
                {errors.map(error => (
                  <p key={error.code}>{error.message}</p>
                ))}
              </div>
            );
          })}
        </div>
      )}
      
      {files.length > 0 && (
        <Fragment>
          <div>{fileList}</div>
          <div className="flex justify-end gap-2">
            <Button color="destructive" onClick={handleRemoveAllFiles}>
              Hapus Semua Gambar
            </Button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ImageInput;

