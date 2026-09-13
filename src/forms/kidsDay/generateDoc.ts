import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';
import { FormData } from './types';

const SERVICE_LABELS: Record<string, { title: string; description: string }> = {
  'social-domestic': {
    title: 'Әлеуметтік-тұрмыстық қызметтер:',
    description: ' Күндізгі болу кезінде тамақтандыруды ұйымдастыру, демалыс пен гигиеналық процедураларға көмектесу.',
  },
  'social-medical': {
    title: 'Әлеуметтік-медициналық қызметтер:',
    description: ' Емдік дене шынықтыру (ЕДШ), массаж, физиотерапия, дәрігерлік бақылау, салауатты өмір салтын қалыптастыру.',
  },
  'social-pedagogical': {
    title: 'Әлеуметтік-педагогикалық қызметтер:',
    description: ' Арнайы педагогтардың (дефектолог, логопед, сурдопедагог) сабақтары, когнитивті және сенсорлық дағдыларды дамыту, тәрбиелік шаралар.',
  },
  'social-psychological': {
    title: 'Әлеуметтік-психологиялық қызметтер:',
    description: ' Психологиялық диагностика, тренингтер, психологиялық түзету (сенсорлық бөлме), социометрикалық бейімдеу.',
  },
  'social-cultural': {
    title: 'Әлеуметтік-мәдени қызметтер:',
    description: ' Мәдени-бұқаралық шаралар, үйірмелер, мерекелер ұйымдастыру, шығармашылық дағдыларды дамыту (арт-терапия, музыка).',
  },
  'social-labor': {
    title: 'Әлеуметтік-еңбек қызметтері:',
    description: ' Еңбек терапиясы (эстетикалық және қарапайым еңбек дағдыларына үйрету, шеберханалар).',
  },
  'social-legal': {
    title: 'Әлеуметтік-құқықтық қызметтер:',
    description: ' Заңды өкілдерге құқықтық кеңес беру, баланың құқықтары мен жеңілдіктерін қорғауға жәрдемдесу.',
  },
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `"${day}" ${month} ${year} ж.`;
}

function createTextRun(text: string, bold: boolean = false, size: number = 24): TextRun {
  return new TextRun({
    text,
    bold,
    size,
    font: 'Times New Roman',
  });
}

function createParagraph(text: string, bold: boolean = false, alignment: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.LEFT, spacing: { after?: number; before?: number } = { after: 120 }): Paragraph {
  return new Paragraph({
    alignment,
    spacing,
    children: [createTextRun(text, bold)],
  });
}

export async function generateDocument(data: FormData): Promise<void> {
  const sections: Paragraph[] = [];

  // Header
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        createTextRun(
          'Мүгедектігі бар балаларға жартылай стационарлық типтегі күндізгі болу орталығында арнаулы әлеуметтік қызметтер көрсету үшін тұрғын үй және материалдық-тұрмыстық жағдайларды зерттеу-тексеру',
          true,
          24
        ),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [createTextRun('АКТІСІ', true, 24)],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 80 },
      children: [createTextRun(`№ ${data.aktNumber}`, false, 24)],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
      children: [createTextRun(formatDate(data.aktDate), false, 24)],
    }),
  );

  // I. ЖАЛПЫ МӘЛІМЕТТЕР
  sections.push(
    createParagraph('I. ЖАЛПЫ МӘЛІМЕТТЕР', true, AlignmentType.LEFT, { before: 200, after: 120 }),
  );

  let itemNum = 1;
  sections.push(createParagraph(`${itemNum}. Баланың Т.А.Ә. (бар болса): ${data.childFullName || '_______________'}`));
  itemNum++;
  sections.push(createParagraph(`${itemNum}. Туған күні: ${formatDate(data.childBirthDate) || '_______________'}; ЖСН: ${data.childIIN || '_______________'}`));
  itemNum++;
  sections.push(createParagraph(`${itemNum}. Мүгедектік санаты мен мерзімі (бар болса): ${data.disabilityCategory || '_______________'}`));
  itemNum++;
  sections.push(createParagraph(`${itemNum}. Тұрғылықты мекенжайы: ${data.address || '_______________'}`));
  itemNum++;
  sections.push(createParagraph(`${itemNum}. Байланыс телефоны (ата-анасы/заңды өкілі): ${data.parentPhone || '_______________'}`));
  itemNum++;
  sections.push(createParagraph(`${itemNum}. Мемлекеттік жәрдемақы/төлемдер түрі мен мөлшері: ${data.benefitsInfo || '_______________'}`));
  itemNum++;

  // II. АТА-АНАЛАРЫ
  sections.push(
    createParagraph('II. АТА-АНАЛАРЫ (ЗАҢДЫ ӨКІЛДЕРІ) ЖӘНЕ ОТБАСЫ МӘРТЕБЕСІ', true, AlignmentType.LEFT, { before: 200, after: 120 }),
  );

  sections.push(createParagraph(`${itemNum}. Заңды өкілдері туралы мәлімет:`));
  itemNum++;
  sections.push(createParagraph(`   Анасының Т.А.Ә.: ${data.motherFullName || '_______________'}`));
  sections.push(createParagraph(`   Жұмыс орны/қызметі: ${data.motherWork || '_______________'}`));
  sections.push(createParagraph(`   Әкесінің Т.А.Ә.: ${data.fatherFullName || '_______________'}`));
  sections.push(createParagraph(`   Жұмыс орны/қызметі: ${data.fatherWork || '_______________'}`));
  if (data.guardianInfo) {
    sections.push(createParagraph(`   Қамқоршысы/Қорғаншысы (бар болса): ${data.guardianInfo}`));
  }
  sections.push(createParagraph(`${itemNum}. Бірге тұратын отбасы мүшелері: ${data.familyMembers || '_______________'}`));
  itemNum++;

  const socialStatusLabels: Record<string, string> = {
    large_family: 'Көпбалалы',
    incomplete: 'Толық емес',
    disabled_child: 'Мүгедектігі бар бала тәрбиелеп отырған отбасы',
    low_income: 'Аз қамтылған отбасы',
  };
  const statusText = data.socialStatus.map(s => socialStatusLabels[s] || s).join(', ') || '_______________';
  sections.push(createParagraph(`${itemNum}. Отбасының әлеуметтік мәртебесі: ${statusText}`));
  itemNum++;

  // III. ТҰРҒЫН ҮЙ ЖӘНЕ ҚАТЫНАУ
  sections.push(
    createParagraph('III. ТҰРҒЫН ҮЙ ЖӘНЕ ҚАТЫНАУ (КӨЛІК) ЖАҒДАЙЛАРЫ', true, AlignmentType.LEFT, { before: 200, after: 120 }),
  );

  const housingLabels: Record<string, string> = {
    private: 'Жеке үй',
    apartment: 'Көпқабатты үйдегі пәтер',
    dormitory: 'Жатақхана',
  };
  let housingText = housingLabels[data.housingType] || '_______________';
  if (data.housingType === 'apartment') {
    housingText += `, ${data.floor || '___'}-қабат, лифт: ${data.hasElevator ? 'бар' : 'жоқ'}`;
  }
  sections.push(createParagraph(`${itemNum}. Тұрғын үй түрі: ${housingText}`));
  itemNum++;

  const sanitaryLabels: Record<string, string> = {
    satisfactory: 'Қанағаттанарлық',
    needs_cleaning: 'Арнайы тазалауды немесе дезинфекцияны қажет етеді',
  };
  sections.push(createParagraph(`${itemNum}. Үйдің санитарлық-гигиеналық жағдайы: ${sanitaryLabels[data.sanitaryCondition] || '_______________'}`));
  itemNum++;

  sections.push(createParagraph(`${itemNum}. Жартылай стационарлық типтегі күндізгі болу орталығына қатынау мүмкіндігі:`));
  sections.push(createParagraph(`   Инватакси қажеттілігі: ${data.needsInvataxi === 'yes' ? 'бар' : data.needsInvataxi === 'no' ? 'жоқ' : '_______________'}`));
  const transportLabels: Record<string, string> = {
    possible: 'мүмкін',
    difficult: 'қиын',
    impossible: 'мүмкін емес',
  };
  sections.push(createParagraph(`   Қоғамдық немесе жеке транспортпен қатынау: ${transportLabels[data.publicTransport] || '_______________'}`));
  const visitLabels: Record<string, string> = {
    possible: 'бар',
    needs_accompaniment: 'сүйемелдеуді қажет етеді',
  };
  sections.push(createParagraph(`   Баланың орталыққа келу мүмкіндігі: ${visitLabels[data.independentVisit] || '_______________'}`));
  itemNum++;

  // IV. ДЕНСАУЛЫҚ ЖАҒДАЙЫ
  sections.push(
    createParagraph('IV. БАЛАНЫҢ ДЕНСАУЛЫҚ ЖАҒДАЙЫ ЖӘНЕ ЖАРТЫЛАЙ СТАЦИОНАРҒА КЕЛУ МҮМКІНДІГІ', true, AlignmentType.LEFT, { before: 200, after: 120 }),
  );

  sections.push(createParagraph(`${itemNum}. Негізгі диагнозы: ${data.mainDiagnosis || '_______________'}`));
  itemNum++;

  const mobilityLabels: Record<string, string> = {
    free: 'Еркін',
    assisted: 'Бөгде адамның немесе арнайы құралдың (арба, балдақ, ходунок) көмегімен',
    unable: 'Өз бетінше қозғала алмайды',
  };
  sections.push(createParagraph(`${itemNum}. Қозғалу және ортада бейімделу қабілеті:`));
  sections.push(createParagraph(`   Қозғалысы: ${mobilityLabels[data.mobility] || '_______________'}`));
  const selfCareLabels: Record<string, string> = {
    preserved: 'сақталған',
    partial: 'ішінара шектелген',
    unable: 'толықтай қабілетсіз',
  };
  sections.push(createParagraph(`   Өзіне-өзі қызмет көрсетуі: ${selfCareLabels[data.selfCare] || '_______________'}`));
  itemNum++;

  sections.push(createParagraph(`${itemNum}. ПМПК қорытындысы: № ${data.pmppkNumber || '___'}, ${data.pmppkDate ? formatDate(data.pmppkDate) : '_______________'}`));
  itemNum++;

  sections.push(createParagraph(`${itemNum}. АОЖБ: № ${data.ipraNumber || '___'}, қолданылу мерзімі: ${data.ipraPeriod || '_______________'}`));
  itemNum++;

  const contraindText = data.contraindications === 'none'
    ? 'жоқ'
    : data.contraindications === 'present'
      ? `бар (${data.contraindicationsText || '_______________'})`
      : '_______________';
  sections.push(createParagraph(`${itemNum}. Ұжымдық/топтық ортада болуға кері көрсетілімдері: ${contraindText}`));

  // V. ҚЫЗМЕТ ТҮРЛЕРІ
  sections.push(
    createParagraph('V. ЖАРТЫЛАЙ СТАЦИОНАР ЖАҒДАЙЫНДА КӨРСЕТІЛЕТІН АРНАУЛЫ ӘЛЕУМЕТТІК ҚЫЗМЕТ ТҮРЛЕРІ', true, AlignmentType.LEFT, { before: 200, after: 120 }),
  );

  if (data.services.length > 0) {
    data.services.forEach((service) => {
      const svc = SERVICE_LABELS[service];
      if (svc) {
        sections.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `• ${svc.title}`,
                bold: true,
                size: 24,
                font: 'Times New Roman',
              }),
              new TextRun({
                text: svc.description,
                bold: false,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          })
        );
      }
    });
  } else {
    sections.push(createParagraph('Қызмет түрлері таңдалмаған.'));
  }

  // ҚОРЫТЫНДЫ
  sections.push(
    new Paragraph({
      spacing: { before: 300, after: 120 },
      children: [createTextRun('ҚОРЫТЫНДЫ:', true, 24)],
    }),
  );

  const conclusionPhrase = data.conclusion === 'needed'
    ? 'арнаулы әлеуметтік қызметтер көрсетуге мұқтаж деп танылды'
    : data.conclusion === 'not_needed'
      ? 'арнаулы әлеуметтік қызметтер көрсетуге танылған жоқ'
      : '_______________';

  sections.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        createTextRun(
          `Зерттеу-тексеру нәтижесі бойынша бала ${data.childFullName || '_______________'} (Т.А.Ә.) денсаулық жағдайы, оңалту қажеттіліктері және әлеуметтік адаптация талаптарына сәйкес `,
          false,
          24
        ),
        createTextRun(
          `жартылай стационар жағдайындағы күндізгі болу орталығында ${conclusionPhrase}`,
          true,
          24
        ),
        createTextRun('.', false, 24),
      ],
    })
  );

  // ҰСЫНЫС
  sections.push(
    new Paragraph({
      spacing: { before: 200, after: 120 },
      children: [createTextRun('ҰСЫНЫС:', true, 24)],
    }),
  );

  sections.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [
        createTextRun(
          `Баланы ${data.childFullName || '_______________'} (Т.А.Ә.) жартылай стационарлық үлгідегі арнаулы әлеуметтік қызметтер көрсету орталығына (бөлімшесіне) күндізгі болу режиміне қабылдау ұсынылады.`,
          false,
          24
        ),
      ],
    })
  );

  const regimeLabels: Record<string, string> = {
    full_day: 'Толық күн (тамақтандырумен және ұйқымен)',
    half_day: 'Жартылай күн (сабақтар/реабилитация уақытына)',
  };

  if (data.regimeType) {
    sections.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          createTextRun('Режим түрі: ', true, 24),
          createTextRun(regimeLabels[data.regimeType] || '', false, 24),
        ],
      })
    );
  }

  // Подписи
  sections.push(
    new Paragraph({ spacing: { before: 400, after: 120 }, children: [] }),
  );

  // Specialist 1
  sections.push(createParagraph(`Лауазымы: ${data.specialist1Position || '_______________'}`));
  sections.push(createParagraph('Қолы: _______________'));
  sections.push(createParagraph(`Т.А.Ә.: ${data.specialist1Name || '_______________'}`));

  sections.push(new Paragraph({ spacing: { before: 200, after: 120 }, children: [] }));

  // Specialist 2
  sections.push(createParagraph(`Лауазымы: ${data.specialist2Position || '_______________'}`));
  sections.push(createParagraph('Қолы: _______________'));
  sections.push(createParagraph(`Т.А.Ә.: ${data.specialist2Name || '_______________'}`));

  sections.push(new Paragraph({ spacing: { before: 200, after: 120 }, children: [] }));

  // Parent signature
  sections.push(createParagraph('Актпен таныстым (Ата-анасы / Заңды өкілі):'));
  sections.push(createParagraph('Қолы: _______________'));
  sections.push(createParagraph(`Т.А.Ә.: ${data.parentNameSignature || '_______________'}`));
  sections.push(createParagraph(`Күні: ${data.signatureDate ? formatDate(data.signatureDate) : '_______________'}`));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 2cm
              right: 850, // 1.5cm
              bottom: 1134,
              left: 1701, // 3cm
            },
          },
        },
        children: sections,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Akt_polustacionar_${data.childFullName || 'bala'}_${data.aktDate || 'date'}.docx`;
  saveAs(blob, fileName);
}
