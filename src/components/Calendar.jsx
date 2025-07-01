import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, Link } from 'react-router-dom';

function getResultForDate(date) {
  const key = date.toLocaleDateString('en-CA');
  return localStorage.getItem(`result-${key}`);
}

function CalendarPage() {
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
    <div className="min-h-screen relative flex flex-col font-['Inter'] bg-gray-100 px-4 sm:px-6 md:px-10 text-gray-800">
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
          .react-calendar__tile {
            padding: 0.75rem 0.5rem;
            font-size: 0.95rem;
            border-radius: 8px;
            transition: all 0.2s ease-in-out;
          }
          .react-calendar__tile--now {
            background: rgb(255, 250, 232);
            font-weight: bold;
            color: #b91c1c;
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
        `}
      </style>

      {/* Back button */}
      <div className="absolute top-6 left-4 sm:top-10 sm:left-10">
        <Link
          to="/"
          className="text-[32px] sm:text-[36px] text-rose-600 hover:text-rose-900 transition duration-300"
        >
          ←
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-xl mx-auto flex flex-col justify-center items-center text-center px-2 sm:px-4 transition-all duration-300 ease-out">
        <h1 className="text-[clamp(2rem,6vw,3rem)] font-extrabold text-rose-600">
          Choose a Day
        </h1>

        <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-gray-600 mt-2 px-2 max-w-sm sm:max-w-md">
          You can only play from July 1st onwards.
        </p>

        <div className="mt-6 w-full max-w-md">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={launchDate}
            tileDisabled={({ date }) => date < launchDate}
            tileClassName={({ date, view }) => {
              if (view !== 'month') return null;
              const result = getResultForDate(date);
              if (result === 'correct') return 'bg-green-100 text-green-800 font-semibold rounded-md';
              if (result === 'wrong') return 'bg-red-100 text-red-800 font-semibold rounded-md';
              return '';
            }}
          />
        </div>

        <button
          onClick={handlePlay}
          className="mt-6 px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-base sm:text-lg font-medium transition"
        >
          Play
        </button>
      </main>
    </div>
  );
}

export default CalendarPage;
