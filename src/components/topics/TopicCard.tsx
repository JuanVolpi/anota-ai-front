// src/components/topics/TopicCard.tsx
import { Chip } from '@heroui/chip';
import { BookOpen, Lock, Clock, MoreVertical, Pencil, Trash2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from '@heroui/dropdown';
import type { Topic } from '@/types/topicTypes';

interface TopicCardProps {
  topic: Topic;
  isOwner: boolean;
  onSelect: (id: string) => void;
  onEdit?: (topic: Topic) => void;
  onDelete?: (topic: Topic) => void;
  onInvite?: (topic: Topic) => void;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'hoje';
  if (days === 1) return 'há 1 dia';
  return `há ${days} dias`;
}

export function TopicCard({ topic, isOwner, onSelect, onEdit, onDelete, onInvite }: TopicCardProps) {
  const isPrivate = topic.visibility === 'private';
  const accentColor = isPrivate ? '#f5a524' : '#006FEE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(topic.id)}
      className="relative rounded-xl border border-divider bg-default-50 dark:bg-default-100/5 overflow-hidden cursor-pointer group"
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${accentColor}22, transparent)` }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: accentColor }}
      />

      <div className="flex flex-col gap-3 p-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2  max-w-full">
            <div className="p-1.5 rounded-md" style={{ background: `${accentColor}22` }}>
              {isPrivate
                ? <Lock size={15} style={{ color: accentColor }} />
                : <BookOpen size={15} style={{ color: accentColor }} />
              }
            </div>
            <p className="font-semibold text-sm line-clamp-1 truncate">{topic.title}</p>
          </div>

          {isOwner && (
            <Dropdown>
              <DropdownTrigger>
                <button
                  className="text-default-300 hover:text-default-600 transition-colors cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical size={15} />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Ações do tópico"
                onAction={(key) => {
                  if (key === 'edit') onEdit?.(topic);
                  if (key === 'delete') onDelete?.(topic);
                  if (key === 'invite') onInvite?.(topic);
                }}
              >
                <DropdownSection title="Ações">
                  <DropdownItem
                    key="edit"
                    startContent={<Pencil size={15} />}
                    description="Editar título e descrição"
                  >
                    Editar tópico
                  </DropdownItem>
                  {isPrivate ? (
                    <DropdownItem
                      key="invite"
                      startContent={<UserPlus size={15} />}
                      description="Convidar por ID público"
                    >
                      Convidar membro
                    </DropdownItem>
                  ) : null}
                </DropdownSection>

                <DropdownSection title="Zona de perigo">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<Trash2 size={15} />}
                    description="Esta ação é irreversível"
                  >
                    Deletar tópico
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>

        {topic.description && (
          <p className="text-xs text-default-400 line-clamp-1 leading-relaxed truncate max-w-full">
            {topic.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-xs text-default-400">
            <Clock size={11} />
            <span>{timeAgo(topic.created_at)}</span>
          </div>
          <Chip
            size="sm"
            variant="flat"
            style={isOwner ? { background: `${accentColor}22`, color: accentColor } : {}}
          >
            {isOwner ? 'Dono' : 'Membro'}
          </Chip>
        </div>
      </div>
    </motion.div>
  );
}