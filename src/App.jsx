import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3';
import CheckinForm from './components/CheckinForm';
import CompletedView from './components/CompletedView';
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
    const stored = localStorage.getItem('sleepHistory');
    if (stored) {
      const data = JSON.parse(stored);
      setHistory(data);

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

    const filteredHistory = history.filter(entry => entry.date !== today);
    const updatedHistory = [newEntry, ...filteredHistory]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    localStorage.setItem('sleepHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    setTodayCompleted(true);
  };

  const getLast7Days = () => {
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

    const x = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, width-(2*margin)])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height-(2*margin), 0]);

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

  if (todayCompleted) {
    return (
      <CompletedView
        sleepHours={sleepHours}
        sleepScore={sleepScore}
        history={history}
        showDebug={showDebug}
        showDeleteConfirm={showDeleteConfirm}
        chartRef={chartRef}
        onDebugOpen={() => setShowDebug(true)}
        onDebugClose={() => setShowDebug(false)}
        onDeleteClick={() => setShowDeleteConfirm(true)}
        onDeleteConfirm={deleteAllData}
        onDeleteCancel={() => setShowDeleteConfirm(false)}
      />
    );
  }

  return (
    <CheckinForm
      sleepHours={sleepHours}
      sleepScore={sleepScore}
      onHoursChange={setSleepHours}
      onScoreChange={setSleepScore}
      onSubmit={submitCheckin}
    />
  );
}

export default App
