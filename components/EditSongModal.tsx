"use client";

import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import useEditSongModal from '@/hooks/useEditSongModal';
import { GENRE_NAMES } from '@/constants/genres';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

interface FormData {
  title: string;
  author: string;
  genre: string;
}

const EditSongModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const editSongModal = useEditSongModal();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      author: '',
      genre: '',
    }
  });

  const selectedGenre = watch('genre');

  // Cập nhật form khi song thay đổi
  useEffect(() => {
    if (editSongModal.song) {
      setValue('title', editSongModal.song.title || '');
      setValue('author', editSongModal.song.author || '');
      setValue('genre', editSongModal.song.genre || '');
    }
  }, [editSongModal.song, setValue]);

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      editSongModal.onClose();
    }
  }

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);

      if (!editSongModal.song) {
        toast.error('No song selected');
        return;
      }

      // Cập nhật bài hát
      const { error } = await supabaseClient
        .from('songs')
        .update({
          title: values.title,
          author: values.author,
          genre: values.genre || null,
        })
        .eq('id', editSongModal.song.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      router.refresh();
      toast.success('Song updated!');
      reset();
      editSongModal.onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Edit song"
      description="Update song information"
      isOpen={editSongModal.isOpen}
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
        
        {/* Genre Selection */}
        <div>
          <div className="pb-1 text-sm text-neutral-400">
            Select genre
          </div>
          <select
            id="genre"
            disabled={isLoading}
            {...register('genre')}
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

        {/* Custom genre input nếu chọn Other */}
        {selectedGenre === 'Other' && (
          <Input
            id="customGenre"
            disabled={isLoading}
            placeholder="Enter custom genre"
            onChange={(e) => setValue('genre', e.target.value)}
          />
        )}

        <div className="flex gap-x-4">
          <Button 
            disabled={isLoading} 
            type="button"
            onClick={() => editSongModal.onClose()}
            className="bg-neutral-700 hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditSongModal;
