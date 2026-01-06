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

  const generateRandomColor = () => {
    const colors = [
      'from-red-500 to-pink-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-purple-500',
      'from-cyan-500 to-blue-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      if (!user) {
        toast.error('Please login first');
        return;
      }

      // Check for duplicate playlist name
      const { data: existingPlaylists, error: checkError } = await supabaseClient
        .from('playlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', values.name.trim());

      if (checkError) {
        setIsLoading(false);
        return toast.error('Error checking playlist name');
      }

      if (existingPlaylists && existingPlaylists.length > 0) {
        setIsLoading(false);
        return toast.error('You already have a playlist with this name');
      }

      const playlistData: any = {
        user_id: user.id,
        name: values.name.trim(),
        description: values.description?.trim() || null,
        is_public: true,
      };

      // Try to add color if column exists
      try {
        playlistData.color = generateRandomColor();
      } catch (e) {
        // Column doesn't exist yet, skip color
      }

      const { error } = await supabaseClient
        .from('playlists')
        .insert(playlistData);

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
