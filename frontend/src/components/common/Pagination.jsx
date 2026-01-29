import Button from './Button';
import env from '../../config/env';

const Pagination = ({ 
    currentPage, 
    lastPage, 
    total, 
    perPage, 
    onPageChange, 
    onPerPageChange,
    loading = false 
}) => {
    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Show max 5 page numbers
        
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(lastPage, start + maxVisible - 1);
        
        // Adjust start if we're near the end
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    // Get per-page options based on current perPage value
    const getPerPageOptions = () => {
        const baseOptions = [6, 9, 12, 24, 48];
        const maxPerPage = env.PAGINATION_MAX_PER_PAGE;
        
        // Filter options that are within the max limit
        let options = baseOptions.filter(option => option <= maxPerPage);
        
        // Add current perPage if it's not in the list
        if (!options.includes(perPage) && perPage <= maxPerPage) {
            options.push(perPage);
            options.sort((a, b) => a - b);
        }
        
        return options;
    };

    const pageNumbers = getPageNumbers();
    const perPageOptions = getPerPageOptions();
    const showingFrom = (currentPage - 1) * perPage + 1;
    const showingTo = Math.min(currentPage * perPage, total);

    if (lastPage <= 1 && total <= perPage) return null; // Don't show pagination if only 1 page

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            {/* Results info */}
            <div className="text-sm text-slate-600">
                Showing <span className="font-medium">{showingFrom}</span> to{' '}
                <span className="font-medium">{showingTo}</span> of{' '}
                <span className="font-medium">{total}</span> results
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* Per page selector */}
                <div className="flex items-center gap-2 mr-4">
                    <span className="text-sm text-slate-600">Show:</span>
                    <select
                        value={perPage}
                        onChange={(e) => onPerPageChange(Number(e.target.value))}
                        className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                    >
                        {perPageOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                {/* Previous button */}
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="flex items-center"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </Button>

                {/* First page */}
                {pageNumbers[0] > 1 && (
                    <>
                        <Button
                            variant={1 === currentPage ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => onPageChange(1)}
                            disabled={loading}
                        >
                            1
                        </Button>
                        {pageNumbers[0] > 2 && (
                            <span className="px-2 text-slate-400">...</span>
                        )}
                    </>
                )}

                {/* Page numbers */}
                {pageNumbers.map((page) => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        disabled={loading}
                        className="min-w-[40px]"
                    >
                        {page}
                    </Button>
                ))}

                {/* Last page */}
                {pageNumbers[pageNumbers.length - 1] < lastPage && (
                    <>
                        {pageNumbers[pageNumbers.length - 1] < lastPage - 1 && (
                            <span className="px-2 text-slate-400">...</span>
                        )}
                        <Button
                            variant={lastPage === currentPage ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => onPageChange(lastPage)}
                            disabled={loading}
                        >
                            {lastPage}
                        </Button>
                    </>
                )}

                {/* Next button */}
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage || loading}
                    className="flex items-center"
                >
                    Next
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </Button>
            </div>
        </div>
    );
};

export default Pagination;