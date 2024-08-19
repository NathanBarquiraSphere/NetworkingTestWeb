import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConnectBigDomeWidget from '../components/ConnectBigDomeWidget';

const mockConnectFunction = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ConnectBigDomeWidget Component', () => {
    test('should render correctly with provided props', () => {
        render(<ConnectBigDomeWidget connectFunction={ mockConnectFunction } />);
        
        const connectButton = screen.getByRole('button');

        expect(connectButton).toBeInTheDocument();
    });

    test('should call connectFunction with correct address when button is clicked', () => {
        render(<ConnectBigDomeWidget connectFunction={ mockConnectFunction } />);

        const connectButton = screen.getByRole('button');

        fireEvent.click(connectButton);

        expect(mockConnectFunction).toHaveBeenCalledTimes(1);
        expect(mockConnectFunction).toHaveBeenCalledWith("wss://10.232.64.22:3004");
    });

    test('should not call connectFunction before button click', () => {
        render(<ConnectBigDomeWidget connectFunction={ mockConnectFunction } />);

        expect(mockConnectFunction).not.toHaveBeenCalled();
    });
});