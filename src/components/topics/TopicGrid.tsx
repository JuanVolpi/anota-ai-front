// src/components/topics/TopicGrid.tsx
import { useEffect, useState } from 'react';
import { Spinner } from '@heroui/spinner';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Pagination } from '@heroui/pagination';
import { addToast } from '@heroui/toast';
import { Search } from 'lucide-react';
import { TopicCard } from './TopicCard';
import { EditTopicModal } from './EditTopicModal';
import { DeleteTopicModal } from './DeleteTopicModal';
import { InviteMemberModal } from './InviteMemberModal';
import { topicService } from '@/services/topicServices';
import { useAuth } from '@/contexts/AuthContext';
import type { Topic } from '@/types/topicTypes';
import { useNavigate } from 'react-router-dom';

export function TopicGrid() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'recent' | 'oldest' | 'alpha'>('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [deleteTopic, setDeleteTopic] = useState<Topic | null>(null);
  const [inviteTopic, setInviteTopic] = useState<Topic | null>(null);

  useEffect(() => {
    load(page);
  }, [page]);

  async function load(p: number) {
    try {
      setIsLoading(true);
      const result = await topicService.getAll(p, LIMIT);
      setTopics(Array.isArray(result.data) ? result.data : []);
      setTotalPages(result.total_pages ?? 1);
      setTotal(result.total ?? 0);
    } catch {
      addToast({ title: 'Erro ao carregar tópicos', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = topics
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.title.localeCompare(b.title);
    });

  function handleUpdated(updated: Topic) {
    setTopics((prev) => prev.map((t) => t.id === updated.id ? updated : t));
  }

  function handleDeleted(id: string) {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  }

  if (isLoading) {
    return <div className="flex flex-1 items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto flex-1">
      {/* Filters */}
      <div className="flex gap-3 my-2 justify-center">
        <Input
          placeholder="Filtrar por nome..."
          value={search}
          onValueChange={setSearch}
          startContent={<Search size={16} className="text-default-400" />}
          className="flex-1 max-w-3/5"
        />
        <Select
          selectedKeys={[sort]}
          onSelectionChange={(keys) => setSort([...keys][0] as typeof sort)}
          className="w-48"
        >
          <SelectItem key="recent">Mais recentes</SelectItem>
          <SelectItem key="oldest">Mais antigos</SelectItem>
          <SelectItem key="alpha">A-Z</SelectItem>
        </Select>
      </div>

      {/* Total */}
      <p className="text-xs text-default-400">{total} tópico{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-default-400">Nenhum tópico encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isOwner={topic.owner_id === user?.user_id}
              onSelect={(id) => navigate(`/topics/${id}`)}
              onEdit={(t) => setEditTopic(t)}
              onDelete={(t) => setDeleteTopic(t)}
              onInvite={(topic) => setInviteTopic(topic)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            total={totalPages}
            page={page}
            onChange={(p) => { setPage(p); window.scrollTo(0, 0); }}
            showControls
            color="primary"
            variant="flat"
          />
        </div>
      )}

      <EditTopicModal
        topic={editTopic}
        isOpen={!!editTopic}
        onClose={() => setEditTopic(null)}
        onUpdated={handleUpdated}
      />
      <DeleteTopicModal
        topic={deleteTopic}
        isOpen={!!deleteTopic}
        onClose={() => setDeleteTopic(null)}
        onDeleted={handleDeleted}
      />
      <InviteMemberModal
        isOpen={!!inviteTopic}
        topicId={inviteTopic?.id ?? ''}
        onClose={() => setInviteTopic(null)}
        onInvited={() => setInviteTopic(null)}
      />
    </div>
  );
}