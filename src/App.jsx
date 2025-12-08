  import { useState, useEffect, useRef } from 'react'
  import { Moon, Calendar, Bug, X } from 'lucide-react';
  import * as d3 from 'd3';
  import './App.css'

  function App() {
    const [sleepHours, setSleepHours] = useState('');
    const [sleepScore, setSleepScore] = useState('');
    const [history, setHistory] = useState([]);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [showDebug, setShowDebug] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const chartRef = useRef(null);

    const today = new Date().toLocaleDateString('en-CA')

    useEffect(() => {
      loadData();
    }, []);

    useEffect(() => {
      if (todayCompleted && history.length > 0) {
        drawChart();
      }
    }, [todayCompleted, history]);

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
      // Generate the last 7 calendar days
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-CA');
        const entry = history.find(h => h.date === dateStr);
        days.push(entry || { date: dateStr, hours: null, score: null });
      }
      return days;
    };

    const drawChart = () => {
      if (!chartRef.current) return;

      const data = getLast7Days();

      // Clear previous chart
      d3.select(chartRef.current).selectAll('*').remove();

      const margin = 20;
      const width = 600 - (2 * margin);
      const height = 300 - (2 * margin);

      const svg = d3.select(chartRef.current)
        .append('svg')
        .attr('width', width + (2 * margin))
        .attr('height', height + (2 * margin))
        .append('g')
        .attr('transform', `translate(${margin},${margin})`);

      // X scale
      const x = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([0, width-(2*margin)])
        .padding(0.2);

      // Y scale
      const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height-(2*margin), 0]);

      // Bars
      svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.date))
        .attr('y', d => y(d.score ?? 0))
        .attr('width', x.bandwidth())
        .attr('height', d => height-(2*margin) - y(d.score ?? 0))
        .attr('fill', d => d.score !== null ? '#3b82f6' : '#e5e7eb');

      // Day labels below bars
      svg.selectAll('.day-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.date) + x.bandwidth() / 2)
        .attr('y', height-(2*margin) + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#374151')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(d => {
          const [year, month, day] = d.date.split('-');
          const date = new Date(year, month - 1, day);
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return dayNames[date.getDay()];
        });

      // Score inside bar (only for days with data)
      svg.selectAll('.score-label')
        .data(data.filter(d => d.score !== null))
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.date) + x.bandwidth() / 2)
        .attr('y', d => y(d.score) + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text(d => d.score);

      // Red line at 70
      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width-(2*margin))
        .attr('y1', y(70))
        .attr('y2', y(70))
        .attr('stroke', 'darkred')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5)
    };

    const deleteAllData = () => {
      localStorage.removeItem('sleepHistory');
      setHistory([]);
      setTodayCompleted(false);
      setSleepHours('');
      setSleepScore('');
      setShowDeleteConfirm(false);
      setShowDebug(false);
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
                <div className="p-4 overflow-auto flex-1">
                  <pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto">
                    {JSON.stringify(history, null, 2)}
                  </pre>
                </div>
                <div className="p-4 border-t">
                  {showDeleteConfirm ? (
                    <div className="flex items-center justify-between bg-red-50 p-3 rounded">
                      <span className="text-red-800 font-medium">Delete all data?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={deleteAllData}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                        >
                          Yes, delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium"
                    >
                      Delete All Data
                    </button>
                  )}
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
              <div ref={chartRef} className="flex justify-center"></div>
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

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (sleepHours && sleepScore) submitCheckin(); }}>
            <div>
              <label className="block text-sm font-medium mb-2">
                Hours of sleep last night
              </label>
              <input
                type="number"
                step="any"
                min="0"
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
                step="1"
                min="1"
                max="100"
                value={sleepScore}
                onChange={(e) => setSleepScore(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="85"
              />
            </div>

            <button
              type="submit"
              disabled={!sleepHours || !sleepScore}
              className="w-full py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Submit Check-in
            </button>
          </form>
        </div>
      </div>
    );
  }

  export default App
