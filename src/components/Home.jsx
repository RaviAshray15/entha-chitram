import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Home() {
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

  // Escape key listener
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Click outside modal
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
        We do not collect any personal identifiable information (PII) such as your name, email, or phone number. <br /><br />
        <strong>Local Storage:</strong><br />
        Used only to save your game progress and streaks on your device. <br /><br />
        <strong>Cookies & Analytics:</strong><br />
        This site does not use cookies or any tracking/analytics tools. <br /><br />
        <strong>Third-party Services:</strong><br />
        We do not share any data with external services or advertisers. <br /><br />
        <strong>Children’s Privacy:</strong><br />
        This game is safe for all ages and does not request any personal data. <br /><br />
        If you have any concerns, feel free to <a href='mailto:raviashray15@gmail.com' className='text-rose-600 hover:underline'>contact us.</a>
      </>
    ),
    'Terms of Use': (
      <>
        <strong>Acceptable Use:</strong><br />
        Use this game only for personal and non-commercial purposes. <br />
        Do not attempt to hack, disrupt, or exploit the game. <br />
        Respect all users — avoid harmful, offensive, or abusive behavior. <br /><br />
        <strong>Liability:</strong><br />
        The game is provided “as is” without warranties of any kind. <br />
        We are not liable for any damages resulting from using the game. <br /><br />
        <strong>Changes:</strong><br />
        Terms may be updated at any time without prior notice.
      </>
    ),
    'Disclaimer': (
      <>
        Entha Chitram! is a fan-made project created for entertainment and educational purposes. <br /><br />
        We are not affiliated with any film production companies or streaming platforms. <br /><br />
        All movie references are used under fair use as part of a guessing game. <br /><br />
        This project was inspired by <a href='https://kodle.in' className='text-rose-600 hover:underline'>Kodle.in</a> to celebrate Telugu movie culture.
      </>
    ),
    'About Us': (
      <>
        We are a team of Telugu movie fans who wanted to create a fun daily game. <br /><br />
        This is a tribute to the joy of classic and modern Tollywood films. <br /><br />
        Our goal is to bring the community together through daily movie challenges.
      </>
    ),
    'Contact': (
      <>
        <strong>Contact Us:</strong><br />
        Have feedback, questions, or ideas? <br /><br />
        Email us at: <a href="mailto:raviashray15@gmail.com" className="text-rose-600 underline">raviashray15@gmail.com</a>
      </>
    )
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] bg-gray-100 px-4 relative">
      {/* Font import */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          ::selection {
            background-color: #e11d48;
            color: white;
          }`}
      </style>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center transition-all duration-300 ease-out">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold text-rose-600">
          Entha Chitram
        </h1>
        <h2 className="text-[clamp(1.1rem,2.5vw,1.25rem)] text-gray-600 mt-2">
          A Daily Telugu Movie Guessing Game
        </h2>
        <p className="text-base text-gray-600 leading-relaxed mt-4 max-w-xl">
          Every day, guess a mystery Telugu movie using the clues. <br />
          <br />
          But, Hey! Don't google it! Ok?😂
        </p>
        <Link to="/calendar">
          <button className="mt-8 px-8 py-3 text-white text-base font-medium rounded-lg bg-rose-600 hover:bg-rose-700 transition duration-200">
            Play Now
          </button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pb-16">
        <p className="mb-1">© 2025 Entha Chitram</p>
        <div className="space-x-1 flex flex-wrap justify-center">
          {footerLinks.map((text, i) => (
            <span key={text}>
              <button
                onClick={() => setModalType(text)}
                className="text-rose-600 transition underline-offset-2 hover:underline"
              >
                {text}
              </button>
              {i < footerLinks.length - 1 && (
                <span className="mx-1 text-gray-400">•</span>
              )}
            </span>
          ))}
        </div>
      </footer>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition duration-300 ease-out">
          <div
            ref={modalRef}
            className="bg-white max-w-lg w-full rounded-lg p-6 shadow-xl text-left relative font-normal text-sm animate-fade-in"
          >
            <h2 className="text-lg font-semibold text-rose-600 mb-3">
              {modalType}
            </h2>
            <div className="text-gray-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-2 whitespace-pre-line">
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

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fadeIn 0.35s ease-out;
          }
        `}
      </style>
    </div>
  );
}

export default Home;
