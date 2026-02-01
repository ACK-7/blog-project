const StatusBadge = ({ status, className = "" }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'published':
                return {
                    label: 'Published',
                    icon: '✓',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-200'
                };
            case 'draft':
                return {
                    label: 'Draft',
                    icon: '📝',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800',
                    borderColor: 'border-gray-200'
                };
            case 'scheduled':
                return {
                    label: 'Scheduled',
                    icon: '⏰',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-200'
                };
            default:
                return {
                    label: 'Unknown',
                    icon: '?',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800',
                    borderColor: 'border-gray-200'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}>
            <span className="mr-1">{config.icon}</span>
            {config.label}
        </span>
    );
};

export default StatusBadge;