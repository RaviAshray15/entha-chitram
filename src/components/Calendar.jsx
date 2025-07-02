import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

function getResultForDate(date) {
  const key = date.toLocaleDateString('en-CA');
  return localStorage.getItem(`result-${key}`);
}

function CalendarPage({ darkMode, setDarkMode }) {
  const launchDate = new Date(2025, 6, 1);
  const today = new Date();
  const isAfterLaunch = today >= launchDate;
  const [selectedDate, setSelectedDate] = useState(isAfterLaunch ? today : null);

  const navigate = useNavigate();

  const handlePlay = () => {
    if (!selectedDate) {
      alert("Please select a date before playing!");
      return;
    }
    navigate('/play', { state: { date: selectedDate } });
  };

  return (
    <div className="min-h-screen relative flex flex-col font-['Inter'] bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 px-4 sm:px-6 md:px-10 transition-colors duration-300">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          ::selection {
            background-color: #e11d48;
            color: white;
          }

          .react-calendar {
            border: none;
            font-family: 'Inter', sans-serif;
            background-color: white;
            border-radius: 1rem;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            width: 100%;
          }

          .dark .react-calendar {
            background-color: #1f2937;
            color: white;
          }

          .react-calendar__tile {
            padding: 0.75rem 0.5rem;
            font-size: 0.95rem;
            border-radius: 8px;
            transition: all 0.2s ease-in-out;
          }

          .dark .react-calendar__tile:hover {
            background-color:rgb(52, 70, 97);
          }

          .dark .react-calendar__tile:active {
            background-color:rgb(116, 57, 57);
          }

          .dark .react-calendar__tile:focus {
            background-color:rgba(203, 59, 59, 0.87);
          }

          .react-calendar__tile--now {
            background: rgb(104, 31, 31);
            font-weight: bold;
            color: #b91c1c;
          }

          .dark .react-calendar__tile--now {
            color: #facc15;
          }

          .react-calendar__tile--active {
            background: #e11d48;
            color: white;
          }

          .react-calendar__tile:disabled {
            color: #d1d5db;
            background: #f9fafb;
            cursor: not-allowed;
          }

          .dark .react-calendar__tile:disabled {
            color:rgb(70, 80, 94);
            background:rgb(95, 101, 109);
            cursor: not-allowed;
          }
            /* Fix calendar nav buttons */
          .react-calendar__navigation button {
            background: transparent;
            color: #e11d48;
            font-size: 1.25rem;
            font-weight: bold;
            transition: color 0.2s;
          }

          .react-calendar__navigation button:hover {
            background-color:rgba(189, 29, 64, 0.38);
            border-radius: 8px;
          }

          .react-calendar__navigation. button:hover {
            background-color:rgba(189, 29, 64, 0.38);
            border-radius: 8px;
          }

          .dark .react-calendar__navigation button {
            color: white;
            background-color: transparent;
          }

          .dark .react-calendar__navigation button:hover {
            color: #e11d48;
            background-color:rgba(189, 29, 64, 0.38);
            border-radius: 8px;
          }

        `}
      </style>

      {/* Back Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link
          to="/"
          className="text-[32px] sm:text-[36px] text-rose-600 hover:text-rose-900 transition duration-300"
        >
          ←
        </Link>
      </div>

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className="px-2 py-2 rounded-3xl bg-gray-700 text-white dark:bg-rose-600 dark:text-black transition-colors duration-200 text-xl"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-xl mx-auto flex flex-col justify-center items-center text-center px-2 sm:px-4 transition-all duration-300 ease-out">
        <h1 className="text-[clamp(2rem,6vw,3rem)] font-extrabold text-rose-600 animate-fadeIn">
          Choose a Day
        </h1>

        <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-gray-600 dark:text-gray-300 mt-2 px-2 max-w-sm sm:max-w-md animate-fadeIn">
          You can only play from July 1st onwards.
        </p>

        <div className="mt-6 w-full max-w-md animate-fadeIn">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={launchDate}
            tileDisabled={({ date }) => date < launchDate}
            tileClassName={({ date, view }) => {
              if (view !== 'month') return null;
              const result = getResultForDate(date);
              if (result === 'correct') return 'bg-green-200 text-green-500 font-semibold rounded-md dark:bg-green-900/50';
              if (result === 'wrong') return 'bg-red-200 text-red-500 font-semibold rounded-md dark:bg-red-900/50';
              return '';
            }}
          />
        </div>

        <button
          onClick={handlePlay}
          className="mt-6 px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-base sm:text-lg font-medium transition animate-fadeIn"
        >
          Play
        </button>
      </main>
    </div>
  );
}

export default CalendarPage;
