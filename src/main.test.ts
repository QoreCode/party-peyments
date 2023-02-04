
// TODO: заменить jest`ом
import Controller from './business/controller';

export default function test(): void {
  const controller = new Controller();

  const bodya = controller.addUser(`Бодя`);
  const lera = controller.addUser(`Лера`, bodya.uid);
  const dimas = controller.addUser(`Димас-трезвенник`);
  const volodya = controller.addUser(`Володька ❤`);
  const kruha = controller.addUser(`Круха`);
  const yula = controller.addUser(`Юля ㋛`, kruha.uid);

  const payment0 = controller.addPayment(`ХодДоги и Кофе`, kruha.uid, 256);
  controller.excludeFromPayment(payment0.uid, kruha.uid);
  controller.excludeFromPayment(payment0.uid, bodya.uid);
  controller.excludeFromPayment(payment0.uid, lera.uid);
  controller.excludeFromPayment(payment0.uid, volodya.uid);
  controller.excludeFromPayment(payment0.uid, yula.uid);

  const payment1 = controller.addPayment(`Клопотенко сб`, kruha.uid, 79);
  controller.addModification(payment1.uid, [dimas.uid], 155);
  controller.addModification(payment1.uid, [dimas.uid, volodya.uid], 95);
  controller.addModification(payment1.uid, [volodya.uid], 195);
  controller.addModification(payment1.uid, [volodya.uid, bodya.uid], 210);
  controller.addModification(payment1.uid, [kruha.uid, lera.uid], 290);
  controller.addModification(payment1.uid, [yula.uid], 205);
  controller.addModification(payment1.uid, [yula.uid], 85);
  controller.addModification(payment1.uid, [bodya.uid], 185);
  controller.addModification(payment1.uid, [kruha.uid, lera.uid], 150);

  const payment2 = controller.addPayment(`Алхимия сб`, volodya.uid, 140);
  controller.addModification(payment2.uid, [lera.uid, volodya.uid, kruha.uid], 300);
  controller.addModification(payment2.uid, [yula.uid], 50);
  controller.excludeFromPayment(payment2.uid, bodya.uid);

  const payment3 = controller.addPayment(`Суши сб`, bodya.uid, 792 + 20) // 20-вода;
  controller.excludeFromPayment(payment3.uid, volodya.uid);
  controller.excludeFromPayment(payment3.uid, bodya.uid);
  controller.excludeFromPayment(payment3.uid, kruha.uid);

  const payment4 = controller.addPayment(`Дируны сб`, bodya.uid, 703);
  controller.excludeFromPayment(payment4.uid, lera.uid);
  controller.excludeFromPayment(payment4.uid, yula.uid);

  controller.addPayment(`Сильпо сб`, volodya.uid, 1091);

  const payment6 = controller.addPayment(`Чайная вс`, bodya.uid, 290);
  controller.excludeFromPayment(payment6.uid, dimas.uid);

  const payment7 = controller.addPayment(`Подземелье завтрак`, bodya.uid, 50);
  controller.addModification(payment7.uid, [dimas.uid, lera.uid, volodya.uid], 405);
  controller.addModification(payment7.uid, [yula.uid], 190);
  controller.addModification(payment7.uid, [bodya.uid, kruha.uid], 460);

  const payment8 = controller.addPayment(`Split кушац`, bodya.uid, 50);
  controller.addModification(payment8.uid, [kruha.uid], 320);
  controller.addModification(payment8.uid, [yula.uid], 745);
  controller.addModification(payment8.uid, [lera.uid], 219);
  controller.addModification(payment8.uid, [bodya.uid], 219);
  controller.addModification(payment8.uid, [volodya.uid], 265);
  controller.addModification(payment8.uid, [dimas.uid], 237);

  const payment9 = controller.addPayment(`Split курить`, bodya.uid, 950);
  controller.excludeFromPayment(payment9.uid, dimas.uid);
  controller.excludeFromPayment(payment9.uid, lera.uid);

  const payment10 = controller.addPayment(`Шаверма вс`, dimas.uid, 420);
  controller.excludeFromPayment(payment10.uid, lera.uid);
  controller.excludeFromPayment(payment10.uid, bodya.uid);
  controller.excludeFromPayment(payment10.uid, yula.uid);

  const payment11 = controller.addPayment(`Сильпо вс`, dimas.uid, 373);
  controller.addModification(payment11.uid, [bodya.uid], 100);

  const payment12 = controller.addPayment(`Джек Дениалс`, kruha.uid, 659);
  controller.excludeFromPayment(payment12.uid, dimas.uid);
  controller.excludeFromPayment(payment12.uid, lera.uid);
  controller.excludeFromPayment(payment12.uid, yula.uid);

  const payment13 = controller.addPayment(`Подземелье пьянка`, volodya.uid, 220);
  controller.addModification(payment13.uid, [dimas.uid], 376);
  controller.addModification(payment13.uid, [volodya.uid], 309);
  controller.addModification(payment13.uid, [bodya.uid], 344);
  controller.addModification(payment13.uid, [lera.uid], 218);
  controller.addModification(payment13.uid, [kruha.uid], 304);
  controller.addModification(payment13.uid, [yula.uid], 105);
  controller.addModification(payment13.uid, [dimas.uid, volodya.uid, lera.uid, bodya.uid], 90);
  controller.addModification(payment13.uid, [kruha.uid, volodya.uid, lera.uid, bodya.uid], 388);
  controller.addModification(payment13.uid, [kruha.uid, volodya.uid, lera.uid, bodya.uid], 340);

  const payment14 = controller.addPayment(`Завтрак пн`, bodya.uid, 0);
  controller.addModification(payment14.uid, [yula.uid], 275);
  controller.addModification(payment14.uid, [volodya.uid], 275);
  controller.addModification(payment14.uid, [bodya.uid], 250);
  controller.addModification(payment14.uid, [lera.uid], 155);
  controller.addModification(payment14.uid, [dimas.uid], 350);
  controller.addModification(payment14.uid, [kruha.uid], 270);

  const payment15 = controller.addPayment(`Хотдоги пн`, dimas.uid, 0);
  controller.addModification(payment15.uid, [dimas.uid], 66);
  controller.addModification(payment15.uid, [kruha.uid], 52);
  controller.addModification(payment15.uid, [volodya.uid], 94);
  controller.excludeFromPayment(payment15.uid, bodya.uid);
  controller.excludeFromPayment(payment15.uid, lera.uid);
  controller.excludeFromPayment(payment15.uid, yula.uid);

  controller.addPayment(`Хата`, volodya.uid, 3600);
  controller.addPayment(`Стоянка`, bodya.uid, 1000);

  const payment16 = controller.addPayment(`Бодя во Львов`, bodya.uid, 1552);
  controller.excludeFromPayment(payment16.uid, dimas.uid);
  controller.excludeFromPayment(payment16.uid, volodya.uid);

  const payment17 = controller.addPayment(`Володя во Львов`, volodya.uid, 1405);
  controller.excludeFromPayment(payment17.uid, bodya.uid);
  controller.excludeFromPayment(payment17.uid, lera.uid);
  controller.excludeFromPayment(payment17.uid, kruha.uid);
  controller.excludeFromPayment(payment17.uid, yula.uid);

  const payment18 = controller.addPayment(`Володя со Львова`, volodya.uid, 1405);
  controller.excludeFromPayment(payment18.uid, bodya.uid);
  controller.excludeFromPayment(payment18.uid, lera.uid);

  const transactions = controller.createTransactions();
  const result = [];

  /* eslint-disable @typescript-eslint/naming-convention, max-len */
  for (const [fromUserName, fromUserPaymentsMap] of Array.from(transactions.entries())) {
    for (const [toUserName, toUserPaymentsSum] of Array.from(fromUserPaymentsMap.entries())) {
      result.push({
        "Кто": fromUserName,
        "Кому": toUserName,
        "Сколько": toUserPaymentsSum,
      });
    }
  }

  const expectedResult = [
    {
      "Кто": "Димас-трезвенник",
      "Кому": "Круха",
      "Сколько": 156
    },
    {
      "Кто": "Димас-трезвенник",
      "Кому": "Володька ❤",
      "Сколько": 2004
    },
    {
      "Кто": "Димас-трезвенник",
      "Кому": "Бодя",
      "Сколько": 1128
    },
    {
      "Кто": "Бодя",
      "Кому": "Володька ❤",
      "Сколько": 1408
    },
    {
      "Кто": "Круха",
      "Кому": "Володька ❤",
      "Сколько": 2556
    },
    {
      "Кто": "Круха",
      "Кому": "Бодя",
      "Сколько": 3455
    }
  ];

  /* eslint-enable @typescript-eslint/naming-convention, max-len */

  if (result.length !== expectedResult.length) {
    throw new Error(`Result has ${ result.length } values, ${ expectedResult.length } expected`);
  }

  for (let i = 0; i < result.length; i++) {
    const expectedResultItem = expectedResult[i] as any;
    const resultItem = result[i];

    Object.entries(resultItem).forEach(([propertyName, propertyValue]) => {
      if (expectedResultItem[propertyName] !== propertyValue) {
        throw new Error(
          `Property '${ propertyName }' has value: '${ propertyValue }', but '${ expectedResultItem[propertyName] }' expected`
        );
      }
    })
  }

  console.info('All tests passed');
}
