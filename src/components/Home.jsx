import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

function Home({ darkMode, setDarkMode }) {
  useEffect(() => {
    if (window.history.length > 1) {
      window.history.pushState(null, '', window.location.href);
      window.history.go(-(window.history.length - 2));
    }
  }, []);

  const [modalType, setModalType] = useState(null);
  const modalRef = useRef();

  const footerLinks = [
    'Privacy Policy',
    'Terms of Use',
    'Disclaimer',
    'About Us',
    'Contact Us',
  ];

  const closeModal = () => setModalType(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const modalContent = {
    'Privacy Policy': (
      <>
        <strong>No personal data collected.</strong><br />
        Local storage is used for your progress only.<br />
        No cookies or tracking.<br />
        No data shared with third parties.<br />
        <strong>No Cookies:</strong><br />
        This site doesn’t use cookies or tracking tools.<br /><br />
        <strong>Third-party Services:</strong><br />
        We do not share any data with external services or advertisers.<br /><br />
        <strong>Children’s Privacy:</strong><br />
        This game is safe for all ages.<br /><br />
        If you have any concerns, feel free to <a href='mailto:raviashray15@gmail.com' className='text-rose-600 hover:underline'>contact us</a>.
      </>
    ),
    'Terms of Use': (
      <>
        <strong>Acceptable Use:</strong><br />
        Use for personal, non-commercial fun.<br />
        Don’t hack, disrupt, or exploit the game.<br /><br />
        <strong>Liability:</strong><br />
        Provided “as is”. No warranties.<br />
        We aren't liable for any damages.<br /><br />
        <strong>Changes:</strong><br />
        Terms may change at any time.
      </>
    ),
    'Disclaimer': (
      <>
        Entha Chitram! is a fan-made game for fun & learning.<br /><br />
        Not affiliated with film companies or platforms.<br />
        All movie hints fall under fair use.<br /><br />
        Inspired from <a href="https://kodle.in" className="text-rose-600 hover:underline">Kodle.in</a>.
      </>
    ),
    'About Us': (
      <>
        We are a team of Telugu movie fans who wanted to create a fun daily game. <br /><br />

        This is a tribute to the joy of classic and modern Tollywood films.<br /><br />

        Our goal is to bring the community together through daily movie challenges.<br />
      </>
    ),
    'Contact': (
      <>
        Have feedback, questions, or ideas?<br /><br />
        Email us: <a href="mailto:raviashray15@gmail.com" className="text-rose-600 underline">raviashray15@gmail.com</a>
      </>
    )
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200 px-4 sm:px-6 md:px-8 py-6 font-['Inter'] text-gray-800 relative dark:bg-gray-900 dark:text-gray-100">
      {/* Font & Selection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        ::selection { background-color: #e11d48; color: white; }
      `}</style>

      {/* Dark Mode Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className="px-2 py-2 rounded-3xl bg-gray-700 text-white dark:bg-rose-600 dark:text-black transition-colors duration-200 text-xl"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>


      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center">
        <h1 className="text-[clamp(2rem,8vw,3rem)] font-extrabold text-rose-600 animate-fade-up">
          Entha Chitram
        </h1>
        <h2 className="text-[clamp(1.1rem,5vw,1.25rem)] text-gray-600 dark:text-gray-300 mt-2 animate-fadeIn">
          A Daily Telugu Movie Guessing Game
        </h2>
        <p className="text-base sm:text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed mt-4 max-w-xl px-2 animate-fadeIn">
          Every day, guess a mystery Telugu movie using clues. <br />
          Try using as few hints as possible. <br />
          But hey — no Googling it, ok? 😂
        </p>

        <Link to="/calendar">
          <button className="mt-8 px-8 py-3 text-white text-base font-medium rounded-lg bg-rose-600 hover:bg-rose-700 transition duration-200 animate-fadeIn">
            Play Now
          </button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12 pb-20 animate-fade-up">
        <p className="mb-1">© 2025 Entha Chitram</p>
        <div className="space-x-1 flex flex-wrap justify-center gap-2">
          {footerLinks.map((text, i) => (
            <span key={text}>
              <button
                onClick={() => setModalType(text)}
                className="text-rose-600 underline-offset-2 hover:underline transition"
              >
                {text}
              </button>
              {i < footerLinks.length - 1 && (
                <span className="ml-3 text-gray-400 hidden sm:inline">•</span>
              )}
            </span>
          ))}
        </div>
      </footer>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-up">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 max-w-md w-full mx-4 rounded-lg p-6 shadow-xl text-left relative text-sm animate-fade-in max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold text-rose-600 mb-3">
              {modalType}
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {modalContent[modalType]}
            </div>
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-rose-500 text-xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-up {
          animation: fadeUp 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default Home;
