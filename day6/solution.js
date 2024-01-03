const fs = require('fs');
const path = require("path");
const { performance } = require('perf_hooks');


function load(file) {
	return input = fs
		.readFileSync(path.join(__dirname, file), 'utf8')
		.toString()
		.split("\r\n")
}


function solve(p) {
    const round = p.map(row => {
        const arr = Array.from(row)
        let four = arr.slice(0, 14)
        if (new Set(four).size === 14) {
            return 14
        }
        for (let i = 14; i < row.length; ++i) {
            four.shift()
            four.push(row[i])
            if (new Set(four).size === 14) {
                return i + 1
            }
        }
    })
    return round
}



function main() {
	const startTime = performance.now()
	const solPart1 = solve(load("./input.txt"))

	console.log("Solution Part 1:", solPart1)
	console.log("Solved in " + ((performance.now() - startTime) / 1000).toFixed(5) + " Sec.")
}


main()