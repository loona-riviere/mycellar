type InputFieldProps = {
    id: string
    label: string
    placeholder?: string
    type?: string
    required?: boolean
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    min?: number
    max?: number
    step?: number
}

export function InputField({
                               id,
                               label,
                               type = "text",
                               placeholder,
                               required = false,
                               value,
                               onChange,
                               className,
                               min,
                               max,
                               step,
                           }: Readonly<InputFieldProps>) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                required={required}
                placeholder={placeholder}
                defaultValue={value}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${className ?? ""}`}
            />
        </div>
    )
}
