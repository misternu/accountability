import { Moon, Calendar, Bug } from 'lucide-react';
import DebugModal from './DebugModal';
import HistoryChart from './HistoryChart';

function CompletedView({
  sleepHours,
  sleepScore,
  history,
  showDebug,
  showDeleteConfirm,
  chartRef,
  onDebugOpen,
  onDebugClose,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel
}) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-50 min-h-screen">
      {showDebug && (
        <DebugModal
          history={history}
          showDeleteConfirm={showDeleteConfirm}
          onClose={onDebugClose}
          onDeleteClick={onDeleteClick}
          onDeleteConfirm={onDeleteConfirm}
          onDeleteCancel={onDeleteCancel}
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Moon className="text-blue-600" />
            <h1 className="text-2xl font-bold">Sleep Tracker</h1>
          </div>
          <button
            onClick={onDebugOpen}
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

        <HistoryChart chartRef={chartRef} />

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <div className="text-sm text-gray-700">
            Come back tomorrow morning for your next check-in!
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompletedView;
