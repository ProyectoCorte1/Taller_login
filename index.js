function cipherText() {
    var textToCipher = document.getElementById("TextToCipher").value;
    var zeroEspaces = zeroEspacesMethod(textToCipher);
    var zeroAccents = replaceLettersMethod(zeroEspaces);
    var deleteSpecialCharacters = removeSpecialCharactersMethod(zeroAccents);
    var a = parseInt(document.getElementById("a").value);
    var b = parseInt(document.getElementById("b").value);
    var validateNumbers = validateNumbersMethod(a, b);

    if (validateNumbers) {
        var n = 27;
        var validateCoprimes = validateCoprimesMethod(a, n);

        if (validateCoprimes) {
            var finalChain = affineAlgorithm(a, b, n, deleteSpecialCharacters);
            var texArea = document.getElementById("Text_Area_Cipher");
            texArea.textContent = finalChain;

        }
    }
}

function zeroEspacesMethod(chain) {
    return chain.replace(/\s+/g, '');
}

function replaceLettersMethod(chain) {
    var accents = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
    };

    return chain.replace(/[áéíóúÁÉÍÓÚ]/g, function (match) {
        return accents[match];
    });
}

function removeSpecialCharactersMethod(chain) {
    return chain.replace(/[^a-zA-ZñÑ]/g, '');
}

function validateNumbersMethod(a, b) {
    var n = 27;

    if (a >= 0 && a < n && b >= 0 && b < n) {
        alert("Los números son válidos.");
        return true;
    } else {
        alert("Los números no son válidos. A y B deben estar entre 0 y " + (n - 1) + ".");
        return false;
    }
}

function gcdMethod(a, b) {
    if (b === 0) {
        return a;
    }

    return gcdMethod(b, a % b);
}

function validateCoprimesMethod(a, n) {
    if (gcdMethod(a, n) === 1) {
        alert("Son números coprimos.");
        return true;
    } else {
        alert("No son números coprimos. El máximo común divisor de a y n no es 1.");
        return false;
    }
}

function affineAlgorithm(a, b, n, chain) {
    var cipherChain = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var alphabetLower = alphabet.toLowerCase();

    for (var i = 0; i < chain.length; i++) {
        var char = chain[i];
        var isUpperCase = /[A-Z]/.test(char);
        var isLowerCase = /[a-zñ]/.test(char);

        if (isUpperCase) {
            var index = alphabet.indexOf(char);
            var result = (a * index + b) % n;
            var finalLetter = alphabet.charAt(result);
            cipherChain += finalLetter;
        } else if (isLowerCase) {
            var index = alphabetLower.indexOf(char);
            var result = (a * index + b) % n;
            var finalLetter = alphabetLower.charAt(result);
            cipherChain += finalLetter;
        } else if (char === 'ñ') {
            var index = alphabetLower.indexOf('ñ');
            var result = (a * index + b) % n;
            var finalLetter = 'ñ';
            cipherChain += finalLetter;
        } else {
            // Carácter no válido, se omite o se puede manejar de otra forma.
        }
    }

    return cipherChain;
}

function decipherText() {
    var textToDecipher = document.getElementById("TextToDecipher").value;
    var a = parseInt(document.getElementById("a").value);
    var b = parseInt(document.getElementById("b").value);
    var n = 27; // El mismo valor de n que se usó en el cifrado

    if (validateNumbersMethod(a, b)) {
        if (validateCoprimesMethod(a, n)) {
            var decryptedChain = inverseAffineAlgorithm(a, b, n, textToDecipher);
            var texArea = document.getElementById("Text_Area_Decipher");
            texArea.textContent = decryptedChain;
             
            var finalChain = document.getElementById("TextToDecipher").value;

            // Calcular la frecuencia de las letras

             var letterFrequency = calculateLetterFrequency(finalChain);

             // Mostrar el histograma
             displayHistogram(letterFrequency);

        }
    }
}

function inverseAffineAlgorithm(a, b, n, chain) {
    var inverseA = findInverseA(a, n);
    var plainChain = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var alphabetLower = alphabet.toLowerCase();

    for (var i = 0; i < chain.length; i++) {
        var char = chain[i];
        var isUpperCase = /[A-Z]/.test(char);
        var isLowerCase = /[a-zñ]/.test(char);

        if (isUpperCase) {
            var index = alphabet.indexOf(char);
            var result = (inverseA * (index - b + n)) % n;
            var finalLetter = alphabet.charAt(result);
            plainChain += finalLetter;
        } else if (isLowerCase) {
            var index = alphabetLower.indexOf(char);
            var result = (inverseA * (index - b + n)) % n;
            var finalLetter = alphabetLower.charAt(result);
            plainChain += finalLetter;
        } else if (char === 'ñ') {
            var index = alphabetLower.indexOf('ñ');
            var result = (inverseA * (index - b + n)) % n;
            var finalLetter = 'ñ';
            plainChain += finalLetter;
        } else {
            // Carácter no válido, se omite o se puede manejar de otra forma.
        }
    }

    return plainChain;
}

function findInverseA(a, n) {
    for (var i = 1; i < n; i++) {
        if ((a * i) % n === 1) {
            return i;
        }
    }
    return null;
}

function calculateLetterFrequency(text) {
    var frequency = {};
    for (var i = 0; i < text.length; i++) {
        var char = text[i].toLowerCase();
        if (/[a-zñ]/.test(char)) {
            if (frequency[char]) {
                frequency[char]++;
            } else {
                frequency[char] = 1;
            }
        }
    }
    return frequency;
}

function displayHistogram(letterFrequency) {
    var dataPoints = Object.keys(letterFrequency).map(function (key) {
        return { letter: key, frequency: letterFrequency[key] };
    });
    dataPoints.sort(function (a, b) {
        return b.frequency - a.frequency;
    });

    // Separar las etiquetas ordenadas y los datos ordenados
    var labels = dataPoints.map(function (dataPoint) {
        return dataPoint.letter;
    });
    var data = dataPoints.map(function (dataPoint) {
        return dataPoint.frequency;
    });

    var ctx = document.getElementById("histogram").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Frecuencia de letras",
                    data: data,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

