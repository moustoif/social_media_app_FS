"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import "./styles.css"
import { useSubmitPostMutation } from "./mutations";
import LoadingButton from "@/components/LoadingButton";

export default function PostEditor() {
  const { user } = useSession();

  const mutation = useSubmitPostMutation();

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
    mutation.mutate(input, {
      onSuccess: () => {
        editor?.commands.clearContent();
      },
    });
  }

  return (
    <div className="2xl flex flex-col gap-5 rounded bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar
          avatarUrl={user.profilePicture}
          className="hidden sm:inline"
        />
        <EditorContent 
        editor={editor}
        className=" w-full max-h-[20rem] overflow-y-auto bg-background rounded-2xl px-5 py-5"
        style={{ borderColor: 'transparent' }}
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton 
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20" 
          loading={mutation.isPending}        
        >
            Post
        </LoadingButton>
      </div>
    </div>
  );
}
