import React, { memo, useCallback, useState } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { FaEye } from 'react-icons/fa'
import BottomGradient from './gradients/BottomGradient'

interface InputProps {
  label: string
  icon?: React.ElementType
  className?: string

  id: string
  type?: string
  disabled?: boolean
  required?: boolean
  onChange?: any
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  options?: any[]
  rows?: number
  labelBg?: string
  onClick?: (e?: any) => void
  onFocus?: (e?: any) => void

  // rest
  [key: string]: any
}

function Input({
  id,
  type = 'text',
  disabled,
  required,
  register,
  errors,
  label,
  onChange,
  icon: Icon,
  options,
  rows,
  onClick,
  onFocus,
  labelBg = 'bg-white',
  className = '',
  ...rest
}: InputProps) {
  // states
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)

  // show password
  const showPassword = useCallback(() => {
    setIsShowPassword(prev => !prev)
  }, [])

  return (
    <div
      className={`${className}`}
      onClick={onClick}
      onFocus={onFocus}
    >
      <div className={`flex border ${errors[id] ? 'border-rose-500' : 'border-dark'} rounded-[16px]`}>
        {/* MARK: Icon */}
        {Icon && (
          <span
            onClick={type === 'password' ? showPassword : undefined}
            className={`inline-flex items-center rounded-l-[16px] px-3 text-sm text-gray-900 ${
              errors[id] ? 'border-rose-400 bg-rose-100' : 'border-slate-200 bg-slate-100'
            } ${type === 'password' ? 'cursor-pointer' : ''}`}
          >
            {type === 'password' ? (
              isShowPassword ? (
                <FaEye
                  size={19}
                  className="text-secondary"
                />
              ) : (
                <Icon
                  size={19}
                  className="text-secondary"
                />
              )
            ) : (
              <Icon
                size={19}
                className="text-secondary"
              />
            )}
          </span>
        )}

        {/* MARK: Text Field */}
        <div
          className={`group/btn relative w-full border-l-0 bg-white ${
            Icon ? 'rounded-r-[16px]' : 'rounded-[16px]'
          } ${errors[id] ? 'border-rose-400' : 'border-slate-200'}`}
        >
          {type === 'textarea' ? (
            <textarea
              id={id}
              className="peer block w-full bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-dark focus:outline-none focus:ring-0"
              placeholder=" "
              disabled={disabled}
              rows={rows || 4}
              {...register(id, { required })}
              {...rest}
            />
          ) : type === 'select' ? (
            <select
              id={id}
              className="peer block min-h-[42px] w-full rounded-l-[16px] rounded-r-lg px-2.5 pb-2.5 pt-4 text-sm text-dark focus:outline-none focus:ring-0"
              style={{ WebkitAppearance: 'none', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
              disabled={disabled}
              {...register(id, { required })}
              onChange={onChange}
              defaultValue={options?.find(option => option.selected)?.value}
              {...rest}
            >
              {options?.map((option, index) => (
                <option
                  className="trans-200 appearance-none bg-dark-100 px-1.5 py-0.5 font-body font-semibold text-light checked:bg-indigo-500 hover:bg-primary hover:text-dark"
                  key={index}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={id}
              className="number-input peer block h-[42px] w-full rounded-r-[16px] bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-dark focus:outline-none focus:ring-0"
              disabled={disabled}
              type={type === 'password' ? (isShowPassword ? 'text' : 'password') : type}
              {...register(id, { required })}
              onWheel={e => e.currentTarget.blur()}
              placeholder=""
              onChange={onChange}
              {...rest}
            />
          )}
          <BottomGradient />

          {!Icon &&
            type === 'password' &&
            (isShowPassword ? (
              <FaEye
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-dark"
                size={19}
                onClick={showPassword}
              />
            ) : (
              <FaEye
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-dark"
                size={19}
                onClick={showPassword}
              />
            ))}

          {/* MARK: Label */}
          <label
            htmlFor={id}
            className={`trans-300 absolute left-5 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform text-nowrap rounded-md text-sm font-semibold text-dark ${labelBg} start-1 cursor-pointer px-2 peer-placeholder-shown:top-[48%] peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 ${
              errors[id] ? 'text-rose-400' : 'text-dark'
            }`}
          >
            {label}
          </label>
        </div>
      </div>

      {/* MARK: Error */}
      {errors[id]?.message && (
        <span className="text-sm text-rose-400 drop-shadow-md">{errors[id]?.message?.toString()}</span>
      )}
    </div>
  )
}

export default memo(Input)
