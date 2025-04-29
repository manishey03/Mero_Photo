import { Eye, EyeOff } from "lucide-react";
import { FieldError } from "react-hook-form";
import { useState } from "react";

interface InputProps {
  label: string;
  type: "email" | "password" | "string" | "number";
  placeholder: string;
  error?: FieldError | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  name: string;
  required?: boolean;
}

const Input = ({
  label,
  type,
  placeholder,
  error,
  register,
  name,
  required,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className="block text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          {...register(name, { required })}
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 pt-2">{error.message}</p>}
    </div>
  );
};

export default Input;
