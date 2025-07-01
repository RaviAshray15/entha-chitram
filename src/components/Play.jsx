import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import movieData from '../data/movies.json';
import { distance } from 'fastest-levenshtein';
import confetti from 'canvas-confetti';


function Play() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = location.state?.date || new Date();
  const formattedDate = new Date(selectedDate).toDateString();
  const isHardDay = new Date(selectedDate).getDay() === 0; // 0 = Sunday

  const [hintsShown, setHintsShown] = useState(1);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const dateKey = new Date(selectedDate).toLocaleDateString('en-CA');
  const movieForDay = movieData[dateKey];
  const allDates = Object.keys(movieData).sort(); // sorted date keys
  const currentIndex = allDates.indexOf(dateKey);
  const prevDate = allDates[currentIndex - 1];
  const nextDate = allDates[currentIndex + 1];

  const [feedback, setFeedback] = useState('');

  const yesterdayKey = new Date(new Date(dateKey).getTime() - 86400000).toLocaleDateString('en-CA');
  const yesterdayResult = localStorage.getItem(`result-${yesterdayKey}`);

  if (!movieForDay) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          No movie set for <span className="text-rose-600">{formattedDate}</span>
        </h2>
        <p className="text-gray-500 mb-6">
          Don’t pick future dates, bro you ain't Doctor Strange. 😭
        </p>

        <Link to="/calendar">
          <button className="px-6 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition">
            Check Other Dates
          </button>
        </Link>
      </div>
    );

  }

  const correctAnswer = movieForDay.answer;
  const hints = movieForDay.hints;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;

      const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0');
      const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowDetails(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSubmit = () => {
    const cleanGuess = guess.trim().toLowerCase();
    const cleanAnswer = correctAnswer.trim().toLowerCase();
    const isCloseEnough = distance(cleanGuess, cleanAnswer) <= 3;

    if (isCloseEnough) {
      confetti(); // just fire a quick burst
      setResult('correct');
      setShowWinModal(true);
      localStorage.setItem(`result-${dateKey}`, 'correct');
    } else if (hintsShown < hints.length) {
      setFeedback('Wrong guess!');
      setHintsShown(hintsShown + 1);
      setGuess('');
    } else {
      setResult('wrong');
      setShowLoseModal(true);
      localStorage.setItem(`result-${dateKey}`, 'wrong');
    }
  };




  const tryAgain = () => {
    setHintsShown(1);
    setGuess('');
    setResult(null);
    setShowWinModal(false);
    setShowLoseModal(false);
    setShowAnswer(false);
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-['Inter'] px-4 py-10 flex flex-col items-center">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');`}</style>

      <Link to="/">
        <h1 className="text-3xl font-bold text-rose-600 mb-2">Entha Chitram</h1>
      </Link>

      <p className="text-sm text-gray-500 mb-6">{formattedDate}</p>
      {isHardDay && (
        <div className="mb-6 inline-block bg-red-100 text-red-700 font-semibold text-sm px-3 py-1 rounded-full uppercase tracking-wide">
          💀 Hard Day!
        </div>
      )}
      {/* Navigation */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => navigate('/calendar')}
          className="px-4 py-2 bg-rose-600 text-white text-sm rounded hover:bg-rose-700 transition"
        >
          Other Days
        </button>

        {/* Previous Day */}
        <button
          onClick={() => navigate('/play', { state: { date: prevDate } })}
          disabled={!prevDate}
          className={`px-4 py-2 text-sm rounded transition ${prevDate
            ? 'bg-rose-600 text-white hover:bg-rose-700'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
        >
          ← Previous Day
        </button>

        {/* Next Day */}
        <button
          onClick={() => navigate('/play', { state: { date: nextDate } })}
          disabled={!nextDate}
          className={`px-4 py-2 text-sm rounded transition ${nextDate
            ? 'bg-rose-600 text-white hover:bg-rose-700'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
        >
          Next Day →
        </button>
      </div>


      {/* Game Box: Input + Hint + Buttons */}
      {/* Game Section: Input, Hints, and Buttons side-by-side */}
      <div className="w-full max-w-2xl flex gap-4 mb-8 justify-center">
        {/* Left side: Input + Hints */}
        <div className="flex-1 space-y-4">
          {/* Input */}
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Enter movie name"
            className="w-full h-12 px-4 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />


          {/* Hints Box */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">Hints</h2>
            <div className="text-sm text-gray-700 space-y-2 mb-1">
              {hints.slice(0, hintsShown).map((hint, i) => (
                <p key={i}>
                  <span className="font-semibold">Hint {i + 1}:</span> {hint}
                </p>
              ))}
            </div>

          </div>
        </div>

        {/* Right side: Buttons */}
        <div className="w-32 flex flex-col gap-3">
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="h-12 w-full bg-rose-600 text-white rounded-md text-sm font-semibold hover:bg-rose-700 transition"
          >
            Submit
          </button>

          {/* Show Hint */}
          <button
            onClick={() => setHintsShown(hintsShown + 1)}
            disabled={hintsShown >= hints.length}
            className={`h-12 w-full text-white rounded-md text-sm font-semibold transition ${hintsShown >= hints.length
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-rose-600 hover:bg-rose-700'
              }`}
          >
            Show Hint
          </button>

          {/* Show Details */}
          <button
            onClick={() => setShowDetails(true)}
            disabled={hintsShown < hints.length}
            className={`h-12 w-full text-white rounded-md text-sm font-semibold transition ${hintsShown < hints.length
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            Show Details
          </button>
        </div>

      </div>
      {feedback && (
        <div className="text-sm text-red-600 font-medium mb-1">{feedback}</div>
      )}


      {/* Countdown */}
      <div className="mt-2 text-sm text-gray-600">
        ⏰ Next movie in: <span className="font-semibold">{timeLeft}</span>
      </div>

      {/* WIN Modal */}
      {showWinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-green-600 mb-4">🎉 Yay! You guessed it!</h2>
            <p className="text-sm text-gray-500 mb-4">📅 Selected Date: <span className="font-medium">{formattedDate}</span></p>
            <p className="text-gray-700 mb-6">The movie was <strong>{correctAnswer}</strong>.</p>
            <div className="flex justify-center gap-3 flex-wrap mt-4">

              <button
                onClick={tryAgain}
                className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Try Again
              </button>

              <button
                onClick={() => navigate('/calendar')}
                className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Check Other Dates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOSE Modal */}
      {showLoseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">❌ Game Over!</h2>
            <p className="text-sm text-gray-500 mb-4">📅 Selected Date: <span className="font-medium">{formattedDate}</span></p>
            <p className="text-gray-700 mb-4">Better luck next time.</p>
            {showAnswer && (
              <p className="text-gray-700 mb-4">
                The correct answer was <strong>{correctAnswer}</strong>.
              </p>
            )}
            <div className="flex justify-center gap-3 flex-wrap mt-4">
              {/* buttons */}

              <button
                onClick={tryAgain}
                className="mt-2 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Try Again
              </button>

              <button
                onClick={() => navigate('/calendar')}
                className="mt-2 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Check Other Dates
              </button>

              {!showAnswer && (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-4 py-0 text-sm text-blue-600 hover:underline mb-0 "
                >
                  Reveal Answer
                </button>
              )}
            </div>
          </div>
        </div>
      )
      }

      {/* DETAILS Modal */}
      {
        showDetails && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDetails(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-left relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-3 right-4 text-gray-500 text-xl hover:text-gray-700"
              >
                &times;
              </button>
              <h2 className="text-lg font-bold text-rose-600 mb-4">Movie Details</h2>
              <div className="text-sm text-gray-800 space-y-2">
                <p><span className="font-semibold">Hero:</span> {movieForDay.details?.Hero}</p>
                <p><span className="font-semibold">Director:</span> {movieForDay.details?.Director}</p>
                <p><span className="font-semibold">Music:</span> {movieForDay.details?.Music}</p>
                <p><span className="font-semibold">Release Date:</span> {movieForDay.details?.["Release Date"]}</p>
                <p><span className="font-semibold">IMDB:</span> {movieForDay.details?.IMDB}</p>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
}

export default Play;
