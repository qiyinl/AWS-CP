// Utility function for shuffling arrays
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Shuffle a question's options while remapping the correct-answer indices
function shuffleQuestionOptions(q) {
  const pairs = q.options.map((opt, idx) => ({
    text: opt,
    isCorrect: q.answerIndices.includes(idx),
  }))
  const shuffled = shuffleArray(pairs)
  const answerIndices = []
  shuffled.forEach((p, idx) => {
    if (p.isCorrect) answerIndices.push(idx)
  })
  return {
    ...q,
    options: shuffled.map((p) => p.text),
    answerIndices,
  }
}

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
    itemsPerPage: 10,
  }

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
    downloadPdfBtn: document.getElementById('download-pdf'),
  }

  // Initialization
  init()

  async function init() {
    try {
      const markdown = await fetchReadme()
      state.allQuestions = parseMarkdown(markdown)

      if (state.allQuestions.length === 0) {
        console.error('No questions found. Check parser or README structure.')
        elements.loading.innerHTML =
          '<p>Error: No questions found in README.md</p>'
        return
      }

      console.log(`Loaded ${state.allQuestions.length} questions.`)

      elements.loading.style.display = 'none'
      renderSetupTopics()
      renderStudyMode()
      renderCheatSheet()
      setupEventListeners()
    } catch (error) {
      console.error('Initialization failed:', error)
      elements.loading.innerHTML = `<p>Error loading content: ${error.message}</p>`
    }
  }

  async function fetchReadme() {
    const response = await fetch('README.md')
    if (!response.ok) throw new Error('Failed to fetch README.md')
    return await response.text()
  }

  function assignTopic(q) {
    const txt = (q.text + ' ' + q.options.join(' ')).toLowerCase()

    if (
      txt.includes('ec2') ||
      txt.includes('lambda') ||
      txt.includes('ecs') ||
      txt.includes('elastic beanstalk') ||
      txt.includes('compute') ||
      txt.includes('auto scaling')
    )
      return 'Compute'
    if (
      txt.includes('s3') ||
      txt.includes('ebs') ||
      txt.includes('storage') ||
      txt.includes('glacier') ||
      txt.includes('efs') ||
      txt.includes('snowball') ||
      txt.includes('fsx')
    )
      return 'Storage'
    if (
      txt.includes('rds') ||
      txt.includes('dynamodb') ||
      txt.includes('aurora') ||
      txt.includes('database') ||
      txt.includes('redshift') ||
      txt.includes('elasticache')
    )
      return 'Database'
    if (
      txt.includes('vpc') ||
      txt.includes('route 53') ||
      txt.includes('cloudfront') ||
      txt.includes('network') ||
      txt.includes('direct connect') ||
      txt.includes('api gateway')
    )
      return 'Networking'
    if (
      txt.includes('iam') ||
      txt.includes('security') ||
      txt.includes('kms') ||
      txt.includes('waf') ||
      txt.includes('shield') ||
      txt.includes('macie') ||
      txt.includes('inspector') ||
      txt.includes('guardduty') ||
      txt.includes('vulnerabilities') ||
      txt.includes('compliance') ||
      txt.includes('artifact') ||
      txt.includes('cognito') ||
      txt.includes('certificate manager') ||
      txt.includes('ddos')
    )
      return 'Security'
    if (
      txt.includes('cloudwatch') ||
      txt.includes('cloudtrail') ||
      txt.includes('config') ||
      txt.includes('trusted advisor') ||
      txt.includes('organizations') ||
      txt.includes('management') ||
      txt.includes('governance') ||
      txt.includes('systems manager') ||
      txt.includes('control tower') ||
      txt.includes('service catalog') ||
      txt.includes('personal health dashboard') ||
      txt.includes('audit')
    )
      return 'Management'
    if (
      txt.includes('cost') ||
      txt.includes('pricing') ||
      txt.includes('billing') ||
      txt.includes('tco') ||
      txt.includes('budget') ||
      txt.includes('capex') ||
      txt.includes('opex') ||
      txt.includes('spend') ||
      txt.includes('savings plan') ||
      txt.includes('reserved instance') ||
      txt.includes('spot instance')
    )
      return 'Billing & Pricing'
    if (
      txt.includes('region') ||
      txt.includes('availability zone') ||
      txt.includes('edge location') ||
      txt.includes('global infrastructure')
    )
      return 'Global Infrastructure'
    if (
      txt.includes('support') ||
      txt.includes('concierge') ||
      txt.includes('technical account manager') ||
      txt.includes('tam') ||
      txt.includes('enterprise support')
    )
      return 'Support Services'
    if (
      txt.includes('migration') ||
      txt.includes('snowball') ||
      txt.includes('snowmobile') ||
      txt.includes('dms') ||
      txt.includes('server migration')
    )
      return 'Migration & Transfer'
    if (
      txt.includes('machine learning') ||
      txt.includes('sagemaker') ||
      txt.includes('rekognition') ||
      txt.includes('lex') ||
      txt.includes('polly') ||
      txt.includes('comprehend')
    )
      return 'Machine Learning'
    if (
      txt.includes('analytics') ||
      txt.includes('athena') ||
      txt.includes('emr') ||
      txt.includes('kinesis') ||
      txt.includes('quicksight') ||
      txt.includes('glue')
    )
      return 'Analytics'
    if (
      txt.includes('developer') ||
      txt.includes('codecommit') ||
      txt.includes('codebuild') ||
      txt.includes('codedeploy') ||
      txt.includes('codepipeline') ||
      txt.includes('cloud9') ||
      txt.includes('x-ray')
    )
      return 'Developer Tools'
    if (
      txt.includes('app integration') ||
      txt.includes('sqs') ||
      txt.includes('sns') ||
      txt.includes('step functions') ||
      txt.includes('eventbridge')
    )
      return 'App Integration'

    return 'Cloud Concepts'
  }

  function parseMarkdown(text) {
    const questions = []
    const lines = text.split('\n')
    let currentQuestion = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line.startsWith('### ')) {
        if (currentQuestion && currentQuestion.options.length > 0) {
          currentQuestion.topic = assignTopic(currentQuestion)
          questions.push(currentQuestion)
        }

        currentQuestion = {
          text: line.replace(/^###\s+/, ''),
          options: [],
          answerIndices: [],
        }
      } else if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
        if (currentQuestion) {
          const isCorrect = line.startsWith('- [x]')
          const optionText = line.replace(/^- \[[ x]\]\s+/, '')

          currentQuestion.options.push(optionText)
          if (isCorrect) {
            currentQuestion.answerIndices.push(
              currentQuestion.options.length - 1,
            )
          }
        }
      }
    }

    if (currentQuestion && currentQuestion.options.length > 0) {
      currentQuestion.topic = assignTopic(currentQuestion)
      questions.push(currentQuestion)
    }

    return questions
  }

  // --- Quiz Setup & Execution ---

  function renderSetupTopics() {
    // Extract unique topics
    const topics = [...new Set(state.allQuestions.map((q) => q.topic))].sort()

    let html = ''
    topics.forEach((t) => {
      html += `<label><input type="checkbox" name="topicFilters" value="${t}" checked> ${t}</label>`
    })
    elements.setupTopics.innerHTML = html
  }

  function startMockExam() {
    // Gather settings
    const qCountVal = document.querySelector(
      'input[name="qCount"]:checked',
    ).value
    state.examMode = document.querySelector(
      'input[name="examMode"]:checked',
    ).value

    const selectedTopics = Array.from(
      document.querySelectorAll('input[name="topicFilters"]:checked'),
    ).map((cb) => cb.value)

    if (selectedTopics.length === 0) {
      alert('Please select at least one topic.')
      return
    }

    // Filter and shuffle
    let pool = state.allQuestions.filter((q) =>
      selectedTopics.includes(q.topic),
    )
    pool = shuffleArray(pool)

    const count =
      qCountVal === 'all'
        ? pool.length
        : Math.min(parseInt(qCountVal), pool.length)
    state.quizQuestions = pool.slice(0, count).map(shuffleQuestionOptions)

    if (state.quizQuestions.length === 0) {
      alert('No questions found for the selected criteria.')
      return
    }

    // Reset state
    state.currentQuestionIndex = 0
    state.score = 0
    state.userAnswers = {}

    // Timer Setup
    if (state.timerInterval) clearInterval(state.timerInterval)
    if (state.examMode === 'exam') {
      // Roughly 1.38 mins per question like real AWS exam (90 mins for 65 qs)
      state.timeRemaining = Math.ceil(state.quizQuestions.length * 1.38 * 60)
      elements.timerDisplay.style.display = 'inline-block'
      updateTimerDisplay()
      state.timerInterval = setInterval(() => {
        state.timeRemaining--
        updateTimerDisplay()
        if (state.timeRemaining <= 0) {
          clearInterval(state.timerInterval)
          finishExam(true) // Auto finish
        }
      }, 1000)
    } else {
      elements.timerDisplay.style.display = 'none'
    }

    // UI Transition
    elements.quizSetup.classList.remove('active-view')
    elements.quizResults.classList.remove('active-view')
    elements.quizActive.classList.add('active-view')

    renderQuiz()
  }

  function updateTimerDisplay() {
    const m = Math.floor(state.timeRemaining / 60)
      .toString()
      .padStart(2, '0')
    const s = (state.timeRemaining % 60).toString().padStart(2, '0')
    elements.timerDisplay.textContent = `${m}:${s}`

    if (state.timeRemaining < 300) {
      elements.timerDisplay.style.backgroundColor = 'var(--error)'
    } else {
      elements.timerDisplay.style.backgroundColor = 'var(--aws-blue)'
    }
  }

  function renderQuiz() {
    const q = state.quizQuestions[state.currentQuestionIndex]
    const currentAnswers = state.userAnswers[state.currentQuestionIndex] || []
    const isFullyAnswered = currentAnswers.length === q.answerIndices.length

    let optionsHtml = ''
    q.options.forEach((opt, idx) => {
      let className = 'option-btn'
      const userSelected = currentAnswers.includes(idx)

      if (state.examMode === 'practice') {
        if (isFullyAnswered) {
          const isCorrect = q.answerIndices.includes(idx)
          if (isCorrect) className += ' correct'
          else if (userSelected) className += ' incorrect'
          else className += ' disabled'
        } else {
          if (userSelected) className += ' selected'
        }
      } else {
        if (userSelected) className += ' selected'
      }

      const disabledAttr =
        state.examMode === 'practice' && isFullyAnswered ? 'disabled' : ''

      optionsHtml += `<button class="${className}" data-index="${idx}" ${disabledAttr}>${opt}</button>`
    })

    let feedbackHtml = ''
    if (isFullyAnswered && state.examMode === 'practice') {
      feedbackHtml = `<div style="margin-top:1rem; font-weight:600; color:${isCorrectAnswer() ? 'var(--success)' : 'var(--error)'}">${isCorrectAnswer() ? 'Correct!' : 'Incorrect'}</div>`
    }

    const html = `
            <div class="quiz-card fade-in">
                <h3 class="question-text">${q.text}</h3>
                <div class="options-list">
                    ${optionsHtml}
                </div>
                ${feedbackHtml}
            </div>
        `

    elements.quizContainer.innerHTML = html
    updateStats()
    setupOptionListeners()
  }

  function isCorrectAnswer(qIndex = state.currentQuestionIndex) {
    const userSelected = state.userAnswers[qIndex] || []
    const correct = state.quizQuestions[qIndex].answerIndices

    if (userSelected.length !== correct.length) return false
    return (
      userSelected.every((val) => correct.includes(val)) &&
      correct.every((val) => userSelected.includes(val))
    )
  }

  function setupOptionListeners() {
    const optionBtns = elements.quizContainer.querySelectorAll('.option-btn')
    optionBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const q = state.quizQuestions[state.currentQuestionIndex]
        const currentArr = state.userAnswers[state.currentQuestionIndex] || []

        if (
          state.examMode === 'practice' &&
          currentArr.length === q.answerIndices.length
        )
          return

        const selectedIdx = parseInt(e.target.dataset.index)

        if (q.answerIndices.length > 1) {
          if (currentArr.includes(selectedIdx)) {
            state.userAnswers[state.currentQuestionIndex] = currentArr.filter(
              (i) => i !== selectedIdx,
            )
          } else if (currentArr.length < q.answerIndices.length) {
            state.userAnswers[state.currentQuestionIndex] = [
              ...currentArr,
              selectedIdx,
            ]
          }
        } else {
          state.userAnswers[state.currentQuestionIndex] = [selectedIdx]
        }

        renderQuiz()
      })
    })
  }

  function updateStats() {
    elements.questionCount.textContent = `Question ${state.currentQuestionIndex + 1}/${state.quizQuestions.length}`

    const progress =
      ((state.currentQuestionIndex + 1) / state.quizQuestions.length) * 100
    elements.quizProgress.style.width = `${progress}%`

    elements.prevBtn.disabled = state.currentQuestionIndex === 0

    if (state.currentQuestionIndex === state.quizQuestions.length - 1) {
      elements.nextBtn.textContent = 'Finish Exam'
      elements.nextBtn.classList.replace('primary-btn', 'danger-btn')
    } else {
      elements.nextBtn.textContent = 'Next'
      elements.nextBtn.classList.replace('danger-btn', 'primary-btn')
    }
  }

  function finishExam(auto = false) {
    if (state.timerInterval) clearInterval(state.timerInterval)

    // Calculate score
    state.score = 0
    const incorrectIndices = []
    const weakTopicsMap = {}

    for (let i = 0; i < state.quizQuestions.length; i++) {
      if (isCorrectAnswer(i)) {
        state.score++
      } else {
        incorrectIndices.push(i)
        const t = state.quizQuestions[i].topic
        weakTopicsMap[t] = (weakTopicsMap[t] || 0) + 1
      }
    }

    const pct = Math.round((state.score / state.quizQuestions.length) * 100)

    // Update DOM
    elements.finalScorePct.textContent = `${pct}%`
    elements.finalScoreText.textContent = `You scored ${state.score} out of ${state.quizQuestions.length}`

    if (pct >= 70) {
      elements.passFailBadge.textContent = 'PASS'
      elements.passFailBadge.className = 'result-badge pass'
      elements.scoreCircle.style?.setProperty('border-color', 'var(--success)')
    } else {
      elements.passFailBadge.textContent = 'FAIL'
      elements.passFailBadge.className = 'result-badge fail'
      elements.scoreCircle?.style?.setProperty('border-color', 'var(--error)')
    }

    // Render Weak Topics
    if (Object.keys(weakTopicsMap).length > 0) {
      elements.weakTopics.innerHTML = Object.entries(weakTopicsMap)
        .sort((a, b) => b[1] - a[1])
        .map(
          ([topic, errors]) =>
            `<span class="topic-badge" data-topic="${topic}">${topic} (${errors} wrong)</span>`,
        )
        .join('')
    } else {
      elements.weakTopics.innerHTML = '<em>None! You aced it!</em>'
    }

    // Render Incorrect Reviews
    elements.incorrectList.innerHTML = incorrectIndices
      .map((i) => {
        const q = state.quizQuestions[i]
        const correctOpts = q.options
          .filter((_, idx) => q.answerIndices.includes(idx))
          .join(', ')
        const userAnsw = state.userAnswers[i]
          ? state.userAnswers[i].map((idx) => q.options[idx]).join(', ')
          : 'Skipped'
        return `
               <div class="study-card">
                   <div class="study-card-header">
                       <span class="topic-badge" data-topic="${q.topic}">${q.topic}</span>
                   </div>
                   <div class="study-question">${q.text}</div>
                   <div style="color:var(--error); margin-bottom: 0.5rem">Your Answer: ${userAnsw}</div>
                   <div style="color:var(--success); font-weight:600">Correct: ${correctOpts}</div>
               </div>
           `
      })
      .join('')

    elements.incorrectReview.style.display = 'none' // hide initially

    if (auto) alert("Time's up! Submitting exam.")

    elements.quizActive.classList.remove('active-view')
    elements.quizResults.classList.add('active-view')
  }

  // --- Study Mode Logic (With Pagination) ---

  function renderStudyMode() {
    const searchTerm = elements.studySearch.value.toLowerCase()
    const filtered = state.allQuestions.filter((q) =>
      q.text.toLowerCase().includes(searchTerm),
    )

    const totalPages = Math.ceil(filtered.length / state.itemsPerPage)

    // Ensure page is within bounds
    if (state.studyPage > totalPages) state.studyPage = totalPages || 1
    if (state.studyPage < 1) state.studyPage = 1

    const startIdx = (state.studyPage - 1) * state.itemsPerPage
    const endIdx = startIdx + state.itemsPerPage
    const questionsToRender = filtered.slice(startIdx, endIdx)

    // Update DOM
    if (questionsToRender.length === 0) {
      elements.studyList.innerHTML = `<div style="text-align:center; padding:1rem; color: #666;">No questions found matching "${searchTerm}"</div>`
    } else {
      elements.studyList.innerHTML = questionsToRender
        .map((q, idx) => {
          const correctOpts = q.options.filter((_, i) =>
            q.answerIndices.includes(i),
          )

          return `
                    <div class="study-card">
                        <div class="study-card-header">
                            <span class="topic-badge" data-topic="${q.topic}">${q.topic}</span>
                        </div>
                        <div class="study-question">${q.text}</div>
                        <ul class="study-options">
                            ${q.options.map((opt) => `<li>${opt}</li>`).join('')}
                        </ul>
                        <button class="reveal-btn" onclick="this.nextElementSibling.classList.toggle('visible')">
                            Show Answer
                        </button>
                        <div class="answer-reveal">
                            Correct: ${correctOpts.join(', ')}
                        </div>
                    </div>
                `
        })
        .join('')
    }

    // Update Pagination Controls
    elements.studyPageInfo.textContent = `Page ${state.studyPage} of ${totalPages || 1}`
    elements.studyPrevBtn.disabled = state.studyPage === 1
    elements.studyNextBtn.disabled =
      state.studyPage === totalPages || totalPages === 0
  }

  // --- Cheat Sheet Logic ---

  function renderCheatSheet() {
    const searchTerm = elements.csSearch.value.toLowerCase()

    const filtered = state.allQuestions.filter((q) => {
      const combinedText = (q.text + ' ' + q.options.join(' ')).toLowerCase()
      return combinedText.includes(searchTerm)
    })

    if (filtered.length === 0) {
      elements.csBody.innerHTML =
        '<tr><td colspan="3" style="text-align:center">No matches found</td></tr>'
      return
    }

    // Group by topic
    const grouped = {}
    for (const q of filtered) {
      if (!grouped[q.topic]) grouped[q.topic] = []
      grouped[q.topic].push(q)
    }

    // Sort topics alphabetically
    const sortedTopics = Object.keys(grouped).sort()

    let rowsHtml = ''
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
            `

      // Add question rows
      rowsHtml += grouped[topic]
        .map((q, idx) => {
          const correctAnswers = q.answerIndices
            .map((i) => q.options[i])
            .join('<br><br>')
          return `
                    <tr>
                        <td class="cs-topic-badge"><span class="table-badge" data-topic="${q.topic}">${q.topic}</span></td>
                        <td class="cs-key">${q.text}</td>
                        <td class="cs-val">${correctAnswers}</td>
                    </tr>
                `
        })
        .join('')
    }

    elements.csBody.innerHTML = rowsHtml
  }

  // --- Event Listeners ---

  function setupEventListeners() {
    // Tab switching
    elements.navBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        elements.navBtns.forEach((b) => b.classList.remove('active'))
        elements.tabContents.forEach((c) => c.classList.remove('active'))

        btn.classList.add('active')
        document.getElementById(btn.dataset.tab).classList.add('active')
      })
    })

    // Setup & Results Navigation
    elements.selectAllTopicsBtn.addEventListener('click', () => {
      const boxes = elements.setupTopics.querySelectorAll(
        'input[type="checkbox"]',
      )
      const allChecked = Array.from(boxes).every((b) => b.checked)
      boxes.forEach((b) => (b.checked = !allChecked))
    })

    elements.startExamBtn.addEventListener('click', startMockExam)

    elements.newExamBtn.addEventListener('click', () => {
      elements.quizResults.classList.remove('active-view')
      elements.quizSetup.classList.add('active-view')
    })

    elements.reviewAnswersBtn.addEventListener('click', () => {
      elements.incorrectReview.style.display = 'block'
      elements.reviewAnswersBtn.style.display = 'none'
    })

    // Quiz Navigation
    elements.nextBtn.addEventListener('click', () => {
      if (state.currentQuestionIndex < state.quizQuestions.length - 1) {
        state.currentQuestionIndex++
        renderQuiz()
      } else {
        if (confirm('Submit Mock Exam?')) {
          finishExam()
        }
      }
    })

    elements.prevBtn.addEventListener('click', () => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--
        renderQuiz()
      }
    })

    elements.resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to quit the exam?')) {
        if (state.timerInterval) clearInterval(state.timerInterval)
        elements.quizActive.classList.remove('active-view')
        elements.quizSetup.classList.add('active-view')
      }
    })

    // Study Search
    elements.studySearch.addEventListener('input', () => {
      state.studyPage = 1 // Reset to page 1 on search
      renderStudyMode()
    })

    // Study Pagination
    elements.studyPrevBtn.addEventListener('click', () => {
      if (state.studyPage > 1) {
        state.studyPage--
        renderStudyMode()
        document.querySelector('main').scrollTop = 0 // Scroll to top
      }
    })

    elements.studyNextBtn.addEventListener('click', () => {
      state.studyPage++
      renderStudyMode()
      document.querySelector('main').scrollTop = 0 // Scroll to top
    })

    // Cheat Sheet Search
    elements.csSearch.addEventListener('input', () => {
      renderCheatSheet()
    })

    // PDF Download
    elements.downloadPdfBtn.addEventListener('click', () => {
      // Clone the table to avoid modifying the live view and to ensure clean rendering
      const originalTable = document.getElementById('cheat-sheet-table')
      const cloneDiv = document.createElement('div')
      const cloneTable = originalTable.cloneNode(true)

      // Setup a temporary container for valid rendering
      cloneDiv.style.position = 'absolute'
      cloneDiv.style.top = '-9999px'
      cloneDiv.style.left = '0'
      cloneDiv.style.width = '100%' // Ensure full width
      cloneDiv.style.background = 'white'
      cloneDiv.style.color = 'black' // Force black text
      cloneDiv.appendChild(cloneTable)
      document.body.appendChild(cloneDiv)

      // Options optimized for large content
      const opt = {
        margin: [0.5, 0.5],
        filename: 'aws-exam-cues.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 1.5, // Reduced scale to prevent canvas size limit errors
          useCORS: true,
          scrollY: 0,
          windowWidth: 1000, // Force width
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: 'css', avoid: 'tr' }, // Avoid breaking inside rows
      }

      // Adjust styles on the clone
      cloneTable.style.fontSize = '10px'
      const ths = cloneTable.querySelectorAll('th')
      ths.forEach((th) => (th.style.backgroundColor = '#3E5164')) // Ensure header color persists
      ths.forEach((th) => (th.style.color = 'white'))

      elements.downloadPdfBtn.innerText = 'Generating...'
      elements.downloadPdfBtn.disabled = true

      html2pdf()
        .set(opt)
        .from(cloneDiv)
        .save()
        .then(() => {
          document.body.removeChild(cloneDiv)
          elements.downloadPdfBtn.innerHTML = '<span>📥</span> Download PDF'
          elements.downloadPdfBtn.disabled = false
        })
        .catch((err) => {
          console.error('PDF Generation Error:', err)
          document.body.removeChild(cloneDiv)
          elements.downloadPdfBtn.innerHTML = '<span>⚠️</span> Error'
          elements.downloadPdfBtn.disabled = false
          alert(
            'Failed to generate PDF. The list might be too long for the browser to render at once.',
          )
        })
    })
  }
})

// ============================================
// FLASHCARDS FUNCTIONALITY
// ============================================
const flashcardsState = {
  currentUnit: 'all',
  currentIndex: 0,
  cards: [],
  known: new Set(JSON.parse(localStorage.getItem('flashcards_known') || '[]')),
  learning: new Set(
    JSON.parse(localStorage.getItem('flashcards_learning') || '[]'),
  ),
}

function initFlashcards() {
  if (typeof flashcardsData === 'undefined') return

  renderFlashcardsUnitSelector()
  filterFlashcards()
  showFlashcard()
  setupFlashcardsListeners()
}

function renderFlashcardsUnitSelector() {
  const container = document.getElementById('flashcards-unit-selector')
  if (!container) return

  const units = ['all', ...new Set(flashcardsData.map((c) => c.unit))]
  container.innerHTML = units
    .map(
      (unit) => `
        <button class="secondary-btn ${unit === 'all' ? 'active' : ''}" data-unit="${unit}" style="border: 2px solid var(--aws-light-blue); ${unit === 'all' ? 'background: var(--aws-orange); color: var(--aws-blue); border-color: var(--aws-orange);' : ''}">
            ${unit === 'all' ? '📚 All' : unit}
        </button>
    `,
    )
    .join('')
}

function filterFlashcards() {
  if (flashcardsState.currentUnit === 'all') {
    flashcardsState.cards = [...flashcardsData]
  } else {
    flashcardsState.cards = flashcardsData.filter(
      (c) => c.unit === flashcardsState.currentUnit,
    )
  }
  flashcardsState.currentIndex = 0
  document.getElementById('flashcard-total').textContent =
    flashcardsState.cards.length
  updateFlashcardsStats()
}

function showFlashcard() {
  if (flashcardsState.cards.length === 0) return

  const card = flashcardsState.cards[flashcardsState.currentIndex]
  const flashcard = document.getElementById('flashcard')

  // Check if card is flipped (showing answer)
  const isFlipped = flashcard.style.transform === 'rotateY(180deg)'

  if (isFlipped) {
    // Unflip first, then update content after animation
    flashcard.style.transform = 'rotateY(0deg)'
    setTimeout(() => {
      updateFlashcardContent(card)
    }, 600)
  } else {
    updateFlashcardContent(card)
  }
}

function updateFlashcardContent(card) {
  document.getElementById('flashcard-keyword').textContent = card.keyword
  document.getElementById('flashcard-hint').textContent = card.hint || ''
  document.getElementById('flashcard-service').textContent = card.service
  document.getElementById('flashcard-description').textContent =
    card.description

  document.getElementById('flashcard-current').textContent =
    flashcardsState.currentIndex + 1
  const progress =
    ((flashcardsState.currentIndex + 1) / flashcardsState.cards.length) * 100
  document.getElementById('flashcard-progress').style.width = `${progress}%`

  // Update button states
  const backBtn = document.getElementById('flashcard-back')
  const nextBtn = document.getElementById('flashcard-next')

  if (backBtn) {
    backBtn.disabled = flashcardsState.currentIndex === 0
  }

  if (nextBtn) {
    nextBtn.disabled = flashcardsState.currentIndex === flashcardsState.cards.length - 1
  }
}

function updateFlashcardsStats() {
  const cardIds = flashcardsState.cards.map(
    (_, idx) => `${flashcardsState.currentUnit}-${idx}`,
  )
  const known = cardIds.filter((id) => flashcardsState.known.has(id)).length
  const learning = cardIds.filter((id) =>
    flashcardsState.learning.has(id),
  ).length
  const remaining = flashcardsState.cards.length - known - learning

  document.getElementById('flashcard-known').textContent = known
  document.getElementById('flashcard-learning-count').textContent = learning
  document.getElementById('flashcard-remaining').textContent = remaining
}

function nextFlashcard() {
  flashcardsState.currentIndex =
    (flashcardsState.currentIndex + 1) % flashcardsState.cards.length
  showFlashcard()
}

function previousFlashcard() {
  flashcardsState.currentIndex =
    (flashcardsState.currentIndex - 1 + flashcardsState.cards.length) %
    flashcardsState.cards.length
  showFlashcard()
}

function shuffleFlashcards() {
  // Fisher-Yates shuffle algorithm
  for (let i = flashcardsState.cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[flashcardsState.cards[i], flashcardsState.cards[j]] = [
      flashcardsState.cards[j],
      flashcardsState.cards[i],
    ]
  }
  flashcardsState.currentIndex = 0
  showFlashcard()
}

function markFlashcard(status) {
  const cardId = `${flashcardsState.currentUnit}-${flashcardsState.currentIndex}`

  if (status === 'known') {
    flashcardsState.known.add(cardId)
    flashcardsState.learning.delete(cardId)
  } else if (status === 'learning') {
    flashcardsState.learning.add(cardId)
    flashcardsState.known.delete(cardId)
  }

  localStorage.setItem(
    'flashcards_known',
    JSON.stringify([...flashcardsState.known]),
  )
  localStorage.setItem(
    'flashcards_learning',
    JSON.stringify([...flashcardsState.learning]),
  )

  updateFlashcardsStats()
  nextFlashcard()
}

function setupFlashcardsListeners() {
  const flashcard = document.getElementById('flashcard')
  if (flashcard) {
    flashcard.addEventListener('click', () => {
      const current = flashcard.style.transform || 'rotateY(0deg)'
      flashcard.style.transform = current.includes('180')
        ? 'rotateY(0deg)'
        : 'rotateY(180deg)'
    })
  }

  const backBtn = document.getElementById('flashcard-back')
  if (backBtn) backBtn.addEventListener('click', previousFlashcard)

  const knowBtn = document.getElementById('flashcard-know')
  if (knowBtn) knowBtn.addEventListener('click', () => markFlashcard('known'))

  const learningBtn = document.getElementById('flashcard-learning')
  if (learningBtn)
    learningBtn.addEventListener('click', () => markFlashcard('learning'))

  const nextBtn = document.getElementById('flashcard-next')
  if (nextBtn) nextBtn.addEventListener('click', nextFlashcard)

  const shuffleBtn = document.getElementById('flashcard-shuffle')
  if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleFlashcards)

  const unitSelector = document.getElementById('flashcards-unit-selector')
  if (unitSelector) {
    unitSelector.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        document
          .querySelectorAll('#flashcards-unit-selector button')
          .forEach((btn) => {
            btn.classList.remove('active')
            btn.style.background = ''
            btn.style.color = ''
            btn.style.borderColor = ''
          })
        e.target.classList.add('active')
        e.target.style.background = 'var(--aws-orange)'
        e.target.style.color = 'var(--aws-blue)'
        e.target.style.borderColor = 'var(--aws-orange)'
        flashcardsState.currentUnit = e.target.dataset.unit
        filterFlashcards()
        showFlashcard()
      }
    })
  }
}

// ============================================
// STUDY TABLE FUNCTIONALITY
// ============================================
const tableState = {
  data: [],
  filteredData: [],
  activeFilters: new Set(['all']),
  searchTerm: '',
}

function initStudyTable() {
  if (typeof flashcardsData === 'undefined') return

  tableState.data = flashcardsData
  tableState.filteredData = flashcardsData

  renderTableFilters()
  renderTable()
  setupTableListeners()
}

function renderTableFilters() {
  const container = document.getElementById('table-filters')
  if (!container) return

  const units = ['all', ...new Set(tableState.data.map((item) => item.unit))]
  container.innerHTML = units
    .map(
      (unit) => `
        <button class="secondary-btn ${unit === 'all' ? 'active' : ''}" data-unit="${unit}" style="border: 2px solid var(--aws-orange); ${unit === 'all' ? 'background: var(--aws-orange); color: var(--aws-blue);' : ''}">
            ${unit === 'all' ? '📚 All' : unit}
        </button>
    `,
    )
    .join('')
}

function renderTable() {
  const tbody = document.getElementById('table-body')
  if (!tbody) return

  if (tableState.filteredData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--text-secondary);">No results found</td></tr>'
    return
  }

  tbody.innerHTML = tableState.filteredData
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px;"><span style="background: var(--aws-orange); color: var(--aws-blue); padding: 4px 12px; border-radius: 15px; font-size: 0.85rem; font-weight: 600;">${item.unit}</span></td>
            <td style="padding: 12px; font-weight: 600;">${item.keyword}</td>
            <td style="padding: 12px; color: var(--aws-orange); font-weight: 700;">${item.service}</td>
            <td style="padding: 12px; color: var(--text-secondary);">${item.description}</td>
        </tr>
    `,
    )
    .join('')
}

function filterTable() {
  let filtered = tableState.data

  // Filter by unit
  if (!tableState.activeFilters.has('all')) {
    filtered = filtered.filter((item) =>
      tableState.activeFilters.has(item.unit),
    )
  }

  // Filter by search term
  if (tableState.searchTerm) {
    const term = tableState.searchTerm.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.keyword.toLowerCase().includes(term) ||
        item.service.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        (item.hint && item.hint.toLowerCase().includes(term)),
    )
  }

  tableState.filteredData = filtered
}

function setupTableListeners() {
  const searchBox = document.getElementById('table-search')
  if (searchBox) {
    searchBox.addEventListener('input', (e) => {
      tableState.searchTerm = e.target.value
      filterTable()
      renderTable()
    })
  }

  const filters = document.getElementById('table-filters')
  if (filters) {
    filters.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const unit = e.target.dataset.unit

        if (unit === 'all') {
          tableState.activeFilters = new Set(['all'])
          document.querySelectorAll('#table-filters button').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.unit === 'all')
            if (btn.dataset.unit === 'all') {
              btn.style.background = 'var(--aws-orange)'
              btn.style.color = 'var(--aws-blue)'
            } else {
              btn.style.background = ''
              btn.style.color = ''
            }
          })
        } else {
          tableState.activeFilters.delete('all')
          const allBtn = document.querySelector(
            '#table-filters [data-unit="all"]',
          )
          if (allBtn) {
            allBtn.classList.remove('active')
            allBtn.style.background = ''
            allBtn.style.color = ''
          }

          if (tableState.activeFilters.has(unit)) {
            tableState.activeFilters.delete(unit)
            e.target.classList.remove('active')
            e.target.style.background = ''
            e.target.style.color = ''
          } else {
            tableState.activeFilters.add(unit)
            e.target.classList.add('active')
            e.target.style.background = 'var(--aws-orange)'
            e.target.style.color = 'var(--aws-blue)'
          }

          if (tableState.activeFilters.size === 0) {
            tableState.activeFilters.add('all')
            if (allBtn) {
              allBtn.classList.add('active')
              allBtn.style.background = 'var(--aws-orange)'
              allBtn.style.color = 'var(--aws-blue)'
            }
          }
        }

        filterTable()
        renderTable()
      }
    })
  }
}

// ============================================
// GAME FUNCTIONALITY
// ============================================
const gameState = {
  selectedUnit: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  correct: 0,
  incorrect: 0,
  streak: 0,
  answered: false,
}

function initGame() {
  if (typeof flashcardsData === 'undefined') return

  renderGameUnits()
  setupGameListeners()
}

function renderGameUnits() {
  const container = document.getElementById('game-unit-selection')
  if (!container) return

  const unitCounts = {}
  flashcardsData.forEach((item) => {
    unitCounts[item.unit] = (unitCounts[item.unit] || 0) + 1
  })

  container.innerHTML = Object.entries(unitCounts)
    .map(
      ([unit, count]) => `
        <div class="unit-card" data-unit="${unit}" style="padding: 20px; border: 3px solid var(--aws-orange); border-radius: 12px; cursor: pointer; transition: all 0.3s; background: white;">
            <h3 style="font-size: 1.2rem; margin-bottom: 10px; color: var(--aws-blue);">${unit}</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">${count} questions</p>
        </div>
    `,
    )
    .join('')
}

function startGame() {
  if (!gameState.selectedUnit) {
    alert('Please select a unit first')
    return
  }

  const unitData = flashcardsData.filter(
    (item) => item.unit === gameState.selectedUnit,
  )
  gameState.questions = shuffleArray(unitData).slice(0, 10)

  gameState.currentQuestionIndex = 0
  gameState.score = 0
  gameState.correct = 0
  gameState.incorrect = 0
  gameState.streak = 0

  document.getElementById('game-setup').style.display = 'none'
  document.getElementById('game-active').style.display = 'block'
  document.getElementById('game-results').style.display = 'none'

  showGameQuestion()
}

function showGameQuestion() {
  if (gameState.currentQuestionIndex >= gameState.questions.length) {
    showGameResults()
    return
  }

  gameState.answered = false
  const question = gameState.questions[gameState.currentQuestionIndex]

  const scenarioText =
    question.hint ||
    `Which service would you use when you need: ${question.keyword}?`
  document.getElementById('game-scenario').innerHTML = scenarioText.replace(
    new RegExp(question.keyword, 'gi'),
    `<span style="color: var(--aws-orange); font-weight: 700; background: #fee2e2; padding: 2px 8px; border-radius: 5px;">${question.keyword}</span>`,
  )

  const wrongOptions = flashcardsData
    .filter(
      (item) =>
        item.service !== question.service &&
        item.unit === gameState.selectedUnit,
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const allOptions = shuffleArray([question, ...wrongOptions])

  document.getElementById('game-options').innerHTML = allOptions
    .map(
      (opt) => `
        <div class="game-option" data-service="${opt.service}" data-correct="${opt.service === question.service}" style="padding: 20px; border: 3px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.3s; text-align: center; background: white;">
            <div style="font-size: 1.2rem; font-weight: 700; color: var(--aws-blue); margin-bottom: 5px;">${opt.service}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">${opt.description.substring(0, 60)}...</div>
        </div>
    `,
    )
    .join('')

  document.getElementById('game-feedback').style.display = 'none'
  document.getElementById('game-next').style.display = 'none'

  document.getElementById('game-question-num').textContent =
    gameState.currentQuestionIndex + 1
  document.getElementById('game-score').textContent = gameState.score
  document.getElementById('game-streak').textContent = gameState.streak
}

function checkGameAnswer(selectedOption) {
  if (gameState.answered) return
  gameState.answered = true

  const isCorrect = selectedOption.dataset.correct === 'true'
  const question = gameState.questions[gameState.currentQuestionIndex]

  document.querySelectorAll('.game-option').forEach((opt) => {
    opt.style.pointerEvents = 'none'
    opt.style.opacity = '0.6'
    if (opt.dataset.correct === 'true') {
      opt.style.borderColor = '#10b981'
      opt.style.background = '#d1fae5'
      opt.style.opacity = '1'
    }
  })

  const feedback = document.getElementById('game-feedback')
  if (isCorrect) {
    selectedOption.style.borderColor = '#10b981'
    selectedOption.style.background = '#d1fae5'
    selectedOption.style.opacity = '1'
    gameState.correct++
    gameState.score += 10 + gameState.streak * 2
    gameState.streak++

    feedback.style.display = 'block'
    feedback.style.background = '#d1fae5'
    feedback.style.color = '#065f46'
    feedback.innerHTML = `<h3 style="margin-bottom: 10px;">🎉 Correct!</h3><p>${question.description}</p>`
  } else {
    selectedOption.style.borderColor = '#ef4444'
    selectedOption.style.background = '#fee2e2'
    selectedOption.style.opacity = '1'
    gameState.incorrect++
    gameState.streak = 0

    feedback.style.display = 'block'
    feedback.style.background = '#fee2e2'
    feedback.style.color = '#991b1b'
    feedback.innerHTML = `<h3 style="margin-bottom: 10px;">❌ Incorrect</h3><p>The correct answer is ${question.service}. ${question.description}</p>`
  }

  document.getElementById('game-score').textContent = gameState.score
  document.getElementById('game-streak').textContent = gameState.streak
  document.getElementById('game-next').style.display = 'block'
}

function nextGameQuestion() {
  gameState.currentQuestionIndex++
  showGameQuestion()
}

function showGameResults() {
  document.getElementById('game-active').style.display = 'none'
  document.getElementById('game-results').style.display = 'block'

  const accuracy =
    gameState.questions.length > 0
      ? Math.round((gameState.correct / gameState.questions.length) * 100)
      : 0

  document.getElementById('game-final-score').textContent = `${accuracy}%`
  document.getElementById('game-correct').textContent = gameState.correct
  document.getElementById('game-incorrect').textContent = gameState.incorrect
  document.getElementById('game-accuracy').textContent = `${accuracy}%`
}

function restartGame() {
  startGame()
}

function newGameSetup() {
  gameState.selectedUnit = null
  document.querySelectorAll('.unit-card').forEach((card) => {
    card.style.background = 'white'
    card.style.color = ''
  })
  document.getElementById('game-setup').style.display = 'block'
  document.getElementById('game-active').style.display = 'none'
  document.getElementById('game-results').style.display = 'none'
}

function setupGameListeners() {
  const unitSelection = document.getElementById('game-unit-selection')
  if (unitSelection) {
    unitSelection.addEventListener('click', (e) => {
      const card = e.target.closest('.unit-card')
      if (card) {
        document.querySelectorAll('.unit-card').forEach((c) => {
          c.style.background = 'white'
          c.style.color = ''
        })
        card.style.background = 'var(--aws-orange)'
        card.style.color = 'var(--aws-blue)'
        gameState.selectedUnit = card.dataset.unit
      }
    })
  }

  const startBtn = document.getElementById('game-start')
  if (startBtn) startBtn.addEventListener('click', startGame)

  const optionsContainer = document.getElementById('game-options')
  if (optionsContainer) {
    optionsContainer.addEventListener('click', (e) => {
      const option = e.target.closest('.game-option')
      if (option && !gameState.answered) {
        checkGameAnswer(option)
      }
    })
  }

  const nextBtn = document.getElementById('game-next')
  if (nextBtn) nextBtn.addEventListener('click', nextGameQuestion)

  const restartBtn = document.getElementById('game-restart')
  if (restartBtn) restartBtn.addEventListener('click', restartGame)

  const newBtn = document.getElementById('game-new')
  if (newBtn) newBtn.addEventListener('click', newGameSetup)
}

// Initialize new tabs when they become active
document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const target = mutation.target
        if (target.classList.contains('active')) {
          if (
            target.id === 'flashcards' &&
            flashcardsState.cards.length === 0
          ) {
            initFlashcards()
          } else if (
            target.id === 'study-table' &&
            tableState.data.length === 0
          ) {
            initStudyTable()
          } else if (
            target.id === 'game' &&
            !document.querySelector('.unit-card')
          ) {
            initGame()
          }
        }
      }
    })
  })

  document.querySelectorAll('.tab-content').forEach((tab) => {
    observer.observe(tab, { attributes: true })
  })
})
