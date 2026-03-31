// AWS services database with keywords and descriptions for CLF-C02 exam study
const flashcardsData = [
  // COMPUTE
  {
    unit: 'Compute',
    keyword: 'Virtual server',
    service: 'Amazon EC2',
    description:
      'Scalable virtual servers in the cloud. Full control over configuration.',
    hint: 'Need a server you can fully configure?',
  },
  {
    unit: 'Compute',
    keyword: 'Serverless computing',
    service: 'AWS Lambda',
    description:
      'Run code without provisioning servers. Pay only for execution time.',
    hint: 'Want to run code without managing servers?',
  },
  {
    unit: 'Compute',
    keyword: 'Automatic deployment / PaaS',
    service: 'AWS Elastic Beanstalk',
    description: 'Deploy and scale web applications automatically (PaaS).',
    hint: 'Deploy apps without worrying about infrastructure?',
  },
  {
    unit: 'Compute',
    keyword: 'Containers / Docker',
    service: 'Amazon ECS',
    description: 'Highly scalable Docker container orchestration service.',
    hint: 'Need to run Docker containers on AWS?',
  },
  {
    unit: 'Compute',
    keyword: 'Kubernetes',
    service: 'Amazon EKS',
    description: 'AWS-managed Kubernetes for container orchestration.',
    hint: 'Want Kubernetes without managing the control plane?',
  },
  {
    unit: 'Compute',
    keyword: 'Auto Scaling',
    service: 'AWS Auto Scaling',
    description: 'Automatically adjusts resource capacity based on demand.',
    hint: 'Need resources to scale automatically?',
  },
  {
    unit: 'Compute',
    keyword: 'Batch workload',
    service: 'AWS Batch',
    description: 'Efficiently run batch jobs at any scale.',
    hint: 'Need to process thousands of jobs efficiently?',
  },
  {
    unit: 'Compute',
    keyword: 'Simple / Lightweight server',
    service: 'Amazon Lightsail',
    description:
      'Easy-to-use and affordable virtual servers, storage and networking.',
    hint: 'Need something simple and cheap for small projects?',
  },

  // STORAGE
  {
    unit: 'Storage',
    keyword: 'Object storage',
    service: 'Amazon S3',
    description: 'Scalable, durable and low-cost object storage.',
    hint: 'Where to store files, backups, images, videos?',
  },
  {
    unit: 'Storage',
    keyword: 'Long-term archiving',
    service: 'S3 Glacier',
    description: 'Low-cost storage for long-term archiving and backup.',
    hint: "Need to store data that's rarely accessed?",
  },
  {
    unit: 'Storage',
    keyword: 'EC2 disk / Block storage',
    service: 'Amazon EBS',
    description: 'Block storage volumes for EC2 instances.',
    hint: 'What disk does an EC2 instance use?',
  },
  {
    unit: 'Storage',
    keyword: 'Shared file system / NFS',
    service: 'Amazon EFS',
    description: 'Elastic shared file system for Linux (NFS).',
    hint: 'Need a filesystem shared between multiple EC2?',
  },
  {
    unit: 'Storage',
    keyword: 'Physical mass data transfer',
    service: 'AWS Snowball',
    description: 'Physical device to transfer petabytes of data to AWS.',
    hint: 'How to move terabytes/petabytes without internet?',
  },
  {
    unit: 'Storage',
    keyword: 'Accelerated S3 transfer',
    service: 'S3 Transfer Acceleration',
    description:
      'Accelerates file transfers to S3 using CloudFront edge locations.',
    hint: 'How to upload files to S3 faster from far away?',
  },
  {
    unit: 'Storage',
    keyword: 'Automated backup',
    service: 'AWS Backup',
    description: 'Centralized service to automate and manage backups.',
    hint: 'How to centralize and automate all backups?',
  },
  {
    unit: 'Storage',
    keyword: 'Hybrid storage',
    service: 'AWS Storage Gateway',
    description: 'Connects on-premises storage with AWS cloud.',
    hint: 'How to connect local storage to AWS?',
  },

  // DATABASE
  {
    unit: 'Database',
    keyword: 'Relational database / SQL',
    service: 'Amazon RDS',
    description:
      'Managed relational databases (MySQL, PostgreSQL, SQL Server, etc).',
    hint: 'Need MySQL, PostgreSQL or SQL Server managed?',
  },
  {
    unit: 'Database',
    keyword: 'High-performance database',
    service: 'Amazon Aurora',
    description:
      'MySQL/PostgreSQL-compatible relational DB, 5x faster than standard.',
    hint: 'Need RDS with maximum performance?',
  },
  {
    unit: 'Database',
    keyword: 'NoSQL / Key-Value',
    service: 'Amazon DynamoDB',
    description:
      'Serverless NoSQL database, scalable with single-digit millisecond latency.',
    hint: 'Need a fast NoSQL DB without servers?',
  },
  {
    unit: 'Database',
    keyword: 'Data Warehouse / Analytics',
    service: 'Amazon Redshift',
    description:
      'Data warehouse for analyzing petabytes of data (BI workloads).',
    hint: 'Where to perform massive data analysis (BI)?',
  },
  {
    unit: 'Database',
    keyword: 'In-memory cache',
    service: 'Amazon ElastiCache',
    description:
      'In-memory cache (Redis or Memcached) to improve DB performance.',
    hint: 'How to speed up DB reads with caching?',
  },
  {
    unit: 'Database',
    keyword: 'Database migration',
    service: 'AWS Database Migration Service',
    description: 'Migrates databases to AWS quickly and securely.',
    hint: 'How to move an on-premise DB to AWS?',
  },
  {
    unit: 'Database',
    keyword: 'Graph database',
    service: 'Amazon Neptune',
    description: 'Fast and reliable graph database for connected data.',
    hint: 'Need to store complex relationships (graphs)?',
  },
  {
    unit: 'Database',
    keyword: 'Document database',
    service: 'Amazon DocumentDB',
    description: 'MongoDB-compatible document database, fully managed.',
    hint: 'Need MongoDB managed on AWS?',
  },

  // NETWORKING
  {
    unit: 'Networking',
    keyword: 'Virtual private network',
    service: 'Amazon VPC',
    description: 'Isolated and private virtual network within AWS.',
    hint: 'How to create a private network in AWS?',
  },
  {
    unit: 'Networking',
    keyword: 'CDN / Content delivery',
    service: 'Amazon CloudFront',
    description: 'Global content delivery network (CDN) with low latency.',
    hint: 'How to serve static content fast worldwide?',
  },
  {
    unit: 'Networking',
    keyword: 'DNS / Domain management',
    service: 'Amazon Route 53',
    description: 'Scalable and reliable DNS service with health checking.',
    hint: 'How to manage domains and DNS in AWS?',
  },
  {
    unit: 'Networking',
    keyword: 'Load balancer',
    service: 'Elastic Load Balancing',
    description:
      'Automatically distributes incoming traffic across multiple targets.',
    hint: 'How to distribute traffic among multiple servers?',
  },
  {
    unit: 'Networking',
    keyword: 'Dedicated private connection',
    service: 'AWS Direct Connect',
    description: 'Dedicated network connection from your datacenter to AWS.',
    hint: 'How to connect datacenter to AWS without public internet?',
  },
  {
    unit: 'Networking',
    keyword: 'VPN',
    service: 'AWS VPN',
    description:
      'Secure encrypted VPN connection between your network and AWS.',
    hint: 'How to securely connect your local network to AWS?',
  },
  {
    unit: 'Networking',
    keyword: 'REST API / HTTP',
    service: 'Amazon API Gateway',
    description: 'Create, publish and manage REST and WebSocket APIs.',
    hint: 'Where to create and manage REST APIs?',
  },
  {
    unit: 'Networking',
    keyword: 'Global network accelerator',
    service: 'AWS Global Accelerator',
    description: 'Improves availability and performance for global users.',
    hint: 'How to reduce latency for worldwide users?',
  },

  // SECURITY
  {
    unit: 'Security',
    keyword: 'Identity and access management',
    service: 'AWS IAM',
    description: 'Securely manage users, groups, roles and permissions.',
    hint: 'How to control who can do what in AWS?',
  },
  {
    unit: 'Security',
    keyword: 'Encryption keys',
    service: 'AWS KMS',
    description: 'Create and manage encryption keys centrally.',
    hint: 'Where to store and manage encryption keys?',
  },
  {
    unit: 'Security',
    keyword: 'Web application firewall',
    service: 'AWS WAF',
    description: 'Web application firewall protecting against common attacks.',
    hint: 'How to protect web app from SQL injection and XSS?',
  },
  {
    unit: 'Security',
    keyword: 'DDoS protection',
    service: 'AWS Shield',
    description: 'DDoS protection (Standard is free, Advanced is paid).',
    hint: 'How to protect against DDoS attacks?',
  },
  {
    unit: 'Security',
    keyword: 'Threat detection',
    service: 'Amazon GuardDuty',
    description: 'Intelligent threat detection using ML and anomaly detection.',
    hint: 'How to detect suspicious activity in your account?',
  },
  {
    unit: 'Security',
    keyword: 'Vulnerability scanning',
    service: 'Amazon Inspector',
    description:
      'Automated security assessment for EC2 instances and containers.',
    hint: 'How to find vulnerabilities in EC2?',
  },
  {
    unit: 'Security',
    keyword: 'Secrets management',
    service: 'AWS Secrets Manager',
    description: 'Securely store and rotate secrets, passwords and API keys.',
    hint: 'Where to securely store passwords and API keys?',
  },
  {
    unit: 'Security',
    keyword: 'SSL/TLS certificates',
    service: 'AWS Certificate Manager',
    description: 'Provision and manage free SSL/TLS certificates.',
    hint: 'How to get free HTTPS certificates?',
  },
  {
    unit: 'Security',
    keyword: 'Compliance reports',
    service: 'AWS Artifact',
    description: 'Access AWS compliance and security reports.',
    hint: 'Where to find compliance reports (ISO, SOC)?',
  },
  {
    unit: 'Security',
    keyword: 'User authentication',
    service: 'Amazon Cognito',
    description: 'Authentication and authorization for web and mobile apps.',
    hint: 'How to add user login/signup to your app?',
  },

  // MANAGEMENT & GOVERNANCE
  {
    unit: 'Management',
    keyword: 'Monitoring / Metrics',
    service: 'Amazon CloudWatch',
    description: 'Monitors resources, metrics, logs and creates alarms.',
    hint: 'Where to view metrics and logs of your resources?',
  },
  {
    unit: 'Management',
    keyword: 'Audit / API logging',
    service: 'AWS CloudTrail',
    description: 'Records all AWS API calls for auditing and governance.',
    hint: 'Who made what change in my AWS account?',
  },
  {
    unit: 'Management',
    keyword: 'Infrastructure as Code / IaC',
    service: 'AWS CloudFormation',
    description: 'Create and manage resources using templates (IaC).',
    hint: 'How to automate infrastructure creation?',
  },
  {
    unit: 'Management',
    keyword: 'Recommendations / Best practices',
    service: 'AWS Trusted Advisor',
    description: 'Analyzes your account and recommends improvements.',
    hint: 'Where to get optimization recommendations?',
  },
  {
    unit: 'Management',
    keyword: 'Multiple accounts',
    service: 'AWS Organizations',
    description: 'Centrally manage multiple AWS accounts.',
    hint: 'How to manage many AWS accounts together?',
  },
  {
    unit: 'Management',
    keyword: 'Resource inventory / Configuration',
    service: 'AWS Config',
    description: 'Records resource configurations and evaluates compliance.',
    hint: 'How to audit configuration of all resources?',
  },
  {
    unit: 'Management',
    keyword: 'Systems administration',
    service: 'AWS Systems Manager',
    description:
      'Manage and automate operational tasks on EC2 and on-premises.',
    hint: 'How to run commands on multiple servers?',
  },
  {
    unit: 'Management',
    keyword: 'AWS service status',
    service: 'AWS Health Dashboard',
    description: 'Shows AWS service status and personalized alerts.',
    hint: 'Where to check if AWS has issues?',
  },
  {
    unit: 'Management',
    keyword: 'Service catalog',
    service: 'AWS Service Catalog',
    description: 'Create and manage catalogs of approved services.',
    hint: 'How to create a catalog of pre-approved resources?',
  },
  {
    unit: 'Management',
    keyword: 'Configuration automation',
    service: 'AWS OpsWorks',
    description: 'Automate server configuration with Chef or Puppet.',
    hint: 'How to use Chef/Puppet on AWS?',
  },

  // BILLING & PRICING
  {
    unit: 'Billing & Pricing',
    keyword: 'Cost calculator',
    service: 'AWS Pricing Calculator',
    description: 'Estimate the cost of using AWS services.',
    hint: 'How to calculate how much my architecture will cost?',
  },
  {
    unit: 'Billing & Pricing',
    keyword: 'Cost analysis',
    service: 'AWS Cost Explorer',
    description: 'Visualize and analyze your AWS costs and usage.',
    hint: "Where to see what you're spending money on in AWS?",
  },
  {
    unit: 'Billing & Pricing',
    keyword: 'Budget alerts',
    service: 'AWS Budgets',
    description: 'Create alerts when costs exceed your budget.',
    hint: 'How to receive alerts if I exceed budget?',
  },
  {
    unit: 'Billing & Pricing',
    keyword: 'Consolidated billing',
    service: 'AWS Consolidated Billing',
    description:
      'Consolidate billing from multiple accounts for volume discounts.',
    hint: 'How to unify invoices from multiple accounts?',
  },
  {
    unit: 'Billing & Pricing',
    keyword: 'Reserved capacity',
    service: 'Reserved Instances',
    description: '1-3 year commitment to save up to 75% on EC2/RDS.',
    hint: "How to save on EC2 if you know you'll use it for years?",
  },
  {
    unit: 'Billing & Pricing',
    keyword: 'Spot / Interruptible instances',
    service: 'Spot Instances',
    description: 'EC2 instances with up to 90% discount, can be interrupted.',
    hint: 'How to get super cheap EC2 if you accept interruptions?',
  },
  {
    unit: 'Billing & Pricing',
    keyword: 'Savings plans',
    service: 'Savings Plans',
    description: 'Flexible commitment for hourly usage to save on Compute.',
    hint: 'Flexible alternative to Reserved Instances?',
  },

  // ANALYTICS & ML
  {
    unit: 'Analytics',
    keyword: 'Big Data processing',
    service: 'Amazon EMR',
    description: 'Process large amounts of data with Hadoop, Spark.',
    hint: 'Where to run Hadoop or Spark?',
  },
  {
    unit: 'Analytics',
    keyword: 'Search and analysis',
    service: 'Amazon OpenSearch',
    description: 'Search and analyze logs and data in real-time.',
    hint: 'How to perform advanced log searches?',
  },
  {
    unit: 'Analytics',
    keyword: 'Data Lake / SQL queries',
    service: 'Amazon Athena',
    description: 'Query data in S3 using SQL without servers.',
    hint: 'How to run SQL queries directly on S3?',
  },
  {
    unit: 'Analytics',
    keyword: 'Streaming data',
    service: 'Amazon Kinesis',
    description: 'Ingest and process real-time streaming data at scale.',
    hint: 'How to process millions of events in real-time?',
  },
  {
    unit: 'Machine Learning',
    keyword: 'Machine Learning platform',
    service: 'Amazon SageMaker',
    description: 'Build, train and deploy ML models at scale.',
    hint: 'Complete platform to create ML models?',
  },
  {
    unit: 'Machine Learning',
    keyword: 'Image recognition',
    service: 'Amazon Rekognition',
    description:
      'Image and video analysis with ML (facial detection, objects).',
    hint: 'How to detect faces or objects in images?',
  },
  {
    unit: 'Machine Learning',
    keyword: 'Chatbots / Conversational',
    service: 'Amazon Lex',
    description: 'Build conversational chatbots with AI.',
    hint: 'How to create an intelligent chatbot?',
  },

  // DEVELOPER TOOLS
  {
    unit: 'Developer Tools',
    keyword: 'Code repository / Git',
    service: 'AWS CodeCommit',
    description: 'Private Git repositories managed by AWS.',
    hint: 'Where to host Git repos on AWS?',
  },
  {
    unit: 'Developer Tools',
    keyword: 'Continuous integration / CI',
    service: 'AWS CodeBuild',
    description: 'Compile and test code automatically (CI).',
    hint: 'Where to build and test code automatically?',
  },
  {
    unit: 'Developer Tools',
    keyword: 'Continuous deployment / CD',
    service: 'AWS CodeDeploy',
    description: 'Automate deployments to EC2, Lambda, on-premises.',
    hint: 'How to automate application deployment?',
  },
  {
    unit: 'Developer Tools',
    keyword: 'Full CI/CD pipeline',
    service: 'AWS CodePipeline',
    description: 'Orchestrates entire CI/CD pipeline visually.',
    hint: 'How to create a complete CI/CD pipeline?',
  },

  // APPLICATION INTEGRATION
  {
    unit: 'App Integration',
    keyword: 'Message queues',
    service: 'Amazon SQS',
    description: 'Fully managed message queue to decouple applications.',
    hint: 'How to decouple services with queues?',
  },
  {
    unit: 'App Integration',
    keyword: 'Pub/Sub / Notifications',
    service: 'Amazon SNS',
    description: 'Pub/sub messaging service for push notifications.',
    hint: 'How to send notifications to multiple subscribers?',
  },
  {
    unit: 'App Integration',
    keyword: 'Workflow orchestration',
    service: 'AWS Step Functions',
    description: 'Coordinates multiple AWS services into visual workflows.',
    hint: 'How to orchestrate lambdas and services in a workflow?',
  },
  {
    unit: 'App Integration',
    keyword: 'Event-driven architecture',
    service: 'Amazon EventBridge',
    description: 'Serverless event bus for event-driven architectures.',
    hint: 'How to connect apps using events?',
  },

  // MIGRATION & TRANSFER
  {
    unit: 'Migration & Transfer',
    keyword: 'Server migration',
    service: 'AWS Application Migration Service',
    description:
      'Migrate physical/virtual servers to AWS (formerly CloudEndure).',
    hint: 'How to migrate on-premise servers to AWS?',
  },
  {
    unit: 'Migration & Transfer',
    keyword: 'Secure file transfer',
    service: 'AWS Transfer Family',
    description: 'Transfer files to S3 using SFTP, FTPS, FTP.',
    hint: 'How to transfer files via FTP/SFTP to S3?',
  },

  // GLOBAL INFRASTRUCTURE
  {
    unit: 'Global Infrastructure',
    keyword: 'Availability Zones',
    service: 'Availability Zones (AZs)',
    description: 'Isolated datacenters within a region for high availability.',
    hint: 'Separate datacenters within a region',
  },
  {
    unit: 'Global Infrastructure',
    keyword: 'Regions',
    service: 'AWS Regions',
    description: 'Geographic locations with multiple AZs (e.g., us-east-1).',
    hint: 'Geographic location of AWS datacenters',
  },
  {
    unit: 'Global Infrastructure',
    keyword: 'Edge Locations',
    service: 'Edge Locations',
    description: 'CloudFront cache points of presence worldwide.',
    hint: 'CloudFront cache points around the world',
  },

  // CLOUD CONCEPTS
  {
    unit: 'Cloud Concepts',
    keyword: 'High availability',
    service: 'Multi-AZ Deployment',
    description: 'Deploy resources across multiple AZs for redundancy.',
    hint: "How to ensure app doesn't fail if one datacenter goes down?",
  },
  {
    unit: 'Cloud Concepts',
    keyword: 'Elasticity / Scalability',
    service: 'Auto Scaling',
    description: 'Ability to automatically grow/shrink resources.',
    hint: 'Ability to adapt to demand automatically',
  },
  {
    unit: 'Cloud Concepts',
    keyword: 'Pay-as-you-go',
    service: 'Pay-as-you-go pricing',
    description: 'Only pay for resources you use, no upfront costs.',
    hint: 'Pricing model with no initial investment',
  },
  {
    unit: 'Cloud Concepts',
    keyword: 'Shared Responsibility Model',
    service: 'Shared Responsibility Model',
    description:
      'AWS manages security OF the cloud, you manage security IN the cloud.',
    hint: 'Who is responsible for what in security?',
  },
  {
    unit: 'Cloud Concepts',
    keyword: 'CapEx vs OpEx',
    service: 'OpEx (Operational Expenditure)',
    description:
      'Cloud = OpEx (operational expenses), On-premise = CapEx (capital investment).',
    hint: 'Cloud converts initial investment to monthly expense',
  },
]
