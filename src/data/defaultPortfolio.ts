import { PortfolioData } from '../types/portfolio';

export const PERMANENT_PORTRAIT_URL = '/assets/aistudio/IMG-20260929-WA0007_3fbcb075.jpg';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: 'Muhammad Muazzam',
    roleLine:
      'Mathematics Student · Aspiring Data Analyst · Machine Learning & Database Systems Enthusiast',
    tagline: 'Transforming Mathematical Thinking into Intelligent, Data-Driven Solutions.',
    heroIntro:
      'I am a BS Mathematics student at CASPAM, Bahauddin Zakariya University (BZU), Multan, exploring how mathematical rigour, structured relational databases, data analytics, and machine learning combine to solve practical business and software challenges.',
    portraitUrl: PERMANENT_PORTRAIT_URL,
    portraitIsPlaceholder: false,
    location: 'Multan, Pakistan',
    email: 'muhammadmuazzam43@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/muhammad-muazzam-placeholder',
    githubUrl: 'https://github.com',
    githubUsername: '',
    careerVision:
      'To become a skilled professional working at the intersection of Mathematics, Data Science, Artificial Intelligence, Business Intelligence, and Software Development.',
    aboutParagraphs: [
      'My academic foundation begins in the BS Mathematics program at the Centre for Advanced Studies in Pure and Applied Mathematics (CASPAM), Bahauddin Zakariya University, Multan. Studying pure and applied mathematics has trained me to approach complex systems from first principles—identifying structure, constraints, and measurable patterns before writing a single line of code.',
      'Beyond theoretical proofs, I am deeply drawn to computational mathematics and mathematical modelling. Translating real-world operational bottlenecks—such as inventory holding costs, demand uncertainty, and replenishment timing—into solvable mathematical formulations is where theory proves its practical worth.',
      'Alongside mathematics, I actively study data analytics and business intelligence. Using Microsoft Excel, Power Query, Power BI, and SQL, I focus on turning raw operational records into clean analytical models, structured reporting views, and transparent visual summaries that support clear decision-making.',
      'My curiosity extends directly into machine learning and database-driven software engineering. Designing PostgreSQL schemas in pgAdmin, experimenting with regression and classification concepts in Python, and building end-to-end systems such as my FMCG Inventory Intelligence project allow me to connect mathematical reasoning with reliable software architecture.',
      'I view my current stage as a disciplined continuous learning journey: strengthening my analytical foundations, building honest and well-documented technical projects, and preparing to contribute to data-driven engineering and applied research teams.',
    ],
    goalsTitle: 'Where I Am Going',
    goals: [
      'Developing strong expertise in Data Analytics and structured business reporting.',
      'Learning advanced Machine Learning methods grounded in statistical theory.',
      'Applying Mathematics and optimization modelling to real-world business problems.',
      'Developing intelligent, reliable database-driven software architectures.',
      'Exploring Artificial Intelligence and modern predictive modelling workflows.',
      'Building practical technology solutions for supply chain and operational challenges.',
      'Growing into a professional Data Scientist and technology-oriented problem solver.',
    ],
    contactPrompt:
      'Open to internships, academic research collaborations, data analytics projects, and technology discussions.',
    uploadedCvName: undefined,
    uploadedCvDataUrl: undefined,
    uploadedCvUpdatedAt: undefined,
  },
  skills: [
    {
      id: 'programming',
      title: 'Programming',
      description: 'Core languages used for computational logic, scripting, and foundational problem solving.',
      skills: ['Python', 'C Programming'],
    },
    {
      id: 'mathematics',
      title: 'Mathematics',
      description: 'Formal quantitative reasoning applied to optimization, uncertainty, and structured problems.',
      skills: [
        'Mathematical Modelling',
        'Computational Mathematics',
        'Statistical Analysis',
        'Mathematical Problem Solving',
      ],
    },
    {
      id: 'database',
      title: 'Database Management',
      description: 'Relational data modelling, normalization, query design, and transactional structure.',
      skills: ['DBMS', 'SQL', 'Database Design', 'Data Management Structures'],
    },
    {
      id: 'analytics',
      title: 'Data Analytics',
      description: 'Transforming raw datasets into structured reports, visual insights, and KPI logic.',
      skills: [
        'Microsoft Excel',
        'Data Analysis',
        'Power Query',
        'Data Visualization',
        'Business Intelligence',
      ],
    },
    {
      id: 'ai',
      title: 'Artificial Intelligence',
      description: 'Foundational exploration of predictive algorithms and statistical learning.',
      skills: [
        'Machine Learning',
        'Regression and Classification',
        'Data-Driven Modelling',
        'AI Concepts',
      ],
    },
    {
      id: 'tools',
      title: 'Tools',
      description: 'Technical environments and platforms used across numerical, database, and BI workflows.',
      skills: ['MATLAB', 'PostgreSQL', 'pgAdmin', 'Power BI'],
    },
  ],
  projects: [
    {
      id: 'fmcg-inventory',
      slug: 'fmcg-inventory-intelligence',
      number: '01',
      title: 'FMCG Inventory Intelligence & Supply Chain Management System',
      subtitle: 'Database-Driven Operations & Analytical Planning Platform',
      category: 'Systems & SQL',
      statusLabel: 'Active Flagship Project · Schema & Core Modules in Progress',
      summary:
        'A database-driven inventory and supply chain management software project designed around practical Fast-Moving Consumer Goods (FMCG) challenges—spanning batch expiry, replenishment, procurement, and business intelligence.',
      overview:
        'Fast-Moving Consumer Goods businesses operate on tight margins, rapid stock turnover, and strict shelf-life constraints. This project architects a centralized relational database and operational intelligence interface in PostgreSQL to replace fragmented spreadsheets with unified stock visibility, batch-level expiry tracking, supplier coordination, and analytical replenishment logic.',
      heroImageUrl: '/src/assets/images/fmcg_inventory_system_1795361211915.jpg',
      visualType: 'fmcg',
      problemAreas: [
        'Overstocking tying up working capital and warehouse capacity',
        'Stockouts causing missed retail sales and broken service levels',
        'Poor inventory visibility across warehouses and distribution points',
        'Slow-moving inventory accumulation increasing holding costs',
        'Expiry management risks in perishable and date-sensitive batches',
        'Supplier management inconsistencies and untracked lead times',
        'Replenishment challenges driven by reactive manual ordering',
        'Warehouse management inefficiencies in receiving and dispatch tracking',
      ],
      coreModules: [
        'Inventory Management',
        'Supply Chain Management',
        'Procurement',
        'Warehouse Management',
        'Sales and POS',
        'Replenishment',
        'Analytics',
        'Demand Forecasting',
        'Business Intelligence',
      ],
      architectureLayers: [
        {
          layer: 'Data & Storage Layer',
          component: 'PostgreSQL Relational Engine (managed via pgAdmin)',
          responsibility:
            'Enforces 3NF relational integrity, batch-level expiry constraints, immutable stock movement logs, and indexed analytical views.',
        },
        {
          layer: 'Operational & Domain Logic',
          component: 'SQL Views, Triggers & Python Analytical Scripts',
          responsibility:
            'Computes stock-on-hand balances, FEFO (First-Expired, First-Out) dispatch priorities, reorder thresholds, and supplier lead-time summaries.',
        },
        {
          layer: 'Intelligence & Forecasting Layer',
          component: 'Mathematical EOQ / ROP Models & Regression Prototypes',
          responsibility:
            'Bridges transactional history with demand trend estimation and safety-stock calculations (planned expansion).',
        },
        {
          layer: 'Presentation & BI Layer',
          component: 'Operational Dashboard & Power BI Reporting Views',
          responsibility:
            'Surfaces low-stock alerts, near-expiry SKU queues, slow-moving stock ratios, and procurement status.',
        },
      ],
      databaseTables: [
        {
          tableName: 'products',
          purpose: 'Master SKU catalog with unit metrics, category classification, and shelf-life rules.',
          columns: [
            { name: 'product_id', type: 'SERIAL', constraint: 'PK' },
            { name: 'sku_code', type: 'VARCHAR(32)', constraint: 'UNIQUE NOT NULL' },
            { name: 'product_name', type: 'VARCHAR(140)', constraint: 'NOT NULL' },
            { name: 'category_id', type: 'INT', constraint: 'FK -> categories' },
            { name: 'reorder_point', type: 'INT', constraint: 'CHECK >= 0' },
          ],
          relationships: ['1:N -> product_batches', '1:N -> sales_line_items', 'N:1 -> categories'],
        },
        {
          tableName: 'product_batches',
          purpose: 'Tracks lot numbers, manufacturing dates, and expiry dates for FEFO inventory control.',
          columns: [
            { name: 'batch_id', type: 'SERIAL', constraint: 'PK' },
            { name: 'product_id', type: 'INT', constraint: 'FK -> products' },
            { name: 'warehouse_id', type: 'INT', constraint: 'FK -> warehouses' },
            { name: 'expiry_date', type: 'DATE', constraint: 'NOT NULL' },
            { name: 'qty_available', type: 'INT', constraint: 'CHECK >= 0' },
          ],
          relationships: ['N:1 -> products', 'N:1 -> warehouses', '1:N -> stock_movements'],
        },
        {
          tableName: 'suppliers',
          purpose: 'Stores vendor directory, contact metadata, and historical lead-time expectations.',
          columns: [
            { name: 'supplier_id', type: 'SERIAL', constraint: 'PK' },
            { name: 'supplier_name', type: 'VARCHAR(140)', constraint: 'NOT NULL' },
            { name: 'avg_lead_days', type: 'NUMERIC(5,2)', constraint: 'DEFAULT 7' },
            { name: 'is_active', type: 'BOOLEAN', constraint: 'DEFAULT TRUE' },
          ],
          relationships: ['1:N -> purchase_orders'],
        },
        {
          tableName: 'purchase_orders',
          purpose: 'Procurement lifecycle records from requisition to warehouse goods receipt.',
          columns: [
            { name: 'po_id', type: 'SERIAL', constraint: 'PK' },
            { name: 'supplier_id', type: 'INT', constraint: 'FK -> suppliers' },
            { name: 'warehouse_id', type: 'INT', constraint: 'FK -> warehouses' },
            { name: 'order_date', type: 'DATE', constraint: 'NOT NULL' },
            { name: 'status', type: 'VARCHAR(24)', constraint: 'NOT NULL' },
          ],
          relationships: ['N:1 -> suppliers', 'N:1 -> warehouses'],
        },
        {
          tableName: 'stock_movements',
          purpose: 'Append-only audit ledger capturing inward receipts, POS dispatches, and spoilage.',
          columns: [
            { name: 'movement_id', type: 'BIGSERIAL', constraint: 'PK' },
            { name: 'batch_id', type: 'INT', constraint: 'FK -> product_batches' },
            { name: 'movement_type', type: 'VARCHAR(20)', constraint: 'IN | OUT | EXPIRED' },
            { name: 'quantity_delta', type: 'INT', constraint: 'NOT NULL' },
            { name: 'recorded_at', type: 'TIMESTAMPTZ', constraint: 'DEFAULT NOW()' },
          ],
          relationships: ['N:1 -> product_batches'],
        },
        {
          tableName: 'sales_transactions',
          purpose: 'POS and wholesale dispatch header records linked to demand history.',
          columns: [
            { name: 'sale_id', type: 'BIGSERIAL', constraint: 'PK' },
            { name: 'warehouse_id', type: 'INT', constraint: 'FK -> warehouses' },
            { name: 'sold_at', type: 'TIMESTAMPTZ', constraint: 'NOT NULL' },
            { name: 'total_amount', type: 'NUMERIC(12,2)', constraint: 'CHECK >= 0' },
          ],
          relationships: ['N:1 -> warehouses', '1:N -> sales_line_items'],
        },
      ],
      featureMatrix: [
        {
          name: 'Relational Database Schema & Constraints (Products, Batches, Warehouses, Suppliers)',
          module: 'Database & Inventory',
          status: 'Implemented',
          notes: 'Designed in PostgreSQL / pgAdmin with foreign keys, check constraints, and batch indexing.',
        },
        {
          name: 'Batch-Level Expiry Tracking & FEFO Query Logic',
          module: 'Inventory & Expiry Control',
          status: 'Implemented',
          notes: 'SQL views flag batches approaching expiry windows to minimize spoilage.',
        },
        {
          name: 'Stock Movement Audit Ledger & Low-Stock Threshold Queries',
          module: 'Warehouse Management',
          status: 'Implemented',
          notes: 'Tracks inward/outward movements and compares active stock against reorder points.',
        },
        {
          name: 'Procurement & Purchase Order Lifecycle Tables',
          module: 'Procurement & Suppliers',
          status: 'Implemented',
          notes: 'Models vendor assignments, order statuses, and expected delivery windows.',
        },
        {
          name: 'Interactive Dashboard UI Prototype & Analytical Views',
          module: 'Analytics & BI',
          status: 'Implemented',
          notes: 'UI design structure for visualizing slow-moving items, expiry queues, and stock health.',
        },
        {
          name: 'Automated Demand Forecasting Engine (Time-Series / Regression)',
          module: 'Demand Forecasting',
          status: 'Planned',
          notes: 'Will consume historical sales_transactions records to project short-term SKU demand.',
        },
        {
          name: 'Real-Time POS Hardware Barcode Integration',
          module: 'Sales and POS',
          status: 'Planned',
          notes: 'Future integration layer for retail checkout scanning and automatic batch deduction.',
        },
        {
          name: 'Automated Replenishment Order Generation',
          module: 'Replenishment',
          status: 'Planned',
          notes: 'Will trigger draft purchase orders when projected stock drops below dynamic safety stock.',
        },
      ],
      technologies: ['PostgreSQL', 'pgAdmin', 'SQL', 'Python', 'Power BI', 'Database Design'],
      learningOutcomes: [
        'Translating messy real-world FMCG operations into normalized relational schemas without redundant anomalies.',
        'Understanding why batch-level granularity is essential for perishable inventory compared to aggregate SKU counts.',
        'Designing SQL analytical queries that directly answer business questions around stock aging and replenishment.',
        'Separating core transactional integrity from downstream BI reporting and predictive forecasting modules.',
      ],
      screenshots: [
        {
          id: 'fmcg-arch',
          title: 'System Data Pipeline & Architecture Overview',
          caption: 'End-to-end conceptual architecture connecting supplier ingestion, PostgreSQL core, warehouse flow, and BI alerts.',
          imageUrl: '/src/assets/images/fmcg_inventory_system_1795361211915.jpg',
        },
      ],
    },
    {
      id: 'inventory-math-modelling',
      slug: 'inventory-optimization-mathematical-modelling',
      number: '02',
      title: 'Inventory Optimization Through Mathematical Modelling',
      subtitle: 'Deterministic & Stochastic Formulations for Stock Control',
      category: 'Mathematics',
      statusLabel: 'Academic & Applied Modelling Study',
      summary:
        'An applied mathematical exploration demonstrating how calculus-based cost minimization, Economic Order Quantity (EOQ), reorder point equations, and sensitivity analysis guide smarter inventory decisions.',
      overview:
        'Businesses frequently swing between overstocking (high holding and spoilage cost) and understocking (lost sales and emergency procurement). Through mathematical modelling, these competing pressures can be expressed as explicit objective functions. By analyzing total inventory cost curves, derivatives, and lead-time demand variability, decision-makers gain transparent quantitative rules for how much to order and when to reorder.',
      visualType: 'eoq',
      methodologySteps: [
        'Formulate Annual Total Inventory Cost TC(Q) = (D / Q)·S + (Q / 2)·H combining ordering and holding costs.',
        'Apply first-order differentiation d(TC)/dQ = 0 and verify convexity via d²(TC)/dQ² > 0 to derive optimal order quantity Q* = √(2DS / H).',
        'Extend deterministic assumptions to include supplier lead time (L) and demand standard deviation (σ_d) for Safety Stock = Z · σ_d · √L.',
        'Evaluate sensitivity of total cost to deviations in order quantity and holding rate using MATLAB and Python.',
      ],
      technologies: ['Mathematical Modelling', 'MATLAB', 'Python', 'Statistical Analysis', 'Calculus & Optimization'],
      learningOutcomes: [
        'Seeing directly how classical differential calculus yields actionable operational formulas.',
        'Recognizing model assumptions—such as constant demand—and when stochastic safety stock adjustments are required.',
        'Quantifying why total cost curves are relatively flat near Q*, giving practical flexibility around supplier pack sizes.',
      ],
      screenshots: [],
    },
    {
      id: 'data-analytics-bi',
      slug: 'data-analytics-business-intelligence',
      number: '03',
      title: 'Data Analytics & Business Intelligence',
      subtitle: 'Excel, Power Query, SQL & Power BI Analytical Workflows',
      category: 'Analytics',
      statusLabel: 'Analytical Practice & Dashboard Templates',
      summary:
        'Structured data cleaning, transformation, and visual reporting exercises using Microsoft Excel, Power Query, SQL, and Power BI to surface operational patterns clearly.',
      overview:
        'Effective Business Intelligence begins long before charts appear on a screen—it starts with data hygiene, consistent grain definitions, and accurate measures. This portfolio track documents my analytical workflow: ingesting raw tabular exports into Power Query, shaping star-schema relationships, writing summary aggregations in SQL and Excel, and designing uncluttered dashboards that highlight variance rather than visual noise.',
      visualType: 'bi',
      methodologySteps: [
        'Data Ingestion & Profiling: Audit missing values, inconsistent SKU names, and date formats using Power Query.',
        'Data Shaping & Normalization: Separate fact transactions from dimension attributes (Product, Category, Time, Region).',
        'Metric Definition: Build transparent calculations for inventory turnover, aging buckets, and category contribution.',
        'Visual Communication: Select bar, line, and matrix tables aligned with decision questions rather than decorative gauges.',
      ],
      technologies: ['Microsoft Excel', 'Power Query', 'Power BI', 'SQL', 'Data Visualization'],
      learningOutcomes: [
        'Understanding the importance of clean data modelling before building BI visuals.',
        'Designing analytical tables with aligned numeric precision and clear category hierarchies.',
        'Structuring reproducible Power Query transformation steps for recurring operational reports.',
      ],
      screenshots: [],
    },
    {
      id: 'ml-explorations',
      slug: 'machine-learning-explorations',
      number: '04',
      title: 'Machine Learning Explorations',
      subtitle: 'Regression, Classification & Statistical Learning Foundations',
      category: 'Machine Learning',
      statusLabel: 'Educational Experiments & Conceptual Implementations',
      summary:
        'Educational implementations exploring linear regression, logistic classification, feature scaling, train-test evaluation, and the mathematical intuition behind predictive modelling.',
      overview:
        'Approaching machine learning from a BS Mathematics perspective makes algorithms far less mysterious: linear regression is an orthogonal projection and least-squares optimization problem, while classification boundaries rely on probability, loss minimization, and linear algebra. These educational explorations focus on understanding how models behave, generalize, and fail on structured tabular datasets.',
      visualType: 'ml',
      methodologySteps: [
        'Exploratory Data Analysis: Inspect feature distributions, correlation structure, and outliers before modelling.',
        'Regression Modelling: Fit ordinary least squares and inspect residual plots, R², and mean squared error.',
        'Binary Classification: Study logistic decision boundaries, threshold trade-offs, precision, and recall.',
        'Validation Discipline: Enforce strict train/test splits to evaluate generalization without data leakage.',
      ],
      technologies: ['Python', 'Machine Learning', 'Regression & Classification', 'Statistical Analysis', 'MATLAB'],
      learningOutcomes: [
        'Connecting linear algebra and multivariable calculus directly to gradient descent and parameter estimation.',
        'Evaluating model performance critically using validation splits and error metrics rather than training accuracy alone.',
        'Appreciating data quality and feature engineering as primary drivers of reliable predictive behaviour.',
      ],
      screenshots: [],
    },
  ],
  education: {
    id: 'bzu-bs-math',
    degree: 'BS Mathematics',
    institution: 'Bahauddin Zakariya University (BZU)',
    department: 'Centre for Advanced Studies in Pure and Applied Mathematics (CASPAM)',
    location: 'Multan, Pakistan',
    period: 'Ongoing Undergraduate Program',
    semester: 'Editable — Click "Edit Portfolio" to set your current semester (e.g., Semester 6)',
    academicAchievements: [
      'Pursuing formal undergraduate training in Pure and Applied Mathematics at CASPAM, BZU.',
      'Editable slot: Add verified Dean’s list honours, merit scholarships, or competition placements here.',
    ],
    relevantCoursework: [
      'Calculus & Analytical Geometry',
      'Linear Algebra & Matrix Computations',
      'Differential Equations & Mathematical Modelling',
      'Probability Theory & Mathematical Statistics',
      'Numerical Analysis & Computational Mathematics',
      'Discrete Mathematics & Logical Structures',
    ],
    academicProjects: [
      'FMCG Inventory Intelligence & Supply Chain Database Architecture (Independent Technical Project)',
      'Inventory Optimization Through Deterministic & Stochastic Mathematical Modelling',
      'Exploratory Regression & Classification Notebooks in Python',
    ],
    researchInterests: [
      'Applied Mathematical Modelling & Operations Research',
      'Statistical Learning & Predictive Analytics',
      'Database Systems & Business Intelligence Engineering',
      'Supply Chain Optimization for Emerging Markets',
    ],
  },
  achievements: [
    {
      id: 'ach-1',
      category: 'Project Milestone',
      title: 'Designed Relational Schema & Core Modules for FMCG Inventory Intelligence System',
      issuer: 'Independent Technical Project',
      date: 'Ongoing',
      description:
        'Architected a multi-table PostgreSQL database design covering SKU batches, expiry control, suppliers, purchase orders, and stock movement ledgers.',
      verified: true,
    },
    {
      id: 'ach-2',
      category: 'Academic Achievement',
      title: 'BS Mathematics Enrollment — CASPAM, Bahauddin Zakariya University',
      issuer: 'Bahauddin Zakariya University, Multan',
      date: 'Current Program',
      description:
        'Undertaking rigorous quantitative training in pure and applied mathematics alongside independent computing practice.',
      verified: true,
    },
    {
      id: 'ach-3',
      category: 'Technical Certification',
      title: 'Certification Slot (Placeholder — Add Verified Certificate)',
      issuer: 'Editable via Portfolio Editor',
      date: 'Pending Entry',
      description:
        'Reserved placeholder for verified SQL, Data Analytics, Power BI, or Machine Learning certifications with credential links.',
      verified: false,
      isPlaceholder: true,
    },
    {
      id: 'ach-4',
      category: 'Workshop',
      title: 'Workshops & Seminars Slot (Placeholder — Add Verified Attendance)',
      issuer: 'CASPAM / External Seminars',
      date: 'Pending Entry',
      description:
        'Reserved placeholder for academic seminars, mathematical workshops, or technical bootcamps attended.',
      verified: false,
      isPlaceholder: true,
    },
  ],
  timeline: [
    {
      id: 'exp-1',
      type: 'Software Development',
      title: 'FMCG Inventory Intelligence & Supply Chain System Design',
      context: 'Independent Software & Database Project',
      period: 'Current Focus',
      description:
        'Designing and iteratively building a database-backed inventory and supply chain intelligence solution addressing expiry risks, stockouts, procurement, and warehouse visibility.',
      focusAreas: ['PostgreSQL', 'pgAdmin', 'Database Design', 'Supply Chain Logic'],
    },
    {
      id: 'exp-2',
      type: 'Independent Research',
      title: 'Mathematical Modelling for Inventory Optimization',
      context: 'Applied Mathematics Exploration',
      period: 'Academic & Self-Directed',
      description:
        'Studying Economic Order Quantity (EOQ), reorder point derivations, and holding-versus-ordering cost trade-offs to bridge mathematical theory with operational software.',
      focusAreas: ['Mathematical Modelling', 'MATLAB', 'Optimization'],
    },
    {
      id: 'exp-3',
      type: 'Practical Experimentation',
      title: 'Data Analytics & Business Intelligence Workflows',
      context: 'Technical Learning Track',
      period: 'Ongoing Practice',
      description:
        'Practicing structured data cleaning, Power Query transformations, SQL analytical queries, and Power BI dashboard structuring.',
      focusAreas: ['Microsoft Excel', 'Power Query', 'Power BI', 'SQL'],
    },
    {
      id: 'exp-4',
      type: 'Technical Learning',
      title: 'Foundations of Machine Learning & Statistical Programming',
      context: 'Python & Quantitative Computing',
      period: 'Ongoing Practice',
      description:
        'Building conceptual familiarity with regression, classification, evaluation metrics, and data-driven modelling grounded in linear algebra and statistics.',
      focusAreas: ['Python', 'Regression & Classification', 'Statistical Analysis'],
    },
  ],
};
