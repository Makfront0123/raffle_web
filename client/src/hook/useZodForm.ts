import { useState } from "react";
import { ZodSchema } from "zod";

export function useZodForm<T>(initialValues: T, schema: ZodSchema<T>) {
    const [form, setForm] = useState(initialValues);
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        const updatedForm = {
            ...form,
            [name]: name === "value" ? parseFloat(value) : value,
        };

        setForm(updatedForm);
        const result = schema.safeParse(updatedForm);
        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
        } else {
            setErrors({});
        }
    };

    const validate = () => {
        const result = schema.safeParse(form);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    return {
        form,
        setForm,
        errors,
        handleChange,
        validate,
    };
}