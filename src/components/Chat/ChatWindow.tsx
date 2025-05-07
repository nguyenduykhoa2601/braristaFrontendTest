import React, { useEffect, useState, KeyboardEvent, useRef } from 'react';
import styled from 'styled-components';
import {
  Box, Text, Input, Button, Flex, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, IconButton, Image, Progress
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  CloseIcon,
  MinusIcon,
  ChatIcon,
  ArrowUpIcon
} from '@chakra-ui/icons';
import { sendMessage, getHistory, setLanguage, getTranslations, translations } from '../../services/chat';
import bandPullsFar from '../../assets/images/band-pulls-far.png';
import bandLooksGood from '../../assets/images/band-looks-good.png';
import bandMeasurementExample from '../../assets/images/band-measurement-example.png'
import bandPullsOkay from '../../assets/images/band-pulls-okay.png'

// Configuration for which pages the chat should open automatically
const AUTO_OPEN_ON_PAGES = [2, 4];

const ChatContainer = styled(Box) <{ isOpen: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: ${props => props.isOpen ? '350px' : '60px'};
  height: ${props => props.isOpen ? '500px' : '60px'};
  background-color: white;
  border-radius: ${props => props.isOpen ? '8px' : '50%'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;

  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '100%' : '60px'};
    height: ${props => props.isOpen ? '100%' : '60px'};
    bottom: ${props => props.isOpen ? '0' : '20px'};
    right: ${props => props.isOpen ? '0' : '20px'};
    border-radius: ${props => props.isOpen ? '0' : '50%'};
  }
`;

const ChatHeader = styled(Box)`
  padding: 15px;
  background-color: #68D391;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatBody = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden;
`;

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled(Box)`
  padding: 10px 15px;
  background-color: white;
  border-top: 1px solid #eee;
`;

const ChatFooter = styled(Box)`
  padding: 8px 15px;
  text-align: center;
  background-color: #f8f8f8;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #888;
`;

const FormInput = styled(Input)`
  background-color: white;
  border: 1px solid #E2E8F0;
  margin-bottom: 15px;
`;

const BackButton = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #2D3748;
  margin-bottom: 15px;
  cursor: pointer;
  
  &:hover {
    color: #1A202C;
  }
`;

// Types for the component
type Msg = {
  id: number;
  text: string;
  sender: string;
  timestamp: number;
  type?: string;
};

type FormDataType = {
  band: string;
  cup: string;
  system: string;
};

// Type guard to check if a key exists in translations
function isValidLanguageKey(key: string): key is keyof typeof translations {
  return key in translations;
}

export const ChatWindow: React.FC<{ page: number }> = ({ page }) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLangModal, setShowLangModal] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({ band: '', cup: '', system: '' });
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Get translations
  const t = getTranslations();

  // Make sure language selection shows up initially
  useEffect(() => {
    setShowLangModal(true);
  }, []);

  useEffect(() => {
    // Auto-open chat if configured for this page
    if (AUTO_OPEN_ON_PAGES.includes(page)) {
      setIsOpen(true);
    }

    // Load chat history
    const history = getHistory();
    setMessages(history);
  }, [page]);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLangSelect = (langCode: string) => {
    if (isValidLanguageKey(langCode)) {
      setLanguage(langCode);
    }
    setShowLangModal(false);
    setIsOpen(true);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  async function sendMessageToBot() {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const userMessage = {
        id: Date.now(),
        text: inputText,
        sender: 'user',
        timestamp: Date.now()
      };

      // Add user message to chat
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Send message to bot and get response
      const response = await sendMessage(inputText);
      setMessages(prevMessages => [...prevMessages, response]);
    } catch (err) {
      setError('Failed to send message');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageToBot();
    }
  };

  // Handle quiz step navigation
  const goToQuizStep = (step: number) => {
    setQuizStep(step);
  };

  // Handle quiz answer submission - this would trigger the real quiz if needed
  const submitQuizAnswer = () => {
    setInputText('start quiz');
    sendMessageToBot();
  };

  // Render the quiz UI based on Figma designs
  const renderQuizUI = () => {
    switch (quizStep) {
      case 0:
        return (
          <Box p={4} bg="green.50" borderRadius="md" width="100%">
            <BackButton>
              <ChevronLeftIcon mr={1} boxSize={4} />
              {t.back}
            </BackButton>

            <Text fontWeight="bold" fontSize="lg" mb={3}>
              {t.letsGetReady}
            </Text>
            <Text mb={4}>
              {t.grabBra}
            </Text>

            <Box display="flex" columnGap={4} justifyContent="space-between">
              <Box>
                <Text mb={2}>{t.typeBandSize}</Text>

                <FormInput
                  value={formData.band}
                  onChange={(e) => setFormData({ ...formData, band: e.target.value })}
                  placeholder="32, 34, 36, etc."
                  autoFocus
                />
              </Box>

              <Box>
                <Text mb={2}>{t.typeCupSize}</Text>

                <FormInput
                  value={formData.cup}
                  onChange={(e) => setFormData({ ...formData, cup: e.target.value })}
                  placeholder="A, B, C, D, etc."
                />
              </Box>

            </Box>

            <Text mb={2}>{t.selectSystem}</Text>
            <FormInput
              mb={4}
              value={formData.system}
              onChange={(e) => setFormData({ ...formData, system: e.target.value })}
              placeholder="US, UK, EU, etc."
            />

            <Button
              width="100%"
              bg="#2F4F2F"
              color="white"
              _hover={{ bg: "#3E6E3E" }}
              onClick={() => {
                if (formData.band && formData.cup && formData.system) {
                  goToQuizStep(1);
                } else {
                  setError("Please fill out all fields");
                  setTimeout(() => setError(null), 3000);
                }
              }}
              isDisabled={!formData.band || !formData.cup || !formData.system}
            >
              {t.submit}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box p={4} bg="green.50" borderRadius="md" width="100%">
            <BackButton onClick={() => goToQuizStep(0)}>
              <ChevronLeftIcon mr={1} boxSize={4} />
              {t.back}
            </BackButton>

            <Text fontWeight="bold" fontSize="lg" mb={3}>
              {t.everydayBra}
            </Text>

            <Button
              width="100%"
              bg="#2F4F2F"
              color="white"
              _hover={{ bg: "#3E6E3E" }}
              mb={2}
              onClick={() => goToQuizStep(2)}
            >
              {t.yes}
            </Button>

            <Button
              width="100%"
              bg="#2F4F2F"
              color="white"
              _hover={{ bg: "#3E6E3E" }}
              onClick={() => goToQuizStep(2)}
            >
              {t.no}
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box p={4} bg="green.50" borderRadius="md" width="100%">
            <BackButton onClick={() => goToQuizStep(1)}>
              <ChevronLeftIcon mr={1} boxSize={4} />
              {t.back}
            </BackButton>

            <Text fontWeight="bold" fontSize="lg" mb={3}>
              {t.bandSizeMeasurement}
            </Text>
            <Text mb={3} fontSize="sm">
              {t.bandMeasureInstructions}
            </Text>

            {/* Image placeholder - would be replaced with actual image */}
            <Box
              bg="gray.200"
              mb={4}
              borderRadius="md"
              position="relative"
              overflow="hidden"
            >
              <Image
                src={bandMeasurementExample}
                alt="Band measurement example"
                width="100%"
                height="250px"
                objectFit="cover"
              />

            </Box>

            <Button
              width="100%"
              bg="#2F4F2F"
              color="white"
              _hover={{ bg: "#3E6E3E" }}
              onClick={() => goToQuizStep(3)}
            >
              {t.proceed}
            </Button>
          </Box>
        );

      case 3:
        return (
          <Box p={4} bg="green.50" borderRadius="md" width="100%">
            <BackButton onClick={() => goToQuizStep(2)}>
              <ChevronLeftIcon mr={1} boxSize={4} />
              {t.back}
            </BackButton>

            <Text fontWeight="bold" fontSize="lg" mb={3}>
              {t.bandPullQuestion}
            </Text>

            {/* Grid for image options */}
            <Box
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              gap={4}
              mb={4}
            >
              {/* Band pulls far */}
              <Box>
                <Image
                  src={bandPullsFar}
                  alt="Band pulls far"
                  width="100%"
                  height="140px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box
                  mt={2}
                  textAlign="center"
                  bg="#2F4F2F"
                  color="white"
                  borderRadius="full"
                  py={1}
                  fontSize="sm"
                >
                  {t.bandPullsFar}
                </Box>
              </Box>

              {/* Band looks good */}
              <Box>
                <Image
                  src={bandLooksGood}
                  alt="Band looks good"
                  width="100%"
                  height="140px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box
                  mt={2}
                  textAlign="center"
                  bg="#2F4F2F"
                  color="white"
                  borderRadius="full"
                  py={1}
                  fontSize="sm"
                >
                  {t.bandLooksGood}
                </Box>
              </Box>

              {/* Band pulls okay */}
              <Box>
                <Image
                  src={bandPullsOkay}
                  alt="Band pulls okay"
                  width="100%"
                  height="140px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box
                  mt={2}
                  textAlign="center"
                  bg="#2F4F2F"
                  color="white"
                  borderRadius="full"
                  py={1}
                  fontSize="sm"
                >
                  {t.bandPullsOkay}
                </Box>
              </Box>
            </Box>


            <Button
              width="100%"
              bg="#2F4F2F"
              color="white"
              _hover={{ bg: "#3E6E3E" }}
              mb={2}
              onClick={() => submitQuizAnswer()}
            >
              {t.bandPullsFar}
            </Button>

            <Button
              width="100%"
              bg="#2F4F2F"
              color="white"
              _hover={{ bg: "#3E6E3E" }}
              mb={2}
              onClick={() => submitQuizAnswer()}
            >
              {t.bandLooksGood}
            </Button>

            <Button
              width="100%"
              bg="#2F4F2F"
              color="white"
              _hover={{ bg: "#3E6E3E" }}
              onClick={() => submitQuizAnswer()}
            >
              {t.bandPullsOkay}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  // Render message or quiz content
  const renderMessageContent = (msg: Msg) => {
    if (msg.type === 'quiz' || msg.type === 'quiz-result') {
      return (
        <Text whiteSpace="pre-line">{msg.text}</Text>
      );
    }

    return <Text>{msg.text}</Text>;
  };

  // If showing language selection modal
  if (showLangModal) {
    return (
      <Modal
        isOpen={true}
        onClose={() => { }}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Language</ModalHeader>
          <ModalBody pb={6}>
            {Object.keys(translations).map((langCode, i) => {
              if (isValidLanguageKey(langCode)) {
                return (
                  <Button
                    key={langCode}
                    w="100%"
                    mb={2}
                    onClick={() => handleLangSelect(langCode)}
                    colorScheme="green"
                  >
                    {i + 1}. {translations[langCode].chatHeader}
                  </Button>
                );
              }
              return null;
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  // Chat UI (either minimized or expanded)
  return (
    <ChatContainer isOpen={isOpen}>
      {!isOpen ? (
        // Minimized chat bubble
        <IconButton
          icon={<ChatIcon />}
          aria-label="Open chat"
          size="lg"
          colorScheme="green"
          width="100%"
          height="100%"
          borderRadius="50%"
          onClick={toggleChat}
        />
      ) : (
        // Expanded chat UI
        <>
          <ChatHeader data-testid="chat-header">
            <Text fontSize={18} color={"black"} fontWeight={700} >Lemon-Aide</Text>

            <Flex>
              <IconButton
                icon={<MinusIcon />}
                aria-label="Minimize"
                size="sm"
                variant="ghost"
                colorScheme="whiteAlpha"
                onClick={toggleChat}
              />

              <IconButton
                icon={<CloseIcon />}
                aria-label="Close"
                size="sm"
                variant="ghost"
                colorScheme="whiteAlpha"
                mr={1}
                onClick={toggleChat}
              />

            </Flex>
          </ChatHeader>

          <ChatBody>
            <MessageContainer ref={messageContainerRef}>
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  mb={2}
                  p={3}
                  bg={msg.sender === 'bot' ? 'gray.100' : 'green.100'}
                  borderRadius="lg"
                  maxW="85%"
                  ml={msg.sender === 'bot' ? 0 : 'auto'}
                  boxShadow="0 1px 2px rgba(0,0,0,0.05)"
                >
                  {renderMessageContent(msg)}
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {new Date(msg.timestamp).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                  </Text>
                </Box>
              ))}

              {messages.length === 0 && (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  height="100%"
                  p={4}
                >
                  <Box
                    p={3}
                    bg="green.100"
                    borderRadius="lg"
                    maxW="85%"
                    ml="auto"
                    boxShadow="0 1px 2px rgba(0,0,0,0.05)"
                    mb={2}
                  >
                    <Text>{t.takeFittingQuiz}</Text>

                    <Text fontSize="xs" color="gray.500" mt={1}>
                      23 Dec 03:22 PM
                    </Text>
                  </Box>

                  <Box position="relative" mb={2} width="100%">
                    <Progress
                      value={(quizStep + 1) / 4 * 100}
                      size="sm"
                      mt={2}
                      sx={{
                        '& > div': {
                          backgroundColor: '#2F4F2F',
                        },
                      }}
                    />
                  </Box>


                  {renderQuizUI()}
                </Flex>
              )}
            </MessageContainer>

            <InputWrapper>
              <Flex overflow="hidden" columnGap={1}>
                <Input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything"
                  disabled={isLoading}
                  _focus={{ boxShadow: "none" }}
                  borderRadius="full"
                  border="1px solid #E2E8F0"
                />

                <IconButton
                  aria-label="Send"
                  icon={<ArrowUpIcon color="black" />}
                  colorScheme="green"
                  borderRadius="50"
                  onClick={sendMessageToBot}
                  isLoading={isLoading}
                />
              </Flex>

              {error && <Text color="red.500" mt={1} fontSize="sm">{error}</Text>}
            </InputWrapper>
          </ChatBody>

          <ChatFooter>
            Powered by <Text
              as="span"
              fontWeight="bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "0.5px"
              }}
              display="inline-block"
            >
              brarista
            </Text>
          </ChatFooter>
        </>
      )}
    </ChatContainer>
  );
};