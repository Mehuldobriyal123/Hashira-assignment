const fs = require('fs');

// Function to read from file and return parsed JSON
function readInputFromFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
}

// Function to decode value using its base
function decodeValue(strVal, base) {
    return BigInt(parseInt(strVal, base));
}

// Function to perform Lagrange Interpolation and get f(0)
function findSecretC(points, k) {
    let secret = BigInt(0);

    for (let i = 0; i < k; i++) {
        let xi = BigInt(points[i].x);
        let yi = points[i].y;

        let numerator = BigInt(1);
        let denominator = BigInt(1);

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = BigInt(points[j].x);
                numerator *= -xj;
                denominator *= (xi - xj);
            }
        }

        let term = yi * numerator / denominator;
        secret += term;
    }

    return secret;
}

// Function to process a test case given a file
function processTestCase(file) {
    const input = readInputFromFile(file);
    const n = input.keys.n;
    const k = input.keys.k;

    const roots = [];

    for (const key in input) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const base = parseInt(input[key].base);
            const y = decodeValue(input[key].value, base);
            roots.push({ x: x, y: y });
        }
    }

    const sortedPoints = roots.sort((a, b) => a.x - b.x);
    const chosenPoints = sortedPoints.slice(0, k);

    const secret = findSecretC(chosenPoints, k);
    return secret.toString();
}

// Run both test cases here
const result1 = processTestCase('input1.json');
const result2 = processTestCase('input2.json');

console.log("Secret from Testcase 1:", result1);
console.log("Secret from Testcase 2:", result2);
