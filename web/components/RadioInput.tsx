import React from "react";

interface RadioInputProps {
  id: string;
  name: string;
  value: string;
  title: string;
  description?: string;
  onChange: (value: string) => void;
}

const RadioInput: React.FC<RadioInputProps> = ({
  id,
  name,
  value,
  title,
  description = "",
  onChange,
}) => {
  return (
    <li>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        className="hidden peer"
        onChange={() => onChange(value)}
      />
      <label
        htmlFor={id}
        className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
      >
        <div className="block">
          <div className="w-full text-lg font-semibold">{title}</div>
          <div className="w-full">{description}</div>
        </div>
        <svg
          className="w-5 h-5 ms-3 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </label>
    </li>
  );
};

export default RadioInput;
