import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Home() {
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
    'Contact',
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
        <strong>Data Collection:</strong><br />
        We don’t collect any personal identifiable information (PII).<br /><br />
        <strong>Local Storage:</strong><br />
        Used only to save your game progress on your device.<br /><br />
        <strong>No Cookies:</strong><br />
        This site doesn’t use cookies or tracking tools.<br /><br />
        <strong>Children’s Privacy:</strong><br />
        This game is safe for all ages.<br /><br />
        Contact us: <a href='mailto:raviashray15@gmail.com' className='text-rose-600 hover:underline'>raviashray15@gmail.com</a>
      </>
    ),
    'Terms of Use': (
      <>
        <strong>Acceptable Use:</strong><br />
        Use for personal, non-commercial fun.<br />
        Don’t hack, disrupt, or exploit the game.<br /><br />
        <strong>Liability:</strong><br />
        Provided “as is”. No warranties.<br /><br />
        <strong>Changes:</strong><br />
        Terms may change at any time.
      </>
    ),
    'Disclaimer': (
      <>
        Entha Chitram! is a fan-made game for fun & learning.<br /><br />
        Not affiliated with film companies or platforms.<br />
        All movie hints fall under fair use.<br /><br />
        Inspired by <a href="https://kodle.in" className="text-rose-600 hover:underline">Kodle.in</a> for Telugu movie fans.
      </>
    ),
    'About Us': (
      <>
        A small team of Telugu movie lovers!<br /><br />
        Built with love for Tollywood culture.<br />
        Let’s celebrate movies, one guess at a time.
      </>
    ),
    'Contact': (
      <>
        Got feedback or ideas?<br /><br />
        Email us: <a href="mailto:raviashray15@gmail.com" className="text-rose-600 underline">raviashray15@gmail.com</a>
      </>
    )
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 px-4 sm:px-6 md:px-8 py-6 font-['Inter'] text-gray-800 relative">
      {/* Font & Selection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        ::selection { background-color: #e11d48; color: white; }
      `}</style>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center">
        <h1 className="text-[clamp(2rem,8vw,3rem)] font-extrabold text-rose-600">
          Entha Chitram
        </h1>
        <h2 className="text-[clamp(1.1rem,5vw,1.25rem)] text-gray-600 mt-2">
          A Daily Telugu Movie Guessing Game
        </h2>
        <p className="text-base sm:text-[15px] text-gray-600 leading-relaxed mt-4 max-w-xl px-2">
          Every day, guess a mystery Telugu movie using clues. <br />
          Try using as few hints as possible. <br />
          But hey — no Googling it, ok? 😂
        </p>

        <Link to="/calendar">
          <button className="mt-8 px-8 py-3 text-white text-base font-medium rounded-lg bg-rose-600 hover:bg-rose-700 transition duration-200">
            Play Now
          </button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-12 pb-20">
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
                <span className="mx-1 text-gray-400 hidden sm:inline">•</span>
              )}
            </span>
          ))}
        </div>
      </footer>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={modalRef}
            className="bg-white max-w-md w-full mx-4 rounded-lg p-6 shadow-xl text-left relative text-sm animate-fade-in max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold text-rose-600 mb-3">
              {modalType}
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
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
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Home;
