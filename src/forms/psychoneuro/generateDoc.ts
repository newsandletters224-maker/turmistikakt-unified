import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
} from 'docx';
import { saveAs } from 'file-saver';
import type { FormData } from './types';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const months = [
    'қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым',
    'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `"${day}" ${month} ${year} ж.`;
}

function formatCourtDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const months = [
    'қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым',
    'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'
  ];
  const month = months[d.getMonth()];
  return `"${day}" ${month} ${d.getFullYear()} ж.`;
}

function getServiceFormShort(form: string): string {
  switch (form) {
    case 'home': return 'Үйде';
    case 'semi': return 'жартылай стационарда';
    case 'stationary': return 'Стационарда';
    default: return '';
  }
}

const serviceTypeDescriptions: Record<string, string> = {
  'social-domestic': 'Әлеуметтік-тұрмыстық: Тамақ дайындауға/жегізуге, гигиеналық процедураларға, тазалық сақтауға, азық-түлік пен дәрі-дәрмек жеткізуге көмектесу.',
  'social-medical': 'Әлеуметтік-медициналық: Денсаулық жағдайын бақылау, емдеу процедураларын орындауға жәрдемдесу, ЕДШ, оңалту шаралары.',
  'social-psychological': 'Әлеуметтік-психологиялық: Психологиялық диагностика, кеңес беру, адаптациялық тренингтер.',
  'social-pedagogical': 'Әлеуметтік-педагогикалық / Түзету: Тұрмыстық дағдыларды қайта қалыптастыру, когнитивті функцияларды сүйемелдеу.',
  'social-labor': 'Әлеуметтік-еңбек: Еңбек терапиясы, мүмкіндігіне қарай қарапайым шеберлік пен еңбек дағдыларына баулу.',
  'social-cultural': 'Әлеуметтік-мәдени: Бос уақытты ұйымдастыру, мәдени шараларға қатыстыру.',
  'social-legal': 'Әлеуметтік-құқықтық: Тұрғын үй, жәрдемақы, АОЖБ бойынша ТКҚ (арба, памперс т.б.) алуға және құжаттарды рәсімдеуге көмектесу.',
};

export function generateDocument(data: FormData) {
  const children: (Paragraph | Table)[] = [];

  // Заголовок
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'ПСИХОНЕВРОЛОГИЯЛЫҚ АУЫТҚУЛАРЫ БАР 18 ЖАСТАН АСҚАН АДАМДАРҒА ЖӘНЕ І, ІІ ТОПТАҒЫ МҮГЕДЕКТІГІ БАР АДАМДАРҒА АРНАУЛЫ ӘЛЕУМЕТТІК ҚЫЗМЕТТЕР КӨРСЕТУ ҮШІН ТҰРҒЫН ҮЙ ЖӘНЕ МАТЕРИАЛДЫҚ-ТҰРМЫСТЫҚ ЖАҒДАЙЛАРДЫ ЗЕРТТЕУ-ТЕКСЕРУ',
          bold: true,
          font: 'Times New Roman',
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'АКТІСІ',
          bold: true,
          font: 'Times New Roman',
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `№ ${data.actNumber}`,
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: data.actDate ? formatDate(data.actDate) : '',
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  // Раздел I
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'I. ЖАЛПЫ МӘЛІМЕТТЕР',
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `1. Қызмет алушының Т.А.Ә. (бар болса): ${data.fio}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `2. Туған күні: ${data.birthDate ? formatDate(data.birthDate) : ''}; ЖСН (ИИН): ${data.iin}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `3. Мүгедектік тобы: ${data.disabilityGroup}; Қайта тексеру мерзімі: ${data.disabilityReview || 'көрсетілмеген'}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `4. Тұрғылықты мекенжайы: ${data.address}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `5. Байланыс телефоны: ${data.phone}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `6. Зейнетақы немесе мемлекеттік әлеуметтік жәрдемақы түрі мен мөлшері: ${data.pension} теңге`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  // Раздел II
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'II. ОТБАСЫ ЖАҒДАЙЫ ЖӘНЕ БІРГЕ ТҰРАТЫН АДАМДАР',
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `7. Отбасылық жағдайы: ${data.maritalStatus}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  // Пункт 8 - заңды өкілі
  if (data.hasLegalRep && data.legalRepFio) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: `8. Заңды өкілі / Қамқоршысы / Қорғаншысы: ${data.legalRepFio}; тел.: ${data.legalRepPhone}; Растайтын құжат: ${data.legalRepDoc}`,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
      }),
    );
  } else {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: '8. Заңды өкілі / Қамқоршысы / Қорғаншысы: жоқ',
            font: 'Times New Roman',
            size: 22,
          }),
        ],
      }),
    );
  }

  // Пункт 9 - әрекетке қабілеттілігі
  let capacityText = data.capacity;
  if (data.capacity === 'incapacitated' && data.courtDecisionNumber) {
    capacityText = `Әрекетке қабілетсіз деп танылған (Сот шешімі № ${data.courtDecisionNumber}, ${data.courtDecisionDate ? formatCourtDate(data.courtDecisionDate) : ''})`;
  } else if (data.capacity === 'capable') {
    capacityText = 'Әрекетке қабілетті';
  } else if (data.capacity === 'limited') {
    capacityText = 'Әрекет қабілеті шектелген';
  }

  children.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `9. Әрекетке қабілеттілігі: ${capacityText}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  // Пункт 10 - таблица членов семьи
  const filledMembers = data.familyMembers.filter(m => m.fio.trim() !== '');

  children.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: '10. Бірге тұратын отбасы мүшелері:',
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  if (filledMembers.length > 0) {
    const borderStyle = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: '000000',
    };
    const borders = {
      top: borderStyle,
      bottom: borderStyle,
      left: borderStyle,
      right: borderStyle,
    };

    const headerRow = new TableRow({
      children: [
        new TableCell({ borders, width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '№', bold: true, font: 'Times New Roman', size: 20 })] })] }),
        new TableCell({ borders, width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Т.А.Ә.', bold: true, font: 'Times New Roman', size: 20 })] })] }),
        new TableCell({ borders, width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Туыстық дәрежесі', bold: true, font: 'Times New Roman', size: 20 })] })] }),
        new TableCell({ borders, width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Туған жылы', bold: true, font: 'Times New Roman', size: 20 })] })] }),
        new TableCell({ borders, width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Жұмыс орны / Қызметі / Мәртебесі', bold: true, font: 'Times New Roman', size: 20 })] })] }),
      ],
    });

    const memberRows = filledMembers.map((member, idx) =>
      new TableRow({
        children: [
          new TableCell({ borders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${idx + 1}`, font: 'Times New Roman', size: 20 })] })] }),
          new TableCell({ borders, children: [new Paragraph({ children: [new TextRun({ text: member.fio, font: 'Times New Roman', size: 20 })] })] }),
          new TableCell({ borders, children: [new Paragraph({ children: [new TextRun({ text: member.relation, font: 'Times New Roman', size: 20 })] })] }),
          new TableCell({ borders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: member.birthYear, font: 'Times New Roman', size: 20 })] })] }),
          new TableCell({ borders, children: [new Paragraph({ children: [new TextRun({ text: member.occupation, font: 'Times New Roman', size: 20 })] })] }),
        ],
      })
    );

    children.push(
      new Table({
        rows: [headerRow, ...memberRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
      }),
    );
  } else {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: '(Бірге тұратын отбасы мүшелері туралы мәліметтер жоқ)',
            font: 'Times New Roman',
            size: 22,
            italics: true,
          }),
        ],
      }),
    );
  }

  // Раздел III
  let housingTypeText = data.housingType;
  if (data.housingType === 'apartment') {
    housingTypeText = `Көпқабатты үйдегі пәтер (этаж: ${data.floor || '—'}, лифт: ${data.hasElevator || '—'})`;
  } else if (data.housingType === 'house') {
    housingTypeText = 'Жеке үй';
  } else if (data.housingType === 'dormitory') {
    housingTypeText = 'Жатақхана';
  } else if (data.housingType === 'rental') {
    housingTypeText = 'Жалдамалы үй';
  }

  children.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'III. ТҰРҒЫН ҮЙ ЖӘНЕ МАТЕРИАЛДЫҚ-ТҰРМЫСТЫҚ ЖАҒДАЙЛАРЫ',
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `11. Тұрғын үйдің типі: ${housingTypeText}; Тиесілілігі: ${data.housingOwnership}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `12. Коммуналдық-тұрмыстық жағдайы: Жылыту — ${data.heating}; Сумен қамтылуы — ${data.waterSupply}; Санузел — ${data.sanitation}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `13. Санитарлық-гигиеналық жағдайы: ${data.sanitaryCondition}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `14. Кедергісіз орта және арнайы бейімделу: ${data.accessibility}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `15. Жеке ұйықтау орны және тұрмыстық жиһаздармен қамтамасыз етілуі: ${data.furnitureSufficiency}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  // Раздел IV
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'IV. ДЕНСАУЛЫҚ ЖАҒДАЙЫ ЖӘНЕ ДЕНЕ/ПСИХИКАЛЫҚ ҚАБІЛЕТТІЛІГІ',
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  if (data.psychoneuro) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: `16. Психоневрологиялық ауытқулар (созылмалы психикалық аурулар): ${data.psychoneuro}`,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
      }),
    );
  }
  if (data.musculoskeletal) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: `17. Тірек-қимыл аппаратының бұзылуы (ТҚА): ${data.musculoskeletal}`,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
      }),
    );
  }
  if (data.somatic) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: `18. Соматикалық және өзге де ауыр аурулар: ${data.somatic}`,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
      }),
    );
  }

  children.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `Қозғалу деңгейі: ${data.mobility}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `Өзіне-өзі қызмет көрсетуі: ${data.selfCare}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `АОЖБ: № ${data.ipraNumber}; Қолданылу мерзімі: ${data.ipraPeriod}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `Бөгде адамның күтіміне мұқтаждығы: ${data.careNeed}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  // Раздел V
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'V. СҰРАТЫЛАТЫН АРНАУЛЫ ӘЛЕУМЕТТІК ҚЫЗМЕТ ТҮРЛЕРІ ЖӘНЕ НЫСАНЫ',
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  let serviceFormText = '';
  if (data.serviceForm === 'home') serviceFormText = 'Үйде қызмет көрсету жағдайында';
  else if (data.serviceForm === 'semi') serviceFormText = 'Күндізгі болу жартылай стационар жағдайында';
  else if (data.serviceForm === 'stationary') serviceFormText = 'Стационар (интернат үйлері) жағдайында';

  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `Қызмет көрсету нысаны: ${serviceFormText}`,
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  if (data.serviceTypes.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: 'Қажетті қызмет түрлері:',
            font: 'Times New Roman',
            size: 22,
          }),
        ],
      }),
    );

    data.serviceTypes.forEach(type => {
      const desc = serviceTypeDescriptions[type] || type;
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          indent: { left: 360 },
          children: [
            new TextRun({
              text: `— ${desc}`,
              font: 'Times New Roman',
              size: 22,
            }),
          ],
        }),
      );
    });
  }

  // ҚОРЫТЫНДЫ
  const conclusionText = data.conclusion === 'needed'
    ? 'арнаулы әлеуметтік қызметтер алуға мұқтаж деп танылды'
    : 'арнаулы әлеуметтік қызметтер алуға мұқтаж деп танылған жоқ';

  children.push(
    new Paragraph({
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({
          text: 'ҚОРЫТЫНДЫ:',
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Тұрғын үй және материалдық-тұрмыстық жағдайларды зерттеу нәтижесі бойынша ${data.fio} (Т.А.Ә.) денсаулық жағдайына, өзіне-өзі қызмет көрсету қабілетінің шектелуіне және бөгде адамның күтіміне мұқтаждығына байланысты `,
          font: 'Times New Roman',
          size: 22,
        }),
        new TextRun({
          text: conclusionText,
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
        new TextRun({
          text: '.',
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  // ҰСЫНЫС
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'ҰСЫНЫС:',
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `Қызмет алушы ${data.fio} (Т.А.Ә.):`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      indent: { left: 360 },
      children: [
        new TextRun({
          text: `1. Қызмет көрсету нысаны: ${getServiceFormShort(data.serviceForm)}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      indent: { left: 360 },
      children: [
        new TextRun({
          text: '2. Арнаулы әлеуметтік қызметтер тізімдемесін бекіту және әлеуметтік жұмысшыны/мамандарды тағайындау ұсынылады.',
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  // Подписи
  children.push(
    new Paragraph({
      spacing: { before: 400, after: 100 },
      children: [
        new TextRun({
          text: 'Тексеру жүргізген мамандар:',
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `${data.specialist1Position} ____________ ${data.specialist1Fio}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${data.specialist2Position} ____________ ${data.specialist2Fio}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'Актпен таныстым (Қызмет алушы / Заңды өкілі / Қамқоршысы):',
          bold: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `Қолы: ____________ Т.А.Ә.: ${data.recipientFio || data.fio}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Күні: ${data.reviewDate ? formatDate(data.reviewDate) : '____________'}`,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
    }),
  );

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1134, bottom: 1134, left: 1701, right: 850 },
        },
      },
      children,
    }],
  });

  return doc;
}

export async function downloadDocument(data: FormData) {
  const doc = generateDocument(data);
  const blob = await Packer.toBlob(doc);
  const fileName = `Akt_psihonevrologia_${data.fio.replace(/\s+/g, '_')}_${data.actDate || 'nodate'}.docx`;
  saveAs(blob, fileName);
}
