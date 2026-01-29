import { useState, useRef } from 'react';
import Button from './Button';

const ImageUpload = ({ 
    onImageSelect, 
    currentImage = null, 
    onImageRemove = null,
    className = "",
    disabled = false 
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(currentImage);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (disabled) return;
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (disabled) return;
        
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be smaller than 2MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Call parent callback
        onImageSelect(file);
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onImageRemove) {
            onImageRemove();
        }
    };

    const openFileDialog = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Featured Image
            </label>
            
            {preview ? (
                // Image Preview
                <div className="relative">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-slate-200">
                        <img
                            src={preview}
                            alt="Featured image preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={openFileDialog}
                                    disabled={disabled}
                                    className="bg-white text-slate-700 hover:bg-slate-50"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Change
                                </Button>
                                <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    onClick={handleRemove}
                                    disabled={disabled}
                                    className="bg-red-500 text-white hover:bg-red-600"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Upload Area
                <div
                    className={`relative w-full h-48 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                        dragActive 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-slate-300 hover:border-slate-400'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg font-medium mb-2">
                            {dragActive ? 'Drop image here' : 'Upload featured image'}
                        </p>
                        <p className="text-sm text-slate-400 text-center px-4">
                            Drag and drop an image here, or click to select<br />
                            <span className="text-xs">JPEG, PNG, WebP • Max 2MB • Min 300x200px</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleChange}
                className="hidden"
                disabled={disabled}
            />
        </div>
    );
};

export default ImageUpload;