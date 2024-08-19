import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConnectWidget from '../components/ConnectWidget';

const defaultIP = '127.0.0.1';
const mockConnectFunction = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ConnectWidget Component', () => {
    test('should render correctly with provided props', () => {
        render(<ConnectWidget connectFunction={ mockConnectFunction } />);
        
        const ipInput = screen.getByRole('textbox');
        const connectButton = screen.getByRole('button');

        expect(ipInput).toBeInTheDocument();
        expect(connectButton).toBeInTheDocument();
    });

    test('should initialize with empty field and enabled button', () => {
        render(<ConnectWidget connectFunction={ mockConnectFunction } />);

        const ipInput = screen.getByRole('textbox');
        const connectButton = screen.getByRole('button');

        expect(ipInput).toHaveValue('');
        expect(connectButton).toBeEnabled();
    });

    test('should update state on input change', () => {
        render(<ConnectWidget connectFunction={ mockConnectFunction } />);

        const ipInput = screen.getByRole('textbox');

        fireEvent.change(ipInput, { target: { value: defaultIP }});
        expect(ipInput).toHaveValue(defaultIP);
    });

    test('should send correct message when button is clicked', () => {
        render(<ConnectWidget connectFunction={ mockConnectFunction } />);

        const ipInput = screen.getByRole('textbox');
        const connectButton = screen.getByRole('button');

        fireEvent.change(ipInput, { target: { value: defaultIP }});
        fireEvent.click(connectButton);

        expect(mockConnectFunction).toHaveBeenCalledTimes(1);
        expect(mockConnectFunction).toHaveBeenCalledWith('wss://' + defaultIP + ':3004');
    });

    test('should handle empty input gracefully', () => {
        render(<ConnectWidget connectFunction={ mockConnectFunction } />);

        const ipInput = screen.getByRole('textbox');
        const connectButton = screen.getByRole('button');

        fireEvent.change(ipInput, { target: { value: '' }});
        fireEvent.click(connectButton);

        expect(mockConnectFunction).toHaveBeenCalledTimes(1);
        expect(mockConnectFunction).toHaveBeenCalledWith('wss://:3004');
    });

    test('should call connectFunction before button click', () => {
        render(<ConnectWidget connectFunction={ mockConnectFunction } />);

        expect(mockConnectFunction).not.toHaveBeenCalled();
    });
});