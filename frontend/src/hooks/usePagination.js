import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const usePagination = (initialPerPage = 12) => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get initial values from URL or defaults
    const [currentPage, setCurrentPage] = useState(() => {
        return parseInt(searchParams.get('page')) || 1;
    });
    
    const [perPage, setPerPage] = useState(() => {
        return parseInt(searchParams.get('per_page')) || initialPerPage;
    });

    const [paginationData, setPaginationData] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: initialPerPage,
        from: 0,
        to: 0
    });

    // Update URL when pagination changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        
        if (currentPage > 1) {
            params.set('page', currentPage.toString());
        } else {
            params.delete('page');
        }
        
        if (perPage !== initialPerPage) {
            params.set('per_page', perPage.toString());
        } else {
            params.delete('per_page');
        }
        
        setSearchParams(params, { replace: true });
    }, [currentPage, perPage, searchParams, setSearchParams, initialPerPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= paginationData.last_page) {
            setCurrentPage(page);
        }
    };

    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page when changing per page
    };

    const updatePaginationData = (data) => {
        setPaginationData(data);
        // Update current page if it's out of bounds
        if (data.current_page !== currentPage) {
            setCurrentPage(data.current_page);
        }
    };

    const getPaginationParams = () => {
        return {
            page: currentPage,
            per_page: perPage
        };
    };

    const reset = () => {
        setCurrentPage(1);
        setPerPage(initialPerPage);
    };

    return {
        currentPage,
        perPage,
        paginationData,
        handlePageChange,
        handlePerPageChange,
        updatePaginationData,
        getPaginationParams,
        reset
    };
};

export default usePagination;