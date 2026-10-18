'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import css from '../Home.module.css';

import { getNotes } from '@/lib/api';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

export default function NotesClient() {
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['notes', page, searchQuery],
    queryFn: () => getNotes(page, searchQuery),
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
    <div className={css.app || ''} style={{ padding: '2rem' }}>
      <header
        className={css.toolbar}
        style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}
      >
        <SearchBox value={inputValue} onChange={handleSearchChange} />

        {}
        {!isLoading && !isError && totalPages > 1 && (
          <Pagination pageCount={totalPages} forcePage={page - 1} onPageChange={handlePageChange} />
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

        {!isLoading && !isError && notes.length === 0 && searchQuery && (
          <p
            style={{
              color: '#aaa',
              textAlign: 'center',
              fontSize: '16px',
              marginTop: '40px',
            }}
          >
            No notes found matching your search.
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
