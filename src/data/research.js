export const research = [
  {
    id: 'trustmyids',
    title: 'TrustMyIDS: A BERT-Based Intrusion Detection System for Network Security',
    shortTitle: 'TrustMyIDS',
    venue: 'IEEE ISAC3 · 2025',
    authors: ['Sankar Kumar Mridha', 'Nihar Ranjan Sahu', 'Ritwik Kumar Bholika'],
    summary: 'A study of how a fine-tuned BERT model can distinguish benign and malicious network packets.',
    methods: 'The researchers used packet word vectors from the balanced CyberAI Cup 2024 dataset. A pretrained BERT encoder learned context within the packet sequences, and a dense classification layer predicted whether traffic was benign or malicious.',
    findings: 'Table II reports 99.44% accuracy and F1, 99.28% precision, and 99.60% recall on the CyberAI Cup 2024 benchmark. The paper identifies validation across more real-world datasets as future work.',
    image: '/images/research/trustmyids.webp',
    imageAlt: '',
    sources: {
      'trustmyids-ieee': { label: 'IEEE Xplore', href: 'https://ieeexplore.ieee.org/document/11156784', external: true },
      'trustmyids-pdf': { label: 'Read PDF', href: '/research/trustmyids.pdf', external: true },
    },
  },
  {
    id: 'weather-prediction',
    title: 'An Empirical Study on Harmonising Classification Precision by Adopting a SMOTE-Based Data Balancing Technique for Weather Prediction',
    shortTitle: 'Weather Prediction with SMOTE',
    venue: 'SADCSS 2024 Proceedings · Chapter 4.2',
    authors: ['Ayushi Sarkar', 'Nihar Ranjan Sahu', 'Rajashree Dash'],
    summary: 'A comparison of six weather classifiers to see how balancing rare weather classes with SMOTE affects prediction quality.',
    methods: 'The researchers compared linear and Gaussian SVMs, random forest, logistic regression, k-nearest neighbours, and LSTM on the original and SMOTE-balanced versions of a five-class weather dataset. SMOTE generated synthetic examples of underrepresented conditions such as snow and drizzle.',
    findings: 'Random forest led the balanced test set with 84.4% accuracy and 84.56% F1. LSTM accuracy was 43.64% on the original test set and 71.99% in the balanced experiment. The effects of balancing varied across models.',
    image: '/images/research/weather-prediction.webp',
    imageAlt: 'SADCSS proceedings cover beside the title and authors of the weather prediction chapter',
    sources: {
      'weather-paper': { label: 'Read paper', href: 'https://github.com/exploreces/Weather-detection/blob/main/WD_full_paper_SADCSS.pdf', external: true },
      'weather-code': { label: 'GitHub', href: 'https://github.com/exploreces/Weather-detection', external: true },
    },
  },
];
