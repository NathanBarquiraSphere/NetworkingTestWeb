import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NameEntry from '../components/NameEntry';
import { NetworkingManager } from './../networking/NetworkingManager';

const defaultName = 'Lebron James';
const mockSendNameRequestString = jest.fn();
const mockNetworkingManager = {
    sendNameRequestString: mockSendNameRequestString
} as unknown as NetworkingManager;

beforeEach(() => {
    jest.clearAllMocks();
});

describe('NameEntry Component', () => {
    test('should render correctly with provided props', () => {
        render(<NameEntry inNetworkingManager={ mockNetworkingManager } />);

        const nameInput = screen.getByRole('textbox');
        const sendButton = screen.getByRole('button');

        expect(nameInput).toBeInTheDocument();
        expect(sendButton).toBeInTheDocument();
    });

    test('should update state on input change', () => {
        render(<NameEntry inNetworkingManager={ mockNetworkingManager } />);

        const nameInput = screen.getByRole('textbox');

        expect(nameInput).toBeInTheDocument();

        fireEvent.change(nameInput, { target: { value: defaultName } });

        expect(nameInput).toHaveValue(defaultName);
    });

    test('should send correct message when button is clicked', () => {
        render(<NameEntry inNetworkingManager={ mockNetworkingManager } />);

        const nameInput = screen.getByRole('textbox');
        const sendButton = screen.getByRole('button');

        fireEvent.change(nameInput, { target: { value: defaultName} });
        fireEvent.click(sendButton);

        expect(mockSendNameRequestString).toHaveBeenCalledTimes(1);
        expect(mockSendNameRequestString).toHaveBeenCalledWith(defaultName);
    });

    test('should handle empty input gracefully', () => {
        render(<NameEntry inNetworkingManager={ mockNetworkingManager } />);

        const nameInput = screen.getByRole('textbox');
        const sendButton = screen.getByRole('button');

        fireEvent.change(nameInput, { target: { value: '' }});
        fireEvent.click(sendButton);

        expect(mockSendNameRequestString).toHaveBeenCalledTimes(1);
        expect(mockSendNameRequestString).toHaveBeenCalledWith('');
    });

    test('should handle very long input correctly', () => {
        const longName = 'A'.repeat(1000);
        render(<NameEntry inNetworkingManager={ mockNetworkingManager } />);

        const nameInput = screen.getByRole('textbox');
        const sendButton = screen.getByRole('button');

        fireEvent.change(nameInput, { target: { value: longName }});
        fireEvent.click(sendButton);

        expect(mockSendNameRequestString).toHaveBeenCalledTimes(1);
        expect(mockSendNameRequestString).toHaveBeenCalledWith(longName);
    });
});