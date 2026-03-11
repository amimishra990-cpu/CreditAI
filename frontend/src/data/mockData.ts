// ===== Mock Data — Multi-Company Credit Appraisal System =====
// Realistic Indian companies with detailed financial and risk profiles

/* ─── Company Profiles ─── */
export const companies = {
    technosteel: {
        id: 'technosteel',
        name: 'TechnoSteel Pvt. Ltd.',
        cin: 'U27100MH2010PTC198765',
        industry: 'Steel Manufacturing',
        incorporated: '2010-06-15',
        headquarters: 'Mumbai, Maharashtra',
        employees: 3200,
        revenue: '₹ 4.8 Cr',
        profitMargin: '9.1%',
        loanLimit: '₹ 3.5 Cr',
        recommendedInterest: '12.8%',
        cashFlowStatus: 'Positive',
        litigationAlerts: 2,
        creditRating: 'BBB',
        annualRevenue: '₹ 4.8 Cr',
        loanRequested: '₹ 3.5 Cr',
        loanPurpose: 'Working Capital & Expansion',
        riskScore: 68,
        riskLevel: 'Moderate Risk',
        promoter: {
            name: 'Rajesh Mehta',
            role: 'Managing Director',
            photo: null,
            connectedEntities: [
                { name: 'Mehta Holdings', relation: 'Parent Company', type: 'holding' },
                { name: 'Prime InfraWorks', relation: 'Other Companies', type: 'related' },
                { name: 'Other Companies', relation: 'GST reporting', type: 'gst' },
                { name: 'Litigation XYZ', relation: 'Recent Litigation', type: 'litigation' },
            ],
        },
        promoterRisk: {
            score: 78,
            level: 'High Risk',
            litigationHistory: '2 cases',
            negativeNews: '4 articles',
            relatedCompanies: '3 undrstny',
            fraudProbability: '~95%',
            promoterReputation: 'Negative',
        },
        newsAlerts: [
            { text: 'Rajesh Mehta under investigation for bid-rigging', source: 'Ahect Q', date: 'Apr 17', sentiment: 'negative', icon: '⚠️' },
            { text: 'Infrastructure sector facing slow recovery', source: '', date: '', sentiment: 'neutral', icon: '📰' },
        ],
        financialQuarters: [
            { quarter: 'Q1 FY23', gstInvoices: '₹ $95.00', bankInflow: '₹22.90', anomalies: 'arrow-right' },
            { quarter: 'Q2 FY23', gstInvoices: '₹ $25.00', bankInflow: '₹29.00', anomalies: 'arrow-right' },
            { quarter: 'Q5 FY22', gstInvoices: '₹ $29.00', bankInflow: '₹29.00', anomalies: 'arrow-up' },
            { quarter: 'Q4 FY23', gstInvoices: '₹ $98.00', bankInflow: '₹29.00', anomalies: 'arrow-right' },
        ],
        riskFactors: [
            { name: 'Recent Litigation', detail: 'Ongoing bid-rigging case linked to director', severity: 'high' },
            { name: 'Cashflow Mismatch', detail: 'Higher cash deposits than GST reported', severity: 'medium' },
        ],
        riskSummary: {
            score: 68,
            level: 'Moderate Risk',
            decision: 'Conditionally Approve',
            loanDetails: '₹ 36.5 Cr at 12.8% interest',
            reasons: [
                'Cashflow higher than GST reported',
                'Director involved in litigation',
                'High negative sentiment in news',
            ],
        },
        earlyWarning: {
            documentPasser: true,
            financialAnalyser: true,
            promoterAnalyzer: true,
            financialAnalyserAlt: true,
            researchAgent: false,
            fraudRiskEngine: false,
        },
        agentConfidence: [
            { agent: 'Document Passer', confidence: 0.92 },
            { agent: 'Financial Analyzer', confidence: 0.85 },
            { agent: 'Research Agent', confidence: 0.78 },
            { agent: 'Fraud & Risk Engine', confidence: 0.71 },
        ],
    },

    relianceSteel: {
        id: 'relianceSteel',
        name: 'Reliance Steel Corp.',
        cin: 'U27200GJ2005PTC145678',
        industry: 'Steel & Alloys',
        incorporated: '2005-01-20',
        headquarters: 'Ahmedabad, Gujarat',
        employees: 5400,
        revenue: '₹ 12.3 Cr',
        profitMargin: '11.2%',
        loanLimit: '₹ 8.0 Cr',
        recommendedInterest: '10.5%',
        cashFlowStatus: 'Positive',
        litigationAlerts: 0,
        creditRating: 'A-',
        annualRevenue: '₹ 12.3 Cr',
        loanRequested: '₹ 8.0 Cr',
        loanPurpose: 'Capacity Expansion',
        riskScore: 28,
        riskLevel: 'Low Risk',
        promoter: {
            name: 'Vikram Patel',
            role: 'Chairman & MD',
            photo: null,
            connectedEntities: [
                { name: 'Patel Industries', relation: 'Parent Company', type: 'holding' },
                { name: 'Gujarat Alloys', relation: 'Subsidiary', type: 'related' },
            ],
        },
        promoterRisk: {
            score: 22,
            level: 'Low Risk',
            litigationHistory: '0 cases',
            negativeNews: '0 articles',
            relatedCompanies: '2 entities',
            fraudProbability: '~5%',
            promoterReputation: 'Positive',
        },
        newsAlerts: [
            { text: 'Reliance Steel bags ₹500 Cr defense order', source: 'ET', date: 'Mar 12', sentiment: 'positive', icon: '✅' },
            { text: 'Steel demand surge expected in H2 FY24', source: 'BS', date: 'Feb 28', sentiment: 'positive', icon: '📈' },
        ],
        financialQuarters: [
            { quarter: 'Q1 FY23', gstInvoices: '₹ 3.10', bankInflow: '₹3.25', anomalies: 'stable' },
            { quarter: 'Q2 FY23', gstInvoices: '₹ 3.40', bankInflow: '₹3.55', anomalies: 'stable' },
            { quarter: 'Q3 FY23', gstInvoices: '₹ 3.20', bankInflow: '₹3.30', anomalies: 'stable' },
            { quarter: 'Q4 FY23', gstInvoices: '₹ 3.60', bankInflow: '₹3.70', anomalies: 'stable' },
        ],
        riskFactors: [
            { name: 'Market Volatility', detail: 'Steel prices fluctuating due to global supply chain', severity: 'low' },
        ],
        riskSummary: {
            score: 28,
            level: 'Low Risk',
            decision: 'Approve',
            loanDetails: '₹ 8.0 Cr at 10.5% interest',
            reasons: [
                'Strong financials and cash flow',
                'Clean litigation record',
                'Positive market sentiment',
            ],
        },
        earlyWarning: {
            documentPasser: true,
            financialAnalyser: true,
            promoterAnalyzer: true,
            financialAnalyserAlt: true,
            researchAgent: true,
            fraudRiskEngine: true,
        },
        agentConfidence: [
            { agent: 'Document Passer', confidence: 0.97 },
            { agent: 'Financial Analyzer', confidence: 0.95 },
            { agent: 'Research Agent', confidence: 0.93 },
            { agent: 'Fraud & Risk Engine', confidence: 0.96 },
        ],
    },

    bharatTextiles: {
        id: 'bharatTextiles',
        name: 'Bharat Textiles Ltd.',
        cin: 'U17100TN2012PTC234567',
        industry: 'Textiles & Apparel',
        incorporated: '2012-09-05',
        headquarters: 'Coimbatore, Tamil Nadu',
        employees: 1800,
        revenue: '₹ 2.1 Cr',
        profitMargin: '6.8%',
        loanLimit: '₹ 1.5 Cr',
        recommendedInterest: '14.2%',
        cashFlowStatus: 'Negative',
        litigationAlerts: 5,
        creditRating: 'BB+',
        annualRevenue: '₹ 2.1 Cr',
        loanRequested: '₹ 1.5 Cr',
        loanPurpose: 'Debt Restructuring',
        riskScore: 82,
        riskLevel: 'High Risk',
        promoter: {
            name: 'Anand Krishnamurthy',
            role: 'Founder & CEO',
            photo: null,
            connectedEntities: [
                { name: 'Krishna Exports', relation: 'Related Entity', type: 'related' },
                { name: 'Chennai Finance Co.', relation: 'Debt Holder', type: 'holding' },
                { name: 'Tax Dispute TN-2023', relation: 'Active Litigation', type: 'litigation' },
            ],
        },
        promoterRisk: {
            score: 85,
            level: 'High Risk',
            litigationHistory: '5 cases',
            negativeNews: '7 articles',
            relatedCompanies: '4 entities',
            fraudProbability: '~78%',
            promoterReputation: 'Negative',
        },
        newsAlerts: [
            { text: 'Bharat Textiles faces labor strike at Coimbatore plant', source: 'Hindu', date: 'Mar 05', sentiment: 'negative', icon: '🔴' },
            { text: 'Textile exports decline 8% YoY', source: 'Mint', date: 'Feb 18', sentiment: 'negative', icon: '📉' },
        ],
        financialQuarters: [
            { quarter: 'Q1 FY23', gstInvoices: '₹ 0.48', bankInflow: '₹0.42', anomalies: 'down' },
            { quarter: 'Q2 FY23', gstInvoices: '₹ 0.52', bankInflow: '₹0.38', anomalies: 'down' },
            { quarter: 'Q3 FY23', gstInvoices: '₹ 0.45', bankInflow: '₹0.40', anomalies: 'down' },
            { quarter: 'Q4 FY23', gstInvoices: '₹ 0.55', bankInflow: '₹0.50', anomalies: 'stable' },
        ],
        riskFactors: [
            { name: 'Multiple Litigations', detail: '5 active cases including tax disputes', severity: 'high' },
            { name: 'Negative Cash Flow', detail: 'Outflows exceeding inflows for 3 quarters', severity: 'high' },
            { name: 'Labor Issues', detail: 'Ongoing strike at primary manufacturing unit', severity: 'medium' },
        ],
        riskSummary: {
            score: 82,
            level: 'High Risk',
            decision: 'Decline',
            loanDetails: '₹ 1.5 Cr at 14.2% interest',
            reasons: [
                'Multiple active litigations',
                'Negative cash flow trend',
                'High promoter fraud probability',
                'Labor unrest at primary unit',
            ],
        },
        earlyWarning: {
            documentPasser: true,
            financialAnalyser: false,
            promoterAnalyzer: false,
            financialAnalyserAlt: false,
            researchAgent: false,
            fraudRiskEngine: false,
        },
        agentConfidence: [
            { agent: 'Document Passer', confidence: 0.88 },
            { agent: 'Financial Analyzer', confidence: 0.45 },
            { agent: 'Research Agent', confidence: 0.35 },
            { agent: 'Fraud & Risk Engine', confidence: 0.29 },
        ],
    },

    sunrisePharma: {
        id: 'sunrisePharma',
        name: 'Sunrise Pharma Pvt. Ltd.',
        cin: 'U24200AP2008PTC178901',
        industry: 'Pharmaceuticals',
        incorporated: '2008-04-10',
        headquarters: 'Hyderabad, Telangana',
        employees: 4100,
        revenue: '₹ 7.6 Cr',
        profitMargin: '14.5%',
        loanLimit: '₹ 5.0 Cr',
        recommendedInterest: '11.0%',
        cashFlowStatus: 'Positive',
        litigationAlerts: 1,
        creditRating: 'A',
        annualRevenue: '₹ 7.6 Cr',
        loanRequested: '₹ 5.0 Cr',
        loanPurpose: 'R&D & New Product Launch',
        riskScore: 35,
        riskLevel: 'Low-Medium Risk',
        promoter: {
            name: 'Dr. Sanjay Reddy',
            role: 'Chairman & MD',
            photo: null,
            connectedEntities: [
                { name: 'Reddy Healthcare Trust', relation: 'Family Trust', type: 'holding' },
                { name: 'AP MedSupply', relation: 'Subsidiary', type: 'related' },
            ],
        },
        promoterRisk: {
            score: 30,
            level: 'Low Risk',
            litigationHistory: '1 case (minor)',
            negativeNews: '1 article',
            relatedCompanies: '2 entities',
            fraudProbability: '~12%',
            promoterReputation: 'Positive',
        },
        newsAlerts: [
            { text: 'Sunrise Pharma gets USFDA approval for generic drug', source: 'ET', date: 'Mar 10', sentiment: 'positive', icon: '✅' },
            { text: 'Pharma sector bullish on API manufacturing push', source: 'BS', date: 'Mar 01', sentiment: 'positive', icon: '📈' },
        ],
        financialQuarters: [
            { quarter: 'Q1 FY23', gstInvoices: '₹ 1.80', bankInflow: '₹1.95', anomalies: 'stable' },
            { quarter: 'Q2 FY23', gstInvoices: '₹ 1.92', bankInflow: '₹2.05', anomalies: 'stable' },
            { quarter: 'Q3 FY23', gstInvoices: '₹ 2.00', bankInflow: '₹2.10', anomalies: 'stable' },
            { quarter: 'Q4 FY23', gstInvoices: '₹ 1.88', bankInflow: '₹2.00', anomalies: 'stable' },
        ],
        riskFactors: [
            { name: 'Regulatory Risk', detail: 'Pending DCGI inspection for new facility', severity: 'low' },
        ],
        riskSummary: {
            score: 35,
            level: 'Low-Medium Risk',
            decision: 'Approve',
            loanDetails: '₹ 5.0 Cr at 11.0% interest',
            reasons: [
                'Strong financials with growing margins',
                'Clean promoter background',
                'Positive industry outlook',
            ],
        },
        earlyWarning: {
            documentPasser: true,
            financialAnalyser: true,
            promoterAnalyzer: true,
            financialAnalyserAlt: true,
            researchAgent: true,
            fraudRiskEngine: true,
        },
        agentConfidence: [
            { agent: 'Document Passer', confidence: 0.95 },
            { agent: 'Financial Analyzer', confidence: 0.92 },
            { agent: 'Research Agent', confidence: 0.90 },
            { agent: 'Fraud & Risk Engine', confidence: 0.94 },
        ],
    },
};

export const companyList = Object.values(companies);
export const companyIds = Object.keys(companies);

// Default active company
export const defaultCompanyId = 'technosteel';

/* ─── Legacy exports (for other pages that import these) ─── */
export const companyProfile = {
    name: companies.technosteel.name,
    cin: companies.technosteel.cin,
    industry: companies.technosteel.industry,
    incorporated: companies.technosteel.incorporated,
    headquarters: companies.technosteel.headquarters,
    employees: companies.technosteel.employees,
    annualRevenue: companies.technosteel.annualRevenue,
    loanRequested: companies.technosteel.loanRequested,
    loanPurpose: companies.technosteel.loanPurpose,
    creditRating: companies.technosteel.creditRating,
};

export const dashboardMetrics = [
    { id: 1, label: 'Applications in Pipeline', value: 24, trend: +12, icon: 'FileStack', color: 'blue' },
    { id: 2, label: 'Approved This Month', value: 8, trend: +25, icon: 'CheckCircle', color: 'green' },
    { id: 3, label: 'Rejected / On Hold', value: 3, trend: -15, icon: 'XCircle', color: 'red' },
    { id: 4, label: 'Active Risk Alerts', value: 5, trend: +40, icon: 'AlertTriangle', color: 'gold' },
];

export const recentApplications = [
    { id: 'APP-2024-001', company: 'TechnoSteel Pvt. Ltd.', amount: '₹ 3.5 Cr', status: 'Under Review', risk: 'Medium', date: '2024-12-15' },
    { id: 'APP-2024-002', company: 'Reliance Steel Corp.', amount: '₹ 8.0 Cr', status: 'Approved', risk: 'Low', date: '2024-12-14' },
    { id: 'APP-2024-003', company: 'Bharat Textiles Ltd.', amount: '₹ 1.5 Cr', status: 'Risk Flagged', risk: 'High', date: '2024-12-13' },
    { id: 'APP-2024-004', company: 'Sunrise Pharma Pvt. Ltd.', amount: '₹ 5.0 Cr', status: 'Approved', risk: 'Low', date: '2024-12-12' },
];

export const riskDistribution = [
    { name: 'Low Risk', value: 42, fill: '#10b981' },
    { name: 'Medium Risk', value: 35, fill: '#f59e0b' },
    { name: 'High Risk', value: 15, fill: '#ef4444' },
    { name: 'Critical', value: 8, fill: '#dc2626' },
];

export const pipelineData = [
    { month: 'Jul', received: 18, approved: 12, rejected: 3 },
    { month: 'Aug', received: 22, approved: 15, rejected: 4 },
    { month: 'Sep', received: 19, approved: 11, rejected: 5 },
    { month: 'Oct', received: 25, approved: 18, rejected: 3 },
    { month: 'Nov', received: 28, approved: 20, rejected: 4 },
    { month: 'Dec', received: 24, approved: 16, rejected: 5 },
];

export const uploadedDocuments = [
    { id: 1, name: 'GST_Returns_Q1_2024.pdf', category: 'GST Filing', size: '2.4 MB', status: 'analyzed', uploadedAt: '2024-12-15 09:30' },
    { id: 2, name: 'Bank_Statement_HDFC_2024.pdf', category: 'Bank Statement', size: '5.1 MB', status: 'analyzed', uploadedAt: '2024-12-15 09:32' },
    { id: 3, name: 'Annual_Report_2023-24.pdf', category: 'Annual Report', size: '12.8 MB', status: 'analyzed', uploadedAt: '2024-12-15 09:35' },
    { id: 4, name: 'Balance_Sheet_FY24.xlsx', category: 'Financial Report', size: '1.2 MB', status: 'processing', uploadedAt: '2024-12-15 10:10' },
    { id: 5, name: 'Litigation_Records.pdf', category: 'Legal Document', size: '3.7 MB', status: 'analyzed', uploadedAt: '2024-12-14 14:20' },
    { id: 6, name: 'GST_Returns_Q2_2024.pdf', category: 'GST Filing', size: '2.1 MB', status: 'queued', uploadedAt: '2024-12-15 11:00' },
];

export const documentAnalysis = {
    status: 'complete',
    extractedEntities: [
        { entity: 'Total Revenue (FY24)', value: '₹842.3 Cr', confidence: 0.96 },
        { entity: 'Net Profit (FY24)', value: '₹67.8 Cr', confidence: 0.94 },
        { entity: 'Total Liabilities', value: '₹312.5 Cr', confidence: 0.91 },
        { entity: 'Current Assets', value: '₹485.2 Cr', confidence: 0.93 },
        { entity: 'Debt-to-Equity Ratio', value: '1.42', confidence: 0.89 },
        { entity: 'Working Capital', value: '₹172.7 Cr', confidence: 0.92 },
        { entity: 'EBITDA Margin', value: '18.4%', confidence: 0.95 },
        { entity: 'Interest Coverage Ratio', value: '3.2x', confidence: 0.88 },
    ],
    keyFindings: [
        'Revenue growth of 14.2% year-over-year indicates healthy business expansion.',
        'Debt-to-equity ratio at 1.42 is within acceptable range for infrastructure sector.',
        'Working capital position is strong with current ratio of 1.55.',
        'EBITDA margins have improved by 2.1% compared to previous fiscal year.',
    ],
};

export const financialAnalysis = {
    status: 'complete',
    revenueTrend: [
        { year: 'FY19', revenue: 420, profit: 28 },
        { year: 'FY20', revenue: 385, profit: 18 },
        { year: 'FY21', revenue: 510, profit: 35 },
        { year: 'FY22', revenue: 625, profit: 48 },
        { year: 'FY23', revenue: 738, profit: 56 },
        { year: 'FY24', revenue: 842, profit: 68 },
    ],
    ratios: [
        { name: 'Current Ratio', value: 1.55, benchmark: 1.5, status: 'good' },
        { name: 'Quick Ratio', value: 1.12, benchmark: 1.0, status: 'good' },
        { name: 'Debt/Equity', value: 1.42, benchmark: 1.5, status: 'good' },
        { name: 'Interest Coverage', value: 3.2, benchmark: 2.5, status: 'good' },
        { name: 'Return on Equity', value: 0.156, benchmark: 0.15, status: 'good' },
        { name: 'Net Profit Margin', value: 0.081, benchmark: 0.08, status: 'warning' },
    ],
    gstCompliance: {
        filingRegularity: '98%',
        averageMonthlyTurnover: '₹70.2 Cr',
        gstPaymentTimeliness: 'On-time (23/24 months)',
        discrepancies: 1,
    },
    bankStatementHighlights: {
        avgMonthlyBalance: '₹24.5 Cr',
        avgMonthlyInflow: '₹72.8 Cr',
        avgMonthlyOutflow: '₹68.3 Cr',
        chequeBouncesPercent: '0.8%',
        emiRegularity: '100%',
    },
};

export const researchAnalysis = {
    status: 'complete',
    newsSentiment: [
        { date: '2024-12', positive: 8, negative: 2, neutral: 5 },
        { date: '2024-11', positive: 6, negative: 3, neutral: 4 },
        { date: '2024-10', positive: 7, negative: 1, neutral: 6 },
        { date: '2024-09', positive: 5, negative: 4, neutral: 3 },
        { date: '2024-08', positive: 9, negative: 1, neutral: 4 },
        { date: '2024-07', positive: 6, negative: 2, neutral: 5 },
    ],
    keyNews: [
        { title: 'TechnoSteel secures ₹250 Cr highway project in Maharashtra', sentiment: 'positive', date: '2024-12-10', source: 'Economic Times' },
        { title: 'Infrastructure sector sees 15% growth in Q3 FY24', sentiment: 'positive', date: '2024-12-05', source: 'Business Standard' },
        { title: 'Minor environmental compliance notice issued to TechnoSteel for Pune site', sentiment: 'negative', date: '2024-11-22', source: 'Mint' },
        { title: 'TechnoSteel bags Smart City project in Nagpur worth ₹180 Cr', sentiment: 'positive', date: '2024-11-15', source: 'Financial Express' },
        { title: 'Industry headwinds: Steel prices surge by 12%', sentiment: 'negative', date: '2024-10-28', source: 'LiveMint' },
    ],
    industryOutlook: 'Positive — Infrastructure sector to grow at 12-15% CAGR driven by govt. capex push under NIP.',
    litigationFlags: [
        { case: 'Bid-rigging investigation — Mumbai', status: 'Ongoing', severity: 'High', year: 2024 },
        { case: 'Environmental compliance notice', status: 'Pending', severity: 'Medium', year: 2024 },
    ],
};

export const promoterAnalysis = {
    status: 'complete',
    promoters: [
        {
            name: 'Rajesh Mehta',
            role: 'Managing Director & Founder',
            din: '01234567',
            experience: '22 years in steel industry',
            otherDirectorships: 3,
            cibilScore: 812,
            riskFlags: ['Bid-rigging case under investigation'],
            background: 'B.Tech (IIT Bombay), MBA (IIM Ahmedabad). Founded TechnoSteel in 2010.',
        },
        {
            name: 'Priya Sharma',
            role: 'Executive Director & CFO',
            din: '07654321',
            experience: '18 years in finance',
            otherDirectorships: 2,
            cibilScore: 785,
            riskFlags: ['Minor tax dispute (₹12L) — resolved in 2022'],
            background: 'CA, CFA. Previously VP Finance at Tata Steel.',
        },
        {
            name: 'Arun Kapoor',
            role: 'Independent Director',
            din: '09876543',
            experience: '30 years in banking & finance',
            otherDirectorships: 5,
            cibilScore: 798,
            riskFlags: [],
            background: 'Retired CGM, State Bank of India.',
        },
    ],
    overallPromoterRisk: 'Medium',
};

export const orchestratorResult = {
    overallRiskScore: 68,
    riskLevel: 'Moderate Risk',
    recommendation: 'Conditional Approval',
    confidenceScore: 0.82,
    confidenceBreakdown: [
        { agent: 'Document Passer', confidence: 0.92, weight: 0.25 },
        { agent: 'Financial Analyzer', confidence: 0.85, weight: 0.35 },
        { agent: 'Research Agent', confidence: 0.78, weight: 0.20 },
        { agent: 'Fraud & Risk Engine', confidence: 0.71, weight: 0.20 },
    ],
    keyInsights: [
        'Cashflow higher than GST reported',
        'Director involved in litigation',
        'High negative sentiment in news',
        'Industry outlook is positive with government infrastructure push',
    ],
    conditions: [
        'Resolution of pending litigation within 90 days',
        'Quarterly review of financial ratios and GST filing compliance',
        'Personal guarantee from MD Rajesh Mehta for 50% of the loan amount',
        'Collateral coverage of 1.5x through project assets',
    ],
    camSections: {
        companyOverview: 'TechnoSteel Pvt. Ltd. is a Mumbai-based steel manufacturing company incorporated in 2010.',
        financialSummary: 'Revenue of ₹4.8 Cr with 9.1% profit margin. Recommended interest at 12.8%.',
        riskAssessment: 'Overall risk assessed as Moderate (Score: 68/100). Key concerns include ongoing litigation and GST-cashflow mismatch.',
        loanRecommendation: 'Recommended for Conditional Approval of ₹3.5 Cr working capital facility.',
    },
};

export const earlyWarningAlerts = [
    {
        id: 1, type: 'Financial', severity: 'medium',
        title: 'Net Profit Margin Decline',
        description: 'Net profit margin has declined by 0.3% in Q3 compared to Q2.',
        timestamp: '2024-12-15 08:30', company: 'TechnoSteel Pvt. Ltd.', acknowledged: false,
    },
    {
        id: 2, type: 'Legal', severity: 'high',
        title: 'Bid-Rigging Investigation',
        description: 'Rajesh Mehta under investigation for bid-rigging in public infrastructure tenders.',
        timestamp: '2024-12-14 14:20', company: 'TechnoSteel Pvt. Ltd.', acknowledged: false,
    },
    {
        id: 3, type: 'Market', severity: 'low',
        title: 'Steel Price Increase',
        description: 'Steel prices have increased by 12% in Q3, impacting margins.',
        timestamp: '2024-12-13 10:15', company: 'Industry-wide', acknowledged: true,
    },
    {
        id: 4, type: 'Financial', severity: 'high',
        title: 'GST-Cashflow Mismatch',
        description: 'Cash deposits significantly higher than GST reported invoices for Q2.',
        timestamp: '2024-12-12 16:45', company: 'TechnoSteel Pvt. Ltd.', acknowledged: false,
    },
    {
        id: 5, type: 'News', severity: 'medium',
        title: 'Negative Press Coverage',
        description: '4 negative articles published about promoter in last 30 days.',
        timestamp: '2024-12-11 09:00', company: 'TechnoSteel Pvt. Ltd.', acknowledged: false,
    },
];

export const agentStatuses = {
    documentAgent: { status: 'complete', progress: 100, duration: '2m 34s' },
    financialAgent: { status: 'complete', progress: 100, duration: '3m 12s' },
    researchAgent: { status: 'complete', progress: 100, duration: '4m 48s' },
    promoterAgent: { status: 'complete', progress: 100, duration: '1m 56s' },
};
