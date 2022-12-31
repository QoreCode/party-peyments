import Controller from './app/controller';

const controller = new Controller();

const kiril = controller.addUser(`Киря`);
const nastya = controller.addUser(`Настя`);
const bodya = controller.addUser(`Бодя`);
const lera = controller.addUser(`Лера`);
const dimas = controller.addUser(`Димас-трезвенник`);
const dimas2 = controller.addUser(`Димас-язвенник`);
const pasha = controller.addUser(`Паша`);
const nastyaEng = controller.addUser(`Настя с англии`);
const tosik = controller.addUser(`Тосик`);
const volodya = controller.addUser(`Володька ❤`);
const yarik = controller.addUser(`Ярик`);
const artyom = controller.addUser(`Артём`);

const payment1 = controller.addPayment(`Жрачка`, yarik.uid, 1465);

const payment2 = controller.addPayment(`Алкашка`, yarik.uid, 814);
controller.excludeFromPayment(payment2.uid, lera.uid);
controller.excludeFromPayment(payment2.uid, dimas.uid);

const payment3 = controller.addPayment(`Калик`, dimas.uid, 1200);
controller.excludeFromPayment(payment3.uid, dimas.uid);
controller.excludeFromPayment(payment3.uid, lera.uid);
controller.excludeFromPayment(payment3.uid, yarik.uid);
controller.excludeFromPayment(payment3.uid, volodya.uid);
controller.excludeFromPayment(payment3.uid, nastyaEng.uid);
controller.excludeFromPayment(payment3.uid, artyom.uid);

const payment4 = controller.addPayment(`Такси`, dimas.uid, 350);
controller.excludeFromPayment(payment4.uid, bodya.uid);
controller.excludeFromPayment(payment4.uid, lera.uid);
controller.excludeFromPayment(payment4.uid, dimas2.uid);
controller.excludeFromPayment(payment4.uid, pasha.uid);
controller.excludeFromPayment(payment4.uid, tosik.uid);
controller.excludeFromPayment(payment4.uid, yarik.uid);
controller.excludeFromPayment(payment4.uid, artyom.uid);

const payment5 = controller.addPayment(`Шашлындос`, pasha.uid, 1200);
controller.excludeFromPayment(payment5.uid, dimas.uid);

const transactions2 = controller.createTransactions();

console.table(transactions2.map((transaction) => transaction.getTableResult()));
