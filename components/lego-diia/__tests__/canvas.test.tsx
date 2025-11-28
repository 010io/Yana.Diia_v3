import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Canvas, LegoComponentItem } from '../canvas'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, ...props }: any) => (
      <div onClick={onClick} className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('Canvas Component', () => {
  const mockItems: LegoComponentItem[] = [
    { id: 'header', uniqueId: 1, name: 'Header', category: 'layout', props: { title: 'Test Header' } },
    { id: 'input', uniqueId: 2, name: 'Input', category: 'form', props: { placeholder: 'Enter text' } },
    { id: 'action-button', uniqueId: 3, name: 'Next Button', category: 'action', props: { text: 'Next' } },
    { id: 'info', uniqueId: 4, name: 'Info Card', category: 'info', props: { title: 'Info' } },
  ]

  const mockHandlers = {
    onDrop: jest.fn(),
    onRemove: jest.fn(),
    onSelect: jest.fn(),
    onReorder: jest.fn(),
    onExecute: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders items correctly', () => {
    render(<Canvas items={mockItems} selectedItem={null} {...mockHandlers} />)
    
    expect(screen.getByText('Test Header')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    expect(screen.getByText('Next Button')).toBeInTheDocument()
    // Info card is on the second screen, so it shouldn't be visible initially
    expect(screen.queryByText('Info')).not.toBeInTheDocument()
  })

  it('splits screens based on action button', () => {
    render(<Canvas items={mockItems} selectedItem={null} {...mockHandlers} />)
    
    // Check for navigation buttons
    const nextButton = screen.getByLabelText('Next screen')
    expect(nextButton).toBeInTheDocument()
    
    // Navigate to next screen
    fireEvent.click(nextButton)
    
    // Now Info card should be visible
    expect(screen.getByText('Info')).toBeInTheDocument()
    // And Header should be gone
    expect(screen.queryByText('Test Header')).not.toBeInTheDocument()
  })

  it('calls onExecute when execute button is clicked', () => {
    render(<Canvas items={mockItems} selectedItem={null} {...mockHandlers} />)
    
    const executeButton = screen.getByText('Запустити прототип')
    fireEvent.click(executeButton)
    
    expect(mockHandlers.onExecute).toHaveBeenCalled()
  })

  it('shows loading state when executing', () => {
    render(<Canvas items={mockItems} selectedItem={null} {...mockHandlers} isExecuting={true} />)
    
    expect(screen.getByText('Обробка...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Обробка.../i })).toBeDisabled()
  })
})
