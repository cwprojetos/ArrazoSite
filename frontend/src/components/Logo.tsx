export const Logo = ({ className = "" }: { className?: string }) => {
  // Use a URL-based import for assets in `public/` so Vite serves them correctly.
  // The logo file is `ArrazoLogo.jpg` in the public folder.
  const logoUrl = new URL('/ArrazoLogo.jpg', import.meta.url).href;

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoUrl} 
        alt="Arazzo Eventos Logo" 
        className="h-48 w-auto"
      />
    </div>
  );
};
