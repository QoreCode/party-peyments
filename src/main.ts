import Controller from './business/controller';
import test from './main.test';

const controller = new Controller();

// TODO: Remove when user interface is created
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.controller = controller;

const kiril = controller.addUser(`Киря`);
const nastya = controller.addUser(`Настя`, kiril.uid);
const bodya = controller.addUser(`Бодя`);
const lera = controller.addUser(`Лера`, bodya.uid);
const volodya = controller.addUser(`Володька ❤`);
const dimas = controller.addUser(`Димас-трезвенник`);
const andrey = controller.addUser(`Андрей`);

const payment1 = controller.addPayment(`Пиво`, bodya.uid, 420);
controller.excludeFromPayment(payment1.uid, dimas.uid);
controller.excludeFromPayment(payment1.uid, kiril.uid);
controller.excludeFromPayment(payment1.uid, nastya.uid);
controller.excludeFromPayment(payment1.uid, andrey.uid);

const payment2 = controller.addPayment(`Суши`, bodya.uid, 838);
controller.excludeFromPayment(payment2.uid, andrey.uid);

controller.addPayment(`Пицца`, andrey.uid, 500);

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

console.table(result);

test();
// const transactions = controller.createTransactions();
// const result = [];

/* eslint-disable @typescript-eslint/naming-convention */
// for (const [fromUserName, fromUserPaymentsMap] of Array.from(transactions.entries())) {
//   for (const [toUserName, toUserPaymentsSum] of Array.from(fromUserPaymentsMap.entries())) {
//     result.push({
//       "Кто": fromUserName,
//       "Кому": toUserName,
//       "Сколько": toUserPaymentsSum,
//     });
//   }
// }
/* eslint-enable @typescript-eslint/naming-convention */

// console.table(result);


