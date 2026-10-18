// app/notes/filter/[...slug]/Notes.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from '../../../Home.module.css';

import { fetchNotes } from '@/lib/api';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setPage(1);
  }, [tag]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['notes', page, '', tag],
    queryFn: () => fetchNotes(page, '', tag),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const handlePageChange = (selectedItem: { selected: number }): void => {
    setPage(selectedItem.selected + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app || ''} style={{ padding: '0rem' }}>
      <header
        className={css.toolbar}
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!isLoading && !isError && totalPages > 1 ? (
          <Pagination pageCount={totalPages} forcePage={page - 1} onPageChange={handlePageChange} />
        ) : (
          <div />
        )}

        <button className={css.button || ''} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main className={css.content}>
        {isLoading && <Loader />}

        {isError && !isLoading && <ErrorMessage />}

        {!isLoading && !isError && notes.length > 0 && (
          <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <NoteList notes={notes} />
          </div>
        )}

        {!isLoading && !isError && notes.length === 0 && (
          <p style={{ color: '#aaa', textAlign: 'center', fontSize: '16px', marginTop: '40px' }}>
            No notes found in this category.
          </p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
