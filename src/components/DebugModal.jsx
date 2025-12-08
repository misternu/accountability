import { Bug, X } from 'lucide-react';

function DebugModal({
  history,
  showDeleteConfirm,
  onClose,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bug className="text-orange-600" />
            <h2 className="text-xl font-bold">Debug: Sleep History Data</h2>
          </div>
          <button
            onClick={onClose}
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
                  onClick={onDeleteCancel}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={onDeleteConfirm}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Yes, delete
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onDeleteClick}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium"
            >
              Delete All Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DebugModal;
