import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';
import { FormData } from '../types';

// Splits multi-line text (from a textarea) into TextRuns with real line breaks in the .docx
function multilineRuns(text: string, size = 24): TextRun[] {
  const lines = (text || '').split('\n');
  const runs: TextRun[] = [];
  lines.forEach((line, idx) => {
    if (idx > 0) {
      runs.push(new TextRun({ text: '', break: 1, size, font: 'Times New Roman' }));
    }
    runs.push(new TextRun({ text: line, size, font: 'Times New Roman' }));
  });
  return runs;
}

const kazakhMonths = [
  'қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым',
  'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'
];

function getHousingDescription(data: FormData): string {
  if (data.housingType === 'jeke_uy') {
    return 'Жеке тұрғын үй';
  } else {
    const elevator = data.hasElevator ? 'лифт бар' : 'лифт жоқ';
    return `Көпқабатты үйдегі пәтер (${data.floor || '_'}-қабат, ${elevator})`;
  }
}

function getHeatingDescription(type: string): string {
  switch (type) {
    case 'ortalyk': return 'орталық';
    case 'gaz': return 'газ';
    case 'pesh': return 'пеш';
    default: return 'орталық';
  }
}

function getWaterDescription(type: string): string {
  return type === 'uy_ishinde' ? 'үй ішінде' : 'сыртта';
}

function getToiletDescription(type: string): string {
  return type === 'uy_ishinde' ? 'үй ішінде' : 'сыртта';
}

function getCleanlinessDescription(type: string): string {
  return type === 'kanagattanarlyk' ? 'Қанағаттанарлық' : 'Тазалауды қажет етеді';
}

function getMobilityDescription(type: string): string {
  switch (type) {
    case 'erkin': return 'Еркін қозғалады';
    case 'tayakpen': return 'Таяқпен (ходунокпен) қозғалады';
    case 'tosek': return 'Төсек тартып жатыр';
    default: return '';
  }
}

function getSelfCareDescription(type: string): string {
  return type === 'shekteuli' ? 'шектеулі' : 'қабілетсіз';
}

function getLimitationWord(type: string): string {
  return type === 'tolyktai' ? 'толықтай' : 'ішінара';
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '"____" ______ 202_ ж.';
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = kazakhMonths[date.getMonth()];
  const year = date.getFullYear();
  return `"${day}" ${month} ${year} ж.`;
}

function getServicesList(data: FormData): string[] {
  const services: string[] = [];
  if (data.services.food) {
    services.push('Азық-түлік, бірінші қажеттіліктегі тауарлар мен дәрі-дәрмектерді сатып алу және үйге жеткізу');
  }
  if (data.services.payments) {
    services.push('Коммуналдық және басқа да төлемдерді төлеуге көмектесу');
  }
  if (data.services.cleaning) {
    services.push('Тұрғын үйді тазалауға көмектесу (жеңіл тазалау, қоқыс шығару)');
  }
  if (data.services.medical) {
    services.push('Медициналық мекемелерге жазылуға, дәрігерді үйге шақыруға жәрдемдесу');
  }
  if (data.services.fuel) {
    services.push('Отын, көмір, су тасуға көмектесу (Үй пешпен жылытылса/су сыртта болса)');
  }
  return services;
}

export function generateDocument(data: FormData): void {
  const limitationWord = getLimitationWord(data.limitationType);
  const services = getServicesList(data);

  const doc = new Document({
    sections: [{
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
      children: [
        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: `Тұрғын үй және материалдық-тұрмыстық жағдайларды зерттеу АКТІСІ № ${data.actNumber || '___'}`,
              bold: true,
              size: 28, // 14pt
              font: 'Times New Roman',
            }),
          ],
        }),

        // Date
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: formatDate(data.actDate),
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        // Section 1 - Client data
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: '1. Азаматтың (шаның) Т.А.Ә.: ',
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: data.fullName || '________________________',
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: '2. Туған күні: ',
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: data.birthDate ? formatDate(data.birthDate) : '________________________',
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: '3. Мекенжайы: ',
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: data.address || '________________________',
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: '4. Телефон нөмірі: ',
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: data.phone || '________________________',
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: '5. Жәрдемақы/зейнетақы мөлшері: ',
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: data.pensionAmount ? `${data.pensionAmount} теңге` : '________________________',
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: '6. Отбасылық жағдайы (жалғыз басты / отбасымен), балалары немесе бауырлары, туысқандары туралы мәліметтер: ',
              size: 24,
              font: 'Times New Roman',
            }),
            ...(data.maritalStatus
              ? multilineRuns(data.maritalStatus)
              : [new TextRun({ text: '________________________', size: 24, font: 'Times New Roman' })]),
          ],
        }),

        // Section 7
        new Paragraph({
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({
              text: '7. Тұрғын үй-тұрмыстық жағдайы:',
              bold: true,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `• Тұрғын үй түрі: ${getHousingDescription(data)}`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `• Жылыту: ${getHeatingDescription(data.heatingType)}`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `• Су: ${getWaterDescription(data.waterType)}`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `• Әжетхана: ${getToiletDescription(data.toiletType)}`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `• Үйдің тазалығы мен санитарлық жағдайы: ${getCleanlinessDescription(data.cleanliness)}`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: `• Аулалық учаскенің болуы: ${data.hasYardPlot === 'bar' ? `Бар${data.yardPlotHectares ? ` (${data.yardPlotHectares} га)` : ''}` : 'Жоқ'}`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        // Section 8
        new Paragraph({
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({
              text: '8. Денсаулық жағдайы мен өзіне-өзі қызмет көрсету қабілеті:',
              bold: true,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `• Денсаулық жағдайы (шағымдары): ${data.healthComplaints || '________________________'}`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `• Қозғалу қабілеті: ${getMobilityDescription(data.mobility)}`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: `• Өзіне-өзі қызмет көрсетуі: ${data.selfCareDescription || '________________________'} (${getSelfCareDescription(data.selfCareAbility)})`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        // Section 9
        new Paragraph({
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({
              text: '9. Қажетті әлеуметтік қызмет түрлері:',
              bold: true,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        // Numbered list of services
        ...services.map((service, index) =>
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `${index + 1}. ${service}`,
                size: 24,
                font: 'Times New Roman',
                italics: service.includes('пешпен') || service.includes('сыртта'),
              }),
            ],
          })
        ),

        // Conclusion
        new Paragraph({
          spacing: { before: 400, after: 200 },
          children: [
            new TextRun({
              text: 'ҚОРЫТЫНДЫ: ',
              bold: true,
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: `Азамат(ша) ${data.fullName || '________________________'} материалдық-тұрмыстық жағдайын тексеру нәтижесі бойынша, оның жасы мен денсаулық жағдайына байланысты өзіне-өзі қызмет көрсету қабілетінің `,
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: limitationWord,
              bold: true,
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: ' шектелуіне, сондай-ақ жалғызбастылығына байланысты ',
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: 'үйде әлеуметтік қызмет көрсетуге мұқтаж',
              bold: true,
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: ' деп танылды.',
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        // Recommendation
        new Paragraph({
          spacing: { before: 200, after: 400 },
          children: [
            new TextRun({
              text: 'ҰСЫНЫС: ',
              bold: true,
              size: 24,
              font: 'Times New Roman',
            }),
            new TextRun({
              text: `Азамат(ша) ${data.fullName || '________________________'} арнаулы әлеуметтік қызметтер көрсететін үйде қызмет көрсету бөлімшесіне (жасқа байланысты үйде қызмет көрсету жағдайында) есепке алу және әлеуметтік қызметкерді бекіту ұсынылады.`,
              size: 24,
              font: 'Times New Roman',
            }),
          ],
        }),

        // Signature block as table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: 'Актіні жасаған тұлға (лауазымы):',
                          size: 24,
                          font: 'Times New Roman',
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { before: 100 },
                      children: [
                        new TextRun({
                          text: data.workerPosition || '________________________',
                          size: 24,
                          font: 'Times New Roman',
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: [
                        new TextRun({
                          text: '(қолы) ___________________',
                          size: 24,
                          font: 'Times New Roman',
                        }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 200 },
                      children: [
                        new TextRun({
                          text: `(Т.А.Ә.): ${data.workerFullName || '________________________'}`,
                          size: 24,
                          font: 'Times New Roman',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }],
  });

  Packer.toBlob(doc).then((blob) => {
    const fileName = `Akt_${data.actNumber || 'document'}_${data.fullName || 'client'}.docx`;
    saveAs(blob, fileName);
  });
}
