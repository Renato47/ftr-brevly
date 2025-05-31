import { Warning } from 'phosphor-react'

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string
  prefix?: string
  suffix?: string
  error?: string
}

export function Input({ label, prefix, suffix, error, ...props }: InputProps) {
  return (
    <label htmlFor={props.name} className="group flex flex-col gap-2">
      <span
        className={`text-xs ${error ? 'text-danger group-focus-within:text-danger' : 'text-gray-500 group-focus-within:text-blue-base'} transition-colors`}
      >
        {label}
      </span>

      <div className="flex flex-col gap-2">
        <div
          className={`flex flex-row items-center px-4 py-[14px] text-md text-gray-600 border rounded-lg 
            ${error ? 'border-danger focus-within:border-danger' : 'border-gray-300 focus-within:border-blue-base'} transition-colors`}
        >
          {prefix && <span className="text-gray-400">{prefix}</span>}

          <input
            id={props.name}
            type="text"
            autoComplete="off"
            className="w-full outline-none"
            {...props}
          />

          {suffix && <span className="text-gray-400">{suffix}</span>}
        </div>

        {error && (
          <div className="flex flex-row gap-2">
            <Warning className="size-4 text-danger" />
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        )}
      </div>
    </label>
  )
}
