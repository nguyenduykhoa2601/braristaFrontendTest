// chat.ts - Updated with language support and proper TypeScript typing

// Define types for better type safety
type QuizState = {
  currentQuestion: number;
  score: number;
  completed: boolean;
} | null;

type MessageType = {
  id: number;
  text: string;
  sender: string;
  timestamp: number;
  type?: string;
};

type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it';

type TranslationSet = {
  [key: string]: string;
};

type TranslationsType = {
  [key in LanguageCode]: TranslationSet;
};

type QuizQuestion = {
  question: { [key in LanguageCode]: string };
  options: { [key in LanguageCode]: string[] };
  correct: number;
};

// State variables
let messageCounter = 0;
let chatHistory: MessageType[] = [];
let currentQuiz: QuizState = null;
let currentLanguage: LanguageCode = 'en'; // Default language

// Language translations
export const translations: TranslationsType = {
  en: {
    chatHeader: 'EN',
    inputPlaceholder: 'Type your message...',
    send: 'Send',
    selectLanguage: 'Select Language',
    band: 'Band Size',
    cup: 'Cup Size', 
    system: 'Sizing System', 
    submit: 'Submit',
    quizProgress: 'Question {{current}} of {{total}}',
    takeFittingQuiz: 'Take a bra fitting quiz',
    measureInstructions: 'To measure yourself properly:',
    startQuiz: 'Start Quiz',
    quizCompleted: 'Quiz completed! Your score:',
    letsGetReady: "Let's get you ready!",
    grabBra: "Grab your best-fitting bra and take a look at the size on the label.",
    typeBandSize: "Type Band Size:",
    typeCupSize: "Type Cup Size:",
    selectSystem: "Select a sizing system:",
    back: "Back",
    yes: "Yes",
    no: "No",
    proceed: "I am ready to proceed",
    bandPullsFar: "Band pulls far",
    bandLooksGood: "Band looks good",
    bandPullsOkay: "Band pulls okay",
    minimizeChat: "Minimize",
    openChat: "Open Chat",
    everydayBra: "Is this your everyday bra which you've worn often in the last 3 months?",
    bandSizeMeasurement: "Band size measurement",
    bandMeasureInstructions: "Thanks for that. Now let's put the bra on the tightest hooks for me. We are measuring your band size here, make sure to pull the band down so it's parallel to the floor band & adjust your straps, like this image below.",
    bandPullQuestion: "Now, pull the band away from your body. Which gif below resonates the most?"
  },
  es: {
    chatHeader: 'ES',
    inputPlaceholder: 'Escribe tu mensaje...',
    send: 'Enviar',
    selectLanguage: 'Seleccionar Idioma',
    band: 'Talla de banda', 
    cup: 'Talla de copa', 
    system: 'Sistema de tallas', 
    submit: 'Enviar',
    quizProgress: 'Pregunta {{current}} de {{total}}',
    takeFittingQuiz: 'Haz un cuestionario de ajuste de sujetador',
    measureInstructions: 'Para medirte correctamente:',
    startQuiz: 'Comenzar Cuestionario',
    quizCompleted: '¡Cuestionario completado! Tu puntuación:',
    letsGetReady: "¡Preparémonos!",
    grabBra: "Toma tu sujetador mejor ajustado y mira la talla en la etiqueta.",
    typeBandSize: "Talla de banda:",
    typeCupSize: "Talla de copa:",
    selectSystem: "Selecciona un sistema de tallas:",
    back: "Atrás",
    yes: "Sí",
    no: "No",
    proceed: "Estoy listo para continuar",
    bandPullsFar: "La banda se estira mucho",
    bandLooksGood: "La banda luce bien",
    bandPullsOkay: "La banda se estira bien",
    minimizeChat: "Minimizar",
    openChat: "Abrir Chat",
    everydayBra: "¿Es este tu sujetador diario que has usado frecuentemente en los últimos 3 meses?",
    bandSizeMeasurement: "Medición de la talla de banda",
    bandMeasureInstructions: "Gracias por eso. Ahora vamos a poner el sujetador en los ganchos más apretados. Estamos midiendo la talla de tu banda aquí, asegúrate de tirar de la banda hacia abajo para que quede paralela al suelo y ajusta tus tirantes, como en esta imagen de abajo.",
    bandPullQuestion: "Ahora, tira de la banda lejos de tu cuerpo. ¿Cuál de las siguientes imágenes se asemeja más?"
  },
  fr: {
    chatHeader: 'FR',
    inputPlaceholder: 'Tapez votre message...',
    send: 'Envoyer',
    selectLanguage: 'Sélectionner la Langue',
    band: 'Taille de bande', 
    cup: 'Taille de bonnet', 
    system: 'Système de taille', 
    submit: 'Envoyer',
    quizProgress: 'Question {{current}} sur {{total}}',
    takeFittingQuiz: 'Faire un quiz d\'ajustement de soutien-gorge',
    measureInstructions: 'Pour vous mesurer correctement:',
    startQuiz: 'Commencer le Quiz',
    quizCompleted: 'Quiz terminé! Votre score:',
    letsGetReady: "Préparons-nous!",
    grabBra: "Prenez votre soutien-gorge le mieux ajusté et regardez la taille sur l'étiquette.",
    typeBandSize: "Taille de bande:",
    typeCupSize: "Taille de bonnet:",
    selectSystem: "Sélectionnez un système de taille:",
    back: "Retour",
    yes: "Oui",
    no: "Non",
    proceed: "Je suis prête à continuer",
    bandPullsFar: "La bande s'étire beaucoup",
    bandLooksGood: "La bande est bien",
    bandPullsOkay: "La bande s'étire correctement",
    minimizeChat: "Réduire",
    openChat: "Ouvrir le Chat",
    everydayBra: "Est-ce votre soutien-gorge quotidien que vous avez porté souvent au cours des 3 derniers mois?",
    bandSizeMeasurement: "Mesure de la taille de bande",
    bandMeasureInstructions: "Merci pour cela. Maintenant, plaçons le soutien-gorge sur les agrafes les plus serrées. Nous mesurons votre taille de bande ici, assurez-vous de tirer la bande vers le bas pour qu'elle soit parallèle au sol et ajustez vos bretelles, comme sur cette image ci-dessous.",
    bandPullQuestion: "Maintenant, tirez la bande loin de votre corps. Laquelle de ces images correspond le mieux?"
  },
  de: {
    chatHeader: 'DE',
    inputPlaceholder: 'Geben Sie Ihre Nachricht ein...',
    send: 'Senden',
    selectLanguage: 'Sprache auswählen',
    band: 'Unterbrustgröße', 
    cup: 'Körbchengröße', 
    system: 'Größensystem', 
    submit: 'Absenden',
    quizProgress: 'Frage {{current}} von {{total}}',
    takeFittingQuiz: 'Machen Sie ein BH-Anpassungsquiz',
    measureInstructions: 'Um sich richtig zu messen:',
    startQuiz: 'Quiz starten',
    quizCompleted: 'Quiz abgeschlossen! Ihre Punktzahl:',
    letsGetReady: "Lassen Sie uns beginnen!",
    grabBra: "Nehmen Sie Ihren am besten passenden BH und schauen Sie auf das Größenetikett.",
    typeBandSize: "Unterbrustgröße:",
    typeCupSize: "Körbchengröße:",
    selectSystem: "Wählen Sie ein Größensystem:",
    back: "Zurück",
    yes: "Ja",
    no: "Nein",
    proceed: "Ich bin bereit fortzufahren",
    bandPullsFar: "Band zieht weit",
    bandLooksGood: "Band sieht gut aus",
    bandPullsOkay: "Band zieht in Ordnung",
    minimizeChat: "Minimieren",
    openChat: "Chat öffnen",
    everydayBra: "Ist dies Ihr Alltags-BH, den Sie in den letzten 3 Monaten häufig getragen haben?",
    bandSizeMeasurement: "Unterbrustgrößenmessung",
    bandMeasureInstructions: "Danke dafür. Jetzt stellen wir den BH auf die engsten Haken ein. Wir messen hier Ihre Unterbrustgröße, stellen Sie sicher, dass Sie das Band nach unten ziehen, damit es parallel zum Boden ist, und passen Sie Ihre Träger an, wie auf diesem Bild unten.",
    bandPullQuestion: "Ziehen Sie nun das Band von Ihrem Körper weg. Welches der folgenden Bilder entspricht am ehesten?"
  },
  it: {
    chatHeader: 'IT',
    inputPlaceholder: 'Scrivi il tuo messaggio...',
    send: 'Invia',
    selectLanguage: 'Seleziona Lingua',
    band: 'Taglia fascia', 
    cup: 'Taglia coppa', 
    system: 'Sistema di taglie', 
    submit: 'Invia',
    quizProgress: 'Domanda {{current}} di {{total}}',
    takeFittingQuiz: 'Fai un quiz sull\'adattamento del reggiseno',
    measureInstructions: 'Per misurarti correttamente:',
    startQuiz: 'Inizia Quiz',
    quizCompleted: 'Quiz completato! Il tuo punteggio:',
    letsGetReady: "Prepariamoci!",
    grabBra: "Prendi il tuo reggiseno meglio adattato e guarda la taglia sull'etichetta.",
    typeBandSize: "Taglia fascia:",
    typeCupSize: "Taglia coppa:",
    selectSystem: "Seleziona un sistema di taglie:",
    back: "Indietro",
    yes: "Sì",
    no: "No",
    proceed: "Sono pronta a procedere",
    bandPullsFar: "La fascia si tira molto",
    bandLooksGood: "La fascia appare bene",
    bandPullsOkay: "La fascia si tira adeguatamente",
    minimizeChat: "Minimizza",
    openChat: "Apri Chat",
    everydayBra: "È questo il tuo reggiseno quotidiano che hai indossato spesso negli ultimi 3 mesi?",
    bandSizeMeasurement: "Misurazione della taglia della fascia",
    bandMeasureInstructions: "Grazie per questo. Ora mettiamo il reggiseno sui ganci più stretti. Stiamo misurando la taglia della tua fascia qui, assicurati di tirare la fascia verso il basso in modo che sia parallela al pavimento e regola i tuoi spallini, come in questa immagine sotto.",
    bandPullQuestion: "Ora, tira la fascia lontano dal tuo corpo. Quale delle seguenti immagini risuona di più?"
  }
};

// Quiz questions with translations support
const quizQuestions: QuizQuestion[] = [
  {
    question: {
      en: "What's the most important factor in a well-fitting bra?",
      es: "¿Cuál es el factor más importante en un sujetador bien ajustado?",
      fr: "Quel est le facteur le plus important dans un soutien-gorge bien ajusté?",
      de: "Was ist der wichtigste Faktor bei einem gut sitzenden BH?",
      it: "Qual è il fattore più importante in un reggiseno ben adattato?"
    },
    options: {
      en: [
        "The band fits snugly",
        "The straps are tight",
        "The color matches your outfit",
        "The price is right"
      ],
      es: [
        "La banda se ajusta cómodamente",
        "Las correas están apretadas",
        "El color combina con tu atuendo",
        "El precio es adecuado"
      ],
      fr: [
        "La bande s'ajuste confortablement",
        "Les bretelles sont serrées",
        "La couleur s'accorde à votre tenue",
        "Le prix est correct"
      ],
      de: [
        "Das Band sitzt eng",
        "Die Träger sind straff",
        "Die Farbe passt zu Ihrem Outfit",
        "Der Preis stimmt"
      ],
      it: [
        "La fascia si adatta comodamente",
        "Le spalline sono strette",
        "Il colore si abbina al tuo outfit",
        "Il prezzo è giusto"
      ]
    },
    correct: 0
  },
  {
    question: {
      en: "How should the band of your bra sit?",
      es: "¿Cómo debe quedar la banda de tu sujetador?",
      fr: "Comment la bande de votre soutien-gorge doit-elle se positionner?",
      de: "Wie sollte das Unterbrustband Ihres BHs sitzen?",
      it: "Come dovrebbe stare la fascia del tuo reggiseno?"
    },
    options: {
      en: [
        "Above your breasts",
        "Parallel to the floor",
        "Loose and comfortable",
        "As tight as possible"
      ],
      es: [
        "Por encima de tus senos",
        "Paralela al suelo",
        "Suelta y cómoda",
        "Tan apretada como sea posible"
      ],
      fr: [
        "Au-dessus de vos seins",
        "Parallèle au sol",
        "Lâche et confortable",
        "Aussi serrée que possible"
      ],
      de: [
        "Über Ihrer Brust",
        "Parallel zum Boden",
        "Locker und bequem",
        "So eng wie möglich"
      ],
      it: [
        "Sopra il seno",
        "Parallela al pavimento",
        "Larga e comoda",
        "Il più stretta possibile"
      ]
    },
    correct: 1
  },
  {
    question: {
      en: "When should you replace your bra?",
      es: "¿Cuándo debes reemplazar tu sujetador?",
      fr: "Quand devriez-vous remplacer votre soutien-gorge?",
      de: "Wann sollten Sie Ihren BH ersetzen?",
      it: "Quando dovresti sostituire il tuo reggiseno?"
    },
    options: {
      en: [
        "Every 6-8 months with regular wear",
        "Once a year",
        "When it starts looking old",
        "Never if it's comfortable"
      ],
      es: [
        "Cada 6-8 meses con uso regular",
        "Una vez al año",
        "Cuando comienza a verse viejo",
        "Nunca si es cómodo"
      ],
      fr: [
        "Tous les 6-8 mois avec une utilisation régulière",
        "Une fois par an",
        "Quand il commence à paraître vieux",
        "Jamais s'il est confortable"
      ],
      de: [
        "Alle 6-8 Monate bei regelmäßigem Tragen",
        "Einmal im Jahr",
        "Wenn er alt aussieht",
        "Nie, wenn er bequem ist"
      ],
      it: [
        "Ogni 6-8 mesi con uso regolare",
        "Una volta all'anno",
        "Quando inizia a sembrare vecchio",
        "Mai se è comodo"
      ]
    },
    correct: 0
  }
];

// Set the current language
export const setLanguage = (langCode: LanguageCode): void => {
  currentLanguage = langCode;
};

// Get current translations
export const getTranslations = (): TranslationSet => {
  return translations[currentLanguage] || translations.en;
};

export const sendMessage = async (message: string): Promise<MessageType> => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
  
  messageCounter++;
  
  // Start quiz command
  if (message.toLowerCase() === 'start quiz') {
    currentQuiz = {
      currentQuestion: 0,
      score: 0,
      completed: false
    };
    return {
      id: messageCounter,
      text: getTranslations().startQuiz + "!\n\n" + formatQuizQuestion(0),
      timestamp: new Date().getTime(),
      sender: 'bot',
      type: 'quiz' 
    };
  }

  // Quiz response handling
  if (currentQuiz && !currentQuiz.completed && /^[0-9]$/.test(message)) {
    const answer = parseInt(message) - 1;
    const question = quizQuestions[currentQuiz.currentQuestion];
    
    if (answer === question.correct) {
      currentQuiz.score++;
    }
    
    currentQuiz.currentQuestion++;
    
    if (currentQuiz.currentQuestion >= quizQuestions.length) {
      currentQuiz.completed = true;
      const response: MessageType = {
        id: messageCounter,
        text: `${getTranslations().quizCompleted} ${currentQuiz.score}/${quizQuestions.length}`,
        timestamp: new Date().getTime(),
        sender: 'bot',
        type: 'quiz-result'
      };
      currentQuiz = null;
      return response;
    }
    
    return {
      id: messageCounter,
      text: formatQuizQuestion(currentQuiz.currentQuestion),
      timestamp: new Date().getTime(),
      sender: 'bot',
      type: 'quiz'
    };
  }
  
  // Regular message handling
  const response: MessageType = {
    id: messageCounter,
    text: getBotResponse(message),
    timestamp: new Date().getTime(),
    sender: 'bot',
    type: 'message'
  };
  
  chatHistory.push(response);
  return response;
};

export const getHistory = (): MessageType[] => chatHistory;

function getBotResponse(message: string): string {
  const t = getTranslations();
  
  if (message.toLowerCase().includes('quiz')) {
    return t.takeFittingQuiz + " " + t.startQuiz;
  }

  if (message.toLowerCase().includes('hello')) {
    return 'Hi there! How can I help you with bra fitting today?';
  }
  
  if (message.toLowerCase().includes('size')) {
    const sizes = ['32B', '34C', '36D'];
    return `Based on what you've told me, I would recommend a ${sizes[Math.floor(Math.random() * 3)]}. Would you like to know how to measure yourself properly?`;
  }
  
  if (message.toLowerCase().includes('measure')) {
    return t.measureInstructions + ' 1. Wear an unlined bra 2. Measure around your ribcage 3. Measure around the fullest part of your bust. Need more details?';
  }
  
  return message.length > 20 
    ? message.includes('?') 
      ? "That's a great question! Let me help you with that."
      : "I understand. Tell me more about what you're looking for."
    : "I'm here to help! Ask me anything about bra fitting.";
}

function formatQuizQuestion(index: number): string {
  const lang = currentLanguage;
  const question = quizQuestions[index];
  const questionText = question.question[lang] || question.question.en;
  const options = question.options[lang] || question.options.en;
  
  return `${questionText}\n\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`;
}

