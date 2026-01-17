"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: readonly Option[] | Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    label,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const onClose = () => setIsOpen(false);

    // Outside click handler
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: Event) => {
            const target = event.target as Node;
            if (selectRef.current && !selectRef.current.contains(target)) {
                onClose();
            }
        };

        const handleEscape = (ev: KeyboardEvent) => {
            if (ev.key === 'Escape') onClose();
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="relative" ref={selectRef}>
            {label && (
                <label className="block text-sm text-zinc-300 mb-2">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-zinc-600
                    hover:bg-zinc-700 transition-colors
                    flex items-center justify-between
                    ${className}
                `}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span>{selectedOption?.label || 'Select option'}</span>
                <ChevronDown 
                    className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    role="listbox"
                    aria-label={label || 'Options'}
                >
                    {options.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                onClose();
                            }}
                            className={`
                                w-full px-3 py-2 text-left text-sm transition-colors
                                ${option.value === value
                                    ? 'bg-zinc-700 text-white'
                                    : 'text-zinc-300 hover:bg-zinc-700/50'
                                }
                            `}
                            role="option"
                            aria-selected={option.value === value}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;