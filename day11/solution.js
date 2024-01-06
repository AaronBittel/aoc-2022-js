const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");

function load(file) {
    return (input = fs
        .readFileSync(path.join(__dirname, file), "utf8")
        .toString()
        .split("\r\n\r\n")).map((line) => line.split("\r\n"));
}

class Monkey {
    constructor(itemList, operation, test, monkeyTestTrue, monkeyTestFalse) {
        this.itemList = itemList;
        this.operation = operation;
        this.test = test;
        this.monkeyTestTrue = monkeyTestTrue;
        this.monkeyTestFalse = monkeyTestFalse;
        this.activity = 0;
    }

    operate(item) {
        if (this.operation === "* old") {
            return item ** 2;
        }
        return eval(`${item} ${this.operation}`);
    }

    testing(item) {
        return eval(`${item} % ${this.test} === 0`);
    }

    action() {
        for (let item of this.itemList) {
            this.activity++;
            item = Math.floor(this.operate(item) / 3);
            if (this.testing(item)) {
                this.monkeyTestTrue.itemList.push(item);
            } else {
                this.monkeyTestFalse.itemList.push(item);
            }
        }
        this.itemList = new Array();
    }
}

function solve(p) {
    monkeyList = new Array();
    for (mon of p) {
        startingItems = mon[1].split(": ")[1].split(", ").map(Number);
        operation = mon[2].split("old ")[1];
        test = Number(mon[3].split("by ")[1]);
        monkeyList.push(new Monkey(startingItems, operation, test));
    }

    let index = 0;
    for (mon of p) {
        monkeyTestTrueIndex = Number(mon[4][mon[4].length - 1]);
        monkeyTestFalseIndex = Number(mon[5][mon[5].length - 1]);
        monkeyList[index].monkeyTestTrue = monkeyList[monkeyTestTrueIndex];
        monkeyList[index].monkeyTestFalse = monkeyList[monkeyTestFalseIndex];
        index++;
    }

    for (let i = 0; i < 20; ++i) {
        for (const monkey of monkeyList) {
            monkey.action();
        }
    }

    return monkeyList
        .map((monkey) => {
            return monkey.activity;
        })
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce((sum, val) => val * sum, 1);
}

function main() {
    const startTime = performance.now();
    const puzzle = load("./input.txt");
    const solution = solve(puzzle);

    console.log("Solution Part 1:", solution);

    const executionTime = ((performance.now() - startTime) / 1000).toFixed(5);
    console.log(`Solved in ${executionTime} Sec.`);
}

main();
