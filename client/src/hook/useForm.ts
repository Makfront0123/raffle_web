import { useState } from "react";

export const useForm = <T>(initialState: T, validate?: (values: T) => void) => {
    const [form, setForm] = useState<T>(initialState);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const resetForm = () => setForm(initialState);

    const getValidatedPayload = () => {
        if (validate) validate(form);
        return form;
    };

    return { form, setForm, handleChange, resetForm, getValidatedPayload };
};
