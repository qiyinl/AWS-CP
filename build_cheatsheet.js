const fs = require('fs')
const path = require('path')

// 1. Read README.md
try {
  const readmeContent = fs.readFileSync('README.md', 'utf8')
  const questions = parseMarkdown(readmeContent)

  // 2. Generate HTML
  const html = generateHtml(questions)

  // 3. Write to file
  fs.writeFileSync('cheatsheet_static.html', html)
  console.log(
    `Generated cheatsheet_static.html with ${questions.length} questions.`,
  )
} catch (err) {
  console.error('Error:', err)
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
        if (isCorrect)
          currentQuestion.answerIndices.push(currentQuestion.options.length - 1)
      }
    }
  }
  if (currentQuestion && currentQuestion.options.length > 0) {
    currentQuestion.topic = assignTopic(currentQuestion)
    questions.push(currentQuestion)
  }
  return questions
}

function generateHtml(questions) {
  // Group by topic
  const grouped = {}
  for (const q of questions) {
    if (!grouped[q.topic]) grouped[q.topic] = []
    grouped[q.topic].push(q)
  }

  const sortedTopics = Object.keys(grouped).sort()

  let rows = ''
  for (const topic of sortedTopics) {
    rows += `
            <tr style="background-color: #e8ecef;">
                <td colspan="3" style="font-size: 1.1em; font-weight: bold; padding: 12px; color: #232F3E;">📚 ${topic}</td>
            </tr>
        `
    rows += grouped[topic]
      .map((q) => {
        const answers = q.answerIndices
          .map((i) => q.options[i])
          .join('<br><br>')
        return `
                <tr>
                    <td style="width: 15%; font-weight: bold; background-color: #f2f3f3;">${q.topic}</td>
                    <td class="key">${q.text}</td>
                    <td class="val">${answers}</td>
                </tr>
            `
      })
      .join('')
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AWS Cheat Sheet</title>
    <style>
        body { font-family: sans-serif; -webkit-print-color-adjust: exact; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
        th { background-color: #3E5164; color: white; }
        .key { width: 50%; font-weight: bold; color: #232F3E; }
        .val { width: 35%; color: #1d8102; font-weight: 500; }
        tr:nth-child(even) { background-color: #fcfcfc; }
        @page { margin: 0.5in; }
    </style>
</head>
<body>
    <h1 style="text-align:center; color:#FF9900;">AWS Cloud Practitioner Exam Cues</h1>
    <table>
        <thead>
            <tr>
                <th>Topic</th>
                <th>Question Cue</th>
                <th>Correct Answer(s)</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>
</body>
</html>`
}
