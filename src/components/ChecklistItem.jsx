export default function ChecklistItem({ item, onToggle, highlight = false }) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-gray-50 ${highlight ? 'bg-orange-50' : ''}`}>
      <input
        type="checkbox"
        checked={item.done}
        onChange={onToggle}
        className="w-4 h-4 accent-indigo-500"
      />
      <span className={`text-sm ${item.done ? 'line-through text-gray-400' : highlight ? 'text-orange-700 font-medium' : 'text-gray-700'}`}>
        {item.item}
      </span>
      {highlight && !item.done && (
        <span className="ml-auto text-xs text-orange-500 font-semibold">D-3!</span>
      )}
    </label>
  )
}
