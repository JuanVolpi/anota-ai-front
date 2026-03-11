import { useState } from 'react';
import { Button } from '@heroui/button';
import { RefreshCw, Plus } from 'lucide-react';
import { TopicGrid } from '@/components/topics/TopicGrid';
import { CreateTopicModal } from '@/components/topics/CreateTopicModal';
import type { Topic } from '@/types/topicTypes';

export function TopicsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCreated(_topic: Topic) {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
        <div>
          <h2 className="text-2xl font-bold">Meus Tópicos</h2>
          <p className="text-sm text-default-400">Organize seu conhecimento em tópicos</p>
        </div>
        <div className="flex gap-2">
          <Button
            isIconOnly
            variant="flat"
            onPress={() => setRefreshKey((k) => k + 1)}
          >
            <RefreshCw size={16} />
          </Button>
          <Button
            color="primary"
            startContent={<Plus size={16} />}
            onPress={() => setIsModalOpen(true)}
          >
            Novo Tópico
          </Button>
        </div>
      </div>

      <TopicGrid key={refreshKey} />

      <CreateTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}