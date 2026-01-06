"use client";

import uniqid from "uniqid";
import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from "@/hooks/useUser";
import { GENRE_NAMES } from '@/constants/genres';
import useIsAdmin from "@/hooks/useIsAdmin";

import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadModal = useUploadModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();
  const { isAdmin } = useIsAdmin();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      genre: '',
      song: null,
      image: null,
    }
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  }

  // Only admin can upload
  if (!isAdmin) {
    return (
      <Modal
        title="Access Denied"
        description="You don't have permission to upload songs."
        isOpen={uploadModal.isOpen}
        onChange={onChange}
      >
        <div className="text-center py-4">
          <p className="text-neutral-400">Only administrators can upload songs.</p>
        </div>
      </Modal>
    );
  }

  // Hàm tìm hoặc tạo artist mới
  const findOrCreateArtist = async (artistName: string): Promise<string | null> => {
    // Tìm artist đã tồn tại (không phân biệt hoa thường)
    const { data: existingArtist } = await supabaseClient
      .from('artists')
      .select('id')
      .ilike('name', artistName)
      .single();

    if (existingArtist) {
      return existingArtist.id;
    }

    // Tạo artist mới nếu chưa tồn tại
    const { data: newArtist, error } = await supabaseClient
      .from('artists')
      .insert({
        name: artistName,
        bio: `Artist profile for ${artistName}`,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating artist:', error);
      return null;
    }

    return newArtist?.id || null;
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields')
        return;
      }

      const uniqueID = uniqid();

      // Tìm hoặc tạo artist
      const artistId = await findOrCreateArtist(values.author);

      // Upload song
      const { 
        data: songData, 
        error: songError 
      } = await supabaseClient
        .storage
        .from('Songs')
        .upload(`song-${values.title}-${uniqueID}`, songFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (songError) {
        setIsLoading(false);
        return toast.error('Failed song upload');
      }

      // Upload image
      const { 
        data: imageData, 
        error: imageError
      } = await supabaseClient
        .storage
        .from('image')
        .upload(`image-${values.title}-${uniqueID}`, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (imageError) {
        setIsLoading(false);
        return toast.error('Failed image upload');
      }

      
      // Create record với artist_id và genre
      const { error: supabaseError } = await supabaseClient
        .from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path,
          artist_id: artistId,
          genre: values.genre || null,
          duration: 0,
          play_count: 0,
        });

      if (supabaseError) {
        return toast.error(supabaseError.message);
      }
      
      router.refresh();
      setIsLoading(false);
      toast.success(artistId ? 'Song created & Artist linked!' : 'Song created!');
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-y-4"
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Artist name"
        />
        <div>
          <div className="pb-1 text-sm text-neutral-400">
            Select genre
          </div>
          <select
            id="genre"
            disabled={isLoading}
            {...register('genre', { required: false })}
            className="
              flex 
              w-full 
              rounded-md 
              bg-neutral-700
              border
              border-transparent
              px-3 
              py-3 
              text-sm 
              text-white
              placeholder:text-neutral-400 
              disabled:cursor-not-allowed 
              disabled:opacity-50
              focus:outline-none
              focus:border-green-500
            "
          >
            <option value="">-- Select genre --</option>
            {GENRE_NAMES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="pb-1">
            Select a song file
          </div>
          <Input
            placeholder="test" 
            disabled={isLoading}
            type="file"
            accept=".mp3"
            id="song"
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">
            Select an image
          </div>
          <Input
            placeholder="test" 
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
}

export default UploadModal;