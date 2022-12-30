// Description: Checks a list of tokens for validity.
//Dependencies
const axios = require("axios")
const Fs = require("fs")

// Variables
const self_args = process.argv.slice(2)

// Checks
if (self_args.length < 2) {
    console.log("node index.js <input> <output>")
    process.exit()
}

if (!Fs.existsSync(self_args[0])) {
    console.log("Invalid input.")
    process.exit()
}

if (!Fs.existsSync(self_args[1])) {
    Fs.writeFileSync(self_args[1], "")
}

let valid_tokens = []
let invalid_tokens = []
let check_tokens = Fs.readFileSync(self_args[0], "utf-8").split("\n")

// Function to check tokens
async function checkToken(token) {
    const response = await fetch('https://discord.com/api/v8/users/@me', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    });
    const data = await response.json();
    if (data.hasOwnProperty('message')) {
        return false;
    } else {
        return true;
    }
}

// Main function
async function main() {
    let i = 0
    while (i < check_tokens.length) {
        let token = check_tokens[i]
        if (!token || token == "") {
            i++
            continue
        }
        let res = await checkToken(token)
        if (res) {
            valid_tokens.push(token)
            console.log("Valid token found: " + token)
        } else {
            invalid_tokens.push(token)
            console.log("Invalid token found: " + token)
        }
        i++
    }
    // Write the valid tokens to the output file
    Fs.writeFileSync(self_args[1], valid_tokens.join("\n"))
}

main()