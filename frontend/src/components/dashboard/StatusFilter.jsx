import { useState } from 'react';
import Button from '../common/Button';

const StatusFilter = ({ activeFilter, onFilterChange, counts = {} }) => {
    const filters = [
        { key: 'all', label: 'All Posts', count: counts.all || 0 },
        { key: 'published', label: 'Published', count: counts.published || 0 },
        { key: 'draft', label: 'Drafts', count: counts.draft || 0 },
        { key: 'scheduled', label: 'Scheduled', count: counts.scheduled || 0 },
    ];

    return (
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <Button
                        key={filter.key}
                        variant={activeFilter === filter.key ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => onFilterChange(filter.key)}
                        className="flex items-center gap-2"
                    >
                        <span>{filter.label}</span>
                        {filter.count > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                activeFilter === filter.key 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-slate-100 text-slate-600'
                            }`}>
                                {filter.count}
                            </span>
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default StatusFilter;