import React, { ReactElement } from "react";

interface InputGroupProps {
  customClasses?: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactElement;
  disable?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({
  customClasses,
  label,
  type,
  placeholder,
  required,
  value,
  name,
  onChange,
  icon,
  disable,
}) => {
  return (
    <>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
        {required && <span className="text-red">*</span>}
      </label>
      <div className={customClasses}>
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          disabled={disable}
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
        <span className="absolute right-4.5 top-1/2 z-10 -translate-y-1/2 text-dark-4 dark:text-dark-6">
          {icon && icon}
        </span>
      </div>
    </>
  );
};

export default InputGroup;
