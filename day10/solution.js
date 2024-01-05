const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");

function load(file) {
    return (input = fs
        .readFileSync(path.join(__dirname, file), "utf8")
        .toString()
        .split("\r\n"));
}

function solve(p) {
    let registerValue = 1;
    let cycle = 0;
    const specialCycles = new Map([
        [20, 0],
        [60, 0],
        [100, 0],
        [140, 0],
        [180, 0],
        [220, 0],
    ]);

    let index = 20;
    for (const row of p) {
        if (row.startsWith("addx")) {
            count = Number(row.split(" ")[1]);
            if (cycle + 2 >= index) {
                specialCycles.set(index, registerValue);
                index += 40;
            }
            cycle += 2;
            registerValue += count;
        } else {
            if (cycle + 1 >= index) {
                specialCycles.set(index, registerValue);
            }
            cycle += 1;
        }
        if (index > 220) {
            break;
        }
    }
    console.log(specialCycles);
    let total = 0;
    specialCycles.forEach((value, key) => {
        total += value * key;
    });
    return total;
}

function main() {
    const startTime = performance.now();
    const puzzle = load("./input.txt");
    const solPart1 = solve(puzzle);

    console.log("Solution Part 1:", solPart1);

    const executionTime = ((performance.now() - startTime) / 1000).toFixed(5);
    console.log(`Solved in ${executionTime} Sec.`);
}

main();
