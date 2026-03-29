
import { ChangeEvent, FormEvent } from "react";

export interface Providers {
    id?: number;
    name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
}
export interface ProviderFormState {
    id?: number;
    name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
}

export interface ProvidersFormProps {
    form: ProviderFormState;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => Promise<void>;
    submitLabel?: string;
    errors: Record<string, string[] | undefined>;
}

export interface ProvidersEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: ProviderFormState;
    onChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface ProvidersFormProps {
    form: ProviderFormState;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => Promise<void>;
    submitLabel?: string;
}


export interface ProvidersTableProps {
    providers: Providers[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}