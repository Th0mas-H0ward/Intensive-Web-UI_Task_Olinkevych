const fs = require('fs');

class Berry {
    constructor(name, color, vitamins) {
        this.name = name;
        this.color = color;
        this.vitamins = vitamins;
    }
}

class Compote {
    constructor(name, berries = []) {
        this.name = name;
        this.berries = berries;
    }

    addBerry(berry) {
        this.berries.push(berry);
    }
}

function parseBerryRow(row) {
    const parts = row.split('|').map(part => part.trim());

    if (parts.length !== 3) {
        throw new Error('Error! Please, provide the row in a correct format: "name | color | vitamin1,vitamin2,..."');
    }

    const name = parts[0];
    const color = parts[1];
    const vitamins = parts[2].split(',').map(vitamin => vitamin.trim());

    if (!name || !color || vitamins.length === 0) {
        throw new Error(`Error! Invalid line detected. Please, check the input file.`);
    }
    return new Berry(name, color, vitamins);
}

function readBerryData(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const rows = data.split('\n').filter(row => row.trim().length > 0);
        const berries = [];

        for (const row of rows) {
            try {
                const berry = parseBerryRow(row);
                berries.push(berry);
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
        return berries;
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error(`File not found: ${filename}`);
        }
        throw error;
    }
}

function createCompotes(berries) {
    const compotes = {};

    berries.forEach(berry => {
        const compoteName = `${berry.color} compote`;

        if (!compotes[compoteName]) {
            compotes[compoteName] = new Compote(compoteName);
        }
        compotes[compoteName].addBerry(berry);
    });

    return Object.values(compotes).sort((a, b) => {
        if (a.berries.length !== b.berries.length) {
            return b.berries.length - a.berries.length;
        }
        return a.name.localeCompare(b.name);
    });
}

function writeCompoteDescriptions(compotes, filename) {
    try {
        let output = '';

        compotes.forEach(compote => {
            output += `${compote.name}\n`;
            output += `Berries: ${compote.berries.map(b => b.name).join(', ')}\n`;
            output += `Number of berries: ${compote.berries.length}\n\n`;
        });

        fs.writeFileSync(filename, output.trim(), 'utf8');
    } catch (error) {
        console.error(`Error!: ${error.message}`);
        throw error;
    }
}

function writeCompoteVitamins(compotes, filename) {
    try {
        let output = '';

        compotes.forEach(compote => {
            const vitaminSet = new Set();
            compote.berries.forEach(berry => {
                berry.vitamins.forEach(vitamin => vitaminSet.add(vitamin));
            });
            const uniqueVitamins = Array.from(vitaminSet);

            output += `${compote.name}\n`;
            output += `Vitamins: ${uniqueVitamins.join(', ')}\n\n`;
        });

        fs.writeFileSync(filename, output.trim(), 'utf8');
    } catch (error) {
        console.error(`Error!: ${error.message}`);
        throw error;
    }
}

function main() {
    const inputFile = 'berries.txt';
    const descriptionsFile = 'compote_descriptions.txt';
    const vitaminsFile = 'compote_vitamins.txt';

    try {
        console.log(`Reading data from ${inputFile}`);
        const berries = readBerryData(inputFile);
        console.log(`Success! Read ${berries.length} berries`);

        console.log(`Conpotes creation.`);
        const compotes = createCompotes(berries);
        console.log(`Created ${compotes.length} compotes`);

        console.log(`Output files creation.`);
        writeCompoteDescriptions(compotes, descriptionsFile);
        writeCompoteVitamins(compotes, vitaminsFile);

        console.log(`Completed.`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

main();