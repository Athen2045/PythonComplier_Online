document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror for the code editor with specific options
    const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,  // Display line numbers in the editor
        mode: "python",  // Set the editor to Python language mode
        theme: "material",  // Set the theme to 'material' for a sleek look
        indentUnit: 4,  // Set the indentation size to 4 spaces
        smartIndent: true,  // Enable smart indentation for Python
        matchBrackets: true,  // Highlight matching brackets
        autoCloseBrackets: true,  // Automatically close brackets
        lineWrapping: true  // Enable line wrapping for long lines of code
    });

    // Set default code in the editor (Hello World in Python)
    editor.setValue("print('Hello, World!')");

    // Function to execute the code in the editor with provided inputs
    async function executeCode(code, inputs = []) {
        const outputElement = document.getElementById("output");
        outputElement.textContent = "Compiling...";  // Show compiling message

        // Replace each input() call with corresponding user input
        let inputIndex = 0;
        code = code.replace(/input\(\s*['"]?([^'"]*)['"]?\s*\)/g, () => {
            return `'${inputs[inputIndex++] || ""}'`;
        });

        try {
            // Make an API request to execute the code via an online API (Piston API)
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: "python",  // Specify the language as Python
                    version: "3.10.0",  // Specify Python version
                    files: [{ content: code }]  // Send the code as file content
                })
            });

            // If the response is not OK, throw an error
            if (!response.ok) {
                throw new Error("Failed to execute code");
            }

            // Parse the response and extract the output from the execution
            const result = await response.json();
            const output = result.run.stdout || result.run.output || "No output!";
            outputElement.innerHTML = `> ${output}`;  // Display the output in the output container
        } catch (error) {
            outputElement.textContent = "Error: " + error.message;  // Handle errors by displaying error message
        }
    }

    // Function to compile the code and check if input() is required
    async function compileCode() {
        const code = editor.getValue();  // Get the current code from the editor
        const outputElement = document.getElementById("output");
        outputElement.textContent = "Compiling...";  // Show compiling message

        // Regular expression to check if input() is called in the code
        const inputPattern = /input\(\s*['"]?([^'"]*)['"]?\s*\)/g;
        const inputPrompts = [...code.matchAll(inputPattern)].map(match => match[1]);  // Get all prompts for inputs

        // If input() is found, ask the user for inputs
        if (inputPrompts.length > 0) {
            outputElement.innerHTML = "<h3>Provide Input:</h3>";  // Show input prompts message

            // Create a container to hold all the input fields
            const inputsContainer = document.createElement("div");
            inputsContainer.classList.add("inputs-container");

            // Create an input field for each prompt found in the code
            inputPrompts.forEach((prompt, index) => {
                const inputGroup = document.createElement('div');
                inputGroup.classList.add('input-group');

                const label = document.createElement('label');
                label.setAttribute('for', `input-${index}`);
                label.textContent = prompt;  // Set the label as the prompt from the input() call

                const input = document.createElement('input');
                input.type = 'text';
                input.id = `input-${index}`;
                input.classList.add('user-input');  // Add class for styling

                inputGroup.appendChild(label);
                inputGroup.appendChild(input);
                inputsContainer.appendChild(inputGroup);
            });

            outputElement.appendChild(inputsContainer);  // Add the input fields container to the output area

            // Create a submit button for the inputs
            const submitButton = document.createElement('button');
            submitButton.id = 'submit-inputs-btn';
            submitButton.textContent = 'Submit Inputs';
            outputElement.appendChild(submitButton);

            // Add click event listener to submit button
            submitButton.addEventListener('click', submitInputs);
            return;  // Stop here until inputs are submitted
        }

        // If no input() calls are found, execute the code
        await executeCode(code);
    }

    // Collect the inputs from the user and rerun the code with these inputs
    function submitInputs() {
        const inputs = Array.from(document.querySelectorAll('.user-input')).map(input => input.value);  // Get all input values
        const code = editor.getValue();  // Get the current code from the editor
        executeCode(code, inputs);  // Execute the code with the provided inputs
    }

    // Add event listener to the run button to trigger code compilation
    const runButton = document.querySelector(".run-btn");
    if (runButton) {
        runButton.addEventListener("click", compileCode);
    }

    // Function to save the output to a text file
    function saveOutputToFile() {
        const output = document.getElementById("output").textContent;  // Get the output text
        const blob = new Blob([output], { type: 'text/plain' });  // Create a Blob object containing the output
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);  // Create a URL for the Blob
        link.download = "output.txt";  // Set the download file name
        link.click();  // Trigger the download by clicking the link
    }

    // Create and append the 'Save Output' button to the output container
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Output';
    saveButton.classList.add('save-btn');  // Optional: add a class for styling
    saveButton.addEventListener('click', saveOutputToFile);

    // Append the Save Output button to the output-container (after output)
    const outputContainer = document.querySelector('.output-container');
    if (outputContainer) {
        outputContainer.appendChild(saveButton);
    }
});
