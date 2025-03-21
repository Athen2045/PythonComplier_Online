# Python Compiler Online

## Overview
This is an online Python compiler that allows users to write, run, and execute Python code directly from the browser. The app features a text editor with syntax highlighting, dynamic input handling, and the ability to save the output to a `.txt` file.

## Features
- **Code Editor**: Integrated with CodeMirror, providing syntax highlighting, line numbers, and code formatting for Python.
- **Run Button**: Users can execute Python code directly from the editor.
- **Dynamic Input Handling**: If the code contains `input()` prompts, users are asked to provide inputs through the UI.
- **Save Output**: After executing the code, users can download the output as a `.txt` file.

## Technologies Used
- **HTML**: Structure of the page.
- **CSS**: Styling for the page and elements.
- **JavaScript**: Code functionality, including interaction with the CodeMirror editor and API calls.
- **CodeMirror**: A versatile code editor embedded in the application.
- **EMKC Piston API**: Used to execute Python code remotely.

## Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/python-compiler-online.git
    ```
    
2. **Install Dependencies**:
    No specific dependencies are required for this project as it utilizes external libraries (CodeMirror and the EMKC API).

3. **Open the Project**:
    Open `index.html` in your browser to view and use the Python compiler.

## How to Use

1. **Write Code**: Write your Python code in the text editor.
2. **Input Handling**: If your code contains `input()` statements, you will be prompted to provide input fields for the code to work with.
3. **Run Code**: Click the **Run** button to execute the code. The output will appear in the output container.
4. **Save Output**: After running the code, click the **Save Output** button to download the results in a `.txt` file.

## Customization

- **Change the default code**: The default Python code is set to `print('Hello, World!')`. You can change this to any other code in the `script.js` file.
  
- **Styling**: Customize the appearance of the application by modifying the `style.css` file.

## Contributing
If you'd like to contribute, feel free to fork the repository and submit pull requests with your enhancements or bug fixes.

## License
This project is open source and available under the MIT License.

## Acknowledgments
- **CodeMirror**: For providing a powerful and customizable code editor.
- **EMKC Piston API**: For enabling us to execute Python code remotely via an API.

