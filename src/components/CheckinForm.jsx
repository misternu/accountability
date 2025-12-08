import { Moon } from 'lucide-react';

function CheckinForm({
  sleepHours,
  sleepScore,
  onHoursChange,
  onScoreChange,
  onSubmit
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (sleepHours && sleepScore) {
      onSubmit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Moon className="text-blue-600" />
          <h1 className="text-2xl font-bold">Morning Check-in</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">
              Hours of sleep last night
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={sleepHours}
              onChange={(e) => onHoursChange(e.target.value)}
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
              onChange={(e) => onScoreChange(e.target.value)}
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

export default CheckinForm;
