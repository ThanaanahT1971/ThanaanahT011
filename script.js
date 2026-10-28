/**
 * ==============================================================================
 * EXAMFORGE - Main JavaScript Engine (ระบบสอบภาษาอังกฤษออนไลน์)
 * รองรับภาษาไทย (Thai Language Edition) พร้อมระบบสลับภาษา (TH / EN)
 * 
 * ระบบสำคัญ:
 * 1. ระบบจัดเก็บข้อมูลถาวรใน LocalStorage และข้อมูลชุดตัวอย่างมาตรฐาน
 * 2. การสลับหน้าจอ (SPA Navigation)
 * 3. แดชบอร์ดครูผู้สอนและการจัดการข้อสอบ
 * 4. ระบบสร้างข้อสอบและเพิ่มคำถามแบบไดนามิก (4 ตัวเลือก ปรนัย)
 * 5. คลังข้อสอบ (Question Bank)
 * 6. พอร์ทัลนักเรียนและการค้นหาข้อสอบด้วยรหัส
 * 7. ระบบสอบสด (Live Exam Runner) พร้อมนาฬิกานับถอยหลังและแผนผังข้อสอบ
 * 8. การตรวจคะแนน เกรด และเฉลยข้อสอบ
 * 9. การวิเคราะห์ผลสัมฤทธิ์ทางการเรียนและการส่งออกไฟล์ CSV
 * 10. กล่องป๊อปอัปแจ้งเตือน (Modals & Toasts)
 * ==============================================================================
 */

// สถานะการทำงานของระบบ (Global Application State)
const AppState = {
  currentLanguage: 'th', // 'th' หรือ 'en'
  currentView: 'view-welcome',
  activeTeacherTab: 'tab-overview',
  activeExamSession: null,
  examTimerInterval: null,
  timerSecondsRemaining: 0,
  userSelectedAnswers: {}, // จับคู่ questionIndex -> selectedOptionIndex (0-3)
  currentQuestionIndex: 0,
  studentName: 'สมชาย รักเรียน (Alex Morgan)',
  editingExamId: null,
  deleteTargetExamId: null
};

// คีย์สำหรับเก็บข้อมูลใน LocalStorage ของเบราว์เซอร์
const STORAGE_KEYS = {
  EXAMS: 'examforge_exams_th_v1',
  ATTEMPTS: 'examforge_attempts_th_v1',
  QUESTION_BANK: 'examforge_question_bank_th_v1',
  LANG: 'examforge_lang_pref'
};

// ==============================================================================
// 1. ข้อมูลตัวอย่างเริ่มต้น (SEED DATA)
// ชุดข้อสอบภาษาอังกฤษตัวอย่าง คลังคำถาม และประวัตินักเรียนส่งข้อสอบ
// ==============================================================================

const SEED_EXAMS_TH = [
  {
    id: 'exam-vocab-101',
    title: 'การทดสอบคำศัพท์ภาษาอังกฤษธุรกิจและวิชาการ (Vocabulary Mastery)',
    description: 'ประเมินความรู้ด้านคำศัพท์ภาษาอังกฤษระดับกลางถึงสูง คำคุณศัพท์เชิงวิเคราะห์ และคำกริยาที่พบบ่อยในบทความวิชาการ',
    topic: 'Vocabulary',
    durationMinutes: 10,
    accessCode: 'VOCAB-101',
    visibility: 'immediate',
    status: 'published',
    createdAt: '2026-10-20T09:00:00.000Z',
    questions: [
      {
        id: 'q-v1',
        text: 'The executive was searching for an astute advisor who could foresee potential market shifts. What does "astute" mean?',
        topic: 'Vocabulary',
        points: 10,
        options: [
          'Clever and perceptive (ฉลาด รอบรู้ และมีไหวพริบ)',
          'Careless and hurried (ประมาทและเร่งรีบ)',
          'Aggressive and intimidating (ก้าวร้าวและข่มขู่)',
          'Hesitant and indecisive (ลังเลและตัดสินใจไม่เด็ดขาด)'
        ],
        correctAnswer: 0,
        explanation: 'คำว่า "astute" หมายถึง ฉลาดหลักแหลม มีปฏิภาณไหวพริบในการประเมินสถานการณ์ได้อย่างแม่นยำ'
      },
      {
        id: 'q-v2',
        text: 'The instructions provided by the committee were completely ambiguous, causing widespread confusion. What does "ambiguous" mean?',
        topic: 'Vocabulary',
        points: 10,
        options: [
          'Direct and unequivocal (ชัดเจนและตรงไปตรงมา)',
          'Open to more than one interpretation (คลุมเครือ แปลความได้หลายแง่)',
          'Inspiring and poetic (สร้างแรงบันดาลใจและสละสลวย)',
          'Unnecessarily lengthy (ยาวเกินความจำเป็น)'
        ],
        correctAnswer: 1,
        explanation: '"ambiguous" หมายถึง กำกวม คลุมเครือ ตีความได้มากกว่าหนึ่งความหมาย'
      },
      {
        id: 'q-v3',
        text: 'Due to severe budget constraints, the college decided to defer campus renovations until next spring. What does "defer" mean?',
        topic: 'Vocabulary',
        points: 10,
        options: [
          'Cancel permanently (ยกเลิกถาวร)',
          'Postpone to a later time (ชะลอหรือเลื่อนเวลาออกไป)',
          'Speed up execution (เร่งดำเนินการให้เร็วขึ้น)',
          'Publicly condemn (ประณามต่อสาธารณะ)'
        ],
        correctAnswer: 1,
        explanation: '"defer" หมายถึง เลื่อนเวลาออกไป ชะลอไว้ก่อน (postpone)'
      },
      {
        id: 'q-v4',
        text: 'The community showed remarkable resilience in rebuilding their vocational center after the storm. What does "resilience" mean?',
        topic: 'Vocabulary',
        points: 10,
        options: [
          'The capacity to recover quickly from difficulties (ความสามารถในการฟื้นตัวอย่างรวดเร็วหลังเผชิญอุปสรรค)',
          'A habit of complaining during hardship (นิสัยชอบบ่นเวลาลำบาก)',
          'Total disregard for municipal authorities (การละเลยคำสั่งเจ้าหน้าที่)',
          'A desire to relocate immediately (ความต้องการย้ายถิ่นฐานทันที)'
        ],
        correctAnswer: 0,
        explanation: '"resilience" หมายถึง ความยืดหยุ่น ความสามารถในการฟื้นตัวกลับสู่สภาพเดิมได้ดีหลังประสบวิกฤต'
      },
      {
        id: 'q-v5',
        text: 'The research scientist presented empirical evidence to support her breakthrough hypothesis. What does "empirical" mean?',
        topic: 'Vocabulary',
        points: 10,
        options: [
          'Purely speculative and unverified (เป็นการคาดเดาและยังไม่พิสูจน์)',
          'Derived from verifiable observation or experience (ได้จากการสังเกตหรือการทดลองจริงเชิงประจักษ์)',
          'Derived solely from philosophical theory (มาจากทฤษฎีปรัชญาล้วนๆ)',
          'Copied from historical folklore (คัดลอกมาจากนิทานพื้นบ้าน)'
        ],
        correctAnswer: 1,
        explanation: '"empirical" หมายถึง เชิงประจักษ์ ซึ่งได้จากการสังเกต การทดลอง หรือประสบการณ์จริง'
      }
    ]
  },
  {
    id: 'exam-gram-201',
    title: 'แบบทดสอบไวยากรณ์และกาลเวลาภาษาอังกฤษ (Grammar & Tenses)',
    description: 'ทดสอบความแม่นยำเรื่องประโยคเงื่อนไข (Conditionals), กริยาสอดคล้องกับประธาน (Subject-Verb Agreement) และ Tenses',
    topic: 'Grammar',
    durationMinutes: 12,
    accessCode: 'GRAM-201',
    visibility: 'immediate',
    status: 'published',
    createdAt: '2026-10-22T11:30:00.000Z',
    questions: [
      {
        id: 'q-g1',
        text: 'If the engineering team _______ the safety inspection earlier, the production delay would have been avoided.',
        topic: 'Grammar',
        points: 10,
        options: [
          'conducted',
          'had conducted',
          'has conducted',
          'would conduct'
        ],
        correctAnswer: 1,
        explanation: 'โครงสร้าง Third Conditional (เงื่อนไขในอดีตที่ตรงข้ามกับความเป็นจริง): If + had + V.3, would have + V.3 ดังนั้นข้อนี้ต้องใช้ "had conducted"'
      },
      {
        id: 'q-g2',
        text: 'Neither the head principal nor the teachers _______ informed about the unexpected schedule change.',
        topic: 'Grammar',
        points: 10,
        options: [
          'was',
          'were',
          'is',
          'has been'
        ],
        correctAnswer: 1,
        explanation: 'เมื่อประธานเชื่อมด้วย "Neither... nor" กริยาจะต้องผันตามประธานตัวที่อยู่ใกล้กริยาที่สุด ("the teachers" เป็นพหูพจน์ ในรูปอดีตจึงใช้ "were")'
      },
      {
        id: 'q-g3',
        text: 'By November next year, Dr. Montgomery _______ educational research at Oxford for twenty-five years.',
        topic: 'Tenses',
        points: 10,
        options: [
          'will be conducting',
          'will have been conducting',
          'has conducted',
          'is conducting'
        ],
        correctAnswer: 1,
        explanation: 'Future Perfect Continuous Tense (will have been + V-ing) ใช้บอกการกระทำที่จะดำเนินต่อเนื่องไปจนถึงจุดหนึ่งในอนาคต'
      },
      {
        id: 'q-g4',
        text: 'The keynote speaker, _______ lecture captivated the entire audience, received an honorary professorship.',
        topic: 'Grammar',
        points: 10,
        options: [
          'who',
          'whom',
          'whose',
          'which'
        ],
        correctAnswer: 2,
        explanation: 'ใช้ประพันธสรรพนาม "whose" เพื่อแสดงความเป็นเจ้าของ ขยายคำนาม "lecture" (การบรรยายของวิทยากร)'
      },
      {
        id: 'q-g5',
        text: 'Hardly _______ the examination room when the warning bell sounded.',
        topic: 'Grammar',
        points: 10,
        options: [
          'had the candidates entered',
          'the candidates entered',
          'have the candidates entered',
          'did the candidates entered'
        ],
        correctAnswer: 0,
        explanation: 'ไวยากรณ์ Inversion: เมื่อขึ้นต้นประโยคด้วยคำปฏิเสธอย่าง "Hardly" จะต้องสลับโครงสร้างเป็น Hardly + had + ประธาน + V.3 ... when'
      }
    ]
  },
  {
    id: 'exam-read-301',
    title: 'การอ่านจับใจความและคิดวิเคราะห์ (Reading Comprehension)',
    description: 'บทความทดสอบการอ่านจับใจความสำคัญ การอนุมานความหมาย และการวิเคราะห์เจตนาของผู้เขียน',
    topic: 'Reading',
    durationMinutes: 15,
    accessCode: 'READ-301',
    visibility: 'immediate',
    status: 'published',
    createdAt: '2026-10-24T14:15:00.000Z',
    questions: [
      {
        id: 'q-r1',
        text: 'Passage: "In sustainable architecture, passive solar design exploits building orientation to harvest daylight and thermal mass, dramatically lowering reliance on fossil-fuel heating." What is the primary benefit described?',
        topic: 'Reading',
        points: 10,
        options: [
          'Eliminating all construction material costs (ลดค่าก่อสร้างทั้งหมด)',
          'Minimizing artificial energy dependence through natural orientation (ลดการพึ่งพาพลังงานเชื้อเพลิงโดยใช้ทิศทางแสงธรรมชาติ)',
          'Preventing building wear caused by seasonal rainfall (ป้องกันการสึกหรอจากฝน)',
          'Decorating city skylines with glass facades (การตกแต่งอาคารด้วยกระจก)'
        ],
        correctAnswer: 1,
        explanation: 'บทความระบุชัดเจนว่าการออกแบบอาคารแบบโซลาร์ทางอ้อมช่วยลดการพึ่งพาพลังงานจากเชื้อเพลิงฟอสซิลได้อย่างมาก'
      },
      {
        id: 'q-r2',
        text: 'Passage: "Although initial capital outlays for green rooftop installations remain steep, longitudinal data reveals a twenty-year net savings via roof lifespan extension and reduced HVAC overhead." What can be inferred?',
        topic: 'Reading',
        points: 10,
        options: [
          'Green roofs always lead to immediate bankruptcy (หลังคาสีเขียวทำให้ขาดทุนเสมอ)',
          'The long-term economic dividends outweigh the initial high cost (ประโยชน์ทางเศรษฐกิจระยะยาวคุ้มค่ากว่าต้นทุนติดตั้งเริ่มแรก)',
          'HVAC equipment requires total removal in green buildings (ต้องถอดระบบแอร์ออกทั้งหมด)',
          'Rooftop vegetation is unsuitable for urban structures (การปลูกพืชบนดาดฟ้าไม่เหมาะกับเมือง)'
        ],
        correctAnswer: 1,
        explanation: 'อนุมานได้ว่าแม้การติดตั้งเริ่มแรกจะมีราคาสูง แต่ในระยะยาว 20 ปี จะประหยัดค่าใช้จ่ายได้คุ้มค่ากว่า'
      },
      {
        id: 'q-r3',
        text: 'In architectural discourse, what does the term "urban heat island effect" primarily emphasize?',
        topic: 'Reading',
        points: 10,
        options: [
          'Tropical resort tourism expansions (การท่องเที่ยวเกาะเขตร้อน)',
          'Significantly higher temperatures in dense metropolitan areas compared to rural surroundings (อุณหภูมิในเขตเมืองที่สูงกว่าแถบชนบทอย่างเห็นได้ชัด)',
          'Underground subway ventilation fires (ไฟไหม้ในอุโมงค์รถไฟใต้ดิน)',
          'Household radiators running during summer months (การเปิดเครื่องทำความร้อนในฤดูร้อน)'
        ],
        correctAnswer: 1,
        explanation: 'ปรากฏการณ์เกาะความร้อนในเมือง (Urban Heat Island) หมายถึง พื้นที่เขตเมืองมีอุณหภูมิสูงกว่าแถบชนบทโดยรอบเนื่องจากตึกคอนกรีตและการสะสมความร้อน'
      },
      {
        id: 'q-r4',
        text: 'Which tone best reflects an author advocating for mandatory high-efficiency insulation in municipal building codes?',
        topic: 'Reading',
        points: 10,
        options: [
          'Sarcastic and aloof (ประชดประชันและเย็นชา)',
          'Urgent and pragmatic (เร่งด่วนและเน้นนำไปปฏิบัติได้จริง)',
          'Nostalgic for traditional masonry (โหยหาอาคารก่ออิฐแบบโบราณ)',
          'Passive and uninterested (นิ่งเฉยและไม่ใส่ใจ)'
        ],
        correctAnswer: 1,
        explanation: 'น้ำเสียงในการเรียกร้องเชิงนโยบายเพื่อประโยชน์ด้านพลังงานคือการเน้นย้ำความสำคัญเร่งด่วนและเน้นการปฏิบัติจริง (Urgent and pragmatic)'
      }
    ]
  }
];

const SEED_QUESTION_BANK_TH = [
  {
    id: 'qb-1',
    text: 'Choose the word that best completes the sentence: "The candidate gave a _______ response that avoided addressing the direct inquiry."',
    topic: 'Vocabulary',
    points: 10,
    options: ['evasive (บ่ายเบี่ยง หลีกเลี่ยง)', 'diligent (ขยันขันแข็ง)', 'candid (เปิดเผย ตรงไปตรงมา)', 'vivacious (ร่าเริงแจ่มใส)'],
    correctAnswer: 0,
    explanation: '"evasive" หมายถึง หลีกเลี่ยงการตอบตรงๆ หรือบ่ายเบี่ยง'
  },
  {
    id: 'qb-2',
    text: 'Select the correct sentence with proper punctuation and semicolon usage:',
    topic: 'Grammar',
    points: 10,
    options: [
      'The seminar was thoroughly informative; however, the venue was rather cramped.',
      'The seminar was thoroughly informative, however; the venue was rather cramped.',
      'The seminar was thoroughly informative; however the venue, was rather cramped.',
      'The seminar was thoroughly informative however, the venue was rather cramped.'
    ],
    correctAnswer: 0,
    explanation: 'เมื่อเชื่อม 2 ประโยคสมบูรณ์ด้วยคำเชื่อมเช่น however จะต้องใส่เครื่องหมายอัฒภาค (;) ด้านหน้า และเครื่องหมายจุลภาค (,) ด้านหลัง'
  },
  {
    id: 'qb-3',
    text: 'Identify the tense in: "By the time the flight landed, the conference delegates had already arrived."',
    topic: 'Tenses',
    points: 10,
    options: ['Past Perfect Tense', 'Past Continuous Tense', 'Present Perfect Tense', 'Future Perfect Tense'],
    correctAnswer: 0,
    explanation: '"had already arrived" เป็นโครงสร้าง Past Perfect (had + V.3) แสดงเหตุการณ์ที่เกิดขึ้นและสิ้นสุดลงก่อนอีกเหตุการณ์หนึ่งในอดีต'
  },
  {
    id: 'qb-4',
    text: 'Choose the correct preposition: "The scholarship committee commended Maria _______ her outstanding community leadership."',
    topic: 'Grammar',
    points: 10,
    options: ['for', 'on', 'with', 'at'],
    correctAnswer: 0,
    explanation: 'สำนวนกริยา "commend someone FOR something" ใช้ชื่นชมบุคคลสำหรับความดีหรือผลงานที่ทำ'
  },
  {
    id: 'qb-5',
    text: 'What is the antonym (คำตรงข้าม) of the word "ephemeral"?',
    topic: 'Vocabulary',
    points: 10,
    options: ['Permanent (ถาวร ยั่งยืน)', 'Fleeting (ชั่วคราว)', 'Transient (ไม่ยืนยาว)', 'Delicate (เปราะบาง)'],
    correctAnswer: 0,
    explanation: '"ephemeral" หมายถึง ไม่ยั่งยืน อยู่เพียงชั่วคราว คำตรงข้ามจึงเป็น "permanent" ที่แปลว่า ถาวร'
  },
  {
    id: 'qb-6',
    text: 'Select the sentence with correct subjunctive mood usage:',
    topic: 'Grammar',
    points: 10,
    options: [
      'The dean insisted that each student be on time for registration.',
      'The dean insisted that each student is on time for registration.',
      'The dean insisted that each student was on time for registration.',
      'The dean insisted that each student are on time for registration.'
    ],
    correctAnswer: 0,
    explanation: 'โครงสร้าง Subjunctive Mood หลังคำกริยาแสดงการสั่งหรือยืนยัน (insist that...) กริยาในประโยคย่อยต้องเป็นรูปกริยาฐาน (Bare Infinitive: "be") เสมอ'
  }
];

const SEED_ATTEMPTS_TH = [
  {
    id: 'att-1',
    studentName: 'สมชาย รักเรียน (Alex Morgan)',
    examId: 'exam-vocab-101',
    examTitle: 'การทดสอบคำศัพท์ภาษาอังกฤษธุรกิจและวิชาการ (Vocabulary Mastery)',
    topic: 'Vocabulary',
    score: 40,
    maxScore: 50,
    percentage: 80,
    correctCount: 4,
    incorrectCount: 1,
    timeTakenSeconds: 320,
    submittedAt: '2026-10-25T10:14:00.000Z',
    answers: { 0: 0, 1: 1, 2: 1, 3: 0, 4: 0 }
  },
  {
    id: 'att-2',
    studentName: 'วิภาดา บุญมี (Elena Rostova)',
    examId: 'exam-vocab-101',
    examTitle: 'การทดสอบคำศัพท์ภาษาอังกฤษธุรกิจและวิชาการ (Vocabulary Mastery)',
    topic: 'Vocabulary',
    score: 50,
    maxScore: 50,
    percentage: 100,
    correctCount: 5,
    incorrectCount: 0,
    timeTakenSeconds: 245,
    submittedAt: '2026-10-25T11:05:00.000Z',
    answers: { 0: 0, 1: 1, 2: 1, 3: 0, 4: 1 }
  },
  {
    id: 'att-3',
    studentName: 'ณัฐพงษ์ สิทธิเวช (Marcus Chen)',
    examId: 'exam-gram-201',
    examTitle: 'แบบทดสอบไวยากรณ์และกาลเวลาภาษาอังกฤษ (Grammar & Tenses)',
    topic: 'Grammar',
    score: 40,
    maxScore: 50,
    percentage: 80,
    correctCount: 4,
    incorrectCount: 1,
    timeTakenSeconds: 410,
    submittedAt: '2026-10-26T09:20:00.000Z',
    answers: { 0: 1, 1: 1, 2: 0, 3: 2, 4: 0 }
  },
  {
    id: 'att-4',
    studentName: 'กานดา ชัยชนะ (Sophia Patel)',
    examId: 'exam-gram-201',
    examTitle: 'แบบทดสอบไวยากรณ์และกาลเวลาภาษาอังกฤษ (Grammar & Tenses)',
    topic: 'Grammar',
    score: 50,
    maxScore: 50,
    percentage: 100,
    correctCount: 5,
    incorrectCount: 0,
    timeTakenSeconds: 380,
    submittedAt: '2026-10-26T14:40:00.000Z',
    answers: { 0: 1, 1: 1, 2: 1, 3: 2, 4: 0 }
  },
  {
    id: 'att-5',
    studentName: 'ธนภัทร รุ่งเรือง (Liam O\'Connor)',
    examId: 'exam-gram-201',
    examTitle: 'แบบทดสอบไวยากรณ์และกาลเวลาภาษาอังกฤษ (Grammar & Tenses)',
    topic: 'Grammar',
    score: 30,
    maxScore: 50,
    percentage: 60,
    correctCount: 3,
    incorrectCount: 2,
    timeTakenSeconds: 480,
    submittedAt: '2026-10-27T08:15:00.000Z',
    answers: { 0: 0, 1: 1, 2: 1, 3: 1, 4: 0 }
  },
  {
    id: 'att-6',
    studentName: 'ศุภกร มณีวรรณ (David Kim)',
    examId: 'exam-read-301',
    examTitle: 'การอ่านจับใจความและคิดวิเคราะห์ (Reading Comprehension)',
    topic: 'Reading',
    score: 40,
    maxScore: 40,
    percentage: 100,
    correctCount: 4,
    incorrectCount: 0,
    timeTakenSeconds: 520,
    submittedAt: '2026-10-27T10:30:00.000Z',
    answers: { 0: 1, 1: 1, 2: 1, 3: 1 }
  },
  {
    id: 'att-7',
    studentName: 'อภิชญา ทรัพย์เจริญ (Chloe Bennett)',
    examId: 'exam-read-301',
    examTitle: 'การอ่านจับใจความและคิดวิเคราะห์ (Reading Comprehension)',
    topic: 'Reading',
    score: 30,
    maxScore: 40,
    percentage: 75,
    correctCount: 3,
    incorrectCount: 1,
    timeTakenSeconds: 610,
    submittedAt: '2026-10-27T13:45:00.000Z',
    answers: { 0: 1, 1: 0, 2: 1, 3: 1 }
  },
  {
    id: 'att-8',
    studentName: 'พงศกร ธนสิทธิ์ (Jordan Taylor)',
    examId: 'exam-vocab-101',
    examTitle: 'การทดสอบคำศัพท์ภาษาอังกฤษธุรกิจและวิชาการ (Vocabulary Mastery)',
    topic: 'Vocabulary',
    score: 30,
    maxScore: 50,
    percentage: 60,
    correctCount: 3,
    incorrectCount: 2,
    timeTakenSeconds: 390,
    submittedAt: '2026-10-28T01:10:00.000Z',
    answers: { 0: 0, 1: 0, 2: 1, 3: 1, 4: 1 }
  }
];

// ==============================================================================
// 2. ฟังก์ชันจัดการ LOCALSTORAGE
// บันทึกและดึงข้อมูลข้อสอบ ประวัติการสอบ และคลังคำถาม
// ==============================================================================

function getStoredExams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (!raw) {
      saveStoredExams(SEED_EXAMS_TH);
      return SEED_EXAMS_TH;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading exams from localStorage:', err);
    return SEED_EXAMS_TH;
  }
}

function saveStoredExams(exams) {
  try {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  } catch (err) {
    console.error('Error saving exams to localStorage:', err);
  }
}

function getStoredAttempts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!raw) {
      saveStoredAttempts(SEED_ATTEMPTS_TH);
      return SEED_ATTEMPTS_TH;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading attempts from localStorage:', err);
    return SEED_ATTEMPTS_TH;
  }
}

function saveStoredAttempts(attempts) {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  } catch (err) {
    console.error('Error saving attempts to localStorage:', err);
  }
}

function getStoredQuestionBank() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTION_BANK);
    if (!raw) {
      saveStoredQuestionBank(SEED_QUESTION_BANK_TH);
      return SEED_QUESTION_BANK_TH;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading question bank from localStorage:', err);
    return SEED_QUESTION_BANK_TH;
  }
}

function saveStoredQuestionBank(bank) {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTION_BANK, JSON.stringify(bank));
  } catch (err) {
    console.error('Error saving question bank to localStorage:', err);
  }
}

function resetDemoDataToDefaults() {
  saveStoredExams(SEED_EXAMS_TH);
  saveStoredAttempts(SEED_ATTEMPTS_TH);
  saveStoredQuestionBank(SEED_QUESTION_BANK_TH);
  showToast('คืนค่าข้อมูลตัวอย่างภาษาไทยเริ่มต้นเรียบร้อยแล้ว', 'success');
  refreshTeacherDashboard();
  renderStudentPortalExams();
}

// ==============================================================================
// 3. การนำทางและสลับหน้าจอ (SPA VIEW NAVIGATION)
// ==============================================================================

function navigateTo(viewId, teacherSubTab = null) {
  // หากกำลังทำข้อสอบแล้วกดออกจากหน้า ให้หยุดเวลา
  if (AppState.currentView === 'view-exam-session' && viewId !== 'view-exam-session') {
    if (AppState.examTimerInterval) {
      clearInterval(AppState.examTimerInterval);
      AppState.examTimerInterval = null;
    }
  }

  AppState.currentView = viewId;

  // ปิดทุกหน้าแล้วเปิดเฉพาะหน้าที่ต้องการ
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const targetSection = document.getElementById(viewId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // อัปเดตป้ายบอกสถานะโหมดในส่วนหัว (Header Mode Label)
  const modeLabel = document.getElementById('current-view-label');
  if (modeLabel) {
    if (viewId === 'view-welcome') modeLabel.textContent = 'หน้าต้อนรับ';
    else if (viewId === 'view-teacher') modeLabel.textContent = 'แดชบอร์ดครูผู้สอน';
    else if (viewId === 'view-exam-editor') modeLabel.textContent = 'ฟอร์มสร้าง/แก้ไขข้อสอบ';
    else if (viewId === 'view-student-portal') modeLabel.textContent = 'พอร์ทัลนักเรียน';
    else if (viewId === 'view-student-instructions') modeLabel.textContent = 'คำชี้แจงการสอบ';
    else if (viewId === 'view-exam-session') modeLabel.textContent = 'กำลังทำข้อสอบ';
    else if (viewId === 'view-student-results') modeLabel.textContent = 'ผลการสอบประเมิน';
  }

  // หากเป็นหน้าแดชบอร์ดครู ให้เปิดแท็บย่อยที่กำหนด
  if (viewId === 'view-teacher') {
    if (teacherSubTab) {
      switchTeacherTab(teacherSubTab);
    } else {
      switchTeacherTab(AppState.activeTeacherTab || 'tab-overview');
    }
  }

  // อัปเดตรายการข้อสอบในพอร์ทัลนักเรียน
  if (viewId === 'view-student-portal') {
    renderStudentPortalExams();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchTeacherTab(tabId) {
  AppState.activeTeacherTab = tabId;

  // ปรับสถานะปุ่มเมนูทางซ้าย
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // ซ่อนแท็บอื่นแล้วแสดงแท็บที่เลือก
  document.querySelectorAll('.teacher-tab-content').forEach(tab => {
    tab.style.display = 'none';
  });

  const activeTabContent = document.getElementById(tabId);
  if (activeTabContent) {
    activeTabContent.style.display = 'block';
  }

  // อัปเดตข้อมูลของแท็บนั้นๆ
  if (tabId === 'tab-overview') {
    renderOverviewStats();
    renderOverviewRecentExams();
  } else if (tabId === 'tab-exams') {
    renderFullExamsTable();
  } else if (tabId === 'tab-bank') {
    renderQuestionBankList();
  } else if (tabId === 'tab-analytics') {
    renderAnalyticsDashboard();
  }
}

// ==============================================================================
// 4. แดชบอร์ดคุณครู (TEACHER DASHBOARD LOGIC)
// ==============================================================================

function refreshTeacherDashboard() {
  renderOverviewStats();
  renderOverviewRecentExams();
  renderFullExamsTable();
  renderQuestionBankList();
  renderAnalyticsDashboard();
}

function renderOverviewStats() {
  const exams = getStoredExams();
  const attempts = getStoredAttempts();

  // นับจำนวนนักเรียนที่ไม่ซ้ำกัน
  const studentNames = new Set(attempts.map(a => a.studentName.trim().toLowerCase()));

  // คำนวณคะแนนเฉลี่ยร้อยละ
  let avgScore = 0;
  if (attempts.length > 0) {
    const totalPercent = attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
    avgScore = Math.round(totalPercent / attempts.length);
  }

  document.getElementById('stat-total-exams').textContent = exams.length;
  document.getElementById('stat-total-students').textContent = studentNames.size;
  document.getElementById('stat-total-attempts').textContent = attempts.length;
  document.getElementById('stat-average-score').textContent = `${avgScore}%`;
}

function renderOverviewRecentExams() {
  const exams = getStoredExams();
  const attempts = getStoredAttempts();
  const tbody = document.getElementById('overview-exams-tbody');
  tbody.innerHTML = '';

  const recent = [...exams].slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">ยังไม่มีข้อสอบในระบบ คลิก "+ สร้างข้อสอบใหม่" เพื่อเริ่มสร้างข้อสอบ</td></tr>`;
    return;
  }

  recent.forEach(exam => {
    const examAttempts = attempts.filter(a => a.examId === exam.id).length;
    const tr = document.createElement('tr');

    const statusBadgeClass = exam.status === 'published' ? 'badge-published' : exam.status === 'draft' ? 'badge-draft' : 'badge-closed';
    const statusLabel = exam.status === 'published' ? 'เผยแพร่แล้ว' : exam.status === 'draft' ? 'ฉบับร่าง' : 'ปิดรับการสอบ';

    tr.innerHTML = `
      <td><strong>${escapeHtml(exam.title)}</strong></td>
      <td><span class="badge badge-topic">${escapeHtml(translateTopic(exam.topic))}</span></td>
      <td><span class="exam-code-tag">${escapeHtml(exam.accessCode)}</span></td>
      <td>${exam.questions ? exam.questions.length : 0} ข้อ</td>
      <td><strong>${examAttempts}</strong> คน</td>
      <td><span class="badge ${statusBadgeClass}">${statusLabel}</span></td>
      <td>
        <div class="action-buttons-group">
          <button class="btn btn-secondary btn-sm" onclick="previewExamDetails('${exam.id}')" title="ดูตัวอย่าง">ตัวอย่าง</button>
          <button class="btn btn-primary btn-sm" onclick="startEditingExam('${exam.id}')" title="แก้ไข">แก้ไข</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderFullExamsTable() {
  const exams = getStoredExams();
  const attempts = getStoredAttempts();
  const tbody = document.getElementById('full-exams-tbody');
  const emptyState = document.getElementById('exams-empty-state');

  const searchQuery = (document.getElementById('filter-exam-search').value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('filter-exam-status').value;
  const topicFilter = document.getElementById('filter-exam-topic').value;

  const filtered = exams.filter(exam => {
    const matchSearch = exam.title.toLowerCase().includes(searchQuery) || 
                        exam.topic.toLowerCase().includes(searchQuery) ||
                        exam.accessCode.toLowerCase().includes(searchQuery);
    const matchStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchTopic = topicFilter === 'all' || exam.topic === topicFilter;
    return matchSearch && matchStatus && matchTopic;
  });

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  filtered.forEach(exam => {
    const examAttempts = attempts.filter(a => a.examId === exam.id).length;
    const statusBadgeClass = exam.status === 'published' ? 'badge-published' : exam.status === 'draft' ? 'badge-draft' : 'badge-closed';
    const statusLabel = exam.status === 'published' ? 'เผยแพร่แล้ว' : exam.status === 'draft' ? 'ฉบับร่าง' : 'ปิดรับ';
    const toggleStatusBtnLabel = exam.status === 'published' ? 'ปิดรับสอบ' : 'เปิดเผยแพร่';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong>${escapeHtml(exam.title)}</strong>
        <div style="font-size: 0.78rem; color: var(--text-muted); max-width: 320px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
          ${escapeHtml(exam.description || 'ไม่มีคำอธิบาย')}
        </div>
      </td>
      <td><span class="badge badge-topic">${escapeHtml(translateTopic(exam.topic))}</span></td>
      <td><span class="exam-code-tag">${escapeHtml(exam.accessCode)}</span></td>
      <td>${exam.durationMinutes} นาที</td>
      <td>${exam.questions ? exam.questions.length : 0} ข้อ</td>
      <td><strong>${examAttempts}</strong> คน</td>
      <td><span class="badge ${statusBadgeClass}">${statusLabel}</span></td>
      <td>
        <div class="action-buttons-group">
          <button class="btn btn-secondary btn-sm" onclick="previewExamDetails('${exam.id}')">ดู</button>
          <button class="btn btn-secondary btn-sm" onclick="startEditingExam('${exam.id}')">แก้ไข</button>
          <button class="btn btn-outline-light btn-sm" style="color: var(--navy-dark); border-color: var(--border-color);" onclick="toggleExamStatus('${exam.id}')">${toggleStatusBtnLabel}</button>
          <button class="btn btn-danger btn-sm" onclick="promptDeleteExam('${exam.id}')" title="ลบ">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleExamStatus(examId) {
  const exams = getStoredExams();
  const exam = exams.find(e => e.id === examId);
  if (!exam) return;

  if (exam.status === 'published') {
    exam.status = 'closed';
    showToast(`ข้อสอบ "${exam.title}" ถูกเปลี่ยนสถานะเป็น ปิดรับการสอบ`, 'info');
  } else {
    exam.status = 'published';
    showToast(`ข้อสอบ "${exam.title}" เผยแพร่แล้ว นักเรียนสามารถเข้าทำได้ทันที`, 'success');
  }

  saveStoredExams(exams);
  renderFullExamsTable();
  renderOverviewRecentExams();
  renderStudentPortalExams();
}

function promptDeleteExam(examId) {
  const exams = getStoredExams();
  const exam = exams.find(e => e.id === examId);
  if (!exam) return;

  AppState.deleteTargetExamId = examId;
  document.getElementById('delete-modal-exam-name').textContent = `"${exam.title}"`;
  openModal('modal-delete-confirm');
}

function executeDeleteExam() {
  if (!AppState.deleteTargetExamId) return;

  let exams = getStoredExams();
  exams = exams.filter(e => e.id !== AppState.deleteTargetExamId);
  saveStoredExams(exams);

  // ลบข้อมูลประวัติการสอบที่เกี่ยวข้องด้วย
  let attempts = getStoredAttempts();
  attempts = attempts.filter(a => a.examId !== AppState.deleteTargetExamId);
  saveStoredAttempts(attempts);

  AppState.deleteTargetExamId = null;
  closeModal('modal-delete-confirm');
  showToast('ลบชุดข้อสอบและประวัติการสอบที่เกี่ยวข้องเรียบร้อยแล้ว', 'info');
  refreshTeacherDashboard();
}

function previewExamDetails(examId) {
  const exams = getStoredExams();
  const exam = exams.find(e => e.id === examId);
  if (!exam) return;

  const statusLabel = exam.status === 'published' ? 'เผยแพร่แล้ว' : exam.status === 'draft' ? 'ฉบับร่าง' : 'ปิดรับ';
  document.getElementById('preview-modal-title').textContent = exam.title;
  document.getElementById('preview-modal-subtitle').textContent = 
    `หมวดหมู่: ${translateTopic(exam.topic)} • รหัส: ${exam.accessCode} • เวลา: ${exam.durationMinutes} นาที • สถานะ: ${statusLabel}`;

  const container = document.getElementById('preview-modal-body');
  container.innerHTML = '';

  if (!exam.questions || exam.questions.length === 0) {
    container.innerHTML = '<p class="empty-state">ยังไม่มีคำถามในชุดข้อสอบนี้</p>';
  } else {
    exam.questions.forEach((q, idx) => {
      const qDiv = document.createElement('div');
      qDiv.className = 'card';
      qDiv.style.marginBottom = '1rem';

      const optionsHtml = q.options.map((opt, oIdx) => {
        const isCorrect = oIdx === q.correctAnswer;
        return `
          <div style="padding: 0.45rem 0.75rem; border-radius: var(--radius-sm); margin-bottom: 0.35rem; font-size: 0.88rem; background: ${isCorrect ? 'var(--success-bg)' : '#f8fafc'}; border: 1px solid ${isCorrect ? 'var(--success-border)' : 'var(--border-color)'}; color: ${isCorrect ? 'var(--success-text)' : 'inherit'};">
            <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)} ${isCorrect ? '✓ (เฉลยข้อถูก)' : ''}
          </div>
        `;
      }).join('');

      qDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span class="question-number-badge">ข้อที่ ${idx + 1} (${q.points || 10} คะแนน)</span>
          <span class="badge badge-topic">${escapeHtml(translateTopic(q.topic || exam.topic))}</span>
        </div>
        <p style="font-weight: 600; color: var(--navy-dark); margin-bottom: 0.75rem;">${escapeHtml(q.text)}</p>
        <div style="margin-bottom: 0.5rem;">${optionsHtml}</div>
        ${q.explanation ? `<div class="explanation-box"><strong>คำอธิบายเฉลย:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
      `;
      container.appendChild(qDiv);
    });
  }

  openModal('modal-preview-exam');
}

// ==============================================================================
// 5. ระบบสร้างและแก้ไขชุดข้อสอบ (EXAM BUILDER ENGINE)
// ==============================================================================

function startNewExamCreation() {
  AppState.editingExamId = null;
  document.getElementById('editor-title').textContent = 'สร้างชุดข้อสอบใหม่ (Create Exam)';
  document.getElementById('editor-exam-id').value = '';
  document.getElementById('exam-title-input').value = '';
  document.getElementById('exam-desc-input').value = '';
  document.getElementById('exam-topic-select').value = 'Grammar';
  document.getElementById('exam-duration-input').value = 15;
  document.getElementById('exam-code-input').value = generateUniqueExamCode();
  document.getElementById('exam-visibility-select').value = 'immediate';
  document.getElementById('exam-status-select').value = 'published';

  const container = document.getElementById('questions-builder-list');
  container.innerHTML = '';
  addQuestionToEditorForm();

  navigateTo('view-exam-editor');
}

function startEditingExam(examId) {
  const exams = getStoredExams();
  const exam = exams.find(e => e.id === examId);
  if (!exam) return;

  AppState.editingExamId = examId;
  document.getElementById('editor-title').textContent = `แก้ไขชุดข้อสอบ: ${exam.title}`;
  document.getElementById('editor-exam-id').value = exam.id;
  document.getElementById('exam-title-input').value = exam.title;
  document.getElementById('exam-desc-input').value = exam.description || '';
  document.getElementById('exam-topic-select').value = exam.topic || 'Grammar';
  document.getElementById('exam-duration-input').value = exam.durationMinutes || 15;
  document.getElementById('exam-code-input').value = exam.accessCode || '';
  document.getElementById('exam-visibility-select').value = exam.visibility || 'immediate';
  document.getElementById('exam-status-select').value = exam.status || 'published';

  const container = document.getElementById('questions-builder-list');
  container.innerHTML = '';

  if (exam.questions && exam.questions.length > 0) {
    exam.questions.forEach((q, idx) => {
      addQuestionToEditorForm(q, idx + 1);
    });
  } else {
    addQuestionToEditorForm();
  }

  navigateTo('view-exam-editor');
}

function generateUniqueExamCode() {
  const prefix = 'ENG';
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${randomNum}`;
}

function addQuestionToEditorForm(questionData = null, displayNum = null) {
  const container = document.getElementById('questions-builder-list');
  const questionIndex = container.children.length;
  const qNum = displayNum || (questionIndex + 1);

  const card = document.createElement('div');
  card.className = 'question-card';
  card.dataset.index = questionIndex;

  const defaultTopic = document.getElementById('exam-topic-select').value || 'Grammar';
  const qText = questionData ? questionData.text : '';
  const qTopic = questionData ? questionData.topic : defaultTopic;
  const qPoints = questionData ? questionData.points : 10;
  const qExplanation = questionData ? questionData.explanation || '' : '';
  const qCorrect = questionData && typeof questionData.correctAnswer === 'number' ? questionData.correctAnswer : 0;
  const qOptions = questionData && questionData.options ? questionData.options : ['', '', '', ''];

  const radioGroupName = `correct-answer-group-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  card.innerHTML = `
    <div class="question-card-header">
      <span class="question-number-badge">ข้อที่ <span class="q-display-number">${qNum}</span></span>
      <button type="button" class="btn btn-danger btn-sm btn-remove-q" onclick="removeQuestionFromBuilder(this)">
        ลบคำถามข้อนี้
      </button>
    </div>

    <div class="form-grid" style="margin-bottom: 0.75rem;">
      <div class="form-group full-width">
        <label>ข้อความคำถาม (Question Text) *</label>
        <textarea class="q-input-text" rows="2" placeholder="เช่น Choose the sentence with correct subject-verb agreement..." required>${escapeHtml(qText)}</textarea>
      </div>

      <div class="form-group">
        <label>หมวดหมู่ทักษะ</label>
        <select class="q-input-topic">
          <option value="Vocabulary" ${qTopic === 'Vocabulary' ? 'selected' : ''}>คำศัพท์ (Vocabulary)</option>
          <option value="Grammar" ${qTopic === 'Grammar' ? 'selected' : ''}>ไวยากรณ์ (Grammar)</option>
          <option value="Tenses" ${qTopic === 'Tenses' ? 'selected' : ''}>กาลเวลา (Tenses)</option>
          <option value="Reading" ${qTopic === 'Reading' ? 'selected' : ''}>การอ่าน (Reading)</option>
        </select>
      </div>

      <div class="form-group">
        <label>คะแนนข้อนี้</label>
        <input type="number" class="q-input-points" value="${qPoints}" min="1" max="100" />
      </div>
    </div>

    <div style="margin-bottom: 0.75rem;">
      <label style="font-weight: 600; font-size: 0.88rem; display: block; margin-bottom: 0.4rem;">
        ตัวเลือกคำตอบ 4 ข้อ (คลิกเลือกปุ่มวงกลมหน้ารหัสที่ต้องการเฉลยว่าถูกต้อง) *
      </label>
      <div class="options-builder-grid">
        <div class="option-builder-row">
          <input type="radio" name="${radioGroupName}" value="0" ${qCorrect === 0 ? 'checked' : ''} />
          <span class="option-label">A</span>
          <input type="text" class="q-opt-0" placeholder="ข้อความตัวเลือก A..." value="${escapeHtml(qOptions[0] || '')}" required />
        </div>
        <div class="option-builder-row">
          <input type="radio" name="${radioGroupName}" value="1" ${qCorrect === 1 ? 'checked' : ''} />
          <span class="option-label">B</span>
          <input type="text" class="q-opt-1" placeholder="ข้อความตัวเลือก B..." value="${escapeHtml(qOptions[1] || '')}" required />
        </div>
        <div class="option-builder-row">
          <input type="radio" name="${radioGroupName}" value="2" ${qCorrect === 2 ? 'checked' : ''} />
          <span class="option-label">C</span>
          <input type="text" class="q-opt-2" placeholder="ข้อความตัวเลือก C..." value="${escapeHtml(qOptions[2] || '')}" required />
        </div>
        <div class="option-builder-row">
          <input type="radio" name="${radioGroupName}" value="3" ${qCorrect === 3 ? 'checked' : ''} />
          <span class="option-label">D</span>
          <input type="text" class="q-opt-3" placeholder="ข้อความตัวเลือก D..." value="${escapeHtml(qOptions[3] || '')}" required />
        </div>
      </div>
    </div>

    <div class="form-group full-width">
      <label>คำอธิบายเฉลย (Explanation - สำหรับให้นักเรียนดูหลังสอบเสร็จ)</label>
      <textarea class="q-input-explanation" rows="2" placeholder="อธิบายเหตุผลของคำตอบที่ถูกต้องตามหลักภาษา...">${escapeHtml(qExplanation)}</textarea>
    </div>
  `;

  container.appendChild(card);
  renumberBuilderQuestions();
}

function removeQuestionFromBuilder(btn) {
  const container = document.getElementById('questions-builder-list');
  if (container.children.length <= 1) {
    showToast('ชุดข้อสอบต้องมีคำถามอย่างน้อย 1 ข้อ', 'warning');
    return;
  }
  const card = btn.closest('.question-card');
  if (card) {
    card.remove();
    renumberBuilderQuestions();
  }
}

function renumberBuilderQuestions() {
  const container = document.getElementById('questions-builder-list');
  const cards = container.querySelectorAll('.question-card');
  cards.forEach((card, index) => {
    const numSpan = card.querySelector('.q-display-number');
    if (numSpan) numSpan.textContent = index + 1;
  });
}

function handleSaveExam(forcedStatus = null) {
  const title = document.getElementById('exam-title-input').value.trim();
  const description = document.getElementById('exam-desc-input').value.trim();
  const topic = document.getElementById('exam-topic-select').value;
  const duration = parseInt(document.getElementById('exam-duration-input').value, 10);
  const accessCode = document.getElementById('exam-code-input').value.trim().toUpperCase();
  const visibility = document.getElementById('exam-visibility-select').value;
  let status = forcedStatus || document.getElementById('exam-status-select').value;

  if (!title) {
    showToast('กรุณาระบุชื่อชุดข้อสอบ', 'error');
    return;
  }
  if (!accessCode) {
    showToast('กรุณาระบุรหัสเข้าสอบ (Access Code)', 'error');
    return;
  }
  if (isNaN(duration) || duration <= 0) {
    showToast('เวลาในการทำข้อสอบต้องมีอย่างน้อย 1 นาที', 'error');
    return;
  }

  // ตรวจสอบรหัสเข้าสอบไม่ให้ซ้ำกับชุดอื่น
  const exams = getStoredExams();
  const codeConflict = exams.find(e => e.accessCode.toUpperCase() === accessCode && e.id !== AppState.editingExamId);
  if (codeConflict) {
    showToast(`รหัสเข้าสอบ "${accessCode}" ถูกใช้ไปแล้วในข้อสอบชุดอื่น กรุณากำหนดรหัสใหม่`, 'error');
    return;
  }

  const questionCards = document.querySelectorAll('#questions-builder-list .question-card');
  if (questionCards.length === 0) {
    showToast('กรุณาเพิ่มคำถามอย่างน้อย 1 ข้อลงในชุดข้อสอบ', 'error');
    return;
  }

  const collectedQuestions = [];
  for (let i = 0; i < questionCards.length; i++) {
    const card = questionCards[i];
    const qNum = i + 1;
    const text = card.querySelector('.q-input-text').value.trim();
    const qTopic = card.querySelector('.q-input-topic').value;
    const points = parseInt(card.querySelector('.q-input-points').value, 10) || 10;
    const explanation = card.querySelector('.q-input-explanation').value.trim();

    const opt0 = card.querySelector('.q-opt-0').value.trim();
    const opt1 = card.querySelector('.q-opt-1').value.trim();
    const opt2 = card.querySelector('.q-opt-2').value.trim();
    const opt3 = card.querySelector('.q-opt-3').value.trim();

    if (!text) {
      showToast(`ข้อที่ #${qNum} ยังไม่ได้กรอกข้อความคำถาม`, 'error');
      return;
    }
    if (!opt0 || !opt1 || !opt2 || !opt3) {
      showToast(`ข้อที่ #${qNum} ต้องกรอกตัวเลือกให้ครบทั้ง 4 ตัวเลือก (A, B, C, D)`, 'error');
      return;
    }

    const checkedRadio = card.querySelector('input[type="radio"]:checked');
    if (!checkedRadio) {
      showToast(`ข้อที่ #${qNum} ต้องคลิกเลือกเฉลยข้อที่ถูกต้องอย่างน้อย 1 ข้อ`, 'error');
      return;
    }
    const correctAnswerIndex = parseInt(checkedRadio.value, 10);

    collectedQuestions.push({
      id: `q-${Date.now()}-${i}`,
      text: text,
      topic: qTopic,
      points: points,
      options: [opt0, opt1, opt2, opt3],
      correctAnswer: correctAnswerIndex,
      explanation: explanation
    });
  }

  const examRecord = {
    id: AppState.editingExamId || `exam-${Date.now()}`,
    title: title,
    description: description,
    topic: topic,
    durationMinutes: duration,
    accessCode: accessCode,
    visibility: visibility,
    status: status,
    createdAt: AppState.editingExamId ? (exams.find(e => e.id === AppState.editingExamId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    questions: collectedQuestions
  };

  if (AppState.editingExamId) {
    const targetIdx = exams.findIndex(e => e.id === AppState.editingExamId);
    if (targetIdx !== -1) {
      exams[targetIdx] = examRecord;
    } else {
      exams.push(examRecord);
    }
    showToast(`อัปเดตชุดข้อสอบ "${title}" สำเร็จ!`, 'success');
  } else {
    exams.push(examRecord);
    showToast(`สร้างและบันทึกชุดข้อสอบ "${title}" สำเร็จ!`, 'success');
  }

  saveStoredExams(exams);
  AppState.editingExamId = null;

  refreshTeacherDashboard();
  renderStudentPortalExams();
  navigateTo('view-teacher', 'tab-exams');
}

// ==============================================================================
// 6. การจัดการคลังข้อสอบ (QUESTION BANK)
// ==============================================================================

function renderQuestionBankList() {
  const bank = getStoredQuestionBank();
  const container = document.getElementById('bank-questions-list');
  const emptyState = document.getElementById('bank-empty-state');

  const searchQuery = (document.getElementById('bank-search-input').value || '').toLowerCase().trim();
  const topicFilter = document.getElementById('bank-topic-filter').value;

  const filtered = bank.filter(item => {
    const matchSearch = item.text.toLowerCase().includes(searchQuery);
    const matchTopic = topicFilter === 'all' || item.topic === topicFilter;
    return matchSearch && matchTopic;
  });

  container.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bank-item-card';

    const optionsHtml = item.options.map((opt, idx) => {
      const isCorrect = idx === item.correctAnswer;
      return `
        <span style="font-size: 0.85rem; padding: 0.2rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid ${isCorrect ? 'var(--success-border)' : 'var(--border-color)'}; background: ${isCorrect ? 'var(--success-bg)' : '#f8fafc'}; color: ${isCorrect ? 'var(--success-text)' : 'inherit'};">
          ${String.fromCharCode(65 + idx)}: ${escapeHtml(opt)} ${isCorrect ? '✓ (เฉลย)' : ''}
        </span>
      `;
    }).join(' ');

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
        <span class="badge badge-topic">${escapeHtml(translateTopic(item.topic))}</span>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="editBankQuestionItem('${item.id}')">แก้ไข</button>
          <button class="btn btn-secondary btn-sm" onclick="useBankItemInNewExam('${item.id}')">+ สร้างข้อสอบด้วยข้อนี้</button>
          <button class="btn btn-danger btn-sm" onclick="deleteBankQuestionItem('${item.id}')">🗑️</button>
        </div>
      </div>
      <p style="font-weight: 600; color: var(--navy-dark); margin-bottom: 0.75rem;">${escapeHtml(item.text)}</p>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">${optionsHtml}</div>
      ${item.explanation ? `<p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;"><strong>เหตุผลเฉลย:</strong> ${escapeHtml(item.explanation)}</p>` : ''}
    `;

    container.appendChild(card);
  });
}

function openAddBankItemModal() {
  document.getElementById('modal-bank-title').textContent = 'เพิ่มคำถามใหม่ลงในคลัง';
  document.getElementById('bank-item-id').value = '';
  document.getElementById('bank-question-text').value = '';
  document.getElementById('bank-topic-select').value = 'Grammar';
  document.getElementById('bank-points-input').value = 10;
  document.getElementById('bank-opt-0').value = '';
  document.getElementById('bank-opt-1').value = '';
  document.getElementById('bank-opt-2').value = '';
  document.getElementById('bank-opt-3').value = '';
  document.querySelector('input[name="bank-correct-choice"][value="0"]').checked = true;
  document.getElementById('bank-explanation-input').value = '';

  openModal('modal-bank-item');
}

function editBankQuestionItem(bankId) {
  const bank = getStoredQuestionBank();
  const item = bank.find(b => b.id === bankId);
  if (!item) return;

  document.getElementById('modal-bank-title').textContent = 'แก้ไขคำถามในคลังข้อสอบ';
  document.getElementById('bank-item-id').value = item.id;
  document.getElementById('bank-question-text').value = item.text;
  document.getElementById('bank-topic-select').value = item.topic || 'Grammar';
  document.getElementById('bank-points-input').value = item.points || 10;
  document.getElementById('bank-opt-0').value = item.options[0] || '';
  document.getElementById('bank-opt-1').value = item.options[1] || '';
  document.getElementById('bank-opt-2').value = item.options[2] || '';
  document.getElementById('bank-opt-3').value = item.options[3] || '';

  const targetRadio = document.querySelector(`input[name="bank-correct-choice"][value="${item.correctAnswer}"]`);
  if (targetRadio) targetRadio.checked = true;

  document.getElementById('bank-explanation-input').value = item.explanation || '';

  openModal('modal-bank-item');
}

function saveBankItemFromModal() {
  const bankId = document.getElementById('bank-item-id').value;
  const text = document.getElementById('bank-question-text').value.trim();
  const topic = document.getElementById('bank-topic-select').value;
  const points = parseInt(document.getElementById('bank-points-input').value, 10) || 10;
  const opt0 = document.getElementById('bank-opt-0').value.trim();
  const opt1 = document.getElementById('bank-opt-1').value.trim();
  const opt2 = document.getElementById('bank-opt-2').value.trim();
  const opt3 = document.getElementById('bank-opt-3').value.trim();
  const explanation = document.getElementById('bank-explanation-input').value.trim();

  if (!text) {
    showToast('กรุณากรอกข้อความคำถาม', 'error');
    return;
  }
  if (!opt0 || !opt1 || !opt2 || !opt3) {
    showToast('กรุณากรอกตัวเลือกคำตอบให้ครบ 4 ข้อ', 'error');
    return;
  }

  const checkedRadio = document.querySelector('input[name="bank-correct-choice"]:checked');
  const correctAnswer = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;

  const bank = getStoredQuestionBank();

  if (bankId) {
    const idx = bank.findIndex(b => b.id === bankId);
    if (idx !== -1) {
      bank[idx] = {
        id: bankId,
        text,
        topic,
        points,
        options: [opt0, opt1, opt2, opt3],
        correctAnswer,
        explanation
      };
      showToast('อัปเดตคำถามในคลังข้อสอบสำเร็จ', 'success');
    }
  } else {
    bank.push({
      id: `qb-${Date.now()}`,
      text,
      topic,
      points,
      options: [opt0, opt1, opt2, opt3],
      correctAnswer,
      explanation
    });
    showToast('บันทึกคำถามใหม่ลงในคลังเรียบร้อย', 'success');
  }

  saveStoredQuestionBank(bank);
  closeModal('modal-bank-item');
  renderQuestionBankList();
}

function deleteBankQuestionItem(bankId) {
  let bank = getStoredQuestionBank();
  bank = bank.filter(b => b.id !== bankId);
  saveStoredQuestionBank(bank);
  showToast('ลบคำถามออกจากคลังแล้ว', 'info');
  renderQuestionBankList();
}

function useBankItemInNewExam(bankId) {
  const bank = getStoredQuestionBank();
  const item = bank.find(b => b.id === bankId);
  if (!item) return;

  startNewExamCreation();
  const container = document.getElementById('questions-builder-list');
  container.innerHTML = '';
  addQuestionToEditorForm(item);
  document.getElementById('exam-topic-select').value = item.topic;
  showToast('นำคำถามจากคลังเข้าสู่ฟอร์มสร้างข้อสอบแล้ว', 'info');
}

function openImportBankModal() {
  const bank = getStoredQuestionBank();
  const container = document.getElementById('import-bank-list');
  container.innerHTML = '';

  if (bank.length === 0) {
    container.innerHTML = '<p class="empty-state">ไม่มีคำถามในคลัง</p>';
  } else {
    bank.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'card';
      itemDiv.style.cursor = 'pointer';
      itemDiv.style.padding = '0.85rem';
      itemDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <span class="badge badge-topic">${escapeHtml(translateTopic(item.topic))}</span>
          <button type="button" class="btn btn-primary btn-sm">+ นำเข้าข้อนี้</button>
        </div>
        <p style="font-weight: 500; font-size: 0.9rem; color: var(--navy-dark); margin: 0;">${escapeHtml(item.text)}</p>
      `;
      itemDiv.onclick = () => {
        addQuestionToEditorForm(item);
        showToast('เพิ่มคำถามลงในชุดข้อสอบแล้ว!', 'success');
        closeModal('modal-import-bank');
      };
      container.appendChild(itemDiv);
    });
  }

  openModal('modal-import-bank');
}

// ==============================================================================
// 7. พอร์ทัลนักเรียนและการเริ่มสอบ (STUDENT PORTAL & INSTRUCTIONS)
// ==============================================================================

function renderStudentPortalExams() {
  const exams = getStoredExams();
  const publishedExams = exams.filter(e => e.status === 'published');
  const container = document.getElementById('available-exams-grid');

  container.innerHTML = '';

  if (publishedExams.length === 0) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2.5rem;">
        <h4>ยังไม่มีข้อสอบที่เปิดให้เข้าทำในขณะนี้</h4>
        <p>อาจารย์ผู้สอนยังไม่ได้เผยแพร่ชุดข้อสอบ โปรดรอสักครู่หรือติดต่ออาจารย์</p>
      </div>
    `;
    return;
  }

  publishedExams.forEach(exam => {
    const card = document.createElement('div');
    card.className = 'student-exam-card';

    const questionCount = exam.questions ? exam.questions.length : 0;
    const totalPoints = exam.questions ? exam.questions.reduce((sum, q) => sum + (q.points || 10), 0) : 0;

    card.innerHTML = `
      <div>
        <div class="student-exam-card-header">
          <span class="badge badge-topic">${escapeHtml(translateTopic(exam.topic))}</span>
          <span class="exam-code-tag">${escapeHtml(exam.accessCode)}</span>
        </div>
        <h4>${escapeHtml(exam.title)}</h4>
        <div class="student-exam-meta">
          <span>⏱️ ${exam.durationMinutes} นาที</span>
          <span>📝 ${questionCount} ข้อ</span>
          <span>🎯 ${totalPoints} คะแนน</span>
        </div>
        <p style="font-size: 0.88rem; margin-bottom: 1rem;">
          ${escapeHtml(exam.description || 'แบบทดสอบวัดสมรรถนะทักษะภาษาอังกฤษ')}
        </p>
      </div>
      <button class="btn btn-primary" style="width: 100%;" onclick="selectExamByCode('${escapeHtml(exam.accessCode)}')">
        เข้าทำข้อสอบชุดนี้ &rarr;
      </button>
    `;
    container.appendChild(card);
  });
}

function handleFindExamByCode() {
  const codeInput = document.getElementById('student-code-input');
  const enteredCode = (codeInput.value || '').trim().toUpperCase();
  const nameInput = document.getElementById('student-name-input');
  const studentName = (nameInput.value || '').trim();

  if (!studentName) {
    showToast('กรุณากรอกชื่อ-นามสกุล ของนักเรียนก่อนเริ่มทำข้อสอบ', 'warning');
    nameInput.focus();
    return;
  }
  AppState.studentName = studentName;

  if (!enteredCode) {
    showToast('กรุณากรอกรหัสเข้าสอบ (เช่น VOCAB-101)', 'warning');
    codeInput.focus();
    return;
  }

  const exams = getStoredExams();
  const matchedExam = exams.find(e => e.accessCode.toUpperCase() === enteredCode);

  if (!matchedExam) {
    showToast(`ไม่พบรหัสข้อสอบ "${enteredCode}" กรุณาตรวจสอบกับอาจารย์ผู้สอน`, 'error');
    return;
  }

  if (matchedExam.status === 'draft') {
    showToast(`ข้อสอบ "${matchedExam.title}" ยังเป็นฉบับร่าง ยังไม่เปิดให้เข้าทำ`, 'warning');
    return;
  }

  if (matchedExam.status === 'closed') {
    showToast(`ข้อสอบ "${matchedExam.title}" ปิดรับการสอบแล้ว`, 'warning');
    return;
  }

  showExamInstructions(matchedExam);
}

function selectExamByCode(accessCode) {
  document.getElementById('student-code-input').value = accessCode;
  handleFindExamByCode();
}

function showExamInstructions(exam) {
  AppState.activeExamSession = {
    exam: exam,
    startTime: null,
    answers: {},
    timeRemaining: exam.durationMinutes * 60
  };

  document.getElementById('instr-exam-title').textContent = exam.title;
  document.getElementById('instr-exam-topic').textContent = translateTopic(exam.topic);
  document.getElementById('instr-exam-desc').textContent = 
    exam.description || 'ยินดีต้อนรับสู่การสอบภาษาอังกฤษ โปรดอ่านคำชี้แจงด้านล่างให้ละเอียดก่อนเริ่มสอบ';
  document.getElementById('instr-duration').textContent = `${exam.durationMinutes} นาที`;
  document.getElementById('instr-questions-count').textContent = `${exam.questions ? exam.questions.length : 0} ข้อ`;

  const totalPoints = exam.questions ? exam.questions.reduce((sum, q) => sum + (q.points || 10), 0) : 0;
  document.getElementById('instr-max-points').textContent = `${totalPoints} คะแนน`;

  navigateTo('view-student-instructions');
}

// ==============================================================================
// 8. หน้าทำข้อสอบสดและนาฬิกานับถอยหลัง (LIVE EXAM RUNNER)
// ==============================================================================

function startLiveExamSession() {
  if (!AppState.activeExamSession || !AppState.activeExamSession.exam) {
    showToast('ไม่พบข้อมูลข้อสอบ กรุณากลับสู่พอร์ทัล', 'error');
    navigateTo('view-student-portal');
    return;
  }

  const exam = AppState.activeExamSession.exam;

  if (!exam.questions || exam.questions.length === 0) {
    showToast('ชุดข้อสอบนี้ยังไม่มีคำถาม', 'error');
    navigateTo('view-student-portal');
    return;
  }

  AppState.userSelectedAnswers = {};
  AppState.currentQuestionIndex = 0;
  AppState.timerSecondsRemaining = exam.durationMinutes * 60;
  AppState.activeExamSession.startTime = new Date();

  document.getElementById('runner-exam-title').textContent = exam.title;
  document.getElementById('runner-exam-topic').textContent = translateTopic(exam.topic);

  renderQuestionPalette();
  renderCurrentQuestion();

  updateTimerDisplay();
  if (AppState.examTimerInterval) clearInterval(AppState.examTimerInterval);
  AppState.examTimerInterval = setInterval(handleTimerTick, 1000);

  navigateTo('view-exam-session');
}

function handleTimerTick() {
  AppState.timerSecondsRemaining--;

  updateTimerDisplay();

  const timerBox = document.getElementById('runner-timer-box');
  if (AppState.timerSecondsRemaining <= 120) {
    timerBox.classList.add('urgent');
  } else {
    timerBox.classList.remove('urgent');
  }

  // เมื่อเวลาหมดลง ส่งข้อสอบอัตโนมัติ
  if (AppState.timerSecondsRemaining <= 0) {
    clearInterval(AppState.examTimerInterval);
    AppState.examTimerInterval = null;
    showToast('หมดเวลาสอบแล้ว! ระบบกำลังส่งข้อสอบของคุณโดยอัตโนมัติ', 'warning');
    submitFinalExam(true);
  }
}

function updateTimerDisplay() {
  const display = document.getElementById('runner-timer-display');
  const seconds = Math.max(0, AppState.timerSecondsRemaining);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function renderCurrentQuestion() {
  const exam = AppState.activeExamSession.exam;
  const questions = exam.questions;
  const qIndex = AppState.currentQuestionIndex;
  const q = questions[qIndex];

  document.getElementById('runner-question-counter').textContent = `ข้อที่ ${qIndex + 1} จากทั้งหมด ${questions.length} ข้อ`;
  document.getElementById('runner-question-points').textContent = `คะแนนข้อนี้: ${q.points || 10} คะแนน`;
  document.getElementById('runner-question-text').textContent = q.text;

  const optionsContainer = document.getElementById('runner-options-container');
  optionsContainer.innerHTML = '';

  const savedAnswer = AppState.userSelectedAnswers[qIndex];

  q.options.forEach((optText, optIdx) => {
    const isSelected = savedAnswer === optIdx;
    const label = document.createElement('label');
    label.className = `student-option-label ${isSelected ? 'selected' : ''}`;

    const letter = String.fromCharCode(65 + optIdx);

    label.innerHTML = `
      <input type="radio" name="active-q-answer" value="${optIdx}" ${isSelected ? 'checked' : ''} />
      <span class="student-option-letter">${letter}</span>
      <span class="student-option-text">${escapeHtml(optText)}</span>
    `;

    label.onclick = () => {
      AppState.userSelectedAnswers[qIndex] = optIdx;

      document.querySelectorAll('.student-option-label').forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');

      updatePaletteButtonStatus(qIndex, true);
    };

    optionsContainer.appendChild(label);
  });

  const prevBtn = document.getElementById('btn-prev-question');
  const nextBtn = document.getElementById('btn-next-question');

  prevBtn.disabled = qIndex === 0;

  if (qIndex === questions.length - 1) {
    nextBtn.textContent = 'ตรวจสอบ & ส่งข้อสอบ';
    nextBtn.className = 'btn btn-success';
  } else {
    nextBtn.textContent = 'ข้อถัดไป →';
    nextBtn.className = 'btn btn-primary';
  }

  highlightActivePaletteButton(qIndex);
}

function renderQuestionPalette() {
  const exam = AppState.activeExamSession.exam;
  const container = document.getElementById('runner-palette-grid');
  container.innerHTML = '';

  exam.questions.forEach((_, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'palette-btn';
    btn.id = `palette-btn-${idx}`;
    btn.textContent = idx + 1;

    btn.onclick = () => {
      AppState.currentQuestionIndex = idx;
      renderCurrentQuestion();
    };

    container.appendChild(btn);
  });
}

function updatePaletteButtonStatus(qIndex, isAnswered) {
  const btn = document.getElementById(`palette-btn-${qIndex}`);
  if (!btn) return;
  if (isAnswered) {
    btn.classList.add('answered');
  } else {
    btn.classList.remove('answered');
  }
}

function highlightActivePaletteButton(qIndex) {
  document.querySelectorAll('.palette-btn').forEach((btn, idx) => {
    if (idx === qIndex) {
      btn.classList.add('current');
    } else {
      btn.classList.remove('current');
    }
  });
}

function handleNextQuestion() {
  const exam = AppState.activeExamSession.exam;
  if (AppState.currentQuestionIndex < exam.questions.length - 1) {
    AppState.currentQuestionIndex++;
    renderCurrentQuestion();
  } else {
    promptSubmitExamConfirmation();
  }
}

function handlePrevQuestion() {
  if (AppState.currentQuestionIndex > 0) {
    AppState.currentQuestionIndex--;
    renderCurrentQuestion();
  }
}

function promptSubmitExamConfirmation() {
  const exam = AppState.activeExamSession.exam;
  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(AppState.userSelectedAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;

  const summary = document.getElementById('submit-modal-summary');
  if (unansweredCount === 0) {
    summary.innerHTML = `คุณตอบคำถามครบ <strong>ทั้ง ${totalQuestions} ข้อแล้ว</strong> พร้อมส่งข้อสอบแล้วหรือไม่?`;
  } else {
    summary.innerHTML = `
      คุณตอบคำถามแล้ว <strong>${answeredCount} จาก ${totalQuestions} ข้อ</strong><br/>
      <span style="color: var(--warning-text); font-weight: 600;">⚠️ ยังเหลือข้อที่ยังไม่ได้ตอบอีก ${unansweredCount} ข้อ!</span>
    `;
  }

  openModal('modal-submit-confirm');
}

// ==============================================================================
// 9. ระบบตรวจคะแนนและผลการสอบ (SCORING & RESULTS ENGINE)
// ==============================================================================

function submitFinalExam(isAutoSubmit = false) {
  closeModal('modal-submit-confirm');

  if (AppState.examTimerInterval) {
    clearInterval(AppState.examTimerInterval);
    AppState.examTimerInterval = null;
  }

  const exam = AppState.activeExamSession.exam;
  const questions = exam.questions;
  const answers = AppState.userSelectedAnswers;

  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  questions.forEach((q, idx) => {
    const qPoints = q.points || 10;
    maxScore += qPoints;

    const chosenOption = answers[idx];
    if (typeof chosenOption === 'number' && chosenOption === q.correctAnswer) {
      totalScore += qPoints;
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const durationUsedSeconds = (exam.durationMinutes * 60) - Math.max(0, AppState.timerSecondsRemaining);

  const attemptRecord = {
    id: `att-${Date.now()}`,
    studentName: AppState.studentName || 'สมชาย รักเรียน',
    examId: exam.id,
    examTitle: exam.title,
    topic: exam.topic,
    score: totalScore,
    maxScore: maxScore,
    percentage: percentage,
    correctCount: correctCount,
    incorrectCount: incorrectCount,
    timeTakenSeconds: Math.max(1, durationUsedSeconds),
    submittedAt: new Date().toISOString(),
    answers: { ...answers }
  };

  const attempts = getStoredAttempts();
  attempts.push(attemptRecord);
  saveStoredAttempts(attempts);

  renderStudentResultsView(attemptRecord, exam);
  navigateTo('view-student-results');
}

function renderStudentResultsView(attempt, exam) {
  document.getElementById('result-exam-title').textContent = exam.title;
  document.getElementById('result-exam-topic').textContent = translateTopic(exam.topic);
  document.getElementById('result-student-name').textContent = attempt.studentName;

  document.getElementById('result-score-percent').textContent = `${attempt.percentage}%`;
  document.getElementById('result-raw-score').textContent = `${attempt.score} / ${attempt.maxScore}`;
  document.getElementById('result-correct-count').textContent = attempt.correctCount;
  document.getElementById('result-incorrect-count').textContent = attempt.incorrectCount;

  const mins = Math.floor(attempt.timeTakenSeconds / 60);
  const secs = attempt.timeTakenSeconds % 60;
  document.getElementById('result-time-taken').textContent = `${mins} นาที ${secs} วินาที`;

  const scoreCircle = document.getElementById('result-score-circle');
  const gradeLabel = document.getElementById('result-grade-label');
  const titleEl = document.getElementById('result-performance-title');
  const msgEl = document.getElementById('result-performance-msg');

  scoreCircle.classList.remove('pass', 'fail');

  if (attempt.percentage >= 90) {
    scoreCircle.classList.add('pass');
    gradeLabel.textContent = 'เกรด A (ยอดเยี่ยม)';
    titleEl.textContent = 'ผลการประเมินยอดเยี่ยมมาก!';
    msgEl.textContent = 'คุณมีความรู้ความเข้าใจในโครงสร้างภาษาอังกฤษและคำศัพท์ในระดับดีเลิศ';
  } else if (attempt.percentage >= 80) {
    scoreCircle.classList.add('pass');
    gradeLabel.textContent = 'เกรด B (ดีมาก)';
    titleEl.textContent = 'ผลการประเมินอยู่ในเกณฑ์ดีมาก!';
    msgEl.textContent = 'คุณสามารถใช้ไวยากรณ์และทำความเข้าใจบทความภาษาอังกฤษได้เป็นอย่างดี';
  } else if (attempt.percentage >= 70) {
    scoreCircle.classList.add('pass');
    gradeLabel.textContent = 'เกรด C (ดี)';
    titleEl.textContent = 'ผลการประเมินผ่านเกณฑ์น่าพอใจ!';
    msgEl.textContent = 'คุณมีพื้นฐานที่ดี สามารถทบทวนคำอธิบายเฉลยด้านล่างเพื่อพัฒนาให้ดียิ่งขึ้น';
  } else if (attempt.percentage >= 60) {
    scoreCircle.classList.add('pass');
    gradeLabel.textContent = 'เกรด D (ผ่านเกณฑ์)';
    titleEl.textContent = 'ผ่านเกณฑ์มาตรฐานขั้นต่ำ';
    msgEl.textContent = 'ควรทบทวนไวยากรณ์และคำศัพท์ที่ทำผิดเพื่อเพิ่มความมั่นใจในการใช้งานจริง';
  } else {
    scoreCircle.classList.add('fail');
    gradeLabel.textContent = 'เกรด F (ควรปรับปรุง)';
    titleEl.textContent = 'ยังไม่ผ่านเกณฑ์การประเมิน';
    msgEl.textContent = 'แนะนำให้ศึกษาทบทวนเนื้อหาและปรึกษาอาจารย์ผู้สอน พร้อมดูคำอธิบายเฉลยด้านล่าง';
  }

  const reviewContainer = document.getElementById('results-review-container');
  const hiddenNotice = document.getElementById('results-hidden-notice');
  const listContainer = document.getElementById('results-questions-review-list');

  if (exam.visibility === 'score_only') {
    reviewContainer.style.display = 'none';
    hiddenNotice.style.display = 'block';
  } else {
    reviewContainer.style.display = 'block';
    hiddenNotice.style.display = 'none';
    listContainer.innerHTML = '';

    exam.questions.forEach((q, idx) => {
      const userChoice = attempt.answers[idx];
      const isCorrect = typeof userChoice === 'number' && userChoice === q.correctAnswer;
      const card = document.createElement('div');
      card.className = `review-question-card ${isCorrect ? 'correct' : 'incorrect'}`;

      const optionsHtml = q.options.map((opt, optIdx) => {
        const isUserChoice = userChoice === optIdx;
        const isAnswerKey = q.correctAnswer === optIdx;

        let extraClass = '';
        let badgeText = '';

        if (isAnswerKey) {
          extraClass = 'correct-answer';
          badgeText = '✓ เฉลยข้อที่ถูกต้อง';
        } else if (isUserChoice && !isCorrect) {
          extraClass = 'user-selected-wrong';
          badgeText = '✗ คำตอบที่คุณเลือก';
        }

        return `
          <div class="review-option ${extraClass}">
            <span><strong>${String.fromCharCode(65 + optIdx)}.</strong> ${escapeHtml(opt)}</span>
            ${badgeText ? `<span>${badgeText}</span>` : ''}
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="question-number-badge">ข้อที่ ${idx + 1}</span>
          <span class="badge ${isCorrect ? 'badge-published' : 'badge-closed'}">
            ${isCorrect ? 'ตอบถูกต้อง (+10 คะแนน)' : 'ตอบผิด (0 คะแนน)'}
          </span>
        </div>
        <p style="font-weight: 600; color: var(--navy-dark); margin-bottom: 0.75rem;">${escapeHtml(q.text)}</p>
        <div class="review-options-list">${optionsHtml}</div>
        ${q.explanation ? `<div class="explanation-box"><strong>คำอธิบายจากอาจารย์:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
      `;

      listContainer.appendChild(card);
    });
  }
}

// ==============================================================================
// 10. ระบบวิเคราะห์ผลสัมฤทธิ์ทางการเรียนและส่งออก CSV (ANALYTICS & CSV)
// ==============================================================================

function renderAnalyticsDashboard() {
  const exams = getStoredExams();
  const attempts = getStoredAttempts();

  const filterSelect = document.getElementById('analytics-exam-filter');
  const currentSelectedExam = filterSelect.value || 'all';
  filterSelect.innerHTML = '<option value="all">ภาพรวม: ข้อสอบทุกชุด (All Exams)</option>';
  exams.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.id;
    opt.textContent = `${e.title} (${e.accessCode})`;
    if (e.id === currentSelectedExam) opt.selected = true;
    filterSelect.appendChild(opt);
  });

  const selectedExamId = filterSelect.value;
  const filteredAttempts = selectedExamId === 'all' 
    ? attempts 
    : attempts.filter(a => a.examId === selectedExamId);

  const emptyState = document.getElementById('analytics-empty-state');
  if (filteredAttempts.length === 0) {
    emptyState.style.display = 'block';
    document.getElementById('analytics-attempts').textContent = '0';
    document.getElementById('analytics-avg-score').textContent = '0%';
    document.getElementById('analytics-high-score').textContent = '0%';
    document.getElementById('analytics-low-score').textContent = '0%';
    document.getElementById('attempts-count-label').textContent = '0 รายการ';
    document.getElementById('student-results-tbody').innerHTML = '';
    document.getElementById('question-analysis-tbody').innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">ยังไม่มีข้อมูลการส่งข้อสอบ</td></tr>';
    renderScoreDistributionBars([0, 0, 0, 0, 0, 0], 0);
    renderTopicAccuracyBars({});
    return;
  }

  emptyState.style.display = 'none';

  // 1. ตัวชี้วัดสรุปผล
  const totalAttempts = filteredAttempts.length;
  const percentages = filteredAttempts.map(a => a.percentage);
  const avgPercent = Math.round(percentages.reduce((a, b) => a + b, 0) / totalAttempts);
  const maxPercent = Math.max(...percentages);
  const minPercent = Math.min(...percentages);

  document.getElementById('analytics-attempts').textContent = totalAttempts;
  document.getElementById('analytics-avg-score').textContent = `${avgPercent}%`;
  document.getElementById('analytics-high-score').textContent = `${maxPercent}%`;
  document.getElementById('analytics-low-score').textContent = `${minPercent}%`;
  document.getElementById('attempts-count-label').textContent = `${totalAttempts} รายการ`;

  // 2. การกระจายคะแนน (Score Distribution)
  const distribution = [0, 0, 0, 0, 0, 0];
  percentages.forEach(p => {
    if (p < 50) distribution[0]++;
    else if (p < 60) distribution[1]++;
    else if (p < 70) distribution[2]++;
    else if (p < 80) distribution[3]++;
    else if (p < 90) distribution[4]++;
    else distribution[5]++;
  });
  renderScoreDistributionBars(distribution, totalAttempts);

  // 3. ความแม่นยำตามหมวดหมู่
  const topicStats = {};
  filteredAttempts.forEach(attempt => {
    const exam = exams.find(e => e.id === attempt.examId);
    if (!exam || !exam.questions) return;

    exam.questions.forEach((q, idx) => {
      const qTopic = q.topic || exam.topic || 'General';
      if (!topicStats[qTopic]) {
        topicStats[qTopic] = { correct: 0, total: 0 };
      }
      topicStats[qTopic].total++;
      if (attempt.answers && attempt.answers[idx] === q.correctAnswer) {
        topicStats[qTopic].correct++;
      }
    });
  });
  renderTopicAccuracyBars(topicStats);

  // 4. ตารางวิเคราะห์คำถาม
  renderQuestionAnalysisTable(selectedExamId, filteredAttempts, exams);

  // 5. ตารางประวัตินักเรียน
  renderStudentAttemptsTable(filteredAttempts);
}

function renderScoreDistributionBars(distribution, totalCount) {
  const maxVal = Math.max(...distribution, 1);

  distribution.forEach((count, idx) => {
    const bar = document.getElementById(`dist-bar-${idx}`);
    const val = document.getElementById(`dist-val-${idx}`);
    if (bar && val) {
      val.textContent = count;
      const heightPercent = Math.max(6, Math.round((count / maxVal) * 100));
      bar.style.height = `${heightPercent}%`;
    }
  });
}

function renderTopicAccuracyBars(topicStats) {
  const container = document.getElementById('topic-performance-container');
  container.innerHTML = '';

  const topics = Object.keys(topicStats);
  if (topics.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">ไม่มีข้อมูลหมวดหมู่ในตัวกรองนี้</p>';
    return;
  }

  const colorClasses = ['fill-blue', 'fill-green', 'fill-purple', 'fill-amber'];

  topics.forEach((topicName, idx) => {
    const stat = topicStats[topicName];
    const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    const colorClass = colorClasses[idx % colorClasses.length];

    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = `
      <div class="progress-item-header">
        <span>${escapeHtml(translateTopic(topicName))} (${stat.correct}/${stat.total} ข้อที่ตอบถูก)</span>
        <strong>${accuracy}%</strong>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill ${colorClass}" style="width: ${accuracy}%;"></div>
      </div>
    `;
    container.appendChild(itemDiv);
  });
}

function renderQuestionAnalysisTable(selectedExamId, filteredAttempts, exams) {
  const tbody = document.getElementById('question-analysis-tbody');
  tbody.innerHTML = '';

  let targetQuestions = [];
  if (selectedExamId !== 'all') {
    const ex = exams.find(e => e.id === selectedExamId);
    if (ex && ex.questions) {
      targetQuestions = ex.questions.map((q, idx) => ({ ...q, examId: ex.id, index: idx }));
    }
  } else {
    exams.forEach(ex => {
      if (ex.questions) {
        ex.questions.forEach((q, idx) => {
          targetQuestions.push({ ...q, examId: ex.id, index: idx });
        });
      }
    });
  }

  if (targetQuestions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">ไม่พบข้อมูลข้อสอบ</td></tr>';
    return;
  }

  targetQuestions.slice(0, 10).forEach((q, rowIdx) => {
    let correct = 0;
    let incorrect = 0;

    filteredAttempts.forEach(att => {
      if (att.examId === q.examId && att.answers) {
        if (att.answers[q.index] === q.correctAnswer) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const total = correct + incorrect;
    const rate = total > 0 ? Math.round((correct / total) * 100) : 0;
    const rateColor = rate >= 75 ? 'var(--success-base)' : rate >= 50 ? 'var(--warning-base)' : 'var(--danger-base)';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>ข้อ #${rowIdx + 1}</strong></td>
      <td>
        <span style="font-weight: 500; color: var(--navy-dark);">${escapeHtml(q.text.substring(0, 75))}${q.text.length > 75 ? '...' : ''}</span>
      </td>
      <td><span class="badge badge-topic">${escapeHtml(translateTopic(q.topic || 'English'))}</span></td>
      <td style="color: var(--success-base); font-weight: 600;">${correct}</td>
      <td style="color: var(--danger-base); font-weight: 600;">${incorrect}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <strong style="color: ${rateColor}; min-width: 40px;">${rate}%</strong>
          <div class="progress-bar-bg" style="width: 80px; height: 6px;">
            <div class="progress-bar-fill" style="width: ${rate}%; background-color: ${rateColor};"></div>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderStudentAttemptsTable(filteredAttempts) {
  const tbody = document.getElementById('student-results-tbody');
  tbody.innerHTML = '';

  const sorted = [...filteredAttempts].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  sorted.forEach(att => {
    const tr = document.createElement('tr');
    const badgeClass = att.percentage >= 70 ? 'badge-published' : att.percentage >= 50 ? 'badge-draft' : 'badge-closed';
    const dateStr = new Date(att.submittedAt).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    tr.innerHTML = `
      <td><strong>${escapeHtml(att.studentName)}</strong></td>
      <td>${escapeHtml(att.examTitle)}</td>
      <td>${att.score} / ${att.maxScore}</td>
      <td><span class="badge ${badgeClass}">${att.percentage}%</span></td>
      <td><span class="badge badge-topic">${escapeHtml(translateTopic(att.topic))}</span></td>
      <td style="font-size: 0.82rem; color: var(--text-muted);">${dateStr}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * ส่งออกไฟล์ CSV พร้อมรองรับภาษาไทย (UTF-8 with BOM)
 */
function exportResultsToCSV() {
  const attempts = getStoredAttempts();
  if (attempts.length === 0) {
    showToast('ไม่มีประวัติการสอบสำหรับส่งออกไฟล์', 'warning');
    return;
  }

  const headers = ['รหัสการสอบ (ID)', 'ชื่อนักเรียน', 'ชื่อชุดข้อสอบ', 'หมวดหมู่', 'คะแนนที่ได้', 'คะแนนเต็ม', 'ร้อยละ', 'จำนวนข้อถูก', 'จำนวนข้อผิด', 'เวลาที่ใช้ (วินาที)', 'วันที่เวลาส่ง'];

  const rows = attempts.map(a => [
    `"${a.id}"`,
    `"${a.studentName.replace(/"/g, '""')}"`,
    `"${a.examTitle.replace(/"/g, '""')}"`,
    `"${translateTopic(a.topic)}"`,
    a.score,
    a.maxScore,
    `${a.percentage}%`,
    a.correctCount,
    a.incorrectCount,
    a.timeTakenSeconds,
    `"${new Date(a.submittedAt).toLocaleString('th-TH')}"`
  ]);

  // ใส่ BOM (\uFEFF) เพื่อให้โปรแกรม Excel เปิดภาษาไทยได้ไม่เป็นตัวต่างดาว
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `examforge_ผลคะแนน_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('ส่งออกและดาวน์โหลดไฟล์ CSV ผลคะแนนสำเร็จ!', 'success');
}

function exportJSONBackup() {
  const data = {
    exams: getStoredExams(),
    attempts: getStoredAttempts(),
    questionBank: getStoredQuestionBank(),
    exportedAt: new Date().toISOString()
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `examforge_backup_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('ดาวน์โหลดไฟล์สำรองข้อมูล JSON แล้ว', 'info');
}

/**
 * รวม HTML, CSS และ JavaScript ทั้งหมดให้เป็นไฟล์เดียว (Single File HTML)
 * เพื่อให้นำไปอัปโหลดขึ้น GitHub หรือเปิดใช้งานแบบ Offline ได้ทันทีในไฟล์เดียว
 */
async function downloadStandaloneHTML() {
  try {
    showToast('กำลังประมวลผลและรวมไฟล์ HTML...', 'info');

    const [cssRes, jsRes, htmlRes] = await Promise.all([
      fetch('./style.css').then(r => r.text()),
      fetch('./script.js').then(r => r.text()),
      fetch('./index.html').then(r => r.text())
    ]);

    // แทนที่แท็ก link CSS ด้วย inline <style>
    let combinedHTML = htmlRes.replace(
      /<link\s+rel="stylesheet"\s+href="\.\/style\.css"\s*\/?>/i,
      `<style>\n${cssRes}\n</style>`
    );

    // แทนที่แท็ก script ด้วย inline <script>
    combinedHTML = combinedHTML.replace(
      /<script\s+src="\.\/script\.js"><\/script>/i,
      `<script>\n${jsRes}\n<\/script>`
    );

    const blob = new Blob([combinedHTML], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('ดาวน์โหลดไฟล์ index.html รวมสำเร็จ! นำไปวางใน GitHub ได้เลย', 'success');
  } catch (err) {
    console.error('Error generating standalone HTML:', err);
    showToast('ไม่สามารถสร้างไฟล์รวมได้ กรุณาลองใหม่อีกครั้ง', 'error');
  }
}

// ==============================================================================
// 11. ฟังก์ชันแปลคำศัพท์และตัวช่วย (TRANSLATION HELPERS)
// ==============================================================================

function translateTopic(topic) {
  const map = {
    'Vocabulary': 'คำศัพท์ (Vocabulary)',
    'Grammar': 'ไวยากรณ์ (Grammar)',
    'Tenses': 'กาลเวลา (Tenses)',
    'Reading': 'การอ่าน (Reading)',
    'General English': 'ภาษาอังกฤษทั่วไป'
  };
  return map[topic] || topic;
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️';

  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// สลับภาษา TH <-> EN
function toggleLanguage() {
  if (AppState.currentLanguage === 'th') {
    AppState.currentLanguage = 'en';
    document.getElementById('lang-flag').textContent = '🇬🇧';
    document.getElementById('lang-label').textContent = 'English';
    showToast('Switched to English interface.', 'info');
  } else {
    AppState.currentLanguage = 'th';
    document.getElementById('lang-flag').textContent = '🇹🇭';
    document.getElementById('lang-label').textContent = 'ภาษาไทย';
    showToast('เปลี่ยนเป็นเมนูภาษาไทยแล้ว', 'info');
  }
}

// ==============================================================================
// 12. การตั้งค่าเหตุการณ์และเริ่มต้นระบบ (INITIALIZATION)
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // โหลดและเตรียมข้อมูลเริ่มต้น
  getStoredExams();
  getStoredAttempts();
  getStoredQuestionBank();

  // ปุ่มส่วนหัวหลัก
  document.getElementById('brand-home-btn')?.addEventListener('click', () => navigateTo('view-welcome'));
  document.getElementById('nav-home-btn')?.addEventListener('click', () => navigateTo('view-welcome'));
  document.getElementById('nav-teacher-btn')?.addEventListener('click', () => navigateTo('view-teacher', 'tab-overview'));
  document.getElementById('nav-student-btn')?.addEventListener('click', () => navigateTo('view-student-portal'));
  document.getElementById('lang-toggle-btn')?.addEventListener('click', toggleLanguage);

  // ปุ่มในหน้าต้อนรับ
  document.getElementById('welcome-teacher-btn')?.addEventListener('click', () => navigateTo('view-teacher', 'tab-overview'));
  document.getElementById('welcome-student-btn')?.addEventListener('click', () => navigateTo('view-student-portal'));
  document.getElementById('welcome-quick-test-btn')?.addEventListener('click', () => {
    document.getElementById('student-code-input').value = 'VOCAB-101';
    navigateTo('view-student-portal');
    handleFindExamByCode();
  });

  // แถบเมนูด้านข้างของครู
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTeacherTab(tabId);
    });
  });
  document.getElementById('sidebar-student-switch')?.addEventListener('click', () => navigateTo('view-student-portal'));

  // ปุ่มสร้างข้อสอบ
  document.getElementById('btn-create-exam-top')?.addEventListener('click', startNewExamCreation);
  document.getElementById('btn-create-exam-tab')?.addEventListener('click', startNewExamCreation);
  document.getElementById('btn-view-all-exams')?.addEventListener('click', () => switchTeacherTab('tab-exams'));

  // การค้นหาและตัวกรองในแท็บข้อสอบ
  document.getElementById('filter-exam-search')?.addEventListener('input', renderFullExamsTable);
  document.getElementById('filter-exam-status')?.addEventListener('change', renderFullExamsTable);
  document.getElementById('filter-exam-topic')?.addEventListener('change', renderFullExamsTable);

  // คลังข้อสอบ
  document.getElementById('btn-add-bank-question')?.addEventListener('click', openAddBankItemModal);
  document.getElementById('bank-search-input')?.addEventListener('input', renderQuestionBankList);
  document.getElementById('bank-topic-filter')?.addEventListener('change', renderQuestionBankList);
  document.getElementById('btn-save-bank-item')?.addEventListener('click', saveBankItemFromModal);

  // การวิเคราะห์และส่งออก CSV
  document.getElementById('analytics-exam-filter')?.addEventListener('change', renderAnalyticsDashboard);
  document.getElementById('btn-export-csv')?.addEventListener('click', exportResultsToCSV);

  // การตั้งค่า
  document.getElementById('btn-reset-demo-data')?.addEventListener('click', () => openModal('modal-reset-confirm'));
  document.getElementById('btn-confirm-reset-demo')?.addEventListener('click', () => {
    closeModal('modal-reset-confirm');
    resetDemoDataToDefaults();
  });
  document.getElementById('btn-export-json-backup')?.addEventListener('click', exportJSONBackup);
  document.getElementById('btn-download-standalone-html')?.addEventListener('click', downloadStandaloneHTML);
  document.getElementById('btn-quick-download-html-guide')?.addEventListener('click', downloadStandaloneHTML);

  // ควบคุมฟอร์มสร้างข้อสอบ
  document.getElementById('btn-cancel-editor')?.addEventListener('click', () => navigateTo('view-teacher', 'tab-exams'));
  document.getElementById('btn-cancel-editor-bottom')?.addEventListener('click', () => navigateTo('view-teacher', 'tab-exams'));
  document.getElementById('btn-generate-code')?.addEventListener('click', () => {
    document.getElementById('exam-code-input').value = generateUniqueExamCode();
  });
  document.getElementById('btn-add-question-builder')?.addEventListener('click', () => addQuestionToEditorForm());
  document.getElementById('btn-import-from-bank')?.addEventListener('click', openImportBankModal);
  document.getElementById('btn-save-draft')?.addEventListener('click', () => handleSaveExam('draft'));
  document.getElementById('btn-publish-exam')?.addEventListener('click', () => handleSaveExam('published'));

  // พอร์ทัลนักเรียน
  document.getElementById('btn-find-exam')?.addEventListener('click', handleFindExamByCode);
  document.getElementById('student-code-input')?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleFindExamByCode();
  });

  // คำชี้แจงการสอบ
  document.getElementById('btn-back-to-portal')?.addEventListener('click', () => navigateTo('view-student-portal'));
  document.getElementById('btn-start-exam-session')?.addEventListener('click', startLiveExamSession);

  // การทำข้อสอบ
  document.getElementById('btn-prev-question')?.addEventListener('click', handlePrevQuestion);
  document.getElementById('btn-next-question')?.addEventListener('click', handleNextQuestion);
  document.getElementById('btn-finish-test')?.addEventListener('click', promptSubmitExamConfirmation);
  document.getElementById('btn-submit-exam-header')?.addEventListener('click', promptSubmitExamConfirmation);
  document.getElementById('btn-confirm-final-submit')?.addEventListener('click', () => submitFinalExam(false));

  // หน้าผลคะแนน
  document.getElementById('btn-return-portal')?.addEventListener('click', () => navigateTo('view-student-portal'));
  document.getElementById('btn-result-to-teacher')?.addEventListener('click', () => navigateTo('view-teacher', 'tab-analytics'));

  // ลบข้อสอบ
  document.getElementById('btn-confirm-delete-exam')?.addEventListener('click', executeDeleteExam);

  // ปิด Modal
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  // เริ่มต้นแสดงผล
  refreshTeacherDashboard();
  renderStudentPortalExams();
});
