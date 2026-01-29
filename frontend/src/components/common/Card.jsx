const Card = ({ children, className = '', hover = true, ...props }) => {
    const hoverEffect = hover ? 'hover:shadow-2xl hover:-translate-y-1' : '';
    
    return (
        <div 
            className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 ${hoverEffect} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;