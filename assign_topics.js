const fs = require('fs');
const text = fs.readFileSync('README.md', 'utf8');
const questions = [];
const lines = text.split('\n');
let currentQuestion = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('### ')) {
        if (currentQuestion && currentQuestion.options.length > 0) questions.push(currentQuestion);
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
            if (isCorrect) currentQuestion.answerIndices.push(currentQuestion.options.length - 1);
        }
    }
}
if (currentQuestion && currentQuestion.options.length > 0) questions.push(currentQuestion);

function assignTopic(q) {
    const txt = (q.text + " " + q.options.join(" ")).toLowerCase();
    
    if (txt.includes('ec2') || txt.includes('lambda') || txt.includes('ecs') || txt.includes('elastic beanstalk') || txt.includes('compute') || txt.includes('auto scaling')) return 'Compute';
    if (txt.includes('s3') || txt.includes('ebs') || txt.includes('storage') || txt.includes('glacier') || txt.includes('efs') || txt.includes('snowball')) return 'Storage';
    if (txt.includes('rds') || txt.includes('dynamodb') || txt.includes('aurora') || txt.includes('database') || txt.includes('redshift') || txt.includes('elasticache')) return 'Database';
    if (txt.includes('vpc') || txt.includes('route 53') || txt.includes('cloudfront') || txt.includes('network') || txt.includes('direct connect')) return 'Networking';
    if (txt.includes('iam') || txt.includes('security') || txt.includes('kms') || txt.includes('waf') || txt.includes('shield') || txt.includes('macie') || txt.includes('inspector') || txt.includes('guardduty') || txt.includes('vulnerabilities') || txt.includes('compliance')) return 'Security';
    if (txt.includes('cloudwatch') || txt.includes('cloudtrail') || txt.includes('config') || txt.includes('trusted advisor') || txt.includes('organizations') || txt.includes('management') || txt.includes('governance')) return 'Management';
    if (txt.includes('cost') || txt.includes('pricing') || txt.includes('billing') || txt.includes('tco') || txt.includes('budget') || txt.includes('capex') || txt.includes('opex') || txt.includes('spend')) return 'Billing & Pricing';
    if (txt.includes('region') || txt.includes('availability zone') || txt.includes('edge location') || txt.includes('global infrastructure')) return 'Global Infrastructure';
    if (txt.includes('support') || txt.includes('concierge') || txt.includes('technical account manager') || txt.includes('tam')) return 'Support Services';
    
    return 'Cloud Concepts';
}

questions.forEach(q => q.topic = assignTopic(q));

fs.writeFileSync('questions.json', JSON.stringify(questions, null, 2));
console.log('Saved questions.json');
