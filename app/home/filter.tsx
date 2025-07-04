import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import React, { useState, useEffect } from 'react';

type Props = {
    onSearchSortChange: (params: { keyword: string; sortBy: string; order: string }) => void;
};

const SearchSort: React.FC<Props> = ({ onSearchSortChange }) => {
    const [keyword, setKeyword] = useState('');
    const [sortBy, setSortBy] = useState<'createdAt' | 'votes'>('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        const timeout = setTimeout(() => {
            onSearchSortChange({ keyword, sortBy, order });
        }, 300);

        return () => clearTimeout(timeout);
    }, [keyword, sortBy, order]);

    return (
        <div className="flex gap-3 mb-4 items-center">
            <Input
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="border px-3 py-1 rounded w-42"
            />

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'createdAt' | 'votes')}>
                <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdAt">Date</SelectItem>
                    <SelectItem value="votes">Votes</SelectItem>
                </SelectContent>
            </Select>

            <Select value={order} onValueChange={(value) => setOrder(value as 'asc' | 'desc')}>
                <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default SearchSort;
