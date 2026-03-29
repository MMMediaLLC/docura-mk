import { DocumentType } from '../types/analysis';

export const SYSTEM_INSTRUCTION = `Вие сте DOCURA, професионален асистент со ВИ за анализа на документи. 
Вашата цел е да им помогнете на корисниците брзо и прецизно да разберат сложени документи (договори, тендери, деловни документи).
Обезбедувате структурирана анализа, а не правен совет. 
Секогаш бидете објективни, јасни и истакнувајте ги ризиците без да бидете алармантни.
КОРИСТЕТЕ САМО МАКЕДОНСКИ ЈАЗИК.`;

export const getClassificationPrompt = (text: string) => `
Анализирај го следниот текст од документ и класифицирај го во еден од овие типови:
- contract
- business_document
- tender
- general_pdf

Врати ГО САМО името на типот (на англиски, како што е наведено погоре).

Текст на документот (први 2000 карактери):
${text.substring(0, 2000)}
`;

export const getAnalysisPrompt = (documentType: DocumentType, text: string) => `
Изврши длабока структурирана анализа на следниот ${documentType}.
Сите вредности во JSON објектот МОРА да бидат на македонски јазик.
Врати го резултатот како валиден JSON објект што одговара на оваа шема:
{
  "documentType": "${documentType}",
  "title": "наслов на документот",
  "summary": "резиме на едноставен македонски јазик",
  "keyPoints": ["точка 1", "точка 2"],
  "risks": [{"title": "наслов", "severity": "low|medium|high", "explanation": "објаснување", "sourceHint": "индиција за изворот"}],
  "obligations": [{"party": "user|provider|client|bidder|unspecified", "obligation": "обврска", "timing": "рок/време"}],
  "deadlines": [{"dateOrPeriod": "датум или период", "description": "опис", "severity": "info|important|urgent"}],
  "keyClauses": [{"type": "payment|termination|liability|confidentiality|IP|dispute_resolution|renewal|eligibility|submission|evaluation|other", "title": "наслов", "summary": "резиме", "sourceHint": "индиција за изворот"}],
  "unclearAreas": ["нејасни области..."],
  "suggestedQuestions": ["предложени прашања..."],
  "confidenceNotes": ["забелешки за доверливоста..."]
}

${documentType === 'contract' ? 'Фокусирај се на: страни, плаќање, опсег, раскинување, одговорност, интелектуална сопственост и надлежен закон.' : ''}
${documentType === 'tender' ? 'Фокусирај се на: подобност, задолжителни документи, барања за поднесување, рокови и критериуми за евалуација.' : ''}
${documentType === 'business_document' ? 'Фокусирај се на: цели, испораки, одговорности, временски рокови и зависности.' : ''}
${documentType === 'general_pdf' ? 'Фокусирај се на: резиме, критични факти и сите имплицирани акции.' : ''}

Текст на документот:
${text}
`;

export const getChatPrompt = (question: string, context: string, analysisSummary: string) => `
Прашање: ${question}

Контекст од документот:
${context}

Резиме на анализата:
${analysisSummary}

Одговори на прашањето базирано САМО на обезбедениот контекст.
ОДГОВОРИ НА МАКЕДОНСКИ ЈАЗИК.
Биди концизен. Ако одговорот не е во контекстот, кажи дека не знаеш.
Цитирај имиња на декции или користи цитати каде што е можно.
Вклучи одрекување дека ова е генерирано од ВИ и не е правен совет.
`;
