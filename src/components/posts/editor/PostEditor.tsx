/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import "./styles.css"
import { useSubmitPostMutation } from "./mutations";
import LoadingButton from "@/components/LoadingButton";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import { ClipboardEvent, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { root } from "postcss";

export default function PostEditor() {
  const { user } = useSession();

  const mutation = useSubmitPostMutation();

  const { 
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: startUpload
  })

  const {onClick, ...rootProps} = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's up ?",
      }),
    ],
    immediatelyRender: false, // Ajout pour éviter les erreurs d'hydratation
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    const data = {
      content: input,
      mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
    };
    
    mutation.mutate( data,{
      onSuccess: () => {
        editor?.commands.clearContent();
        resetMediaUploads();
      },
    });
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  }

  return (
    <div className="2xl flex flex-col gap-5 rounded bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar
          profilePicture={user.profilePicture}
          className="hidden sm:inline"
        />
        <div {...rootProps} className="w-full">
          <EditorContent 
            editor={editor}
            className={cn( 
              "w-full max-h-[20rem] overflow-y-auto bg-background rounded-2xl px-5 py-5", 
              isDragActive && "outline-dashed",
            )}
            onPaste={onPaste}
            style={{ borderColor: 'transparent' }}
          />
          <input {...getInputProps()} />
        </div>
      </div>
        {!!attachments.length && (
          <AttachmentPreviews 
            attachments={attachments}
            removeAttachment={removeAttachment}
          />
        )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary"/>
          </>
        )}
        <AddAttachmentsButton 
          onFilesSelected={startUpload} 
          disabled={isUploading || attachments.length >= 5} 
        />
        <LoadingButton 
          onClick={onSubmit}
          disabled={!input.trim() || isUploading}
          className="min-w-20" 
          loading={mutation.isPending}        
        >
            Post
        </LoadingButton>
      </div>
    </div>
  );
}

interface AddAttachmentsButtonProps {
  onFilesSelected : (files: File[]) => void,
  disabled : boolean;
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled,
} : AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button  
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input 
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />  
    </>
  );
}

interface AttachmentPreviewsProps {
  attachments : Attachment[];
  removeAttachment: (fileName: string) => void;
}

function AttachmentPreviews({
    attachments, removeAttachment
} : AttachmentPreviewsProps) {
  return (
  <div className={cn("flex flex-col gap-3", attachments.length > 1 && "sm:grid-cols-2",
  )}>
  {attachments.map(attachment => (
      <AttachmentPreview
        key={attachment.file.name}
        attachment={attachment}
        onRemoveClick={() => removeAttachment(attachment.file.name)}
      />
  ))}
  </div>
  );
}

interface AttachmentPreviewProps {
  attachment : Attachment,
  onRemoveClick : () => void;
}

function AttachmentPreview({
    attachment: {file, mediaId, isUploading},
    onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max h-[30rem] rounded 2xl"
        />
      ) : (
        <video controls className="size-fit max-h[30rem] rounded-2xl">
            <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-5 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}