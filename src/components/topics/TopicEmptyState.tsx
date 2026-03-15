import { BookOpen, Archive } from 'lucide-react';

interface Props {
    showArchived: boolean;
    search: string;
    selectedCategory: string | null;
}

export function TopicEmptyState({ showArchived, search, selectedCategory }: Props) {
    const message = selectedCategory
        ? `Nenhum tópico na categoria "${selectedCategory}"`
        : search
            ? `Nenhum tópico corresponde ao filtro "${search}"`
            : showArchived
                ? 'Nenhum tópico arquivado'
                : 'Nenhum tópico criado ainda';

    return (
        <div className="flex flex-col flex-1 items-center justify-center gap-3 text-center py-12">
            <div className="p-4 rounded-full bg-default-100">
                {showArchived
                    ? <Archive size={24} className="text-default-400" />
                    : <BookOpen size={24} className="text-default-400" />
                }
            </div>
            <div>
                <p className="font-semibold text-default-600">Nenhum tópico encontrado</p>
                <p className="text-sm text-warning">{message}</p>
            </div>
        </div>
    );
}