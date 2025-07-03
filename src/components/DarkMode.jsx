import react from 'react';

function DarkMode({ darkMode, setDarkMode }) {
  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
      <button
        onClick={() => setDarkMode(prev => !prev)}
        className="px-2 py-2 rounded-3xl bg-gray-700 text-white dark:bg-rose-600 dark:text-black transition-colors duration-200 text-xl"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

export default DarkMode;
