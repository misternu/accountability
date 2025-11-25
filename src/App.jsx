  import { useState, useEffect } from 'react'
  import { Moon, Calendar, Bug, X } from 'lucide-react';
  import './App.css'

  function App() {
    const [sleepHours, setSleepHours] = useState('');
    const [sleepScore, setSleepScore] = useState('');
    const [history, setHistory] = useState([]);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [showDebug, setShowDebug] = useState(false);

    const today = new Date().toLocaleDateString('en-CA')

    useEffect(() => {
      loadData();
    }, []);

    const loadData = () => {
      // Load all check-ins from localStorage
      const stored = localStorage.getItem('sleepHistory');
      if (stored) {
        const data = JSON.parse(stored);
        setHistory(data);
        
        // Check if today's check-in exists
        const todayEntry = data.find(entry => entry.date === today);
        if (todayEntry) {
          setTodayCompleted(true);
          setSleepHours(todayEntry.hours);
          setSleepScore(todayEntry.score);
        }
      }
    };

    const submitCheckin = () => {
      const newEntry = {
        date: today,
        hours: parseFloat(sleepHours),
        score: parseInt(sleepScore),
        timestamp: new Date().toISOString(),
      };

      // Remove today's entry if it exists, then add new one
      const filteredHistory = history.filter(entry => entry.date !== today);
      const updatedHistory = [newEntry, ...filteredHistory]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      localStorage.setItem('sleepHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      setTodayCompleted(true);
    };

    const getLast7Days = () => {
      return history.slice(0, 7);
    };

    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      const date = new Date(year, month - 1, day); // month is 0-indexed here
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return `${dayNames[date.getDay()]} ${date.getMonth() + 1}/${date.getDate()}`;
    };

    if (todayCompleted) {
      return (
        <div className="max-w-2xl mx-auto p-6 bg-slate-50 min-h-screen">
          {/* Debug Modal */}
          {showDebug && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Bug className="text-orange-600" />
                    <h2 className="text-xl font-bold">Debug: Sleep History Data</h2>
                  </div>
                  <button
                    onClick={() => setShowDebug(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-4 overflow-auto">
                  <pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto">
                    {JSON.stringify(history, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Moon className="text-blue-600" />
                <h1 className="text-2xl font-bold">Sleep Tracker</h1>
              </div>
              <button
                onClick={() => setShowDebug(true)}
                className="p-2 hover:bg-gray-100 rounded"
                title="Debug"
              >
                <Bug className="text-gray-600" size={20} />
              </button>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <div className="font-medium text-green-800">✓ Today's check-in completed</div>
              <div className="text-sm text-green-700 mt-1">
                {sleepHours} hours, score: {sleepScore}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-purple-600" />
              <h2 className="text-xl font-bold">Recent History</h2>
            </div>
            
            {getLast7Days().length === 0 ? (
              <p className="text-gray-600">No history yet. This is your first check-in!</p>
            ) : (
              <div className="space-y-3">
                {getLast7Days().map(entry => (
                  <div key={entry.date} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{formatDate(entry.date)}</div>
                      <div className="text-sm text-gray-600">{entry.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{entry.hours} hrs</div>
                      <div className="text-sm text-gray-600">score: {entry.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <div className="text-sm text-gray-700">
                Come back tomorrow morning for your next check-in!
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto p-6 bg-slate-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Moon className="text-blue-600" />
            <h1 className="text-2xl font-bold">Morning Check-in</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Hours of sleep last night
              </label>
              <input
                type="number"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="7.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Sleep Score
              </label>
              <input
                type="number"
                step="0.5"
                value={sleepScore}
                onChange={(e) => setSleepScore(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="7.5"
              />
            </div>

            <button
              onClick={submitCheckin}
              disabled={!sleepHours}
              className="w-full py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Submit Check-in
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default App
