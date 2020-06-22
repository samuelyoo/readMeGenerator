const fs = require('fs');
const inquirer = require('inquirer');
const util = require('util');
const axios = require('axios');

const writeFileAsync = util.promisify(fs.writeFile);
const appendFileAsync = util.promisify(fs.appendFile);

function promptUser() {
    return inquirer.prompt([
        {
            type: 'input',
            message: 'Enter your name?',
            name: 'name'
        },
        {
            type: 'input',
            message: 'Enter your github username?',
            name: 'github'
        },
        {
            type: 'input',
            message: 'Enter the title of your project?',
            name: 'title'
        },
        {
            type: 'input',
            message: 'Enter a description of the project.',
            name: 'description'
        },
        {
            type: 'input',
            message: 'Enter installation instructions.',
            name: 'installation'
        },
        {
            type: 'input',
            message: 'Enter usage instructions.',
            name: 'usage'
        },
        {
            type: 'input',
            message: 'Enter license information.',
            name: 'license'
        },
        {
            type: 'input',
            message: 'Enter all contributors.',
            name: 'cotributing'
        },
        {
            type: 'input',
            message: 'Provide any information on testing.',
            name: 'test'
        },
    ])
};

promptUser()
    .then(function (answers) {
        const md = generateMD(answers);
        console.log(answers)
        writeFileAsync("READMEgen.md", md);
        axios.get(
            `https://api.github.com/users/${answers.github}`
        ).then(function (results) {
            console.log(results);
            const appendMD = appendContact(results)
            appendFileAsync("READMEgen.md", appendMD)
        })
    })
    .catch(err => { console.log(err);}
    );

function generateMD(answers) {
    return `
 # ${answers.title}  



## Description
${answers.description}

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [License](#license)
4. [Contributors](#contributors)
5. [Tests](#tests)
6. [Contact](#contact)

<a name="installation"></a>

## Installation
${answers.installation}

<a name="usage"></a>


## Usage
${answers.usage}

<a name="license"></a>


## License
${answers.license}

<a name="contributors"></a>


## Contributors
${answers.contributing}

<a name="tests"></a>


## Tests
${answers.test}`
};

function appendContact(results) {
    return `

<a name="contact"></a>


## Contact
![Profile picture](${results.data.avatar_url})
[Email me @ ${results.data.email}]`
};