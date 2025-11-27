import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select Component', () => {
    const mockOptions = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
    ];

    describe('Renderização', () => {
        it('deve renderizar select', () => {
            render(<Select options={mockOptions} />);
            const select = screen.getByRole('combobox');
            expect(select).toBeInTheDocument();
            expect(select.tagName).toBe('SELECT');
        });

        it('deve renderizar com label', () => {
            render(<Select label="Choose option" options={mockOptions} />);
            expect(screen.getByText('Choose option')).toBeInTheDocument();
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        it('deve associar label ao select via htmlFor', () => {
            render(<Select label="Category" id="category-select" options={mockOptions} />);
            const label = screen.getByText('Category');
            const select = screen.getByRole('combobox');
            expect(label).toHaveAttribute('for', 'category-select');
            expect(select).toHaveAttribute('id', 'category-select');
        });

        it('deve gerar ID automático quando não fornecido', () => {
            render(<Select label="Auto ID" options={mockOptions} />);
            const select = screen.getByRole('combobox');
            expect(select).toHaveAttribute('id');
            expect(select.id).toBeTruthy();
        });
    });

    describe('Opções', () => {
        it('deve renderizar todas as opções', () => {
            render(<Select options={mockOptions} />);
            mockOptions.forEach(option => {
                expect(screen.getByText(option.label)).toBeInTheDocument();
            });
        });

        it('deve renderizar opção placeholder', () => {
            render(<Select options={mockOptions} placeholder="Select an option" />);
            expect(screen.getByText('Select an option')).toBeInTheDocument();
        });

        it('deve desabilitar opção placeholder', () => {
            render(<Select options={mockOptions} placeholder="Select" />);
            const placeholderOption = screen.getByText('Select') as HTMLOptionElement;
            expect(placeholderOption).toBeDisabled();
        });

        it('deve renderizar opções vazias', () => {
            render(<Select options={[]} />);
            const select = screen.getByRole('combobox');
            expect(select.children).toHaveLength(0);
        });

        it('deve renderizar opções com disabled', () => {
            const optionsWithDisabled = [
                { value: '1', label: 'Enabled' },
                { value: '2', label: 'Disabled', disabled: true },
            ];

            render(<Select options={optionsWithDisabled} />);
            const disabledOption = screen.getByText('Disabled') as HTMLOptionElement;
            expect(disabledOption).toBeDisabled();
        });
    });

    describe('Estados', () => {
        it('deve mostrar mensagem de erro', () => {
            render(<Select options={mockOptions} error="Invalid selection" />);
            expect(screen.getByText('Invalid selection')).toBeInTheDocument();
        });

        it('deve aplicar estilo de erro quando error está presente', () => {
            render(<Select options={mockOptions} error="Error" />);
            const select = screen.getByRole('combobox');
            expect(select).toHaveClass('border-red-500');
        });

        it('deve desabilitar quando disabled=true', () => {
            render(<Select options={mockOptions} disabled />);
            const select = screen.getByRole('combobox');
            expect(select).toBeDisabled();
            expect(select).toHaveClass('opacity-50', 'cursor-not-allowed');
        });

        it('deve marcar como required', () => {
            render(<Select options={mockOptions} required />);
            const select = screen.getByRole('combobox');
            expect(select).toBeRequired();
        });

        it('deve mostrar asterisco quando required', () => {
            render(<Select label="Required Field" options={mockOptions} required />);
            expect(screen.getByText('*')).toBeInTheDocument();
        });
    });

    describe('Largura completa', () => {
        it('deve aplicar largura completa quando fullWidth=true', () => {
            render(<Select options={mockOptions} fullWidth />);
            const container = screen.getByRole('combobox').parentElement;
            expect(container).toHaveClass('w-full');
        });

        it('não deve aplicar largura completa por padrão', () => {
            render(<Select options={mockOptions} />);
            const container = screen.getByRole('combobox').parentElement;
            expect(container).not.toHaveClass('w-full');
        });
    });

    describe('Interações', () => {
        it('deve chamar onChange quando seleção muda', async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            render(<Select options={mockOptions} onChange={handleChange} />);
            const select = screen.getByRole('combobox');

            await user.selectOptions(select, '2');
            expect(handleChange).toHaveBeenCalled();
        });

        it('deve atualizar valor controlado', async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            const { rerender } = render(
                <Select options={mockOptions} value="" onChange={handleChange} />
            );
            const select = screen.getByRole('combobox') as HTMLSelectElement;

            expect(select.value).toBe('');

            await user.selectOptions(select, '1');

            rerender(<Select options={mockOptions} value="1" onChange={handleChange} />);
            expect(select.value).toBe('1');
        });

        it('deve chamar onBlur quando perde foco', async () => {
            const handleBlur = vi.fn();
            const user = userEvent.setup();

            render(<Select options={mockOptions} onBlur={handleBlur} />);
            const select = screen.getByRole('combobox');

            await user.click(select);
            await user.tab();

            expect(handleBlur).toHaveBeenCalledTimes(1);
        });

        it('deve chamar onFocus quando ganha foco', async () => {
            const handleFocus = vi.fn();
            const user = userEvent.setup();

            render(<Select options={mockOptions} onFocus={handleFocus} />);
            const select = screen.getByRole('combobox');

            await user.click(select);
            expect(handleFocus).toHaveBeenCalledTimes(1);
        });
    });

    describe('Valor padrão', () => {
        it('deve definir valor padrão', () => {
            render(<Select options={mockOptions} defaultValue="2" />);
            const select = screen.getByRole('combobox') as HTMLSelectElement;
            expect(select.value).toBe('2');
        });

        it('deve usar placeholder como valor padrão quando não especificado', () => {
            render(<Select options={mockOptions} placeholder="Select" />);
            const select = screen.getByRole('combobox') as HTMLSelectElement;
            expect(select.value).toBe('');
        });
    });

    describe('Acessibilidade', () => {
        it('deve ter aria-invalid quando há erro', () => {
            render(<Select options={mockOptions} error="Error" />);
            const select = screen.getByRole('combobox');
            expect(select).toHaveAttribute('aria-invalid', 'true');
        });

        it('deve ter aria-describedby quando há erro', () => {
            render(<Select options={mockOptions} error="Error" id="test-select" />);
            const select = screen.getByRole('combobox');
            expect(select).toHaveAttribute('aria-describedby');
        });

        it('deve aceitar aria-label', () => {
            render(<Select options={mockOptions} aria-label="Category selector" />);
            const select = screen.getByLabelText('Category selector');
            expect(select).toBeInTheDocument();
        });

        it('deve ter aria-required quando required', () => {
            render(<Select options={mockOptions} required />);
            const select = screen.getByRole('combobox');
            expect(select).toHaveAttribute('aria-required', 'true');
        });
    });

    describe('Helper text', () => {
        it('deve exibir helper text', () => {
            render(<Select options={mockOptions} helperText="Choose your category" />);
            expect(screen.getByText('Choose your category')).toBeInTheDocument();
        });

        it('deve priorizar erro sobre helper text', () => {
            render(
                <Select
                    options={mockOptions}
                    helperText="Helper"
                    error="Error message"
                />
            );

            expect(screen.getByText('Error message')).toBeInTheDocument();
            expect(screen.queryByText('Helper')).not.toBeInTheDocument();
        });
    });

    describe('Grupos de opções', () => {
        it('deve renderizar optgroups', () => {
            const groupedOptions = [
                {
                    label: 'Group 1',
                    options: [
                        { value: '1', label: 'Option 1' },
                        { value: '2', label: 'Option 2' },
                    ]
                },
                {
                    label: 'Group 2',
                    options: [
                        { value: '3', label: 'Option 3' },
                    ]
                },
            ];

            render(<Select optgroups={groupedOptions} />);

            const select = screen.getByRole('combobox');
            const optgroups = select.querySelectorAll('optgroup');
            expect(optgroups).toHaveLength(2);
            expect(optgroups[0]).toHaveAttribute('label', 'Group 1');
            expect(optgroups[1]).toHaveAttribute('label', 'Group 2');
        });
    });

    describe('Múltipla seleção', () => {
        it('deve permitir múltipla seleção quando multiple=true', () => {
            render(<Select options={mockOptions} multiple />);
            const select = screen.getByRole('listbox');
            expect(select).toHaveAttribute('multiple');
        });

        it('deve selecionar múltiplas opções', async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            render(<Select options={mockOptions} multiple onChange={handleChange} />);
            const select = screen.getByRole('listbox');

            await user.selectOptions(select, ['1', '2']);
            expect(handleChange).toHaveBeenCalled();
        });
    });

    describe('Casos extremos', () => {
        it('deve lidar com muitas opções', () => {
            const manyOptions = Array.from({ length: 100 }, (_, i) => ({
                value: String(i),
                label: `Option ${i}`,
            }));

            render(<Select options={manyOptions} />);
            const select = screen.getByRole('combobox');
            expect(select.children).toHaveLength(100);
        });

        it('deve lidar com labels muito longas', () => {
            const longLabelOptions = [
                { value: '1', label: 'A'.repeat(100) },
            ];

            render(<Select options={longLabelOptions} />);
            expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
        });

        it('deve lidar com caracteres especiais em labels', () => {
            const specialOptions = [
                { value: '1', label: '<script>alert("XSS")</script>' },
            ];

            render(<Select options={specialOptions} />);
            expect(screen.getByText('<script>alert("XSS")</script>')).toBeInTheDocument();
        });
    });

    describe('Tamanhos', () => {
        it('deve aceitar size attribute', () => {
            render(<Select options={mockOptions} size={5} />);
            const select = screen.getByRole('combobox');
            expect(select).toHaveAttribute('size', '5');
        });
    });

    describe('Autofocus', () => {
        it('deve focar automaticamente quando autoFocus=true', () => {
            render(<Select options={mockOptions} autoFocus />);
            const select = screen.getByRole('combobox');
            expect(select).toHaveFocus();
        });
    });
});
