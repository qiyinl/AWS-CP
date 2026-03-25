const fs = require('fs');

try {
    const text = fs.readFileSync('README.md', 'utf8');
    const questions = parseMarkdown(text);
    console.log(`Successfully parsed ${questions.length} questions.`);
    if (questions.length > 0) {
        console.log('First Question:', JSON.stringify(questions[0], null, 2));
        console.log('Last Question:', JSON.stringify(questions[questions.length - 1], null, 2));
    }
} catch (err) {
    console.error('Error:', err.message);
}

function parseMarkdown(text) {
    const questions = [];
    const lines = text.split('\n');
    let currentQuestion = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('### ')) {
            if (currentQuestion && currentQuestion.options.length > 0) {
                questions.push(currentQuestion);
            }

            currentQuestion = {
                text: line.replace(/^###\s+/, ''),
                options: [],
                answerIndices: []
            };
        } else if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
            if (currentQuestion) {
                const isCorrect = line.startsWith('- [x]');
                const optionText = line.replace(/^- \[[ x]\]\s+/, '');

                currentQuestion.options.push(optionText);
                if (isCorrect) {
                    currentQuestion.answerIndices.push(currentQuestion.options.length - 1);
                }
            }
        }
    }

    if (currentQuestion && currentQuestion.options.length > 0) {
        questions.push(currentQuestion);
    }

    return questions;
}
