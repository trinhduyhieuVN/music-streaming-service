"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import uniqid from "uniqid";

import { useUser } from "@/hooks/useUser";
import usePlaylistModal from "@/hooks/usePlaylistModal";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

const PlaylistModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const playlistModal = usePlaylistModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      description: '',
    }
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      playlistModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      if (!user) {
        toast.error('Please login first');
        return;
      }

      const { error } = await supabaseClient
        .from('playlists')
        .insert({
          user_id: user.id,
          name: values.name,
          description: values.description,
          is_public: true,
        });

      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Playlist created!');
      reset();
      playlistModal.onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create a playlist"
      description="Create a new playlist to organize your music"
      isOpen={playlistModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="name"
          disabled={isLoading}
          {...register('name', { required: true })}
          placeholder="Playlist name"
        />
        <Input
          id="description"
          disabled={isLoading}
          {...register('description', { required: false })}
          placeholder="Description (optional)"
        />
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default PlaylistModal;
