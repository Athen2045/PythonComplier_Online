document.addEventListener('DOMContentLoaded', function() {
    const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "python",
        theme: "material",
        indentUnit: 4,
        smartIndent: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        lineWrapping: true
    });

    // Default Code
    editor.setValue("print('Hello, World!')");

    // Function to execute the code
    async function executeCode(code, inputs = []) {
        const outputElement = document.getElementById("output");
        outputElement.textContent = "Compiling...";

        // Replace each input() call with the corresponding user input
        let inputIndex = 0;
        code = code.replace(/input\(\s*['"]([^'"]*)['"]\s*\)/g, () => {
            return `'${inputs[inputIndex++] || ""}'`;
        });

        try {
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: "python",
                    version: "3.10.0",
                    files: [{ content: code }]
                })
            });

            if (!response.ok) {
                throw new Error("Failed to execute code");
            }

            const result = await response.json();
            const output = result.run.output || "No output!";

            // Add the '>' before the output, mimicking terminal behavior
            outputElement.innerHTML = `> ${output}`;
        } catch (error) {
            outputElement.textContent = "Error: " + error.message;
        }
    }

    // Function to compile the code with dynamic input handling
    async function compileCode() {
        const code = editor.getValue();
        const outputElement = document.getElementById("output");
        outputElement.textContent = "Compiling...";

        // Check if input() is needed
        const inputPattern = /input\(\s*['"]([^'"]+)['"]\s*\)/g;
        const inputPrompts = [...code.matchAll(inputPattern)].map(match => match[1]);

        if (inputPrompts.length > 0) {
            outputElement.innerHTML = "<h3>Provide Input:</h3>";

            // Create container for input fields
            const inputsContainer = document.createElement("div");
            inputsContainer.classList.add("inputs-container");

            inputPrompts.forEach((prompt, index) => {
                const inputGroup = document.createElement('div');
                inputGroup.classList.add('input-group');

                const label = document.createElement('label');
                label.setAttribute('for', `input-${index}`);
                label.textContent = prompt;

                const input = document.createElement('input');
                input.type = 'text';
                input.id = `input-${index}`;
                input.classList.add('user-input');

                // Append label and input to the input group
                inputGroup.appendChild(label);
                inputGroup.appendChild(input);

                // Append input group to the inputs container
                inputsContainer.appendChild(inputGroup);
            });

            // Append inputs container to the output element
            outputElement.appendChild(inputsContainer);

            // Create and append submit button
            const submitButton = document.createElement('button');
            submitButton.id = 'submit-inputs-btn';
            submitButton.textContent = 'Submit Inputs';
            outputElement.appendChild(submitButton);

            // Attach event listener to the submit button
            submitButton.addEventListener('click', submitInputs);
            return;
        }

        await executeCode(code);
    }

    // Collects inputs and reruns the code
    function submitInputs() {
        const inputs = Array.from(document.querySelectorAll('.user-input')).map(input => input.value);
        const code = editor.getValue();
        executeCode(code, inputs);
    }

    // Add event listener to the run button (Check if it exists before adding)
    const runButton = document.querySelector(".run-btn");
    if (runButton) {
        runButton.addEventListener("click", compileCode);
    }
});
