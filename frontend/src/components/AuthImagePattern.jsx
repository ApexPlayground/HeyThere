const AuthImagePattern = ({ title, subtitle }) => {
    return (
        <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 rounded-xl">
            <div className="max-w-md text-center">
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-2xl ${i % 2 === 0 ? "bg-gradient-to-br from-primary/20 to-accent/20" : "bg-gradient-to-bl from-neutral/20 to-secondary/20"} ${i % 2 === 0 ? "animate-pulse" : ""}`}
                        />
                    ))}
                </div>
                <h2 className="text-2xl font-bold mb-4 text-base-content">{title}</h2>
                <p className="text-base-content/60">{subtitle}</p>
            </div>
        </div>
    );
};

export default AuthImagePattern;
