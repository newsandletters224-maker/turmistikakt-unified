import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  convertInchesToTwip,
} from 'docx';
import { saveAs } from 'file-saver';

export interface FormData {
  // Header
  actNumber: string;
  actDate: string;

  // Section I
  childFullName: string;
  childBirthDate: string;
  childIIN: string;
  disabilityCategory: string;
  address: string;
  phone: string;
  benefits: string;

  // Section II
  motherFullName: string;
  motherWork: string;
  fatherFullName: string;
  fatherWork: string;
  guardian: string;
  familyMembers: string;
  familyStatus: string;
  familyStatusOther: string;

  // Section III
  housingType: string;
  floor: string;
  hasElevator: string;
  heating: string;
  waterSupply: string;
  sanitation: string;
  sanitaryCondition: string;
  childSleepPlace: string;
  accessibleEnvironment: string;
  childSafety: string;

  // Section IV
  diagnosis: string;
  mobility: string;
  selfCare: string;
  pmpkNumber: string;
  pmpkDate: string;
  ipraNumber: string;
  ipraPeriod: string;

  // Section V
  services: {
    socialDomestic: boolean;
    socialMedical: boolean;
    socialPedagogical: boolean;
    socialPsychological: boolean;
    parentTraining: boolean;
    socialLegal: boolean;
  };

  // Conclusion
  conclusionResult: string; // 'mukhaj' or 'tanylghan_zhoq'

  // Signatures
  specialistPosition: string;
  specialistFullName: string;
  parentFullName: string;
  signatureDate: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '«__»________ 202_ ж.';
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = [
    'қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым',
    'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `«${day}» ${month} ${year} ж.`;
}

function getFileName(childName: string, actNumber: string): string {
  const translit = childName
    ? childName.replace(/\s+/g, '_').substring(0, 30)
    : 'deti';
  const num = actNumber || 'no_number';
  return `Akt_deti_${translit}_${num}.docx`;
}

export async function generateDocument(data: FormData): Promise<void> {
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'Мүгедектігі бар балаларға үйде арнаулы әлеуметтік қызметтер көрсету үшін тұрғын үй және материалдық-тұрмыстық жағдайларды зерттеу-тексеру',
          bold: true,
          size: 24,
          font: 'Times New Roman',
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'АКТІСІ',
          bold: true,
          size: 28,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Act number and date
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `№ ${data.actNumber || '___'}`,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: formatDate(data.actDate),
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Section I
  children.push(
    new Paragraph({
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: 'I. ЖАЛПЫ МӘЛІМЕТТЕР',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  const section1Fields = [
    { num: 1, label: 'Баланың Т.А.Ә. (бар болса)', value: data.childFullName },
    { num: 2, label: 'Туған күні', value: formatDate(data.childBirthDate) },
    { num: 3, label: 'ЖСН (ИИН)', value: data.childIIN },
    { num: 4, label: 'Мүгедектік санаты мен мерзімі (бар болса)', value: data.disabilityCategory },
    { num: 5, label: 'Тұрғылықты мекенжайы', value: data.address },
    { num: 6, label: 'Байланыс телефоны', value: data.phone },
    { num: 7, label: 'Мемлекеттік жәрдемақы/төлемдер түрі мен мөлшері', value: data.benefits },
  ];

  section1Fields.forEach((f) => {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: `${f.num}. `, size: 22, font: 'Times New Roman' }),
          new TextRun({ text: `${f.label}: `, bold: true, size: 22, font: 'Times New Roman' }),
          new TextRun({ text: f.value || '___________', size: 22, font: 'Times New Roman' }),
        ],
      })
    );
  });

  // Section II
  children.push(
    new Paragraph({
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: 'II. АТА-АНАЛАРЫ (ЗАҢДЫ ӨКІЛДЕРІ) ЖӘНЕ ОТБАСЫ ҚҰРАМЫ',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '8. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'Заңды өкілдері туралы мәлімет:', bold: true, size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 50 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [
        new TextRun({ text: `Анасының Т.А.Ә.: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.motherFullName || '___________', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: `, жұмыс орны/әрекеті: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.motherWork || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [
        new TextRun({ text: `Әкесінің Т.А.Ә.: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.fatherFullName || '___________', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: `, жұмыс орны/әрекеті: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.fatherWork || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  if (data.guardian) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        indent: { left: convertInchesToTwip(0.3) },
        children: [
          new TextRun({ text: `Қамқоршысы/Қорғаншысы: `, size: 22, font: 'Times New Roman' }),
          new TextRun({ text: data.guardian, size: 22, font: 'Times New Roman' }),
        ],
      })
    );
  }

  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '9. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'Бірге тұратын отбасы мүшелері: ', bold: true, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.familyMembers || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  const familyStatusText = data.familyStatus === 'Басқа' ? data.familyStatusOther : data.familyStatus;
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '10. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'Отбасының әлеуметтік мәртебесі: ', bold: true, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: familyStatusText || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  // Section III
  children.push(
    new Paragraph({
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: 'III. ТҰРҒЫН ҮЙ-ТҰРМЫСТЫҚ ЖӘНЕ ТАЗАЛЫҚ ЖАҒДАЙЛАРЫ',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  let housingText = data.housingType || '___________';
  if (data.housingType === 'Көпқабатты үйдегі пәтер') {
    housingText += ` (этаж: ${data.floor || '___'}, лифт: ${data.hasElevator || '___'})`;
  }

  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '11. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'Тұрғын үй түрі: ', bold: true, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: housingText, size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '12. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'Коммуналдық және инфрақұрылымдық жағдайы:', bold: true, size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 50 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [
        new TextRun({ text: `Жылыту: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.heating || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 50 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [
        new TextRun({ text: `Сумен қамтылуы: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.waterSupply || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [
        new TextRun({ text: `Санузел (әжетхана, душ): `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.sanitation || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '13. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'Үйдің санитарлық-гигиеналық жағдайы: ', bold: true, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.sanitaryCondition || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '14. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'Балаға жасалған арнайы жағдайлар мен бейімделу:', bold: true, size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 50 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [
        new TextRun({ text: `Баланың жеке ұйықтау және сабақ/ойын орны: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.childSleepPlace || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 50 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [
        new TextRun({ text: `Үйдегі кедергісіз орта: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.accessibleEnvironment || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [
        new TextRun({ text: `Баланың қауіпсіздігі: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.childSafety || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  // Section IV
  children.push(
    new Paragraph({
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: 'IV. БАЛАНЫҢ ДЕНСАУЛЫҚ ЖАҒДАЙЫ ЖӘНЕ ДАМУ ЕРЕКШЕЛІКТЕРІ',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '15. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'Негізгі диагнозы: ', bold: true, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.diagnosis || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '16. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'Қозғалу және өзіне-өзі қызмет көрсету қабілеті:', bold: true, size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 50 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [
        new TextRun({ text: `Қозғалысы: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.mobility || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [
        new TextRun({ text: `Өзіне-өзі қызмет көрсетуі: `, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: data.selfCare || '___________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  const pmpkText = data.pmpkNumber || data.pmpkDate
    ? `№ ${data.pmpkNumber || '___'}, ${formatDate(data.pmpkDate)}`
    : '___________';
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '17. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'ПМПК қорытындысы: ', bold: true, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: pmpkText, size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  const ipraText = data.ipraNumber || data.ipraPeriod
    ? `№ ${data.ipraNumber || '___'}, қолданылу мерзімі: ${data.ipraPeriod || '___'}`
    : '___________';
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '18. ', size: 22, font: 'Times New Roman' }),
        new TextRun({ text: 'АОЖБ (Абилитациялау мен оңалтудың жеке бағдарламасы): ', bold: true, size: 22, font: 'Times New Roman' }),
        new TextRun({ text: ipraText, size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  // Section V
  children.push(
    new Paragraph({
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: 'V. ҮЙДЕ КӨРСЕТІЛУІ ҚАЖЕТ АРНАУЛЫ ӘЛЕУМЕТТІК ҚЫЗМЕТ ТҮРЛЕРІ',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  const serviceDescriptions = [
    { key: 'socialDomestic', title: 'Әлеуметтік-тұрмыстық қызметтер', desc: 'баланың гигиенасына, тамақтануына, киінуіне көмектесу, гигиеналық дағдыларға үйрету.' },
    { key: 'socialMedical', title: 'Әлеуметтік-медициналық қызметтер', desc: 'патронаждық бақылау, емдік дене шынықтыру (ЕДШ) жаттығуларын орындауға көмектесу, дәрігер тағайындаған процедураларды орындау.' },
    { key: 'socialPedagogical', title: 'Әлеуметтік-педагогикалық қызметтер', desc: 'педагогикалық түзету, әлеуметтік-тұрмыстық және қарым-қатынас дағдыларына үйрету, арнайы білім беру бағдарламалары бойынша оқытуға жәрдемдесу.' },
    { key: 'socialPsychological', title: 'Әлеуметтік-психологиялық қызметтер', desc: 'психологиялық диагностика, баламен және ата-анасымен психологиялық түзету/консультация жүргізу.' },
    { key: 'parentTraining', title: 'Ата-аналарды үйрету қызметтері', desc: 'ата-аналарды немесе отбасы мүшелерін үйде оңалту негіздеріне және баланың өмірлік дағдыларын қалыптастыруға үйрету.' },
    { key: 'socialLegal', title: 'Әлеуметтік-құқықтық қызметтер', desc: 'тиісті жәрдемақыларды, ТКҚ (компенсаторлық құралдарды), протездік-ортопедиялық көмекті немесе санаторлық-курорттық емдеуді алуға жәрдемдесу.' },
  ];

  serviceDescriptions.forEach((s) => {
    if (data.services[s.key as keyof typeof data.services]) {
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          bullet: { level: 0 },
          children: [
            new TextRun({ text: `${s.title}: `, bold: true, size: 22, font: 'Times New Roman' }),
            new TextRun({ text: s.desc, size: 22, font: 'Times New Roman' }),
          ],
        })
      );
    }
  });

  // Conclusion
  children.push(
    new Paragraph({
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: 'ҚОРЫТЫНДЫ',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  const conclusionPhrase = data.conclusionResult === 'tanylghan_zhoq'
    ? 'үйде арнаулы әлеуметтік қызметтер көрсетуге танылған жоқ'
    : 'үйде арнаулы әлеуметтік қызметтер көрсетуге мұқтаж деп танылды';

  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Тұрғын үй және материалдық-тұрмыстық жағдайларды зерттеу нәтижесі бойынша, бала ${data.childFullName || '___________'} (Т.А.Ә.) денсаулық жағдайына, өзіне-өзі қызмет көрсету мен қозғалу қабілетінің шектелуіне байланысты `,
          size: 22,
          font: 'Times New Roman',
        }),
        new TextRun({
          text: conclusionPhrase,
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
        new TextRun({
          text: '.',
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Recommendation
  children.push(
    new Paragraph({
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: 'ҰСЫНЫС',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `Баланы ${data.childFullName || '___________'} (Т.А.Ә.) үйде арнаулы әлеуметтік қызметтер көрсету бөлімшесіне (мүгедектігі бар балаларға үйде қызмет көрсету жағдайында) есепке алу және тиісті мамандарды (күтім жөніндегі әлеуметтік жұмыскер, консультант) бекіту ұсынылады.`,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Signatures
  children.push(
    new Paragraph({
      spacing: { before: 400, after: 100 },
      children: [
        new TextRun({
          text: 'Актіні жасаған уәкілетті органның маманы:',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: `Лауазымы: ${data.specialistPosition || '___________'}`, size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'Қолы: ________________________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({ text: `Т.А.Ә.: ${data.specialistFullName || '___________'}`, size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'Актпен таныстым (Ата-анасы / Заңды өкілі):',
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'Қолы: ________________________', size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: `Т.А.Ә.: ${data.parentFullName || '___________'}`, size: 22, font: 'Times New Roman' }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: `Күні: ${formatDate(data.signatureDate)}`, size: 22, font: 'Times New Roman' }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, getFileName(data.childFullName, data.actNumber));
}
