document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
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
    };

    // DOM Elements
    const elements = {
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
        scoreCircle: document.querySelector('.score-circle'),
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
    };

    // Initialization
    init();

    async function init() {
        try {
            const markdown = await fetchReadme();
            state.allQuestions = parseMarkdown(markdown);

            if (state.allQuestions.length === 0) {
                console.error("No questions found. Check parser or README structure.");
                elements.loading.innerHTML = "<p>Error: No questions found in README.md</p>";
                return;
            }

            console.log(`Loaded ${state.allQuestions.length} questions.`);

            elements.loading.style.display = 'none';
            renderSetupTopics();
            renderStudyMode();
            renderCheatSheet();
            setupEventListeners();
        } catch (error) {
            console.error('Initialization failed:', error);
            elements.loading.innerHTML = `<p>Error loading content: ${error.message}</p>`;
        }
    }

    async function fetchReadme() {
        const response = await fetch('README.md');
        if (!response.ok) throw new Error('Failed to fetch README.md');
        return await response.text();
    }

    function assignTopic(q) {
        const txt = (q.text + " " + q.options.join(" ")).toLowerCase();

        if (txt.includes('ec2') || txt.includes('lambda') || txt.includes('ecs') || txt.includes('elastic beanstalk') || txt.includes('compute') || txt.includes('auto scaling')) return 'Compute';
        if (txt.includes('s3') || txt.includes('ebs') || txt.includes('storage') || txt.includes('glacier') || txt.includes('efs') || txt.includes('snowball') || txt.includes('fsx')) return 'Storage';
        if (txt.includes('rds') || txt.includes('dynamodb') || txt.includes('aurora') || txt.includes('database') || txt.includes('redshift') || txt.includes('elasticache')) return 'Database';
        if (txt.includes('vpc') || txt.includes('route 53') || txt.includes('cloudfront') || txt.includes('network') || txt.includes('direct connect') || txt.includes('api gateway')) return 'Networking';
        if (txt.includes('iam') || txt.includes('security') || txt.includes('kms') || txt.includes('waf') || txt.includes('shield') || txt.includes('macie') || txt.includes('inspector') || txt.includes('guardduty') || txt.includes('vulnerabilities') || txt.includes('compliance') || txt.includes('artifact') || txt.includes('cognito') || txt.includes('certificate manager') || txt.includes('ddos')) return 'Security';
        if (txt.includes('cloudwatch') || txt.includes('cloudtrail') || txt.includes('config') || txt.includes('trusted advisor') || txt.includes('organizations') || txt.includes('management') || txt.includes('governance') || txt.includes('systems manager') || txt.includes('control tower') || txt.includes('service catalog') || txt.includes('personal health dashboard') || txt.includes('audit')) return 'Management';
        if (txt.includes('cost') || txt.includes('pricing') || txt.includes('billing') || txt.includes('tco') || txt.includes('budget') || txt.includes('capex') || txt.includes('opex') || txt.includes('spend') || txt.includes('savings plan') || txt.includes('reserved instance') || txt.includes('spot instance')) return 'Billing & Pricing';
        if (txt.includes('region') || txt.includes('availability zone') || txt.includes('edge location') || txt.includes('global infrastructure')) return 'Global Infrastructure';
        if (txt.includes('support') || txt.includes('concierge') || txt.includes('technical account manager') || txt.includes('tam') || txt.includes('enterprise support')) return 'Support Services';
        if (txt.includes('migration') || txt.includes('snowball') || txt.includes('snowmobile') || txt.includes('dms') || txt.includes('server migration')) return 'Migration & Transfer';
        if (txt.includes('machine learning') || txt.includes('sagemaker') || txt.includes('rekognition') || txt.includes('lex') || txt.includes('polly') || txt.includes('comprehend')) return 'Machine Learning';
        if (txt.includes('analytics') || txt.includes('athena') || txt.includes('emr') || txt.includes('kinesis') || txt.includes('quicksight') || txt.includes('glue')) return 'Analytics';
        if (txt.includes('developer') || txt.includes('codecommit') || txt.includes('codebuild') || txt.includes('codedeploy') || txt.includes('codepipeline') || txt.includes('cloud9') || txt.includes('x-ray')) return 'Developer Tools';
        if (txt.includes('app integration') || txt.includes('sqs') || txt.includes('sns') || txt.includes('step functions') || txt.includes('eventbridge')) return 'App Integration';

        return 'Cloud Concepts';
    }

    function parseMarkdown(text) {
        const questions = [];
        const lines = text.split('\n');
        let currentQuestion = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('### ')) {
                if (currentQuestion && currentQuestion.options.length > 0) {
                    currentQuestion.topic = assignTopic(currentQuestion);
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
            currentQuestion.topic = assignTopic(currentQuestion);
            questions.push(currentQuestion);
        }

        return questions;
    }

    // --- Quiz Setup & Execution ---

    function renderSetupTopics() {
        // Extract unique topics
        const topics = [...new Set(state.allQuestions.map(q => q.topic))].sort();

        let html = '';
        topics.forEach(t => {
            html += `<label><input type="checkbox" name="topicFilters" value="${t}" checked> ${t}</label>`;
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
        if (state.timerInterval) clearInterval(state.timerInterval);
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
        elements.timerDisplay.textContent = `${m}:${s}`;

        if (state.timeRemaining < 300) {
            elements.timerDisplay.style.backgroundColor = 'var(--error)';
        } else {
            elements.timerDisplay.style.backgroundColor = 'var(--aws-blue)';
        }
    }

    function renderQuiz() {
        const q = state.quizQuestions[state.currentQuestionIndex];
        const currentAnswers = state.userAnswers[state.currentQuestionIndex] || [];
        const isFullyAnswered = currentAnswers.length === q.answerIndices.length;

        let optionsHtml = '';
        q.options.forEach((opt, idx) => {
            let className = 'option-btn';
            const userSelected = currentAnswers.includes(idx);

            if (state.examMode === 'practice') {
                if (isFullyAnswered) {
                    const isCorrect = q.answerIndices.includes(idx);
                    if (isCorrect) className += ' correct';
                    else if (userSelected) className += ' incorrect';
                    else className += ' disabled';
                } else {
                    if (userSelected) className += ' selected';
                }
            } else {
                if (userSelected) className += ' selected';
            }

            const disabledAttr = (state.examMode === 'practice' && isFullyAnswered) ? 'disabled' : '';

            optionsHtml += `<button class="${className}" data-index="${idx}" ${disabledAttr}>${opt}</button>`;
        });

        let feedbackHtml = '';
        if (isFullyAnswered && state.examMode === 'practice') {
            feedbackHtml = `<div style="margin-top:1rem; font-weight:600; color:${isCorrectAnswer() ? 'var(--success)' : 'var(--error)'}">${isCorrectAnswer() ? 'Correct!' : 'Incorrect'}</div>`;
        }

        const html = `
            <div class="quiz-card fade-in">
                <h3 class="question-text">${q.text}</h3>
                <div class="options-list">
                    ${optionsHtml}
                </div>
                ${feedbackHtml}
            </div>
        `;

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
                const q = state.quizQuestions[state.currentQuestionIndex];
                const currentArr = state.userAnswers[state.currentQuestionIndex] || [];

                if (state.examMode === 'practice' && currentArr.length === q.answerIndices.length) return;

                const selectedIdx = parseInt(e.target.dataset.index);

                if (q.answerIndices.length > 1) {
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
        elements.questionCount.textContent = `Question ${state.currentQuestionIndex + 1}/${state.quizQuestions.length}`;

        const progress = ((state.currentQuestionIndex + 1) / state.quizQuestions.length) * 100;
        elements.quizProgress.style.width = `${progress}%`;

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
        if (state.timerInterval) clearInterval(state.timerInterval);

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
        elements.finalScorePct.textContent = `${pct}%`;
        elements.finalScoreText.textContent = `You scored ${state.score} out of ${state.quizQuestions.length}`;

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
                .sort((a, b) => b[1] - a[1])
                .map(([topic, errors]) => `<span class="topic-badge" data-topic="${topic}">${topic} (${errors} wrong)</span>`)
                .join('');
        } else {
            elements.weakTopics.innerHTML = "<em>None! You aced it!</em>";
        }

        // Render Incorrect Reviews
        elements.incorrectList.innerHTML = incorrectIndices.map(i => {
            const q = state.quizQuestions[i];
            const correctOpts = q.options.filter((_, idx) => q.answerIndices.includes(idx)).join(', ');
            const userAnsw = state.userAnswers[i] ? state.userAnswers[i].map(idx => q.options[idx]).join(', ') : 'Skipped';
            return `
               <div class="study-card">
                   <div class="study-card-header">
                       <span class="topic-badge" data-topic="${q.topic}">${q.topic}</span>
                   </div>
                   <div class="study-question">${q.text}</div>
                   <div style="color:var(--error); margin-bottom: 0.5rem">Your Answer: ${userAnsw}</div>
                   <div style="color:var(--success); font-weight:600">Correct: ${correctOpts}</div>
               </div>
           `;
        }).join('');

        elements.incorrectReview.style.display = 'none'; // hide initially

        if (auto) alert("Time's up! Submitting exam.");

        elements.quizActive.classList.remove('active-view');
        elements.quizResults.classList.add('active-view');
    }

    // --- Study Mode Logic (With Pagination) ---

    function renderStudyMode() {
        const searchTerm = elements.studySearch.value.toLowerCase();
        const filtered = state.allQuestions.filter(q => q.text.toLowerCase().includes(searchTerm));

        const totalPages = Math.ceil(filtered.length / state.itemsPerPage);

        // Ensure page is within bounds
        if (state.studyPage > totalPages) state.studyPage = totalPages || 1;
        if (state.studyPage < 1) state.studyPage = 1;

        const startIdx = (state.studyPage - 1) * state.itemsPerPage;
        const endIdx = startIdx + state.itemsPerPage;
        const questionsToRender = filtered.slice(startIdx, endIdx);

        // Update DOM
        if (questionsToRender.length === 0) {
            elements.studyList.innerHTML = `<div style="text-align:center; padding:1rem; color: #666;">No questions found matching "${searchTerm}"</div>`;
        } else {
            elements.studyList.innerHTML = questionsToRender.map((q, idx) => {
                const correctOpts = q.options.filter((_, i) => q.answerIndices.includes(i));

                return `
                    <div class="study-card">
                        <div class="study-card-header">
                            <span class="topic-badge" data-topic="${q.topic}">${q.topic}</span>
                        </div>
                        <div class="study-question">${q.text}</div>
                        <ul class="study-options">
                            ${q.options.map(opt => `<li>${opt}</li>`).join('')}
                        </ul>
                        <button class="reveal-btn" onclick="this.nextElementSibling.classList.toggle('visible')">
                            Show Answer
                        </button>
                        <div class="answer-reveal">
                            Correct: ${correctOpts.join(', ')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Update Pagination Controls
        elements.studyPageInfo.textContent = `Page ${state.studyPage} of ${totalPages || 1}`;
        elements.studyPrevBtn.disabled = state.studyPage === 1;
        elements.studyNextBtn.disabled = state.studyPage === totalPages || totalPages === 0;
    }

    // --- Cheat Sheet Logic ---

    function renderCheatSheet() {
        const searchTerm = elements.csSearch.value.toLowerCase();

        const filtered = state.allQuestions.filter(q => {
            const combinedText = (q.text + ' ' + q.options.join(' ')).toLowerCase();
            return combinedText.includes(searchTerm);
        });

        if (filtered.length === 0) {
            elements.csBody.innerHTML = '<tr><td colspan="3" style="text-align:center">No matches found</td></tr>';
            return;
        }

        // Group by topic
        const grouped = {};
        for (const q of filtered) {
            if (!grouped[q.topic]) grouped[q.topic] = [];
            grouped[q.topic].push(q);
        }

        // Sort topics alphabetically
        const sortedTopics = Object.keys(grouped).sort();

        let rowsHtml = '';
        for (const topic of sortedTopics) {
            // Add a section header row for the topic
            rowsHtml += `
                <tr class="topic-header-row">
                    <td colspan="3" class="topic-header-cell">
                        <div class="topic-header-content">
                            <span class="topic-icon">📚</span>
                            ${topic}
                        </div>
                    </td>
                </tr>
            `;

            // Add question rows
            rowsHtml += grouped[topic].map((q, idx) => {
                const correctAnswers = q.answerIndices.map(i => q.options[i]).join('<br><br>');
                return `
                    <tr>
                        <td class="cs-topic-badge"><span class="table-badge" data-topic="${q.topic}">${q.topic}</span></td>
                        <td class="cs-key">${q.text}</td>
                        <td class="cs-val">${correctAnswers}</td>
                    </tr>
                `;
            }).join('');
        }

        elements.csBody.innerHTML = rowsHtml;
    }

    // --- Event Listeners ---

    function setupEventListeners() {
        // Tab switching
        elements.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.navBtns.forEach(b => b.classList.remove('active'));
                elements.tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });

        // Setup & Results Navigation
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
                if (confirm("Submit Mock Exam?")) {
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
                if (state.timerInterval) clearInterval(state.timerInterval);
                elements.quizActive.classList.remove('active-view');
                elements.quizSetup.classList.add('active-view');
            }
        });

        // Study Search
        elements.studySearch.addEventListener('input', () => {
            state.studyPage = 1; // Reset to page 1 on search
            renderStudyMode();
        });

        // Study Pagination
        elements.studyPrevBtn.addEventListener('click', () => {
            if (state.studyPage > 1) {
                state.studyPage--;
                renderStudyMode();
                document.querySelector('main').scrollTop = 0; // Scroll to top
            }
        });

        elements.studyNextBtn.addEventListener('click', () => {
            state.studyPage++;
            renderStudyMode();
            document.querySelector('main').scrollTop = 0; // Scroll to top
        });

        // Cheat Sheet Search
        elements.csSearch.addEventListener('input', () => {
            renderCheatSheet();
        });

        // PDF Download
        elements.downloadPdfBtn.addEventListener('click', () => {
            // Clone the table to avoid modifying the live view and to ensure clean rendering
            const originalTable = document.getElementById('cheat-sheet-table');
            const cloneDiv = document.createElement('div');
            const cloneTable = originalTable.cloneNode(true);

            // Setup a temporary container for valid rendering
            cloneDiv.style.position = 'absolute';
            cloneDiv.style.top = '-9999px';
            cloneDiv.style.left = '0';
            cloneDiv.style.width = '100%'; // Ensure full width
            cloneDiv.style.background = 'white';
            cloneDiv.style.color = 'black'; // Force black text
            cloneDiv.appendChild(cloneTable);
            document.body.appendChild(cloneDiv);

            // Options optimized for large content
            const opt = {
                margin: [0.5, 0.5],
                filename: 'aws-exam-cues.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 1.5, // Reduced scale to prevent canvas size limit errors
                    useCORS: true,
                    scrollY: 0,
                    windowWidth: 1000 // Force width
                },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                pagebreak: { mode: 'css', avoid: 'tr' } // Avoid breaking inside rows
            };

            // Adjust styles on the clone
            cloneTable.style.fontSize = "10px";
            const ths = cloneTable.querySelectorAll('th');
            ths.forEach(th => th.style.backgroundColor = '#3E5164'); // Ensure header color persists
            ths.forEach(th => th.style.color = 'white');

            elements.downloadPdfBtn.innerText = 'Generating...';
            elements.downloadPdfBtn.disabled = true;

            html2pdf().set(opt).from(cloneDiv).save().then(() => {
                document.body.removeChild(cloneDiv);
                elements.downloadPdfBtn.innerHTML = '<span>📥</span> Download PDF';
                elements.downloadPdfBtn.disabled = false;
            }).catch(err => {
                console.error("PDF Generation Error:", err);
                document.body.removeChild(cloneDiv);
                elements.downloadPdfBtn.innerHTML = '<span>⚠️</span> Error';
                elements.downloadPdfBtn.disabled = false;
                alert('Failed to generate PDF. The list might be too long for the browser to render at once.');
            });
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});
