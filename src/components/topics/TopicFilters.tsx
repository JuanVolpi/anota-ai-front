import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Chip } from '@heroui/chip';
import { Search, BookOpen, Archive } from 'lucide-react';

interface Props {
    search: string;
    onSearchChange: (v: string) => void;
    sort: 'recent' | 'oldest' | 'alpha';
    onSortChange: (v: 'recent' | 'oldest' | 'alpha') => void;
    showArchived: boolean;
    onShowArchivedChange: (v: boolean) => void;
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (v: string | null) => void;
}

export function TopicFilters({
    search, onSearchChange,
    sort, onSortChange,
    showArchived, onShowArchivedChange,
    categories, selectedCategory, onCategoryChange,
}: Props) {
    return (
        <div className="flex flex-col gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onShowArchivedChange(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!showArchived ? 'bg-primary/10 text-primary' : 'text-default-400 hover:text-foreground hover:bg-default-100'}`}
                >
                    <BookOpen size={14} />
                    Ativos
                </button>
                <button
                    onClick={() => onShowArchivedChange(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${showArchived ? 'bg-warning/10 text-warning' : 'text-default-400 hover:text-foreground hover:bg-default-100'}`}
                >
                    <Archive size={14} />
                    Arquivados
                </button>
            </div>

            {/* Categorias */}
            {categories.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-default-400">Categoria:</span>
                    {categories.map((cat) => (
                        <Chip
                            key={cat}
                            size="sm"
                            variant={selectedCategory === cat ? 'solid' : 'flat'}
                            color={selectedCategory === cat ? 'primary' : 'default'}
                            className="cursor-pointer"
                            onClick={() => onCategoryChange(selectedCategory === cat ? null : cat)}
                        >
                            {cat}
                        </Chip>
                    ))}
                </div>
            )}

            {/* Search + Sort */}
            <div className="flex gap-3 justify-center mt-2">
                <Input
                    placeholder="Filtrar por nome..."
                    value={search}
                    onValueChange={onSearchChange}
                    startContent={<Search size={16} className="text-default-400" />}
                    className="flex-1 max-w-3/5"
                    size="sm"
                />
                <Select
                    selectedKeys={[sort]}
                    onSelectionChange={(keys) => onSortChange([...keys][0] as typeof sort)}
                    className="w-48"
                    size="sm"
                >
                    <SelectItem key="recent">Mais recentes</SelectItem>
                    <SelectItem key="oldest">Mais antigos</SelectItem>
                    <SelectItem key="alpha">A-Z</SelectItem>
                </Select>
            </div>
        </div>
    );
}