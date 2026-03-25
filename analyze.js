const fs = require('fs');

const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

const topicCounts = {};
questions.forEach(q => {
    topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
});

const total = questions.length;
console.log(`Total Questions: ${total}\n`);

// Map our topics roughly to CLF-C02 Domains
const domains = {
    "Domain 1: Cloud Concepts (Target: 24%)": ['Cloud Concepts', 'Global Infrastructure'],
    "Domain 2: Security and Compliance (Target: 30%)": ['Security'],
    "Domain 3: Cloud Technology and Services (Target: 34%)": ['Compute', 'Storage', 'Database', 'Networking', 'Management', 'Machine Learning', 'Analytics', 'Developer Tools', 'App Integration', 'Migration & Transfer'],
    "Domain 4: Billing, Pricing, and Support (Target: 12%)": ['Billing & Pricing', 'Support Services']
};

for (const [domainName, topicList] of Object.entries(domains)) {
    let domainCount = 0;
    console.log(`--- ${domainName} ---`);
    topicList.forEach(topic => {
        const count = topicCounts[topic] || 0;
        domainCount += count;
        if (count > 0) {
            console.log(`  ${topic}: ${count} questions (${((count/total)*100).toFixed(1)}%)`);
        }
    });
    console.log(`  TOTAL FOR DOMAIN: ${domainCount} questions (${((domainCount/total)*100).toFixed(1)}%)\n`);
}

