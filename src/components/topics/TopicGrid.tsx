// src/components/topics/TopicGrid.tsx
import { useState } from 'react';
import { Spinner } from '@heroui/spinner';
import { Pagination } from '@heroui/pagination';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTopics } from '@/hooks/useTopics';
import { TopicCard } from './TopicCard';
import { TopicFilters } from './TopicFilters';
import { TopicEmptyState } from './TopicEmptyState';
import { EditTopicModal } from './EditTopicModal';
import { DeleteTopicModal } from './DeleteTopicModal';
import { InviteMemberModal } from './InviteMemberModal';
import type { Topic } from '@/types/topicTypes';
import { TopicCardSkeleton } from './TopicCardSkeleton';

export function TopicGrid() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    topics, isLoading, page, totalPages, total,
    showArchived, setShowArchived, setPage,
    archive, restore, updateTopic, removeTopic,
  } = useTopics();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'recent' | 'oldest' | 'alpha'>('recent');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [deleteTopic, setDeleteTopic] = useState<Topic | null>(null);
  const [inviteTopic, setInviteTopic] = useState<Topic | null>(null);

  const allCategories = [...new Set(topics.flatMap((t) => t.categories ?? []))];

  const filtered = topics
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => !selectedCategory || (t.categories ?? []).includes(selectedCategory))
    .sort((a, b) => {
      if (sort === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto flex-1">
      <TopicFilters
        search={search} onSearchChange={setSearch}
        sort={sort} onSortChange={setSort}
        showArchived={showArchived}
        onShowArchivedChange={(v) => { setShowArchived(v); setPage(1); setSelectedCategory(null); }}
        categories={allCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <TopicCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <TopicEmptyState showArchived={showArchived} search={search} selectedCategory={selectedCategory} />
      ) : (
        <>
          <p className="text-xs text-default-400">{total} tópico{total !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isOwner={topic.owner_id === user?.user_id}
                onSelect={(id) => navigate(`/topics/${id}`)}
                onEdit={setEditTopic}
                onDelete={setDeleteTopic}
                onInvite={setInviteTopic}
                onArchive={archive}
                onRestore={restore}
              />
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination total={totalPages} page={page} onChange={setPage} showControls color="primary" variant="flat" />
        </div>
      )}

      <EditTopicModal topic={editTopic} isOpen={!!editTopic} onClose={() => setEditTopic(null)} onUpdated={updateTopic} />
      <DeleteTopicModal topic={deleteTopic} isOpen={!!deleteTopic} onClose={() => setDeleteTopic(null)} onDeleted={removeTopic} />
      <InviteMemberModal isOpen={!!inviteTopic} topicId={inviteTopic?.id ?? ''} onClose={() => setInviteTopic(null)} onInvited={() => setInviteTopic(null)} />
    </div>
  );
}