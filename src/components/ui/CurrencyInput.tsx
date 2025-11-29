import React, { useState, useEffect } from 'react';
import { Input } from './Input';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    label: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
    fullWidth?: boolean;
}

export function CurrencyInput({ label, value, onChange, error, fullWidth, ...props }: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState('');

    // Formata o valor numérico para string de moeda ao carregar ou mudar externamente
    useEffect(() => {
        if (value !== undefined && !isNaN(value)) {
            setDisplayValue(formatCurrencyDisplay(value));
        }
    }, [value]);

    const formatCurrencyDisplay = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(val);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove tudo que não for dígito
        const rawValue = e.target.value.replace(/\D/g, '');

        // Converte para número (divide por 100 para considerar os centavos)
        const numericValue = Number(rawValue) / 100;

        onChange(numericValue);
    };

    return (
        <Input
            label={label}
            value={displayValue}
            onChange={handleChange}
            error={error}
            fullWidth={fullWidth}
            {...props}
            type="text" // Força texto para permitir formatação
            inputMode="numeric" // Teclado numérico no mobile
        />
    );
}
