import Swal from 'sweetalert2';

// Custom SweetAlert configurations with modern styling
const swalConfig = {
    customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-2xl font-bold text-slate-800',
        content: 'text-slate-600',
        confirmButton: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105',
        cancelButton: 'bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 mr-3',
        denyButton: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105'
    },
    buttonsStyling: false,
    backdrop: 'rgba(0, 0, 0, 0.4)',
    allowOutsideClick: false,
    allowEscapeKey: true,
};

export const sweetAlert = {
    // Success alerts
    success: (title, text = '') => {
        return Swal.fire({
            ...swalConfig,
            icon: 'success',
            title,
            text,
            confirmButtonText: 'Great!',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: true,
        });
    },

    // Error alerts
    error: (title, text = '') => {
        return Swal.fire({
            ...swalConfig,
            icon: 'error',
            title,
            text,
            confirmButtonText: 'OK',
        });
    },

    // Warning alerts
    warning: (title, text = '') => {
        return Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title,
            text,
            confirmButtonText: 'OK',
        });
    },

    // Info alerts
    info: (title, text = '') => {
        return Swal.fire({
            ...swalConfig,
            icon: 'info',
            title,
            text,
            confirmButtonText: 'Got it!',
        });
    },

    // Confirmation dialogs
    confirm: (title, text = '', confirmText = 'Yes, do it!', cancelText = 'Cancel') => {
        return Swal.fire({
            ...swalConfig,
            icon: 'question',
            title,
            text,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true,
        });
    },

    // Delete confirmation (special styling)
    confirmDelete: (title = 'Delete this item?', text = 'This action cannot be undone!') => {
        return Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title,
            text,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                ...swalConfig.customClass,
                confirmButton: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105',
            }
        });
    },

    // Loading alerts
    loading: (title = 'Processing...', text = 'Please wait') => {
        return Swal.fire({
            ...swalConfig,
            title,
            text,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    },

    // Toast notifications (small, non-intrusive)
    toast: {
        success: (message) => {
            return Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: message,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    popup: 'rounded-xl shadow-lg',
                    title: 'text-sm font-medium text-slate-800'
                },
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
        },

        error: (message) => {
            return Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: message,
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                customClass: {
                    popup: 'rounded-xl shadow-lg',
                    title: 'text-sm font-medium text-slate-800'
                }
            });
        },

        info: (message) => {
            return Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: message,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    popup: 'rounded-xl shadow-lg',
                    title: 'text-sm font-medium text-slate-800'
                }
            });
        }
    }
};

export default sweetAlert;