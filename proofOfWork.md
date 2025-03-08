**Hashing** is a process that transforms input data (of any size) into a fixed-size string of characters.

Hash functions have several important properties:

1. **Deterministic**: The same input will always produce the same output.
2. **Fast computation**: The hash value can be quickly computed for any given data.
3. **Pre-image resistance**: It should be computationally infeasible to reverse the hash function (i.e., find the original input given its hash output).
4. **Small changes in input produce large changes in output**: Even a tiny change in the input should drastically change the hash output.
5. **Collision resistance**: It should be computationally infeasible to find two different inputs that produce the same hash output.


### Node.js code for generating SHA-256

```rust
const crypto = require('crypto');

const input = "Phantom";
const hash = crypto.createHash('sha256').update(input).digest('hex');

console.log(hash)
```
# Intro to Proof of work

## #1

What if I ask you the following question — Give me an input string that outputs a SHA-256 hash that starts with `00000` . **How will you do it?**

**A: You will have to brute force until you find a value that starts with `00000`**

- Node.js code
    
    ```rust
    const crypto = require('crypto');
    
    // Function to find an input string that produces a hash starting with '00000'
    function findHashWithPrefix(prefix) {
        let input = 0;
        while (true) {
            let inputStr = input.toString();
            let hash = crypto.createHash('sha256').update(inputStr).digest('hex');
            if (hash.startsWith(prefix)) {
                return { input: inputStr, hash: hash };
            }
            input++;
        }
    }
    
    // Find and print the input string and hash
    const result = findHashWithPrefix('00000');
    console.log(`Input: ${result.input}`);
    console.log(`Hash: ${result.hash}`);
    ```
    


### #2

What if I ask you that the `input string` should start with `qwerty` ? How would the code change?

- Node.js code
    
    ```rust
    const crypto = require('crypto');
    
    // Function to find an input string that produces a hash starting with '00000'
    function findHashWithPrefix(prefix) {
        let input = 0;
        while (true) {
            let inputStr = "qwerty" + input.toString();
            let hash = crypto.createHash('sha256').update(inputStr).digest('hex');
            if (hash.startsWith(prefix)) {
                return { input: inputStr, hash: hash };
            }
            input++;
        }
    }
    
    // Find and print the input string and hash
    const result = findHashWithPrefix('00000');
    console.log(`Input: ${result.input}`);
    console.log(`Hash: ${result.hash}`);
    ```
    


### #3

What if I ask you to `find` a nonce for the following input - 

```rust
q => w | Rs 100
w => e | Rs 10
```

- Node.js code
    
    ```rust
    const crypto = require('crypto');
    
    // Function to find an input string that produces a hash starting with '00000'
    function findHashWithPrefix(prefix) {
        let input = 0;
        while (true) {
            let inputStr = `
    q => w | Rs 100
    w => e | Rs 10
    ` + input.toString();
            let hash = crypto.createHash('sha256').update(inputStr).digest('hex');
            if (hash.startsWith(prefix)) {
                return { input: inputStr, hash: hash };
            }
            input++;
        }
    }
    
    // Find and print the input string and hash
    const result = findHashWithPrefix('00000');
    console.log(`Input: ${result.input}`);
    console.log(`Hash: ${result.hash}`);
    ```
    