const fs = require('fs');

let scriptContent = fs.readFileSync('script.js', 'utf8');

// Replace state
scriptContent = scriptContent.replace(`    const state = {
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: {}, // { questionIndex: [selectedOptionIndices] }
        score: 0,
        mode: 'quiz', // 'quiz', 'study', 'cheat-sheet'
        studyPage: 1,
        itemsPerPage: 10
    };`, `    const state = {
        allQuestions: [],
        quizQuestions: [],
        currentQuestionIndex: 0,
        userAnswers: {}, 
        score: 0,
        examMode: 'exam',
        timerInterval: null,
        timeRemaining: 0,
        studyPage: 1,
        itemsPerPage: 10
    };`);

// Replace elements
scriptContent = scriptContent.replace(`    const elements = {
        navBtns: document.querySelectorAll('.nav-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        loading: document.getElementById('loading'),
        quizContainer: document.getElementById('quiz-container'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        resetBtn: document.getElementById('reset-btn'),
        questionCount: document.getElementById('question-count'),
        scoreDisplay: document.getElementById('score-display'),
        quizProgress: document.getElementById('quiz-progress'),
        studyList: document.getElementById('study-list'),
        studySearch: document.getElementById('study-search'),
        studyPrevBtn: document.getElementById('study-prev'),
        studyNextBtn: document.getElementById('study-next'),
        studyPageInfo: document.getElementById('study-page-info'),
        csBody: document.getElementById('cs-body'),
        csSearch: document.getElementById('cs-search'),
        downloadPdfBtn: document.getElementById('download-pdf')
    };`, `    const elements = {
        navBtns: document.querySelectorAll('.nav-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        loading: document.getElementById('loading'),
        
        quizSetup: document.getElementById('quiz-setup'),
        quizActive: document.getElementById('quiz-active'),
        quizResults: document.getElementById('quiz-results'),
        
        setupTopics: document.getElementById('setup-topics'),
        selectAllTopicsBtn: document.getElementById('select-all-topics'),
        startExamBtn: document.getElementById('start-exam-btn'),
        
        quizContainer: document.getElementById('quiz-container'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        resetBtn: document.getElementById('reset-btn'),
        questionCount: document.getElementById('question-count'),
        timerDisplay: document.getElementById('timer-display'),
        quizProgress: document.getElementById('quiz-progress'),
        
        resultsTitle: document.getElementById('results-title'),
        finalScorePct: document.getElementById('final-score-pct'),
        finalScoreText: document.getElementById('final-score-text'),
        passFailBadge: document.getElementById('pass-fail-badge'),
        reviewAnswersBtn: document.getElementById('review-answers-btn'),
        newExamBtn: document.getElementById('new-exam-btn'),
        incorrectReview: document.getElementById('incorrect-review'),
        weakTopics: document.getElementById('weak-topics'),
        incorrectList: document.getElementById('incorrect-list'),

        studyList: document.getElementById('study-list'),
        studySearch: document.getElementById('study-search'),
        studyPrevBtn: document.getElementById('study-prev'),
        studyNextBtn: document.getElementById('study-next'),
        studyPageInfo: document.getElementById('study-page-info'),
        csBody: document.getElementById('cs-body'),
        csSearch: document.getElementById('cs-search'),
        downloadPdfBtn: document.getElementById('download-pdf')
    };`);


// Rename state.questions to state.allQuestions in Study and CheatSheet
scriptContent = scriptContent.replace(/state\.questions/g, 'state.allQuestions');

// Revert back quiz specific ones manually by rewriting Quiz Logic
const quizLogicStart = scriptContent.indexOf('    // --- Quiz Logic ---');
const studyLogicStart = scriptContent.indexOf('    // --- Study Mode Logic (With Pagination) ---');
const eventListenersStart = scriptContent.indexOf('    // --- Event Listeners ---');
const endOfFile = scriptContent.length;

const newQuizLogic = `    // --- Quiz Setup & Execution ---

    function renderSetupTopics() {
        // Extract unique topics
        const topics = [...new Set(state.allQuestions.map(q => q.topic))].sort();
        
        let html = '';
        topics.forEach(t => {
            html += \`<label><input type="checkbox" name="topicFilters" value="\${t}" checked> \${t}</label>\`;
        });
        elements.setupTopics.innerHTML = html;
    }

    function startMockExam() {
        // Gather settings
        const qCountVal = document.querySelector('input[name="qCount"]:checked').value;
        state.examMode = document.querySelector('input[name="examMode"]:checked').value;
        
        const selectedTopics = Array.from(document.querySelectorAll('input[name="topicFilters"]:checked')).map(cb => cb.value);
        
        if (selectedTopics.length === 0) {
            alert("Please select at least one topic.");
            return;
        }

        // Filter and shuffle
        let pool = state.allQuestions.filter(q => selectedTopics.includes(q.topic));
        shuffleArray(pool);
        
        const count = qCountVal === 'all' ? pool.length : Math.min(parseInt(qCountVal), pool.length);
        state.quizQuestions = pool.slice(0, count);
        
        if (state.quizQuestions.length === 0) {
            alert("No questions found for the selected criteria.");
            return;
        }

        // Reset state
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.userAnswers = {};
        
        // Timer Setup
        if(state.timerInterval) clearInterval(state.timerInterval);
        if (state.examMode === 'exam') {
            // Roughly 1.38 mins per question like real AWS exam (90 mins for 65 qs)
            state.timeRemaining = Math.ceil(state.quizQuestions.length * 1.38 * 60); 
            elements.timerDisplay.style.display = 'inline-block';
            updateTimerDisplay();
            state.timerInterval = setInterval(() => {
                state.timeRemaining--;
                updateTimerDisplay();
                if (state.timeRemaining <= 0) {
                    clearInterval(state.timerInterval);
                    finishExam(true); // Auto finish
                }
            }, 1000);
        } else {
            elements.timerDisplay.style.display = 'none';
        }

        // UI Transition
        elements.quizSetup.classList.remove('active-view');
        elements.quizResults.classList.remove('active-view');
        elements.quizActive.classList.add('active-view');
        
        renderQuiz();
    }
    
    function updateTimerDisplay() {
        const m = Math.floor(state.timeRemaining / 60).toString().padStart(2, '0');
        const s = (state.timeRemaining % 60).toString().padStart(2, '0');
        elements.timerDisplay.textContent = \`\${m}:\${s}\`;
        
        if (state.timeRemaining < 300) {
            elements.timerDisplay.style.backgroundColor = 'var(--error)';
        } else {
            elements.timerDisplay.style.backgroundColor = 'var(--aws-blue)';
        }
    }

    function renderQuiz() {
        const q = state.quizQuestions[state.currentQuestionIndex];
        const isAnswered = state.userAnswers[state.currentQuestionIndex] !== undefined;
        // In exam mode, we don't consider answers "locked" in the same way, we let them change it until "Next"
        // But for simplicity, let's keep the existing behaviour for practice mode and adapt for exam mode

        let optionsHtml = '';
        q.options.forEach((opt, idx) => {
            let className = 'option-btn';

            if (isAnswered) {
                const userSelected = state.userAnswers[state.currentQuestionIndex].includes(idx);
                
                if (state.examMode === 'practice') {
                    const isCorrect = q.answerIndices.includes(idx);
                    if (isCorrect) className += ' correct';
                    else if (userSelected) className += ' incorrect';
                    else className += ' disabled';
                } else {
                    // Exam Mode: Just highlight selection, no right/wrong
                    if (userSelected) className += ' selected';
                }
            }

            optionsHtml += \`<button class="\${className}" data-index="\${idx}" \${(isAnswered && state.examMode === 'practice') ? 'disabled' : ''}>\${opt}</button>\`;
        });

        let feedbackHtml = '';
        if (isAnswered && state.examMode === 'practice') {
            feedbackHtml = \`<div style="margin-top:1rem; font-weight:600; color:\${isCorrectAnswer() ? 'var(--success)' : 'var(--error)'}">\${isCorrectAnswer() ? 'Correct!' : 'Incorrect'}</div>\`;
        }

        const html = \`
            <div class="quiz-card fade-in">
                <h3 class="question-text">\${q.text}</h3>
                <div class="options-list">
                    \${optionsHtml}
                </div>
                \${feedbackHtml}
            </div>
        \`;

        elements.quizContainer.innerHTML = html;
        updateStats();
        setupOptionListeners();
    }

    function isCorrectAnswer(qIndex = state.currentQuestionIndex) {
        const userSelected = state.userAnswers[qIndex] || [];
        const correct = state.quizQuestions[qIndex].answerIndices;

        if (userSelected.length !== correct.length) return false;
        return userSelected.every(val => correct.includes(val)) && correct.every(val => userSelected.includes(val));
    }

    function setupOptionListeners() {
        const optionBtns = elements.quizContainer.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (state.userAnswers[state.currentQuestionIndex] && state.examMode === 'practice') return;

                const selectedIdx = parseInt(e.target.dataset.index);
                
                // Allow changing answers in Exam mode
                // For simplicity, handle single-select only for now since most are single select, 
                // but realistically we should check if multiple answers are required.
                const q = state.quizQuestions[state.currentQuestionIndex];
                if (q.answerIndices.length > 1) {
                    const currentArr = state.userAnswers[state.currentQuestionIndex] || [];
                    if (currentArr.includes(selectedIdx)) {
                        state.userAnswers[state.currentQuestionIndex] = currentArr.filter(i => i !== selectedIdx);
                    } else if (currentArr.length < q.answerIndices.length) {
                        state.userAnswers[state.currentQuestionIndex] = [...currentArr, selectedIdx];
                    }
                } else {
                    state.userAnswers[state.currentQuestionIndex] = [selectedIdx];
                }

                renderQuiz();
            });
        });
    }

    function updateStats() {
        elements.questionCount.textContent = \`Question \${state.currentQuestionIndex + 1}/\${state.quizQuestions.length}\`;

        const progress = ((state.currentQuestionIndex + 1) / state.quizQuestions.length) * 100;
        elements.quizProgress.style.width = \`\${progress}%\`;

        elements.prevBtn.disabled = state.currentQuestionIndex === 0;
        
        if (state.currentQuestionIndex === state.quizQuestions.length - 1) {
            elements.nextBtn.textContent = 'Finish Exam';
            elements.nextBtn.classList.replace('primary-btn', 'danger-btn');
        } else {
            elements.nextBtn.textContent = 'Next';
            elements.nextBtn.classList.replace('danger-btn', 'primary-btn');
        }
    }
    
    function finishExam(auto = false) {
        if(state.timerInterval) clearInterval(state.timerInterval);
        
        // Calculate score
        state.score = 0;
        const incorrectIndices = [];
        const weakTopicsMap = {};
        
        for (let i = 0; i < state.quizQuestions.length; i++) {
            if (isCorrectAnswer(i)) {
                state.score++;
            } else {
                incorrectIndices.push(i);
                const t = state.quizQuestions[i].topic;
                weakTopicsMap[t] = (weakTopicsMap[t] || 0) + 1;
            }
        }
        
        const pct = Math.round((state.score / state.quizQuestions.length) * 100);
        
        // Update DOM
        elements.finalScorePct.textContent = \`\${pct}%\`;
        elements.finalScoreText.textContent = \`You scored \${state.score} out of \${state.quizQuestions.length}\`;
        
        if (pct >= 70) {
            elements.passFailBadge.textContent = 'PASS';
            elements.passFailBadge.className = 'result-badge pass';
            elements.scoreCircle.style?.setProperty('border-color', 'var(--success)');
        } else {
            elements.passFailBadge.textContent = 'FAIL';
            elements.passFailBadge.className = 'result-badge fail';
            elements.scoreCircle?.style?.setProperty('border-color', 'var(--error)');
        }
        
        // Render Weak Topics
        if (Object.keys(weakTopicsMap).length > 0) {
            elements.weakTopics.innerHTML = Object.entries(weakTopicsMap)
                .sort((a,b) => b[1] - a[1])
                .map(([topic, errors]) => \`<span class="topic-badge" data-topic="\${topic}">\${topic} (\${errors} wrong)</span>\`)
                .join('');
        } else {
            elements.weakTopics.innerHTML = "<em>None! You aced it!</em>";
        }
        
        // Render Incorrect Reviews
        elements.incorrectList.innerHTML = incorrectIndices.map(i => {
           const q = state.quizQuestions[i];
           const correctOpts = q.options.filter((_, idx) => q.answerIndices.includes(idx)).join(', ');
           const userAnsw = state.userAnswers[i] ? state.userAnswers[i].map(idx => q.options[idx]).join(', ') : 'Skipped';
           return \`
               <div class="study-card">
                   <div class="study-card-header">
                       <span class="topic-badge" data-topic="\${q.topic}">\${q.topic}</span>
                   </div>
                   <div class="study-question">\${q.text}</div>
                   <div style="color:var(--error); margin-bottom: 0.5rem">Your Answer: \${userAnsw}</div>
                   <div style="color:var(--success); font-weight:600">Correct: \${correctOpts}</div>
               </div>
           \`;
        }).join('');
        
        elements.incorrectReview.style.display = 'none'; // hide initially
        
        if(auto) alert("Time's up! Submitting exam.");
        
        elements.quizActive.classList.remove('active-view');
        elements.quizResults.classList.add('active-view');
    }

`;

scriptContent = scriptContent.substring(0, quizLogicStart) + newQuizLogic + scriptContent.substring(studyLogicStart);

// Update init
scriptContent = scriptContent.replace(`        try {
            const markdown = await fetchReadme();
            state.allQuestions = parseMarkdown(markdown);

            if (state.allQuestions.length === 0) {
                console.error("No questions found. Check parser or README structure.");
                elements.loading.innerHTML = "<p>Error: No questions found in README.md</p>";
                return;
            }

            console.log(\`Loaded \${state.allQuestions.length} questions.\`);

            // Randomize questions for the quiz ONLY
            // We keep the original order for the Study Mode and Cheat Sheet generally,
            // but the previous implementation shuffled the same array. 
            // To be consistent with "Mock Exam" flavor, let's just use one array for now.
            // If the user wants consistent study mode, we should really clone it.
            // But usually random is fine for studying too.
            shuffleArray(state.allQuestions);

            elements.loading.style.display = 'none';
            renderQuiz();
            renderStudyMode();
            renderCheatSheet();
            setupEventListeners();
        } catch (error) {`, `        try {
            const markdown = await fetchReadme();
            state.allQuestions = parseMarkdown(markdown);

            if (state.allQuestions.length === 0) {
                console.error("No questions found. Check parser or README structure.");
                elements.loading.innerHTML = "<p>Error: No questions found in README.md</p>";
                return;
            }

            console.log(\`Loaded \${state.allQuestions.length} questions.\`);

            elements.loading.style.display = 'none';
            renderSetupTopics();
            renderStudyMode();
            renderCheatSheet();
            setupEventListeners();
        } catch (error) {`);

// Update Event Listeners block
let eventListenersStr = scriptContent.substring(scriptContent.indexOf('    // --- Event Listeners ---'));
// Remove the old quiz navigation block
eventListenersStr = eventListenersStr.replace(`        // Quiz Navigation
        elements.nextBtn.addEventListener('click', () => {
            if (state.currentQuestionIndex < state.allQuestions.length - 1) {
                state.currentQuestionIndex++;
                renderQuiz();
            }
        });

        elements.prevBtn.addEventListener('click', () => {
            if (state.currentQuestionIndex > 0) {
                state.currentQuestionIndex--;
                renderQuiz();
            }
        });

        elements.resetBtn.addEventListener('click', () => {
            if (confirm('Restart the quiz? Score will be reset.')) {
                state.currentQuestionIndex = 0;
                state.score = 0;
                state.userAnswers = {};
                shuffleArray(state.allQuestions);
                renderQuiz();
            }
        });`, `        // Setup & Results Navigation
        elements.selectAllTopicsBtn.addEventListener('click', () => {
            const boxes = elements.setupTopics.querySelectorAll('input[type="checkbox"]');
            const allChecked = Array.from(boxes).every(b => b.checked);
            boxes.forEach(b => b.checked = !allChecked);
        });

        elements.startExamBtn.addEventListener('click', startMockExam);

        elements.newExamBtn.addEventListener('click', () => {
            elements.quizResults.classList.remove('active-view');
            elements.quizSetup.classList.add('active-view');
        });

        elements.reviewAnswersBtn.addEventListener('click', () => {
            elements.incorrectReview.style.display = 'block';
            elements.reviewAnswersBtn.style.display = 'none';
        });

        // Quiz Navigation
        elements.nextBtn.addEventListener('click', () => {
            if (state.currentQuestionIndex < state.quizQuestions.length - 1) {
                state.currentQuestionIndex++;
                renderQuiz();
            } else {
                if(confirm("Submit Mock Exam?")) {
                    finishExam();
                }
            }
        });

        elements.prevBtn.addEventListener('click', () => {
            if (state.currentQuestionIndex > 0) {
                state.currentQuestionIndex--;
                renderQuiz();
            }
        });

        elements.resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to quit the exam?')) {
                if(state.timerInterval) clearInterval(state.timerInterval);
                elements.quizActive.classList.remove('active-view');
                elements.quizSetup.classList.add('active-view');
            }
        });`);

scriptContent = scriptContent.substring(0, scriptContent.indexOf('    // --- Event Listeners ---')) + eventListenersStr;

fs.writeFileSync('script.js', scriptContent, 'utf8');
console.log('Script updated.');
