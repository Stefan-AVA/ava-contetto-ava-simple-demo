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
    <div className="flex flex-col gap-2">
      {options.map(({ label, action }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          className="p-1 bg-gray-200 text-gray-500 transition-all duration-300 rounded hover:text-gray-600"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
