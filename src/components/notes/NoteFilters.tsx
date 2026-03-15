import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Search } from 'lucide-react';

interface Props {
    search: string;
    onSearchChange: (v: string) => void;
    sort: 'recent' | 'oldest' | 'top';
    onSortChange: (v: 'recent' | 'oldest' | 'top') => void;
}

export function NoteFilters({ search, onSearchChange, sort, onSortChange }: Props) {
    return (
        <div className="flex gap-3 px-4 md:px-6 py-3 shrink-0 justify-center">
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
                className="w-36 md:w-48"
                size="sm"
            >
                <SelectItem key="recent">Mais recentes</SelectItem>
                <SelectItem key="oldest">Mais antigos</SelectItem>
                <SelectItem key="top">Mais votados</SelectItem>
            </Select>
        </div>
    );
}