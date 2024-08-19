import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScoreWidget from '../components/ScoreWidget';
import { NetworkingManager } from '../networking/NetworkingManager';
import { Message } from '../schema/dot-dschema/message';

const mockOn = jest.fn();
const mockOff = jest.fn();
const mockNetworkingManager = {
    on: mockOn,
    off: mockOff
} as unknown as NetworkingManager;

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ScoreWidget Component', () => {
    test('should render correctly with provided props', () => {
        render(<ScoreWidget inNetworkingManager={ mockNetworkingManager } />);

        const scoreText = screen.getByText(/Score/);

        expect(scoreText).toBeInTheDocument();
    });

    test('should register event listeners on mount', () => {
        render(<ScoreWidget inNetworkingManager={ mockNetworkingManager }/>);
        
        expect(mockOn).toHaveBeenCalledWith(Message.ScoreUpdateResponse.toString(), expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith(Message.MediaPlaneToMobileLoginResponse.toString(), expect.any(Function));
    });

    test('should unregister event listeners on unmount', () => {
        const {unmount} = render(<ScoreWidget inNetworkingManager={ mockNetworkingManager }/>);

        unmount();

        expect(mockOff).toHaveBeenCalledWith(Message.ScoreUpdateResponse.toString(), expect.any(Function));
        expect(mockOff).toHaveBeenCalledWith(Message.MediaPlaneToMobileLoginResponse.toString(), expect.any(Function));
    });

    test('should update score when ScoreUpdateResponse event is triggered', async () => {
        const scoreIncrement = 100;

        mockOn.mockImplementationOnce((event, callback) => {
            if (event === Message.ScoreUpdateResponse.toString()) {
                setTimeout(() => callback(scoreIncrement), 0);
            }
        });

        render(<ScoreWidget inNetworkingManager={ mockNetworkingManager } />);

        await waitFor(() => {
            const scoreText = screen.getByText(/100/);
            expect(scoreText).toBeInTheDocument();
        });
    });

    test('should reset score when MediaPlaneToMobileLoginResponse event is triggered', async () => {
        const scoreIncrement = 100;

        render(<ScoreWidget inNetworkingManager={ mockNetworkingManager }/>);

        mockOn.mockImplementationOnce((event, callback) => {
            if (event === Message.ScoreUpdateResponse.toString()) {
                setTimeout(() => callback(scoreIncrement), 0);
            }
        });

        mockOn.mock.calls.forEach(([event, callback]) => {
            if (event === Message.ScoreUpdateResponse.toString()) {
                setTimeout(() => callback(scoreIncrement), 0);
            }
        });

        await waitFor(() => {
            const scoreText = screen.getByText(new RegExp(`${scoreIncrement}`));
            expect(scoreText).toBeInTheDocument();
        });

        mockOff.mockImplementationOnce((event, callback) => {
            if (event == Message.MediaPlaneToMobileLoginResponse.toString()) {
                setTimeout(() => callback(), 0);
            }
        });

        mockOff.mock.calls.forEach(([event, callback]) => {
            if (event == Message.MediaPlaneToMobileLoginResponse.toString()) {
                setTimeout(() => callback(), 0);
            }
        });

        await waitFor(() => {
            const scoreText = screen.getByText(/0/);
            expect(scoreText).toBeInTheDocument();
        });
    });
});