const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Point(this.x + other.x, this.y + other.y);
    }

    toString() {
        return `${this.x},${this.y}`;
    }
}

function load(file) {
    return (input = fs
        .readFileSync(path.join(__dirname, file), "utf8")
        .toString()
        .split("\r\n"));
}

function is_visible(grid, width, height, pos, dir) {
    let nextPos = pos.add(dir);
    while (
        nextPos.x >= 0 &&
        nextPos.x < width &&
        nextPos.y >= 0 &&
        nextPos.y < height
    ) {
        if (grid[nextPos] >= grid[pos]) {
            return false;
        }
        nextPos = nextPos.add(dir);
    }
    return true;
}

function solve(p) {
    const width = p[0].length;
    const height = p.length;

    const directions = [
        new Point(1, 0),
        new Point(-1, 0),
        new Point(0, 1),
        new Point(0, -1),
    ];

    let grid = {};
    for (let y = 0; y < p.length; ++y) {
        for (let x = 0; x < p[0].length; ++x) {
            grid[new Point(x, y)] = Number(p[y][x]);
        }
    }

    let total = 2 * p[0].length + 2 * (p.length - 2);

    for (let y = 1; y < p.length - 1; ++y) {
        for (let x = 1; x < p[0].length - 1; ++x) {
            dir_visible = {};
            for (dir of directions) {
                dir_visible[dir] = is_visible(
                    grid,
                    width,
                    height,
                    new Point(x, y),
                    dir
                );
            }
            if (Object.values(dir_visible).some((value) => value)) {
                total += 1;
            }
        }
    }

    return total;
}

function main() {
    const startTime = performance.now();
    const puzzle = load("./input.txt");
    const solPart1 = solve(puzzle);

    console.log("Solution Part 1:", solPart1);
    console.log(
        "Solved in " +
            ((performance.now() - startTime) / 1000).toFixed(5) +
            " Sec."
    );
}

main();
