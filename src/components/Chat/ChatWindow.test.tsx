import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, describe, test, beforeEach, vi } from 'vitest';
import { ChatWindow } from './ChatWindow';
import * as chatService from '../../services/chat';

// Mock the chat service
vi.mock('../../services/chat', () => ({
  sendMessage: vi.fn(),
  getHistory: vi.fn(() => []),
  ChatUtils: {
    getCurrentQuestionIndex: vi.fn(() => 1),
    getTotalQuestions: vi.fn(() => 3),
    isQuizActive: vi.fn(() => false)
  },
  setLanguage: vi.fn(),
  getTranslations: vi.fn(() => ({
    chatHeader: 'Test Header',
    inputPlaceholder: 'Ask me anything',
    send: 'Send',
    back: 'Back',
    submit: 'Submit',
    yes: 'Yes',
    no: 'No',
    proceed: 'Proceed',
    letsGetReady: "Let's get you ready!",
    grabBra: "Grab your best-fitting bra",
    typeBandSize: "Type Band Size:",
    typeCupSize: "Type Cup Size:",
    selectSystem: "Select a sizing system:",
    takeFittingQuiz: 'Take a bra fitting quiz',
    bandPullsFar: 'Band pulls far',
    bandLooksGood: 'Band looks good',
    bandPullsOkay: 'Band pulls okay',
    everydayBra: 'Is this your everyday bra',
    bandSizeMeasurement: 'Band size measurement',
    bandMeasureInstructions: 'Instructions',
    bandPullQuestion: 'Pull band question'
  })),
  translations: {
    en: { chatHeader: 'English Header' },
    es: { chatHeader: 'Spanish Header' }
  }
}));

describe('ChatWindow Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders language selection modal initially', () => {
    render(<ChatWindow page={1} />);
    expect(screen.getByText('Select Language')).toBeInTheDocument();
  });

  test('selects language and closes modal on button click', async () => {
    render(<ChatWindow page={1} />);
    fireEvent.click(screen.getByText('1. English Header'));
    await waitFor(() => {
      expect(chatService.setLanguage).toHaveBeenCalledWith('en');
    });
  });

  test('auto-opens on configured pages', async () => {
    // Test page 1 (should not auto-open)
    const { unmount } = render(<ChatWindow page={1} />);

    // Close language modal first
    fireEvent.click(screen.getByText('1. English Header'));

    // Manually close the chat since it opens after language selection
    const minimizeButton = await screen.findByLabelText('Minimize');
    fireEvent.click(minimizeButton);

    // Check chat is closed on page 1
    expect(screen.queryByText('Lemon-Aide')).not.toBeInTheDocument();

    // Unmount and render on page 2
    unmount();
    render(<ChatWindow page={2} />);

    // Close language modal
    fireEvent.click(screen.getByText('1. English Header'));

    // Chat should be open on page 2
    expect(screen.getByText('Lemon-Aide')).toBeInTheDocument();
  });

  test('toggles chat open/close when clicking minimize', async () => {
    render(<ChatWindow page={2} />);

    // Close language modal first
    fireEvent.click(screen.getByText('1. English Header'));

    // Chat should be open on page 2
    expect(screen.getByText('Lemon-Aide')).toBeInTheDocument();

    // Click minimize button
    fireEvent.click(screen.getByLabelText('Minimize'));

    // Chat should be minimized
    await waitFor(() => {
      expect(screen.queryByText('Lemon-Aide')).not.toBeInTheDocument();
    });

    // Click to open again
    fireEvent.click(screen.getByLabelText('Open chat'));

    // Chat should be open
    await waitFor(() => {
      expect(screen.getByText('Lemon-Aide')).toBeInTheDocument();
    });
  });

  test('submits messages when user types and sends', async () => {
    vi.mocked(chatService.sendMessage).mockResolvedValue({
      id: 1,
      text: 'Bot response',
      sender: 'bot',
      timestamp: Date.now()
    });

    render(<ChatWindow page={2} />);

    // Close language modal first
    fireEvent.click(screen.getByText('1. English Header'));

    // Type a message
    const input = screen.getByPlaceholderText('Ask me anything');
    fireEvent.change(input, { target: { value: 'Hello' } });

    // Send message
    fireEvent.click(screen.getByLabelText('Send'));

    // Check if sendMessage was called
    await waitFor(() => {
      expect(chatService.sendMessage).toHaveBeenCalledWith('Hello');
    });

    // Check if bot response is shown
    await waitFor(() => {
      expect(screen.getByText('Bot response')).toBeInTheDocument();
    });
  });

  // Modified quiz form test to match component behavior
  test('quiz steps navigate correctly', async () => {
    // Mock submitQuizAnswer to return a response with form validation message
    vi.mocked(chatService.sendMessage).mockResolvedValue({
      id: 1,
      text: "Let's get you ready!",
      sender: 'bot',
      timestamp: Date.now()
    });

    render(<ChatWindow page={2} />);

    // Close language modal first
    fireEvent.click(screen.getByText('1. English Header'));

    // Render a default empty message to show the quiz UI
    const emptyFeedback = {
      id: 999,
      text: 'Take a bra fitting quiz',
      sender: 'bot',
      timestamp: Date.now()
    };
    vi.spyOn(chatService, 'getHistory').mockReturnValue([emptyFeedback]);

    // Force re-render to show the quiz UI
    screen.getByText('Take a bra fitting quiz');

    // Verify the first quiz step appears
    await waitFor(() => {
      expect(screen.getByText("Let's get you ready!")).toBeInTheDocument();
    });

    // Verify form fields are present
    expect(screen.getByText("Type Band Size:")).toBeInTheDocument();
    expect(screen.getByText("Type Cup Size:")).toBeInTheDocument();
    expect(screen.getByText("Select a sizing system:")).toBeInTheDocument();

    // Submit button should be disabled since fields are empty
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();

    // Fill the forms
    fireEvent.change(screen.getByPlaceholderText('32, 34, 36, etc.'), {
      target: { value: '34' }
    });
    fireEvent.change(screen.getByPlaceholderText('A, B, C, D, etc.'), {
      target: { value: 'B' }
    });
    fireEvent.change(screen.getByPlaceholderText('US, UK, EU, etc.'), {
      target: { value: 'US' }
    });

    // Submit button should be enabled now
    expect(submitButton).not.toBeDisabled();

    // Click submit
    fireEvent.click(submitButton);

    // Should move to next step - mock that the everydayBra question appears
    vi.mocked(chatService.sendMessage).mockResolvedValue({
      id: 2,
      text: 'Is this your everyday bra',
      sender: 'bot',
      timestamp: Date.now()
    });

    // Verify we show the everyday bra question
    await waitFor(() => {
      expect(screen.getByText('Is this your everyday bra')).toBeInTheDocument();
    });
  });
});