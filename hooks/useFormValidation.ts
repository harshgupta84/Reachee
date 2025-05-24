'use client';

import { useState, useCallback } from 'react';

type ValidationRules<T> = {
  [K in keyof T]?: Array<{
    validator: (value: T[K]) => boolean;
    message: string;
  }>;
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      validateField(field, value);
    },
    [validationRules]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, values[field]);
    },
    [values, validationRules]
  );

  const validateField = useCallback(
    (field: keyof T, value: any) => {
      const fieldRules = validationRules[field] || [];
      
      for (const rule of fieldRules) {
        if (!rule.validator(value)) {
          setErrors((prev) => ({ ...prev, [field]: rule.message }));
          return;
        }
      }
      
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    },
    [validationRules]
  );

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors: ValidationErrors<T> = {};
    
    for (const field in validationRules) {
      const fieldRules = validationRules[field as keyof T] || [];
      
      for (const rule of fieldRules) {
        if (!rule.validator(values[field as keyof T])) {
          newErrors[field as keyof T] = rule.message;
          isValid = false;
          break;
        }
      }
    }
    
    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
  };
} 