"use client"

export default function DropdownOptions() {
  const options = [
    {
      label: "Profile",
      action: () => {},
    },
    {
      label: "Organizations",
      action: () => {},
    },
    {
      label: "Logout",
      action: () => {},
    },
  ]

  return (
    <div className="flex flex-col gap-2 opacity-0 absolute transition-all duration-300 bg-white shadow-2xl shadow-blue-800/20 p-2 rounded-lg top-10 w-60 right-0 z-20 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:top-20">
      {options.map(({ label, action }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          className="py-1 px-2 text-left text-gray-500 transition-all duration-300 rounded hover:bg-gray-200 hover:text-gray-600"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
