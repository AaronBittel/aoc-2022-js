
const { dir } = require('console');
const fs = require('fs');
const path = require("path");
const { performance } = require('perf_hooks');


class Node {
	constructor(prev, next, name, value) {
		this.prev = prev;
		this.next = next;
		this.name = name;
		this.value = value;
	}
}


function load(file) {
	return input = fs
		.readFileSync(path.join(__dirname, file), 'utf8')
		.toString()
		.split("\r\n")
}


function parse(p) {
	let head = new Node(null, new Map(null), "/", null)
	let currentNode = head
	for (let i = 1; i < p.length; ++i) {
		const cmd = p[i].split(" ")
		if (cmd.length === 3) {
			// cd command
			if (cmd[2] === "..") {
				currentNode = currentNode.prev
			} else {
				currentNode = currentNode.next.get(cmd[2])
			}
		} else if (cmd[0] === "$") {
			// ls command
		} else {
			if (cmd[0] === "dir") {
				// dir
				newDir = new Node(currentNode, new Map(null), cmd[1], null)
				currentNode.next.set(newDir.name, newDir)
			} else {
				// file
				newFile = new Node(currentNode, null, cmd[1], Number(cmd[0]))
				currentNode.next.set(newFile.name, newFile)
			}
		}
	}
	return head
}


function calc_dirSizes(head) {
	dirSizes = new Map([["/", 0]])
	queue = new Array(head)
	while (queue.length > 0) {
		currDir = queue.pop()
		for ([nodeName, node] of currDir.next) {
			tmpDir = currDir
			if (node.next === null) {
				fileSize = dirSizes.get(tmpDir.name)
				do {
					dirSizes.set(tmpDir.name, dirSizes.get(tmpDir.name) + node.value)
					tmpDir = tmpDir.prev
				} while (tmpDir !== null)
			} else {
				queue.push(node)
				if (dirSizes.get(nodeName) === undefined) {
					dirSizes.set(nodeName, 0)
				}
			}
		}
	}
	return dirSizes
}


function print_dir_tree(head) {
	let queue = [[head, 0]]
	while (queue.length > 0) {
		[node, indent] = queue.pop()
		if (node.value === null) {
			console.log("\t".repeat(indent), node.name)
		} else {
			console.log("\t".repeat(indent), node.name, node.value)
		}
		if (node.next === null) {
			continue
		}
		for ([_, node] of node.next) {
			queue.push([node, indent + 1])
		}
	}
}


function solve(p) {
	const head = parse(p)

	// print_dir_tree(head)

	const dirsSizes =  calc_dirSizes(head)

	let total = 0
	for ([key, value] of dirsSizes.entries()) {
		if (value > 100000) {
			continue
		}
		total += value
	}
	return total
}



function main() {
	const startTime = performance.now()
    const puzzle = load("./input.txt")
	const solPart1 = solve(puzzle)

	console.log(`Solution Part 1: ${solPart1}`)
	console.log(`Solved in ${((performance.now() - startTime) / 1000).toFixed(5)} Sec.`)
}


main()