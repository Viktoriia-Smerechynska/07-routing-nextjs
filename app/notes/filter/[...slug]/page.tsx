// src/app/notes/filter/[...slug]/page.tsx
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const queryClient = new QueryClient();
  const resolvedParams = await params;

  const tagFromUrl = resolvedParams.slug?.[0] || 'all';

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tagFromUrl],
    queryFn: () => fetchNotes(1, '', tagFromUrl),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tagFromUrl} />
    </HydrationBoundary>
  );
}
