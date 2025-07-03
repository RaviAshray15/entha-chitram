import { Moon, Sun } from 'lucide-react';

function DarkMode({ darkMode, setDarkMode }) {
  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
      <button
        onClick={() => setDarkMode(prev => !prev)}
        className="p-3 rounded-full bg-gray-700 dark:bg-rose-600 transition-colors duration-200"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? (
          <Sun size={20} className="text-white" />
        ) : (
          <Moon size={20} className="text-white" />
        )}
      </button>
    </div>
  );
}

export default DarkMode;